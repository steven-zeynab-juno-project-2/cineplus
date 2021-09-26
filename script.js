const movieApp = {};

movieApp.apiURL = `https://api.themoviedb.org/3`;
movieApp.imgURL = `https://image.tmdb.org/t/p/w500`;
movieApp.apiKey = `589df13bf2644ed869e616fad6d941ce`;

// ===========================================
// Initializer function
// ===========================================

movieApp.init = () => {
    // Global selectors
    movieApp.genreList = document.querySelector('.genreList');
    movieApp.galleryList = document.querySelector('.galleryList');
    movieApp.yearList = document.querySelector('.yearList');
    movieApp.yearOptions = document.querySelector('.yearOptions');
    movieApp.footer = document.querySelector('footer');
    movieApp.selectedYear = document.querySelector('.selectedYear');

    // Namespace variables for search params
    movieApp.pageNum = 1;
    movieApp.rating = 5;
    movieApp.maxRuntime = 180;
    movieApp.rangeStart = 0;
    movieApp.rangeEnd = 0;

    movieApp.getGenres();
    movieApp.setupEventListeners();
};

// ===========================================
// Adding event listeners to the sliders 
// ===========================================
movieApp.slideListener = () => {
    const sliders = document.querySelectorAll('.slider');

    sliders.forEach((slider) => {
        slider.addEventListener('change', function () {
            const slideLabel = this.nextElementSibling;
            const slideSpan = slideLabel.querySelector('.slideValue');
            // console.log(slideLabel, slideValue);

            if (slideLabel.classList.contains('slideRating')) {
                movieApp.rating = this.value;
                slideSpan.textContent = movieApp.rating;
            } else if (slideLabel.classList.contains('slideRuntime')) {
                movieApp.maxRuntime = this.value;
                slideSpan.textContent = movieApp.maxRuntime;
            }
        });
    });
};

// ===========================================
// Adding event listeners to the release year dropdown
// ===========================================
movieApp.yearListListeners = () => {
    const yearList = document.querySelectorAll('.yearItem');
    movieApp.selectedYear.addEventListener('click', function () {
        movieApp.yearOptions.classList.toggle('open');
    });

    movieApp.yearOptions.addEventListener('mouseleave', function () {
        movieApp.yearOptions.classList.remove('open');
    });

    yearList.forEach((yearItem) => {
        yearItem.addEventListener('click', function () {
            const chosenOne = document.querySelector('.yearItem.chosen');
            const selectedYear = document.querySelector('.selectedYear');

            if (chosenOne) {
                chosenOne.classList.remove('chosen');
            }

            this.classList.add('chosen');
            selectedYear.textContent = this.textContent;
            selectedYear.classList.add('chosen');

            movieApp.yearOptions.classList.remove('open');

            // On the bottom range we set 
            if (this.value !== 1949) {
                movieApp.rangeStart = `${parseInt(this.value)}-01-01`;
                movieApp.rangeEnd = `${parseInt(this.value) + 9}-12-31`;
            } else {
                movieApp.rangeStart = `1900-01-01`;
                movieApp.rangeEnd = `${parseInt(this.value)}-12-31`;
            }
        })
    });
};

// ===========================================
// setting up the logic for the search dependent on if it is using the regular search or the moreMovies button
// ===========================================
movieApp.setupSearch = (page) => {
    const selectedGenres = [...document.querySelectorAll('.genre.chosen')];
    // converting nodelist to array so that we can use map
    const genreValues = selectedGenres.map((genre) => {
        return genre.value;
    });

    const errorSearch = document.querySelector('.errorSearch');
    if (selectedGenres.length !== 0) {
        movieApp.pageNum = page;
        movieApp.getMovies(genreValues);
        errorSearch.classList.remove('unhidden');
    } else {
        errorSearch.classList.add('unhidden');
    }
};

// ===========================================
// Adding event listener to the search Button
// ===========================================
movieApp.searchButtonListener = () => {
    const searchButton = document.querySelector('.searchButton');
    searchButton.addEventListener('click', () => {
        movieApp.setupSearch(1);
    });
}

// ===========================================
// Adding event listener to the gallery button to allow more movies to load.
// ===========================================
movieApp.moreMoviesListener = () => {
    const moreMovies = document.querySelector('.moreMovies');
    moreMovies.addEventListener('click', () => {
        movieApp.setupSearch(movieApp.pageNum + 1);
    });
}

// ===========================================
// Adding event listener to the show Button
// ===========================================
movieApp.showButtonListener = () => {
    const show = document.querySelector('.show');
    show.addEventListener('click', function () {
        const advancedSettings = document.querySelector('.advancedSettings');
        const advancedArrow = document.querySelector('.show i');
        // transitions on percentage or auto values is not supported in js so we have to do it this way :sad-face:

        if (advancedSettings.style.maxHeight) {
            advancedSettings.style.maxHeight = null;
        } else {
            advancedSettings.style.maxHeight = `${advancedSettings.scrollHeight}px`;
        }

        advancedArrow.classList.toggle('fa-angle-double-up');
        advancedArrow.classList.toggle('fa-angle-double-down');
    });
};

// ===========================================
// setting up the search and show event listeners
// ===========================================
movieApp.setupEventListeners = () => {

    // Calling all our addEventListener functions
    movieApp.slideListener();
    movieApp.yearListListeners();
    movieApp.moreMoviesListener();
    movieApp.searchButtonListener();
    movieApp.showButtonListener();

};

// ===========================================
// Getting the genres from the TMDB movie API
// ===========================================
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

// ===========================================
// Adding the genres to the page in the form of buttons
// ===========================================
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
            if (document.querySelectorAll('.genre.chosen').length < 3 || (this.classList.contains('chosen') && this.classList.contains('genre'))) {
                this.classList.toggle('chosen');
            }
        });
        // appending the button to the li and then to the genre list
        listItem.append(genreButton);
        selectGenres.append(listItem);
    });
};

// ===========================================
// Get the movies based on the user inputted query parameters, genre, release date, etc.
// ===========================================
movieApp.getMovies = (genre) => {
    const url = new URL(`${movieApp.apiURL}/discover/movie`);
    url.search = new URLSearchParams({
        api_key: movieApp.apiKey,
        with_genres: genre,
        include_adult: false,
        page: movieApp.pageNum, //new
        'primary_release_date.gte': movieApp.rangeStart,
        'primary_release_date.lte': movieApp.rangeEnd,
        'vote_average.gte': movieApp.rating,
        'with_runtime.lte': movieApp.maxRuntime,
        'vote_count.gte': 100
    });

    fetch(url)
        .then(response => response.json())
        .then((jsonData) => {
            movieApp.displayMovies(jsonData.results);
        });
};

// Setting the color border based on the movie rating
movieApp.ratingClass = (rating) => {
    if (rating >= 5 && rating <= 8) {
        return 'good';
    } else if (rating >= 8 && rating <= 10) {
        return 'great';
    }
};

// ===========================================
// Display all the movies we have received from the API onto the page
// ===========================================
movieApp.displayMovies = (movies) => {
    const errorGallery = document.querySelector('.errorGallery');

    // Clearing the gallery for a new search
    if (movieApp.pageNum === 1) {
        movieApp.galleryList.innerHTML = '';
    }

    // If there are movies to display
    if (movies.length !== 0) {

        movies.forEach((movie) => {
            const { title, poster_path: poster, overview, vote_average: rating, release_date } = movie;
            // getting just the year part of the release date for the title 
            const releaseYear = release_date.slice(0, 4);

            // if the poster is missing do not bother adding it to the gallery
            if (poster !== null) {
                const listItem = document.createElement('li');
                
                listItem.classList.add('galleryItem');
                listItem.innerHTML = `
                <div class="movieCard">
                    <div class="movie">
                        <img class="moviePoster" src="${movieApp.imgURL}${poster}" alt="${title}">
                        <div class="summary">
                            <p class="overview">${overview}</p>
                            <div class="ratingContainer">
                                <p class="rating ${movieApp.ratingClass(rating)}">${rating.toFixed(1)}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="titleCard">
                        <p class="title">${title} (${releaseYear})</p>
                </div> `;
                movieApp.galleryList.append(listItem);
            }
        });

        if (movies.length < 20) {
            document.querySelector('.moreMovies').classList.add('hidden');
        } else {
            document.querySelector('.moreMovies').classList.remove('hidden');
        }
        
        movieApp.galleryList.classList.add('unhidden');
        document.querySelector('.galleryButtonContainer').classList.add('unhidden');
        errorGallery.classList.remove('unhidden');
        movieApp.footer.classList.add('relativePosition');
    } else {
        movieApp.galleryList.classList.remove('unhidden');
        document.querySelector('.galleryButtonContainer').classList.remove('unhidden');
        errorGallery.classList.add('unhidden');
        movieApp.footer.classList.remove('relativePosition');
    }
}

// ===========================================
// Calling our initializing function
// ===========================================
movieApp.init();
