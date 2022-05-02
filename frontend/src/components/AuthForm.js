import { useContext, useState, useRef } from "react";

import AuthContext from "../store/auth-context";

function AuthForm() {

  const authCtx = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef("");
  const passwordRef = useRef("");

  function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailRef.current.value;
    const enteredPassword = passwordRef.current.value;

    setIsLoading(true);

    let url;
    if (isLogin) {
      url = `${process.env.REACT_APP_DOMAIN}/login`
    } else {
      url = `${process.env.REACT_APP_DOMAIN}/register`
    }

    fetch(
      url,
      {
        method: 'POST',
        body: new URLSearchParams({
          username: enteredEmail,
          password: enteredPassword,
        }),
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    ).then(res => {
      setIsLoading(false);
      if (res.ok) {
        return res.json()
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
      authCtx.login(data.access_token);
      // history.replace('/');
    }).catch(err => {
      alert(err);
    });
  }

  function toggleLogin(event) {
    event.preventDefault();
    setIsLogin(prevState => !prevState);
  }

  return (
    <div className="container d-flex justify-content-center">
      <div className="text-center">
        <h3 className="h3 mb-3 fw-normal">{isLogin ? "Login" : "Sign Up"}</h3>
        <form onSubmit={submitHandler}>
          <div className="form-floating">
            <input type="email" className="form-control" name="email" id="email" ref={emailRef} required />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-floating">
            <input type="password" className="form-control" name="password" id="password" ref={passwordRef} required />
            <label htmlFor="password">Password</label>
          </div>
          <div>
            <div className="my-3">
              {!isLoading && <button className="w-100 btn btn-lg btn-primary" type="submit">{isLogin ? "Login" : "Register"}</button>}
              {isLoading && <p>Loading</p>}
            </div>
            <div>
              <a type="button" className="text-primary" onClick={toggleLogin}>
                {isLogin ? "New user?" : "Already have an account?"}
              </a>
            </div>
          </div>
        </form>
      </div >
    </div>
  );
};

export default AuthForm;
