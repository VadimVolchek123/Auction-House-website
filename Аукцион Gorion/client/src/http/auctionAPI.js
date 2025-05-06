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
