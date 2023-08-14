var selectAuthors;
var selectGenres;

$(document).ready(function () {
  // Only admin users can add new books
  if (!isLoggedUserAdmin()){
    window.location.href = "/";
    return;
  }

  loadGenres();

  $("#addBookForm").submit(onAddFormSubmit);

  $("#coverURL").change(updateCoverThumbnail);

  selectAuthors = $('#select-authors').selectize({
    maxItems: null,
    valueField: 'name',
    labelField: 'name',
    searchField: 'name',
    create: true
  });

  $('#bookDescription').richText({
    imageUpload: false,
    fileUpload: false,
    videoEmbed: false,
    urls: false,
    table: false,
    removeStyles: false,
  })[0];
});

/**
 * Data Load Section
 * Interacting with the back-end to get/send data
 */
const loadGenres = async () => {
  const genres = await makeRequest(`api/genres`);

  selectGenres = $('#select-genres').selectize({
    maxItems: null,
    valueField: 'name',
    labelField: 'name',
    searchField: 'name',
    options: genres,
    create: false
  });
};

const onAddFormSubmit = async (event) => {
  const formData = new FormData(event.currentTarget);
  const jsonData = Object.fromEntries(formData.entries());

  jsonData.authors = selectAuthors[0].selectize.getValue();
  jsonData.genres = selectGenres[0].selectize.getValue();
  jsonData.description = $('#bookDescription').val();
  console.log(jsonData);

  const result = await makeRequest("api/book/add", "POST", jsonData);
  console.log(result);

  if (hasError(result, "addBookError")){
    return;
  }
  window.location.href = "/pages/detail/" + result._id;
}

const updateCoverThumbnail = (event) => {
  $("#coverThumbnail").attr("src", event.currentTarget.value);
}