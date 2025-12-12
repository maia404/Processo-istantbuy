const API_BASE_URL = "https://api.instabuy.com.br/apiv3";
const SUBDOMAIN = "supermercado";
const ASSETS_BASE = "https://ibassets.com.br";

// --- Helpers de Imagem ---
// Constrói a URL completa para imagens de banner
export const getBannerImageUrl = (imageName) => {
  if (!imageName) return 'https://via.placeholder.com/800x300?text=Sem+Banner';
  return `${ASSETS_BASE}/ib.store.banner/bnr-${imageName}`;
};

// Constrói a URL completa para imagens de produto em tamanhos diferentes
export const getProductImageUrl = (imageName, size = 'medium') => {
  if (!imageName) return 'https://via.placeholder.com/300?text=Sem+Imagem';
  
  const prefixMap = { 
    small: 's', 
    medium: 'm', 
    big: 'b', 
    large: 'l' 
  };
  const prefix = prefixMap[size] || 'm';
  
  return `${ASSETS_BASE}/ib.item.image.${size}/${prefix}-${imageName}`;
};

// --- Helpers de Formatação ---

// Formata o preço para o padrão BRL (R$)
export const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

// --- Chamadas API ---

// Busca o layout da Home (banners e coleções de produtos)
export const fetchHomeLayout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/layout?subdomain=${SUBDOMAIN}`);
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Erro na API Layout:", error);
    throw error; // Lança o erro para ser capturado no useEffect do Home.jsx
  }
};

// Busca os detalhes de um produto específico usando seu slug
export const fetchProductDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/item?subdomain=${SUBDOMAIN}&slug=${slug}`);
    const json = await response.json();
    
    // A API pode retornar um array ou objeto, pegamos o primeiro item se for array
    if (Array.isArray(json.data)) {
      return json.data[0];
    }
    return json.data;
  } catch (error) {
    console.error("Erro na API Item:", error);
    throw error;
  }
};