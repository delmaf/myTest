import { Component, inject } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { MovieComponent } from '../movie/movie.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, MovieComponent, FormsModule, RouterModule], // Добавили RouterModule
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent {
  private movieService = inject(MovieService);

  // Access the movies resource
  movies = this.movieService.movies;

  // Access the search query signal
  searchQuery = this.movieService.query;

  // Handle search input
  onSearch(query: string): void {
    this.movieService.setSearchQuery(query);
  }
}
