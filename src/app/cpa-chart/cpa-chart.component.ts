// @tsds-nocheck

import { Component, OnInit, ElementRef } from '@angular/core';
import { REACTIVE_NODE } from '@angular/core/primitives/signals';
import * as d3 from 'd3';
import { CpaChartSvgService } from '../service/cpa-chart-svg.service';
import { CpaChartService } from '../service/cpa-chart.service';
import { GRAPH_PROPERTIES } from '../constants/cpa.constant';

@Component({
  selector: 'app-cpa-chart',
  template: `<div id="cpa-chart"></div>`,
  styleUrls: ['./cpa-chart.component.css']
})
export class CpaChartComponent implements OnInit {
  constructor(private el: ElementRef, private cpaChartSvgService: CpaChartSvgService) { }
  treeData: any = {};
  map: any = new Map();
  ngOnInit(): void {
    this.parseJob();
    this.createBSTChart();
  }

  private createBSTChart(): void {
    
    const element = this.el.nativeElement.querySelector('#cpa-chart');
    this.cpaChartSvgService.buildGraph(element, this.treeData);
    


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
    "APP_CODE JOB_1 to JOB_1 (0.00)",
    "APP_CODE JOB_1 to JOB_14 (3.00)",
    "APP_CODE JOB_14 to JOB_15 (2.00)",
    "APP_CODE JOB_15 to JOB_16 (10.00)",
    "APP_CODE JOB_16 to JOB_12 (5.00)",
    "APP_CODE JOB_12 to JOB_13 (4.00)",
    "APP_CODE JOB_13 to JOB_10 (8.00)",
    "APP_CODE JOB_10 to JOB_2 (1.00)  JOB_10 -> JOB_2  1.00",
    "APP_CODE JOB_10 to JOB_6 (28.00)  JOB_10 -> JOB_3 20.00 JOB_3 -> JOB_6 8.00",
    "APP_CODE JOB_10 to JOB_7 (7.00)  JOB_10 -> JOB_4  1.00 JOB_4 -> JOB_7  6.00",
    "APP_CODE JOB_10 to JOB_3 (17.00)  JOB_10 -> JOB_5 17.00"];

  parseJob(): void {

    this.jobInfo.forEach((job: any, index: any) => {
      const ctx = job.split(") ");
      const d_ = ctx[0].replace("(", "").replace(")", "");
      // this.extractCriticalPath(ctx[1]);
      const appCode = this.findAppCode(d_);
      const sourceTargetDetailStr = d_.replace(appCode + " ", "");
      const extractedSourceTargetDetail: any = this.extractJobDetail(sourceTargetDetailStr, true);
      const extractedPaths: any = [];
      if (ctx[1]) {
        const paths = this.extractJobPath(ctx[1].trim());
        paths.forEach((path: any) => {
          const eSTD: any = this.extractJobDetail(path, false);
          extractedPaths.push({ source: eSTD[1], target: eSTD[2], value: eSTD[3], pathStr: path });
        });
      }

      this.map.set(extractedSourceTargetDetail[1] + "/" + extractedSourceTargetDetail[2] + "/" + index, {
        appCode,
        source: extractedSourceTargetDetail[1],
        target: extractedSourceTargetDetail[2],
        value: extractedSourceTargetDetail[3],
        pathStr: sourceTargetDetailStr,
        paths: extractedPaths
      });
    });
    console.log(this.map, "Map")
    const rootNode = this.findRootNode(this.map);
    this.treeData = this.prepareChartData(rootNode.root, { name: this.getJobName(rootNode.root), children: [] }, rootNode.chartData);
    console.log(this.treeData);


  }

  prepareChartData(key: any, result: any, chartData: any): any {
    chartData[key].forEach((child: any) => {
      if (key !== child.name) {
        const childName = this.getJobName(child.name);
        if (chartData[child.name]) {
          result = result || { name: key, children: [] };
          result.children.indexOf(childName) === -1 && result.children.push({ name: childName, children: [], value: child.value });
          this.prepareChartData(child.name, result.children.at(-1), chartData);
        } else {
          result = result || { name: key, children: [] };
          result.children.indexOf(childName) === -1 && result.children.push({ name: childName, children: [], value: child.value });
        }
      }

    });

    return result;

  }

  getJobName(name: string): string {
    if (name) {
      const _ = name.split("_");
      return _[1] = "adfafasfas asdfadsfasd adfafasfas adfafasfas adfadsadsfa";
    }
    return "";

  }



  findRootNode(map: any): any {
    let str = "";
    const chartData: any = {};
    for (let key of map.keys()) {
      const val = map.get(key);
      if (val.paths.length) {
        val.paths.forEach((path: any) => {
          chartData[path.source] = chartData[path.source] || [];
          chartData[path.source].push({ name: path.target, value: path.value });
        })
      } else {
        chartData[val.source] = chartData[val.source] || [];
        chartData[val.source].push({ name: val.target, value: val.value });
      }

      if (val.source === val.target) {
        str = val.source;
      }

    }
    return { root: str, chartData };
  }



  private findAppCode(val: string): any {
    const appcodes = val.split(" ");
    return appcodes[0];
  }


  private extractJobPath(path: string): any {
    const regex = /JOB_\d+\s*->\s*JOB_\d+\s+\d+\.\d+/g;
    const matches = path.match(regex);
    if (matches) {
      return matches;
    } else {
      return [];
    }
  }

  private extractJobDetail(job: string, isRoot = false) {
    const regexWithGroups = isRoot ? /(JOB_\d+)\s*to\s*(JOB_\d+)\s+(\d+\.\d+)/ : /(JOB_\d+)\s*->\s*(JOB_\d+)\s+(\d+\.\d+)/;
    const result = job.match(regexWithGroups);

    return result;
  }
}


