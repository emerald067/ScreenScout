const container =
  document.querySelector("#favorites-list");

loadFavorites();

function loadFavorites() {

  const favorites =
    JSON.parse(
      localStorage.getItem("favorites")
    ) || [];

  if (!favorites.length) {

    container.innerHTML =
      "<p>No favorites added yet.</p>";

    return;
  }

  container.innerHTML =
    favorites
      .map(movie => createFavoriteCard(movie))
      .join("");

  attachEvents();
}

function createFavoriteCard(movie) {

  return `
    <article class="movie-card">

      <a href="details.html?id=${movie.id}">

        <img
          src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
          alt="${movie.title}">

        <h3>${movie.title}</h3>

      </a>

      <button
        class="remove-btn"
        data-id="${movie.id}">

        Remove

      </button>

    </article>
  `;
}

function attachEvents() {

  document
    .querySelectorAll(".remove-btn")
    .forEach(button => {

      button.addEventListener(
        "click",
        removeFavorite
      );
    });
}

function removeFavorite(event) {

  const id =
    Number(
      event.target.dataset.id
    );

  const favorites =
    JSON.parse(
      localStorage.getItem("favorites")
    ) || [];

  const updated =
    favorites.filter(
      movie => movie.id !== id
    );

  localStorage.setItem(
    "favorites",
    JSON.stringify(updated)
  );

  loadFavorites();
}
