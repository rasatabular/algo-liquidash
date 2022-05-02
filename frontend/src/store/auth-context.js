import React, { useState } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => { },
  logout: () => { }
});

export function AuthContextProvider(props) {

  const [token, setToken] = useState("");

  const userIsLoggedIn = !!token;

  function logoutHandler() {
    setToken(null);
  }

  function loginHandler(token) {
    setToken(token);
  }

  const context = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
  };

  return <AuthContext.Provider value={context}>
    {props.children}
  </AuthContext.Provider>
}

export default AuthContext;
