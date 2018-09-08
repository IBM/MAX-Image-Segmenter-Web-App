import './CanvasDisplay.css'
import React, { Component } from 'react'
import TextOutput from '../TextOutput'
export default class CanvasDisplay extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
    this.state = {
      'selectedObject' : 'source' 
    }
  }

  componentDidMount()  {
    this.drawSegments()
  }

  componentDidUpdate()  {
    this.drawSegments()
  }

  drawSegments = () => {
    let canvas = this.canvasRef.current
    const imgHeight = this.props.image.height
    const imgWidth = this.props.image.width
    let img = new Image()

    img.onload = () => {
      const ctx = canvas.getContext('2d')
      img.width = imgWidth
      img.height = imgHeight
      ctx.drawImage(img, 0, 0, img.width, img.height)
    }
    img.src = this.props.image.urls[this.state.selectedObject]
  }

  setSelectedObject = objType => {
    this.setState({
      'selectedObject' : objType
    })
  }

  render() {    
    return (
      <div>
        <canvas className="panel panel-default mainDisplay" ref={ this.canvasRef } width={ this.props.image.width } height={ this.props.image.height }></canvas>
        
        <TextOutput 
          image={ this.props.image }
          selectObject={ selected => this.setSelectedObject(selected) }
          segData={ this.props.segData }
        />
        
      </div>
    )
  }
}

/*
        <TextOutput 
          style={ this.props.style }
          segData={ this.props.segData }
          image={ this.props.image }
          selectObject={ this.setSelectedObject }
        />
        */