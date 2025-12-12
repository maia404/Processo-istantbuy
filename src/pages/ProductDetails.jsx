// pages/ProductDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchProductDetails, getProductImageUrl, formatPrice } from '../services/api';
import '../styles/global.css'; 

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await fetchProductDetails(slug);
        // A API pode retornar um array ou objeto direto dependendo da versão, 
        // aqui assumimos que data[0] é o item se for array.
        setProduct(Array.isArray(data) ? data[0] : data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  if (loading) return <div className="loading">Carregando produto...</div>;
  if (!product) return <div>Produto não encontrado.</div>;

  // Seleciona a imagem principal (geralmente a primeira)
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : null;

  return (
    <div className="details-container">
      <div className="details-grid">
        {/* Coluna da Imagem */}
        <div className="image-column">
          {mainImage && (
            <img 
              src={getProductImageUrl(mainImage, 'big')} 
              alt={product.name} 
              className="main-image"
            />
          )}
        </div>

        {/* Coluna de Informações */}
        <div className="info-column">
          <h1>{product.name}</h1>
          <div className="price-tag">
            {formatPrice(product.prices[0].price)}
          </div>
          
          <p className="description">
            {product.description || "Sem descrição disponível."}
          </p>

          <button 
            className="btn-add-cart"
            onClick={() => alert(`Adicionado: ${product.name}`)}
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;