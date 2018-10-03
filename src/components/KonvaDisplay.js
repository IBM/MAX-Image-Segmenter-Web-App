import React, { Component } from 'react'
import { Stage, Layer } from 'react-konva'
import { Glyphicon } from 'react-bootstrap'
import Img from './Img'
import '../styles/KonvaDisplay.css'

export default class KonvaDisplay extends Component {
  initialState = {
    image1: {
      xPos: 0,
      yPos: 0
    },
    image2: {
      xPos: 0,
      yPos: 0
    }
  }

  constructor(props) {
    super(props)
    this.state = this.initialState
  }

  handleDragEndOne = e => {
    this.setState({
      image1: {
        xPos: e.target.x(),
        yPos: e.target.y()
      }
    })
  }

  handleDragEndTwo = e => {
    this.setState({
      image2: {
        xPos: e.target.x(),
        yPos: e.target.y()
      }
    })
  }

  downloadURI(uri, name) {
    let link = document.createElement("a")
    link.download = name
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

  downloadStage = () => {  
    const dataURL = this.stageRef._stage.toDataURL()
    this.downloadURI(dataURL, 'MAX-Studio.png')
  }

  renderLayer = (layer, image, selected) => {
    const imageState = layer === 'BG' ? this.state.image1 : this.state.image2
    const dragHandler = layer === 'BG' ? this.handleDragEndOne : this.handleDragEndTwo
    if (selected[layer]) {
      return (
      <Img
        src={ image.selected ? image.segments[selected[layer]].url : image.segments.source.url }
        x={ imageState.xPos }
        y={ imageState.yPos }
        draggable={ true }
        onDragEnd={ dragHandler } />
      )
    }
  }

  render() {
    const BGImage = this.props.BG
    const frontImage = this.props.front
    const selected = this.props.selected
    
    return (
      <div>
        <Stage
          className="konvaMain"
          ref={ ref => this.stageRef = ref }
          height={ this.props.BG.height }
          width={ this.props.BG.width }>
          <Layer> 
            { BGImage ? this.renderLayer('BG', BGImage, selected) : null }  
            { frontImage ? this.renderLayer('front', frontImage, selected) : null }
          </Layer>
        </Stage>
        <button
          className="btn konvaDL"
          onClick={ () => this.downloadStage() }>
          <Glyphicon glyph="floppy-disk" /> <span className="dlText ">{` Download Image`}</span>
        </button>
      </div>
    )
  }
}