import React from 'react'
import * as d3 from 'd3'

function randomInteger(n) {
  return Math.floor(10 * Math.random());
}

function initialiseData() {
  return [
    {
      "name": "Andy",
      "score": 37
    },
    {
      "name": "Beth",
      "score": 39
    },
    {
      "name": "Craig",
      "score": 31
    },
    {
      "name": "Diane",
      "score": 35
    },
    {
      "name": "Evelyn",
      "score": 38
    }
  ];
}

export default class DemoBar extends React.Component{
  constructor(props) {
    super(props)

    this.ref = React.createRef()
    this.data = initialiseData()
    this.height = 200
    this.barWidth = 400

    this.box = null
    this.scale = d3.scaleLinear().domain([0, 100]).range([0, this.barWidth])
  }

  componentDidMount() {
    this.box = d3.select(this.ref.current)
    
    this.updateBars()
  }

  render() {
    return (
      <div 
        ref={this.ref} 
        style={{
          height: this.height,
          border: '1px solid #333',
          padding: '10px 0',
          fontSize: 12,
        }}
      />
    )
  }

  // updateScale()

  updateBars() {
    const {scale} = this
    const u = this.box.selectAll('div.row')
      .data(this.data, d => d.name)

    const newDivs = u.enter()
        .append('div')
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('margin-bottom', '2px')

    newDivs.append('div')
      .style('width', '60px')
      .style('text-align', 'right')
      .text(d => d.name)
    
    newDivs.append('div')
      .style('height', '20px')
      .style('width', d => `${scale(d.score)}px`)
      .style('background', 'steelblue')
      .style('margin-left', '10px')

    u.exit().remove()
  }
}