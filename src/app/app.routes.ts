import { Routes } from '@angular/router';
import { CpaComponent } from './cpa/cpa.component';
import { CpaChartComponent } from './cpa-chart/cpa-chart.component';

export const routes: Routes = [
    {path: "critical-path", component:  CpaComponent},
    {path: "critical-path/render", component:  CpaChartComponent}
];
