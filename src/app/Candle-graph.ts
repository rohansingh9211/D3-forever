// import {
//     Component,
//     ElementRef,
//     HostListener,
//     OnInit,
//     Renderer2,
//     ViewChild,
//   } from '@angular/core';
//   import * as d3 from 'd3';
//   // import { baseColors } from 'ng2-charts';
//   import { FormBuilder, Validators } from '@angular/forms';
//   import { NewsletterService } from '../newsletter.service';
  
//   interface ChartItem {
//     day: string;
//     predictOpen: number;
//     predictClose: number;
//     predictHigh: number;
//     predictLow: number;
//     open: number;
//     close: number;
//     high: number;
//     low: number;
//   }
  
//   @Component({
//     selector: 'app-stock-prediction',
//     templateUrl: './stock-prediction.component.html',
//     styleUrls: ['./stock-prediction.component.scss'],
//   })
//   export class StockPredictionComponent implements OnInit {
//     @ViewChild('chartContainer', { read: ElementRef })
//     chartContainer!: ElementRef;
  
//     // Valid values : normal, predict, real
//     selectedChart = 'normal';
//     chartValues: ChartItem[] = [];
  
//     predictColor = ['#27ae60', '#e74c3c'];
//     realColor = ['#3498db', '#e67e22'];
  
//     checkoutForm = this.formBuilder.group({
//       email: ['', [Validators.required, Validators.minLength(6)]],
//     });
  
//     constructor(
//       private renderer: Renderer2,
//       private newsletterService: NewsletterService,
//       private formBuilder: FormBuilder,
//     ) {}
  
//     title(title: any) {
//       throw new Error('Method not implemented.');
//     }
  
//     ngOnInit(): void {
//       this.newsletterService.stockGraphChart().subscribe((response) => {
//         this.chartValues = (response as Array<any>).map((d: any) => ({
//           day: d.at,
//           predictOpen: +d.predict_open,
//           predictClose: +d.predict_close,
//           predictHigh: +d.predict_high,
//           predictLow: +d.predict_low,
//           open: +d.real_open,
//           close: +d.real_close,
//           high: +d.real_high,
//           low: +d.real_low,
//         }));
//         sessionStorage.setItem('count', '0');
  
//         if (sessionStorage.getItem('selectedChart') === 'predict') {
//           this.selectedChart = 'predict';
//           this.generateChart(this.chartValues);
//         } else if (sessionStorage.getItem('selectedChart') === 'real') {
//           this.selectedChart = 'real';
//           this.generateChart(this.chartValues);
//         } else {
//           this.selectedChart = 'normal';
//           this.generateChart(this.chartValues);
//         }
//       });
//       //  const tooltip = d3.select('#tooltip');
//     }
  
//     @HostListener('window:resize', ['$event'])
//     onResize() {
//       // On each resize, re-draw the graph
//       this.generateChart(this.chartValues);
//     }
  
//     generateChart(chartValues: ChartItem[]): void {
//       // Clean up chart container
//       while (this.chartContainer.nativeElement.firstChild) {
//         this.chartContainer.nativeElement.removeChild(
//           this.chartContainer.nativeElement.firstChild
//         );
//       }
  
//       // Select the chart container element
//       const container = d3.select('#chart-container');
//       const tooltip = d3.select('#tooltip');
  
//       // Set up chart dimensions
//       const width = +container.style('width').slice(0, -2);
//       const height = Math.min(500, width);
//       const margin = {
//         top: 20,
//         right: 0,
//         bottom: 30,
//         left: width * 0.1,
//       };
//       const innerWidth = width - margin.left - margin.right;
//       const innerHeight = height - margin.top - margin.bottom;
//       const candleWidth = 20;
//       const candleHeight = 25;
//       const candleSpacing = 23;
  
//       const xScale = d3
//         .scaleBand()
//         .domain(chartValues.map((d, i) => d.day))
//         .range([0, width - margin.left - margin.right])
//         .padding(0.9);
  
//       const yScale = d3
//         .scaleLinear()
//         .domain([
//           d3.min(chartValues, (d: { low: any }) => 0) || 0,
//           d3.max(chartValues, (d) => (d.high > d.open ? d.high : d.open)) ||
//             0 * 0.8,
//         ])
//         .range([innerHeight, 0]);
  
//       // Create chart container element
//       const svg = container
//         .append('svg')
//         .attr('width', width)
//         .attr('height', height);
  
//       // Create chart content group element
//       const chart = svg
//         .append('g')
//         .attr('transform', `translate(${margin.left},${margin.top})`)
//         .attr('data-debug', `data-container`);
  
//       // Add candles
//       chartValues.forEach((chartValue) => {
//         // Add tooltip, as a group that will surround the candle
//         const hitboxTooltip = chart.append('g');
//         hitboxTooltip
//           .attr('data-debug', chartValue.day)
//           .on('mouseover', (event: MouseEvent, data: any) => {
//             // Build relevant tooltip message
//             var tooltipMessage = '';
//             if (
//               ['predict', 'normal'].includes(this.selectedChart) &&
//               chartValue.predictOpen
//             ) {
//               if (tooltipMessage !== '') {
//                 tooltipMessage += '<br><br>';
//               }
//               tooltipMessage += `<u>Predict</u> :<br>Open: ${chartValue.predictOpen}<br>Close: ${chartValue.predictClose}<br>High: ${chartValue.predictHigh}<br>Low: ${chartValue.predictLow}`;
//             }
//             if (
//               ['real', 'normal'].includes(this.selectedChart) &&
//               chartValue.open
//             ) {
//               if (tooltipMessage !== '') {
//                 tooltipMessage += '<br><br>';
//               }
//               tooltipMessage += `<u>Real</u> :<br>Open: ${chartValue.open}<br>Close: ${chartValue.close}<br>High: ${chartValue.high}<br>Low: ${chartValue.low}`;
//             }
  
//             tooltip
//               .html(tooltipMessage)
//               .style('left', event.pageX + 10 + 'px')
//               .style('top', event.pageY + 10 + 'px')
//               .style('box-shadow', '2px 2px 4px rgba(0, 0, 0, 0.5)')
//               .style('opacity', 1);
//           })
//           .on('mouseout', () => {
//             tooltip.style('opacity', 0);
//           });
  
//         if (['predict', 'normal'].includes(this.selectedChart)) {
//           // FOR PREDICT values
//           // Add the candle inside
//           const candleLine = hitboxTooltip.append('line');
//           candleLine
//             .attr(
//               'x1',
//               candleWidth / 2 - candleSpacing / 2 + (xScale(chartValue.day) ?? 0)
//             )
//             .attr('y1', yScale(chartValue.predictHigh))
//             .attr(
//               'x2',
//               candleWidth / 2 - candleSpacing / 2 + (xScale(chartValue.day) ?? 0)
//             )
//             .attr('y2', yScale(chartValue.predictLow))
//             .attr('stroke', 'black')
//             .attr('stroke-width', 2);
//           const candleRect = hitboxTooltip.append('rect');
//           candleRect
//             .attr('x', (xScale(chartValue.day) ?? 0) - candleSpacing / 2)
//             .attr(
//               'y',
//               yScale(Math.max(chartValue.predictOpen, chartValue.predictClose))
//             )
//             .attr('width', candleWidth)
//             .attr(
//               'fill',
//               this.predictColor[
//                 chartValue.predictOpen < chartValue.predictClose ? 0 : 1
//               ]
//             )
//             .attr(
//               'height',
//               Math.abs(chartValue.predictOpen - chartValue.predictClose)
//             );
//         }
//         if (['real', 'normal'].includes(this.selectedChart)) {
//           // FOR REAL values
//           // Add the candle inside
//           const candleLine = hitboxTooltip.append('line');
//           candleLine
//             .attr(
//               'x1',
//               candleWidth / 2 + candleSpacing / 2 + (xScale(chartValue.day) ?? 0)
//             )
//             .attr('y1', yScale(chartValue.high))
//             .attr(
//               'x2',
//               candleWidth / 2 + candleSpacing / 2 + (xScale(chartValue.day) ?? 0)
//             )
//             .attr('y2', yScale(chartValue.low))
//             .attr('stroke', 'black')
//             .attr('stroke-width', 2);
//           const candleRect = hitboxTooltip.append('rect');
//           candleRect
//             .attr('x', (xScale(chartValue.day) ?? 0) + candleSpacing / 2)
//             .attr('y', yScale(Math.max(chartValue.open, chartValue.close)))
//             .attr('width', candleWidth)
//             .attr(
//               'fill',
//               this.realColor[chartValue.open < chartValue.close ? 0 : 1]
//             )
//             .attr('height', Math.abs(chartValue.open - chartValue.close));
//         }
//       });
  
//       // Add x-axis
//       const xAxis = d3.axisBottom(xScale);
//       chart
//         .append('g')
//         .attr('transform', `translate(0, ${innerHeight})`)
//         .call(xAxis);
  
//       // Add y-axis
//       const yAxis = d3.axisLeft(yScale);
//       chart.append('g').call(yAxis);
//     }
  
//     chartPrepare() {
//       sessionStorage.setItem('selectedChart', 'normal');
//       this.selectedChart = 'normal';
//       this.generateChart(this.chartValues);
//     }
  
//     chartPredict() {
//       sessionStorage.setItem('selectedChart', 'predict');
//       this.selectedChart = 'predict';
//       this.generateChart(this.chartValues);
//     }
  
//     chartReal() {
//       sessionStorage.setItem('selectedChart', 'real');
//       this.selectedChart = 'real';
//       this.generateChart(this.chartValues);
//     }
//   }