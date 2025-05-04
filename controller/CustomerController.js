import {customer_db} from '../db/db.js';
import CustomerModel from "../model/CustomerModel.js";

function loadCustomers() {
    $('customer-tbody').empty();

    customer_db.map((item, index) => {
        let name  = item.custFullName;
        let email = item.custEmail;
        let phone = item.custPhone;
        let address = item.custAddress;

        let data = `<tr>
                                <td>${index+1}</td>
                                <td>${name}</td>
                                <td>${email}</td>
                                <td>${phone}</td>
                                <td>${address}</td>
                          </tr>`
        $('customer-tbody').append(data);
    })
}