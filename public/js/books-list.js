$(document).ready(function () {
  loadGenres();
  loadBooks();
});

const loadBooks = async (page = 0, numItems = 20, sort = "title") => {

  const filter = { genres: getGenreFilter() };
  const result = await makeRequest(`api/book/list`, "POST", {
    filter,
    page,
    items: numItems,
    sort,
  });

  $(".product-item").remove();
  result.forEach((bookItem) => {
    buildBookItem(bookItem);
  });
};

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
  $("#bookListContainer").append(bookTemplate);
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

const loadGenres = async () => {
  const result = await makeRequest(`api/book/genres`);

  $(".genre-filter-item").remove();
  result.forEach((genreItems) => {
    buildGenreItem(genreItems);
  });

  $(".genre-filter-input").change(loadBooks);
};

const getGenreFilter = (event) => {
  const filterItems = $(".genre-filter-input:checked");

  const selectedGenres = [];
  for (let item of filterItems) {
    selectedGenres.push(item.attributes["genre-filter"].value);
  }

  return selectedGenres;
};
