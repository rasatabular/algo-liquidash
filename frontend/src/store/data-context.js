// define a context for sharing and updating data across components
// without having to use props
import { createContext, useState } from "react";

const DataContext = createContext({
  data: [],
  watchedData: [],
  storageAddress: "",
  setData: (newData) => { },
  setWatchedData: (data) => { },
  setStorageAddress: (newStorageAddress) => { },
});

export function DataContextProvider(props) {

  const [currentData, setCurrentData] = useState([]);
  const [currentWatchedData, setCurrentWatchedData] = useState([]);
  const [currentStorageAddress, setCurrentStorageAddress] = useState("");

  function setData(newData) {
    setCurrentData(newData);
  }

  function setStorageAddress(newStorageAddress) {
    setCurrentStorageAddress(newStorageAddress);
  }

  function setWatchedData(data) {
    setCurrentWatchedData(data);
  }

  const context = {
    data: currentData,
    watchedData: currentWatchedData,
    storageAddress: currentStorageAddress,
    setData: setData,
    setWatchedData: setWatchedData,
    setStorageAddress: setStorageAddress,
  }

  return (
    <DataContext.Provider value={context}>
      {props.children}
    </DataContext.Provider>
  )
}

export default DataContext;
