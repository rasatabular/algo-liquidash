import os

from http import client
from utils.data_fetch import fetch_market_collateral_factors, fetch_storage_accounts, \
                        fetch_storage_address_state_data, get_client

from utils.data_manage import store_storage_addresses, store_storage_state, \
                        store_oracle_prices, store_market_collateral_factor

LOOP = os.environ.get("LOOP", "")

def compute_storage_account_health(state, symbols):

    borrow_usd_max = 0
    borrowed_usd = 0

    for symbol in symbols:
        borrow_usd_max = borrow_usd_max + state['storage_state'][symbol]['active_collateral_max_borrow_usd']
        borrowed_usd = borrowed_usd + state['storage_state'][symbol]['borrow_usd']

    percentage_borrowed = 0 if borrow_usd_max == 0 else borrowed_usd / borrow_usd_max

    account_health = {
        'borrow_usd_max': borrow_usd_max,
        'borrowed_usd': borrowed_usd,
        'percentage_borrowed': percentage_borrowed,
    }

    return account_health

def fetcher():

    print('Connect...')
    # get the client object for the requests to make
    client = get_client()

    # get a list of all the supported symbols
    symbols = client.get_active_ordered_symbols()

    # fetch price data
    print('Fetching prices...')
    prices = client.get_prices()
    store_oracle_prices(prices)

    # fetch collateral factor data for each market
    print('Fetching collateral factors for each market...')
    collateral_factors = fetch_market_collateral_factors(symbols)
    store_market_collateral_factor(collateral_factors)

    # fetch all the storate addresses and store them in the local DB
    print('Fetching a list of the storage accounts...')
    storage_accounts = fetch_storage_accounts()
    store_storage_addresses(storage_accounts)

    # fetch the state of all storage accounts
    print('Fetching the state of each storage account...')
    for addr in storage_accounts:
        storage_address_data = fetch_storage_address_state_data(addr)

        # compute the account health data and add the to
        # the storage_address_data dictionary
        account_health = compute_storage_account_health(storage_address_data, symbols)
        storage_address_data['storage_state']['account_health'] = account_health
        store_storage_state(storage_address_data)

if __name__ == '__main__':

    # if LOOP is provided as True or 1 then run the fetcher continiously
    if (LOOP == "True") or (LOOP == "1"):
        while (True):
            fetcher()
    else:
        fetcher()
