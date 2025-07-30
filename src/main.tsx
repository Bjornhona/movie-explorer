import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const url = window.location.pathname + window.location.search;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App initialUrl={url} />
  </React.StrictMode>
);
