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

  //Obtém a função 'addItem' do CartContext
  const { addItem } = useCart(); 

  useEffect(() => {
    //Verifica se há slug para buscar
    if (!slug) {
        setLoading(false);
        setError("Nenhum produto especificado.");
        return;
    }
    
    //Inicia a busca na API
    setLoading(true);
    fetchProductDetails(slug)
      .then(setProduct)
      .catch((err) => {
        console.error("Erro ao buscar detalhes:", err);
        setError("Erro ao carregar o produto ou item não encontrado.");
      })
      .finally(() => setLoading(false));
  }, [slug]); // Dependência: Roda a busca quando o slug muda

  //Função de manipulação do botão (usa a função do contexto)
  const handleAddToCart = () => {
      if (product) {
          addItem(product); // Adiciona o produto ao estado global do carrinho
      }
  };

  if (loading) return <div className="loading">Carregando detalhes...</div>;
  if (error) return <div className="error">{error}</div>;
  
  // Produto não encontrado (404)
  if (!product) return 
    <div className="container">
        <p className="error">Produto não encontrado ou indisponível.</p>
        <Link to="/" className="back-link">← Voltar para a loja</Link>
    </div>;

  // Extrai dados com proteção de Optional Chaining
  const mainImage = product.images?.[0];
  const price = product.prices?.[0]?.price;

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
            className="btn-buy"
            //Chama a função que adiciona o item via Context
            onClick={handleAddToCart}
            // Desabilita se o preço não estiver disponível
            disabled={!price} 
          >
            {/* Texto dinâmico opcional */}
            {price ? "Adicionar ao Carrinho" : "Indisponível para Compra"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;