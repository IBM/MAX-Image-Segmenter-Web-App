import './ImageDisplay.css'
import React, { Component } from 'react'
import TextOutput from '../TextOutput'
export default class ImageDisplay extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
    this.state = {
      'selectedObject' : 'colormap' 
    }
  }

  setSelectedObject = objType => {
    this.setState({
      'selectedObject' : objType
    })
  }

  renderLoadingMsg = () => {
    return <p>LOADING...</p>
  }

  render() {
    //console.log(`rendering canvas with props ${Object.keys(this.props)}`)
    if (this.props.previewImg) {
      return (
        <div>
          <div className="panel panel-default mainDisplay">
            <img alt={ this.props.previewImg.name } src={ this.props.previewImg.urls.source } width={ this.props.previewImg.width } height={ this.props.previewImg.height }/>
          </div>
          { this.renderLoadingMsg() }
        </div>
      )
    } else {
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
}