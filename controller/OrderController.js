import {customer_db, orders, order_details, item_db} from "../db/db.js";

console.log("Customer Database:", customer_db);

function generateInvoiceNumber() {
    let invoiceCount = orders.length + 1; // Increment based on order count
    return `INV-${String(invoiceCount).padStart(3, '0')}`; // Formats as INV-001, INV-002, etc.
};

$(document).on("click", ".add-to-cart", function() {
    console.log("add to cart clicked");
    let index = $(this).data("index");
    console.log(index);
    addToCart(index);
});

function updateRow(itemId) {
    let row = $(`#availableItemsTable-tbody tr:has(td:contains(${itemId}))`);
    let item = item_db.find(i => i.itemId === itemId);
    row.find("td:eq(2)").text(item.itemQty); // Update Qty. On Hand column
}


function addToCart(index) {
    let item = item_db[index];
    let price = parseFloat(item.price);

    let availableQty = item.itemQty;
    console.log('Available Quantity', availableQty);

    if (isNaN(price)) {
        console.error(`Invalid price for item ${item.itemName}:`, item.price);
        return;
    }

    let quantity = parseInt($(`#quantity-${index}`).val());
    console.log('Quantity: ', quantity);

    if (quantity > availableQty) {
        Swal.fire({
            icon: "error",
            title: "Stock Error",
            text: `Only ${availableQty} units of ${item.itemName} are available.`,
        });
        return;
    } else {
        item_db[index].itemQty -= quantity;
        updateRow(item.itemId);
    }


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

//Place order clicked
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

    // Calculate total sum of subtotals
    let totalAmount = 0;
    $("#orderCartTable tr").each(function() {
        let subtotal = parseFloat($(this).find(".cart-subtotal").text()) || 0;
        totalAmount += subtotal;
    });

    // Set total amount to payment field and make it read-only
    $("#paymentAmount").val(totalAmount.toFixed(2)).prop("readonly", true);

    let invoiceNumber = generateInvoiceNumber();
    console.log(`Invoice Number: ${invoiceNumber}`);
    $("#invoiceNumber").val(invoiceNumber).prop("readonly", true);

    function getTodayDate() {
        let today = new Date();
        let yyyy = today.getFullYear();
        let mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        let dd = String(today.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    let todayDate = getTodayDate();
    $("#orderDate").val(todayDate).prop("readonly", true);


    //set that values to invoice
    $("#billInvoiceNumber").text(invoiceNumber);
    $("#billDate").text(todayDate);


    $("#collapseItems").collapse("hide"); // Hide Group 1 (Available Items & Cart)
    $("#collapseOrderInfo").collapse("show"); // Show Group 2 (Order Info & Invoice)
});


//confirm payment
$(document).on("click", ".btn-confirm-payment", function() {
    console.log("Confirm Payment clicked");

    // Get order details from the form

    let invoiceNumber = $("#invoiceNumber").val();

    let orderDate = $("#orderDate").val();
    console.log('date', orderDate);

    let customerName = $("#orderCustomer").val();
    console.log(customerName);

    let paymentMethod = $("#paymentMethod").val();
    console.log(paymentMethod);

    let finalAmount = parseFloat($("#paymentAmount").val());
    console.log(finalAmount);

    let discount = parseFloat($("#orderDiscount").val()) || 0;
    console.log(discount);

    // Ensure required fields are filled
    if (!invoiceNumber || !orderDate || !customerName || !paymentMethod || isNaN(finalAmount)) {
        Swal.fire({
            icon: "error",
            title: "Missing Info",
            text: "Please ensure all required fields are filled before confirming payment.",
        });
        return;
    }

    // Create order object
    let order = {
        invoiceNumber: invoiceNumber,
        orderDate: orderDate,
        customerName: customerName,
        paymentMethod: paymentMethod,
        finalAmount: finalAmount,
        discount: discount,
        orderItems: order_details
    };

    let timerInterval;
    Swal.fire({
        title: "Order Saving!",
        html: "I will close in <b></b> milliseconds.",
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const timer = Swal.getPopup().querySelector("b");
            timerInterval = setInterval(() => {
                timer.textContent = `${Swal.getTimerLeft()}`;
            }, 100);
        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log("I was closed by the timer");
        }
    });

    // Store order in the array
    orders.push(order);
    updateRevenue();

    console.log("Orders Array:", orders);

    loadItems();
    // Clear previous items
    $("#billItems ul").empty();

    // Loop through order_details and append to the list
    order_details.forEach(item => {
        let listItem = `<li><strong>${item.itemName}</strong> | Qty: <strong>${item.quantity}</strong> | Price: <strong>Rs ${item.price}</strong></li>`;
        $("#billItems ul").append(listItem);
    });

    console.log("Bill Items Updated:", order_details);

    // Calculate Net Amount after Discount
    let netAmount = (finalAmount - (finalAmount * discount / 100)).toFixed(2);

    // Update Invoice Preview
    $("#billCustomer").text(customerName);
    $("#billTotal").text(`Rs ${finalAmount.toFixed(2)}`);
    $("#billDiscount").text(`${discount}%`);
    $("#billBalance").text(`Rs ${netAmount}`);

    $("#total-transactions").text(orders.length);

    // Optionally, clear the cart and form
    $("#orderCartTable").empty();
    $("#orderInfoForm")[0].reset();

    // Switch to the Order Info & Invoice section
    $("#collapseItems").collapse("hide");
    $("#collapseOrderInfo").collapse("show");

    loadOrders();
});

$("#orderDiscount").on("input", function() {
    let discount = parseFloat($(this).val()) || 0;
    let totalAmount = parseFloat($("#paymentAmount").val()) || 0;

    let netTotal = (totalAmount - (totalAmount * discount / 100)).toFixed(2);

    $("#paymentAmount").val(netTotal);
});

$(document).on("click", "#invoice-print", function() {
    let invoiceContent = document.querySelector(".invoice-card").outerHTML;

    let printWindow = window.open("", "_blank");
    printWindow.document.write(`<html><head><title>Invoice</title></head><body>${invoiceContent}</body></html>`);
    printWindow.document.close();
    printWindow.print();
});

function updateRevenue() {
    let totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0);
    document.getElementById("revenue").textContent = totalRevenue.toFixed(2); // Set formatted total revenue
}

function loadItems() {
    $('#item-tbody').empty();

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
    });

    //update the item count
    $('#itemCount').text(item_db.length);
}

$('#setItemsBtn').on("click", function() {
    resetInvoice();
})

function resetInvoice() {
    $("#billCustomer").text('');
    $("#billTotal").text('');
    $("#billDiscount").text('');
    $("#billBalance").text('');
    $("#billItems ul").empty();
}

function loadOrders() {
    $('#historyTableTbody').empty();

    orders.map((item, index) => {
        let invoiceNumber = item.invoiceNumber;
        let date  = item.orderDate;
        let customer = item.customerName;
        let total = item.finalAmount;

        let data = `<tr>
                                <td>${index+1}</td>
                                <td>${invoiceNumber}</td>
                                <td>${date}</td>
                                <td>${customer}</td>
                                <td>${total}</td>
                          </tr>`
        $('#historyTableTbody').append(data);
    });
}

$('#itemSearch').on('input', function () {
    let searchId = $(this).val().trim();

    $('#availableItemsTable-tbody tr').each(function () {
        let rowItemId = $(this).find('td:first').text().trim();

        if (searchId === '') {
            $(this).show();
        } else if (rowItemId === searchId) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});
