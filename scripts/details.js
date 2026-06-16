import {
  getMovieDetails, getMovieCredits, getMovieVideos,
  getTVDetails, getTVCredits, getTVVideos,
  searchYouTubeVideos
} from "./api.js";

const container = document.querySelector("#movie-details");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const type = params.get("type") || "movie";

initialize();

async function initialize() {
  if (!id) {
    container.innerHTML = "<p class='error-message'>Content not found.</p>";
    return;
  }
  try {
    let data, credits, videos;
    if (type === "movie") {
      data = await getMovieDetails(id);
      credits = await getMovieCredits(id);
      videos = await getMovieVideos(id);
    } else {
      data = await getTVDetails(id);
      credits = await getTVCredits(id);
      videos = await getTVVideos(id);
    }
    const youtubeVideos = await searchYouTubeVideos(`${data.name || data.title} trailer`);
    displayContent(data, credits.cast, videos.results, youtubeVideos.items);
    saveToRecentlyViewed(data);
  } catch (error) {
    console.error(error);
    container.innerHTML = "<p class='error-message'>Unable to load information.</p>";
  }
}

function displayContent(item, cast, videos, youtubeVideos) {
  const isMovie = type === "movie";
  const title = item.title || item.name;
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
    : "https://via.placeholder.com/500x750?text=No+Poster";
  const trailer = videos.find(v => v.type === "Trailer" && v.site === "YouTube");
  const releaseDate = item.release_date || item.first_air_date || "Unknown";
  const rating = item.vote_average?.toFixed(1) || "N/A";
  const genres = item.genres?.map(g => g.name).join(", ") || "N/A";
  const runtime = item.runtime ? `${item.runtime} mins` : (isMovie ? "N/A" : "TV Series");

  container.innerHTML = `
    <div class="details">
      <div class="details-header">
        <img class="details-poster" src="${poster}" alt="${title}">
        <div class="details-info">
          <h1>${title} ${!isMovie ? '<span class="tv-badge">📺 TV</span>' : ''}</h1>
          <p><strong>Overview:</strong> ${item.overview || "No overview available."}</p>
          <p><strong>Release Date:</strong> ${releaseDate}</p>
          <p><strong>Rating:</strong> ⭐ ${rating}</p>
          <p><strong>Genres:</strong> ${genres}</p>
          <p><strong>${isMovie ? "Runtime" : "Seasons"}:</strong> ${runtime}</p>
          <button id="favorite-btn" class="btn">⭐ Add to Favorites</button>
        </div>
      </div>

      <div class="trailer-section">
        <h2>Official Trailer</h2>
        ${trailer
          ? `<iframe width="100%" height="500" src="https://www.youtube.com/embed/${trailer.key}" allowfullscreen></iframe>`
          : `<p>No trailer available.</p>`}
      </div>

      <div class="cast-section">
        <h2>Top Cast</h2>
        <ul class="cast-list">
          ${cast.slice(0, 10).map(actor => `<li><strong>${actor.name}</strong> as ${actor.character}</li>`).join("")}
        </ul>
      </div>

      <div class="related-videos">
        <h2>Related Videos</h2>
        <div class="video-grid">
          ${youtubeVideos.slice(0, 3).map(video => `
            <iframe src="https://www.youtube.com/embed/${video.id.videoId}" title="${video.snippet.title}" allowfullscreen></iframe>
          `).join("")}
        </div>
      </div>
    </div>
  `;

  document.getElementById("favorite-btn").addEventListener("click", () => saveFavorite(item));
}

function saveToRecentlyViewed(item) {
  let recent = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
  // Remove existing entry with same id
  recent = recent.filter(entry => entry.item.id !== item.id);
  // Add to front
  recent.unshift({ item, timestamp: Date.now(), type });
  // Keep only last 10
  recent = recent.slice(0, 10);
  localStorage.setItem("recentlyViewed", JSON.stringify(recent));
}

function saveFavorite(item) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.some(fav => fav.id === item.id)) {
    alert("Already in favorites!");
    return;
  }
  favorites.push(item);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  alert(`${item.title || item.name} added to favorites!`);
}
