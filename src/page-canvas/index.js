import React from 'react'
import Canvas from './canvas'
import Rect from './rect'


export default class Page extends React.Component {
  render() {
    return (
      <Canvas>
        <Rect />
      </Canvas>
    )
  }
}