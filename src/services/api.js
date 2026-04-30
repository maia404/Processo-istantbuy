const API_BASE_URL = "https://api.instabuy.com.br/apiv3";
const SUBDOMAIN = "supermercado";
const ASSETS_BASE = "https://ibassets.com.br";

// --- Helpers de Imagem ---
export const getBannerImageUrl = (imageName) => {
  if (!imageName) return 'https://via.placeholder.com/800x300?text=Sem+Banner';
  return `${ASSETS_BASE}/ib.store.banner/bnr-${imageName}`;
};

export const getProductImageUrl = (imageName, size = 'medium') => {
  if (!imageName) return 'https://via.placeholder.com/300?text=Sem+Imagem';
  const prefixMap = { small: 's', medium: 'm', big: 'b', large: 'l' };
  const prefix = prefixMap[size] || 'm';
  return `${ASSETS_BASE}/ib.item.image.${size}/${prefix}-${imageName}`;
};

// --- Helpers de Formatação ---
export const formatPrice = (price) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

// --- Chamadas API ---
export const fetchHomeLayout = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/layout?subdomain=${SUBDOMAIN}`);
    const json = await response.json();
    return json.data;
  } catch (error) {
    console.error("Erro na API Layout:", error);
    throw error;
  }
};

export const fetchProductDetails = async (slug) => {
  try {
    const response = await fetch(`${API_BASE_URL}/item?subdomain=${SUBDOMAIN}&slug=${slug}`);
    const json = await response.json();

    // API pode retornar: array com item, array vazio, objeto ou null
    if (Array.isArray(json.data)) {
      if (json.data.length === 0) return null; // array vazio = não encontrado
      return json.data[0];
    }

    // Se vier objeto mas sem id válido, trata como não encontrado
    if (json.data && json.data.id) return json.data;

    return null;
  } catch (error) {
    console.error("Erro na API Item:", error);
    throw error;
  }
};