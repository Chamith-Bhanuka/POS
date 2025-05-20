import {item_db} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";

function loadItems() {
    $('#item-tbody').empty();
    $('#availableItemsTable-tbody').empty();

    item_db.map((item, index) => {
        let code = item.itemId;
        let name = item.itemName;
        let itemQty = item.itemQty;
        let price = item.price;
        let description = item.description;

        let data = `<tr>
                                <td>${code}</td>
                                <td>${name}</td>
                                <td>${itemQty}</td>
                                <td>${price}</td>                            
                                <td>${description}</td>
                           </tr>`
        $('#item-tbody').append(data);

        let availableTblData  = `<tr>
                                            <td>${code}</td>
                                            <td>${name}</td>
                                            <td>${itemQty}</td>
                                            <td>
                                            <input type="number" class="form-control form-control-sm" min="1" value="1" id="quantity-${index}">
                                            </td>
                                            <td><button class="btn btn-sm btn-success add-to-cart" data-index="${index}">Add to Cart</button></td>                                                                                         
                                        </tr>`;
        $('#availableItemsTable-tbody').append(availableTblData);
    });

    //update the item count
    $('#itemCount').text(item_db.length);
}

//save item
$('#item-save').on('click', function(){

    console.log('item saved clicked');

    let code = $('#itemId').val();
    let name = $('#itemName').val();
    let price = $('#itemPrice').val();
    let qty = $('#itemQty').val();
    let description = $('#itemDescription').val();

    // Regular expressions for validation
    let namePattern = /^[A-Za-z ]{3,}$/; // Minimum 3 letters, allows spaces
    let pricePattern = /^\d+(\.\d{1,2})?$/; // Allows numbers with up to 2 decimal places
    let qtyPattern = /^[1-9]\d*$/; // Positive integers only (no zero)
    let descriptionPattern = /^.{10,}$/; // Minimum 10 characters for description

    let isValidName = namePattern.test(name);
    let isValidPrice = pricePattern.test(price);
    let isValidQty = qtyPattern.test(qty);
    let isValidDescription = descriptionPattern.test(description);

    $('#itemName').css('border-color', isValidName ? '#dee2e6' : 'red');
    $('#itemPrice').css('border-color', isValidPrice ? '#dee2e6' : 'red');
    $('#itemQty').css('border-color', isValidQty ? '#dee2e6' : 'red');
    $('#itemDescription').css('border-color', isValidDescription ? '#dee2e6' : 'red');

    if (isValidName && isValidPrice && isValidQty && isValidDescription) {
        let item_data = new ItemModel(code, name, qty, price, description);

        item_db.push(item_data);

        console.log(item_db);

        loadItems();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });

        let itemId = generateItemId();
        console.log(`Customer Id: ${itemId}`);
        $("#itemId").val(itemId).prop("readonly", true);

        $('#itemName').val('');
        $('#itemPrice').val('');
        $('#itemQty').val('');
        $('#itemDescription').val('');

        $("#item-save").prop("disabled", false);
        $("#item-update").prop("disabled", true);
        $("#item-delete").prop("disabled", true);

    } else {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    }
});

//select from table

let selectedIndex = -1;

$('#item-tbody').on('click', 'tr', function(){
    selectedIndex = $(this).index();
    console.log(selectedIndex);

    let obj = item_db[selectedIndex];
    console.log(obj);

    let name = obj.itemName;
    let code = obj.itemId;
    let qty = obj.itemQty;
    let price = obj.price;
    let description = obj.description;

    $('#itemName').val(name);
    $('#itemId').val(code);
    $('#itemPrice').val(price);
    $('#itemQty').val(qty);
    $('#itemDescription').val(description);

    $('#item-save').prop('disabled', true);
    $('#item-update').prop('disabled', false);
    $('#item-delete').prop('disabled', false);

})

//update
$('#item-update').on('click', function(){
    if (selectedIndex !== -1) {
        let name = $('#itemName').val();
        let id = $('#itemId').val();
        let price = $('#itemPrice').val();
        let qty = $('#itemQty').val();
        let description = $('#itemDescription').val();

        // Regular expressions for validation
        let namePattern = /^[A-Za-z ]{3,}$/; // Minimum 3 letters, allows spaces
        let pricePattern = /^\d+(\.\d{1,2})?$/; // Allows numbers with up to 2 decimal places
        let qtyPattern = /^[1-9]\d*$/; // Positive integers only (no zero)
        let descriptionPattern = /^.{10,}$/; // Minimum 10 characters for description

        let isValidName = namePattern.test(name);
        let isValidPrice = pricePattern.test(price);
        let isValidQty = qtyPattern.test(qty);
        let isValidDescription = descriptionPattern.test(description);

        $('#itemName').css('border-color', isValidName ? '#dee2e6' : 'red');
        $('#itemPrice').css('border-color', isValidPrice ? '#dee2e6' : 'red');
        $('#itemQty').css('border-color', isValidQty ? '#dee2e6' : 'red');
        $('#itemDescription').css('border-color', isValidDescription ? '#dee2e6' : 'red');

        if (isValidName && isValidPrice && isValidQty && isValidDescription) {
            console.log("item that update: " + name, id, price, qty, description);

            item_db[selectedIndex].itemName = name;
            item_db[selectedIndex].itemId = id;
            item_db[selectedIndex].price = price;
            item_db[selectedIndex].itemQty = qty;
            item_db[selectedIndex].description = description;

            loadItems();

            Swal.fire({
                title: "Updated Successfully!",
                icon: "success",
                draggable: true
            });

            let itemId = generateItemId();
            console.log(`Customer Id: ${itemId}`);
            $("#itemId").val(itemId).prop("readonly", true);

            $('#itemName').val('');
            $('#itemPrice').val('');
            $('#itemQty').val('');
            $('#itemDescription').val('');

            selectedIndex = -1;

            $("#item-save").prop("disabled", false);
            $("#item-update").prop("disabled", true);
            $("#item-delete").prop("disabled", true);
        } else {
            Swal.fire({
                title: 'Error!',
                text: 'Invalid Inputs',
                icon: 'error',
                confirmButtonText: 'Ok'
            })
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
$('#item-delete').on('click', function(){

    if (selectedIndex !== -1) {

        Swal.fire({
            title: "Do you want to delete this Item?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Delete",
            denyButtonText: `Don't Delete`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                item_db.splice(selectedIndex, 1);
                loadItems();

                $('#itemName').val('');
                $('#itemId').val('');
                $('#itemPrice').val('');
                $('#itemQty').val('');
                $('#itemDescription').val('');

                selectedIndex = -1;

                $("#item-save").prop("disabled", false);
                $("#item-update").prop("disabled", true);
                $("#item-delete").prop("disabled", true);
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

$('#item-reset').on('click', function(){
    let itemId = generateItemId();
    console.log(`Customer Id: ${itemId}`);
    $("#itemId").val(itemId).prop("readonly", true);

    $('#itemName').val('');
    $('#itemPrice').val('');
    $('#itemQty').val('');
    $('#itemDescription').val('');

    $("#item-save").prop("disabled", false);
    $("#item-update").prop("disabled", true);
    $("#item-delete").prop("disabled", true);
});

$(document).ready(function() {
    let itemId = generateItemId();
    console.log(`Customer Id: ${itemId}`);
    $("#itemId").val(itemId).prop("readonly", true);

    $("#item-save").prop("disabled", false);
    $("#item-update").prop("disabled", true);
    $("#item-delete").prop("disabled", true);
});

function generateItemId() {
    let customerCount = item_db.length + 1; // Increment based on customer count
    return `I-${String(customerCount).padStart(3, '0')}`; // Formats as C001, C002, etc.
}