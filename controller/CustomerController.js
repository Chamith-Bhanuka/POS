import {customer_db} from '../db/db.js';
import CustomerModel from "../model/CustomerModel.js";

function loadCustomers() {
    $('#customer-tbody').empty();

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
        $('#customer-tbody').append(data);
    })
}

//save customer

$('#customer-save').on('click', function(){

    console.log('customer save clicked');

    let name = $('#custFullName').val();
    let email = $('#custEmail').val();
    let phone = $('#custPhone').val();
    let address = $('#custAddress').val();

    if (name === '' || email === '' || phone === '' || address === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    } else {
        let customer_data = new CustomerModel(name, email, phone, address);

        customer_db.push(customer_data);

        console.log(customer_db);

        loadCustomers();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });

        $('#custFullName').val('');
        $('#custEmail').val('');
        $('#custPhone').val('');
        $('#custAddress').val('');
    }

});