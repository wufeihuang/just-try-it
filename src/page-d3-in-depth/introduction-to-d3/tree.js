import * as React from 'react'
import * as d3 from 'd3'
const csvData = require('./films.csv')

export default class DemoTree extends React.Component {
  constructor(props){
    super(props)

    this.ref = React.createRef()
  }

  componentDidMount() {
    const svg = d3.select(this.ref.current)

    const treeLayout = d3.tree()
      .size([900, 600])

    function link(d) {
      return `M${d.y},${d.x}`
        + `C${(d.y + d.parent.y) / 2},${d.x}`
        + ` ${(d.y + d.parent.y) / 2},${d.parent.x}`
        + ` ${d.parent.y},${d.parent.x}`
    }

    function make(root) {
      const nodes = svg.select('.nodes')
        .selectAll('g.node')
        .data(root.descendants())

      const enteringNodes = nodes.enter()
        .append('g')
        .classed('node', true)
        .attr('transform', d => `translate(${d.y},${d.x})`)

      enteringNodes
        .append('circle')
        .attr('r', 2)

      enteringNodes
        .append('text')
        .attr('x', 5)
        .attr('y', 4)
        .text(d => {
          switch(d.depth) {
            case 1:
            case 2:
              return d.data.key
            case 3:
              return d.data.Film
          }
          return ''
        })

      const links = svg.select('.links')
        .selectAll('path')
        .data(root.descendants().slice(1))

      links.enter()
        .append('path')
        .attr('d', link)
        .attr('fill', 'none')
        .attr('stroke', '#ccc')
    }

    function ready(data) {
      let nest = d3.nest()
        .key(d => d.Genre)
        .key(d => d['Lead Studio'])
        .entries(data)

      nest = {
        key: 'root',
        values: nest
      }

      const root = d3.hierarchy(nest, d => d.values)

      treeLayout(root)

      make(root)
    }

    d3.csv(csvData).then(ready).catch(e => console.log(e))
  }

  render() {
    return (
      <div className="chart" style={{fontSize: '9px'}}>
        <svg ref={this.ref} width="800" height="920">
          <g className="wrapper" transform="translate(20, 20)">
            <g className="links" />
            <g className="nodes" />
          </g>
        </svg>
      </div>
    )
  }
}