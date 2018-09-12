import React, { Component } from 'react'
import { getPrediction, parseMAXData, OBJ_MAP, getColor } from '../../utils'
import './UploadForm.css'

const initialState = {
  'isLoading' : false
}

export default class UploadForm extends Component {
  constructor(props) {
    super(props)
    this.uploadRef = React.createRef()
    this.editorRef = React.createRef()
    this.state = initialState
  }

  receiveUpload = e => {
    e.preventDefault()
    
    // this can eventually be brought out as an ENV var..
    // but it must match the size of the output from MAX model
    const MAX_SIZE = 513
    // Image taken from input Form
    const fileObj = this.uploadRef.current.files[0]
    const imageURL = window.URL.createObjectURL(fileObj)

    const canvas = this.editorRef.current
    const ctx = canvas.getContext('2d')  
    this.setState({
      'image' : {
        'name' : fileObj.name,
        'url' : imageURL        
      },
      'isLoading' : 'true'
    })
    let imageObj = {} // alternative to internal component state.. may switch back
    let scaledImage = new Image()
    // drawing the pre-MAX preview image
    scaledImage.onload = async () => {
      // scaling image.. put in function for reuse?
      let scaledWidth = scaledImage.naturalWidth
      let scaledHeight = scaledImage.naturalHeight
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
      
      // building image object to send to MAX
      imageObj = {
        'name' : fileObj.name,
        'type' : fileObj.type,
        'height' : scaledHeight,
        'width' : scaledWidth,
        'urls' : { 'source' : canvas.toDataURL() }
      }
      this.props.setPreviewImg(imageObj)
      console.log('sending to MAX...')
      try {
        const cleanJSON = parseMAXData(imageObj.name, await getPrediction(this.props.modelType, fileObj))
        // add MAX response to image object
        imageObj = {
          ...imageObj,
          'foundSegments' : cleanJSON.objectTypes.concat('colormap'),
          'response' : cleanJSON
        }
      } catch (e) {
        console.error('error getting prediction from MAX Model.')
      }
      try {
        // build/add additional segment images and colormap to image object
        let dataURLs = { ...this.mapNeededURLs(imageObj), source: imageObj.urls.source }
        //dataURLs = {...dataURLs, source: imageObj.urls.source}
        const currentImage = { ...imageObj, urls: dataURLs }
        //console.log(`current image: ${Object.keys(currentImage)}`)
        //console.log(`dataURLs needs to be legit here - colormap: ${JSON.stringify(dataURLs.colormap)}`)
        this.props.setAppImageData(currentImage)
        
        this.setState({
          'isLoading': false 
       })
      } catch (e) {
        console.error('error saving urls in parent state')
      }       
    }
      scaledImage.src = imageURL
  }

  mapNeededURLs = imageObj => {
    const neededSegments = imageObj.foundSegments
    //console.log(neededSegments)
    let URLMap = {}
    for (let name in neededSegments) {
      //console.log(neededSegments[name])
      this.invisibleSegment(URLMap, neededSegments[name], imageObj)
    }
    //console.log(`URLMAP: ${Object.keys(URLMap)}`)
    return URLMap
  }

  invisibleSegment = (URLMap, segmentName, imageObj) => {
    //console.log('invisiblesegments')
    let canvas = this.editorRef.current
    const ctx = canvas.getContext('2d')
    let img = new Image()
    let imageURL

    img.onload = () => {
      const flatSegMap = imageObj.response.flatSegMap
      let scaledWidth = img.naturalWidth
      let scaledHeight = img.naturalHeight
      let ratio

      if (scaledWidth > scaledHeight) {
        ratio = scaledHeight / scaledWidth
        scaledWidth = 513
        scaledHeight = Math.round(scaledWidth * ratio)
      } else {
        ratio = scaledWidth / scaledHeight
        scaledHeight = 513
        scaledWidth = Math.round(scaledHeight * ratio)
      }
      img.width = scaledWidth
      img.height = scaledHeight
      canvas.width = scaledWidth 
      canvas.height = scaledHeight 


      ctx.drawImage(img, 0, 0, img.width, img.height)
      const imageData = ctx.getImageData(0, 0, img.width, img.height)
      const data = imageData.data

      if (segmentName === 'colormap') {
        console.log(`building ${segmentName}`)
        for (let i = 0; i < data.length; i += 4) {
          const segMapPixel = flatSegMap[i / 4]
          let objColor = [0, 0, 0]
          if (segMapPixel) {
            objColor = getColor(imageObj.response.objectIDs.indexOf(segMapPixel))
            // apply appropriate color
            data[i]   = objColor[0]  // red channel
            data[i+1] = objColor[1]  // green channel
            data[i+2] = objColor[2]  // blue channel
          }
        }
      } else { 
        for (let i = 0; i < data.length; i += 4) {
          const segMapPixel = flatSegMap[i / 4]
          if (segMapPixel !== OBJ_MAP[segmentName]) {
            data[i+3] = 0    // alpha
          }
        }
      }
      // insert colorized pixels into image
      ctx.putImageData(imageData, 0, 0)      
      //console.log(`${canvas.toDataURL()}`)
      imageURL = canvas.toDataURL()
      this.setImageURL(URLMap, segmentName, imageURL)
      console.log(`invisible ${segmentName} saved`)
    }
    img.src = imageObj.urls.source
  }

  setImageURL = (URLMap, segmentName, imageURL) => {
    URLMap[segmentName] = imageURL
    this.props.addSegURL(segmentName, imageURL)
  }

  render() {
    return (
       <div className="uploadWrapper">
        <div className="uploadForm panel panel-default">
          <h3 className="text panel-heading">
            Upload an image to be processed:
          </h3>  
          <div className="formWrapper">
            <form 
              method="post" 
              encType="multipart/form-data" 
              onSubmit={ this.receiveUpload }>
              
              <label className="pickerLabel" htmlFor="filePicker">
                <span className="btn btn-primary formBtn filePickerBtn">
                  Choose File
                </span>
              </label>
              <span>
                <p>
                  { this.state.image ? this.state.image.name : `` }
                </p>
              </span>
              <input 
                id="filePicker" 
                ref={ this.uploadRef } 
                type="file" 
                accept="image/*" />

              <label className="submitLabel" htmlFor="submitter">
                <span className="btn btn-primary formBtn submitBtn">
                  Submit
                </span>
              </label>
              <input 
                id="submitter" 
                type="submit" 
                value="Upload" />
            </form>
          </div>
        </div>

        <canvas style = {{ 'display' : 'none' }} ref={ this.editorRef }></canvas>    
      </div>
    )
  }
}
