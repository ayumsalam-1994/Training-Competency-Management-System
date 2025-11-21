import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../navbar/navbar';

@Component({
    selector: 'app-main-layout',
    standalone: true,
    imports: [RouterOutlet, Navbar],
    templateUrl: './main-layout.html',
    styles: [`
    .main-content {
      background-color: #f0f2f5;
      min-height: calc(100vh - 56px);
      padding: 1rem;
    }
  `]
})
export class MainLayout { }
