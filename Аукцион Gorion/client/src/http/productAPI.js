import { $authHost, $host } from "./index";

// Создание продукта
export const createProduct = async (product) => {
  const { data } = await $authHost.post('/api/product', product);
  return data;
};

// Получение всех продуктов с прикреплением аукционных и продавцовых данных
export const fetchAllProducts = async (page = 1, limit = 5) => {
  // Запрашиваем продукты (ожидается, что endpoint возвращает объект вида { rows, count })
  const { data: productData } = await $host.get('/api/product', {
    params: { page, limit },
  });

  // Запрашиваем все аукционы сразу, чтобы избежать лишних запросов для каждого продукта
  let auctionData = [];
  try {
    const response = await $host.get('/api/auction');
    // Если API возвращает объект с массивом аукционов, извлекаем его
    if (Array.isArray(response.data)) {
      auctionData = response.data;
    } else if (response.data.auctions && Array.isArray(response.data.auctions)) {
      auctionData = response.data.auctions;
    } else {
      auctionData = [];
    }
  } catch (error) {
    console.error('Ошибка при запросе аукционов:', error.response || error);
    auctionData = [];
  }

  // Для каждого продукта прикрепляем данные аукциона (если есть) и данные продавца
  const products = await Promise.all(
    productData.rows.map(async (product) => {
      // Ищем аукцион, где product.id совпадает с auction.productId
      const auction =
        auctionData.find((auc) => Number(auc.productId) === Number(product.id)) || null;
      console.log(`Продукт ${product.id}: аукцион: `, auction);

      // Получаем данные продавца для данного продукта.
      let sellerData = null;
      if (product.sellerId) {
        try {
          // Если у вас изменился адрес endpoint для продавца,
          // например, на `/api/user/seller/${product.sellerId}`, обновите его здесь.
          const response = await $host.get(`/api/user/seller/${product.sellerId}`);
          sellerData = response.data;
        } catch (error) {
          // Если получен статус 404, просто устанавливаем sellerData в null
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

  return {
    products,
    count: productData.count,
  };
};

// Получение продуктов без аукционов конкретного продавца
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
  
  return {
    productsWithoutAuction,
    count: productData.count,
  };
};

// Получение продуктов с аукционами конкретного продавца
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
  
  const productsWithAuction = productData.rows.map((product) => {
    const auction = auctionData.find((auc) => auc.productId === product.id) || null;
    return {
      ...product,
      auction,
      seller: sellerData,
    };
  });
  
  return {
    productsWithAuction,
    count: productData.count,
  };
};

// Получение одного продукта по его ID
export const fetchOneProduct = async (id) => {
  const { data: productData } = await $host.get(`/api/product/${id}`);
  
  const { data: auctionData } = await $host.get('/api/auction', { params: { productId: id } });
  
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
  
  return {
    ...productData,
    auction: auctionData || null,
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