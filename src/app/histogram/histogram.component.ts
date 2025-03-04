import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { CpaApiService } from '../service/common/cpa-api/cpa-api.service';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.css'],
  imports:[CommonModule],
  standalone: true
})
export class HistogramComponent implements OnInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;
  @Input("nodeDetails") nodeDetails: any;

  private threshold: {startTime: any, endTime: any} = {
    startTime: "",
    endTime: ""
  };
  private processData: { date: Date; duration: number }[] = [];

  jobHistory$: Observable<any> | undefined;
  constructor(private cpaApiService: CpaApiService) {}
  ngOnInit(): void {
    console.log(this.nodeDetails);
    this.getJobHistory();
    
  }

  private getJobHistory(): void {
    this.jobHistory$ = this.cpaApiService.getJobHistories({
      "system":"APP001",
      "entity": "SG",
      "jobName": "Job_A",
      "startDate": "20250222",
      "endDate": "20250225"
    });

    this.generateGraphData(this.jobHistory$);
  }

  private generateGraphData(jobHistory$: Observable<any>): void {
    const now = new Date();  // Get today's date
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - 89);  // 90 days ago (start date)
    jobHistory$.subscribe((e: any) => {
      e?.cpaEtaHistories.forEach((el: any) => {
        let year = parseInt(el.businessDate.substring(0, 4));  // First 4 characters: year
        let month = parseInt(el.businessDate.substring(4, 6)) - 1;  // Next 2 characters: month (0-indexed)
        let day = parseInt(el.businessDate.substring(6, 8)); 
        this.processData.push({date: new Date(year, month, day), duration: this.findDifferenceInMinutes(new Date(el.startDateTime), new Date(el.endDateTime))});
      });
      this.setThreshold(e);
      this.createChart();
    })
    // // Generate sequential data for the last 90 days
    // this.processData = Array.from({ length: 90 }, (_, i) => {
    //   const date = new Date(startDate);
    //   date.setDate(startDate.getDate() + i);  // Increment by one day
    //   date.setHours(0, 0, 0, 0);  // Normalize to the start of the day

    //   const duration = Math.floor(Math.random() * 115) + 5;  // Random duration (5 - 120 min)
    //   return { date, duration };
    // });
  }

  private createChart(): void {
    const element = this.chartContainer.nativeElement;
    const margin = { top: 50, right: 30, bottom: 80, left: 60 };
    const width = 1100 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    const thresholdValue = this.findDifferenceInMinutes(this.threshold.startTime, this.threshold.endTime); // Your base threshold
    const anomalyThreshold = thresholdValue * 1.3; // 30% above the threshold
    // Set up SVG container
    const svg = d3.select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // X-axis: Band Scale for Dates
    const x = d3.scaleBand()
      .domain(this.processData.map(d => d3.timeFormat("%b %d")(d.date))) // Format as "Mar 01"
      .range([0, width])
      .padding(0.3);

    // Y-axis: Duration in Minutes
    const y = d3.scaleLinear()
      .domain([0, d3.max(this.processData, d => d.duration)!])
      .nice()
      .range([height, 0]);

    // Add X-axis
    // svg.append('g')
    //   .attr('transform', `translate(0,${height})`)
    //   .call(d3.axisBottom(x).tickValues(x.domain().filter((_, i) => i % 10 === 0))) // Show only some ticks
    //   .selectAll("text")
    //   .attr("transform", "rotate(-45)")
    //   .style("text-anchor", "end");
    svg.append('g')
  .attr('transform', `translate(0,${height})`)
  .call(d3.axisBottom(x))
  .selectAll("text")
  .attr("transform", "rotate(-45)")  // Rotate labels
  .style("text-anchor", "end")
  .style("font-size", "8px");  // Optional: reduce font size for better readability

    // Add Y-axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5));

    // Add Bars
    svg.selectAll('.bar')
      .data(this.processData)
      .enter()
      .append('rect')
      .attr('x', d => x(d3.timeFormat("%b %d")(d.date))!)
      .attr('y', d => y(d.duration)!)
      .attr('width', x.bandwidth())
      .attr('height', d => height - y(d.duration)!)
      .attr("fill", d => d.duration > anomalyThreshold ? "red" : "steelblue")
      .attr('rx', 5) // Rounded corners
      .attr('ry', 5);

    // Add Labels on Top of Bars
    svg.selectAll('.label')
      .data(this.processData)
      .enter()
      .append('text')
      .attr('x', d => x(d3.timeFormat("%b %d")(d.date))! + x.bandwidth() / 2)
      .attr('y', d => y(d.duration)! - 5) // Slightly above the bar
      .attr('text-anchor', 'middle')
      .style('fill', 'black')
      .style('font-size', '10px')
      .text(d => `${d.duration}`);

          // **Create Legend** at the top of the chart
    const legend = svg.append('g')
    .attr('transform', 'translate(0, -40)'); // Move legend above the chart

  legend.append('rect')
    .attr('x', 0)
    .attr('y', 10)
    .attr('width', 10)
    .attr('height', 10)
    .style('fill', 'steelblue');  // Same color as the bars

  legend.append('text')
    .attr('x', 25) // Position the text next to the color box
    .attr('y', 20)  // Vertically center the text
    .text('Process Duration (minutes)')
    .style('font-size', '12px')
    .style('fill', 'black');

    svg.append("text")
    .attr("x", width / 2) // Center the legend
    .attr("y", -20) // Position above the graph
    .attr("text-anchor", "middle")
    .attr("fill", "red")
    .style("font-size", "14px")
    .style("font-weight", "bold")
    .text(`Anomalies: ${this.processData.filter(d => d.duration > anomalyThreshold).length}`);

// Compute the Y position of the threshold line
const thresholdY = y(thresholdValue);

// Append a horizontal line to the SVG
svg.append("line")
    .attr("x1", 0)  // Start from the left edge
    .attr("x2", width)  // End at the right edge
    .attr("y1", thresholdY)
    .attr("y2", thresholdY)
    .attr("stroke", "red")  // Color of the line
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "5,5"); // Makes it a dashed line

  }


  private findDifferenceInMinutes(startDateTime: any, endDateTime: any): number {
    let durationMilliseconds = endDateTime - startDateTime;
    let durationSeconds = Math.floor(durationMilliseconds / 1000); // seconds
    let durationMinutes = Math.floor(durationSeconds / 60); // minutes
    // let durationHours = Math.floor(durationMinutes / 60); // hours

    return durationMinutes;
  }


  private getDateFromTimeString(timeString: string): Date {

    // Split the time string into hours, minutes, and seconds
    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    // Create a new Date object with today's date
    const dateWithTime = new Date();
    dateWithTime.setHours(hours, minutes, seconds, 0); // Set the time

    return dateWithTime;

  };

  private setThreshold(e: any): void {
    this.threshold.startTime = this.getDateFromTimeString(e.startTime);
    this.threshold.endTime = this.getDateFromTimeString(e.endTime);

  }

  
}
