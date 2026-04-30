import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchHomeLayout,
  getBannerImageUrl,
  getProductImageUrl,
  formatPrice
} from '../services/api';
import '../styles/global.css';


// ============================================================
// Carrossel de Banners
// ============================================================
const BannerCarousel = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goTo = useCallback((index) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 400);
  }, [isTransitioning]);

  const goToNext = useCallback(() => {
    goTo((currentIndex + 1) % banners.length);
  }, [currentIndex, banners.length, goTo]);

  const goToPrev = useCallback(() => {
    goTo((currentIndex - 1 + banners.length) % banners.length);
  }, [currentIndex, banners.length, goTo]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(goToNext, 4000);
    return () => clearInterval(interval);
  }, [goToNext, banners.length]);

  if (!banners.length) return null;

  return (
    <section className="banner-carousel">
      <div className={`banner-slide ${isTransitioning ? 'banner-fade-out' : 'banner-fade-in'}`}>
        <img
          src={getBannerImageUrl(banners[currentIndex].image)}
          alt={banners[currentIndex].title || 'Banner Promocional'}
        />
      </div>

      {banners.length > 1 && (
        <>
          <button className="banner-btn banner-btn-prev" onClick={goToPrev} aria-label="Banner anterior">
            &#8249;
          </button>
          <button className="banner-btn banner-btn-next" onClick={goToNext} aria-label="Próximo banner">
            &#8250;
          </button>
          <div className="banner-dots">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`banner-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goTo(index)}
                aria-label={`Ir para banner ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};


// ============================================================
// Filtro de Categorias com dropdown expansível
// ============================================================
const CategoryFilter = ({ collections, activeCategory, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLabel = activeCategory
    ? collections.find((c) => c.id === activeCategory)?.title
    : 'Todas as categorias';

  const handleSelect = (id) => {
    onSelect(id);
    setIsOpen(false);
  };

  return (
    <div className="category-wrapper" ref={dropdownRef}>
      {/* Botão que abre/fecha o dropdown */}
      <button
        className={`category-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span className="category-toggle-icon">☰</span>
        <span className="category-toggle-label">{activeLabel}</span>
        <span className={`category-toggle-arrow ${isOpen ? 'rotated' : ''}`}>▾</span>
      </button>

      {/* Painel expansível com as categorias */}
      <div className={`category-panel ${isOpen ? 'category-panel--open' : ''}`}>
        <button
          className={`category-item ${activeCategory === null ? 'active' : ''}`}
          onClick={() => handleSelect(null)}
        >
          ✦ Todas as categorias
        </button>
        {collections.map((collection) => (
          <button
            key={collection.id}
            className={`category-item ${activeCategory === collection.id ? 'active' : ''}`}
            onClick={() => handleSelect(collection.id)}
          >
            {collection.title}
          </button>
        ))}
      </div>
    </div>
  );
};


// ============================================================
// Página principal
// ============================================================
const Home = () => {
  const [data, setData]                   = useState(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const collectionsRef                    = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchHomeLayout();
        setData(result);
      } catch (err) {
        setError('Não foi possível carregar as ofertas. Verifique a API/Conexão.');
        console.error('Erro ao carregar layout:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="loading">Carregando ofertas...</div>;
  if (error)   return <div className="error">{error}</div>;

  const banners     = data?.banners || [];
  const collections = data?.collection_items || [];

  const visibleCollections = activeCategory
    ? collections.filter((c) => c.id === activeCategory)
    : collections;

  const handleCategorySelect = (id) => {
    setActiveCategory(id === activeCategory ? null : id);
    setTimeout(() => {
      collectionsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="container fade-in">

      {/* --- Carrossel --- */}
      <BannerCarousel banners={banners} />

      {/* --- Filtro expansível --- */}
      {collections.length > 0 && (
        <CategoryFilter
          collections={collections}
          activeCategory={activeCategory}
          onSelect={handleCategorySelect}
        />
      )}

      {/* --- Produtos --- */}
      <div ref={collectionsRef}>
        {visibleCollections.map((collection) => (
          <section key={collection.id} className="collection-section">
            <h2 className="collection-title">{collection.title}</h2>
            <div className="product-grid">
              {collection.items.map((product) => (
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
                      {product.prices?.[0]?.price
                        ? formatPrice(product.prices[0].price)
                        : 'Indisponível'}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

    </div>
  );
};

export default Home;