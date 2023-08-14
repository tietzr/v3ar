var selectAuthors;
var selectGenres;

$(document).ready(function () {
  // Only admin users can add new books
  if (!isLoggedUserAdmin()){
    window.location.href = "/";
    return;
  }

  fetchBookDetails();
  $("#coverURL").change(updateCoverThumbnail);
  $("#updateBookForm").submit(onUpdateFormSubmit);
});

/**
 * Event Section
 * Handling events for page HTML elements
 */
const fetchBookDetails = async () => {
  const bookId = getBookIdFromUrl();

  const book = await makeRequest(`api/book/${bookId}`, "GET");

  $("#title").val(book.title);
  $("#subtitle").val(book.subtitle);
  const relDate = getFormattedDate(book.releaseDate);
  $("#bookRelease").val(relDate);

  $("#bookDescription").val(book.description);

  $("#bookDescription").richText({
    imageUpload: false,
    fileUpload: false,
    videoEmbed: false,
    urls: false,
    table: false,
    removeStyles: false,
  });
  
  // Author's selectize
  selectAuthors = $('#select-authors').selectize({
    maxItems: null,
    valueField: 'name',
    labelField: 'name',
    searchField: 'name',
    create: true,
    options: book.authors.map(item => ({ name: item })),
  })[0].selectize;
  
  selectAuthors.setValue(book.authors);

  // Genres Selectize
  loadGenres(book);

  $("#pageNumber").val(book.pages);
  $("#price").val(book.price.toFixed(2));
  $("#isbn").val(book.isbn);
  $("#rating").val(book.rating);
  $("#coverURL").val(book.coverURL);
  $("#coverThumbnail").attr("src", book.coverURL);
};

const getBookIdFromUrl = () => {
  const urlParts = window.location.pathname.split("/");
  const idIndex = urlParts.indexOf("edit-book") + 1;
  return urlParts[idIndex];
};

const getFormattedDate = (releaseDate) => {
  const relDate = new Date(releaseDate);
  return (
    relDate.getFullYear() +
    "-" +
    ("0" + (relDate.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + relDate.getDate()).slice(-2)
  );
};
/**
 * Data Load Section
 * Interacting with the back-end to get/send data
 */
const loadGenres = async (book) => {
  const genres = await makeRequest(`api/genres`);

  selectGenres = $("#select-genres").selectize({
    maxItems: null,
    valueField: "name",
    labelField: "name",
    searchField: "name",
    options: genres,
    create: false,
  })[0].selectize;

  selectGenres.setValue(book.genres);
};

const onUpdateFormSubmit = async (event) => {
  const formData = new FormData(event.currentTarget);
  const jsonData = Object.fromEntries(formData.entries());

  jsonData.authors = selectAuthors.getValue();
  jsonData.genres = selectGenres.getValue();
  jsonData.description = $("#bookDescription").val();

  const result = await makeRequest("api/book/" + getBookIdFromUrl(), "PATCH", jsonData);

  if (hasError(result, "updateBookError")) {
    return;
  }
  window.location.href = "/pages/detail/" + result._id;
};

const updateCoverThumbnail = (event) => {
    $("#coverThumbnail").attr("src", event.currentTarget.value);
}