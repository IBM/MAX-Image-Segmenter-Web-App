import React, { Component } from 'react'
import { getPrediction, cleanMAXResponse, OBJ_MAP, getColor, MAX_SIZE } from '../../utils'
import './UploadForm.css'

const initialState = {
  isLoading: false
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
    const fileObj = this.uploadRef.current.files[0]
    const imageURL = window.URL.createObjectURL(fileObj)
    const canvas = this.editorRef.current
    const ctx = canvas.getContext('2d')  
    let scaledImage = new Image()
    scaledImage.onload = async () => {
      // scaling image.. put in function for reuse
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
      const newImage = {
        name: fileObj.name,
        type: fileObj.type,
        height: scaledHeight,
        width: scaledWidth,
        urls: { 
          source: canvas.toDataURL() 
        }
      }
      this.setState({
        isLoading: true,
        imageName: fileObj.name
      })
      this.props.setAppPreviewImg(newImage)
      try {
        console.log('sending to MAX...')
        const MAXData = cleanMAXResponse(newImage.name, await getPrediction(fileObj))
        const MAXImage = { 
          ...newImage, 
          foundSegments: MAXData.foundSegments 
        }
        this.mapNeededURLs({ ...newImage, ...MAXData })
        this.props.setAppImageData(MAXImage)
        this.setState({
          isLoading: false 
       })
      } catch (e) {
        console.error('error saving MAX Image data in parent state')
      }       
    }
    scaledImage.src = imageURL
  }

  mapNeededURLs = async imageObj => {
      const neededSegments = imageObj.foundSegments
      let URLMap = {}
      for (let name in neededSegments) {
        URLMap[neededSegments[name]] = await this.invisibleSegment(neededSegments[name], imageObj)
      }
      console.log(`URLMAP: ${Object.keys(URLMap)}`)
      return URLMap
  }

  invisibleSegment = (segmentName, imageObj) => {
    return new Promise((resolve, reject) => {
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
          scaledWidth = MAX_SIZE
          scaledHeight = Math.round(scaledWidth * ratio)
        } else {
          ratio = scaledWidth / scaledHeight
          scaledHeight = MAX_SIZE
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
          console.log(`building ${ segmentName }`)
          for (let i = 0; i < data.length; i += 4) {
            const segMapPixel = flatSegMap[i / 4]
            let objColor = [0, 0, 0]
            if (segMapPixel) {
              objColor = getColor(imageObj.response.objectIDs.indexOf(segMapPixel))
              data[i]   = objColor[0]  // red channel
              data[i+1] = objColor[1]  // green channel
              data[i+2] = objColor[2]  // blue channel
              data[i+3] = 200          // alpha
            }
          }
        } else { 
          for (let i = 0; i < data.length; i += 4) {
            const segMapPixel = flatSegMap[i / 4]
            if (segMapPixel !== OBJ_MAP[segmentName]) {
              data[i+3] = 0           // alpha
            }
          }
        }
        ctx.putImageData(imageData, 0, 0)      
        imageURL = canvas.toDataURL()
        this.props.addSegURL(segmentName, imageURL)
        console.log(`invisible ${ segmentName } saved`)
        resolve(imageURL)
      }
      try {
        img.src = imageObj.urls.source
      } catch (e) {
        reject(`image load error`)
      }
    })
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
                  { this.state.imageName }
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

        <canvas 
          ref={ this.editorRef }
          style = { { display: 'none' } }>
        </canvas>    
      </div>
    )
  }
}
