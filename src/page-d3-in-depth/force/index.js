import React from 'react'
import Doc from './force.md'

export default class Force extends React.Component {
  render() {
    return <div className="d3-in-depth markdown">
      <Doc />
    </div>
  }
}