import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode"; // Исправлено имя импорта jwtDecode

// Регистрация нового пользователя
export const registration = async (email, password, name, role = 'USER') => {
    const { data } = await $host.post('api/user/registration', {
        email,
        password,
        name, // Имя пользователя
        role // Роль (например, ADMIN или USER)
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
        throw error; // Генерируем исключение в случае ошибки
    }
};

// Получение профиля пользователя
export const fetchUserProfile = async () => {
    try {
        const { data } = await $authHost.get('api/user/profile'); // Получение профиля пользователя
        return data.user; // Возвращаем объект пользователя из ответа
    } catch (error) {
        console.error('Ошибка получения профиля пользователя:', error);
        throw error; // Генерация исключения при ошибке
    }
};

// Обновление данных пользователя
export const updateUserProfile = async (userData) => {
    try {
        const { data } = await $authHost.put('api/user/profile', userData); // Обновляем данные пользователя
        return data; // Возвращаем обновлённые данные пользователя
    } catch (error) {
        console.error('Ошибка обновления профиля пользователя:', error);
        throw error; // Генерация исключения при ошибке
    }
};

// Получение данных покупателя
export const fetchBuyerInfo = async (userId) => {
    try {
        const { data } = await $authHost.get(`api/user/buyer/${userId}`); // Получение информации о покупателе
        return data; // Возвращаем информацию о покупателе
    } catch (error) {
        console.error('Ошибка получения данных покупателя:', error);
        throw error; // Генерируем исключение в случае ошибки
    }
};

// Получение данных продавца
export const fetchSellerInfo = async (userId) => {
    try {
        const { data } = await $authHost.get(`api/user/seller/${userId}`); // Получение информации о продавце
        return data; // Возвращаем информацию о продавце
    } catch (error) {
        console.error('Ошибка получения данных продавца:', error);
        throw error; // Генерируем исключение в случае ошибки
    }
};
