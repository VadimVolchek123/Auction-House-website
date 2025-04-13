import { $authHost, $host } from "./index";

// Работа с продуктами
export const createProduct = async (product) => {
    const { data } = await $authHost.post('api/product', product);
    return data; // Создать продукт
};

export const fetchProducts = async (page = 1, limit = 5) => {
    const { data: productData } = await $host.get('api/product', {
        params: { page, limit },
    });
    const { data: auctionData } = await $host.get('api/auction'); // Запрос данных об аукционах
    const { data: sellerData } = await $host.get('api/seller'); // Запрос данных о продавцах

    // Соединение продуктов с аукционами и продавцами по соответствующим ID
    const combinedData = productData.rows.map((product) => {
        const auction = auctionData.find((auc) => auc.productId === product.id);
        const seller = sellerData.find((sel) => sel.id === product.sellerId);
        return {
            ...product,
            auction: auction || null, // Если аукцион не найден, оставляем `null`
            seller: seller || null, // Если продавец не найден, оставляем `null`
        };
    });
    return {
        rows: combinedData,
        count: productData.count,
    };
};

export const fetchOneProduct = async (id) => {
    const { data: productData } = await $host.get(`api/product/${id}`);
    const { data: auctionData } = await $host.get(`api/auction`, { params: { productId: id } });
    const { data: sellerData } = await $host.get(`api/seller/${productData.sellerId}`);
    
    return {
        ...productData,
        auction: auctionData || null,
        seller: sellerData || null,
    };
};

// Работа с типами
export const createType = async (type) => {
    const { data } = await $authHost.post('api/type', type);
    return data; // Создать тип
};

export const fetchTypes = async () => {
    const { data } = await $host.get('api/type');
    return data; // Получить список типов
};
