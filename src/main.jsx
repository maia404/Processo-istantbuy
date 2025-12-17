// Este é o primeiro arquivo React que roda.
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Cria a raiz de renderização e injeta o componente App.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);