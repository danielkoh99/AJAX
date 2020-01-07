// http://www.omdbapi.com/?s=star&y=2016&apiKey=9606ae0f

var state = {
    newestMovies: [],
    newMovieDetails: {},
    movies: [],
    singleMovie: {}
};





window.onload = getMovies()
    //document.querySelector(".lds-hourglass")
function getMovies() {
    return fetch(
        `https://api.themoviedb.org/3/movie/now_playing?page=1&language=en-US&api_key=342037543138dcdba158efa9ad2b2861`, {
            method: 'GET',
        }
    )

    .then(response => response.json())
        //.then(response => console.log(response.results))
        .then(response => state.newestMovies = response.results)

    .then(function() {
            var MoviesHTML = '';
            for (var movies of state.newestMovies) {

                MoviesHTML += `<li>
                  <div class="poster-wrap">
                     <img src="https://image.tmdb.org/t/p/w200/${movies.poster_path}" class="movie-poster">
                  </div>
                  <button data-movie-id="${movies.id}" onclick="renderDataById(window.event)">Details</button>
                  <span class="movie-title">${movies.title}</span>
                  <span class="movie-year">${movies.release_date}</span>
                </li>`;
            }
            document.getElementById('movies').innerHTML = MoviesHTML;
        })
        .catch(error => console.error('error:', error))

};

function renderDataById() {
    event.preventDefault();
    var id = event.target.dataset.movieId;
    return fetch(
            `https://api.themoviedb.org/3/movie/${id}?language=en-US&api_key=342037543138dcdba158efa9ad2b2861`, {
                method: 'GET',

            }
        )
        .then(response => response.json())
        .then(data => {
            state.newMovieDetails = data;
            renderSingleNewMovie()
        })

    .catch(error => console.error('error:', error))
}

function renderSingleNewMovie() {
    var singleNewMovieHTML = '';
    singleNewMovieHTML += `
        <div class="description-page">
        <div class="description-header-background clearfix">
            <div class="main-content">
            <!-- <div class="back-to-search">
                    <i class="material-icons arrow">navigate_before</i>
                    <span>Search results</span>-->
                </div>
                <div class="description-container">
                    <h1 class="desc-movie-name">${state.newMovieDetails.title}</h1>
                    <span class="desc-movie-rating">IMDB rating: ${state.newMovieDetails.vote_average}</span>
                    <span class="desc-movie-budget">Budget:${state.newMovieDetails.budget} $</span>
                 <h3 class="desc-plot-synopsis">Plot Synopsis:</h3>
                <p class="desc-plot">
                ${state.newMovieDetails.overview}
                </p>
                </div>
            </div>
        </div>
        <div class="main-content">
          <h1></h1>
            <div class="poster-div">
              <img src="https://image.tmdb.org/t/p/w300/${state.newMovieDetails.poster_path}" alt="">
            </div>
            <div class="description-container">
               
                <!--<a href="#" class="imdb-link">View on IMDB</a> -->
            </div>
        </div>
    </div>`
    document.getElementById('movies').innerHTML = singleNewMovieHTML
};

function sendRequest(url, callback) {
    var request = new XMLHttpRequest();

    request.onreadystatechange = function() {
        if (request.readyState !== 4) {
            return;
        }

        if (request.status !== 200) {
            alert('Hiba a kérésben')
        }

        var obj = JSON.parse(request.responseText);
        callback(obj)
    };

    request.open('GET', url);

    request.send();
}

function addMoviesToState(response) {
    state.movies = response.Search;
    renderMovies();
}

function renderSingleMovie() {
    var singleMovieHTML = '';
    singleMovieHTML += `
        <div class="description-page">
        <div class="description-header-background clearfix">
            <div class="main-content">
            <!-- <div class="back-to-search">
                    <i class="material-icons arrow">navigate_before</i>
                    <span>Search results</span>-->
                </div>
                <div class="description-container">
                    <h1 class="desc-movie-name">${state.singleMovie.Title}</h1>
                    <span class="desc-movie-rating">IMDB rating: ${state.singleMovie.imdbRating}</span>
                 <h3 class="desc-plot-synopsis">Plot Synopsis:</h3>
                <p class="desc-plot">
                ${state.singleMovie.Plot}
                </p>
                </div>
            </div>
        </div>
        <div class="main-content">
          <h1></h1>
            <div class="poster-div">
              <img src="${state.singleMovie.Poster}" alt="">
            </div>
            <div class="description-container">
               
                <!--<a href="#" class="imdb-link">View on IMDB</a> -->
            </div>
        </div>
    </div>`
    document.getElementById('movies').innerHTML = singleMovieHTML
};

function modifyStateById(event) {
    event.preventDefault();
    var id = event.target.dataset.movieId;
    return fetch(
            `http://www.omdbapi.com/?i=${id}&apiKey=9606ae0f`, {
                method: 'GET',

            }
        )
        .then(response => response.json())
        .then(data => {
            state.singleMovie = data;
            renderSingleMovie()
        })

    .catch(error => console.error('error:', error))

};


function renderMovies() {
    var moviesHTML = '';
    for (var movie of state.movies) {
        moviesHTML += `<li>
          <div class="poster-wrap">
             <img src="${movie.Poster}" class="movie-poster">
          </div>
          <button data-movie-id="${movie.imdbID}" onclick="modifyStateById(window.event)">Details</button>
          <span class="movie-title">${movie.Title}</span>
          <span class="movie-year">${movie.Year}</span>
        </li>`;
    }

    document.getElementById('movies').innerHTML = moviesHTML;
}


document.querySelector('.search-form').addEventListener('submit', fetchMovies);



function fetchMovies(event) {
    event.preventDefault();
    var search = event.target.search.value;
    var year = event.target.year.value;
    if (!search) {
        alert('Keresés mező kitöltése kötelező')
    }
    var url = `http://www.omdbapi.com/?s=${search}&y=${year}&apiKey=9606ae0f`;
    sendRequest(url, addMoviesToState)
}