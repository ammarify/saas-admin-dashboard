import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import App from './app/App';
import { I18nProvider } from './shared/i18n/I18nProvider';
import NotificationsProvider from './shared/notifications/NotificationsProvider';
import 'react-toastify/dist/ReactToastify.css';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotificationsProvider>
      <I18nProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ToastContainer position="top-right" autoClose={2500} />
      </I18nProvider>
    </NotificationsProvider>
  </React.StrictMode>,
);
