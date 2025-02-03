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

  // Resource for fetching movies
  movies = resource<any[], { query: string }>({
    request: () => ({ query: this.query() }), // Pass the current query
    loader: async ({ request, abortSignal }) => {
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

  // Method to update the search query
  setSearchQuery(query: string): void {
    this.query.set(query);
  }
}