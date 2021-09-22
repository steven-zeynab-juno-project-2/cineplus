// &sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31

const movieApp = {};

movieApp.apiURL = `https://api.themoviedb.org/3`;
movieApp.imgURL = `https://image.tmdb.org/t/p/w500`;
movieApp.apiKey = `589df13bf2644ed869e616fad6d941ce`;

movieApp.genreList = document.querySelector('.genreList');
movieApp.pageNum = 1; // new

movieApp.init = () => {
    movieApp.getGenres();
    movieApp.setupEventListeners();
};

// setting up the search and show event listeners
movieApp.setupEventListeners = () => {
    const searchButton = document.querySelector('.searchButton');
    const show = document.querySelector('.show');

    // Adding event listener to the search Button
    searchButton.addEventListener('click', () => {
        const selectedGenres = [...document.querySelectorAll('.chosen')];
        // converting nodelist to array so that we can use map
        const genreValues = selectedGenres.map((genre) => {
            return genre.value;
        });

        // new
        movieApp.pageNum = 1;
        movieApp.getMovies(genreValues, movieApp.pageNum);
        // will add another listener for a show more where you can get subsequent pages of movies
    });

    // Adding event listener to the show Button
    show.addEventListener('click', function () {
        const genreList = document.querySelector('.genreList');
        // transitions on percentage or auto values is not supported in js so we have to do it this way :sad-face:

        if (genreList.style.maxHeight) {
            genreList.style.maxHeight = null;
        } else {
            genreList.style.maxHeight = `${genreList.scrollHeight}px`;
        }
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

            // if there are 3 or fewer, or if it is already chosen the user can toggle
            if (document.querySelectorAll('.chosen').length < 3 || this.classList.contains('chosen')) {
                this.classList.toggle('chosen');
            }

        });

        // appending the button to the li and then to the genre list
        listItem.append(genreButton);
        selectGenres.append(listItem);
    });
};

// Get the movies based on the user inputted query parameters, genre, release date, etc.
movieApp.getMovies = (genre, page) => {
    const url = new URL(`${movieApp.apiURL}/discover/movie`);
    url.search = new URLSearchParams({
        api_key: movieApp.apiKey,
        with_genres: genre,
        page: page //new

    });

    fetch(url)
        .then(response => response.json())
        .then((jsonData) => {
            movieApp.displayMovies(jsonData.results);
        });
};

movieApp.displayMovies = (movies) => {
    const galleryList = document.querySelector('.galleryList');
    const movieGallery = document.querySelector('.movieGallery');

    if (galleryList.querySelector('li')) {

    } else {
        movieGallery.classList.toggle('unhidden');
    }

    galleryList.innerHTML = '';

    movies.forEach((movie) => {
        //new
        const title = movie.title;
        const poster = movie.poster_path;
        const overview = movie.overview;

        // if the poster is missing do not bother adding it to the gallery
        if (poster !== null) {
            // Had to create individual elements so that we could add an event listener in the forEach
            const listItem = document.createElement('li');
            const movieContainer = document.createElement('div');
            const movieImage = document.createElement('img');
            const summaryBox = document.createElement('div');
            const summary = document.createElement('p');
            const movieTitle = document.createElement('p');

            listItem.classList.add('galleryItem');

            movieContainer.classList.add('movie');
            
            movieImage.src = `${movieApp.imgURL}${poster}`;
            movieImage.alt = `${title}`;

            summaryBox.classList.add('summary');

            summary.innerText = `${overview}`;

            movieTitle.innerText = `${title}`;
            
            summaryBox.append(summary);
            movieContainer.append(movieImage, summaryBox);
            listItem.append(movieContainer, movieTitle);
            galleryList.append(listItem);
        }
    });
}

movieApp.init();