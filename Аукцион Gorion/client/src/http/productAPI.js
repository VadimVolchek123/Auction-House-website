import { $authHost, $host } from "./index";

// Создание продукта
export const createProduct = async (product) => {
  const { data } = await $authHost.post('/api/product', product);
  return data;
};

// Получение всех продуктов с прикреплением аукционных и продавцовых данных.
// Продукты, для которых аукцион найден, но завершён, исключаются из результата.
export const fetchAllProducts = async (page = 1, limit = 5) => {
  // Запрашиваем продукты (ожидается, что endpoint возвращает объект вида { rows, count })
  const { data: productData } = await $host.get('/api/product', {
    params: { page, limit },
  });

  // Запрашиваем все аукционы сразу, чтобы не делать отдельный запрос для каждого продукта
  let auctionData = [];
  try {
    const response = await $host.get('/api/auction');
    if (Array.isArray(response.data)) {
      auctionData = response.data;
    } else if (response.data.auctions && Array.isArray(response.data.auctions)) {
      auctionData = response.data.auctions;
    }
  } catch (error) {
    console.error('Ошибка при запросе аукционов:', error.response || error);
    auctionData = [];
  }

  // Для каждого продукта прикрепляем данные аукциона (если есть) и данные продавца,
  // но если найденный аукцион завершён, продукт исключается из списка.
  const productsFiltered = await Promise.all(
    productData.rows.map(async (product) => {
      // Ищем аукцион, где product.id совпадает с auction.productId
      const auction = auctionData.find(
        (auc) => Number(auc.productId) === Number(product.id)
      ) || null;
      
      // Если аукцион существует и его статус FINISHED, возвращаем null для фильтрации
      if (auction && auction.status === "FINISHED") {
        return null;
      }

      // Получаем данные продавца для данного продукта.
      let sellerData = null;
      if (product.sellerId) {
        try {
          const response = await $host.get(`/api/user/seller/${product.sellerId}`);
          sellerData = response.data;
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.warn(`Продавец с sellerId ${product.sellerId} не найден.`);
            sellerData = null;
          } else {
            console.error(`Ошибка при получении данных продавца для sellerId ${product.sellerId}:`, error);
          }
        }
      }
      return {
        ...product,
        auction,
        seller: sellerData,
      };
    })
  );
  
  // Фильтруем нулевые значения (продукты с завершёнными аукционами)
  const products = productsFiltered.filter((item) => item !== null);
  return { products, count: products.length };
};

// Получение продуктов без аукционов конкретного продавца (без фильтрации)
export const fetchProductsWithoutAuctionBySeller = async (sellerId, page = 1, limit = 5) => {
  const { data: productData } = await $host.get(`/api/product/seller/${sellerId}`, {
    params: { page, limit },
  });
  
  let sellerData = null;
  try {
    const response = await $host.get(`/api/user/seller/${sellerId}`);
    sellerData = response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`Продавец с sellerId ${sellerId} не найден.`);
      sellerData = null;
    } else {
      console.error(`Ошибка при получении данных продавца для sellerId ${sellerId}:`, error);
    }
  }
  
  const productsWithoutAuction = productData.rows.map((product) => ({
    ...product,
    seller: sellerData,
  }));
  
  return { productsWithoutAuction, count: productData.count };
};

// Получение продуктов с аукционами конкретного продавца.
// Если для продукта найден аукцион со статусом FINISHED, продукт не включается в список.
export const fetchProductsWithAuctionBySeller = async (sellerId, page = 1, limit = 5) => {
  const { data: productData } = await $host.get(`/api/product/seller/${sellerId}`, {
    params: { page, limit },
  });
  const { data: auctionData } = await $host.get('/api/auction');
  
  let sellerData = null;
  try {
    const response = await $host.get(`/api/seller/${sellerId}`);
    sellerData = response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`Продавец с sellerId ${sellerId} не найден.`);
      sellerData = null;
    } else {
      console.error(`Ошибка при получении данных продавца для sellerId ${sellerId}:`, error);
    }
  }
  
  const productsFiltered = await Promise.all(
    productData.rows.map(async (product) => {
      let auction =
        auctionData.find((auc) => Number(auc.productId) === Number(product.id)) || null;
      
      // Если аукцион найден и его статус FINISHED, исключаем продукт
      if (auction && auction.status === "FINISHED") {
        return null;
      }
      return {
        ...product,
        auction,
        seller: sellerData,
      };
    })
  );
  
  const productsWithAuction = productsFiltered.filter((item) => item !== null);
  return { productsWithAuction, count: productsWithAuction.length };
};

// Получение одного продукта по его ID.
// Для страницы деталей продукта можно вернуть продукт даже с завершённым аукционом,
// либо при необходимости скрывать аукцион, возвращая null для поля auction.
export const fetchOneProduct = async (id) => {
  const { data: productData } = await $host.get(`/api/product/${id}`);
  const { data: auctionData } = await $host.get('/api/auction', {
    params: { productId: id },
  });
  
  let sellerData = null;
  try {
    const response = await $host.get(`/api/seller/${productData.sellerId}`);
    sellerData = response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.warn(`Продавец с sellerId ${productData.sellerId} не найден.`);
      sellerData = null;
    } else {
      console.error(`Ошибка при получении данных продавца для sellerId ${productData.sellerId}:`, error);
    }
  }
  
  let auction = auctionData || null;
  if (auction && auction.status === "FINISHED") {
    // Здесь можно вернуть null, чтобы не показывать аукцион на странице деталей,
    // или оставить информацию об окончании – на ваше усмотрение.
    auction = null;
  }
  
  return {
    ...productData,
    auction,
    seller: sellerData,
  };
};

// Работа с типами
export const createType = async (type) => {
  const { data } = await $authHost.post('/api/type', type);
  return data;
};

export const fetchTypes = async () => {
  const { data } = await $host.get('/api/type');
  return data;
};
