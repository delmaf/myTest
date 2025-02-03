import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule], // Import CommonModule for ngIf, etc.
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css'],
})
export class MovieDetailComponent {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  // Fetch movie details using the service
  movie = this.movieService.getMovieDetails(this.route.snapshot.paramMap.get('id')!);
}