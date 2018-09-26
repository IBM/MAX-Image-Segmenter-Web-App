import React, { Component } from 'react'
import { Stage, Layer } from 'react-konva'
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

  componentWillReceiveProps(nextProps) {
    // detection of new props here may allow multiple 
    // image segments to be added to one canvas
    
    /*
    console.log(`componentWillReceiveProps!`)
    console.log(`current props-bg ${JSON.stringify(this.props.BG.selected)}`)
    console.log(`current props-front ${JSON.stringify(this.props.front.selected)}`)
    console.log(`nextProps-bg ${JSON.stringify(nextProps.BG.selected)}`)
    console.log(`nextProps-front ${JSON.stringify(nextProps.front.selected)}`)
    */
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
          ref={ref => this.stageRef = ref }
          height={ 513 }
          width={ 513 }>
          <Layer> 
            { BGImage ? this.renderLayer('BG', BGImage, selected) : null }  
            { frontImage ? this.renderLayer('front', frontImage, selected) : null }
          </Layer>
        </Stage>
        <button
          className="btn konvaDL"
          onClick={ () => this.downloadStage() }>
          Download
        </button>
      </div>
    )
  }
}