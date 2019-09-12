import React from 'react'
import Doc from './geographic.md'

export default class Geographic extends React.Component {
  render() {
    return <div className="d3-in-depth markdown">
      <Doc />
    </div>
  }
}