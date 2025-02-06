import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, ViewChild, effect  } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MovieService } from './services/movie.service';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
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
  showDropdown = false;
  searchControl = new FormControl('');

  // searchQuery = signal('');

  // constructor(private movieService: MovieService) {
  //   effect(() => {
  //     if (this.searchQuery()) {
  //       this.movieService.setSuggestionsQuery(this.searchQuery());
  //     } else {
  //       this.movieService.suggestions.set([]);
  //     }
  //   });
  // }

  // Initialize the component
  ngOnInit(): void {
    this.initApp();
  }

  initApp() {
    window.addEventListener('scroll', () => {
      this.isScrolled.set(window.scrollY > 50);
      this.showDropdown = false;
      this.searchInput.nativeElement.blur();
    });

    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
    ).subscribe((filteredResults) => {
      if(filteredResults) this.movieService.setSuggestionsQuery(filteredResults);
      else this.movieService.suggestions.set([]);
    });
  }

  onSearch(): void {
    const query = this.searchControl.value;
    if (query) {
      this.movieService.setSearchQuery(query);
    }
  }

  onSuggestionSelected(suggestion: any): void {
    this.searchControl.setValue(suggestion.title); 
    this.router.navigate(['/movie', suggestion.id]);
  }

  goHome() {
    this.router.navigate(['']);
    this.searchControl.setValue('');
    this.movieService.setSuggestionsQuery('');
    this.movieService.setSearchQuery('');
  }
}