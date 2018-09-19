import React, { Component } from 'react'
import { Stage, Layer } from 'react-konva'
import Img from './Img'

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
      <div className="uploadWrapper">
        <Stage
          className="konvaMain panel panel-default"
          ref={ref => this.stageRef = ref }
          height={515}
          width={515}>
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
          className="btn studioObjBtnActive DLbtn"
          onClick={ () => this.downloadStage() }>
          Download
        </button>
      </div>
    )
  }
}
