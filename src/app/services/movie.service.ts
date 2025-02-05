import { Injectable, ResourceRef, signal } from '@angular/core';
import { resource } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiKey = '4f1a57d401b3a2be40299f0f3d769e07';
  private baseUrl = 'https://api.themoviedb.org/3';

  // Signals for queries
  query = signal<string | null>(null);
  sugg = signal('');
  movieId = signal<string>('');

  // Signals for loading states
  isLoadingMovies = signal(false);

  // Movie resource
  movies = resource<any[], { query: string }>({
    request: () => ({ query: this.query() ?? '' }),
    loader: async ({ request, abortSignal }) => {
      this.isLoadingMovies.set(true);
      try {
        const url = request.query.length !== 0
          ? `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${request.query}`
          : `${this.baseUrl}/movie/popular?api_key=${this.apiKey}`;

        const response = await fetch(url, { signal: abortSignal });

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        return data.results;
      } finally {
        this.isLoadingMovies.set(false);
      }
    },
  });

  // Suggestions resource
  suggestions = resource<any[], { query: string }>({
    request: () => ({ query: this.sugg() }),
    loader: async ({ request, abortSignal }) => {
      this.isLoadingMovies.set(true);
      try {
        if (request.query.length === 0) {
          return [];
        }
        const url = `${this.baseUrl}/search/movie?api_key=${this.apiKey}&query=${request.query}`;
        const response = await fetch(url, { signal: abortSignal });

        if (!response.ok) {
          throw new Error('Failed to fetch movies');
        }

        const data = await response.json();
        return data.results;
      } finally {
        this.isLoadingMovies.set(false);
      }
    },
  });

  // Movie details Resource
  movieDetails = resource<any, { id: string }>({
    request: () => ({ id: this.movieId() }),
    loader: async ({ request, abortSignal }) => {
      this.isLoadingMovies.set(true);
      try {
        if (request.id.length === 0) {
          return [];
        }
        const url = `${this.baseUrl}/movie/${request.id}?api_key=${this.apiKey}`;
        const response = await fetch(url, { signal: abortSignal });

        if (!response.ok) {
          throw new Error('Movie not found');
        }

        return await response.json();
      } finally {
        this.isLoadingMovies.set(false);
      }
    },
  });

  // Method to update the search query
  setSearchQuery(query: string): void {
    this.query.set(query);
  }

  // Method to update the suggestions
  setSuggestionsQuery(query: string): void {
    this.sugg.set(query);
  }

  // Method to fetch movie details by ID
  getMovieDetails(id: string): ResourceRef<any> {
    this.movieId.set(id);
    return this.movieDetails;
  }
}