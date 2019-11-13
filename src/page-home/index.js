import React from 'react'

class Child extends React.Component {
  componentWillMount() {
    console.log('Child: componentWillMount')
  }

  componentDidMount() {
    console.log('Child: componentDidMount')
  }

  componentWillUnmount(){
    console.log('Child: componentWillUnmount')
  }

  componentWillUpdate() {
    console.log('Child: componentWillUpdate')
  }

  componentDidUpdate() {
    console.log('Child: componentDidUpdate')
  }

  // getDerivedStateFromProps() {

  // }

  // getSnapshotBeforeUpdate() {
  //   console.log('Child: getSnapshotBeforeUpdate')
  // }

  shouldComponentUpdate() {
    console.log('Child: shouldComponentUpdate')
    return true
  }

  render() {
    return <div>Child</div>
  }
}

class Parent extends React.Component {
  constructor() {
    super()
    this.state = {
      count: 0,
    }
  
    this.ref = React.createRef()
  }
  

  componentWillMount() {
    console.log('Parent: componentWillMount')
  }

  componentDidMount() {
    console.log('Parent: componentDidMount')

    this.ref.current.addEventListener('click', () => {
      console.log('before setState: ', this.state.count)
      // this.setState({
      //   count: this.state.count + 1
      // })
      this.setState((state, props) => ({
        count: state.count + 1,
      }))
      console.log('after setState: ', this.state.count)
    })
  }

  componentWillUnmount(){
    console.log('Parent: componentWillUnmount')
  }

  componentWillUpdate() {
    console.log('Parent: componentWillUpdate')
  }

  componentDidUpdate() {
    console.log('Parent: componentDidUpdate')
  }

  shouldComponentUpdate() {
    console.log('Parent: shouldComponentUpdate')
    return true
  }

  // getDerivedStateFromProps() {

  // }

  // getSnapshotBeforeUpdate() {
  //   console.log('Parent: getSnapshotBeforeUpdate')
  // }

  render() {
    return <div>
      <h2 ref={this.ref}>Parent, click</h2>
      <Child />
    </div>
  }
}

const App = () => {
  const [temp, setTemp] = React.useState(5);

  const log = () => {
    console.log('log')
    setTimeout(() => {
      console.log("3 秒前 temp = 5，现在 temp =", temp);
    }, 3000);
  };

  console.log('before return')

  return (
    <div
      onClick={() => {
        log();
        setTemp(3);
        // 3 秒前 temp = 5，现在 temp = 5
      }}
    >
      xyz  {temp}
    </div>
  );
};

export default function() {
  return (
    <div className="home--content">
      content
      <App />
      <Parent />
    </div>
  )
}