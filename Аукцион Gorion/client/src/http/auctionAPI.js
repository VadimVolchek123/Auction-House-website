import { $authHost, $host } from "./index";

// Создание нового аукциона
export const createAuction = async (auctionData) => {
  console.log("Данные для создания аукциона:", auctionData);
  const { data } = await $authHost.post('/api/auction', auctionData);
  return data;
};

// Получение всех аукционов
export const fetchAllAuctions = async (page = 1, limit = 10) => {
  const { data } = await $host.get('/api/auction', {
    params: { page, limit },
  });
  return data; // Ожидается, что сервер вернёт { rows: [...], count: N }
};

// Получение информации об определённом аукционе по его ID
export const fetchAuctionById = async (auctionId) => {
  const { data } = await $host.get(`/api/auction/${auctionId}`);
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
  console.log(data);
  return data;
};

// Размещение ставки
export const placeBid = async (auctionId, bidValue, userId) => {
  // Формируем объект для запроса.
  const payload = { auctionId, bidAmount: bidValue, userId };
  console.log("Payload перед отправкой:", payload);
  const { data } = await $authHost.post(`/api/bid`, payload);
  return data;
};

// Получение всех ставок для конкретного аукциона
export const fetchBidsForAuction = async (auctionId) => {
  // Предполагается, что серверный эндпоинт для получения ставок выглядит так: /api/bid/auction/:auctionId
  const { data } = await $host.get(`/api/bid/auction/${auctionId}`);
  return data;
};

// Получение максимальной цены для аукциона
export const getMaxPrice = async (auctionId) => {
  const { data } = await $host.get(`/api/auction/${auctionId}/max`);
  console.log("Max price:", data);
  return data;
};