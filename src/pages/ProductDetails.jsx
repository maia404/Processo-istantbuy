import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductDetails, getProductImageUrl, formatPrice } from '../services/api';
import { useCart } from '../context/CartContext'; 
import '../styles/global.css'; 

const ProductDetails = () => {
  const { slug } = useParams(); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false); // controla o estado do botão

  const { addItem, cartItems } = useCart(); 

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Nenhum produto especificado.");
      return;
    }

    setLoading(true);
    fetchProductDetails(slug)
      .then((data) => {
        setProduct(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar detalhes:", err);
        setError("Erro ao carregar o produto ou item não encontrado.");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Sincroniza o estado do botão com o carrinho ao carregar a página
  useEffect(() => {
    if (product) {
      const isInCart = cartItems.some(item => item.id === product.id);
      setAdded(isInCart);
    }
  }, [product, cartItems]);

  const handleAddToCart = () => {
    if (product && !added) {
      addItem(product);
      setAdded(true);
    }
  };

  if (loading) return <div className="loading">Carregando detalhes...</div>;
  if (error)   return <div className="error">{error}</div>;
  if (!product) return (
    <div className="container">
      <p className="error">Produto não encontrado ou indisponível.</p>
      <Link to="/" className="back-link">← Voltar para a loja</Link>
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

          <button
            className={`btn-buy ${added ? 'btn-buy--added' : ''}`}
            onClick={handleAddToCart}
            disabled={!price || added}
          >
            {!price && "Indisponível para Compra"}
            {price && !added && "🛒 Adicionar ao Carrinho"}
            {price && added  && "✔ Item no Carrinho"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;