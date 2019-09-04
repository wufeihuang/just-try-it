import * as React from 'react'
import {Route} from 'react-router-dom'

import './style.css'

import IntroductionToD3 from './introduction-to-d3'
import Selections from './selections'
import DataJoins from './data-joins'

const routes = [
  {
    path: 'introduction-to-d3',
    component: IntroductionToD3,
  },
  {
    path: 'selections',
    component: Selections,
  },
  {
    path: 'joins',
    component: DataJoins,
  }
]

const Routes = routes.map(item => (
  <Route key={item.path} exact  path={`/d3-in-depth/${item.path}`} component={item.component} />
))

export default Routes
