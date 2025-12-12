// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';

// CORREÇÃO CRÍTICA DO CAMINHO: App.jsx está em 'src/', e styles/ está em 'src/'.
// O caminho é relativo a 'src/'.
import './styles/global.css'; 

function App() {
  return (
    // BrowserRouter permite a navegação baseada em URL
    <BrowserRouter>
      <header className="main-header">
        <div className="header-content">
          <span className="logo">🛒 Mercadon </span>
        </div>
      </header>
      
      <main>
        {/* Routes define os caminhos e quais componentes renderizar */}
        <Routes>
          {/* Rota Home: renderiza Home.jsx na URL base "/" */}
          <Route path="/" element={<Home />} />
          
          {/* Rota de Detalhes: renderiza ProductDetails.jsx. 
             O ":slug" é um parâmetro dinâmico para identificar o produto. */}
          <Route path="/p/:slug" element={<ProductDetails />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;