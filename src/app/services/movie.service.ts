import { Injectable, signal } from '@angular/core';
import { resource } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiKey = '4f1a57d401b3a2be40299f0f3d769e07';
  private baseUrl = 'https://api.themoviedb.org/3';

  // Signal for search query
  query = signal('');

  // Signal for movie ID
  movieId = signal<string>('');

  // Resource for fetching movies
  movies = resource<any[], { query: string }>({
    request: () => ({ query: this.query() }),
    loader: async ({ request, abortSignal }) => {
      //ternart condition for fetching popular or by search
      const url = request.query
        ? `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${request.query}`
        : `${this.baseUrl}/movie/popular?api_key=${this.apiKey}`;

      const response = await fetch(url, { signal: abortSignal });

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      return data.results;
    },
  });

  // Resource for fetching movie details
  movieDetails = resource<any, { id: string }>({
    request: () => ({ id: this.movieId() }), // Pass the current movie ID
    loader: async ({ request, abortSignal }) => {
      const url = `${this.baseUrl}/movie/${request.id}?api_key=${this.apiKey}`;
      const response = await fetch(url, { signal: abortSignal });

      if (!response.ok) {
        throw new Error('Movie not found');
      }

      return await response.json();
    },
  });

  // Method to update the search query
  setSearchQuery(query: string): void {
    this.query.set(query);
  }

  // Method to fetch movie details by ID
  getMovieDetails(id: string) {
    this.movieId.set(id); // Update the movieId signal to trigger the resource
    return this.movieDetails; // Return the resource's value
  }
}