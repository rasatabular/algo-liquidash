import { useEffect, useContext } from "react";

import StorageAccountData from "./StorageAccountData";

import DataContext from "../store/data-context";


function StorageAccountDataList() {

  const dataCtx = useContext(DataContext);

  // refresh fetched data every minute
  const dataRefreshRate = 60000;

  function fetchData() {
    let url = process.env.REACT_APP_DOMAIN
    fetch(url).then(res => {
      console.log(res);
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

  return (
    <div>
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
          index={index}
        />
      ))}
      {!dataToDisplay && <div>There are no data to display</div>}
    </div >
  )
}

export default StorageAccountDataList;
