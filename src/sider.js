import React from 'react'
import {Link} from 'react-router-dom'
import {Menu, Icon} from 'antd'

const {SubMenu} = Menu

export default function() {
  return (
    <Menu
      style={{ width: 256 }}
      // defaultOpenKeys={['d3-in-depth']}
      mode="inline"
    >
      <SubMenu
        key="home"
        title={
          <Link to="/">Home</Link>
        }
      />
      {/* <SubMenu
        key="abc"
        title={
          <Link to="/abc">Abc</Link>
        }
      /> */}
      <SubMenu
        key="deck"
        title={
          <Link to="/deck">Deck.GL</Link>
        }
      />
      <SubMenu
        key="canvas"
        title={
          <Link to="/canvas">Canvas</Link>
        }
      />
      <SubMenu
        key="d3"
        title={
          <Link to="/d3">D3</Link>
        }
      />

      <SubMenu
        key="d3-in-depth"
        title={
          <span>
            {/* <Icon type="mail" /> */}
            <span>D3 in Depth</span>
          </span>
        }
      >
        <Menu.Item key="1">
          <Link to="/d3-in-depth/introduction-to-d3">Introduction to D3</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/d3-in-depth/selections">Selections</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/d3-in-depth/joins">Joins</Link>
        </Menu.Item>
        <Menu.Item key="4">
          <Link to="/d3-in-depth/enter-and-exit">Enter/exit</Link>
        </Menu.Item>
        <Menu.Item key="5">
          <Link to="/d3-in-depth/scales">Scales</Link>
        </Menu.Item>
        <Menu.Item key="6">
          <Link to="/d3-in-depth/shapes">Shapes</Link>
        </Menu.Item>
        <Menu.Item key="7">
          <Link to="/d3-in-depth/layouts">Layouts</Link>
        </Menu.Item>
        <Menu.Item key="8">
          <Link to="/d3-in-depth/force">Force</Link>
        </Menu.Item>
        <Menu.Item key="9">
          <Link to="/d3-in-depth/geographic">Geographic</Link>
        </Menu.Item>
      </SubMenu>
    </Menu>
  )
}