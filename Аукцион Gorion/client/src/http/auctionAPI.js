import { $authHost, $host } from "./index";

// Создание нового аукциона
export const createAuction = async (auctionData) => {
  console.log("Данные для создания аукциона:", auctionData);
  const { data } = await $authHost.post('/api/auction', auctionData);
  return data;
};

// Получение всех аукционов (возвращаются только активные)
export const fetchAllAuctions = async (page = 1, limit = 10) => {
  const { data } = await $host.get('/api/auction', {
    params: { page, limit },
  });
  // Ожидается, что сервер вернёт объект вида { rows: [...], count: N }
  // Фильтруем аукционы: исключаем завершённые (например, status === 'FINISHED')
  const activeAuctions = data.rows.filter(auction => auction.status !== 'FINISHED');
  return { rows: activeAuctions, count: activeAuctions.length };
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
