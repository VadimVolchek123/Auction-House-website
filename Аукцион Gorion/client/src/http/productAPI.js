import { $authHost, $host } from "./index";

// Создание продукта
export const createProduct = async (product) => {
  const { data } = await $authHost.post('api/product', product);
  return data;
};

export const fetchAllProducts = async (page = 1, limit = 5) => {
  // Запрашиваем все продукты (предполагается, что endpoint 'api/product' возвращает пагинированный результат вида { rows, count })
  const { data: productData } = await $host.get('/api/product', {
    params: { page, limit },
  });

  // Объявляем переменную auctionData заранее
  let auctionData = [];
  // Запрашиваем все аукционы сразу, чтобы не выполнять лишних запросов для каждого продукта
  try {
    const response = await $host.get('/api/auction');
    auctionData = response.data;
    //console.log('Auction Data:', auctionData);
  } catch (error) {
    console.error('Ошибка в запросе:', error.response || error);
    // Можно задать auctionData как пустой массив или завершить выполнение
    auctionData = [];
  }

  // Для каждого продукта прикрепляем данные аукциона (если есть) и данные продавца
  const products = await Promise.all(
    productData.rows.map(async (product) => {
      // Ищем аукцион, в котором product.id совпадает с auction.productId
      const auction =
      auctionData.find((auc) => Number(auc.productId) === Number(product.id)) || null;
        console.log(`Продукт ${product.id}: аукцион: `, auction);
      // Получаем данные продавца данного продукта
      // console.log('Product ID:', product.id, 'Seller ID:', product.sellerId);
      let sellerData = null;
  if (product.sellerId) {
    try {
        const response = await $host.get(`/api/user/seller/${product.sellerId}`);
        sellerData = response.data;
    } catch (error) {
        console.error(`Ошибка при получении данных продавца для sellerId ${product.sellerId}:`, error);
    }
}


      return {
        ...product,
        auction,
        seller: sellerData || null,
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
  // Запрашиваем продукты продавца (возвращается объект { rows, count })
  const { data: productData } = await $host.get(`api/product/seller/${sellerId}`, {
    params: { page, limit },
  });
  
  // Запрашиваем данные о продавце по его ID
  const { data: sellerData } = await $host.get(`api/product/seller/${sellerId}`);
  
  // К каждому продукту прикрепляем данные продавца
  const productsWithoutAuction = productData.rows.map((product) => ({
    ...product,
    seller: sellerData || null,
  }));
  
  return {
    productsWithoutAuction,
    count: productData.count,
  };
};

// Получение продуктов с аукционами конкретного продавца
export const fetchProductsWithAuctionBySeller = async (sellerId, page = 1, limit = 5) => {
  // Запрашиваем продукты продавца по маршруту с пагинацией
  const { data: productData } = await $host.get(`api/product/seller/${sellerId}`, {
    params: { page, limit },
  });
  
  // Запрашиваем все аукционы
  const { data: auctionData } = await $host.get('api/auction');
  
  // Запрашиваем данные о продавце
  const { data: sellerData } = await $host.get(`api/seller/${sellerId}`);
  
  // Для каждого продукта пытаемся найти соответствующий аукцион по совпадению product.id с auction.productId
  const productsWithAuction = productData.rows.map((product) => {
    const auction = auctionData.find((auc) => auc.productId === product.id);
    return {
      ...product,
      auction: auction || null,
      seller: sellerData || null,
    };
  });
  
  return {
    productsWithAuction,
    count: productData.count,
  };
};

// Получение одного продукта по его ID
export const fetchOneProduct = async (id) => {
  // Получаем данные продукта
  const { data: productData } = await $host.get(`api/product/${id}`);
  
  // Получаем данные об аукционе, если они существуют (фильтруем по productId)
  const { data: auctionData } = await $host.get('api/auction', { params: { productId: id } });
  
  // Получаем данные о продавце данного продукта
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
  return data;
};

export const fetchTypes = async () => {
  const { data } = await $host.get('api/type');
  return data;
};
