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
    client = MongoClient('mongodb://root:password@localhost:8080/')
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
        print(e)

# read the list of storage addresses of the AlgoFi protocol from the local database
def read_storage_addresses():
    try:
        result = db.storage_accounts.find_one({})
        return result['storage_addresses']
    except Exception as e:
        print(e)

# store the state of a storage address of the AlgoFi protocol to the local database
def store_storage_state(state):
    try:
        result = db.storage_state.replace_one({
            'storage_address': state['storage_address']
        }, state, upsert=True)
        print('Result acked:', result.acknowledged)
    except Exception as e:
        print(e)

# store the state of a storage address of the AlgoFi protocol to the local database
def read_storage_state(storage_address):
    try:
        result = db.storage_state.find_one({'storage_address': storage_address})
        return result['storage_state']
    except Exception as e:
        print(e)

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
        print(e)

# read the USD prices of the assets that came from the AlgoFi oracle
def read_oracle_prices():
    try:
        result = db.oracle_prices.find_one({})
        return result['prices']
    except Exception as e:
        print(e)

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
        print(e)

# read the collateral factor for each market that is stored in the local DB
# More about the collateral factor on the AlgoFi docs:
# https://docs.algofi.org/algofi-lending/collateral-factor
def read_market_collateral_factor():
    try:
        result = db.market_collateral_factor.find_one({})
        return result['market_collateral_factor']
    except Exception as e:
        print(e)
