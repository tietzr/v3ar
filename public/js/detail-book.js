$(document).ready(function () {
  checkLoggedUserDetail();

  $("#bookEditButton").click(bookEditClick);
  $("#bookDeleteConfirmButton").click(bookDeleteConfimationClick);

  $("#addToCartButton").click(addToCartClick);
  $(".quantity button").click(updateBookQuantityClick);
});

/**
 * Event Section
 * Handling events for page HTML elements
 */

const bookEditClick = (event) => {
  window.location.href = "/pages/edit-book/" + getBookIdFromUrl();
}

const bookDeleteConfimationClick = async (event) => {
  await makeRequest("api/book/" + getBookIdFromUrl(), "delete");
  window.location.href = "/";
}

const addToCartClick = async (event) => {
  const bookId = getBookIdFromUrl();
  const cartInfo = getCartInfo();
  cartInfo.push({ id: Date.now().toString(), bookId, quantity: $("#cartDetailsQuantity").val() } );
  
  window.localStorage.setItem("bookshelf@cart", JSON.stringify(cartInfo));  

  updateCartCounter();
}

const updateBookQuantityClick = (event) => {
  const button = $(event.currentTarget);
  const currentValue = $("#cartDetailsQuantity").val();
  let newValue = parseFloat(currentValue);
  if (button.hasClass("btn-plus")) {
    newValue = newValue + 1;
  } else {
    newValue = newValue - 1;
  }
  $("#cartDetailsQuantity").val(newValue > 0 ? newValue : 1);
}
/**
 * Util Section
 * Util methods to handle page specific logic
 */

const getBookIdFromUrl = () => {
  const urlParts = window.location.pathname.split("/");
  const idIndex = urlParts.indexOf("detail") + 1;

  return urlParts[idIndex];
}

const checkLoggedUserDetail = () => {
  if (isLoggedUserAdmin()){
    $("#bookAdminSection").show();
  } else {
    $("#bookAdminSection").hide();
  }
};