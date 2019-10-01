// hide progress loading bar on load
$('.progress').hide();

// init all buttons
$(document).ready(function () {

    // init tap menu
    $('.tap-target').tapTarget();

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

    // clear out all unsaved items from db
    $(document).on('click', '.addNote', function (event) {
        event.preventDefault();
        $('.progress').show();

        // get notes and append to notes modal
        const notesID = $(this).data('save-item');
        getNotesByID(notesID);
    });

    // get item price, notes, and id to note model
    $(document).on('click', '#submit-note', function (event) {
        event.preventDefault();
        $('.progress').show();

        const addNoteID = $(this).data('save-item');
        const notes = $('.text-area').val().trim();
        const itemPrice = $(this).data('item-price');

        if (validateNotes(notes)) {
            addNoteToItem(addNoteID, notes, itemPrice);
        } else {
            M.toast({ html: 'Notes cannot be empty or less than 4 characters!' });
            $('.progress').hide();
            location.reload();
        }
    });

    // clear out all unsaved fields from notes
    $(document).on('click', '#cancel-note', function (event) {
        event.preventDefault();
        M.toast({ html: 'Notes canceled...' });
        $('.progress').hide();
        location.reload();
    });

    // check if search is empty or is only a number
    function validateSearchQuery(searchInput) {
        if (searchInput === '' || !isNaN(searchInput)) {
            $('.progress').hide();
            return M.toast({ html: 'Cannot be an empty string or a number!' });
        } else {
            postSearchQuery(searchInput);
        }
    };

    // validate notes / comments
    function validateNotes(notes) {
        if (notes === '' || notes.length < 4 || !isNaN(notes)) {
            return false;
        } else {
            return true;
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
        M.toast({ html: `Removing Item ID:${removeItem}...` });

        axios({
            method: 'put',
            url: `/remove/${removeItem}`
        }).then(function (response) {
            location.reload();
        }).catch(function (err) {
            if (err) throw err;
        });
    };

    // add note to item
    function addNoteToItem(addNoteID, notes, itemPrice) {
        M.toast({ html: `Adding a note to item ID:${addNoteID}` });

        axios({
            method: 'post',
            url: `/addNote/${addNoteID}`,
            data: { price: itemPrice, comment: notes }
        }).then(function (response) {
            $('.text-area').empty();
            $('.progress').hide();
            M.toast({ html: `Notes added!` });
            location.reload();
        }).catch(function (err) {
            if (err) throw err;
        });
    };

    // get all notes for item by id
    function getNotesByID(notesID) {

        axios({
            method: 'get',
            url: `/getNotes/${notesID}`
        }).then(function (response) {

            const lastNote = response.data.note.comment;
            const lastPrice = response.data.note.price;
            const dateCreated = response.data.note.created_at.split('T')[0];
            const timeCreated = response.data.note.created_at.split('T')[1].split('.')[0];

            $('.text-area').empty();
            $('.progress').hide();

            $(`.notes-results`).append(`<p class="date-created text-center black-text">On ${dateCreated} at ${timeCreated}, someone said:`);
            $(`.notes-results`).append(`<h6 class="last-note text-center black-text">${lastNote}`);
            $(`.notes-results`).append(`<div class="last-price lightseagreen-text text-center">Last seen price: ${lastPrice}`);

            M.toast({ html: `This was last seen at ${lastPrice}!` });
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
});

