import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductDetails, getProductImageUrl, formatPrice } from '../services/api';
import { useCart } from '../context/CartContext'; 
import '../styles/global.css'; 

const ProductDetails = () => {
  const { slug } = useParams(); 
  const [product, setProduct]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [quantity, setQuantity] = useState(1);  // quantidade selecionada
  const [added, setAdded]       = useState(false);

  const { addItem, cartItems } = useCart(); 

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Nenhum produto especificado.");
      return;
    }
    setLoading(true);
    fetchProductDetails(slug)
      .then(setProduct)
      .catch((err) => {
        console.error("Erro ao buscar detalhes:", err);
        setError("Erro ao carregar o produto ou item não encontrado.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Sincroniza botão com o carrinho
  useEffect(() => {
    if (product) {
      const isInCart = cartItems.some(item => item.id === product.id);
      setAdded(isInCart);
    }
  }, [product, cartItems]);

  // Adiciona N vezes conforme a quantidade escolhida
  const handleAddToCart = () => {
    if (product && !added) {
      addItem(product, quantity);
      setAdded(true);
    }
  };

  const handleDecrement = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncrement = () => setQuantity(q => Math.min(99, q + 1));

  if (loading)  return <div className="loading">Carregando detalhes...</div>;
  if (error)    return <div className="error">{error}</div>;
  if (!product) return (
    <div className="not-found-page fade-in">
      <div className="not-found-box">
        <span className="not-found-emoji">🔍</span>
        <h2 className="not-found-title">Produto não encontrado</h2>
        <p className="not-found-text">
          Este produto pode estar indisponível ou ter sido removido pelo fornecedor da API.
          Tente outro item da nossa loja!
        </p>
        <Link to="/" className="not-found-btn">
          ← Voltar para a loja
        </Link>
      </div>
    </div>
  );

  const mainImage = product.images?.[0];
  const price     = product.prices?.[0]?.price;

  return (
    <div className="container fade-in">
      <Link to="/" className="back-link">← Voltar para a loja</Link>
      
      <div className="details-wrapper">
        <div className="details-image">
          {mainImage && (
            <img 
              src={getProductImageUrl(mainImage, 'large')} 
              alt={product.name} 
            />
          )}
        </div>

        <div className="details-info">
          <h1>{product.name}</h1>
          <span className="details-brand">Marca: {product.brand || 'Geral'}</span>
          
          <div className="details-price">
            {price ? formatPrice(price) : "Preço indisponível"}
          </div>

          <p className="details-description">
            {product.description || "Sem descrição detalhada para este produto."}
          </p>

          {/* Seletor de quantidade + botão — só aparece se houver preço e não foi adicionado */}
          {price && !added && (
            <div className="buy-row">
              <div className="qty-selector">
                <button
                  className="qty-selector__btn"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  aria-label="Diminuir quantidade"
                >
                  −
                </button>
                <span className="qty-selector__value">{quantity}</span>
                <button
                  className="qty-selector__btn"
                  onClick={handleIncrement}
                  disabled={quantity >= 99}
                  aria-label="Aumentar quantidade"
                >
                  +
                </button>
              </div>

              <button className="btn-buy" onClick={handleAddToCart}>
                🛒 Adicionar ao Carrinho
              </button>
            </div>
          )}

          {/* Estado: já adicionado */}
          {price && added && (
            <div className="buy-row">
              <button className="btn-buy btn-buy--added" disabled>
                ✔ Item no Carrinho
              </button>
            </div>
          )}

          {/* Estado: sem preço */}
          {!price && (
            <button className="btn-buy" disabled>
              Indisponível para Compra
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;