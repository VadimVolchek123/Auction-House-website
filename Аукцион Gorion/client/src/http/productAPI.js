import { $authHost, $host } from "./index";

// Создание продукта
export const createProduct = async (product) => {
  const { data } = await $authHost.post('/api/product', product);
  return data;
};

// Функция для получения всех продуктов с пагинацией, фильтром по поиску и отбором активных аукционов
export const fetchAllProducts = async (page = 1, limit = 5, search = "", typeId = "") => {
  try {
    const { data: productData } = await $host.get("/api/product", {
      params: { page, limit, search, typeId },
    });

    // Используем поле products или rows, если оно существует, иначе пустой массив
    const productsArray =
      productData.products && Array.isArray(productData.products)
        ? productData.products
        : productData.rows && Array.isArray(productData.rows)
          ? productData.rows
          : [];

    // Для каждого продукта загружаем данные продавца (если sellerId указан)
    const productsWithSeller = await Promise.all(
      productsArray.map(async (product) => {
        let sellerData = null;
        if (product.sellerId) {
          try {
            const response = await $host.get(`/api/user/seller/${product.sellerId}`);
            sellerData = response.data;
          } catch (error) {
            if (error.response && error.response.status === 404) {
              console.warn(`Продавец с sellerId ${product.sellerId} не найден.`);
            } else {
              console.error(
                `Ошибка при получении данных продавца для sellerId ${product.sellerId}:`,
                error
              );
            }
          }
        }
        return { ...product, seller: sellerData };
      })
    );
    const count = productData.count || productsWithSeller.length;
    return { products: productsWithSeller, count };
  } catch (error) {
    console.error("Ошибка в fetchAllProducts:", error);
    throw error;
  }
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

  const productsArray =
    productData.products && Array.isArray(productData.products)
      ? productData.products
      : productData.rows && Array.isArray(productData.rows)
        ? productData.rows
        : [];

  const productsWithoutAuction = productsArray.map((product) => ({
    ...product,
    seller: sellerData,
  }));

  return { productsWithoutAuction, count: productData.count || 0 };
};

// Функция для удаления продукта с передачей заголовка авторизации
export const deleteProduct = async (productId, token) => {
  // Убедитесь, что переданный token действителен
  const { data } = await $host.delete(`/api/product/delete/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data;
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

  const productsArray =
    productData.products && Array.isArray(productData.products)
      ? productData.products
      : productData.rows && Array.isArray(productData.rows)
        ? productData.rows
        : [];

  const productsFiltered = await Promise.all(
    productsArray.map(async (product) => {
      let auction = auctionData.find((auc) => Number(auc.productId) === Number(product.id)) || null;
      // Если аукцион найден и его статус FINISHED, исключаем продукт
      if (auction && auction.status === "FINISHED") {
        return null;
      }
      return { ...product, auction, seller: sellerData };
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
    const response = await $host.get(`/api/user/seller/${productData.sellerId}`);
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
    auction = null;
  }

  return { ...productData, auction, seller: sellerData };
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
