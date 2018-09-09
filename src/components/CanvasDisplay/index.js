import './CanvasDisplay.css'
import React, { Component } from 'react'
import TextOutput from '../TextOutput'
export default class CanvasDisplay extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
    this.state = {
      'selectedObject' : 'colormap' 
    }
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
    console.log(`rendering canvas with props ${Object.keys(this.props)}`)    
    return (
      <div>
        
        <div className="panel panel-default mainDisplay">
          <img alt={ this.props.image.name } src={this.props.image.urls[this.state.selectedObject]} />
        </div>
        <TextOutput 
          image={ this.props.image }
          selectObject={ this.setSelectedObject }
          segData={ this.props.image.response }
        />
      </div>
    )
  }
}