import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';

// import Admin from './Admin';
import App from './App';
import Agb from './Agb';
import Auth0ProviderWithHistory from './auth/auth0-provider-with-history';
import Datenschutzerklaerung from './Datenschutzerklaerung';
import Impressum from './Impressum';

import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithHistory>
        <Routes>
            <Route index element={<App />} />
            <Route path="/agb" element={<Agb />} />
            <Route path="/datenschutzerklaerung" element={<Datenschutzerklaerung />} />
            <Route path="/impressum" element={<Impressum />} />
            {/* <Route path="/admin" element={<Admin />} /> */}
        </Routes>
      </Auth0ProviderWithHistory>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
