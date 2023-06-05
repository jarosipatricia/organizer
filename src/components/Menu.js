import React, { useState }from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import './Menu.css';

export default function Menu() {
  const [isErrorMessage, setIsErrorMesage] = useState(false);
  const [errorMessage, setErrorMesage] = useState('');
  const navigate = useNavigate();

  function handleSignOut() {
    signOut(auth)
      .then(() => {
        window.location = '/'; //root page=login='/'
      })
      .catch((err) => {
        setIsErrorMesage(true)
        setErrorMesage(err.message);
      });
    };

    return(
    <div>
      <div id="nav">
        <a href="/home">Home</a>
        <a href="/calendarpage">Calendar</a>
        <a href="/expensetracker">Expense tracker</a>
        <a href="/todo">Todo list</a>
        <a href="/pomodoro">Time manager</a>
        <button onClick={handleSignOut} className='logoutButton'>Logout</button>
      </div>
      {isErrorMessage ? <div className='errormessage'>{errorMessage} </div> : null}
    </div>
  );
}