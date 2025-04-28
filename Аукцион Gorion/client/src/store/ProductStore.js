import { makeAutoObservable } from "mobx";

export default class ProductStore {
  constructor() {
    this._types = [];         // Список типов продуктов
    this._products = [];      // Все продукты (каждый продукт может содержать данные аукциона и продавца)
    this._selectedType = {};  // Выбранный тип продукта
    this._page = 1;           // Текущая страница
    this._totalCount = 0;     // Общее количество продуктов
    this._limit = 3;          // Лимит продуктов на страницу
    makeAutoObservable(this);
  }

  // Методы для установки данных
  setTypes(types) {
    this._types = types;
  }

  setProducts(products) {
    this._products = products;
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

  get products() {
    return this._products;
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
