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

    // Dynamically calculate height based on the number of levels
    const levels = this.getGraphLevels();
    const graphHeight = levels * GRAPH_PROPERTIES.levelHeight + GRAPH_PROPERTIES.margin * 2;

    // Create a tree layout
    const treeLayout = d3.tree().size([GRAPH_PROPERTIES.width - GRAPH_PROPERTIES.margin * 2, graphHeight - GRAPH_PROPERTIES.margin * 2])
      .separation((a, b) => a.parent === b.parent ? 1 : 2);  // Adjust separation between nodes
    treeLayout(this.root);

    // Measure dynamic width based on node positions
    const graphWidth = this.calculateDynamicWidth(this.root);

    // Create SVG
    this.svg = d3
      .select(element)
      .append('svg')
      .attr('xmlns', "http://www.w3.org/2000/svg")
      .attr('width', graphWidth)
      .attr('height', graphHeight);



    // this.getLegend();
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

    // Prepare legend data
    const legendData = Object.keys(this.cpaChartService.allSystemProps).map((key) => ({
      label: key,
      color: this.cpaChartService.allSystemProps[key].color,
      total: this.cpaChartService.allSystemProps[key].total,
      jobs: this.cpaChartService.allSystemProps[key].jobs,
    }));

    // Create a legend group (position it in the top-left corner for now, you can adjust)
    const legend = this.svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(10, 10)`) // Adjust position as needed
    // .attr('x', 20)
    // .attr('y', 6);
    // Add a foreignObject to embed an HTML table
    legend.append('foreignObject')
      .attr('width', 400) // Adjust the width of the table
      .attr('height', legendData.length * 30 + 50) // Adjust height dynamically based on the number of items
      .append('xhtml:div')

      .html(() => {
        // Generate the HTML content for the table
        return `
      <div style="font-family: Arial, sans-serif; font-size: 10px;">
        <h4 style="margin: 0; font-size: 12px; font-weight: bold; text-align: left;">CRITICAL PATH SUMMARY</h4>
        <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 4px; border-bottom: 1px solid #ccc;">Color</th>
              <th style="text-align: left; padding: 4px; border-bottom: 1px solid #ccc;">App Code</th>
              <th style="text-align: left; padding: 4px; border-bottom: 1px solid #ccc;">Total Time(Mins)</th>
              <th style="text-align: left; padding: 4px; border-bottom: 1px solid #ccc;">Job(s)</th>

            </tr>
          </thead>
          <tbody>
            ${legendData
            .map(
              (item) => `
                  <tr>
                    <td style="padding: 4px;">
                      <div style="width: 12px; height: 12px; background-color: ${item.color};"></div>
                    </td>
                    <td style="padding: 4px;">${item.label}</td>
                    <td style="padding: 4px;">${item.total}</td>
                    <td style="padding: 4px;">${item.jobs?.join(",")}</td>
                  </tr>
                `
            )
            .join('')}
          </tbody>
        </table>
      </div>
    `;
      });
  }


  private getGraphCtx() {
    this.graph = this.svg.append("g")
      .attr("transform", `translate(${GRAPH_PROPERTIES.margin},${GRAPH_PROPERTIES.margin})`);
    // this.svg.append('defs')
    // .append('marker')
    // .attr('id', 'arrowhead')
    // .attr('viewBox', '0 0 10 10')
    // .attr('refX', 5)   // Position of the arrowhead at the end of the line
    // .attr('refY', 5)
    // .attr('markerWidth', 6)
    // .attr('markerHeight', 6)
    // .attr('orient', 'auto')
    // .append('path')
    // .attr('d', 'M 0 0 L 10 5 L 0 10 z')  // Triangle arrow shape
    // .attr('fill', 'red');  
  }



  private getLink() {
    this.graph
      .append("g")
      .selectAll("path")
      .data(this.root.links())
      .join("path")
      .attr("d", (d: any) => {
        const linkVertical = d3.linkVertical<{ source: { x: number; y: number }; target: { x: number; y: number } }, [number, number]>()
          .x((d: any) => d.x)
          .y((d: any) => d.y + 20);
        return linkVertical(d);
      })
      .attr("fill", "none")
      .attr('stroke', (d: any) => {
        // if (this.cpaChartService.criticalPathColorCode[d.source.data.name] && this.cpaChartService.criticalPathColorCode[d.target.data.name]) return this.cpaChartService.criticalPathColorCode[d.source.data.name];
        if (d.source.data.isCriticalPath && d.target.data.isCriticalPath) return this.cpaChartService.allSystemProps[d.source.data.system]?.color;
        return 'gray';
      })
      .attr("stroke-width", (d: any) => (d.source.data.isCriticalPath && d.target.data.isCriticalPath) ? 15 : 5);
    // .attr("marker-end", "url(#arrowhead)");
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
          .style("font-weight", "bold")
          .style("font-size", "40px") // Adjust font size
          .style("fill", "black")
          .text(d.data.actualJobName ? (d.data.actualJobName) : d.data.name);



        // Measure text width
        const textWidth = textElement.node().getComputedTextLength();
        const padding = 20; // Add padding around the text

        // const textElement1: any = group
        //   .append("text")
        //   .attr("class", "label")
        //   .attr("x", d.x+textWidth+90) // Temporarily set x
        //   .attr("y", d.y + 50) // Adjust for vertical centering
        //   .attr("text-anchor", "middle")
        //   .style("font-size", "60px") // Adjust font size
        //   .style("fill", "black")
        //   .text(cpaChartService.criticalPathSystemWiseTotalObj[d.data.system].lastNode === d.data.name ? `${d.data.system} - Total Value: ${cpaChartService.criticalPathSystemWiseTotalObj[d.data.system].totalValue}` : "");

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
          .attr("fill", (d: any) => {
            if (cpaChartService.allSystemProps[d.data.system]?.jobs?.includes(d.data.name)) return "red";
            return 'white'; // Default for unknown status
          }) // Node color
          .attr("stroke", "black")
          .attr("stroke-width", (d: any) => d.data.isCriticalPath ? 3 : 1);

        // Re-center the text if necessary
        textElement.attr("x", d.x);

        textElement.attr("x", d.x);
      });

    // this.getNodeLabel();
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
        if (this.cpaChartService.criticalPathSystemWiseTotalObj[d.data.name]) {
          return `Total Time: ${this.cpaChartService.criticalPathSystemWiseTotalObj[d.data.name]}`
        } else {
          return ""
        }

      }) // Placeholder function for total
      .attr('font-size', 60)
      .attr('font-weight', 'bold')
      .attr('fill', 'orange');
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
          .attr('x', midX - 40)  // Position of the rectangle (adjust width)
          .attr('y', midY - 150)  // Position of the rectangle (adjust height)
          .attr('width', 100)     // Width of the rectangle
          .attr('height', 100)     // Height of the rectangle
          .attr('rx', 5)          // Rounded corners
          .attr('ry', 5)
          .attr('fill', 'white')  // Background color
          .attr('stroke', 'white')  // Border color
          .attr('stroke-width', 1);

        // Add the text over the background
        d3.select(this)
          .append('text')
          .attr('x', midX - 20)        // Horizontal positioning of the text
          .attr('y', midY - 80)        // Vertical positioning of the text
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

    const defaultScale = 0.3;   // Default zoom scale (1 = original size)
    const defaultTranslate = [0, 0];  // Default translation (no panning)
      console.log(window.innerWidth);
    const initialTranslateX = (-300); // Center the root node horizontally
    const initialTranslateY = (window.innerHeight / 2); // Center the root node vertically

    // Apply initial zoom transform to center root node
    this.svg.call(zoom.transform, d3.zoomIdentity
      .translate(initialTranslateX, 10) // Position the tree
      .scale(defaultScale));
  }


  private getGraphLevels(): number {
    // Traverse the hierarchy and find the maximum depth
    const levels: any = d3.max(this.root.descendants(), (d: any) => d.depth);
    return levels + 1; // Add 1 to include the root node as level 1
  }

  private calculateDynamicWidth(root: any): number {
    // Traverse all nodes to find min and max x-coordinates
    const allNodes = root.descendants();
    const minX: any = d3.min(allNodes, (d: any) => d.x) || 0;
    const maxX: any = d3.max(allNodes, (d: any) => d.x) || GRAPH_PROPERTIES.width;

    // Add margins to ensure the graph isn't clipped
    const margin = GRAPH_PROPERTIES.margin * 2;

    return maxX - minX + margin;
  }

  clearService(): void {
    this.svg = "";
    this.graph = "";
    this.root = "";
    this.ctx = "";
  }

  downloadSVG() {
    // Get the SVG element as a string
    let svgContent = this.svg.node().outerHTML;
    svgContent = svgContent.replace('<svg ', `<svg transform="scale(0.4)" `);
  // Create a new image element
  let img = new Image();

  // Create a Blob URL from the SVG content
  let svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
  let url = URL.createObjectURL(svgBlob);

  // Set the image's source to the Blob URL
  img.onload = function () {
    // Create a canvas to draw the image
    let canvas = document.createElement('canvas');
    let ctx: any = canvas.getContext('2d');

    // Set canvas size based on SVG dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the SVG onto the canvas
    let scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);
    ctx.drawImage(img, 0, 0, img.width * scaleFactor, img.height * scaleFactor);

    // Export canvas to PNG
    let dataURL = canvas.toDataURL('image/jpeg'); // You can change 'image/png' to 'image/jpeg' for JPEG images

    // Create a link to download the image
    let link = document.createElement('a');
    link.href = dataURL;
    link.download = 'image.jpeg'; // Set the file name for the image

    // Trigger the download
    link.click();
    
    // Clean up the object URL after download
    URL.revokeObjectURL(url);
  };

  img.onerror = function (e) {
    console.error("Error loading the image:", e);
  };

  // Set the image source to the SVG Blob URL
  img.src = url;
  }
}
