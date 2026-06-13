import {
  searchMovies,
  getTrendingMovies,
  getTrendingTVShows,
  getUpcomingMovies,
  getGenres,
  discoverMovies
} from "./api.js";

const movieList = document.querySelector("#movie-list");
const trendingList = document.querySelector("#trending-list");
const upcomingList = document.querySelector("#upcoming-list");
const tvList = document.querySelector("#tv-list");

const form = document.querySelector("#search-form");

const genreSelect = document.querySelector("#genre-select");
const sortSelect = document.querySelector("#sort-select");

initialize();

async function initialize() {
  await Promise.all([
    loadTrending(),
    loadUpcoming(),
    loadTVShows(),
    loadGenres()
  ]);

  setupEvents();
}

function setupEvents() {
  form.addEventListener("submit", handleSearch);

  genreSelect.addEventListener(
    "change",
    filterMovies
  );

  sortSelect.addEventListener(
    "change",
    filterMovies
  );
}

async function handleSearch(event) {
  event.preventDefault();

  const query =
    document.querySelector("#search-input").value;

  if (!query.trim()) return;

  try {
    const data =
      await searchMovies(query);

    renderMovies(
      data.results,
      movieList
    );

  } catch (error) {

    movieList.innerHTML =
      "<p>Search failed.</p>";

    console.error(error);
  }
}

async function loadTrending() {

  const data =
    await getTrendingMovies();

  renderHero(data.results[0]);

  renderMovies(
    data.results,
    trendingList
  );
}

async function loadUpcoming() {

  const data =
    await getUpcomingMovies();

  renderMovies(
    data.results,
    upcomingList
  );
}

async function loadTVShows() {

  const data =
    await getTrendingTVShows();

  renderTVShows(
    data.results,
    tvList
  );
}

async function loadGenres() {

  const data =
    await getGenres();

  data.genres.forEach(genre => {

    genreSelect.innerHTML += `
      <option value="${genre.id}">
        ${genre.name}
      </option>
    `;
  });
}

async function filterMovies() {

  const genre =
    genreSelect.value;

  const sortBy =
    sortSelect.value;

  const data =
    await discoverMovies(
      genre,
      sortBy
    );

  renderMovies(
    data.results,
    movieList
  );
}

function renderMovies(
  movies,
  container
) {

  container.innerHTML =
    movies
      .filter(movie => movie.poster_path)
      .map(movie => createMovieCard(movie))
      .join("");
}

function renderTVShows(
  shows,
  container
) {

  container.innerHTML =
    shows
      .filter(show => show.poster_path)
      .map(show => `
        <article class="movie-card">

          <img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            alt="${show.name}">

          <h3>${show.name}</h3>

          <p>
            ⭐ ${show.vote_average.toFixed(1)}
          </p>

        </article>
      `)
      .join("");
}

function createMovieCard(movie) {

  return `
    <article class="movie-card">

      <a href="details.html?id=${movie.id}">

        <img
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
          alt="${movie.title}">

        <div class="movie-info">

          <h3>${movie.title}</h3>

          <p>
            ${movie.release_date || "Unknown"}
          </p>

          <p>
            ⭐ ${movie.vote_average.toFixed(1)}
          </p>

        </div>

      </a>

    </article>
  `;
}

function renderHero(movie) {

  const banner =
    document.querySelector("#hero-banner");

  const title =
    document.querySelector("#hero-title");

  const overview =
    document.querySelector("#hero-overview");

  const button =
    document.querySelector("#hero-button");

  banner.style.backgroundImage =
    `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;

  title.textContent =
    movie.title;

  overview.textContent =
    movie.overview;

  button.href =
    `details.html?id=${movie.id}`;
}