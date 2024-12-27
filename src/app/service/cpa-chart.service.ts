import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CpaChartService {

  criticalPathTotalMap: any = {};
  allSystemProps: any = {};
  criticalPathColorCode: any = {};
  constructor() { }

  public isCriticalPath(d: any): boolean {

    // console.log("This one getting called second", );
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

  /***
   * Get total value of the path
   */

  getTotalValueOfPath(d: any, val: number, systems: Array<string>): number {
    if(!d.parent) {
      // systems.push(d.data.system);
      const t = val + parseFloat(d.data.value);
      this.criticalPathTotalMap[Date.now()] = {total : t, systems: this.removeDuplicateSystems(systems)}
      // console.log("This one getting called first", this.criticalPathTotalMap);
      return t;
    }
    
    val = val + parseFloat(d.data.value);
    // systems.push(d.data.system);
    return this.getTotalValueOfPath(d.parent, val, systems);                                  
  }

  removeDuplicateSystems(array: any): Array<String> {
    array = [...new Set(array)];
    return array;
  }

  extractCPAPath(paths: any): void  {
    this.criticalPathColorCode = {};
    paths.forEach((path: any) => {
      const {system: sourceSystem, jobName: sourceJobName}: any = this.getJobName(path.source);
      const {system: targetSystem, jobName: targetJobName}: any = this.getJobName(path.target);
      this.criticalPathColorCode[sourceJobName] = this.allSystemProps[sourceSystem].color;
      this.criticalPathColorCode[targetJobName] = this.allSystemProps[targetSystem].color;
    });
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
      if(!this.allSystemProps[sysName]) {
        this.allSystemProps[sysName] = {color: this.generateDarkColor()};
      }
      return {jobName: _.join("_"), system: sysName}
      // return {jobName: sampleFileNameForNow, system: sysName};
    }
    return {jobName: "", system: ""};

  }
  
}
