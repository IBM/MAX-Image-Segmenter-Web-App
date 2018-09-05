import {} from 'dotenv/config'
import React, { Component } from 'react'
import { FAKEcloudantUpload, cloudantUpload, getPrediction, getCleanData, URLto64 } from '../utils'
import CanvasDisplay from './CanvasDisplay'


export default class UploadForm extends Component {
  constructor(props) {
    super(props)
    this.uploadRef = React.createRef()
    this.previewRef = React.createRef()
    this.state = {
      'image' : {
        'blank': true
      },
      'response' : '', 
      'isLoading' : false
    }
  }

  /* deprecated method of image file reading
  blobToDataURL(blob) {
    return new Promise((resolve, reject) => {
      var a = new FileReader();
      
      a.onload = (e) =>{
        resolve(e.target.result.split(',')[1]);
      }
      a.readAsDataURL(blob);
      if (!blob)
        reject('error converting to dataURL')
    })
  }
  */

  receiveUpload = async e => {
    e.preventDefault()
    let scaledImage = new Image()
    const fileObj = this.uploadRef.current.files[0]
    const imageURL = window.URL.createObjectURL(fileObj)
    let scaledWidth
    let scaledHeight
    let canvas = this.previewRef.current
    console.log('before load')
      scaledImage.onload = async () => {
        
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
        // add an if statement so this gets skipped if no DB is specified
        try {
          console.log('saving source here...')
          //const cloudantJSON = await cloudantUpload(fileObj.name, fileObj.type, URLto64(canvas.toDataURL()))
          //const cloudantJSON = await FAKEcloudantUpload({ 'name' : fileObj.name, 
          //'base64' : URLto64(canvas.toDataURL())
          //})
          this.setState({
            'image' : {
              ...this.state.image,
              'id' : '',//cloudantJSON.id,
              'rev' : '',//cloudantJSON.rev,
              'savedSegments' : ['source']  
            }
          })
          //console.log(cloudantJSON)
        } catch (e) {
          console.error('error saving resized source image to Cloudant.')
          console.error(e)
        }
        try {
          console.log('sending to MAX...')
          const cleanJSON = getCleanData(this.state.image.name, await getPrediction(this.props.modelType, fileObj))
          this.setState({
            'image': {
              ...this.state.image,
              'foundSegments' : cleanJSON.objectTypes
            }, 
            'response' : cleanJSON,
            'isLoading' : false
          })
          //console.log(`cleanJSON recvd: ${Object.keys(cleanJSON)}`)
        } catch (e) {
          console.error('error getting prediction from MAX Model.')
        }        
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
        
        

         { this.state.response ? 
          <CanvasDisplay 
            style={ canvasStyle || { 'marginTop': '20px' } }
            image={ this.state.image }
            bulkStatus={ this.state.bulkComplete }
            bulkComplete={ () => this.setState({bulkComplete: true})}
            addNewURL={ (name, newURL) => this.setState({ image : { ...this.state.image, url : { ...this.state.image.url, [name] : newURL } } }) }
            addSavedSegment={ segment => this.setState({ image : { ...this.state.image, savedSegments : [...this.state.image.savedSegments, segment] } }) } 
            setNewRev={ rev => this.setState({ image : { ...this.state.image, rev: rev } }) }
            segData={ this.state.response } />
          : <p />
         }

        { this.state.isLoading ? 
          <p>LOADING...</p> : <p /> }
      </div>
    )
  }
}
