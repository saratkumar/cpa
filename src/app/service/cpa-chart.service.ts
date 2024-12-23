import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CpaChartService {

  constructor() { }

  public isCriticalPath(d: any): boolean {
    const criticalNodes = ['1', '3', '6'];  // List of critical path node names
    if (d.data) {
      return criticalNodes.includes(d.data.name);
    } else if (d.source) {
      return (criticalNodes.includes(d.source.data.name) && criticalNodes.includes(d.target.data.name));
    }
    return false;
  }

  public calculateNodeWidth(d: any): number {
    const textLength = d.data.name.length;
    return Math.max(50, textLength * 10); // Minimum width 50, adjust multiplier (10) as needed
  }
}
