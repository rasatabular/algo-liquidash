import { useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../store/auth-context';

function NavBar() {

  const authCtx = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container container-fluid">
        <div className='d-flex align-items-center'>
          <Link to='/' className="navbar-brand">
            <h3>AlgoFi Liquidation Dashboard<sup><span className="badge bg-danger">BETA</span></sup></h3>
          </Link>
        </div>
        <div>
          {!authCtx.isLoggedIn && (
            <Link to='/auth'>
              <button className='btn btn-primary'>Login</button>
            </Link>
          )}
          {authCtx.isLoggedIn && (
            <button
              className='btn btn-primary'
              onClick={() => { authCtx.logout(); }}>Logout</button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default NavBar;
