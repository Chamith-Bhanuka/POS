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
    });

    // Update the customer count
    $('#customerCount').text(customer_db.length);
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

        $("#student-save").prop("disabled", false);
        $("#student-update").prop("disabled", true);
        $("#student-delete").prop("disabled", true);
    }

});

let selectedIndex = -1;

$('#customer-tbody').on('click','tr', function(){
    selectedIndex = $(this).index();
    console.log(selectedIndex);

    let obj = customer_db[selectedIndex];
    console.log(obj);

    let name  = obj.custFullName;
    let email = obj.custEmail;
    let phone = obj.custPhone;
    let address = obj.custAddress;

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
    $("#customer-save").prop("disabled", false);
    $("#customer-update").prop("disabled", true);
    $("#customer-delete").prop("disabled", true);
});


