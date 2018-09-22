import React from 'react'
import { getFormattedName } from './utils' 

const CarouselThumb = props => {
  const image = props.image
  const thumbProps = props.thumbProps
  if (image.id === 'CLICK TO ADD AN IMAGE') {
    return (
      <div 
        key={ image.id } 
        className={ applyImageClass(thumbProps, image.id) }
        onMouseEnter={ () => thumbProps.setHoverImage(image.id) } 
        onMouseLeave={ () => thumbProps.setHoverImage('') }
        onClick={ () => handleImageClick(thumbProps, image.id) }>
          
          <span 
            className="imageLabel top"
            >
            <span className="imageTitle">
              { getFormattedName(image) }
            </span>
          </span>
   
          <div
            className="thumbCircle"
            alt={ image.id }>
            <p>{`+`}</p>
          </div>

          { image.id !== thumbProps.selectedImage ?
            <span 
              className="imageLabel bottom">
              { ` ` }
            </span>
            :
            null
          }
      </div>
    )
  } else if (image.id === 'ERASE ALL IMAGES') {
    return (
      <div 
        key={ image.id } 
        className={ applyImageClass(thumbProps, image.id) }
        onMouseEnter={ () => thumbProps.setHoverImage(image.id) } 
        onMouseLeave={ () => thumbProps.setHoverImage('') }
        onClick={ () => handleImageClick(thumbProps, image.id) }>
          
          <span 
            className="imageLabel top"
            >
            <span className="imageTitle">
              { getFormattedName(image) }
            </span>
          </span>
   
          <div
            className="thumbCircle eraser"
            alt={ image.id }>
            <p>{`-`}</p>
          </div>

          { image.id !== thumbProps.selectedImage ?
            <span 
              className="imageLabel bottom">
              { ` ` }
            </span>
            :
            null
          }
      </div>
    )
  } else {
    return (
      <div 
        key={ image.id } 
        className={ applyImageClass(thumbProps, image.id) }
        onMouseEnter={ () => thumbProps.setHoverImage(image.id) } 
        onMouseLeave={ () => thumbProps.setHoverImage('') }>

          <span 
            className="imageLabel top"
            onClick={ () => handleImageClick(thumbProps, image.id) }>
            <span className="imageTitle">
              { getFormattedName(image) }
            </span>
          </span>
  
          { displaySelectControls(thumbProps, image) }
          <img
            className="thumbImage"
            src={ getThumbSource(thumbProps, image) }
            alt={ image.id } 
            onClick={ () => handleImageClick(thumbProps, image.id) }
            />
  
          { image.id !== thumbProps.selectedImage ?
            <span 
              className="imageLabel bottom"
              onClick={ () => handleImageClick(thumbProps, image.id) }>
              { ` ${ Object.keys(image.segments).length-2 } segments` }
            </span>
            :
            null
          }
      </div>
    )
  }  
}
export default CarouselThumb

const getThumbSource = (props, image) => {
  if (props.hoverImage === image.id || props.selectedImage === image.id) {
    return image.segments.source.url
  } else {
    return image.segments.colormap.url
  }
}

const displaySelectControls = (props, image) => {
  if (props.selectedImage === image.id) {
    return (
      <div className="controlPanel">
        <a onClick={ () => props.deleteImage(image) }>
          Delete 
        </a>
        <a onClick={ () => props.loadIntoStudio(image, 'one') }>
          Load BG 
        </a>
        <a onClick={ () => props.loadIntoStudio(image, 'two') }>
          Load Front
        </a>
      </div>
    )
  }
}

const handleImageClick = (props, imageID) => {
  if (imageID !== props.selectedImage) {
    props.setSelectedImage(imageID)
  } else {
    props.setSelectedImage('')
  }
}

const applyImageClass = (props, imageID) => {
  if (imageID !== 'CLICK TO ADD AN IMAGE' && imageID === props.selectedImage) {
    return `selectedImageThumb`
  } else if (imageID === 'CLICK TO ADD AN IMAGE' && props.uploadMode) { 
    return `selectedImageThumb`
  } else {
    return `savedImageThumb`
  }
}