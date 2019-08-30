import { hot } from 'react-hot-loader/root'

import React from 'react'
import {HashRouter as Router, Route} from 'react-router-dom'
import Sider from './sider'
import Home from './page-home'
import Abc from './page-abc'
import Deck from './page-deck-gl'
import Canvas from './page-canvas'
import D3 from './page-d3'
import D3InDepth from './page-d3-in-depth'

function AppRouter() {
  return (
    <Router>
      <div
        style={{
          display: 'flex',
          minHeight: '100%',
        }}
      >
        <Sider />
        
        <div className="content">
          <Route exact path="/" component={Home} />
          <Route path="/abc" component={Abc} />
          <Route path="/deck" component={Deck} />
          <Route path="/canvas" component={Canvas} />
          <Route path="/d3" component={D3} />
          <Route path="/d3-in-depth" component={D3InDepth} />
          {/* {D3InDepth} */}
        </div>
      </div>
    </Router>
  )
}

// export default AppRouter
export default hot(AppRouter)