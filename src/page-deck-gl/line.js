import React from 'react'
import DeckGl from '@deck.gl/react'
import {LineLayer} from '@deck.gl/layers'

// Viewport settings
const viewState = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 13,
  pitch: 0,
  bearing: 0
}

// Data to be used by the LineLayer
const data = [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}]

export default class DeckLine extends React.Component {
  render() {
    const layers = [
      new LineLayer({id: 'line-layer', data})
    ]

    return (
      <DeckGl viewState={viewState} layers={layers} />
    )
  }
}
