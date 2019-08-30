import React from 'react'
import ReactDom from 'react-dom'
import Context from './context'


export default class Canvas extends React.Component {
  // state = {
  //   ctx: undefined,
  // }

  constructor(props) {
    super(props)

    this.state = {
      ctx: null,
    }
  }

  componentDidMount() {
    this.setState({
      ctx: ReactDom.findDOMNode(this).getContext('2d'),
    })
  }

  render() {
    const {width = 400, height = 400, children} = this.props
    const {ctx} = this.state

    return (
      <Context.Provider value={ctx}>
        <canvas 
          width={width} 
          height={height}
          style={{border: '1px solid blue'}}
        >
          {ctx ? children : null}
        </canvas>
      </Context.Provider>
    )
  }
}