import React from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice, getProductImageUrl } from '../services/api';
import { Link } from 'react-router-dom';

import '../styles/global.css'; 

const Cart = () => {
  //Obtém as funções do contexto
  const { cartItems, incrementQuantity, decrementQuantity, removeItem } = useCart();

  // Cálculo do Total
  const subtotal = cartItems.reduce((acc, item) => 
    acc + ((item.prices?.[0]?.price || 0) * item.quantity), 0
  );
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="container cart-page">
      <h1>🛍️ Seu Carrinho de Compras ({totalItems} itens)</h1>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Seu carrinho está vazio.</p>
          <Link to="/" className="btn-primary">
            Voltar para a loja
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                
                {/* Imagem e Detalhes */}
                <img 
                    src={getProductImageUrl(item.images?.[0], 'small')} 
                    alt={item.name} 
                    className="cart-item-image"
                />
                <div className="cart-item-details">
                  <Link to={`/p/${item.slug}`} className="cart-item-name">
                    {item.name}
                  </Link>
                  <p className="cart-item-price-unit">
                    Preço Unit: {formatPrice(item.prices?.[0]?.price)}
                  </p>
                  <p className="cart-item-total">
                    Total: {formatPrice((item.prices?.[0]?.price || 0) * item.quantity)}
                  </p>
                </div>
                
                {/* AÇÕES: CONTROLE DE QUANTIDADE + BOTÃO REMOVER */}
                <div className="cart-actions">
                    
                    {/* Controle de Quantidade */}
                    <div className="cart-item-quantity-control">
                        <button 
                            className="btn-qty btn-minus" 
                            // ATRIBUIÇÃO DA FUNÇÃO DE DECREMENTAR
                            onClick={() => decrementQuantity(item.id)}
                        >
                            —
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button 
                            className="btn-qty btn-plus" 
                            // ATRIBUIÇÃO DA FUNÇÃO DE INCREMENTAR
                            onClick={() => incrementQuantity(item.id)}
                        >
                            +
                        </button>
                    </div>

                    {/* Botão Remover (Ícone) */}
                    <button 
                        className="btn-remove-icon" 
                        // ATRIBUIÇÃO DA FUNÇÃO DE REMOVER
                        onClick={() => removeItem(item.id)}
                    >
                        🗑️
                    </button>
                </div>
              </div>
            ))}
          </div>

          {/* RESUMO DO PEDIDO */}
          <div className="cart-summary">
            <h3>Resumo do Pedido</h3>
            <div className="summary-item">
              <span>Subtotal ({totalItems} itens)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            
            <div className="summary-item total-final">
              <strong>Total a Pagar</strong>
              <strong>{formatPrice(subtotal)}</strong>
            </div>

            <button className="btn-checkout">
                Finalizar Compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;