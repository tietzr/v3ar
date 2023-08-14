var selectAuthors;
var selectGenres;

$(document).ready(function(){
    checkLoggedUserDetail();
    fetchBookDetails();
    loadGenres();
    $("#updateBookForm").submit(onUpdateFormSubmit);
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
 * Event Section
 * Handling events for page HTML elements
 */
const fetchBookDetails = async () => {
    const bookId = getBookIdFromUrl();
    
    const book = await makeRequest(`api/book/${bookId}`, "GET");
    console.log(book);
    $("#title").val(book.title);
    $("#subtitle").val(book.subtitle);
    const relDate = getFormattedDate(book.releaseDate);  
    $("#bookRelease").val(relDate);
    // Author's selectize 
    var $select_authors = $('#select-authors').selectize();
    var selectize = $select_authors[0].selectize;
    const author_arr = [];
    for (var i = 0; i < book.authors.length; i++) {
        author_arr.push({
            text:  book.authors[i],
            value:  book.authors[i]
        });
    }
    selectize.addOption(author_arr);
    selectize.setValue(book.authors);
    // Genres Selectize
    const genres = await makeRequest(`api/genres`);
    var $select_genres = $('#select-genres').selectize({
        options: genres
    });
    var selectize = $select_genres[0].selectize;
    const genres_arr = [];
    for (var i = 0; i < book.genres.length; i++) {
        genres_arr.push({
            text:  book.genres[i],
            value:  book.genres[i]
        });
    }
    selectize.addOption(genres_arr);
    selectize.setValue(book.genres);


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
}

const checkLoggedUserDetail = () => {
    if (isLoggedUserAdmin()) {
        $("#bookAdminSection").show();
    } else {
        $("#bookAdminSection").hide();
    }
};

const getFormattedDate = (releaseDate) => {;
    const relDate = new Date(releaseDate);
    return relDate.getFullYear()+"-"+("0"+(relDate.getMonth()+1)).slice(-2)+"-"+("0" + relDate.getDate()).slice(-2);
}
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
const onUpdateFormSubmit  = async (event) => {
    const formData = new FormData(event.currentTarget);
    const jsonData = Object.fromEntries(formData.entries());

    jsonData.authors = selectAuthors[0].selectize.getValue();
    jsonData.genres = selectGenres[0].selectize.getValue();
    jsonData.description = $('#bookDescription').val();
    console.log(jsonData);

    const result = await makeRequest("api/book/update", "POST", jsonData);
    console.log(result);

    if (hasError(result, "updateBookError")){
        return;
    }
    window.location.href = "/pages/detail/" + result._id;
}


  