import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { CpaChartService } from './cpa-chart.service';
import { GRAPH_PROPERTIES } from '../constants/cpa.constant';
@Injectable({
  providedIn: 'root'
})
export class CpaChartSvgService {
  private graph: any;
  private svg: any;
  private root: any;
  private ctx: any;
  private modalRef: any;
  constructor(private cpaChartService: CpaChartService) { 
    
  }

  public buildGraph(element: any, treeData: any, modalRef: any): any {
    this.modalRef = modalRef;
    // window.scrollTo(0, 0);
    d3.select(element).selectAll('*').remove();
    this.root = d3.hierarchy(treeData);
     
    // Create SVG
    this.svg = d3
      .select(element)
      .append('svg')
      .attr('width', GRAPH_PROPERTIES.width)
      .attr('height', GRAPH_PROPERTIES.height);

      // Create a tree layout
    const treeLayout = d3.tree().size([GRAPH_PROPERTIES.width - GRAPH_PROPERTIES.margin * 2, GRAPH_PROPERTIES.height - GRAPH_PROPERTIES.margin * 2])
    .separation((a, b) => a.parent === b.parent ? 1 : 2);  // Adjust separation between nodes
  treeLayout(this.root);

    this.getLegend();
    // Create a container group for all graph elements (nodes, links)
    this.getGraphCtx();

    this.getLink();
    // Add Node and labels inside the nodes (multiline)
    this.getRectangleNode(this.cpaChartService);

    this.getTotalValueLabel();

    this.linkOverlayLabel();

    this.setZoomProperties(this.graph);

    return this.graph;
  }

  private getLegend() {

    const legendData = Object.keys(this.cpaChartService.allSystemProps).
    map((key) => ( { "label": key, "color":this.cpaChartService.allSystemProps[key].color } ));
    // Create a legend group
    const legend = this.svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${GRAPH_PROPERTIES.margin}, ${GRAPH_PROPERTIES.margin})`); // Position top-right

    // Add a heading for the legend
    legend.append('text')
    .attr('class', 'legend-heading')
    .attr('x', 0) // Start at the left edge
    .attr('y', -20) // Position the heading above the legend items
    .style('font-size', '10px') // Set font size
    .style('font-weight', 'bold') // Make it bold
    .text('SYSTEM DETAILS'); // Text content for the heading
    // Create legend items
    legend.selectAll('.legend-item')
    .data(legendData)
    .join('g')
    .attr('class', 'legend-item')
    .attr('transform', (d: any, i: any) => `translate(0, ${i * 30})`) // Position each item
    .each(function (this: SVGGElement, d: any) {
      const item = d3.select(this); // 'this' now refers to the current DOM element
      item.append('rect') // Add a rectangle to the current group
        .attr('width', 8)
        .attr('height', 8)
        .attr('fill', d.color);
    
      item.append('text')
        .attr('x', 20)
        .attr('y', 6)
        .text(d.label)
        .attr('font-size','10px');
    });
  }


  private getGraphCtx() {
    this.graph = this.svg.append("g")
    .attr("transform", `translate(${GRAPH_PROPERTIES.margin},${GRAPH_PROPERTIES.margin})`);
    this.svg.append('defs')
    .append('marker')
    .attr('id', 'arrowhead')
    .attr('viewBox', '0 0 10 10')
    .attr('refX', 5)   // Position of the arrowhead at the end of the line
    .attr('refY', 5)
    .attr('markerWidth', 6)
    .attr('markerHeight', 6)
    .attr('orient', 'auto')
    .append('path')
    .attr('d', 'M 0 0 L 10 5 L 0 10 z')  // Triangle arrow shape
    .attr('fill', 'red');  
  } 

  

  private getLink() {
    const maxLinkHeight = 100;
    this.graph
    .append("g")
    .selectAll("path")
    .data(this.root.links())
    .join("path")
    .attr("d", (d: any) => {
      const linkVertical = d3.linkVertical<{ source: { x: number; y: number }; target: { x: number; y: number } }, [number, number]>()
        .x((d: any) => d.x + 20)
        .y((d: any) => d.y + 20);
      return linkVertical(d);
    })
    .attr("fill", "none")
    .attr('stroke', (d: any) => this.cpaChartService.isCriticalPath(d) ? 'red' : 'gray')
    .attr("stroke-width", 5)
    .attr("marker-end", "url(#arrowhead)");
  }

  private getRectangleNode(cpaChartService: any) {
    this.graph.selectAll(".node")
    .data(this.root.descendants())
    .enter()
    .append("g")
    .attr("class", "node-group")
    .on('click', (event: any, d: any) => {
      this.modalRef.openScrollableContent(d);
    })
    .on('mouseenter', (event: any, d: any) => {
      // Highlight the hovered node and its descendants
      this.graph
        .selectAll('.node-group')
        .style('opacity', (node: any) => 
          node === d || d.descendants().includes(node) ? 1 : 0.1 // Show hovered node and its children
        );
  
      this.graph
        .selectAll('.link')
        .style('opacity', (link: any) =>
          d.descendants().includes(link.source) &&
          d.descendants().includes(link.target)
            ? 1 // Show links related to the node and its descendants
            : 0.1
        );
    })
    .on('mouseleave', () => {
      // Reset opacity to show all nodes and links
      this.graph.selectAll('.node-group').style('opacity', 1);
      this.graph.selectAll('.link').style('opacity', 1);
    })
    .style('cursor', 'pointer')
    // .attr('fill', (d: any) => {
    //   if (this.cpaChartService.criticalPathColorCode[d.data.system]) return this.cpaChartService.criticalPathColorCode[d.data.system];
    //   return 'steelblue'; // Default for unknown status
    // })
    .each(function (this: SVGGElement, d: any) {
      const group = d3.select(this);
  
      // Append text to measure its width
      const textElement: any = group
        .append("text")
        .attr("class", "label")
        .attr("x", d.x) // Temporarily set x
        .attr("y", d.y + 40) // Adjust for vertical centering
        .attr("text-anchor", "middle")
        .style("font-size", "40px") // Adjust font size
        .style("fill", "white")
        .text(d.data.name);
  
      // Measure text width
      const textWidth = textElement.node().getComputedTextLength();
      const padding = 20; // Add padding around the text
  
      // Set rectangle dimensions dynamically
      const rectWidth = textWidth + padding;
  
      // Append rectangle behind the text
      group
        .insert("rect", "text") // Insert rectangle before text
        .attr("class", "node")
        .attr("x", d.x - rectWidth / 2) // Center horizontally
        .attr("y", d.y - 10) // Adjust for height
        .attr("width", rectWidth)
        .attr("height", 80)
        .attr("fill", (d: any) =>  {
          if (cpaChartService.criticalPathColorCode[d.data.name]) return cpaChartService.criticalPathColorCode[d.data.name];
          return 'steelblue'; // Default for unknown status
        }) // Node color
        .attr("stroke", "black")
        .attr("stroke-width", 2);
  
      // Re-center the text if necessary
      textElement.attr("x", d.x);
    });

      // this.getNodeLabel();
  }

  private getNodeLabel() {
    this.graph.selectAll(".label")
    .data(this.root.descendants())
    .enter().append("text")
    .attr("class", "label")
    .attr("x", (d: any) => d.x) // Center text horizontally
    .attr("y", (d: any) => d.y + 40) // Adjust for vertical centering
    .attr("text-anchor", "middle") // Center alignment
    .style("font-size", "30px") // Adjust font size
    .style("fill", "red") // Text color
    .text((d: any) => d.data.name); // Initial text
  }

  private getTotalValueLabel() {
    this.graph
      .append('g')
      .selectAll('text.total')
      .data(this.root.descendants().filter((d: any) => !d.children))
      .join('text')
      .attr('class', 'total')
      .attr('x', (d: any) => d.x - 130) // Offset to the right of the node
      .attr('y', (d: any) => d.y + 180) // Vertically aligned with the node
      .text((d: any) => {
        const total = this.cpaChartService.getTotalValueOfPath(d, 0.00, []);
        return `Total: ${total.toFixed(2)}`
      }) // Placeholder function for total
      .attr('font-size', 60)
      .attr('fill', 'black');
  }

  private linkOverlayLabel() {
    this.graph
      .append('g')
      .selectAll('g.link-info')
      .data(this.root.links())
      .join('g')
      .attr('class', 'link-info')
      .each(function (this: SVGGElement, d: any) {
        // Calculate midpoint of the link
        const midX = (d.source.x + d.target.x) / 2 + 20;
        const midY = (d.source.y + d.target.y) / 2 + 35;

        // Create background rectangle for the text
        d3.select(this)
          .append('rect')
          .attr('x', midX - 20)  // Position of the rectangle (adjust width)
          .attr('y', midY - 20)  // Position of the rectangle (adjust height)
          .attr('width', 65)     // Width of the rectangle
          .attr('height', 65)     // Height of the rectangle
          .attr('rx', 5)          // Rounded corners
          .attr('ry', 5)
          .attr('fill', 'white')  // Background color
          .attr('stroke', 'white')  // Border color
          .attr('stroke-width', 1);

        // Add the text over the background
        d3.select(this)
          .append('text')
          .attr('x', midX)        // Horizontal positioning of the text
          .attr('y', midY)        // Vertical positioning of the text
          .attr('dy', 5)          // Adjust vertical alignment
          .attr('text-anchor', 'middle')
          .text((d: any) => `${d.target.data.value}`)
          .attr('font-size', 60)
          .attr('fill', 'black'); // Text color
      });
  }

  private setZoomProperties(graph: any) {
    const zoom: any = d3.zoom()
      .scaleExtent([0.15, 0.5]) // Control zoom scale range (0.5x to 2x)
      // .translateExtent([[0, 0], [GRAPH_PROPERTIES.width, GRAPH_PROPERTIES.height]]) // Restrict panning
      .on("zoom", function (event) {
        graph.attr("transform", event.transform); // Apply the zoom transform (panning and scaling)
      });

    // Apply zoom behavior to the SVG container
    this.svg.call(zoom);

    const defaultScale = 0.14;   // Default zoom scale (1 = original size)
    const defaultTranslate = [0, 0];  // Default translation (no panning)

    const initialTranslateX = (window.innerWidth/4.5 - 200); // Center the root node horizontally
    const initialTranslateY = (window.innerHeight / 2); // Center the root node vertically

    // Apply initial zoom transform to center root node
    this.svg.call(zoom.transform, d3.zoomIdentity
      .translate(initialTranslateX, 0) // Position the tree
      .scale(defaultScale)); 
  }

  clearService(): void {
    this.svg = "";
    this.graph = "";
    this.root = "";
    this.ctx = "";
  }
}
