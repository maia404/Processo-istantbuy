import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Adiciona um novo item ou incrementa um existente (+1)
  const addItem = (product) => {
    if (!product || !product.id) {
        console.error("Tentativa de adicionar produto sem ID válido.");
        return;
    }

    setCartItems(prevItems => {
        const existingItem = prevItems.find(item => item.id === product.id);

        if (existingItem) {
            // Se existir, incrementa a quantidade (Garante NOVA referência de objeto)
            return prevItems.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            // Se for novo, adiciona com quantidade 1 (Garante NOVA referência de array)
            return [...prevItems, { ...product, quantity: 1 }];
        }
    });
    alert(`${product.name} adicionado ao carrinho!`); 
  };
  
  // Remove o item inteiro do carrinho
  const removeItem = (id) => {
    // Retorna um NOVO array excluindo o item (Garante NOVA referência de array)
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  // ➕ Incrementa a quantidade de um item existente em +1
  const incrementQuantity = (id) => {
    setCartItems(prevItems => prevItems.map(item =>
        item.id === id
            // CHAVE: Garante a imutabilidade do objeto item
            ? { ...item, quantity: item.quantity + 1 } 
            : item
    ));
  };

  // ➖ Decrementa a quantidade em -1, ou remove se a quantidade for 1
  const decrementQuantity = (id) => {
    setCartItems(prevItems => prevItems.map(item => {
        if (item.id === id) {
            // Se a quantidade for 1, retornamos null para ser filtrado (removido)
            if (item.quantity === 1) {
                return null; 
            }
            // Caso contrário, decrementa (Garante a imutabilidade do objeto item)
            return { ...item, quantity: item.quantity - 1 };
        }
        return item;
    // O filter(Boolean) cria um NOVO array, removendo itens que são null
    }).filter(Boolean)); 
  };


  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addItem, 
        removeItem, 
        incrementQuantity, 
        decrementQuantity 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};