// hide progress loading bar on load
$('.progress').hide();

// init all buttons
$(document).ready(function () {

    // search for item
    $(document).on('click', '#search-button', function (event) {
        event.preventDefault();
        $('.progress').show();
        const searchInput = $('#search-input').val().trim();
        validateSearchQuery(searchInput);
    });

    // save item to favorites
    $(document).on('click', '.saveItem', function (event) {
        event.preventDefault();
        $('.progress').show();
        const saveItem = $(this).data('save-item');
        save(saveItem);
    });

    // unsave an item
    $(document).on('click', '.removeItem', function (event) {
        event.preventDefault();
        $('.progress').show();
        const unsaveItem = $(this).data('save-item');
        unsave(unsaveItem);
    });

    // clear out all unsaved items from db
    $(document).on('click', '#clear-button', function (event) {
        event.preventDefault();
        $('.progress').show();
        clearDB();
    });

    // init tap menu
    $('.tap-target').tapTarget();
});

// check if search is empty or is only a number
function validateSearchQuery(searchInput) {
    if (searchInput === '' || !isNaN(searchInput)) {
        $('.progress').hide();
        M.toast({ html: 'Cannot be an empty string or a number!' });
        return $('#results-swipe').text('Cannot be an empty string or a number!');
    } else {
        postSearchQuery(searchInput);
    }
};

// send search query to /search
function postSearchQuery(validatedSearch) {
    M.toast({ html: `Searching for deals on ${validatedSearch}` });

    axios({
        method: 'post',
        url: '/search',
        data: {
            searchQuery: validatedSearch
        }
    }).then(function (response) {
        location.reload();
    }).catch(function (err) {
        if (err) throw err;
    });
};

// save item to favorites
function save(saveItem) {
    M.toast({ html: `Saving ${saveItem}...` });

    axios({
        method: 'put',
        url: `/save/${saveItem}`
    }).then(function (response) {
        location.reload();
    }).catch(function (err) {
        if (err) throw err;
    });
};

// remove item from favorites
function unsave(removeItem) {
    M.toast({ html: `Removing ${removeItem}...` });

    axios({
        method: 'put',
        url: `/remove/${removeItem}`
    }).then(function (response) {
        location.reload();
    }).catch(function (err) {
        if (err) throw err;
    });
};

// delete all unsaved items
function clearDB() {
    M.toast({ html: `Clearing out unsaved...` });

    axios({
        method: 'delete',
        url: `/delete/`
    }).then(function (response) {
        location.reload();
    }).catch(function (err) {
        if (err) throw err;
    });
};