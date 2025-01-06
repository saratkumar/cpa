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
import e from 'express';

@Component({
  selector: 'app-cpa-chart',
  template: `<div id="cpa-chart"></div><app-side-modal #modalR></app-side-modal>`,
  standalone: true,
  imports: [SideModalComponent],
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
    this.createBSTChart();


  }

  private createBSTChart(): void {

    const element = this.el.nativeElement.querySelector('#cpa-chart');
    this.cpaChartSvgService.buildGraph(element, this.treeData, this.modalRef);

  }


  jobInfo: any = [
    "APP_CODE IDOD_SG_LCR_LOANDEPO5_SYS1 to PDM_SG_RM_FPRO_SELL_BUY_SYS1 (24.00) IDOD_SG_LCR_LOANDEPO5_SYS1 -> IDOD_SG_LCR_LOANDEPO_SYS1  2.00 IDOD_SG_LCR_LOANDEPO_SYS1 -> IDOD_SG_LCR_LOANDEPO2_SYS1  1.00 IDOD_SG_LCR_LOANDEPO2_SYS1 -> IDOD_SG_LCR_LOANDEPO40_SYS1  1.00 IDOD_SG_LCR_LOANDEPO40_SYS1 -> IDOD_SG_LCR_LOANDEPO9_SYS1  1.00 IDOD_SG_LCR_LOANDEPO9_SYS1 -> IDOD_SG_LCR_LOANDEPO10_SYS1  1.00 IDOD_SG_LCR_LOANDEPO10_SYS1 -> IDOD_SG_LCR_LOANDEPO11_SYS1  1.00 IDOD_SG_LCR_LOANDEPO11_SYS1 -> IDOD_SG_LCR_LOANDEPO12_SYS1  1.00 IDOD_SG_LCR_LOANDEPO12_SYS1 -> IDOD_SG_LCR_LOANDEPO14_SYS1  1.00 IDOD_SG_LCR_LOANDEPO14_SYS1 -> IDOD_SG_LCR_LOANDEPO15_SYS1  1.00 IDOD_SG_LCR_LOANDEPO15_SYS1 -> IDOD_SG_LCR_LOANDEPO16_SYS1  1.00 IDOD_SG_LCR_LOANDEPO16_SYS1 -> IDOD_SG_LCR_LOANDEPO17_SYS1  1.00 IDOD_SG_LCR_LOANDEPO17_SYS1 -> IDOD_SG_LCR_LOANDEPO18_SYS1  1.00 IDOD_SG_LCR_LOANDEPO18_SYS1 -> IDOD_SG_LCR_LOANDEPO19_SYS1  1.00 IDOD_SG_LCR_LOANDEPO19_SYS1 -> IDOD_SG_LCR_LOANDEPO20_SYS1  1.00 IDOD_SG_LCR_LOANDEPO20_SYS1 -> IDOD_SG_LCR_LOANDEPO21_SYS1  1.00 IDOD_SG_LCR_LOANDEPO21_SYS1 -> IDOD_SG_LCR_LOANDEPO22_SYS1  1.00 IDOD_SG_LCR_LOANDEPO22_SYS1 -> IDOD_SG_LCR_LOANDEPO23_SYS1  1.00 IDOD_SG_LCR_LOANDEPO23_SYS1 -> IDOD_SG_LCR_LOANDEPO24_SYS1  1.00 IDOD_SG_LCR_LOANDEPO24_SYS1 -> IDOD_SG_LCR_LOANDEPO25_SYS1  1.00 IDOD_SG_LCR_LOANDEPO25_SYS1 -> IDOD_SG_LCR_LOANDEPO26_SYS1  1.00 IDOD_SG_LCR_LOANDEPO26_SYS1 -> IDOD_SG_LCR_LOANDEPO27_SYS1  1.00 IDOD_SG_LCR_LOANDEPO27_SYS1 -> IDOD_SG_LCR_LOANDEPO28_SYS1  1.00 IDOD_SG_LCR_LOANDEPO28_SYS1 -> IDOD_SG_LCR_LOANDEPO29_SYS1  1.00 IDOD_SG_LCR_LOANDEPO29_SYS1 -> IDOD_SG_LCR_LOANDEPO30_SYS1  1.00 IDOD_SG_LCR_LOANDEPO30_SYS1 -> PDM_SG_RM_FPRO_SELL_BUY_SYS1  1.00",
    "APP_CODE IDOD_SG_LCR_LOANDEPO5_SYS1 to PDM_SG_RM_FPRO_SELL_BUY_SYS1 (26.00) IDOD_SG_LCR_LOANDEPO5_SYS1 -> IDOD_SG_LCR_LOANDEPO_SYS1  2.00 IDOD_SG_LCR_LOANDEPO_SYS1 -> IDOD_SG_LCR_LOANDEPO2_SYS1  1.00 IDOD_SG_LCR_LOANDEPO2_SYS1 -> IDOD_SG_LCR_LOANDEPO40_SYS1  1.00 IDOD_SG_LCR_LOANDEPO40_SYS1 -> IDOD_SG_LCR_LOANDEPO9_SYS1  1.00 IDOD_SG_LCR_LOANDEPO9_SYS1 -> IDOD_SG_LCR_LOANDEPO10_SYS1  1.00 IDOD_SG_LCR_LOANDEPO10_SYS1 -> IDOD_SG_LCR_LOANDEPO11_SYS1  1.00 IDOD_SG_LCR_LOANDEPO11_SYS1 -> IDOD_SG_LCR_LOANDEPO12_SYS1  1.00 IDOD_SG_LCR_LOANDEPO12_SYS1 -> IDOD_SG_LCR_LOANDEPO14_SYS1  1.00 IDOD_SG_LCR_LOANDEPO14_SYS1 -> IDOD_SG_LCR_LOANDEPO15_SYS1  1.00 IDOD_SG_LCR_LOANDEPO15_SYS1 -> IDOD_SG_LCR_LOANDEPO16_SYS1  1.00 IDOD_SG_LCR_LOANDEPO16_SYS1 -> IDOD_SG_LCR_LOANDEPO217_SYS1  1.00 IDOD_SG_LCR_LOANDEPO217_SYS1 -> IDOD_SG_LCR_LOANDEPO218_SYS1  1.00 IDOD_SG_LCR_LOANDEPO218_SYS1 -> IDOD_SG_LCR_LOANDEPO219_SYS1  1.00 IDOD_SG_LCR_LOANDEPO219_SYS1 -> IDOD_SG_LCR_LOANDEPO220_SYS1  1.00 IDOD_SG_LCR_LOANDEPO220_SYS1 -> IDOD_SG_LCR_LOANDEPO221_SYS1  1.00 IDOD_SG_LCR_LOANDEPO221_SYS1 -> IDOD_SG_LCR_LOANDEPO222_SYS1  1.00 IDOD_SG_LCR_LOANDEPO222_SYS1 -> IDOD_SG_LCR_LOANDEPO223_SYS1  1.00 IDOD_SG_LCR_LOANDEPO223_SYS1 -> IDOD_SG_LCR_LOANDEPO224_SYS1  1.00 IDOD_SG_LCR_LOANDEPO224_SYS1 -> IDOD_SG_LCR_LOANDEPO225_SYS1  1.00 IDOD_SG_LCR_LOANDEPO225_SYS1 -> IDOD_SG_LCR_LOANDEPO226_SYS1  1.00 IDOD_SG_LCR_LOANDEPO226_SYS1 -> IDOD_SG_LCR_LOANDEPO227_SYS1  1.00 IDOD_SG_LCR_LOANDEPO227_SYS1 -> IDOD_SG_LCR_LOANDEPO228_SYS1  1.00 IDOD_SG_LCR_LOANDEPO228_SYS1 -> IDOD_SG_LCR_LOANDEPO229_SYS1  1.00 IDOD_SG_LCR_LOANDEPO229_SYS1 -> IDOD_SG_LCR_LOANDEPO230_SYS2  1.00 IDOD_SG_LCR_LOANDEPO230_SYS2 -> PDM_SG_RM_FPRO_SELL_BUY_SYS1  1.00",
    "APP_CODE IDOD_SG_LCR_LOANDEPO5_SYS1 to PDM_SG_RM_FPRO_SELL_BUY_SYS1 (28.00) IDOD_SG_LCR_LOANDEPO5_SYS1 -> IDOD_SG_LCR_LOANDEPO_SYS1  2.00 IDOD_SG_LCR_LOANDEPO_SYS1 -> IDOD_SG_LCR_LOANDEPO2_SYS1  1.00 IDOD_SG_LCR_LOANDEPO2_SYS1 -> IDOD_SG_LCR_LOANDEPO40_SYS1  1.00 IDOD_SG_LCR_LOANDEPO40_SYS1 -> IDOD_SG_LCR_LOANDEPO9_SYS1  1.00 IDOD_SG_LCR_LOANDEPO9_SYS1 -> IDOD_SG_LCR_LOANDEPO210_SYS1  1.00 IDOD_SG_LCR_LOANDEPO210_SYS1 -> IDOD_SG_LCR_LOANDEPO211_SYS1  1.00 IDOD_SG_LCR_LOANDEPO211_SYS1 -> IDOD_SG_LCR_LOANDEPO212_SYS1  1.00 IDOD_SG_LCR_LOANDEPO212_SYS1 -> IDOD_SG_LCR_LOANDEPO214_SYS1  1.00 IDOD_SG_LCR_LOANDEPO214_SYS1 -> IDOD_SG_LCR_LOANDEPO215_SYS1  1.00 IDOD_SG_LCR_LOANDEPO215_SYS1 -> IDOD_SG_LCR_LOANDEPO216_SYS1  1.00 IDOD_SG_LCR_LOANDEPO216_SYS1 -> IDOD_SG_LCR_LOANDEPO217_SYS1  1.00 IDOD_SG_LCR_LOANDEPO217_SYS1 -> IDOD_SG_LCR_LOANDEPO218_SYS1  1.00 IDOD_SG_LCR_LOANDEPO218_SYS1 -> IDOD_SG_LCR_LOANDEPO219_SYS1  1.00 IDOD_SG_LCR_LOANDEPO219_SYS1 -> IDOD_SG_LCR_LOANDEPO220_SYS1  1.00 IDOD_SG_LCR_LOANDEPO220_SYS1 -> IDOD_SG_LCR_LOANDEPO221_SYS1  1.00 IDOD_SG_LCR_LOANDEPO221_SYS1 -> IDOD_SG_LCR_LOANDEPO222_SYS1  1.00 IDOD_SG_LCR_LOANDEPO222_SYS1 -> IDOD_SG_LCR_LOANDEPO223_SYS1  1.00 IDOD_SG_LCR_LOANDEPO223_SYS1 -> IDOD_SG_LCR_LOANDEPO224_SYS1  5.00 IDOD_SG_LCR_LOANDEPO224_SYS1 -> IDOD_SG_LCR_LOANDEPO225_SYS1  1.00 IDOD_SG_LCR_LOANDEPO225_SYS1 -> IDOD_SG_LCR_LOANDEPO226_SYS1  1.00 IDOD_SG_LCR_LOANDEPO226_SYS1 -> IDOD_SG_LCR_LOANDEPO227_SYS1  1.00 IDOD_SG_LCR_LOANDEPO227_SYS1 -> IDOD_SG_LCR_LOANDEPO228_SYS1  1.00 IDOD_SG_LCR_LOANDEPO228_SYS1 -> IDOD_SG_LCR_LOANDEPO229_SYS1  1.00 IDOD_SG_LCR_LOANDEPO229_SYS1 -> IDOD_SG_LCR_LOANDEPO230_SYS2  1.00 IDOD_SG_LCR_LOANDEPO230_SYS2 -> PDM_SG_RM_FPRO_SELL_BUY_SYS1  1.00",
    "APP_CODE IDOD_SG_LCR_LOANDEPO5_SYS1 to PDM_SG_RM_COLLATERAL_COLL_NOT_IN_SYS2 (25.00) IDOD_SG_LCR_LOANDEPO5_SYS1 -> IDOD_SG_LCR_LOANDEPO_SYS1  1.00 IDOD_SG_LCR_LOANDEPO_SYS1 -> IDOD_SG_LCR_LOANDEPO8_SYS1  1.00 IDOD_SG_LCR_LOANDEPO8_SYS1 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_1_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_1_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_2_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_2_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_3_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_3_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_4_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_4_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_5_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_5_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_6_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_6_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_7_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_7_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_8_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_8_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_9_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_9_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_10_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_10_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_11_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_11_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_12_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_12_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_13_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_13_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_14_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_14_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_15_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_15_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_16_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_16_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_17_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_17_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_18_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_18_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_19_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_19_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_20_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_20_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_SYS2  2.00",
    "APP_CODE IDOD_SG_LCR_LOANDEPO5_SYS1 to PDM_SG_RM_COLLATERAL_COLL_NOT_IN_SYS2 (25.00) IDOD_SG_LCR_LOANDEPO5_SYS1 -> IDOD_SG_LCR_LOANDEPO_SYS1  1.00 IDOD_SG_LCR_LOANDEPO_SYS1 -> IDOD_SG_LCR_LOANDEPO8_SYS1  1.00 IDOD_SG_LCR_LOANDEPO8_SYS1 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_1_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_1_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_92_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_92_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_93_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_93_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_94_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_94_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_95_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_95_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_96_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_96_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_97_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_97_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_98_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_98_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_99_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_99_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_910_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_910_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_911_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_911_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_912_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_912_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_913_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_913_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_914_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_914_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_915_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_915_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_916_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_916_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_917_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_917_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_918_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_918_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_919_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_919_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_920_SYS2  1.00 PDM_SG_RM_COLLATERAL_COLL_NOT_IN_920_SYS2 -> PDM_SG_RM_COLLATERAL_COLL_NOT_IN_SYS2  2.00",
  ];

  parseJob(): void {
    let max = Number.MIN_VALUE;
    let maxPathKey: string = ""
    this.jobInfo.forEach((job: any, index: any) => {
      const ctx = job.split(") ");
      const d_ = ctx[0].replace("(", "").replace(")", "");
      // this.extractCriticalPath(ctx[1]);
      const { appCode, totalVal } = this.extractHeadNodeProp(d_);
      const sourceTargetDetailStr = d_.replace(appCode + " ", "");
      const extractedSourceTargetDetail: any = this.extractJobDetail(sourceTargetDetailStr, true);
      const extractedPaths: any = [];
      const mapKey = extractedSourceTargetDetail[1] + "/" + extractedSourceTargetDetail[3] + "/" + index;
      if (ctx[1]) {
        const paths = this.extractJobPath(ctx[1].trim());
        paths.forEach((path: any) => {
          const eSTD: any = this.extractJobDetail(path, false);
          extractedPaths.push({ source: eSTD[1], target: eSTD[3], value: parseFloat(eSTD[4]), pathStr: path });
        });
        if (parseFloat(totalVal) > max) {
          max = parseFloat(totalVal);
          maxPathKey = mapKey;
          // this.criticalPath = extractedPaths;

        }
      }



      this.map.set(mapKey, {
        appCode,
        source: extractedSourceTargetDetail[1],
        target: extractedSourceTargetDetail[3],
        value: parseFloat(extractedSourceTargetDetail[4]),
        pathStr: sourceTargetDetailStr,
        paths: extractedPaths
      });
    });
    this.map.set(maxPathKey, { ...this.map.get(maxPathKey), isCriticalPath: true });
    // const rootNode = this.findRootNode(this.map);
    // const {jobName, system}: any = this.cpaChartService.getJobName(rootNode.root);
    // this.treeData = this.prepareChartData(rootNode.root, { name: jobName, children: [], system, value: "0.0" }, rootNode.chartData);
    //   const allPaths = this.findPaths(this.treeData);
    //   console.log(allPaths);
    //  this.treeData = this.renameDuplicateNodes(this.treeData);
    const jobData = this.findRootNode(this.map);
    const key = Object.keys(jobData)[0];
    this.treeData = { ...jobData[key], isCriticalPath: true };
    // const allPaths = this.findPaths(this.treeData, [], {});
    // console.log(allPaths);
  }

  findPaths(node: any, currentPath: any = [], result: any) {
    // Append the current node to the path
    currentPath.push(node.name);

    // If the node has no children, it is a leaf node, so return the current path
    if (!node.children || node.children.length === 0) {
      return [currentPath];
    }

    // Otherwise, traverse the children and accumulate paths
    let paths: any = [];
    for (let child of node.children) {
      paths = paths.concat(this.findPaths(child, [...currentPath], result));
    }

    return paths;
  }

  // Find all paths starting from the root node


  /***
   * this is kind of recurive method to find the last child of the node and push it into result field
   *
   */

  prepareChartData(key: any, result: any, chartData: any): any {
    chartData[key].forEach((child: any) => {
      if (key !== child.name) {
        const { jobName, system }: any = this.cpaChartService.getJobName(child.name);
        if (chartData[child.name]) {
          result = result || { name: key, children: [] };
          result.children.indexOf((e: any) => e.jobName === jobName) === -1 && result.children.push({ name: jobName, children: [], value: child.value, system });
          this.prepareChartData(child.name, result.children.at(-1), chartData);
        } else {
          result = result || { name: key, children: [] };
          result.children.indexOf((e: any) => e.jobName === jobName) === -1 && result.children.push({ name: jobName, children: [], value: child.value, system });
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
    const chartData: any = {};
    const globalEntry: any = {};  /// for checking duplicates for different path and different parent
    const totalVal: any = {};
    const systemPathValue: any = {}; 
    for (let key of map.keys()) {
      const val = map.get(key);
      const { jobName, system }: any = this.cpaChartService.getJobName(val.source);
      if (!chartData[jobName]) {
        chartData[jobName] = { name: jobName, children: [], isCriticalPath: true, value: val.value, system };
      }

      const targetJob = this.traverse(0, val.paths, chartData[jobName].children, globalEntry, val.isCriticalPath, {});

      if(val.isCriticalPath) {
        this.cpaChartService.extractSystemAttributes(val.paths);
      }
      totalVal[targetJob] = val.value;
    }

    this.cpaChartService.criticalPathSystemWiseTotalObj = totalVal
    return chartData; //{ root: str, chartData };
  }


  traverse(index: any, paths: any, child: any, globalEntry: any, isCriticalPath: boolean, parent: any, ): any {
    if (!paths.length || index > paths.length-1) {
      return parent.name;
    }
    const { jobName, system }: any = this.cpaChartService.getJobName(paths[index].target);
    const i = child.findIndex((el: any) => jobName === el.name); // Check if node already persent in the same level
    if (i === -1) { 
      if (globalEntry[jobName] > 0) {
        globalEntry[jobName]++;
        child.push({ 
          name: jobName + "DUPLICATE_" + globalEntry[jobName], 
          value: paths[index].value, 
          children: [], 
          actualJobName: jobName, 
          isCriticalPath,
          system
         });
      } else {
        globalEntry[jobName] = 1;
        child.push({ name: jobName, value: paths[index].value, children: [], isCriticalPath, system });
      }
      // total += parseFloat(paths[index].value.value);
      return this.traverse(index + 1, paths, child.at(-1).children, globalEntry, isCriticalPath, child.at(-1));
    } else { //If node is already present then process node for next scan and check critical path value because node can be common for both
      child[i].isCriticalPath = child[i].isCriticalPath ? child[i].isCriticalPath : isCriticalPath;
      child[i].system = system;
      // total += parseFloat(child[i].value.value);
      return this.traverse(index + 1, paths, child[i].children, globalEntry, isCriticalPath, child[i]);
    }

  }




  private extractHeadNodeProp(val: string): any {
    const nodeProps = val.split(" ");
    return { appCode: nodeProps[0], totalVal: nodeProps[nodeProps.length - 1] };
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


