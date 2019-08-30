import React from 'react'
import * as d3 from 'd3'

let id = 0

export default class Force extends React.Component {

  constructor(props) {
    super(props)

    this.id = `svg-force-${++id}`
  }

  componentDidMount() {
    const svg = d3.select(`#${this.id}`)

    var width = 300, height = 300
    var nodes = [{}, {}, {}, {}, {}]

    var simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2))
      .on('tick', ticked);
    
    function ticked() {
      var u = svg
        .selectAll('circle')
        .data(nodes)
    
      u.enter()
        .append('circle')
        .attr('r', 5)
        .merge(u)
        .attr('cx', function(d) {
          return d.x
        })
        .attr('cy', function(d) {
          return d.y
        })
    
      u.exit().remove()
    }
  }

  render() {
    return (
      <svg id={this.id} width={600} height={300}>

      </svg>
    )
  }
}