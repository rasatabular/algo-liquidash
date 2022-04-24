import os

from algosdk import mnemonic
from algofi.v1.client import AlgofiMainnetClient, AlgofiTestnetClient

# the seed phrase should be store in an environemnt variable, preferably
# outside of the repository
wallet_seed = os.environ['WALLET_SEED']
sender = mnemonic.to_public_key(wallet_seed)

# IS_MAINNET
# IS_MAINNET = True
IS_MAINNET = False
client = AlgofiMainnetClient(user_address=sender) if IS_MAINNET else AlgofiTestnetClient(user_address=sender)

# get a list of all the supported symbols
symbols = client.get_active_ordered_symbols()

def fetch_storage_accounts():
    storage_accounts = client.get_storage_accounts()
    return storage_accounts

# helper function to fetch the state of a single storage address
def fetch_storage_address_state_data(storage_address):

    storage_address_state = client.get_storage_state(storage_address)
    storage_address_data = {
        'storage_address': storage_address,
        'storage_state': storage_address_state
    }
    return storage_address_data

def fetch_market_collateral_factors(symbols):
    market_collateral_factors = {}
    for s in symbols:
        market = client.get_market(s)
        market_collateral_factors[s] = market.get_collateral_factor()
    return market_collateral_factors

def fetch_storage_address(address):
    storage_address = client.get_manager().get_storage_address(address)
    return storage_address

def get_client():
    return client
