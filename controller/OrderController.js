import {order_details, item_db} from "../db/db.js";

$(document).on("click", ".add-to-cart", function() {
    console.log("add to cart clicked");
    let index = $(this).data("index");
    console.log(index);
    addToCart(index);
});

function addToCart(index) {
    let item = item_db[index];
    let price = parseFloat(item.price);

    if (isNaN(price)) {
        console.error(`Invalid price for item ${item.itemName}:`, item.price);
        return;
    }

    let quantity = parseInt($(`#quantity-${index}`).val());
    let subtotal = (quantity * price).toFixed(2);

    // Check if the item already exists in the order_details array
    let existingItem = order_details.find(orderItem => orderItem.itemId === item.itemId);

    if (existingItem) {
        // Update quantity and subtotal if the item exists
        existingItem.quantity += quantity;
        existingItem.subtotal = (existingItem.quantity * price).toFixed(2);
    } else {
        // Add a new item to the order_details array
        order_details.push({
            index: index + 1,
            itemName: item.itemName,
            quantity: quantity,
            price: price.toFixed(2),
            subtotal: subtotal,
            itemId: item.itemId
        });
    }

    console.log("Order Details:", order_details); // Debugging output

    // Update table row
    let existingRow = $(`#orderCartTable tr[data-id='${item.itemId}']`);
    if (existingRow.length > 0) {
        existingRow.find(".cart-qty").text(existingItem.quantity);
        existingRow.find(".cart-subtotal").text(existingItem.subtotal);
    } else {
        let newRow = `<tr data-id="${item.itemId}">
                        <td>${index + 1}</td>
                        <td>${item.itemName}</td>
                        <td class="cart-qty">${quantity}</td>
                        <td>${price.toFixed(2)}</td>
                        <td class="cart-subtotal">${subtotal}</td>
                        <td><button class="btn btn-sm btn-danger remove-item" data-id="${item.itemId}">Remove</button>
</td>
                     </tr>`;
        $('#orderCartTable').append(newRow);
    }
}


function removeItem(itemId) {
    $(`#orderCartTable tr[data-id='${itemId}']`).remove();

    let indexToRemove = order_details.findIndex(orderItem => orderItem.itemId === itemId);
    if (indexToRemove !== -1) {
        order_details.splice(indexToRemove, 1); // Remove item without reassignment
    }

    console.log("Updated Order Details:", order_details);
}

$(document).on("click", ".remove-item", function() {
    let itemId = $(this).data("id");
    removeItem(itemId); // Call the function properly
});

$(document).on("click", ".btn-cart-reset", function() {
    console.log('cart reset clicked');
    $("#orderCartTable").empty(); // Clears all rows inside the cart table
});

$(document).on("click", ".btn-place-order", function() {
    if ($("#orderCartTable").children().length === 0) {

        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Your order cart is empty! Please add items before placing an order",
        });
        return; // Stop execution
    }

    console.log('place order clicked');
    $("#collapseItems").collapse("hide"); // Hide Group 1 (Available Items & Cart)
    $("#collapseOrderInfo").collapse("show"); // Show Group 2 (Order Info & Invoice)
});

