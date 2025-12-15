// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  fetchHomeLayout, 
  getBannerImageUrl, 
  getProductImageUrl, 
  formatPrice 
} from '../services/api';

// CORREÇÃO CRÍTICA DO CAMINHO: O arquivo está em 'pages/'. 
// '..' sobe da pasta 'pages' para 'src', onde encontra 'styles/global.css'.
import '../styles/global.css'; 

const Home = () => {
  // Estados para gerenciar dados, carregamento e erros
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchHomeLayout();
        setData(result);
      } catch (err) {
        // Se a API falhar, exibe uma mensagem de erro na tela
        setError("Não foi possível carregar as ofertas. Verifique a API/Conexão.");
        console.error("Erro ao carregar layout:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []); // [] garante que o fetch roda apenas uma vez

  // Renderização condicional para estados de UI
  if (loading) return <div className="loading">Carregando ofertas...</div>;
  if (error) return <div className="error">{error}</div>;

  // Proteção com Optional Chaining (?.): Se a propriedade não existir, retorna array vazio
  const banners = data?.banners || [];
  const collections = data?.collection_items || [];

  return (
    <div className="container fade-in">
      
      {/* --- Seção de Banners --- */}
      {banners.length > 0 && (
        <section className="banner-list">
          {banners.map((banner) => (
            <div key={banner.id} className="banner-card">
              <img 
                src={getBannerImageUrl(banner.image)} 
                alt={banner.title || "Banner Promocional"} 
              />
            </div>
          ))}
        </section>
      )}

      {/* --- Listagem de Coleções e Produtos --- */}
      {collections.map((collection) => (
        <section key={collection.id} className="collection-section">
          <h2 className="collection-title">{collection.title}</h2>
          
          <div className="product-grid">
            {collection.items.map((product) => (
              // LINK CORRETO: Usa /p/ para corresponder à rota /p/:slug configurada no App.jsx
              <Link 
                to={`/p/${product.slug}`} 
                key={product.id} 
                className="product-card"
              >
                <div className="image-container">
                  <img 
                    src={getProductImageUrl(product.images?.[0], 'medium')} 
                    alt={product.name} 
                  />
                </div>
                <div className="info-container">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">
                    {/* Proteção com Optional Chaining para acessar o preço */}
                    {product.prices?.[0]?.price 
                      ? formatPrice(product.prices[0].price) 
                      : "Indisponível"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default Home;