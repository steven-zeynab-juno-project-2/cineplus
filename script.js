// const testAPI = () => {

//     // &sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31
//     fetch(`https://api.themoviedb.org/3/discover/movie?api_key=589df13bf2644ed869e616fad6d941ce&language=en-US&vote_average.gte=6&with_genres=28,35`)
//         .then(response => response.json())
//         .then((jsonData) => {
//             console.log(jsonData);
//         });
//     // /genre/movie/list
// };
// testAPI();

const movieApp = {};


movieApp.apiURL = `https://api.themoviedb.org/3/`;
movieApp.apiKey = `589df13bf2644ed869e616fad6d941ce`;

movieApp.searchButton = document.querySelector('.searchButton');

movieApp.getGenres = () => {

    const url = new URL(`${movieApp.apiURL}genre/movie/list`);
    url.search = new URLSearchParams({
        // pass in our API key as a parameter
        api_key: movieApp.apiKey
    })

    fetch(url)
        .then(response => response.json())
        .then((jsonData) => {
            const genres = jsonData.genres; // array
            const selectGenres = document.querySelector('#genres');
            genres.forEach((genre) => {
                const optionItem = document.createElement('option');
                optionItem.value = genre.id;
                optionItem.textContent = genre.name;
                selectGenres.append(optionItem);
            });
        });
}

movieApp.getMovies = (genre) => {
    const url = new URL(`${movieApp.apiURL}discover/movie`);
    url.search = new URLSearchParams({
        api_key: movieApp.apiKey,
        with_genres: genre
    });

    fetch(url)
        .then(response => response.json())
        .then((jsonData) => {
            console.log(jsonData);
        });
};

movieApp.init = () => {

    movieApp.getGenres();

    movieApp.searchButton.addEventListener('click', () => {
        const selectedOption = document.querySelector('#genres option:checked').value;

        movieApp.getMovies(selectedOption);
    });
};

movieApp.init();