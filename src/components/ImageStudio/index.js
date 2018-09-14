import './ImageStudio.css'
import React, { Component } from 'react'
import { getFormattedName, isNonEmpty, getScaledSize } from '../../utils'

export default class ImageStudio extends Component {
  constructor(props) {
    super(props)
    this.studioRef = React.createRef()
  }

  generateStudioImage = (props, num) => {
    const image = this.props.images[num]
    return (
      <div className={`panel panel-default studioImage ${ num }`}>
        <h3 className='studioImageTitle'>
          { getFormattedName(image) }
        </h3>
        <img 
          className="studioImageThumb"
          src={ image.segments.source.url }
          alt={ image.id }
        />
        <div className="ObjBtnContainer">
          { Object.keys(image.segments).map(seg => {
            let buttonStyle = `studioObjBtn`
            if (image.selected === seg) {
              buttonStyle = `studioObjBtnActive`
            }
            return (
              <button 
                key={seg}
                className={`${buttonStyle} btn`}
                onClick={ () => this.handleObjectClick(props, {num, seg})}>
                {seg}
              </button>
            ) }) 
          }
        </div>
      </div> 
    )
  }
  
  handleObjectClick = (props, {num, seg}) => {
    if (seg !== props.images[num].selected) {
      props.setStudioSegment({num, seg})
    } else {
      props.setStudioSegment({num, seg: ''})
    }
  }

  loadImages = (sources) => {
    let images = []
    for (let source in sources) {
      console.log(source)
      if (isNonEmpty(source.selected)) {
        for (let seg of source.selected) {
          console.log(`loading ${seg} from ${source}`)
          images.push([source].segments[seg].url)
        }  
      }
      /*
      for (let seg of source.selected) {
        console.log(`loading ${seg} from ${source}`)
        images.push([source].segments[seg].url)
      }
      */
    }
    console.log(images)
    // draw them here?
  }
  
  drawStudioCanvas = (imageSources) => {
    // 'load' images first, before drawing them
    

    const canvas = this.studioRef
    const ctx = canvas.getContext('2d')
    let studioImg = new Image()

    for (let img in imageSources) {
      const image = imageSources[img]
      console.log(Object.keys(image))
      
      //this.loadImages({ image })
      if (isNonEmpty(image)) { 
        studioImg.onload = () => {
          console.log(`LOADED studio image: ${image.selected}`)
          const { scaledWidth, scaledHeight } = getScaledSize({
            height: studioImg.naturalHeight, 
            width: studioImg.naturalWidth
          })
          studioImg.width = scaledWidth
          studioImg.height = scaledHeight
          canvas.width = scaledWidth 
          canvas.height = scaledHeight
          ctx.drawImage(studioImg, 0, 0, scaledWidth, scaledHeight)
        }
        
        if (isNonEmpty(image.segments[image.selected]))
          studioImg.src = image.segments[image.selected].url
        
      }
    }

    /*
    if (isNonEmpty(one)) { 
      studioImg.onload = () => {
        console.log(`LOADED studio image: ${one.selected}`)
        const { scaledWidth, scaledHeight } = getScaledSize({
          height: studioImg.naturalHeight, 
          width: studioImg.naturalWidth
        })
        studioImg.width = scaledWidth
        studioImg.height = scaledHeight
        canvas.width = scaledWidth 
        canvas.height = scaledHeight
        ctx.drawImage(studioImg, 0, 0, scaledWidth, scaledHeight)
      }
      if (isNonEmpty(one.segments[one.selected]))
        studioImg.src = one.segments[one.selected].url
  
    }
    if (isNonEmpty(two)) {
      studioImg.onload = () => {
        console.log(`LOADED studio image: ${two.selected}`)
        const { scaledWidth, scaledHeight } = getScaledSize({
          height: studioImg.naturalHeight, 
          width: studioImg.naturalWidth
        })
        studioImg.width = scaledWidth
        studioImg.height = scaledHeight
        canvas.width = scaledWidth 
        canvas.height = scaledHeight
        ctx.drawImage(studioImg, 0, 0, scaledWidth, scaledHeight)
      }
      if (isNonEmpty(two.segments[two.selected]))
        studioImg.src = two.segments[two.selected].url
    }
    */

    // 'draw' the array of loadedimages once it has been populated
    // from both sources


  }
  
  renderStudioCanvas = props => {
    if ((isNonEmpty(props.images.one) && isNonEmpty(props.images.one.segments)) 
      || (isNonEmpty(props.images.two) && isNonEmpty(props.images.two.segments))) {
      
      // in here, we have at least one segment to put in the canvas
      this.drawStudioCanvas(props.images)
    }
  }

  render() {
    return (
      <div className="panel panel-default imageStudioContainer">
        <h2 className="studioTitle panel panel-heading">MAX Image Studio</h2>
        <div className="sourceImageContainer">
          { 
            this.props.images.one ? 
              this.generateStudioImage(this.props, 'one')
            : 
              <span /> 
          }

          { 
            this.props.images.two ? 
              this.generateStudioImage(this.props, 'two')
            : 
              <span /> 
          }
        </div>
        <canvas 
          ref={ studioRef => this.studioRef = studioRef }
          className="panel panel-default studioCanvas" />
        { this.renderStudioCanvas(this.props) }
      </div>
    )
  }
}