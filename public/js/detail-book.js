$(document).ready(function () {
  checkLoggedUserDetail();

  $("#bookEditButton").click(bookEditClick);
  $("#bookDeleteConfirmButton").click(bookDeleteConfimationClick);
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