import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css'],
})
export class MovieComponent {
  private router = inject(Router);

  @Input() movie: any;
  
  goToMovieDetail(id: number): void {
    this.router.navigate(['/movie', id]);
  }
}