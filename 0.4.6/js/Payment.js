export class Payment {
    constructor(orderId, orderName, price) {
        this._orderId = orderId;
        this._orderName = orderName;
        this._price = price;
    }

    get orderId() {
        return this._orderId;
    }
    get orderName() {
        return this._orderName;
    }
    get price() {
        return this._price;
    }
}