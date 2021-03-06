// Search bar used to search for a specific wallet address
import { useRef, useContext } from 'react';

import DataContext from '../store/data-context';

function SearchWallet() {

  const walletToSearchRef = useRef("");

  const dataCtx = useContext(DataContext);

  function submitHandler(event) {
    event.preventDefault();

    const walletAddress = walletToSearchRef.current.value;

    // if there is a string provided in the search bar then make
    // a POST request with the provided data
    if (walletAddress) {

      let url = process.env.REACT_APP_DOMAIN
      fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          address: walletAddress
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => {
        if (res.ok) {
          return res.json()
        } else {
          throw new Error("Data Not Found");
        }
      }).then(data => {
        dataCtx.setStorageAddress(data);
      }).catch(err => {
        dataCtx.setStorageAddress(null);
      });

    } else {
      dataCtx.setStorageAddress("");
    }

  }

  return (
    <div className='mb-5'>
      <form onSubmit={submitHandler}>
        <div className='input-group'>
          <input
            type="search"
            className='form-control'
            placeholder='Enter wallet address...'
            name="address"
            id="address"
            ref={walletToSearchRef}
          />
          <button type="submit" className="btn btn-outline-primary">Search Wallet</button>
        </div>
      </form >
    </div >
  )
}

export default SearchWallet;
