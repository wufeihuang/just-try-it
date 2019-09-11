import React from 'react'
import Doc from './shapes.md'

export default class Shapes extends React.Component {
  render() {
    return <div className="d3-in-depth markdown">
      <Doc />
    </div>
  }
}