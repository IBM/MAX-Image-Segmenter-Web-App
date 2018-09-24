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
    
    // console.log(`componentWillReceiveProps!`)
    // console.log(`current props ${Object.keys(this.props)}`)
    // console.log(`nextProps ${nextProps}`)
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
    var link = document.createElement("a")
    link.download = name
    link.href = uri
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

  downloadStage = () => {  
    var dataURL = this.stageRef._stage.toDataURL()
    this.downloadURI(dataURL, 'MAX-Studio.png')
  }

  render() {
    let BGImage = this.props.BG
    let frontImage = this.props.front
    
    return (
      <div>
        <Stage
          className="konvaMain"
          ref={ref => this.stageRef = ref }
          height={ 513 }
          width={ 513 }>
          <Layer>
            <Img
              src={ BGImage.selected ? BGImage.segments[BGImage.selected].url : BGImage.segments.source.url }
              x={ this.state.image1.xPos }
              y={ this.state.image1.yPos }
              draggable
              onDragEnd={ this.handleDragEndOne } />    
            <Img
              src={ frontImage.selected ? frontImage.segments[frontImage.selected].url : frontImage.segments.source.url }
              x={ this.state.image2.xPos }
              y={ this.state.image2.yPos }
              draggable
              onDragEnd={ this.handleDragEndTwo } />            
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