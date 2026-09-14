import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// DevTools Security Warning
if (typeof window !== "undefined" && process.env.NODE_ENV === "production") {
  console.log(
    "%cSTOP! SECURITY NOTICE%c\nThis is a browser feature intended for developers. Do not paste or run untrusted code here.",
    "color: #ef4444; font-size: 22px; font-weight: 800;",
    "font-size: 13px; color: #94a3b8;"
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
