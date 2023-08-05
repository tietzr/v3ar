$(document).ready(function () {
  loadCartInfo();
});

const loadCartInfo = async () => {
  const cartInfo = getCartInfo();

  if (cartInfo.length == 0) {
    window.location.href = "/pages/cart";
    return;
  }

  const filter = {
    ids: cartInfo.map((item) => item.bookId),
  };

  const result = await makeRequest(`api/book/list`, "POST", {
    filter,
  });

  buildOrderItems(cartInfo, result.items);
};

const buildOrderItems = (cartInfo, booksInfo) => {
  $(".checkout-item").remove();

  let subTotal = 0;
  for (let cartItem of cartInfo) {
    const bookInfo = booksInfo.find((item) => item._id === cartItem.bookId);

    const itemTotal = parseFloat(bookInfo.price * parseInt(cartItem.quantity));
    const template = `<div class="d-flex justify-content-between ">
      <p>${bookInfo.title}</p>
      <p>$ ${itemTotal.toFixed(2)}</p>
    </div>`;

    subTotal += itemTotal;

    $("#checkoutItemsContainer").append(template);
  }

  $("#subtotalLabel").append(subTotal.toFixed(2));
  $("#totalLabel").append((subTotal + 10).toFixed(2));
};
