import React from 'react'
import Context from './context'

export default class Rect extends React.Component {
  // static contextType = Context

  render() {
    const ctx = this.context

    ctx.fillStyle = 'red'
    ctx.fillRect(0, 0, 200, 200)



    return null
  }
}

Rect.contextType = Context