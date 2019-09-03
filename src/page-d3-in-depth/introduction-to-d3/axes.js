import * as React from 'react'
import {select, scaleLinear, axisBottom, axisTop, format as d3Format} from 'd3'

const {Component, createRef} = React

// 坐标轴
export class DemoAxis1 extends Component{
  constructor(props) {
    super(props)

    this.ref = createRef()
  }

  componentDidMount() {
    const scale = scaleLinear().domain([0, 1000]).range([0, 600])
    const axis = axisBottom().scale(scale)

    select(this.ref.current)
      .append('svg')
      .attr('width', 700)
      .attr('height', 40)
      .append('g')
      .attr('transform', 'translate(20, 0)')
      .call(axis)
  }

  render() {
    return <div ref={this.ref} className="chart" />
  }
}

export class DemoAxis2 extends Component{
  constructor(props) {
    super(props)

    this.ref = createRef()
  }

  componentDidMount() {
    const scale = scaleLinear().domain([0, 1000000]).range([0, 600])
    const format = d3Format(',')
    const axis = axisTop().scale(scale)
      .tickFormat(d => `$${format(d)}`)
      .ticks(5)

    select(this.ref.current)
      .append('svg')
      .attr('width', 700)
      .attr('height', 40)
      .append('g')
      .attr('transform', 'translate(20, 20)')
      .call(axis)
  }

  render() {
    return <div ref={this.ref} className="chart" />
  }
}