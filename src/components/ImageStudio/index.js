import './ImageStudio.css'
import React, { Component } from 'react'
import KonvaDisplay from '../KonvaDisplay'
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
    let labels = []
    for (let src in sources) {
      const source = sources[src]
      //console.log(`source image: ${source}`)
      if (isNonEmpty(source.selected)) {
        images.push({...source.segments[source.selected]})
        labels.push(source.selected)
      } 
      /*
      for (let seg of source.selected) {
        console.log(`loading ${seg} from ${source}`)
        images.push([source].segments[seg].url)
      }
      */
    }
    console.log(`total num of images: ${images.length}`)
    console.log(`concurrently loading: ${labels}`)
    return images
  }
  
  drawStudioCanvas = (imageSources) => {
    // 'load' images first, before drawing them
    const images = this.loadImages({ ...imageSources })
    console.log(images)
    const canvas = this.studioRef
    const ctx = canvas.getContext('2d')


    //const image = imageSources[img]
    //console.log(`loading ${img} from ${Object.keys(imageSources)}`)
    
    
    if (isNonEmpty(images[0])) { 
      let studioImg = []
      studioImg[0] = new Image()
      studioImg[1] = new Image()
      console.log(`seg detected `)
      studioImg[0].onload = () => {

        let { scaledWidth, scaledHeight } = getScaledSize({
          height: studioImg[0].naturalHeight, 
          width: studioImg[0].naturalWidth
        })
        studioImg[0].width = scaledWidth
        studioImg[0].height = scaledHeight
        canvas.width = scaledWidth 
        canvas.height = scaledHeight
        
        ctx.drawImage(studioImg[0], 0, 0, scaledWidth, scaledHeight)
        if (isNonEmpty(images[1])) {
          console.log(`detecting second layer to draw..`)
          studioImg[1].onload = () => {
            let { scaledWidth, scaledHeight } = getScaledSize({
              height: studioImg[1].naturalHeight, 
              width: studioImg[1].naturalWidth
            })
            studioImg[1].width = scaledWidth
            studioImg[1].height = scaledHeight
            ctx.drawImage(studioImg[1], 0, 0, scaledWidth, scaledHeight)
          }
          studioImg[1].src = images[1].url
          ctx.drawImage(studioImg[1], 0, 0, scaledWidth, scaledHeight)
        }
        

      }
      
      if (isNonEmpty(images[0])) {
        studioImg[0].src = images[0].url
        console.log(`loaded selected object (outer)`)
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
              null
          }

          { 
            this.props.images.two ? 
              this.generateStudioImage(this.props, 'two')
            : 
              null
          }
        </div>
        {
          /*
        <canvas 
          ref={ studioRef => this.studioRef = studioRef }
          className="panel panel-default studioCanvas" />
         this.renderStudioCanvas(this.props) 
         */
        }

          { this.props.images.one && this.props.images.two && this.props.images.one.selected && this.props.images.two.selected ? 
            <KonvaDisplay 
              imageURL1={this.props.images.one.segments[this.props.images.one.selected].url}
              imageURL2={this.props.images.two.segments[this.props.images.two.selected].url} />
          :
            null
          }

      </div>
    )
  }
}