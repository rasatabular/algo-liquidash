import { useEffect, useContext } from "react";

import StorageAccountData from "./StorageAccountData";

import AuthContext from "../store/auth-context";
import DataContext from "../store/data-context";

function WatchedStorageAccountDataList() {

  const dataCtx = useContext(DataContext);
  const authCtx = useContext(AuthContext);

  // refresh fetched data every minute
  const dataRefreshRate = 60000;

  function fetchData(token) {
    let url = process.env.REACT_APP_DOMAIN + '/watch'
    fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + token,
      }
    }).then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then(data => {
          let errorMessage = 'Authentication Failed';
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
          throw new Error(errorMessage);
        })
      }
    }).then(data => {
      dataCtx.setWatchedData(data);
    }).catch(err => {
      dataCtx.setWatchedData([]);
      console.log(err);
    });
  }

  useEffect(() => {
    fetchData(authCtx.token);
    const refreshData = setInterval(() => {
      fetchData(authCtx.token);
    }, dataRefreshRate);
    return () => clearInterval(refreshData);
  }, [authCtx.token]);

  // function to remove one of the storage addresses from the watch list
  function removeWatchedHandler(address) {
    let url = process.env.REACT_APP_DOMAIN + '/watch/remove'
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        'address': address
      }),
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authCtx.token,
      }
    }).then(res => {
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then(data => {
          let errorMessage = 'Authentication Failed';
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
          throw new Error(errorMessage);
        })
      }
    }).then(data => {
      dataCtx.setWatchedData(data);
    }).catch(err => {
      console.log(err);
    });
  }

  // if there are no data to display, then show a warning message
  const dataToDisplay = dataCtx.watchedData.length > 0;

  return (
    <div>
      <h4>Watched Accounts:</h4>
      <div className="border mb-5 p-3">

        {dataToDisplay && dataCtx.watchedData.filter(accountData => {

          // if there is no searched storage address then return all the addresses
          // otherwise find only the storage address that matches the one on
          // the search bar
          if (dataCtx.storageAddress === "") {
            return accountData;
          } else if (accountData.storage_address === dataCtx.storageAddress) {
            return accountData;
          }
        }).map((accountData, index) => (
          <StorageAccountData
            key={`watched-${accountData.storage_address}-${index}`}
            account={accountData.storage_address}
            state={accountData.state_data}
            prefix="watched"
            watchHandler={removeWatchedHandler}
            watchButtonText="Unwatch"
          />
        ))}
        {!dataToDisplay && <div>There are no data to display</div>}
      </div>
    </div >
  )
}

export default WatchedStorageAccountDataList;
