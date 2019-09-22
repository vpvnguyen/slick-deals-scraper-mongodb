$(document).ready(function () {
    $(document).on('click', '#search-button', function () {
        console.log('compare!');
        const searchQuery = $('#search-input').val().trim();
        console.log(`searchQuery: ${searchQuery}`);
        validateSearchQuery(searchQuery);
    })
});

// check if search is empty or is only a number
function validateSearchQuery(searchQuery) {
    if (searchQuery === '' || !isNaN(searchQuery)) {
        console.log('cannot be an empty string or a number!');
        $('#message').text('Cannot be an empty string or a number!')
    } else {
        $('#message').text(`Searching for ${searchQuery}`);
        postSearchQuery(searchQuery);
    }
};

// send search query to /search
function postSearchQuery(one) {
    // var slickDealsSearchUrl = `https://slickdeals.net/newsearch.php?src=SearchBarV2&q=${searchQuery}&searcharea=deals&searchin=first`

    console.log(one)
    // POST /search with search query
    axios.post('/search', {
        searchQuery: one
    })
        .then(function (response) {
            console.log(`slickDealsSearch Response: ${response}`)
        })
        .catch(function (err) {
            console.log(`slickDealsSearch Error: ${err}`)
        });


};