import {
  getMovieDetails,
  getMovieCredits,
  getMovieVideos,
  searchYouTubeVideos
} from "./api.js";

const container =
  document.querySelector("#movie-details");

const params =
  new URLSearchParams(window.location.search);

const movieId =
  params.get("id");

initialize();

async function initialize() {

  if (!movieId) {

    container.innerHTML = `
      <p>Movie not found.</p>
    `;

    return;
  }

  try {

    const movie =
      await getMovieDetails(movieId);

    const credits =
      await getMovieCredits(movieId);

    const videos =
      await getMovieVideos(movieId);

    const youtubeVideos =
      await searchYouTubeVideos(
        `${movie.title} behind the scenes`
      );

    displayMovie(
      movie,
      credits.cast,
      videos.results,
      youtubeVideos.items
    );

  } catch (error) {

    container.innerHTML = `
      <p>
        Unable to load movie information.
        Please try again later.
      </p>
    `;

    console.error(error);
  }
}

function displayMovie(
  movie,
  cast,
  videos,
  youtubeVideos
) {

  const poster =
    movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "./images/placeholder.jpg";

  const trailer =
    videos.find(
      video =>
        video.type === "Trailer" &&
        video.site === "YouTube"
    );

  container.innerHTML = `
    <section class="details">

      <div class="details-header">

        <img
          class="details-poster"
          src="${poster}"
          alt="${movie.title}">

        <div class="details-info">

          <h1>
            ${movie.title}
          </h1>

          <p>
            ${movie.overview}
          </p>

          <p>
            <strong>Release Date:</strong>
            ${movie.release_date}
          </p>

          <p>
            <strong>Rating:</strong>
            ⭐ ${movie.vote_average.toFixed(1)}
          </p>

          <p>
            <strong>Genres:</strong>
            ${movie.genres
              .map(genre => genre.name)
              .join(", ")}
          </p>

          <p>
            <strong>Runtime:</strong>
            ${movie.runtime} mins
          </p>

          <button
            id="favorite-btn"
            class="btn">

            Add to Favorites

          </button>

        </div>

      </div>

      <section class="trailer-section">

        <h2>
          Official Trailer
        </h2>

        ${
          trailer
            ? `
              <iframe
                width="100%"
                height="500"
                src="https://www.youtube.com/embed/${trailer.key}"
                title="Movie Trailer"
                allowfullscreen>
              </iframe>
            `
            : `
              <p>
                No trailer available.
              </p>
            `
        }

      </section>

      <section class="cast-section">

        <h2>
          Top Cast
        </h2>

        <ul class="cast-list">

          ${cast
            .slice(0, 10)
            .map(
              actor => `
                <li>
                  <strong>${actor.name}</strong>
                  as
                  ${actor.character}
                </li>
              `
            )
            .join("")}

        </ul>

      </section>

      <section class="related-videos">

        <h2>
          Behind The Scenes
        </h2>

        <div class="video-grid">

          ${youtubeVideos
            .slice(0, 3)
            .map(
              video => `
                <iframe
                  src="https://www.youtube.com/embed/${video.id.videoId}"
                  title="${video.snippet.title}"
                  allowfullscreen>
                </iframe>
              `
            )
            .join("")}

        </div>

      </section>

    </section>
  `;

  document
    .querySelector("#favorite-btn")
    .addEventListener(
      "click",
      () => saveFavorite(movie)
    );
}

function saveFavorite(movie) {

  const favorites =
    JSON.parse(
      localStorage.getItem("favorites")
    ) || [];

  const exists =
    favorites.find(
      item => item.id === movie.id
    );

  if (exists) {

    alert(
      "Movie already exists in favorites."
    );

    return;
  }

  favorites.push(movie);

  localStorage.setItem(
    "favorites",
    JSON.stringify(favorites)
  );

  alert(
    `${movie.title} added to favorites!`
  );
}