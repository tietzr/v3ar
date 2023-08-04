$(document).ready(function () {
  loadGenres();
  loadBooks();

  /// Adding necessary events to the HTML elements
  $(".price-filter-input").change(loadBooks);
  $("#itemsPerPageInput").change(loadBooks);
  $("#sortingInput").change(loadBooks);
  $("#paginationPrevious").click(paginationPreviousClick);
  $("#paginationNext").click(paginationNextClick);

  $("#booksSearchInput").keyup((event) => { 
    if(event.which == 13) {
      loadBooks();
    }
  });
  $("#booksSearchButton").click(loadBooks);
});

/**
 * Data Load Section
 * Interacting with the back-end to get data / finding the necessary data to filter in the html page
 */

const loadBooks = async () => {
  const filter = {
    genres: getGenreFilter(),
    prices: getPriceFilter(),
    search: getSearchFilter(),
  };

  const items = $("#itemsPerPageInput")[0].value;
  const sort = $("#sortingInput")[0].value;
  const page =
    $(".page-item-button.active")[0]?.attributes["page-number"].value ?? 1;

  const result = await makeRequest(`api/book/list`, "POST", {
    filter,
    page,
    items,
    sort,
  });

  buildBooksList(result.items);
  buildPagination(result.total, page, items);

  window.scrollTo({ top: 0, behavior: "smooth" });
};

const loadGenres = async () => {
  const result = await makeRequest(`api/book/genres`);

  $(".genre-filter-item").remove();
  result.forEach((genreItems) => {
    buildGenreItem(genreItems);
  });

  $(".genre-filter-input").change(loadBooks);
};

const getGenreFilter = () => {
  const filterItems = $(".genre-filter-input:checked");

  const selectedGenres = [];
  for (let item of filterItems) {
    selectedGenres.push(item.attributes["genre-filter"].value);
  }

  return selectedGenres;
};

const getPriceFilter = () => {
  const filterItems = $(".price-filter-input:checked");

  const selectedPrices = [];
  for (let item of filterItems) {
    selectedPrices.push({
      min: item.attributes["price-min"].value,
      max: item.attributes["price-max"].value,
    });
  }

  return selectedPrices;
};

const getSearchFilter = () => {
  const filter = $("#booksSearchInput").val();
  return filter ?? "";
}

/**
 * Events Section
 * Handling events for elements
 */

const paginationClick = (event) => {
  $(".page-item-button.active").removeClass("active");
  $(event.currentTarget).addClass("active");

  loadBooks();
};


const paginationNextClick = (event) => {
  if ($(event.currentTarget).prev().hasClass("active")) {
    return;
  }
  const selectedPage = $(".page-item-button.active");
  selectedPage.next().addClass("active");

  selectedPage.removeClass("active");

  loadBooks();
};

const paginationPreviousClick = (event) => {
  if ($(event.currentTarget).next().hasClass("active")) {
    return;
  }
  const selectedPage = $(".page-item-button.active");
  selectedPage.prev().addClass("active");

  selectedPage.removeClass("active");

  loadBooks();
};

/**
 * Template Section
 * Building HTML templates for list items
 */

const buildBooksList = (items) => {
  $(".product-item").remove();
  $("#emptyListMessage").hide();
  $("#paginationContainer").show();

  if (items.length == 0){
    $("#paginationContainer").hide();
    $("#emptyListMessage").show();
    return;
  }

  for (let bookItem of items) {
    buildBookItem(bookItem);
  }    
}

const buildBookItem = (bookItem) => {
  const bookTemplate = `
  <div class="col-lg-4 col-md-6 col-sm-6 pb-1 product-item">
    <div class="bg-light mb-4">
        <div class="product-img position-relative overflow-hidden">
            <img class="img-fluid cover-img" src="${bookItem.coverURL}" alt="">
        </div>
        <div class="text-center py-4">
            <div class="h6 text-decoration-none px-3" href="">${
              bookItem.title
            }</div>
            <div class="d-flex align-items-center justify-content-center mt-2">
                <h5 style="margin-bottom: 0;">$ ${bookItem.price.toFixed(
                  2
                )}</h5>
            </div>
            <div class="d-flex align-items-center justify-content-center">
                <meter class="average-rating" min="0" max="5"
                        title="${
                          bookItem.rating
                        } out of 5 stars" style="--percent: calc(${
    bookItem.rating
  }/5*100%);">starstarts</meter>
            </div>
        </div>
    </div>
  </div>
  `;
  $(bookTemplate).insertBefore("#paginationContainer");
};

const buildGenreItem = (genre) => {
  const genreId = "genre" + Math.floor(Math.random() * 100000);
  const genreFilterTemplate = `
    <div
      class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3 genre-filter-item">
      <input type="checkbox" class="custom-control-input genre-filter-input" id="${genreId}" genre-filter="${genre.name}">
      <label class="custom-control-label" for="${genreId}">${genre.name}</label>
    </div>
  `;
  $("#genreFilterContainer").append(genreFilterTemplate);
};


const buildPagination = (total, page, items) => {
  $(".page-item-button").remove();

  const totalPages = total / items + 1;

  for (let pageItem = 1; pageItem < totalPages; pageItem++) {
    const template = `<li class="page-item page-item-button ${
      page == pageItem ? "active" : ""
    }" page-number="${pageItem}"><span class="page-link" href="#">${pageItem}</span></li>`;
    $(template).insertBefore("#paginationNext");
  }

  $(".page-item-button").click(paginationClick);
};