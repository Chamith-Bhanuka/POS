import {customer_db} from '../db/db.js';
import CustomerModel from "../model/CustomerModel.js";

function loadCustomers() {
    $('#customer-tbody').empty();

    customer_db.map((item, index) => {
        let id = item.custId;
        let name  = item.custFullName;
        let email = item.custEmail;
        let phone = item.custPhone;
        let address = item.custAddress;

        let data = `<tr>
                                <td>${id}</td>
                                <td>${name}</td>
                                <td>${email}</td>
                                <td>${phone}</td>
                                <td>${address}</td>
                          </tr>`
        $('#customer-tbody').append(data);
    });

    // Update the customer count
    $('#customerCount').text(customer_db.length);
    loadCustomersForDropDown();
}

//save customer

$('#customer-save').on('click', function(){

    console.log('customer save clicked');

    let id = $('#customerId').val();
    let name = $('#custFullName').val();
    let email = $('#custEmail').val();
    let phone = $('#custPhone').val();
    let address = $('#custAddress').val();

    //validation part
    // Regular expressions for validation
    let namePattern = /^[A-Za-z ]+$/;
    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let phonePattern = /^\d{10}$/;  // Assumes a 10-digit phone number
    let addressPattern = /^.{5,}$/; // Minimum 5 characters for address

    let isValidName = namePattern.test(name);
    let isValidEmail = emailPattern.test(email);
    let isValidPhone = phonePattern.test(phone);
    let isValidAddress = addressPattern.test(address);

    $('#custFullName').css('border-color', isValidName ? '#dee2e6' : 'red');
    $('#custEmail').css('border-color', isValidEmail ? '#dee2e6' : 'red');
    $('#custPhone').css('border-color', isValidPhone ? '#dee2e6' : 'red');
    $('#custAddress').css('border-color', isValidAddress ? '#dee2e6' : 'red');

    if (isValidName && isValidEmail && isValidPhone && isValidAddress) {

        let customer_data = new CustomerModel(id, name, email, phone, address);

        customer_db.push(customer_data);

        console.log(customer_db);

        loadCustomers();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });

        let customerId = generateCustomerId();
        console.log(`Customer Id: ${customerId}`);
        $("#customerId").val(customerId).prop("readonly", true);

        $('#custFullName').val('');
        $('#custEmail').val('');
        $('#custPhone').val('');
        $('#custAddress').val('');

        $("#customer-save").prop("disabled", false);
        $("#customer-update").prop("disabled", true);
        $("#customer-delete").prop("disabled", true);

    } else {

        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        });

    }

});

let selectedIndex = -1;

$('#customer-tbody').on('click','tr', function(){
    selectedIndex = $(this).index();
    console.log(selectedIndex);

    let obj = customer_db[selectedIndex];
    console.log(obj);

    let id = obj.custId;
    let name  = obj.custFullName;
    let email = obj.custEmail;
    let phone = obj.custPhone;
    let address = obj.custAddress;

    $('#customerId').val(id);
    $('#custFullName').val(name);
    $('#custEmail').val(email);
    $('#custPhone').val(phone);
    $('#custAddress').val(address);

    //disable save and enable update and delete
    $('#customer-save').prop('disabled', true);
    $('#customer-update').prop('disabled', false);
    $('#customer-delete').prop('disabled', false);
})

//update
$('#customer-update').on('click', function(){
    if (selectedIndex !== -1) {

        let name = $('#custFullName').val();
        let email = $('#custEmail').val();
        let phone = $('#custPhone').val();
        let address = $('#custAddress').val();

        // Regular expressions for validation
        let namePattern = /^[A-Za-z ]+$/;
        let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let phonePattern = /^\d{10}$/;  // Assumes a 10-digit phone number
        let addressPattern = /^.{5,}$/; // Minimum 5 characters for address

        let isValidName = namePattern.test(name);
        let isValidEmail = emailPattern.test(email);
        let isValidPhone = phonePattern.test(phone);
        let isValidAddress = addressPattern.test(address);

        $('#custFullName').css('border-color', isValidName ? '#dee2e6' : 'red');
        $('#custEmail').css('border-color', isValidEmail ? '#dee2e6' : 'red');
        $('#custPhone').css('border-color', isValidPhone ? '#dee2e6' : 'red');
        $('#custAddress').css('border-color', isValidAddress ? '#dee2e6' : 'red');

        if (isValidName && isValidEmail && isValidPhone && isValidAddress) {
            console.log(name, email, phone, address);

            customer_db[selectedIndex].custFullName = name;
            customer_db[selectedIndex].custEmail = email;
            customer_db[selectedIndex].custPhone = phone;
            customer_db[selectedIndex].custAddress = address;

            loadCustomers();

            Swal.fire({
                title: "Updated Successfully!",
                icon: "success",
                draggable: true
            });

            let customerId = generateCustomerId();
            console.log(`Customer Id: ${customerId}`);
            $("#customerId").val(customerId).prop("readonly", true);

            $('#custFullName').val('');
            $('#custEmail').val('');
            $('#custPhone').val('');
            $('#custAddress').val('');

            selectedIndex = -1;

            $("#customer-save").prop("disabled", false);
            $("#customer-update").prop("disabled", true);
            $("#customer-delete").prop("disabled", true);
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Invalid Inputs',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }

    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Please select a row first!',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
})


//delete
$('#customer-delete').on('click', function(){
    if (selectedIndex !== -1) {


        Swal.fire({
            title: "Do you want to delete this customer?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Delete",
            denyButtonText: `Don't Delete`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                customer_db.splice(selectedIndex, 1);
                loadCustomers();

                $('#custFullName').val('');
                $('#custEmail').val('');
                $('#custPhone').val('');
                $('#custAddress').val('');

                selectedIndex = -1;

                $("#customer-save").prop("disabled", false);
                $("#customer-update").prop("disabled", true);
                $("#customer-delete").prop("disabled", true);
                Swal.fire("Deleted Successfully!", "", "success");
            } else if (result.isDenied) {
                Swal.fire("Unable to Delete Customer", "", "info");
            }
        });

    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Please select a row first!',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
    }
});

$('#customer-reset').on('click', function(){

    let customerId = generateCustomerId();
    console.log(`Customer Id: ${customerId}`);
    $("#customerId").val(customerId).prop("readonly", true);

    $('#custFullName').val('');
    $('#custEmail').val('');
    $('#custPhone').val('');
    $('#custAddress').val('');

    $("#customer-save").prop("disabled", false);
    $("#customer-update").prop("disabled", true);
    $("#customer-delete").prop("disabled", true);
});

$(document).ready(function() {
    let customerId = generateCustomerId();
    console.log(`Customer Id: ${customerId}`);
    $("#customerId").val(customerId).prop("readonly", true);

    $("#customer-save").prop("disabled", false);
    $("#customer-update").prop("disabled", true);
    $("#customer-delete").prop("disabled", true);
});

function loadCustomersForDropDown() {
    let customerDropdown = $("#orderCustomer");
    customerDropdown.empty(); // Clear old options

    customerDropdown.append(`<option value="" disabled selected>Select Customer</option>`);

    customer_db.forEach((customer, index) => {
        console.log(`Adding Customer: ${customer.custFullName}`); // Debugging log
        customerDropdown.append(`<option value="${customer.custFullName}">${customer.custFullName} (${customer.custId})</option>`);
    });
}

function generateCustomerId() {
    let customerCount = customer_db.length + 1; // Increment based on customer count
    return `C-${String(customerCount).padStart(3, '0')}`; // Formats as C001, C002, etc.
}

