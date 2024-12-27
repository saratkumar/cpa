import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CpaChartComponent } from './cpa-chart/cpa-chart.component';

@Component({
  selector: 'app-root',
  imports: [ 
    CpaChartComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'cpa-ui';
}
