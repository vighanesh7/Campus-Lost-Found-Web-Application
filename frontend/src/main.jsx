import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './redux/store';
import { logout } from './redux/authSlice';
import { ToastProvider } from './context/ToastContext';
import App from './App';
import './index.css';

// The Axios interceptor fires this when the server rejects our token.
window.addEventListener('clf:unauthorized', () => store.dispatch(logout()));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider><App /></ToastProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
);
