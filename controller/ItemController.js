import {item_db} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";

function loadItems() {
    $('#item-tbody').empty();

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
    });
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