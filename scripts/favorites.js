const container = document.querySelector("#favorites-list");

loadFavorites();

function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.length === 0) {
    container.innerHTML = "<p>No favorites added yet. Go find some movies or TV shows!</p>";
    return;
  }
  container.innerHTML = favorites.map(item => {
    const title = item.title || item.name;
    const poster = item.poster_path;
    const type = item.media_type || (item.release_date ? "movie" : "tv");
    return `
      <article class="movie-card">
        <a href="details.html?id=${item.id}&type=${type}">
          <img src="https://image.tmdb.org/t/p/w500${poster}" alt="${title}">
          <div class="movie-info">
            <h3>${title}</h3>
            <p>${type === "movie" ? "Movie" : "TV Show"}</p>
          </div>
        </a>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".remove-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.target.dataset.id);
      removeFavorite(id);
    });
  });
}

function removeFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(item => item.id !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  loadFavorites();
}
