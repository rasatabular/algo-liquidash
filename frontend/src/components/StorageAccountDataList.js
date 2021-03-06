import { useEffect, useContext } from "react";

import StorageAccountData from "./StorageAccountData";

import DataContext from "../store/data-context";
import AuthContext from "../store/auth-context";

function StorageAccountDataList() {

  const dataCtx = useContext(DataContext);
  const authCtx = useContext(AuthContext);

  // refresh fetched data every minute
  const dataRefreshRate = 60000;

  function fetchData() {
    let url = process.env.REACT_APP_DOMAIN
    fetch(url).then(res => {
      if (res.ok) {
        return res.json();
      }
    }).then(data => {
      dataCtx.setData(data);
    }).catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
    fetchData();
    const refreshData = setInterval(() => {
      fetchData();
    }, dataRefreshRate);
    return () => clearInterval(refreshData);
  }, []);

  // if there are no data to display, then show a warning message
  const dataToDisplay = dataCtx.data.length > 0;

  function addWatchedHandler(address) {
    let url = process.env.REACT_APP_DOMAIN + '/watch/add'
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

  return (
    <div>
      <h4>All Accounts:</h4>
      <div className="border mb-5 p-3">
        {dataToDisplay && dataCtx.data.filter(accountData => {

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
            key={accountData.storage_address}
            account={accountData.storage_address}
            state={accountData.state_data}
            prefix=""
            watchHandler={addWatchedHandler}
            watchButtonText="Watch"
          />
        ))}
        {!dataToDisplay && <div>There are no data to display</div>}
      </div>
    </div>
  )
}

export default StorageAccountDataList;
