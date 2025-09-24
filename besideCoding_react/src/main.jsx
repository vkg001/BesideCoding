import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { API_BASE_URL } from './Constants';

// Your Client ID is correct
const clientId = '1023943366376-d0o0gfh6e61ft9vb0qpg3gg5t11iktgu.apps.googleusercontent.com';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      {/* 
        This is the crucial fix. 
        The provider must wrap any component that uses Google Auth.
      */}
      <GoogleOAuthProvider clientId={clientId}>
        <App />
        <ToastContainer />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);