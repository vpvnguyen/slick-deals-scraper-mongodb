$('.progress').hide();

$(document).ready(function () {
    $(document).on('click', '#search-button', function (event) {
        event.preventDefault();
        $('.progress').show();

        const searchInput = $('#search-input').val().trim();
        console.log(`searchQuery: ${searchInput}`);
        validateSearchQuery(searchInput);
    });

    $(document).on('click', '.saveItem', function (event) {
        event.preventDefault();
        $('.progress').show();

        console.log('save!');
        const saveItem = $(this).data('save-item');
        console.log(`saving item: ${saveItem}`);
        save(saveItem);
    });

    $(document).on('click', '#saved-swipe', function (event) {
        event.preventDefault();
        $('.progress').show();
    });

    $(document).on('click', '.removeItem', function (event) {
        event.preventDefault();
        $('.progress').show();


        console.log('save!');
        const unsaveItem = $(this).data('save-item');
        console.log(`saving item: ${unsaveItem}`);
        unsave(unsaveItem);
    });
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
    })
};

function save(saveItem) {
    M.toast({ html: `Saving ${saveItem}...` });

    axios({
        method: 'put',
        url: `/save/${saveItem}`
    }).then(function (response) {
        location.reload();
    }).catch(function (err) {
        if (err) throw err;
    })
};

function unsave(removeItem) {
    M.toast({ html: `Removing ${removeItem}...` });

    axios({
        method: 'put',
        url: `/remove/${removeItem}`
    }).then(function (response) {
        location.reload();
    }).catch(function (err) {
        if (err) throw err;
    })
};