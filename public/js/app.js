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

    console.log(typeof one)

    // send a POST request
    // axios.post(url[, data[, config]])
    axios({
        method: 'post',
        url: '/search',
        data: {
            searchQuery: one
        }
    }).then(function (response) {
        console.log(response);
    }, function (error) {
        console.log(error);
    });


};