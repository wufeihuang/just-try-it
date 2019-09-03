import * as React from 'react'
import * as d3 from 'd3'
const csvData = require('./films.csv')

let id = 0
export default class DemoPack extends React.Component {
  constructor(props){
    super(props)

    this.id = ++id
    this.ref = React.createRef()
  }

  componentDidMount() {
    const svg = d3.select(this.ref.current)

    const packLayout = d3.pack()
      .size([800, 800])

    function arcSvg(mx0, my0, r, larc, sweep, mx1, my1) {
      return `M${mx0},${my0} A${r},${r} 0 ${larc} ${sweep} ${mx1},${my1}`
    }

    function make(root) {
      const nodes = root.descendants()

      const u = svg.select('.wrapper')
        .selectAll('g.node')
        .data(nodes)

      const enteringNodes = u.enter()
        .append('g')
        .classed('node', true)
        .attr('transform', d => `translate(${d.y},${d.x})`)

      enteringNodes.append('circle')
        .attr('r', d => d.r)
        .attr('fill', '#000')
        .attr('opacity', 0.15)

      enteringNodes.each(function(d, i) {
        const g = d3.select(this)
        const {depth} = d

        const label = depth === 0 ? '' : depth === 3 ? d.data.Film : d.data.key

        if (depth === 3) {
          g.append('text')
            .style('font-size', d3.min([3 * d.r / label.length, 16]))
            .attr('dy', '0.3em')
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .text(label)
        } else if (depth > 0) {
          const r = d.r - 10
          g.append('path')
            .attr('d', arcSvg(-r, 0, r, 1, 1, r, 0))
            .attr('id', `pack-${this.id}-label-path-${i}`)
            .style('fill', 'none')
            .style('stroke', 'none')

          g.append('text')
            .append('textPath')
            .attr('xlink:href', `#pack-${this.id}-label-path-${i}`)
            .attr('startOffset', '50%')
            .style('font-size', '10px')
            .style('fill', 'white')
            .attr('text-anchor', 'middle')
            .text(d.data.key)
            
        }
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

      packLayout(root)

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