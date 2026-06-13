const API_KEY = "5f207d69acfccb0bfda14a542c29aa33";
const BASE_URL = "https://api.themoviedb.org/3";

async function fetchData(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to retrieve data.");
  }

  return response.json();
}

const YOUTUBE_KEY = "AIzaSyC6gpaOl3hckxilgh6TflSpSOQEynzoBTw";

export async function searchYouTubeVideos(query) {

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=3&key=${YOUTUBE_KEY}`
  );

  return await response.json();
}

export function searchMovies(query) {
  return fetchData(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
  );
}

export function getTrendingMovies() {
  return fetchData(
    `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
  );
}

export function getTrendingTVShows() {
  return fetchData(
    `${BASE_URL}/trending/tv/week?api_key=${API_KEY}`
  );
}

export function getUpcomingMovies() {
  return fetchData(
    `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`
  );
}

export function getGenres() {
  return fetchData(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
  );
}

export function discoverMovies(genreId, sortBy) {
  return fetchData(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=${sortBy}`
  );
}

export function getMovieDetails(id) {
  return fetchData(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}`
  );
}

export function getMovieCredits(id) {
  return fetchData(
    `${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`
  );
}

export function getMovieVideos(id) {
  return fetchData(
    `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`
  );
}
