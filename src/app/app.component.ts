import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',

})
export class AppComponent {
  
  title = 'Movie App';
  
  isScrolled = signal(false);

  constructor() {
    window.addEventListener('scroll', () => this.isScrolled.set(window.scrollY > 50));
  }

}