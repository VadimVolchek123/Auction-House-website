import { makeAutoObservable, autorun } from "mobx";

export default class UserStore {
    constructor() {
        this._avatar = null;
        this._id = null;
        this._isAuth = false; // Флаг аутентификации
        this._user = {}; // Основная информация о пользователе
        this._buyerId = null; // Информация о покупателе
        this._sellerId = null; // Информация о продавце
        this._role = "USER"; // Роль пользователя (по умолчанию USER)
        makeAutoObservable(this);

        // Автоматическая проверка изменений состояния аутентификации
        autorun(() => {
            console.log("isAuth:", this._isAuth, "user:", this._user, "role:", this._role, "buyerId:", this._buyerId, "sellerId:", this._sellerId);
        });
    }
    // Сеттеры
    setUser(userProfile) {
        console.log("setUser получен:", userProfile);
        this._user = userProfile;
        this._id = userProfile.id || null;
        this._role = userProfile.role || "USER";
        this._buyerId = userProfile.buyerId || null;
        this._sellerId = userProfile.sellerId || null;
    }
    

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setBuyerId(userProfile) {
        this._buyerId = userProfile.buyerId; // Устанавливаем информацию о покупателе
    }

    setSellerId(userProfile) {
        this._sellerId = userProfile.sellerId; // Устанавливаем информацию о продавце
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

    get buyerId() {
        return this._buyerId;
    }

    get sellerId() {
        return this._sellerId;
    }
}
