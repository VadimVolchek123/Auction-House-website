import { $authHost } from "./index";

// Получение данных корзины текущего пользователя
export const fetchCartItems = async () => {
  const { data } = await $authHost.get('/api/cart');
  // Предполагается, что сервер возвращает объект вида { cart: [...] }
  return data.cart;
};

// Добавление записи в корзину
export const addToCart = async (cartData) => {
  const { data } = await $authHost.post('/api/cart', cartData);
  return data;
};

// Удаление записи из корзины по ID
export const removeCartItem = async (cartItemId) => {
  const { data } = await $authHost.delete(`/api/cart/${cartItemId}`);
  return data;
};

// Очистка корзины текущего пользователя
export const clearCart = async () => {
  const { data } = await $authHost.delete('/api/cart/clear');
  return data;
};

// Оплата товаров в корзине: списывает с покупателя средства и обновляет статус оплаты
export const payForCart = async () => {
  const { data } = await $authHost.post('/api/cart/pay');
  // Ожидается, что сервер вернёт, например, { message: 'Оплата прошла успешно...', balance: новыйБаланс }
  return data;
};
