import { Component, OnInit } from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear, scaleBand } from 'd3-scale';
import { max } from 'd3-array';
import * as d3 from 'd3';
import { line } from 'd3-shape';
import { axisBottom, axisLeft } from 'd3-axis';
import { barData } from './data';
// import { from, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public listdata:any;
  public value:any=[];
  constructor(private http: HttpClient){}
  ngOnInit(): void {
    const apiUrl = 'http://localhost:5000';
    interface MyData {
      name: string;
      age: number;
      // Add other properties here
    }
    

    this.http.get<MyData[]>(apiUrl).subscribe(
      (data) => {
        for(let i=0;i<data.length;i++){
          this.value.push(data[i])
        }
        console.log(this.value,'--->')

      },
      (error) => {
        // Handle errors here
        console.error(error);
      }
    );
    const w = 500,h=500;
    const chart = d3.select('svg')
          .classed("chart",true)
          .attr('width',w)
          .attr('height',h)
          .attr('padding',10)
          .attr('margin',12);
    
    const xScale = d3.scaleBand().domain(barData.map(d=>d.topic)).range([0+10,w-10]).padding(0.1);
    const yScale = d3.scaleLinear().domain([0,d3.max(barData.map(d=>d.intensity)) ?? 0]).range([h-10,0+10]);

    const xAxis = d3.axisBottom(xScale).scale(xScale).ticks(barData.length);
    const yAxis = d3.axisLeft(yScale).scale(yScale).ticks(barData.length);

    chart.append('g')
    .attr('transform',`translate(30)`)
    .call(yAxis)

    chart.append('g')
    .attr('transform',`translate(0,${480})`)
    .call(xAxis)

    const bar = chart
    .selectAll('.bar')
      .data(barData)
      .enter()
      .append('rect')
      .classed('bar', true)
      .attr('width', xScale.bandwidth()-30)
      .attr('fill', (data)=> data.intensity > 50 ? "#90EE90" : '#FFCCCB')
      .attr('height', (data) => (h-20) - yScale(data.intensity))
      .attr('x', (data) => xScale(data.topic) || 0) // Use the || operator instead of ??
      .attr('y', (data) => yScale(data.intensity))
      .attr('transform', `translate(20, 0)`); // Position the x-axis at the bottom of the chart 

      bar.on('mouseover', (event, data) => {
        const tooltip = d3.select('#tooltip');
      
        tooltip
          .style('visibility', 'visible')
          .style('top', event.pageY + 'px')
          .style('left', event.pageX + 'px')
          .html(`<strong>${data.topic}</strong><br>Intensity: ${data.intensity}`);
      })
      .on('mousemove', (event) => {
        const tooltip = d3.select('#tooltip');
        tooltip
          .style('top', event.pageY + 'px')
          .style('left', event.pageX + 'px');
      })
      .on('mouseout', () => {
        const tooltip = d3.select('#tooltip');
        tooltip.style('visibility', 'hidden');
      });     
  }

  

}
