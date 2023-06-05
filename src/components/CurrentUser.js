import React, { useEffect } from 'react';
import { getAuth } from "firebase/auth";

export const useAuth = () => {
  const [ currentUser, setCurrentUser ] = React.useState();

  useEffect(() => {
    getAuth().onAuthStateChanged(user => setCurrentUser(user));
  }, [])

  return currentUser;
}