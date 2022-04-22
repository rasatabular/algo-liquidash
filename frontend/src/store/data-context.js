// define a context for sharing and updating data across components
// without having to use props
import { createContext, useState } from "react";

const DataContext = createContext({
  data: [],
  storageAddress: "",
  setData: (newData) => { },
  setStorageAddress: (newStorageAddress) => { },
});

export function DataContextProvider(props) {

  const [currentData, setCurrentData] = useState([]);
  const [currentStorageAddress, setCurrentStorageAddress] = useState("");

  function setData(newData) {
    setCurrentData(newData);
  }

  function setStorageAddress(newStorageAddress) {
    setCurrentStorageAddress(newStorageAddress);
  }

  const context = {
    data: currentData,
    storageAddress: currentStorageAddress,
    setData: setData,
    setStorageAddress: setStorageAddress,
  }

  return (
    <DataContext.Provider value={context}>
      {props.children}
    </DataContext.Provider>
  )
}

export default DataContext;
