// &sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31

const movieApp = {};

movieApp.apiURL = `https://api.themoviedb.org/3`;
movieApp.imgURL = `https://image.tmdb.org/t/p/w500`;
movieApp.apiKey = `589df13bf2644ed869e616fad6d941ce`;

movieApp.init = () => {
    movieApp.setupEventListener();
    movieApp.getGenres();
};

movieApp.setupEventListener = () => {
    searchButton = document.querySelector('.searchButton');

    searchButton.addEventListener('click', () => {
        const selectedOption = document.querySelector('#genres option:checked').value;

        movieApp.getMovies(selectedOption);
    });
};

movieApp.getGenres = () => {

    const url = new URL(`${movieApp.apiURL}/genre/movie/list`);
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
    const url = new URL(`${movieApp.apiURL}/discover/movie`);
    url.search = new URLSearchParams({
        api_key: movieApp.apiKey,
        with_genres: genre
    });

    fetch(url)
        .then(response => response.json())
        .then((jsonData) => {
            movieApp.displayMovies(jsonData.results);
            
        });
};

movieApp.displayMovies = (movies) => {
    const galleryList = document.querySelector('.galleryList');
    movies.forEach((movie) => {
        const title = movie.title;
        const poster = movie.poster_path;
        const listItem = document.createElement('li');

        listItem.classList.add('galleryItem');

        listItem.innerHTML = `
        <div class="movie">
            <img src='${movieApp.imgURL}${poster}'>
            <p>${title}</p>
        </div>`

        galleryList.append(listItem);

    });
}

movieApp.init();



