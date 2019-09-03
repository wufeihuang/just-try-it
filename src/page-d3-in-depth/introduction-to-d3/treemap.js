import * as React from 'react'
import * as d3 from 'd3'
const csvData = require('./films.csv')

let id = 0
export default class DemoTreemap extends React.Component {
  constructor(props){
    super(props)

    this.id = ++id
    this.ref = React.createRef()
  }

  componentDidMount() {
    const svg = d3.select(this.ref.current)

    const treemapLayout = d3.treemap()
      .size([800, 800])
      .padding(12)

    function make(root) {
      const nodes = root.descendants()

      const u = svg.select('.wrapper')
        .selectAll('g.node')
        .data(nodes)

      const enteringNodes = u.enter()
        .append('g')
        .classed('node', true)

      enteringNodes.append('rect')
        .attr('x', d => d.x0)
        .attr('y', d => d.y0)
        .attr('width', d => d.x1 - d.x0)
        .attr('height', d => d.y1 - d.y0)
        .attr('fill', '#000')
        .attr('opacity', 0.15)

      enteringNodes.append('text')
        .each(function(d){
          const is3 = d.depth === 3
          const label = is3 ? d.data.Film : d.data.key

          d3.select(this)
            .attr('x', is3 ? 0.5 * (d.x0 + d.x1) : d.x0 + 3)
            .attr('y', is3 ? 0.5 * (d.y0 + d.y1) : d.y0 + 6)
            .attr('dy', '0.3em')
            .attr('font-size', d3.min([1.4 * (d.x1 - d.x0) / label.length, 11]))
            .attr('text-anchor', is3 ? 'middle' : 'start')
            .attr('fill', '#fff')
            .text(label)
            .style('display', (d.x1 - d.x0) < 10 || (d.y1 - d.y0) < 10)
        })
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
        .sum(d => d['Worldwide Gross'] === undefined ? null : d['Worldwide Gross'])

      treemapLayout(root)

      make(root)
    }

    d3.csv(csvData).then(ready).catch(e => console.error(e))
  }

  render() {
    return (
      <div className="chart" style={{fontSize: '9px'}}>
        <svg ref={this.ref} width="820" height="820">
          <g className="wrapper" transform="translate(10, 10)">
          </g>
        </svg>
      </div>
    )
  }
}