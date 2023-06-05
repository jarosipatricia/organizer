import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import './Login.css';
import profilepic from "../images/profilepic.png";
import emailpic from "./../images/emailpic.png";
import passpic from "./../images/passpic.png";

export default function Signin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isErrorMessage, setIsErrorMesage] = useState(false);
  const [errorMessage, setErrorMesage] = useState('');
  const navigate = useNavigate();

  function handleEmailChange(e) {
    setEmail(e.target.value);
  };

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  };

  function handleSignIn(event) {
    event.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/home");
      })
      .catch(function(error) {
        setIsErrorMesage(true);
        setErrorMesage(error.message);
    });
  };

  return(
    <div className="main-container">
     <div className="card">
       <div>
         <div className="img-container">
           <div className="image-border">
             <img src={profilepic} alt="profile" className="img"/>
           </div>
         </div>

         <form className='input-container' onSubmit={handleSignIn}>
          <h1>Login</h1>

          <label className="label" htmlFor="email">Email</label>
          <div className="input-spacing">
            <img src={emailpic} alt="email" className="icons"/>
            <input type="email" placeholder="Email..." onChange={handleEmailChange} value={email} id="email"/>
          </div>

          <label className="label" htmlFor="password">Password</label>
          <div>
            <img src={passpic} alt="pass" className="icons"/>
            <input type="password" placeholder="Password..." onChange={handlePasswordChange} value={password} id="password"/>
          </div>

          <div className="login-button-container">
          {isErrorMessage ? <div className='errormessage' data-testid="errorContainer">{errorMessage} </div> : null}
            <input type="submit" value="Log in"/>
          </div>

          <div className='navigateTo'>
            <div>Doesn't have an account?</div><div className='register-button' onClick={() => navigate("/register")}>Create one!</div>
          </div>
          
         </form>
       </div>
      </div>
    </div>
  );
}