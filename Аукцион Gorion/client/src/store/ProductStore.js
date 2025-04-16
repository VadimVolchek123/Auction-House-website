import { makeAutoObservable } from "mobx";

export default class ProductStore {
    constructor() {
        this._types = []; // Список типов продуктов
        this._productsWithAuction = []; // Продукты с аукционами
        this._productsWithoutAuction = []; // Продукты без аукционов
        this._selectedType = {}; // Выбранный тип продукта
        this._page = 1; // Текущая страница
        this._totalCount = 0; // Общее количество продуктов
        this._limit = 3; // Лимит продуктов на страницу
        makeAutoObservable(this); // Автоматизация наблюдаемости
    }

    // Методы установки данных
    setTypes(types) {
        this._types = types;
    }
    setProductsWithAuction(products) {
        this._productsWithAuction = products;
    }
    setProductsWithoutAuction(products) {
        this._productsWithoutAuction = products;
    }
    setSelectedType(type) {
        this.setPage(1); // Сбрасываем страницу при выборе типа
        this._selectedType = type;
    }
    setPage(page) {
        this._page = page;
    }
    setTotalCount(count) {
        this._totalCount = count;
    }

    // Геттеры для доступа к данным
    get types() {
        return this._types;
    }
    get productsWithAuction() {
        return this._productsWithAuction;
    }
    get productsWithoutAuction() {
        return this._productsWithoutAuction;
    }
    get selectedType() {
        return this._selectedType;
    }
    get totalCount() {
        return this._totalCount;
    }
    get page() {
        return this._page;
    }
    get limit() {
        return this._limit;
    }
}
