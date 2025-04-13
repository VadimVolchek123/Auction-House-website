import { makeAutoObservable } from "mobx";

export default class AuctionStore {
    constructor() {
        this._auctions = [];
        makeAutoObservable(this);
    }

    setAuctions(auctions) {
        this._auctions = auctions;
    }

    get auctions() {
        return this._auctions;
    }
}
