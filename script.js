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

movieApp.getGenres = () => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=589df13bf2644ed869e616fad6d941ce`)
    .then(response => response.json())
    .then((jsonData) => {
        console.log(jsonData.genres[0]);
    });
}

movieApp.getGenres ();