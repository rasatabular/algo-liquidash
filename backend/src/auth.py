from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel

from jose import JWTError, jwt
from passlib.context import CryptContext

from utils.db import store_user_auth, read_user_auth, is_user_in_db, \
                    add_watched_storage_account, remove_watched_storage_account, \
                    get_watched_storage_account, read_storage_state

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class User(BaseModel):
    username: str
    disabled: Optional[bool] = False

class UserInDB(User):
    hashed_password: str


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.get('/testing')
def teseting():
    return {'this is': 'test'}

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(username: str):
    user_auth_data = read_user_auth(username)
    if user_auth_data:
        return UserInDB(**user_auth_data)
    return None

def authenticate_user(username: str, password: str):
    user = get_user(username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

@router.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return current_user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=5)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


def add_new_user(username: str, hashed_password: str):
    data = {
        'username': username,
        'hashed_password': hashed_password,
    }
    new_user = UserInDB(**data)
    store_user_auth(vars(new_user))

@router.post('/register', response_model=Token)
async def register_new_user(form_data: OAuth2PasswordRequestForm = Depends()):
    # if there is no username or password provided
    if not form_data.username or not form_data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide emain and password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # check if the user has already an account
    if is_user_in_db(form_data.username):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has an account",
            headers={"WWW-Authenticate": "Bearer"},
        )

    hashed_password = get_password_hash(form_data.password)
    add_new_user(form_data.username, hashed_password)

    return await login_for_access_token(form_data)

class StorageAccount(BaseModel):
    address: str

@router.post('/watch/add')
def add_account_to_watch(storage_account: StorageAccount,
                        current_user: User = Depends(get_current_active_user)):

    try:
        add_watched_storage_account(current_user.username, storage_account.address)
    except Exception:
        raise HTTPException(status_code=404, detail='Failed adding account to watch')

    return get_accounts_watching(current_user)

@router.post('/watch/remove')
def remove_account_to_watch(storage_account: StorageAccount,
                        current_user: User = Depends(get_current_active_user)):

    try:
        remove_watched_storage_account(current_user.username, storage_account.address)
    except Exception:
        raise HTTPException(status_code=404, detail='Failed adding account to watch')

    return get_accounts_watching(current_user)

@router.get('/watch')
def get_accounts_watching(current_user: User = Depends(get_current_active_user)):

    try:
        storage_addresses = get_watched_storage_account(current_user.username)
    except Exception:
        raise HTTPException(status_code=404, detail='Failed adding account to watch')

    ret = []
    for doc in storage_addresses:
        storage_state_data = read_storage_state(doc['storage_account'])
        ret.append({
            'storage_address': doc['storage_account'],
            'state_data': storage_state_data,
        })

    return ret
