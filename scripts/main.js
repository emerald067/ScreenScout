import { searchMovies } from "./api.js";

const form = document.querySelector("#search-form");
const movieList = document.querySelector("#movie-list");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const query =
    document.querySelector("#search-input").value;

  const data = await searchMovies(query);

  displayMovies(data.results);
});

function displayMovies(movies) {
  movieList.innerHTML = "";

  movies.forEach(movie => {
    movieList.innerHTML += `
      <article>
        <h3>${movie.title}</h3>
        <p>${movie.release_date}</p>
      </article>
    `;
  });
}