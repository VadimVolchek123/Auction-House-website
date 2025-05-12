import { $authHost, $host } from "./index";

// Создание нового аукциона
export const createAuction = async (auctionData) => {
  console.log("Данные для создания аукциона:", auctionData);
  const { data } = await $authHost.post('/api/auction', auctionData);
  return data;
};

export const fetchAllAuctions = async (page = 1, limit = 5) => {
  try {
    const { data } = await $host.get("/api/auction", {
      params: { page, limit },
    });
    
    // Если data не определено или не имеет ожидаемой структуры, возвращаем пустой массив и count = 0.
    if (!data) {
      return { rows: [], count: 0 };
    }
    
    // Если сервер возвращает данные в формате findAndCountAll, то данные могут быть в data.rows
    let auctions = [];
    if (data.rows && Array.isArray(data.rows)) {
      auctions = data.rows;
    } else if (Array.isArray(data)) {
      // Если data уже массив
      auctions = data;
    } else if (data.auctions && Array.isArray(data.auctions)) {
      // На случай, если сервер вернул объект с ключом auctions
      auctions = data.auctions;
    }
    const count = data.count || auctions.length;
    return { rows: auctions, count };
  } catch (error) {
    console.error("Ошибка получения аукционов:", error);
    throw error;
  }
};


// Получение информации об определённом аукционе по его ID
export const fetchAuctionById = async (auctionId) => {
  const { data } = await $host.get(`/api/auction/${auctionId}`);
  // Если аукцион существует и его статус "FINISHED", возвращаем null (или можно выбросить ошибку)
  if (data && data.status && data.status === 'FINISHED') {
    return null; 
  }
  return data;
};

// Удаление аукциона по его ID (если предусмотрено сервером)
export const deleteAuction = async (auctionId) => {
  const { data } = await $authHost.delete(`/api/auction/${auctionId}`);
  return data;
};

// Обновление максимальной (наивысшей) ставки для аукциона
export const updateHighestBid = async (auctionId) => {
  const { data } = await $authHost.put(`/api/auction/${auctionId}/highestBid`);
  console.log("updateHighestBid:", data);
  return data;
};

// Размещение ставки
export const placeBid = async (auctionId, bidValue, userId) => {
  const payload = { auctionId, bidAmount: bidValue, userId };
  console.log("Payload перед отправкой:", payload);
  const { data } = await $authHost.post(`/api/bid`, payload);
  return data;
};

// Получение всех ставок для конкретного аукциона
export const fetchBidsForAuction = async (auctionId) => {
  const { data } = await $host.get(`/api/bid/auction/${auctionId}`);
  return data;
};

// Получение максимальной цены для аукциона
export const getMaxPrice = async (auctionId) => {
  const { data } = await $host.get(`/api/auction/${auctionId}/max`);
  console.log("Max price:", data);
  return data;
};
