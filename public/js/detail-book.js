$(document).ready(function () {
  checkLoggedUserDetail();
  fetchBookDetails();
  $("#bookEditButton").click(bookEditClick);
  $("#bookDeleteConfirmButton").click(bookDeleteConfimationClick);

  $("#addToCartButton").click(addToCartClick);
  $(".quantity button").click(updateBookQuantityClick);
});


/**
 * Event Section
 * Handling events for page HTML elements
 */
const fetchBookDetails = async () => {
  const bookId = getBookIdFromUrl();
  const book = await makeRequest(`api/book/${bookId}`, "GET");
  $("#bookName").html(book.title);
  $("#bookSubtitle").html(book.subtitle);
  $("#bookPrice").html(book.price.toFixed(2));
  $("#bookPages").html(book.pages);
  $("#bookAuthors").html(book.authors.join(" | "));
  $("#bookCover img").attr("src", book.coverURL);
  $("#bookDescription").html(book.description);

  const relDate = new Date(book.releaseDate);
  const formattedReleaseDate = relDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  $("#bookRelease").html(" " + formattedReleaseDate);
  $("#bookGenre").html(book.genres.join(" | "));

  // Display star ratings dynamically
  const ratingContainer = $("#bookRating");
  ratingContainer.attr("title", book.rating + " out of 5 stars");
  ratingContainer.css("--percent", `calc(${book.rating}/5*100%)`);
};


const bookEditClick = () => {
  window.location.href = "/pages/edit-book/" + getBookIdFromUrl();
}

const bookDeleteConfimationClick = async () => {
  await makeRequest("api/book/" + getBookIdFromUrl(), "delete");
  window.location.href = "/";
}

const addToCartClick = async () => {
  const bookId = getBookIdFromUrl();
  const cartInfo = getCartInfo();
  cartInfo.push({ id: Date.now().toString(), bookId, quantity: $("#cartDetailsQuantity").val() });

  window.localStorage.setItem("bookshelf@cart", JSON.stringify(cartInfo));

  updateCartCounter();
  shakeCart();
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
  if (isLoggedUserAdmin()) {
    $("#bookAdminSection").show();
  } else {
    $("#bookAdminSection").hide();
  }
};