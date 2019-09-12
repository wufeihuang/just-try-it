import React from 'react'
import Doc from './layouts.md'

export default class Layouts extends React.Component {
  render() {
    return <div className="d3-in-depth markdown">
      <Doc />
    </div>
  }
}