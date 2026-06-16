const API_KEY = "5f207d69acfccb0bfda14a542c29aa33";
const BASE_URL = "https://api.themoviedb.org/3";
const YOUTUBE_KEY = "AIzaSyC6gpaOl3hckxilgh6TflSpSOQEynzoBTw";

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

// ========== MOVIES ==========
export async function searchMovies(query) {
  const encoded = encodeURIComponent(query);
  return fetchData(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encoded}`);
}

export async function getTrendingMovies() {
  return fetchData(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
}

export async function getUpcomingMovies() {
  return fetchData(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
}

export async function getMovieDetails(id) {
  return fetchData(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
}

export async function getMovieCredits(id) {
  return fetchData(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
}

export async function getMovieVideos(id) {
  return fetchData(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`);
}

// ========== TV SHOWS ==========
export async function searchTVShows(query) {
  const encoded = encodeURIComponent(query);
  return fetchData(`${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encoded}`);
}

export async function getTrendingTVShows() {
  return fetchData(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}`);
}

export async function getTVDetails(id) {
  return fetchData(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
}

export async function getTVCredits(id) {
  return fetchData(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}`);
}

export async function getTVVideos(id) {
  return fetchData(`${BASE_URL}/tv/${id}/videos?api_key=${API_KEY}`);
}

// ========== MULTI-SEARCH (movies + TV) ==========
export async function multiSearch(query) {
  const encoded = encodeURIComponent(query);
  return fetchData(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encoded}`);
}

// ========== GENRES & DISCOVER ==========
export async function getGenres() {
  return fetchData(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
}

export async function discoverMovies(genreId, sortBy) {
  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}`;
  if (genreId && genreId !== "") {
    url += `&with_genres=${genreId}`;
  }
  return fetchData(url);
}

// ========== YOUTUBE ==========
export async function searchYouTubeVideos(query) {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=3&key=${YOUTUBE_KEY}`
  );
  return response.json();
}
