import { makeAutoObservable, autorun, runInAction } from "mobx";
import { fetchBuyerBalance } from "../http/userAPI"; 

export default class UserStore {
    constructor() {
        this._avatar = null;
        this._id = null;
        this._isAuth = false; // Флаг аутентификации
        this._user = {}; // Основная информация о пользователе
        this._buyerId = null; // Информация о покупателе
        this._sellerId = null; // Информация о продавце
        this._role = "USER"; // Роль пользователя (по умолчанию USER)
        this._balance = 0; // Баланс пользователя
        makeAutoObservable(this);

        // Автоматическая проверка изменений состояния аутентификации
        autorun(() => {
            console.log(
                "isAuth:", this._isAuth, 
                "user:", this._user, 
                "role:", this._role, 
                "buyerId:", this._buyerId, 
                "sellerId:", this._sellerId,
                "balance:", this._balance
            );
        });
    }
    // Сеттеры
    setUser(userProfile) {
        this._user = userProfile;
        this._id = userProfile.id || null;
        this._role = userProfile.role || "USER";
        this._buyerId = userProfile.buyerId || null;
        this._sellerId = userProfile.sellerId || null;
        
        if (this._buyerId) {
          fetchBuyerBalance(this._buyerId).then((balance) => {
            runInAction(() => {
              this._balance = balance;
            });
          }).catch((err) => {
            console.error("Ошибка загрузки баланса:", err);
          });
        } else {
          this._balance = 0;
        }
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
    
    // Сеттер для баланса
    setBalance(newBalance) {
        this._balance = newBalance;
    }

    // Геттеры
    get isAuth() {
        return this._isAuth;
    }

    get id() {
        return this._id;
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

    get balance() {
        return this._balance;
    }
}
