import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CpaChartService {

  criticalPathTotalMap: any = {};
  allSystemProps: any = {};
  criticalPathColorCode: any = {};
  criticalPathSystemWiseTotalObj: any = {};
  constructor() { }

  public calculateNodeWidth(d: any): number {
    const textLength = d.data.name.length;
    return Math.max(50, textLength * 10); // Minimum width 50, adjust multiplier (10) as needed
  }

  generateDarkColor(): string {
    const r = Math.floor(Math.random() * 101 + 100);
    const g = Math.floor(Math.random() * 101 + 100);
    const b = Math.floor(Math.random() * 101 + 100);
    return `rgb(${r}, ${g}, ${b})`;
  }

  clearService(): void {
    this.criticalPathTotalMap = {};
    this.allSystemProps = {};
    this.criticalPathColorCode = {};
    this.criticalPathSystemWiseTotalObj = {};
  }

  setAllSystemColorCode(systemsProps: any) {
    this.allSystemProps = systemsProps;
  }

  /**
   * this method will get the job name and get system name of the job
   * @param name 
   * @returns job name as a string
   */

  getJobName(name: string): Object {
    // const sampleFileNameForNow = "adfafasfas asdfadsfasd adfafasfas adfafasfas adfadsadsfa" 
    if (name) {
      const _ = name.split("_");
      const sysName: any = _.pop();
      return {jobName: _.join("_"), system: sysName}
      // return {jobName: sampleFileNameForNow, system: sysName};
    }
    return {jobName: "", system: ""};

  }

  
  extractSystemAttributes(criticalPaths: Array<any>): void {
    criticalPaths.forEach((path: any, index: number) => {
      const { jobName, system }: any = this.getJobName(path.source);
      this.allSystemProps[system] = this.allSystemProps[system] || {...this.allSystemProps[system], color: this.generateDarkColor(), total: 0, maxValue: Number.MIN_VALUE, jobs: []};
      if(index === criticalPaths.length -1) {
        const { jobName, system }: any = this.getJobName(path.target);
        this.allSystemProps[system] = this.allSystemProps[system] || {...this.allSystemProps[system], color: this.generateDarkColor(), total: 0, maxValue: Number.MIN_VALUE, jobs: []};
          
      }
      this.allSystemProps[system].total += parseFloat(path.value);
      if(parseFloat(path.value) > this.allSystemProps[system].maxValue) {
        this.allSystemProps[system].maxValue = parseFloat(path.value);
        this.allSystemProps[system].jobs = [jobName];
        
      }
    });
;

    console.log(this.allSystemProps, "asdfs");
     
  }
  
}
