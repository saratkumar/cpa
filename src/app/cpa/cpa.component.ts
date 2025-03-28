import { Component, OnInit, ChangeDetectorRef  } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { CpaChartComponent } from '../cpa-chart/cpa-chart.component';
import { CommonModule } from '@angular/common';
import { CpaApiService } from '../service/common/cpa-api/cpa-api.service';
import { map, Observable, startWith } from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { CpaChartService } from '../service/cpa-chart.service';
@Component({
  selector: 'app-cpa',
  imports: [
    MatFormFieldModule, 
    MatSelectModule, 
    MatInputModule, 
    MatDatepickerModule,
    MatButtonModule,
    CpaChartComponent,
    CommonModule,
    MatAutocompleteModule,
    AsyncPipe,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './cpa.component.html',
  styleUrl: './cpa.component.css'
})
export class CpaComponent implements OnInit {
  selectedDate: any;
  selectedSystem: string = ""
  showChart: boolean = false;
  legendData: Array<any> = [];
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]> | undefined;


  constructor(
    private cpaApiService: CpaApiService, 
    private cpaChartService: CpaChartService, 
    private cdref: ChangeDetectorRef,
    ) {}
  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    //this.loadCriticalPaths();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  foods: any = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'},
  ];

  onGenerate(): void {
    this.showChart = !this.showChart;
    if(this.selectedDate) {
      const offset = this.selectedDate.getTimezoneOffset()
      const date = new Date(this.selectedDate.getTime() - (offset*60*1000));
      this.showChart = true;
      const modifiedDate =date.toISOString().split('T')[0] 
      this.cpaApiService.generateCPA({date: modifiedDate.replaceAll("-", ""), system: this.selectedSystem}).subscribe(e => console.log(e));

      
    }
    
  }

  onAfterProcessingCriticalPath(): any {
    this.legendData = Object.keys(this.cpaChartService.allSystemProps).map((key) => ({
      label: key,
      color: this.cpaChartService.allSystemProps[key].color,
      total: this.cpaChartService.allSystemProps[key].total,
      jobs: this.cpaChartService.allSystemProps[key].jobs,
    }));
    this.cdref.detectChanges();
  }

}
