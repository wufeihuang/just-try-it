import React from 'react'

import Force from './force'
import ForceMd from './force-md.md'
// import DemoTree from '../page-d3-in-depth/introduction-to-d3/tree'


export default class D3 extends React.Component {
  render() {
    return (
      <div>
        <h2>D3</h2>
        <p>这没用啊</p>
        {/* <p>好像有用</p> */}
        {/* <Force /> */}
        {/* <DemoTree /> */}

        <ForceMd />
      </div>
    )
  }
}