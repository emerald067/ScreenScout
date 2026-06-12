const API_KEY = "5f207d69acfccb0bfda14a542c29aa33";

export async function searchMovies(query) {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`
  );

  return await response.json();
}