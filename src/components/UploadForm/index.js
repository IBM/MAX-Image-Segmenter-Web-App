import './UploadForm.css'
import React, { Component } from 'react'
import { getPrediction, parseMAXData, OBJ_MAP, getColor, bulkSaveAttachments } from '../../utils'

const initialState = {
  'image' : {},
  'response' : '', 
  'isLoading' : false
}

export default class UploadForm extends Component {
  constructor(props) {
    super(props)
    this.uploadRef = React.createRef()
    this.previewRef = React.createRef()
    this.editorRef = React.createRef()
    this.state = initialState
  }

  receiveUpload = e => {
    e.preventDefault()
    
    // this will eventually trigger a state 'reset' to 
    // prepare for subsequent image uploads
    this.props.resetLoadState()
    this.setState({
      'isLoading': true
    })

    const fileObj = this.uploadRef.current.files[0]
    const imageURL = window.URL.createObjectURL(fileObj)
    let scaledWidth
    let scaledHeight
    let canvas = this.previewRef.current
    //console.log('before load')
    
    // drawing the pre MAX preview image
    let scaledImage = new Image()
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
          'urls' : {
            'source' : canvas.toDataURL()
          }
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
      try {
        const currentImage = this.state.image
        const dataURLs = this.mapNeededURLs(currentImage.foundSegments.concat('colormap'))
        this.props.setAppImageData(this.state.response, {...currentImage, urls: {...currentImage.urls, ...dataURLs}})
      } catch (e) {
        console.error('error saving urls in parent state')
      }       
    }
      scaledImage.src = imageURL
  }

  mapNeededURLs = neededSegments => {
    console.log(neededSegments)
    let URLMap = {}
    for (let name in neededSegments) {
      console.log(neededSegments[name])
      URLMap[neededSegments[name]] = this.invisibleSegment(neededSegments[name])
    }
    return URLMap
  }

  invisibleSegment = segmentName => {
    console.log('invisiblesegments')
    let canvas = this.editorRef.current
    const imgHeight = this.state.response.size.height
    const imgWidth = this.state.response.size.width
    const flatSegMap = this.state.response.flatSegMap
    let img = new Image()

    img.onload = () => {
      const ctx = canvas.getContext('2d')
      img.width = imgWidth
      img.height = imgHeight
      ctx.drawImage(img, 0, 0, img.width, img.height)
      const imageData = ctx.getImageData(0, 0, img.width, img.height)
      const data = imageData.data

      if (segmentName === 'colormap') {
        console.log(`building ${segmentName}`)
        for (let i = 0; i < data.length; i += 4) {
          const segMapPixel = flatSegMap[i / 4]
          let objColor = [0, 0, 0]
          if (segMapPixel) {
            objColor = getColor(this.state.response.objectIDs.indexOf(segMapPixel))
            // apply appropriate color
            data[i]   = objColor[0]  // red channel
            data[i+1] = objColor[1]  // green channel
            data[i+2] = objColor[2]  // blue channel
            // data[i+3] = 0          // alpha channel
          }
        }
      } else { 
        for (let i = 0; i < data.length; i += 4) {
          const segMapPixel = flatSegMap[i / 4]
          if (segMapPixel !== OBJ_MAP[segmentName]) {
            // take out non-person pixels..
            // only need to set alpha to 0 (transparent)
            data[i+3] = 0    // alpha
          }
        }
      }
      // insert colorized pixels into image
      //ctx.putImageData(imageData, 0, 0)      
      console.log(`invisible ${segmentName} saved`)
    }
    img.src = this.state.image.urls.source
    return canvas.toDataURL()
  }

  bulkUpload = async () => {  
    const bulkUploadJSON = await bulkSaveAttachments({ 
      urls : this.props.image.url, 
      name : this.props.image.name, 
      width: this.props.image.width,
      height : this.props.image.height })
    console.log(`bulk upload fired. id: ${bulkUploadJSON.id}`)
    this.props.bulkComplete()
  }

  render() {
    let previewStyle = { }
    let previewClass = `panel panel-default mainDisplay`
    if (!this.state.isLoading) {
      previewStyle = { 'display' : 'none' }
    }

    return (
       <div>
         <div className="uploadForm panel panel-default">
          <h3 className="panel-heading">Upload an image to be processed:</h3>  
          <div className="formWrapper">
            <form method="post" encType="multipart/form-data" onSubmit={ this.receiveUpload }>
              <label className="pickerLabel" htmlFor="filePicker">
                <span className="btn btn-primary formBtn filePickerBtn">Choose File</span>
              </label>
              <input id="filePicker" ref={ this.uploadRef } type="file" accept="image/*" />
              <label className="submitLabel" htmlFor="submitter">
                <span className="btn btn-primary formBtn submitBtn">Submit</span>
              </label>
              <input id="submitter" type="submit" value="Upload" />
            </form>
          </div>    
        </div>

        <canvas className={ previewClass } style={ previewStyle } ref={ this.previewRef }></canvas>
        <canvas style = {{ 'display' : 'none' }} ref={ this.editorRef } width={ this.state.image.width } height={ this.state.image.height }></canvas>
        { this.state.isLoading ? <p>LOADING...</p> : <p /> }
      </div>
    )
  }
}
