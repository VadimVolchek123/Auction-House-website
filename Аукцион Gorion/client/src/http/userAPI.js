import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode"; // Используем именованный экспорт

// Регистрация нового пользователя
export const registration = async (email, password, name, role = 'USER') => {
    const { data } = await $host.post('api/user/registration', {
        email,
        password,
        name, // Имя пользователя
        role   // Роль (например, ADMIN или USER)
    });
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token); // Декодируем токен для получения информации о пользователе
};

// Авторизация пользователя
export const login = async (email, password) => {
    const { data } = await $host.post('api/user/login', { email, password });
    localStorage.setItem('token', data.token);
    return jwtDecode(data.token); // Декодируем токен для получения информации о пользователе
};

// Проверка токена и получение информации о пользователе
export const check = async () => {
    try {
        const { data } = await $authHost.get('api/user/auth'); // Проверка авторизации
        localStorage.setItem('token', data.token);
        return jwtDecode(data.token); // Возвращаем данные из токена
    } catch (error) {
        console.error('Ошибка проверки токена:', error);
        throw error;
    }
};

// Получение профиля пользователя
export const fetchUserProfile = async () => {
    try {
        const { data } = await $authHost.get('api/user/profile'); // Получение профиля пользователя
        return data.user;
    } catch (error) {
        console.error('Ошибка получения профиля пользователя:', error);
        throw error;
    }
};

// Обновление данных пользователя (новый маршрут updateUser)
export const updateUserProfile = async (userData) => {
    try {
        const { data } = await $authHost.put('api/user/updateUser', userData);
        console.log(data);
        return data;
    } catch (error) {
        console.error('Ошибка обновления профиля пользователя:', error);
        throw error;
    }
};

// Получение данных покупателя
export const fetchBuyerInfo = async (userId) => {
    try {
        const { data } = await $authHost.get(`api/user/buyer/${userId}`);
        return data;
    } catch (error) {
        console.error('Ошибка получения данных покупателя:', error);
        throw error;
    }
};

// Получение данных продавца
export const fetchSellerInfo = async (userId) => {
    try {
        const { data } = await $authHost.get(`api/user/seller/${userId}`);
        return data;
    } catch (error) {
        console.error('Ошибка получения данных продавца:', error);
        throw error;
    }
};

/* Функции для работы админ панели */
// Функция для обновления роли пользователя (только для администраторов)
export const updateUserRole = async (roleData) => {
    // roleData должен быть объектом вида { userId, role }
    const { data } = await $authHost.put('/api/user/role', roleData);
    return data;
};

// Получение списка всех пользователей (новый маршрут /all)
export const fetchAllUsers = async () => {
    try {
        const { data } = await $authHost.get('api/user/all');
        return data;
    } catch (error) {
        console.error('Ошибка получения всех пользователей:', error);
        throw error;
    }
};

// Удаление пользователя по ID (новый маршрут DELETE api/user/:id)
export const deleteUser = async (userId) => {
    try {
        const { data } = await $authHost.delete(`api/user/${userId}`);
        return data;
    } catch (error) {
        console.error('Ошибка удаления пользователя:', error);
        throw error;
    }
};
// Обновление баланса пользователя
export const updateBalance = async (balance) => {
    try {
      const { data } = await $authHost.put('api/user/updateBalance', { balance });
      // data ожидается в виде { balance: новоеЗначение }
      return data;
    } catch (error) {
      console.error('Ошибка обновления баланса:', error);
      throw error;
    }
  };  

// Функция пополнения баланса пользователя
export const topUpAccount = async (amount) => {
    try {
        const { data } = await $authHost.post('api/user/topup', { amount });
        return data;
    } catch (error) {
        console.error('Ошибка пополнения баланса:', error);
        throw error;
    }
    
};

export const fetchBuyerBalance = async () => {
    try {
      const { data } = await $authHost.get(`api/user/buyer/balance`);
      
      // Проверяем, что ответ содержит поле balance
      if (data && data.balance !== undefined) {
        return data.balance;
      } else {
        throw new Error("Баланс покупателя отсутствует в ответе API");
      }
    } catch (error) {
      console.error("Ошибка получения баланса покупателя:", error);
      throw error;
    }
  };
  
  