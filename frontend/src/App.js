import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import NavBar from './components/NavBar';
import LandingPageInfo from './components/LandingPageInfo';
import StorageAccountDataList from './components/StorageAccountDataList'
import SearchWallet from './components/SearchWallet';
import AuthForm from './components/AuthForm';
import WatchedStorageAccountDataList from './components/WatchedStorageAccountDataList';

import AuthContext from './store/auth-context';

function App() {

  const authCtx = useContext(AuthContext);

  return (
    <div>
      <NavBar />
      <main>
        <div className="container mt-5 px-5">
          <Switch>
            <Route path="/" exact>
              <LandingPageInfo />
              <SearchWallet />
              {authCtx.isLoggedIn &&
                <WatchedStorageAccountDataList />
              }
              <StorageAccountDataList />
            </Route>
            {!authCtx.isLoggedIn &&
              <Route path="/auth">
                <AuthForm />
              </Route>
            }
            <Route path='*'>
              <Redirect to='/' />
            </Route>
          </Switch>
        </div>
      </main>
    </div>
  );
}

export default App;
