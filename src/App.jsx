import React from 'react';
import { HashRouterRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart'; 
import { CartProvider, useCart } from './context/CartContext'; 

import './styles/global.css'; 

const HeaderContent = () => {
    // Lógica do Carrinho
    const { cartItems } = useCart();
    const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return ( 
        <div className="header-content">
            <Link to="/" className="logo-link">
                <span className="logo"> Mercadon</span>
            </Link>
            <Link to="/cart" className="cart-link">
                <span className="cart-icon">🛒Carrinho ({totalItems})</span>
            </Link>
        </div>
    );
};


function App() {
  // O componente App só tem um return, que engloba tudo.
  return ( 
    <CartProvider> 
        <BrowserRouter>
            <header className="main-header">
                {/* O componente HeaderContent é chamado aqui */}
                <HeaderContent /> 
            </header>
            
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/p/:slug" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                </Routes>
            </main>
        </BrowserRouter>
    </CartProvider>
  );
}

export default App;