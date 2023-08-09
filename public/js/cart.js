$(document).ready(function () {
    loadCartInfo();

});

var bookData;
const loadCartInfo = async () => {
    const cartInfo = getCartInfo();

    const filter = {
        ids: cartInfo.map((item) => item.bookId),
    };

    const result = await makeRequest(`api/book/list`, "POST", {
        filter,
    });
    bookData = result.items;
    displayitem(cartInfo, result.items);
    updateTotal();

};


const displayitem = (cartInfo, booksInfo) => {

    for (let cartItem of cartInfo) {
        const bookInfo = booksInfo.find((item) => item._id === cartItem.bookId);

        const itemTotal = parseFloat(bookInfo.price * parseInt(cartItem.quantity));
        const template = `     
       <tr>
      <td class="text-left"><img src="${bookInfo.coverURL}" class="ml-5 mr-2" alt="" style="width: 50px;"> ${bookInfo.title}</td>
      <td class="align-middle">$ ${bookInfo.price.toFixed(2)}</td>
      <td class="align-middle">
          <div class="input-group quantity mx-auto" style="width: 100px;">
              <div class="input-group-btn">
                  <button class="btn btn-sm btn-primary btn-minus" >
                  <i class="fa fa-minus"></i>
                  </button>
              </div>
              <input type="text" id="cartDetailsQuantity" class="form-control  form-control-sm bg-secondary border-0 text-center" value="${cartItem.quantity}" bookId="${cartItem.id}">
              <div class="input-group-btn">
                  <button class="btn btn-sm btn-primary btn-plus">
                      <i class="fa fa-plus"></i>
                  </button>
              </div>
          </div>
      </td>
      <td class="align-middle"> $ ${itemTotal.toFixed(2)}</td>
      <td class="align-middle"><button class="btn btn-sm btn-danger remove-item" bookId="${cartItem.id}"><i class="fa fa-times"></i></button></td>
  </tr>`

        $("#cartItemsContainer").append(template);
    }
    $(".quantity button").click(updateBookQuantity);
    $(".remove-item").click(removeBookItem);
}

const updateBookQuantity = (event) => {
    const button = $(event.currentTarget);
    // const currentValue = $(button.parent().prev()).val();
    let newValue;
    let input;
    if (button.hasClass("btn-plus")) {
        input = button.parent().prev();
        const currentValue = $(input).val();
        newValue = parseFloat(currentValue) + 1;

    } else {
        input = button.parent().next();
        const currentValue = $(input).val();
        newValue = parseFloat(currentValue) - 1;

    }
    $(input).val(newValue > 0 ? newValue : 1);


    const getValue = input[0].attributes["bookId"].value;
    const cartInfo = getCartInfo();
    const cartItemIndex = cartInfo.findIndex((item) => item.id === getValue);

    const bookInfo = bookData.find((item) => cartInfo[cartItemIndex].bookId === item._id);
    const itemTotal = parseFloat(bookInfo.price * parseInt(input.val()));

    input.parents("td").next().html("$ " + itemTotal.toFixed(2));

    cartInfo[cartItemIndex].quantity = parseInt(input.val());
    window.localStorage.setItem("bookshelf@cart", JSON.stringify(cartInfo));

    updateTotal();
}

const updateTotal = () => {
    const cartInfo = getCartInfo();
    var subTotal = 0;
    for (let cartItem of cartInfo) {
        const bookInfo = bookData.find((item) => item._id === cartItem.bookId);

        const itemTotal = parseFloat(bookInfo.price * parseInt(cartItem.quantity));
        subTotal += itemTotal;
    }
    $("#subtotal").html("$ " + subTotal.toFixed(2));
    $("#totalLabel").html("$ " + (subTotal + 10).toFixed(2));

}
const removeBookItem = (event) => {
    const cartInfo = getCartInfo();
    const getValue = event.currentTarget.attributes["bookId"].value;
    const newCartInfo = cartInfo.filter((item) => item.id !== getValue);
    window.localStorage.setItem("bookshelf@cart", JSON.stringify(newCartInfo));
    $(event.currentTarget).parents("tr").remove();
    updateTotal();
}