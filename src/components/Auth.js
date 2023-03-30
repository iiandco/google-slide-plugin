// src/components/Auth.js
import React, { useState, useEffect } from "react";
import { GoogleAuth } from "google-auth-library";

const CLIENT_ID = "802627914353-ssgj5hvgnjr66k7dg7a2ps8eluflbiu5.apps.googleusercontent.com";
const API_KEY = "AIzaSyAwRfWnRWxnXr1P0eaF-_gaXhuQ3Vbfy_g";
const SCOPES = "https://www.googleapis.com/auth/presentations";

const Auth = ({ onAuthSuccess }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    gapi.load("client:auth2", initClient);
  }, []);

  const initClient = () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      })
      .then(() => {
        const authInstance = gapi.auth2.getAuthInstance();
        setIsSignedIn(authInstance.isSignedIn.get());
        authInstance.isSignedIn.listen(setIsSignedIn);
      });
  };

  const signIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const signOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  useEffect(() => {
    if (isSignedIn) {
      onAuthSuccess(gapi.client.getToken().access_token);
    }
  }, [isSignedIn, onAuthSuccess]);

  return (
    <div>
      {!isSignedIn && <button onClick={signIn}>Sign In</button>}
      {isSignedIn && <button onClick={signOut}>Sign Out</button>}
    </div>
  );
};

export default Auth;
