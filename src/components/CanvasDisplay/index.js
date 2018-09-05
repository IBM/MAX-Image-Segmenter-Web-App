import './CanvasDisplay.css'
import React, { Component } from 'react'
import { OBJ_MAP, COLOR_LIST, COLOR_MAP, bulkSaveAttachments } from '../../utils'

export default class CanvasDisplay extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
    this.textRef = React.createRef()
    this.editorRef = React.createRef()
    this.state = {
      'selectedObject' : '' 
    }
  }

  componentDidMount() {
    this.drawSegments()
  }

  componentDidUpdate() {
    this.drawSegments()
  }

  invisibleSegment = segmentName => {
    let canvas = this.editorRef.current
    const imgHeight = this.props.segData.size.height
    const imgWidth = this.props.segData.size.width
    const flatSegMap = this.props.segData.flatSegMap
    let img = new Image()
    let dataURL

    img.onload = () => {
      const ctx = canvas.getContext('2d')
      img.width = imgWidth
      img.height = imgHeight
      ctx.drawImage(img, 0, 0, img.width, img.height)
      const imageData = ctx.getImageData(0, 0, img.width, img.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        const segMapPixel = flatSegMap[i / 4]
        if (segMapPixel !== OBJ_MAP[segmentName]) {
          // take out non-person pixels..
          // only need to set alpha to 0 (transparent)
          data[i+3] = 0    // alpha
        }
      }
      ctx.putImageData(imageData, 0, 0)      
      dataURL = canvas.toDataURL()
      this.props.addNewURL(segmentName, dataURL)
      console.log(`invisible ${segmentName} saved`)
    }
    img.src = this.props.image.url.source
  }

  drawSegments = () => {
    let canvas = this.canvasRef.current
    const imgHeight = this.props.segData.size.height
    const imgWidth = this.props.segData.size.width
    const flatSegMap = this.props.segData.flatSegMap
    let img = new Image()

    img.onload = async () => {
      const ctx = canvas.getContext('2d')
      img.width = imgWidth
      img.height = imgHeight
      ctx.drawImage(img, 0, 0, img.width, img.height)
      const imageData = ctx.getImageData(0, 0, img.width, img.height)
      const data = imageData.data
      if (this.state.selectedObject === '') {
        for (let i = 0; i < data.length; i += 4) {
          const segMapPixel = flatSegMap[i / 4]
          let objColor = [0, 0, 0]
          if (segMapPixel) {
            objColor = COLOR_LIST[this.props.segData.objectIDs.indexOf(segMapPixel) - 1]
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
          if (segMapPixel !== OBJ_MAP[this.state.selectedObject]) {
            // take out non-person pixels..
            // only need to set alpha to 0 (transparent)
            data[i+3] = 0    // alpha
          }
        }
      }
      // insert colorized pixels into image
      ctx.putImageData(imageData, 0, 0)
      
      // this keeps the canvas from saving infinite 'colorSegment' images
      if (this.state.selectedObject === '' && this.props.image.savedSegments.indexOf('color') === -1) {
        //console.log(`saved segments: ${this.props.image.savedSegments}`)
        try {
          const dataURL = canvas.toDataURL()
          console.log('saving "color" here...')
          this.props.addSavedSegment('color')
          this.props.addNewURL('color', dataURL)
          const neededSegments = this.props.image.foundSegments.filter( seg => this.props.image.savedSegments.indexOf(seg) < 0)
          // new segment function
          for (let seg in neededSegments) {
            this.invisibleSegment(neededSegments[seg])
            console.log(`${neededSegments[seg]}: added?`)
          }
        } catch (e) {
          console.error('error saving color segments in Cloudant.')
        }
      }
    }
    img.src = this.props.image.url.source
  }

  getObjLabel = (objType) => {
    const pixelMap = this.props.segData.objectPixels
    const objects = Object.keys(pixelMap)
    let labelTail
    objects.indexOf(objType) !== objects.length-1 ? labelTail = `, ` : labelTail = ``
    
    return (
    <span 
      key={ objType }  
      onClick={ () => this.selectObject(objType) }
      style={ {
        'fontSize' : '1.3em',
        'display' : 'inline-block',
        'cursor' : 'pointer'
      } }
    >
      <span
        className='objLabel'
        style={ { 
          'marginLeft' : '5px',
          'display' : 'inline-block',
          'textDecoration' : 'underline', 
          'color' : 
            objType === 'background' ? 
              'inherit' : Object.keys(COLOR_MAP)[objects.indexOf(objType) - 1] 
        } }
      >
        { `${objType}${labelTail}` }
      </span>
      
    </span>)
  }

  selectObject = objType => {
    this.setState({
      'selectedObject' : objType
    })
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
    const pixelMap = this.props.segData.objectPixels
    const name = this.props.image.name
    const width = this.props.image.width
    const height = this.props.image.height
    
    // initiate bulk segment upload - NOW THAT ALL DATA URLS SHOULD BE IN STATE 
    if (Object.keys(this.props.image.url).length === this.props.image.foundSegments.length + 2 && !this.props.bulkStatus) {
      this.bulkUpload()
    }

    return (
      <div>
        <canvas className="mainDisplay" ref={ this.canvasRef } width={ width } height={ height }></canvas>
        { this.props.segData ? 
        <div>
          <div className='textBox' ref={ this.textRef }>
          <p>
            {`Resized '${ name }' to ${ width }x${ height } and identified ${ this.props.image.foundSegments.length } object segments.`}
          </p>
          <p>
            { `Select from the following to labels to view the  ` }
            <b className='maxLabel' onClick={ () => this.selectObject('') }>
              full Image Segmenter color map
            </b> 
            {` or the objects:`}{Object.keys(pixelMap).map(objType => this.getObjLabel(objType)) }.
          </p>
          </div>
        </div> : <p /> }
        <canvas style = {{ 'display' : 'none' }} ref={ this.editorRef } width={ width } height={ height }></canvas>
      </div>
    )
  }
}
