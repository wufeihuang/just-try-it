import React from 'react'
import * as d3 from 'd3'

export default class DemoTransition extends React.Component{
  constructor(){
    super()

    this.svg = React.createRef()
    this.btn = React.createRef()
  }

  componentDidMount() {
    const svg = d3.select(this.svg.current)

    var data = [];
    var numCircles = 20, width = 620, height = 350, maxRadius = 50;

    function rnd(x) {return Math.floor(Math.random() * x);}

    function randomise() {
      data = [];
      numCircles = 10;
      for(var i=0; i<numCircles; i++) {
        data.push({
          x: rnd(width) + 70,
          y: rnd(height) + 70,
          r: rnd(maxRadius) + 20,
          fill: d3.rgb(rnd(255), rnd(255), rnd(255))
        });
      }
    }

    function update() {
      randomise();
    
      var u = svg
        .selectAll('circle')
        .data(data);
    
      // Enter
      u.enter()
        .append('circle')
        .attr('r', 0)
        .attr('cx', width / 2)
        .attr('cy', height / 2)
        .style('fill', 'white')
        .merge(u)
        .transition()
        .duration(1500)
        .attr('cx', function(d) {return d.x;})
        .attr('cy', function(d) {return d.y;})
        .attr('r', function(d) {return d.r;})
        .style('fill', function(d) {return d.fill;});
    
      // Exit
      u.exit()
        .transition()
        .duration(1500)
        .attr('r', 0)
        .style('opacity', 0)
        .each('end', function() {
          d3.select(this).remove();
        });
    }
    
    update();

    d3.select(this.btn.current).on('click', update)
  }

  render() {
    return (
      <div className="chart">
        <div>
          <button ref={this.btn}>Do transition</button>
        </div>
        <svg ref={this.svg} width="780" height="510" />
      </div>
    )
  }
}