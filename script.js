const movieApp = {};

movieApp.apiURL = `https://api.themoviedb.org/3`;
movieApp.imgURL = `https://image.tmdb.org/t/p/w500`;
movieApp.apiKey = `589df13bf2644ed869e616fad6d941ce`;

movieApp.genreList = document.querySelector('.genreList');
movieApp.galleryList = document.querySelector('.galleryList');
movieApp.yearList = document.querySelector('.yearList');
movieApp.yearOptions = document.querySelector('.yearOptions');
movieApp.footer = document.querySelector('footer');
movieApp.selectedYear = document.querySelector('.selectedYear');

movieApp.pageNum = 1; 
movieApp.rating = 6;
movieApp.maxRuntime = 180;

movieApp.rangeStart = 0;
movieApp.rangeEnd = 0;

movieApp.init = () => {
    movieApp.getGenres();
    movieApp.setupEventListeners();

    movieApp.selectedYear.addEventListener('click', function () {
        movieApp.yearOptions.classList.toggle('open');
    });

    movieApp.yearOptions.addEventListener('mouseleave', function () {
        movieApp.yearOptions.classList.remove('open');
    });

};


// setting up the search and show event listeners
movieApp.setupEventListeners = () => {
    const searchButton = document.querySelector('.searchButton');
    const show = document.querySelector('.show');

    // Adding event listeners to the sliders 
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


    // Adding event listener to the gallery button to allow more movies to load.
    const moreMovies = document.querySelector('.moreMovies');
    moreMovies.addEventListener('click', ()=>{
        const selectedGenres = [...document.querySelectorAll('.genre.chosen')];
        // converting nodelist to array so that we can use map
        const genreValues = selectedGenres.map((genre) => {
            return genre.value;
        });

        const errorSearch = document.querySelector('.errorSearch');
        if (selectedGenres.length !== 0) {
            movieApp.pageNum += 1;
            console.log(movieApp.pageNum);
            movieApp.getMovies(genreValues);
            errorSearch.classList.remove('unhidden');
        } else {
            errorSearch.classList.add('unhidden');
        }
    });
    

    // Adding event listener to the search Button
    searchButton.addEventListener('click', () => {
        const selectedGenres = [...document.querySelectorAll('.genre.chosen')];
        // converting nodelist to array so that we can use map
        const genreValues = selectedGenres.map((genre) => {
            return genre.value;
        });

        const errorSearch = document.querySelector('.errorSearch');
        if (selectedGenres.length !== 0) {
            movieApp.pageNum = 1;
            movieApp.getMovies(genreValues);
            errorSearch.classList.remove('unhidden');
        } else {
            errorSearch.classList.add('unhidden');
        }
    });

    
    // Adding event listeners to the yearList dropdown
    const yearList = document.querySelectorAll('.yearItem');
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




    // Adding event listener to the show Button
    show.addEventListener('click', function () {
        const advancedSearch = document.querySelector('.advancedSearch');
        const advancedArrow = document.querySelector('.show i');
        // transitions on percentage or auto values is not supported in js so we have to do it this way :sad-face:

        if (advancedSearch.style.maxHeight) {
            advancedSearch.style.maxHeight = null;
        } else {
            advancedSearch.style.maxHeight = `${advancedSearch.scrollHeight}px`;
        }

        advancedArrow.classList.toggle('fa-angle-double-up');
        advancedArrow.classList.toggle('fa-angle-double-down');
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
            if (document.querySelectorAll('.genre.chosen').length < 3 || (this.classList.contains('chosen') && this.classList.contains('genre'))) {
                movieApp.setChosen(this);
            }

        });

        // appending the button to the li and then to the genre list
        listItem.append(genreButton);
        selectGenres.append(listItem);
    });
};

// 
movieApp.setChosen = (element) => {
    element.classList.toggle('chosen');
}

// Get the movies based on the user inputted query parameters, genre, release date, etc.
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

movieApp.clearMovies = () => {
    movieApp.galleryList.innerHTML = '';
};

movieApp.ratingClass = (rating) => {
    if (rating >= 5 && rating <= 8) {
        return 'good';
    } else if (rating >= 8 && rating <= 10) {
        return 'great';
    }
};

movieApp.displayMovies = (movies) => {

movieApp.ratingClass = (rating) => {
    if (rating >= 5 && rating <= 8) {
        return 'good';
    } else if (rating >= 8 && rating <= 10) {
        return 'great';
    }
};

    if (movieApp.pageNum === 1) {
        movieApp.clearMovies();
    }

    const errorGallery = document.querySelector('.errorGallery');
    if (movies.length !== 0) {
        movies.forEach((movie) => {
            //new
            const { title, poster_path: poster, overview, vote_average: rating, release_date } = movie;
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
                </div>
            `;
                movieApp.galleryList.append(listItem);
            }
        });

        
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

movieApp.init();

