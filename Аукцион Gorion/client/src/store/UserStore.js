import { makeAutoObservable, autorun } from "mobx";

export default class UserStore {
    constructor() {
        this._id = null;
        this._isAuth = false; // Флаг аутентификации
        this._user = {}; // Основная информация о пользователе
        this._buyerId = null; // Информация о покупателе
        this._sellerId = null; // Информация о продавце
        this._role = "USER"; // Роль пользователя (по умолчанию USER)
        makeAutoObservable(this);

        // Автоматическая проверка изменений состояния аутентификации
        autorun(() => {
            console.log("isAuth:", this._isAuth, "user:", this._user, "role:", this._role);
        });
    }
    // Сеттеры
    setUser(userProfile) {
        // Обновляем основной объект пользователя
        this._user = userProfile;
        // Обновляем идентификатор (если он есть в профиле)
        this._id = userProfile.id || null;
        // Устанавливаем роль пользователя (если поле role отсутствует, то по умолчанию "USER")
        this._role = userProfile.role || "USER";
        // Если в профиле присутствует информация о покупателе, обновляем поле buyer
        if (userProfile.buyerId) {
            this.setBuyer(userProfile.buyer);
        } else {
            this._buyerId = null;
        }
        // Если в профиле присутствует информация о продавце, обновляем поле seller
        if (userProfile.sellerId) {
            this.setSeller(userProfile.seller);
        } else {
            this._sellerId = null;
        }
    }

    setIsAuth(bool) {
        this._isAuth = bool;
    }

    setBuyer(buyerId) {
        this._buyer = buyerId; // Устанавливаем информацию о покупателе
    }

    setSeller(sellerId) {
        this._seller = sellerId; // Устанавливаем информацию о продавце
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
