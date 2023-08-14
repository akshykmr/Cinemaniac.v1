import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <GoogleOAuthProvider clientId="1090892780340-4bl1fl7c2kg24fr48vlg9inii05dav0o.apps.googleusercontent.com">
  <Auth0Provider
    domain="cinemaniac.us.auth0.com"
    clientId="nVr5O066M4JXzSE59UvkajXRe0DZT6f6"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
     <React.StrictMode>
    <App />
  </React.StrictMode>
  </Auth0Provider>
  </GoogleOAuthProvider>
 
);

