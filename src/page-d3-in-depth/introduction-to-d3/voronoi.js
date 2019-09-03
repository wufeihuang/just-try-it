import * as React from 'react'
import * as d3 from 'd3'
import './voronoi.css'

export default class DemoVoronoi extends React.Component{
  constructor(props){
    super(props)

    this.ref = React.createRef()
  }

  componentDidMount() {
    let hovered = null
    let voronoiActive = false
    let voronoiVisible = false

    const width = 700
    const height = 580

    const box = d3.select(this.ref.current)
    const svg = box.select('svg')

    const points = d3.range(100).map((d, i) => ({
      id: i,
      pos: [Math.random() * width, Math.random() * height],
    }))

    function polygon(d) {
      return `M${d.join('L')}Z`
    }

    const voronoi = d3.voronoi()
      .x(d => d.pos[0])
      .y(d => d.pos[1])
      .extent([[0, 0], [width, height]])

    function doVoronoi() {
      const polygons = voronoi(points).polygons()

      points.forEach((d, i) => d.polygon = polygons[i])
    }

    function update() {
      box.select('.menu .voronoi.item')
        .text(voronoiActive ? 'Disable Voronoi' : 'Enable Voronoi');

      box.select('.menu .voronoi-visible.item')
        .text(voronoiVisible ? 'Hide Voronoi' : 'Show Voronoi');

      box.select('.points')
        .classed('voronoi-visible', voronoiVisible);

      box.select('.halo')
        .style('opacity', hovered === null ? 0 : 1);

      if(hovered === null)
        return;

      box.select('.halo')
        .attr('cx', hovered.pos[0])
        .attr('cy', hovered.pos[1]);
    }

    function toggleVoronoi() {
      voronoiActive = !voronoiActive
      update()
    }

    function toggleVoronoiVisibility() {
      voronoiVisible = !voronoiVisible
      update()
    }

    doVoronoi()

    const groups = svg.select('.points')
      .selectAll('g.points')
      .data(points)
      .enter()
      .append('g')
      .classed('points', true)

    groups.append('path')
      .attr('d', d => polygon(d.polygon))
      .on('mouseover', d => {
        hovered = voronoiActive ? d : null
        update()
      })
      .on('mouseout', d => {
        hovered = null
        update()
      })

    groups.append('circle')
      .attr('cx', d => d.pos[0])
      .attr('cy', d => d.pos[1])
      .attr('r', 2)
      .on('mouseover', d => {
        hovered = d
        update()
      })
      .on('mouseout', d => {
        hovered = null
        update()
      })

    box.select('.menu .voronoi.item')
      .on('click', toggleVoronoi)

    box.select('.menu .voronoi-visible.item')
      .on('click', toggleVoronoiVisibility)
  }

  render() {
    return (
      <div ref={this.ref} className="chart demo-voronoi">
        <svg  width="800" height="600">
          <g className="wrapper" transform="translate(10, 10)">
            <g className="points" />
            <circle 
              className="halo" 
              r={7}
            />
          </g>
        </svg>

        <div className="menu">
          <div 
            className="item voronoi" 
          >Enable Voronoi</div>
          <div 
            className="item voronoi-visible"
          >Show Voronoi</div>
        </div>
      </div>
    )
  }
}