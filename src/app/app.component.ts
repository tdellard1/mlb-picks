import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
],
  template: '<p>App Component Works</p>',
  styleUrl: './app.component.css',
})
export class AppComponent {}
