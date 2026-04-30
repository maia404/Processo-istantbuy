import React, { createContext, useState, useContext, useCallback } from 'react';

const CartContext = createContext();

// ============================================================
// Componente Toast — renderizado dentro do Provider
// ============================================================
const ToastContainer = ({ toasts }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type} ${toast.leaving ? 'toast--out' : 'toast--in'}`}>
          <span className="toast-icon">{toast.type === 'add' ? '🛒' : '🗑️'}</span>
          <div className="toast-body">
            <strong className="toast-title">
              {toast.type === 'add' ? 'Adicionado ao carrinho!' : 'Removido do carrinho'}
            </strong>
            <span className="toast-name">{toast.name}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================
// Provider
// ============================================================
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [toasts, setToasts]       = useState([]);

  // Dispara um toast e remove após 3s com animação de saída
  const fireToast = useCallback((name, type = 'add') => {
    const id = Date.now();

    setToasts(prev => [...prev, { id, name, type, leaving: false }]);

    // Marca como saindo em 2.6s (animação de saída dura 0.4s)
    setTimeout(() => {
      setToasts(prev =>
        prev.map(t => (t.id === id ? { ...t, leaving: true } : t))
      );
    }, 2600);

    // Remove do DOM após 3s
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  // Adiciona um novo item ou incrementa um existente (+1)
  const addItem = (product) => {
    if (!product || !product.id) {
      console.error("Tentativa de adicionar produto sem ID válido.");
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });

    fireToast(product.name, 'add');
  };

  // Remove o item inteiro do carrinho
  const removeItem = (id) => {
    const item = cartItems.find(i => i.id === id);
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    if (item) fireToast(item.name, 'remove');
  };

  // Incrementa +1
  const incrementQuantity = (id) => {
    setCartItems(prevItems => prevItems.map(item =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  // Decrementa -1, remove se chegar a 0
  const decrementQuantity = (id) => {
    setCartItems(prevItems => prevItems.map(item => {
      if (item.id === id) {
        if (item.quantity === 1) return null;
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }).filter(Boolean));
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        removeItem,
        incrementQuantity,
        decrementQuantity,
      }}
    >
      {children}
      {/* Toast sempre visível em cima de tudo */}
      <ToastContainer toasts={toasts} />
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);