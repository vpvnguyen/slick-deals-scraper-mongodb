$(document).ready(function () {
    $(document).on('click', '#search-button', function (event) {
        event.preventDefault();

        console.log('compare!');
        const searchInput = $('#search-input').val().trim();

        console.log(`searchQuery: ${searchInput}`);
        validateSearchQuery(searchInput);
    });

    $(document).on('click', '.saveItem', function (event) {
        event.preventDefault();

        console.log('save!');
        const saveItem = $(this).data('save-item');
        console.log(`saving item: ${saveItem}`);
        save(saveItem);
    });

    $(document).on('click', '#saved-swipe', function (event) {
        event.preventDefault();
    });

    $(document).on('click', '.removeItem', function (event) {
        event.preventDefault();

        console.log('save!');
        const unsaveItem = $(this).data('save-item');
        console.log(`saving item: ${unsaveItem}`);
        unsave(unsaveItem);
    });
});

// check if search is empty or is only a number
function validateSearchQuery(searchInput) {
    if (searchInput === '' || !isNaN(searchInput)) {
        console.log('cannot be an empty string or a number!');
        return $('#results-swipe').text('Cannot be an empty string or a number!');
    } else {
        $('#results-swipe').text(`Searching for ${searchInput}`);
        postSearchQuery(searchInput);
    }
};

// send search query to /search
function postSearchQuery(validatedSearch) {
    axios({
        method: 'post',
        url: '/search',
        data: {
            searchQuery: validatedSearch
        }
    }).catch(function (err) {
        if (err) throw err;
    })
};

function save(saveItem) {
    axios({
        method: 'put',
        url: `/save/${saveItem}`
    }).catch(function (err) {
        if (err) throw err;
    })
};

function unsave(removeItem) {
    axios({
        method: 'put',
        url: `/remove/${removeItem}`
    }).catch(function (err) {
        if (err) throw err;
    })
};