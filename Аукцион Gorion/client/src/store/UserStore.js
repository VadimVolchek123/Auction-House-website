import { makeAutoObservable, autorun } from "mobx";

export default class UserStore {
    constructor() {
        this._isAuth = false; // Флаг аутентификации
        this._user = {}; // Основная информация о пользователе
        this._buyer = null; // Информация о покупателе
        this._seller = null; // Информация о продавце
        this._role = "USER"; // Роль пользователя (по умолчанию USER)
        makeAutoObservable(this);

        // Автоматическая проверка изменений состояния аутентификации
        autorun(() => {
            console.log("isAuth изменился на:", this._isAuth);
        });
    }

    // Сеттеры
    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setUser(user) {
        this._user = user;
        this._role = user.role || "USER"; // Устанавливаем роль из объекта пользователя
    }

    setBuyer(buyer) {
        this._buyer = buyer; // Устанавливаем информацию о покупателе
    }

    setSeller(seller) {
        this._seller = seller; // Устанавливаем информацию о продавце
    }

    // Геттеры
    get isAuth() {
        return this._isAuth;
    }

    get user() {
        return this._user;
    }

    get role() {
        return this._role;
    }

    get buyer() {
        return this._buyer;
    }

    get seller() {
        return this._seller;
    }
}
