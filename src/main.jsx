// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // 👈 Importa o seu componente principal (que tem as Rotas)

// O ReactStrictMode ajuda a identificar problemas no código durante o desenvolvimento.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* 👈 Renderiza o App.jsx, iniciando o clone da loja */}
  </React.StrictMode>,
);