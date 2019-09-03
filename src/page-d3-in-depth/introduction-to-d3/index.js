import React from 'react'
import Doc from './introduction-to-d3.md'

export default class IntroductionToD3 extends React.Component {
  render() {
    return <div className="d3-in-depth markdown">
      <Doc />
    </div>
  }
}