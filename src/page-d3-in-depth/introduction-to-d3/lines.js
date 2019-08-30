import React from 'react'
import * as d3 from 'd3'

const data = [[0, 50], [100, 80], [200, 40], [300, 60], [400, 30]];
const max = 400
const width = 500
const height = 100

export class DemoLine extends React.Component{
  constructor(props) {
    super(props)

    this.ref = React.createRef()

    this.svg = null
    // this.scale = d3.scaleLinear().domain([0, max]).range([0, 400])
  }

  componentDidMount() {
    this.svg = d3.select(this.ref.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(50, 0)')
    
    this.updateLine()
  }

  render() {
    return (
      <div 
        ref={this.ref} 
        style={{
          height,
          border: '1px solid #333',
          padding: '10px 0',
          fontSize: 12,
        }}
      />
    )
  }

  updateLine() {
    const {scale, svg} = this
    
    const line = d3.line()
      // .x(d => d)

    const u = svg.selectAll('path')
      .data([data])

    u.enter()
      .append('path')
      .merge(u)
      .attr('d', line)
      .attr('stroke', '#aaa')
      .attr('fill', 'none')
  }
}

export class DemoLineCurve extends React.Component{
  constructor(props) {
    super(props)

    this.ref = React.createRef()

    this.svg = null
    this.scale = d3.scaleLinear().domain([0, max]).range([0, 400])
  }

  componentDidMount() {
    this.svg = d3.select(this.ref.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(50, 0)')
    
    this.updateLine()
  }

  render() {
    return (
      <div 
        ref={this.ref} 
        style={{
          height,
          border: '1px solid #333',
          padding: '10px 0',
          fontSize: 12,
        }}
      />
    )
  }

  updateLine() {
    const {scale, svg} = this
    
    const line = d3.line()
      // .x(d => d)
      .curve(d3.curveNatural)

    const u = svg.selectAll('path')
      .data([data])

    u.enter()
      .append('path')
      .merge(u)
      .attr('d', line)
      .attr('stroke', '#aaa')
      .attr('fill', 'none')
  }
}