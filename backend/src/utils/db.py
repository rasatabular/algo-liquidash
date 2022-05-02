# Utility function to store and retrieve data of the AlgoFi
# protocol stored in a local MongoDB database
import os

from pymongo import MongoClient

# connect to the docker container that is running an image of MongoDB
DB_USER = os.environ.get("DB_USER", "root")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "password")
DEV =  os.environ.get("DEV", "")
# for development purposes, connect through localhost
if DEV == "1":
    client = MongoClient('mongodb://root:password@localhost:7700/')
else:
    # for production
    client = MongoClient(f'mongodb://{DB_USER}:{DB_PASSWORD}@mongodb:27017/')

db=client.business

# store the list of storage addresses of the AlgoFi protocol to the local database
def store_storage_addresses(storage_addresses):
    try:
        result = db.storage_accounts.replace_one({},
            {
                'storage_addresses': storage_addresses
            },
            upsert=True)
        print('Result acked:', result.acknowledged)
    except Exception as e:
        print('ERROR;', e)

# read the list of storage addresses of the AlgoFi protocol from the local database
def read_storage_addresses():
    try:
        result = db.storage_accounts.find_one({})
        return result['storage_addresses']
    except Exception as e:
        print('ERROR;', e)

# store the state of a storage address of the AlgoFi protocol to the local database
def store_storage_state(state):
    try:
        result = db.storage_state.replace_one({
            'storage_address': state['storage_address']
        }, state, upsert=True)
        print('Result acked:', result.acknowledged)
    except Exception as e:
        print('ERROR;', e)

# store the state of a storage address of the AlgoFi protocol to the local database
def read_storage_state(storage_address):
    try:
        result = db.storage_state.find_one({'storage_address': storage_address})
        return result['storage_state']
    except Exception as e:
        print('ERROR;', e)

# store the USD prices of the assets after retrieving them from the AlgoFi oracle
def store_oracle_prices(prices):
    try:
        result = db.oracle_prices.replace_one({},
            {
                'prices': prices
            },
            upsert=True)
        print('Result acked:', result.acknowledged)
    except Exception as e:
        print('ERROR;', e)

# read the USD prices of the assets that came from the AlgoFi oracle
def read_oracle_prices():
    try:
        result = db.oracle_prices.find_one({})
        return result['prices']
    except Exception as e:
        print('ERROR;', e)

# store the collateral factor for each market
# More about the collateral factor on the AlgoFi docs:
# https://docs.algofi.org/algofi-lending/collateral-factor
def store_market_collateral_factor(market_collateral_factor):
    try:
        result = db.market_collateral_factor.replace_one({},
            {
                'market_collateral_factor': market_collateral_factor
            },
            upsert=True)
        print('Result acked:', result.acknowledged)
    except Exception as e:
        print('ERROR;', e)

# read the collateral factor for each market that is stored in the local DB
# More about the collateral factor on the AlgoFi docs:
# https://docs.algofi.org/algofi-lending/collateral-factor
def read_market_collateral_factor():
    try:
        result = db.market_collateral_factor.find_one({})
        return result['market_collateral_factor']
    except Exception as e:
        print('ERROR;', e)

def store_user_auth(user_auth):

    # do not allow existing user to enter new registration details
    if is_user_in_db(user_auth['username']):
        return False

    try:
        result = db.user_auth.insert_one(user_auth)
        print('User auth store acked:', result.acknowledged)
    except Exception as e:
        print('ERROR;', e)

def read_user_auth(username):
    try:
        result = db.user_auth.find_one({'username': username})
        return result
    except Exception as e:
        print('ERROR;', e)

def is_user_in_db(username):
    try:
        result = db.user_auth.count_documents({'username': username})
        return (result > 0)
    except Exception as e:
        print('ERROR;', e)

def read_all_users():
    try:
        result = db.user_auth.find({})
        return result
    except Exception as e:
        print('ERROR;', e)


def add_watched_storage_account(username, storage_account):

    if is_user_watching_storage_account(username, storage_account):
        return False

    try:
        result = db.account_watch.insert_one({
            'username': username,
            'storage_account': storage_account,
        })
        print('Add account to watch acked:', result.acknowledged)
    except Exception as e:
        print('ERROR;', e)

def remove_watched_storage_account(username, storage_account):

    if not is_user_watching_storage_account(username, storage_account):
        return False

    try:
        result = db.account_watch.delete_one({
            'username': username,
            'storage_account': storage_account,
        })
        print('Remove account to watch acked:', result.acknowledged)
    except Exception as e:
        print('ERROR;', e)

def is_user_watching_storage_account(username, storage_account):
    try:
        result = db.account_watch.count_documents({
            'username': username,
            'storage_account': storage_account,
        })
        return (result > 0)
    except Exception as e:
        print('ERROR;', e)

def get_watched_storage_account(username):
    try:
        result = db.account_watch.find({'username': username})
        return result
    except Exception as e:
        print('ERROR;', e)
