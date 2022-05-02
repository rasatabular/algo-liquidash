import os

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from utils.db import read_storage_addresses, read_storage_state
from utils.fetch import fetch_storage_address

from auth import router as auth_router

app = FastAPI()

# update origins appropriate to allow which domains can access the API
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", None)

origins = [
    "http://localhost",
    "http://localhost:3000",
]
origins.append(ALLOWED_HOSTS)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

class Wallet(BaseModel):
    address: str

@app.get('/')
def main():
    storage_addresses = read_storage_addresses()
    ret = []
    for addr in storage_addresses:
        storage_state_data = read_storage_state(addr)
        ret.append({
            'storage_address': addr,
            'state_data': storage_state_data,
        })
    ret.sort(key=lambda x: x['state_data']['account_health']['percentage_borrowed'], reverse=True)
    return ret

# route to search the storage state give a specific wallet address
@app.post('/search/')
def get_address_data(wallet: Wallet):
    try:
        # find the storage address from the wallet address
        storage_address = fetch_storage_address(wallet.address)
    except Exception:
        raise HTTPException(status_code=404, detail='Wallet not found')

    return storage_address
