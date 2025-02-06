import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild, effect } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import { MovieService } from './services/movie.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, MatProgressBarModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  public movieService = inject(MovieService);
  private router = inject(Router);
  
  title = 'Movie App';
  isScrolled = signal(false);
  showDropdown = signal(false);
  searchControl = signal('');

  constructor() {
    window.addEventListener('scroll', () => {
      this.isScrolled.set(window.scrollY > 50);
      this.showDropdown.set(false);
      this.searchInput?.nativeElement?.blur();
    });

    let debounceTimeout: ReturnType<typeof setTimeout> | null = null;

    effect(() => {
      const query = this.searchControl();
  
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
  
      debounceTimeout = setTimeout(() => {
        if (query) {
          this.movieService.setSuggestionsQuery(query);
        } else {
          this.movieService.suggestions.set([]);
        }
      }, 400);
    });
  }

  onInput(value: any) {
    this.searchControl.set(value);
  }

  onSearch(): void {
    const query = this.searchControl();
    if (query) {
      this.movieService.setSearchQuery(query);
    }
  }

  onSuggestionSelected(suggestion: any): void {
    this.searchControl.set(suggestion.title);
    this.router.navigate(['/movie', suggestion.id]);
  }

  goHome() {
    this.router.navigate(['']);
    this.searchControl.set('');
    this.movieService.setSuggestionsQuery('');
    this.movieService.setSearchQuery('');
  }
}