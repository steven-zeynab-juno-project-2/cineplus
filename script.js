// &sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31

const movieApp = {};

movieApp.apiURL = `https://api.themoviedb.org/3`;
movieApp.imgURL = `https://image.tmdb.org/t/p/w500`;
movieApp.apiKey = `589df13bf2644ed869e616fad6d941ce`;

movieApp.genreList = document.querySelector('.genreList');

movieApp.init = () => {
    movieApp.getGenres();
    movieApp.setupEventListeners();
};

// setting up the search and hide event listeners
movieApp.setupEventListeners = () => {
    const searchButton = document.querySelector('.searchButton');
    const hide = document.querySelector('.hide');
    
    searchButton.addEventListener('click', () => {
        const selectedGenres = [...document.querySelectorAll('.chosen')];
        // converting nodelist to array so that we can use map
        const genreValues = selectedGenres.map((genre)=>{
            return genre.value;
        });
        movieApp.getMovies(genreValues);
    });

    // Adding event listener to 
    hide.addEventListener('click', function () {
        const genreList = document.querySelector('.genreList');
        genreList.classList.toggle('hidden');
    });

};

// Getting the genres from the TMDB movie API
movieApp.getGenres = () => {

    const url = new URL(`${movieApp.apiURL}/genre/movie/list`);
    url.search = new URLSearchParams({
        // pass in our API key as a parameter
        api_key: movieApp.apiKey
    })

    fetch(url)
        .then(response => response.json())
        .then((jsonData) => {
            movieApp.setGenres(jsonData.genres);
        });   
};

// Adding the genres to the page in the form of buttons
movieApp.setGenres = (genres) => {
    const selectGenres = document.querySelector('.genreList');
    genres.forEach((genre) => {
        // Creating a button and li for each list item
        const listItem = document.createElement('li');
        const genreButton = document.createElement('button');

        // adding the class name, text, and event listener to the button
        genreButton.classList.add('genre');
        genreButton.value = genre.id;
        genreButton.textContent = genre.name;
        genreButton.addEventListener('click', function () {
            this.classList.toggle('chosen');
        });

        // appending the button to the li and then to the genre list
        listItem.append(genreButton);
        selectGenres.append(listItem);
    });
};

// Get the movies based on the user inputted query parameters, genre, release date, etc.
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
        </div>
        `
        galleryList.append(listItem);

    });
}

movieApp.init();



