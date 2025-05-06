import {customer_db, item_db} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";

function loadItems() {
    $('#item-tbody').empty();
    $('#availableItemsTable-tbody').empty();

    item_db.map((item, index) => {
        let name = item.itemName;
        let code = item.itemId;
        let price = item.price;
        let category = item.category;
        let description = item.description;

        let data = `<tr>
                                <td>${index+1}</td>
                                <td>${name}</td>
                                <td>${code}</td>
                                <td>${price}</td>
                                <td>${category}</td>
                                <td>${description}</td>
                           </tr>`
        $('#item-tbody').append(data);

        let availableTblData  = `<tr>
                                            <td>${index + 1}</td>
                                            <td>${name}</td>
                                            <td>${price}</td>
                                            <td><button class="btn btn-sm btn-success">Add to Cart</button></td>
                                        </tr>`;
        $('#availableItemsTable-tbody').append(availableTblData);
    });

    //update the item count
    $('#itemCount').text(item_db.length);
}

//save item
$('#item-save').on('click', function(){

    console.log('item saved clicked');

    let name = $('#itemName').val();
    let code = $('#itemId').val();
    let price = $('#itemPrice').val();
    let category = $('#itemCategory').val();
    let description = $('#itemDescription').val();

    if (name === '' || code === '' || price === '' || category === '' || description === '') {
        Swal.fire({
            title: 'Error!',
            text: 'Invalid Inputs',
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    } else {
        let item_data = new ItemModel(name, code, price, category, description);

        item_db.push(item_data);

        console.log(item_db);

        loadItems();

        Swal.fire({
            title: "Added Successfully!",
            icon: "success",
            draggable: true
        });

        $('#itemName').val('');
        $('#itemId').val('');
        $('#itemPrice').val('');
        $('#itemCategory').val('');
        $('#itemDescription').val('');

        $("#item-save").prop("disabled", false);
        $("#item-update").prop("disabled", true);
        $("#item-delete").prop("disabled", true);
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
    let price = obj.price;
    let category = obj.category;
    let description = obj.description;

    $('#itemName').val(name);
    $('#itemId').val(code);
    $('#itemPrice').val(price);
    $('#itemCategory').val(category);
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
        let category = $('#itemCategory').val();
        let description = $('#itemDescription').val();

        console.log("item that update: " + name, id, price, category, description);

        item_db[selectedIndex].itemName = name;
        item_db[selectedIndex].itemId = id;
        item_db[selectedIndex].price = price;
        item_db[selectedIndex].category = category;
        item_db[selectedIndex].description = description;

        loadItems();

        Swal.fire({
            title: "Updated Successfully!",
            icon: "success",
            draggable: true
        });

        $('#itemName').val('');
        $('#itemId').val('');
        $('#itemPrice').val('');
        $('#itemCategory').val('');
        $('#itemDescription').val('');

        selectedIndex = -1;

        $("#item-save").prop("disabled", false);
        $("#item-update").prop("disabled", true);
        $("#item-delete").prop("disabled", true);
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
            title: "Do you want to delete this customer?",
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
                $('#itemCategory').val('');
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
    $("#item-save").prop("disabled", false);
    $("#item-update").prop("disabled", true);
    $("#item-delete").prop("disabled", true);
});

$(document).ready(function() {
    $("#item-save").prop("disabled", false);
    $("#item-update").prop("disabled", true);
    $("#item-delete").prop("disabled", true);
});
