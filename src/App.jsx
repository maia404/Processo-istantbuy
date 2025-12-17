import React from 'react';
import { Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart'; 
import { CartProvider, useCart } from './context/CartContext'; 

import './styles/global.css'; 

const HeaderContent = () => {
    const { cartItems } = useCart();
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return ( 
        <div className="header-content">
            {/* Adicionamos a classe logo-link aqui para controlar o sublinhado no CSS */}
            <Link to="/" className="logo-link">
                <span className="logo">Mercadon</span>
            </Link>
            <Link to="/cart" className="cart-link">
                <span className="cart-icon">🛒Carrinho ({totalItems})</span>
            </Link>
        </div>
    );
};

function App() {
  return ( 
    <CartProvider> 
        {/* O BrowserRouter foi removido daqui para não conflitar com o HashRouter do main.jsx */}
        <header className="main-header">
            <HeaderContent /> 
        </header>
        
        <main className="container">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/p/:slug" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
            </Routes>
        </main>
    </CartProvider>
  );
}

export default App;