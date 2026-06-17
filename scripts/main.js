import {
  multiSearch,
  getTrendingMovies,
  getTrendingTVShows,
  getUpcomingMovies,
  getGenres,
  discoverMovies
} from "./api.js";

// Wait for DOM to be fully loaded before running
document.addEventListener("DOMContentLoaded", () => {
  initialize();
});

// Get DOM elements
let currentSearchQuery = "";

async function initialize() {
  // Get all elements fresh each time (or at least check them)
  const movieList = document.querySelector("#movie-list");
  const trendingList = document.querySelector("#trending-list");
  const upcomingList = document.querySelector("#upcoming-list");
  const tvList = document.querySelector("#tv-list");
  const recentList = document.querySelector("#recent-list");
  const genreSelect = document.querySelector("#genre-select");
  const sortSelect = document.querySelector("#sort-select");
  const heroBanner = document.querySelector("#hero-banner");
  const heroTitle = document.querySelector("#hero-title");
  const heroOverview = document.querySelector("#hero-overview");
  const heroButton = document.querySelector("#hero-button");

  // Verify critical elements exist
  if (!movieList) console.error("Missing #movie-list");
  if (!trendingList) console.error("Missing #trending-list");
  if (!upcomingList) console.error("Missing #upcoming-list");
  if (!tvList) console.error("Missing #tv-list");
  if (!genreSelect) console.error("Missing #genre-select");
  if (!sortSelect) console.error("Missing #sort-select");

  // Load user preferences
  loadPreferences();

  try {
    await Promise.all([
      loadTrending(),
      loadUpcoming(),
      loadTVShows(),
      loadGenres(),
      loadRecentlyViewed()
    ]);
    await filterMovies();
    setupEvents();
  } catch (error) {
    console.error("Initialization error:", error);
    const movieListEl = document.querySelector("#movie-list");
    if (movieListEl) movieListEl.innerHTML = `<div class="error-message">Failed to load initial data. Please refresh.</div>`;
  }
}

function loadPreferences() {
  const genreSelect = document.querySelector("#genre-select");
  const sortSelect = document.querySelector("#sort-select");
  if (!genreSelect || !sortSelect) return;
  const savedGenre = localStorage.getItem("preferredGenre");
  const savedSort = localStorage.getItem("preferredSort");
  if (savedGenre && savedGenre !== "") genreSelect.value = savedGenre;
  if (savedSort) sortSelect.value = savedSort;
}

function savePreferences() {
  const genreSelect = document.querySelector("#genre-select");
  const sortSelect = document.querySelector("#sort-select");
  if (!genreSelect || !sortSelect) return;
  localStorage.setItem("preferredGenre", genreSelect.value);
  localStorage.setItem("preferredSort", sortSelect.value);
}

function setupEvents() {
  const form = document.querySelector("#search-form");
  const genreSelect = document.querySelector("#genre-select");
  const sortSelect = document.querySelector("#sort-select");
  if (!form || !genreSelect || !sortSelect) return;

  form.addEventListener("submit", handleSearch);
  genreSelect.addEventListener("change", () => {
    currentSearchQuery = "";
    savePreferences();
    filterMovies();
  });
  sortSelect.addEventListener("change", () => {
    currentSearchQuery = "";
    savePreferences();
    filterMovies();
  });
}

async function handleSearch(event) {
  event.preventDefault();
  const queryInput = document.querySelector("#search-input");
  if (!queryInput) return;
  const query = queryInput.value.trim();
  if (!query) return;
  currentSearchQuery = query;
  const movieList = document.querySelector("#movie-list");
  if (!movieList) return;

  try {
    const data = await multiSearch(query);
    const results = data.results.filter(item => 
      (item.media_type === "movie" || item.media_type === "tv") && item.poster_path
    );
    if (results.length === 0) {
      movieList.innerHTML = "<p class='error-message'>No movies or TV shows found. Try another title.</p>";
    } else {
      renderSearchResults(results, movieList);
    }
  } catch (error) {
    console.error("Search error:", error);
    movieList.innerHTML = "<p class='error-message'>Search failed. Please try again.</p>";
  }
}

function renderSearchResults(items, container) {
  if (!container) return;
  container.innerHTML = items.map(item => {
    const title = item.title || item.name;
    const date = item.release_date || item.first_air_date || "";
    const year = date.slice(0,4);
    const type = item.media_type === "movie" ? "movie" : "tv";
    return `
      <article class="movie-card">
        <a href="details.html?id=${item.id}&type=${type}">
          <img src="https://image.tmdb.org/t/p/w342${item.poster_path}" alt="${title}" loading="lazy">
          <div class="movie-info">
            <h3>${title}</h3>
            <p>${year || "Unknown"} • ${type === "movie" ? "Movie" : "TV"}</p>
            <p>⭐ ${item.vote_average?.toFixed(1) || "N/A"}</p>
          </div>
        </a>
      </article>
    `;
  }).join("");
}

async function filterMovies() {
  const genreSelect = document.querySelector("#genre-select");
  const sortSelect = document.querySelector("#sort-select");
  const movieList = document.querySelector("#movie-list");
  if (!genreSelect || !sortSelect || !movieList) return;

  const genre = genreSelect.value;
  const sortBy = sortSelect.value;
  try {
    const data = await discoverMovies(genre, sortBy);
    if (data.results.length === 0) {
      movieList.innerHTML = "<p class='error-message'>No movies match these filters.</p>";
    } else {
      renderMovies(data.results, movieList);
    }
  } catch (error) {
    console.error("Filter error:", error);
    movieList.innerHTML = "<p class='error-message'>Unable to load movies.</p>";
  }
}

async function loadTrending() {
  const trendingList = document.querySelector("#trending-list");
  const heroBanner = document.querySelector("#hero-banner");
  const heroTitle = document.querySelector("#hero-title");
  const heroOverview = document.querySelector("#hero-overview");
  const heroButton = document.querySelector("#hero-button");
  if (!trendingList) return;

  try {
    const data = await getTrendingMovies();
    if (data.results && data.results.length) {
      // Only render hero if all hero elements exist
      if (heroBanner && heroTitle && heroOverview && heroButton) {
        renderHero(data.results[0], heroBanner, heroTitle, heroOverview, heroButton);
      }
      renderMovies(data.results.slice(0, 8), trendingList);
    }
  } catch (error) {
    console.error("Trending error:", error);
    trendingList.innerHTML = "<p class='error-message'>Failed to load trending.</p>";
  }
}

async function loadUpcoming() {
  const upcomingList = document.querySelector("#upcoming-list");
  if (!upcomingList) return;
  try {
    const data = await getUpcomingMovies();
    renderMovies(data.results.slice(0, 8), upcomingList);
  } catch (error) {
    console.error("Upcoming error:", error);
    upcomingList.innerHTML = "<p class='error-message'>Failed to load upcoming.</p>";
  }
}

async function loadTVShows() {
  const tvList = document.querySelector("#tv-list");
  if (!tvList) return;
  try {
    const data = await getTrendingTVShows();
    renderTVShows(data.results.slice(0, 8), tvList);
  } catch (error) {
    console.error("TV shows error:", error);
    tvList.innerHTML = "<p class='error-message'>Failed to load TV shows.</p>";
  }
}

async function loadGenres() {
  const genreSelect = document.querySelector("#genre-select");
  if (!genreSelect) return;
  try {
    const data = await getGenres();
    data.genres.forEach(genre => {
      genreSelect.innerHTML += `<option value="${genre.id}">${genre.name}</option>`;
    });
  } catch (error) {
    console.error("Genres error:", error);
  }
}

async function loadRecentlyViewed() {
  const recentList = document.querySelector("#recent-list");
  if (!recentList) return;
  const recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
  if (recent.length === 0) {
    recentList.innerHTML = "<p>No recently viewed items.</p>";
    return;
  }
  const items = recent.slice(0, 6).map(entry => entry.item);
  renderRecentlyViewed(items, recentList);
}

function renderRecentlyViewed(items, container) {
  if (!container) return;
  container.innerHTML = items.map(item => {
    const title = item.title || item.name;
    const poster = item.poster_path;
    const type = item.media_type || "movie";
    return `
      <article class="movie-card">
        <a href="details.html?id=${item.id}&type=${type}">
          <img src="https://image.tmdb.org/t/p/w342${poster}" alt="${title}" loading="lazy">
          <div class="movie-info">
            <h3>${title}</h3>
            <p>${type === "movie" ? "Movie" : "TV Show"}</p>
          </div>
        </a>
      </article>
    `;
  }).join("");
}

function renderMovies(movies, container) {
  if (!container) return;
  if (!movies || movies.length === 0) {
    container.innerHTML = "<p>No movies to display.</p>";
    return;
  }
  container.innerHTML = movies
    .filter(movie => movie.poster_path)
    .map(movie => createMovieCard(movie))
    .join("");
}

function renderTVShows(shows, container) {
  if (!container) return;
  if (!shows || shows.length === 0) {
    container.innerHTML = "<p>No TV shows to display.</p>";
    return;
  }
  container.innerHTML = shows
    .filter(show => show.poster_path)
    .map(show => `
      <article class="movie-card">
        <a href="details.html?id=${show.id}&type=tv">
          <img src="https://image.tmdb.org/t/p/w342${show.poster_path}" alt="${show.name}" loading="lazy">
          <div class="movie-info">
            <h3>${show.name}</h3>
            <p>⭐ ${show.vote_average?.toFixed(1) || "N/A"}</p>
          </div>
        </a>
      </article>
    `).join("");
}

function createMovieCard(movie) {
  return `
    <article class="movie-card">
      <a href="details.html?id=${movie.id}&type=movie">
        <img src="https://image.tmdb.org/t/p/w342${movie.poster_path}" alt="${movie.title}" loading="lazy">
        <div class="movie-info">
          <h3>${movie.title}</h3>
          <p>${movie.release_date?.slice(0,4) || "Unknown"}</p>
          <p>⭐ ${movie.vote_average?.toFixed(1) || "N/A"}</p>
        </div>
      </a>
    </article>
  `;
}

function renderHero(movie, banner, title, overview, button) {
  if (!banner || !title || !overview || !button) return;
  if (!movie.backdrop_path) return;
  banner.style.backgroundImage = `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`;
  title.textContent = movie.title;
  overview.textContent = movie.overview.slice(0, 200) + "...";
  button.href = `details.html?id=${movie.id}&type=movie`;
}
