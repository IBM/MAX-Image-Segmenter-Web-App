import React, { Component } from 'react'
import * as tf from '@tensorflow/tfjs'
import { cleanTFJSResponse, OBJ_MAP, getColor, getScaledSize, isNonEmpty, loadTFJSModel } from '../utils'
import '../styles/UploadForm.css'

export default class UploadForm extends Component {
  constructor(props) {
    super(props)
    this.uploadRef = React.createRef()
  }

  receiveUpload = async () => {
    const model = await loadTFJSModel()
    const fileObj = this.uploadRef.current.files[0]
    if (fileObj) {
      const imageURL = window.URL.createObjectURL(fileObj)
      const canvas = this.props.canvas
      const ctx = canvas.getContext('2d')  
      let scaledImage = new Image()
      scaledImage.onload = async () => {
        const { scaledWidth, scaledHeight } = getScaledSize({
          height: scaledImage.naturalHeight, 
          width: scaledImage.naturalWidth
        })
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
          },
          tensor: tf.fromPixels(canvas).expandDims()
        }
        this.props.setAppPreviewImg(newImage)
        try {
          const modelOutput = model.predict(newImage.tensor)
          const MAXData = cleanTFJSResponse(newImage, 
            Array.from(modelOutput.dataSync())
          )
          const MAXImage = { 
            ...newImage, 
            foundSegments: MAXData.foundSegments 
          }
          this.mapNeededURLs({ ...newImage, ...MAXData })
          this.props.setAppImageData(MAXImage)
        } catch (e) {
          console.log(e)
          console.error('error saving MAX Image data in parent state')
          this.props.handleCrash()
        }       
      }
      scaledImage.src = imageURL
    }
  }

  mapNeededURLs = async imageObj => {
      const neededSegments = imageObj.foundSegments
      let URLMap = {}
      for (let name of neededSegments) {
        URLMap[name] = await this.invisibleSegment(name, imageObj)
      }
      return URLMap
  }

  invisibleSegment = (segmentName, imageObj) => {
    return new Promise((resolve, reject) => {
      const canvas = this.props.canvas
      const ctx = canvas.getContext('2d')
      let img = new Image()
      let imageURL
      img.onload = () => {
        try {
          const flatSegMap = imageObj.response.flatSegMap
          const { scaledWidth, scaledHeight } = getScaledSize({
            height: img.naturalHeight, 
            width: img.naturalWidth
          })
          img.width = scaledWidth
          img.height = scaledHeight
          canvas.width = scaledWidth 
          canvas.height = scaledHeight
          ctx.drawImage(img, 0, 0, img.width, img.height)
          const imageData = ctx.getImageData(0, 0, img.width, img.height)
          const data = imageData.data
          if (segmentName === 'colormap') {
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
          resolve(imageURL)
        } catch (e) {
          window.location.reload()
          reject(`${e} - image load error`)
        }
      }
      img.src = imageObj.urls.source
    })
  }

  handleFileChange = files => {
    if (files[0]) {
      this.receiveUpload()
    }
  }

  render() {
    return (
      <div className="uploadFormWrapper">
        <div className="uploadForm panel panel-default">
          <h3 className="text panel-heading">
            {isNonEmpty(this.props.studio) ? `Upload another image to be processed:` : `Upload an image to be processed:`}
          </h3>  
          <div className="formWrapper">
            <form 
              method="post" 
              encType="multipart/form-data" 
              onSubmit={ this.receiveUpload }>
              <label className="pickerLabel" htmlFor="filePicker">
                <span className="btn btn-primary formBtn filePickerBtn">
                  Select Image
                </span>
              </label>
              <input 
                id="filePicker" 
                ref={ this.uploadRef } 
                type="file" 
                onChange={ e => this.handleFileChange(e.target.files) }
                accept="image/*" />
            </form>
          </div>
        </div>
      </div>
    )
  }
}
