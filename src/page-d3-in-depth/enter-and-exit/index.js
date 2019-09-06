import React from 'react'
import Doc from './enter-and-exit.md'

export default class EnterAndExit extends React.Component {
  render() {
    return <div className="d3-in-depth markdown">
      <Doc />
    </div>
  }
}