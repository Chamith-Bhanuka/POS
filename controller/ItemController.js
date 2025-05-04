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