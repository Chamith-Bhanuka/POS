import {order_details} from "../db/db";

export default class OrderModel {
    constructor(invoiceNumber, orderDate, customerName, paymentMethod, finalAmt, discount, order_details) {
        this.invoiceNumber = invoiceNumber;
        this.orderDate = orderDate;
        this.customerName = customerName;
        this.paymentMethod = paymentMethod;
        this.finalAmt = finalAmt;
        this.discount = discount;
        this.orderDetails = order_details;
    }
}