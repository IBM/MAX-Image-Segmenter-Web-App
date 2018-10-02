import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import { getFormattedName } from '../utils' 
import '../styles/CarouselThumb.css'

const CarouselThumb = props => {
  const image = props.image
  const thumbProps = props.thumbProps
  if (image.id === 'ADD AN IMAGE') {
    return (
      <div 
        key={ image.id } 
        className={ applyImageClass(thumbProps, image.id) }
        onMouseEnter={ () => thumbProps.setHoverImage(image.id) } 
        onMouseLeave={ () => thumbProps.setHoverImage('') }
        onClick={ () => handleImageClick(thumbProps, image.id) }>
          <span className="imageLabel top">
            <span className="imageTitle">
              { getFormattedName(image) }
            </span>
          </span>
          <Glyphicon 
            className="imageGlyph add"
            glyph="plus-sign" 
            alt={ image.id } />
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
          <span className="imageLabel top">
            <span className="imageTitle">
              { getFormattedName(image) }
            </span>
          </span>
          <Glyphicon 
            className="imageGlyph erase"
            glyph="remove-sign" 
            alt={ image.id } />
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
          onClick={ () => handleImageClick(thumbProps, image.id) } />
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
        <a className="cpbtn delete" onClick={ () => props.deleteImage(image) }>
        <Glyphicon glyph="trash" /> 
        </a>
        <a className="cpbtn studio" onClick={ () => props.loadIntoStudio(image, 'one') }>
        Studio <Glyphicon glyph="arrow-left" /> 
        </a>
        <a className="cpbtn studio" onClick={ () => props.loadIntoStudio(image, 'two') }>
        Studio <Glyphicon glyph="arrow-right" /> 
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
  if (imageID !== 'ADD AN IMAGE' && imageID === props.selectedImage) {
    return `selectedImageThumb`
  } else if (imageID === 'ADD AN IMAGE' && props.mode === 'upload') { 
    return `selectedImageThumb`
  } else {
    return `savedImageThumb`
  }
}