import NavBar from './components/NavBar';
import LandingPageInfo from './components/LandingPageInfo';
import StorageAccountDataList from './components/StorageAccountDataList'
import SearchWallet from './components/SearchWallet';

function App() {
  return (
    <div>
      <NavBar />
      <main>
        <div className="container mt-5 px-5">
          <LandingPageInfo />
          <SearchWallet />
          <StorageAccountDataList />
        </div>
      </main>
    </div>
  );
}

export default App;
