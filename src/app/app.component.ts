import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElementTableComponent } from './components/element-table/element-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ElementTableComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
}
