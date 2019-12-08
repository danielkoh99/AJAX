var state = {
    movies: [],
    singleMovie: {}
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
    console.log(id)
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
        .catch(error => console.error('error:', error));


};




function renderMovies() {
    var moviesHTML = '';
    for (var movie of state.movies) {
        moviesHTML += `<li>
      <div class="poster-wrap">
         <img src="${movie.Poster}" class="movie-poster">
      </div>
      <button data-movie-id="${movie.imdbID}" onclick="modifyStateById(window.event)">Leírás</button>
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
    sendRequest(url, addMoviesToState);
}