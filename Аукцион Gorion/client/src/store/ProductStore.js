import { makeAutoObservable } from "mobx";

export default class ProductStore {
  constructor() {
    this._types = [];          // Список типов продуктов
    this._products = [];       // Все продукты (каждый продукт может содержать данные об аукционе и продавце)
    this._auctions = [];       // Отдельный массив для хранения данных об аукционах
    this._selectedType = {};   // Выбранный тип продукта
    this._page = 1;            // Текущая страница
    this._totalCount = 0;      // Общее количество продуктов
    this._limit = 3;           // Лимит продуктов на страницу
    makeAutoObservable(this);
  }

  // Методы для установки данных
  setTypes(types) {
    this._types = types;
  }

  setProducts(products) {
    this._products = products;
    // Если у каждого продукта присутствует поле auction,
    // можно собрать их в отдельный массив:
    this._auctions = products
      .map((product) => product.auction)
      .filter((auction) => auction !== null && auction !== undefined);
  }

  // Отдельный метод для установки данных об аукционах (если требуется напрямую)
  setAuctions(auctions) {
    this._auctions = auctions;
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

  get auctions() {
    return this._auctions;
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
