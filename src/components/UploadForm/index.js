import {} from 'dotenv/config'
import React, { Component } from 'react'
import { getPrediction, parseMAXData } from '../../utils'
import CanvasDisplay from '../CanvasDisplay'
import TextOutput from '../TextOutput';

const initialState = {
  'image' : {
    'blank': true
  },
  'response' : '', 
  'isLoading' : false
}

export default class UploadForm extends Component {
  constructor(props) {
    super(props)
    this.uploadRef = React.createRef()
    this.previewRef = React.createRef()
    this.state = initialState
  }

  receiveUpload = async e => {
    e.preventDefault()
    
    // this will (eventually) trigger a state 'reset' to 
    // prepare for subsequent image uploads
    this.props.setImageLoadState('false')
    
    let scaledImage = new Image()
    const fileObj = this.uploadRef.current.files[0]
    const imageURL = window.URL.createObjectURL(fileObj)
    let scaledWidth
    let scaledHeight
    let canvas = this.previewRef.current
    console.log('before load')
      scaledImage.onload = async () => {
        // similar to above, this lets app know
        // there is an image 'loaded' in the main display
        this.props.setImageLoadState('true')

        // this can eventually be brought out as an ENV var..
        // but it must match the size of the output from MAX model
        const MAX_SIZE = 513
        const ctx = canvas.getContext('2d')  
        scaledWidth = scaledImage.naturalWidth
        scaledHeight = scaledImage.naturalHeight
        let ratio
        if (scaledWidth > scaledHeight) {
          ratio = scaledHeight / scaledWidth
          scaledWidth = MAX_SIZE
          scaledHeight = Math.round(scaledWidth * ratio)
        } else {
          ratio = scaledWidth / scaledHeight
          scaledHeight = MAX_SIZE
          scaledWidth = Math.round(scaledHeight * ratio)
        }
        
        scaledImage.width = scaledWidth
        scaledImage.height = scaledHeight
        canvas.width = scaledWidth 
        canvas.height = scaledHeight 
        ctx.drawImage(scaledImage, 0, 0, scaledWidth, scaledHeight)
        this.setState({
          'image' : {
            'name' : fileObj.name,
            'type' : fileObj.type,
            'height' : scaledHeight,
            'width' : scaledWidth,
            'url' : {
              'source' : canvas.toDataURL()
            }
          }
        })
        this.setState({
          'image' : {
            ...this.state.image,
            'savedSegments' : ['source']  
          }
        })
        try {
          console.log('sending to MAX...')
          const cleanJSON = parseMAXData(this.state.image.name, await getPrediction(this.props.modelType, fileObj))
          this.setState({
            'image': {
              ...this.state.image,
              'foundSegments' : cleanJSON.objectTypes
            }, 
            'response' : cleanJSON,
            'isLoading' : false
          })
        } catch (e) {
          console.error('error getting prediction from MAX Model.')
        }        
        this.props.resetApp()

    }
      scaledImage.src = imageURL
  }

  render() {
    let previewStyle = { 'marginTop' :' 2%' }
    let canvasStyle = {}
    if (this.state.response) {
      previewStyle = { 'display' : 'none' }
    } else {
      canvasStyle = { 'display' : 'none' }
    }

    return (
       <div>
        <form method="post" encType="multipart/form-data" onSubmit={ this.receiveUpload }>
          <input ref={ this.uploadRef } type="file" accept="image/*" />
          <input type="submit" value="Upload" />
        </form>
        <canvas style={ previewStyle } ref={ this.previewRef }></canvas>
        { 
          this.state.response ? 
            <div>
              <CanvasDisplay 
                style={ canvasStyle || { 'marginTop': '20px' } }
                image={ this.state.image }
                bulkStatus={ this.state.bulkComplete }
                bulkComplete={ () => this.setState({ bulkComplete: true }) }
                addNewURL={ (name, newURL) => this.setState({ image : { ...this.state.image, url : { ...this.state.image.url, [name] : newURL } } }) }
                addSavedSegment={ segment => this.setState({ image : { ...this.state.image, savedSegments : [...this.state.image.savedSegments, segment] } }) } 
                setNewRev={ rev => this.setState({ image : { ...this.state.image, rev: rev } }) }
                segData={ this.state.response } 
              />
            </div> 
          : <p/>
        }
        { this.state.isLoading ? 
          <p>LOADING...</p> : <p /> }
      </div>
    )
  }
}
