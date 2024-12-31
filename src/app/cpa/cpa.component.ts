import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { CpaChartComponent } from '../cpa-chart/cpa-chart.component';
import { CommonModule } from '@angular/common';
import { CpaApiService } from '../service/common/cpa-api/cpa-api.service';
@Component({
  selector: 'app-cpa',
  imports: [
    MatFormFieldModule, 
    MatSelectModule, 
    MatInputModule, FormsModule, 
    MatDatepickerModule,
    MatButtonModule,
    CpaChartComponent,
    CommonModule
  ],
  templateUrl: './cpa.component.html',
  styleUrl: './cpa.component.css'
})
export class CpaComponent {
  selectedDate: any;
  selectedSystem: string = ""
  showChart: boolean = false;

  constructor(private cpaApiService: CpaApiService) {}

  foods: any = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  onGenerate(): void {
    this.showChart = true;
    if(this.selectedDate) {
      const offset = this.selectedDate.getTimezoneOffset()
      const date = new Date(this.selectedDate.getTime() - (offset*60*1000));
      this.showChart = true;
      const modifiedDate =date.toISOString().split('T')[0] 
      this.cpaApiService.generateCPA({date: modifiedDate.replaceAll("-", ""), system: this.selectedSystem}).subscribe(e => console.log(e));
    }
    
  }
}
