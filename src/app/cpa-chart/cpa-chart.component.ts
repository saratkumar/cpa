// @tsds-nocheck

  /***
   * Normally job contains two details
   * 1. source to destination system details
   * 2. path to source to destination 
   * Job details -> JOB1_SYSTEMName to JOB4_SystemName JOB1_SystemName -> JOB2_SystemName JOB2_SystemName -> JOB3_SystemName JOB3_SystemName -> JOB4_SystemName 
   * 1. JOB1_SYSTEMName to JOB4_SystemName
   * 2. JOB1_SystemName -> JOB2_SystemName JOB2_SystemName -> JOB3_SystemName JOB3_SystemName -> JOB4_SystemName
   * 
   * we need to extract information from job details and consturct root to end node details
   */

   // 1 postion will have source system
      // 2 position will have to or -> string
      // 3 position will have target value
      // 4 position will have timing details 


import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CpaChartSvgService } from '../service/cpa-chart-svg.service';
import { SideModalComponent } from './side-modal/side-modal.component';
import { CpaChartService } from '../service/cpa-chart.service';

@Component({
  selector: 'app-cpa-chart',
  template: `<div id="cpa-chart"></div><app-side-modal #modalR></app-side-modal>`,
  standalone: true,
  imports:[SideModalComponent],
  styleUrls: ['./cpa-chart.component.css']
})
export class CpaChartComponent {
  @ViewChild('modalR') modalRef: SideModalComponent | any;
  constructor(private el: ElementRef, private cpaChartSvgService: CpaChartSvgService, private cpaChartService: CpaChartService) { }
  
  treeData: any = {};
  map: any = new Map();
  criticalPath: Array<String> = [];
  ngAfterViewInit(): void {
    this.parseJob();
    this.cpaChartService.extractCPAPath(this.criticalPath);
    this.createBSTChart();
    
    
  }

  private createBSTChart(): void {
    
    const element = this.el.nativeElement.querySelector('#cpa-chart');
    this.cpaChartSvgService.buildGraph(element, this.treeData, this.modalRef);

  }

  private isCriticalPath(d: any): boolean {
    const criticalNodes = ['1', '3', '6'];  // List of critical path node names
    if (d.data) {
      return criticalNodes.includes(d.data.name);
    } else if (d.source) {
      return (criticalNodes.includes(d.source.data.name) && criticalNodes.includes(d.target.data.name));
    }
    return false;
  }
  
  jobInfo: any = [
    // "APP_CODE JOB_1_System1 to JOB_1_System1 (0.00)",
    // "APP_CODE JOB_1_System1 to JOB_14_System1 (3.00)",
    // "APP_CODE JOB_14_System1 to JOB_15_System1 (2.00)",
    // "APP_CODE JOB_15_System1 to JOB_16_System2 (10.00)",
    // "APP_CODE JOB_16_System2 to JOB_12_System3 (5.00)",
    // "APP_CODE JOB_12_System3 to JOB_13_System4 (4.00)",
    // "APP_CODE JOB_13_System4 to JOB_10_System5 (8.00)",
    // "APP_CODE JOB_10_System5 to JOB_2_System6 (1.00)  JOB_10_System5 -> JOB_2_System6  1.00",
    // "APP_CODE JOB_10_System5 to JOB_6_System6 (28.00)  JOB_10_System5 -> JOB_3_System6 20.00 JOB_3_System6 -> JOB_6_System6 8.00",
    // "APP_CODE JOB_10_System5 to JOB_7_System6 (7.00)  JOB_10_System5 -> JOB_4_System6  1.00 JOB_4_System6 -> JOB_7_System6  6.00",
    // "APP_CODE JOB_10_System5 to JOB_3_System6 (17.00)  JOB_10_System5 -> JOB_5_System6 17.00"];
    // "APP_CODE JOB_1_System1 to JOB_1_System1 (0.00)",
    // "APP_CODE JOB_1_System1 to JOB_5_System5 (3.00) JOB_1_System1 -> JOB_2_System2  1.00  JOB_2_System2 -> JOB_3_System3  1.00 JOB_3_System3 -> JOB_5_System5  1.00",
    // "APP_CODE JOB_1_System1 to JOB_6_System6 (3.00) JOB_1_System1 -> JOB_2_System2  1.00  JOB_2_System2 -> JOB_3_System3  1.00 JOB_3_System3 -> JOB_6_System6  1.00",
    "APP_CODE IDOD_SG_LCR_LOANDEPO5_SYS1 to IDOD_SG_LCR_LOANDEPO5_SYS1 (0.00)",
    "APP_CODE IDOD_SG_LCR_LOANDEPO5_SYS1 to PDM_SG_RM_FPRO_SELL_BUY_SYS1 (3.00) IDOD_SG_LCR_LOANDEPO5_SYS1 -> IDOD_SG_LCR_LOANDEPO_SYS1  1.00  IDOD_SG_LCR_LOANDEPO_SYS1 -> IDOD_SG_LCR_LOANDEPO8_SYS1  1.00 IDOD_SG_LCR_LOANDEPO8_SYS1 -> PDM_SG_RM_FPRO_SELL_BUY_SYS1  1.00",
    "APP_CODE IDOD_SG_LCR_LOANDEPO5_SYS1 to PDM_SG_RM_COLLATERAL_COLL_NOT_IN_SYS2 (4.00) IDOD_SG_LCR_LOANDEPO5_SYS1 -> IDOD_SG_LCR_LOANDEPO_SYS1  1.00  IDOD_SG_LCR_LOANDEPO_SYS1 -> IDOD_SG_LCR_LOANDEPO8_SYS1  1.00 IDOD_SG_LCR_LOANDEPO8_SYS1 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_SYS2  2.00",
  ];

  parseJob(): void {
    let max = Number.MIN_VALUE;
    this.jobInfo.forEach((job: any, index: any) => {
      const ctx = job.split(") ");
      const d_ = ctx[0].replace("(", "").replace(")", "");
      // this.extractCriticalPath(ctx[1]);
      const {appCode, totalVal} = this.extractHeadNodeProp(d_);
      const sourceTargetDetailStr = d_.replace(appCode + " ", "");
      const extractedSourceTargetDetail: any = this.extractJobDetail(sourceTargetDetailStr, true);
      const extractedPaths: any = [];
      if (ctx[1]) {
        const paths = this.extractJobPath(ctx[1].trim());
        paths.forEach((path: any) => {
          const eSTD: any = this.extractJobDetail(path, false);
          extractedPaths.push({ source: eSTD[1], target: eSTD[3], value: eSTD[4], pathStr: path });
        });
        if(totalVal > max) {
          max = totalVal;
          this.criticalPath = extractedPaths;
        }
      }

     

      this.map.set(extractedSourceTargetDetail[1] + "/" + extractedSourceTargetDetail[3] + "/" + index, {
        appCode,
        source: extractedSourceTargetDetail[1],
        target: extractedSourceTargetDetail[3],
        value: extractedSourceTargetDetail[4],
        pathStr: sourceTargetDetailStr,
        paths: extractedPaths
      });
    });
    const rootNode = this.findRootNode(this.map);
    const {jobName, system}: any = this.cpaChartService.getJobName(rootNode.root);
    this.treeData = this.prepareChartData(rootNode.root, { name: jobName, children: [], system, value: "0.0" }, rootNode.chartData);
  }

  /***
   * this is kind of recurive method to find the last child of the node and push it into result field
   *
   */

  prepareChartData(key: any, result: any, chartData: any): any {
    chartData[key].forEach((child: any) => {
      if (key !== child.name) {
        const {jobName, system}: any = this.cpaChartService.getJobName(child.name);
        if (chartData[child.name]) {
          result = result || { name: key, children: [] };
          result.children.indexOf(jobName) === -1 && result.children.push({ name: jobName, children: [], value: child.value, system });
          this.prepareChartData(child.name, result.children.at(-1), chartData);
        } else {
          result = result || { name: key, children: [] };
          result.children.indexOf(jobName) === -1 && result.children.push({ name: jobName, children: [], value: child.value, system });
        }
      }

    });
    return result;

  }

  /***
   * with the extracted data from the string values, constructing a object 
   * with root node and its children
   */

  findRootNode(map: any): any {
    let str = "";
    const chartData: any = {};
    for (let key of map.keys()) {
      const val = map.get(key);
      if (val.paths.length) {
        val.paths.forEach((path: any) => {
          chartData[path.source] = chartData[path.source] || [];
          if(!this.checkNodeAlreadyPresent(chartData[path.source], path)) {
            chartData[path.source].push({ name: path.target, value: path.value, source: path.source, target: path.target });
          }
          
        })
      } else {
        chartData[val.source] = chartData[val.source] || [];
        if(!this.checkNodeAlreadyPresent(chartData[val.source], val)) {
          chartData[val.source].push({ name: val.target, value: val.value, source: val.source, target: val.target });
        }
        
      }

      if (val.source === val.target) {
        str = val.source;
      }

    }
    return { root: str, chartData };
  }



  private extractHeadNodeProp(val: string): any {
    const nodeProps = val.split(" ");
    return {appCode: nodeProps[0], totalVal: nodeProps[nodeProps.length-1]};
  }

  /**to restrict duplicate node entries */
  private checkNodeAlreadyPresent(arr: Array<any>, currCtx: any): boolean {
    const index  = arr.findIndex((el: any) => (el.source === currCtx.source && el.target === currCtx.target));
    return index > -1 ? true : false;
  }

  /***
   *  @path JOB1_SystemName -> JOB2_SystemName
   * 
   * returns ["JOB1_SystemName -> JOB2_SystemName", "JOB1_SystemName", "->" or "to" , "JOB2_SystemName"] 
   */
  private extractJobPath(path: string): any {
    const regex = /([A-Za-z0-9/\\_]+)\s*->\s*([A-Za-z0-9/\\_]+)(\s+\d+\.\d+)?/g;
    const matches = path.match(regex);
    if (matches) {
      return matches;
    } else {
      return [];
    }
  }

  /**
   * Job path details -> JOB1_SystemName -> JOB2_SystemName JOB2_SystemName -> JOB3_SystemName JOB3_SystemName -> JOB4_SystemName 
   * 
   * @returns [ "JOB1_SystemName -> JOB2_SystemName JOB2_SystemName", "JOB2_SystemName -> JOB3_SystemName", "JOB3_SystemName -> JOB4_SystemName"]
   */

  private extractJobDetail(job: string, isRoot = false) {
    const regexWithGroups = /([A-Za-z0-9/\\_]+)\s*(to|->)\s*([A-Za-z0-9/\\_]+)(\s+\d+\.\d+)?/;
    const result = job.match(regexWithGroups);

    return result;
  }

  ngOnDestroy(): void {
    this.clearService();
    this.cpaChartService.clearService();
    this.cpaChartSvgService.clearService();
  }


  clearService(): void {
    this.treeData = {};
    this.map = new Map();
  }

  

}


