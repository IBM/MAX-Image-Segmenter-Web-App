import './FileGallery.css'
import React from 'react'
import { getFormattedName } from '../../utils'

const FileGallery = props => {
  return (
    <div>
      { props.expanded ? 
      <div className="panel panel-default fileGalleryContainer">
        { getToggleText(props) }
        <div className="galleryBox">
          <div className="imageGallery">
            { generateImageComponent(props) }
          </div>
          <div className="panel panel-default deleteBox">
            <div className="panel-heading">
              <span>
                { `Click the button below to ERASE all images from local storage.` }
              </span>
            </div>
            <button 
              className="btn btn-danger deleteBtn"
              onClick={ () => props.bulkDelete() }>
              Delete Saved Images
            </button>
          </div>
        </div>
        </div>
      : 
        <div className="panel-default openLabelContainer">
        { getToggleText(props) }
        </div>
      }
    </div>
  )
}

const getToggleText = props => {
  let imageLabel = (
    <p className="panel panel-heading openLabel" onClick={ props.toggleExpand }>
      { `+ Click here to view your saved images in PouchDB.` }
    </p>
  )
  if (props.expanded) {
    if (props.selectedImage) {
      imageLabel = (
      <div 
        className="closePanel panel panel-heading"
        onClick={ props.toggleExpand }>
        <p className="closeLabel">
          { `- Click here to hide locally saved images.` }
        </p>
        <p className="imageSelectLabel">
          { `Choose from the available options for this image, or choose another from the gallery.` }
        </p>
      </div>
      )
    } else {
      imageLabel = (
        <div 
          className="closePanel panel panel-heading"
          onClick={ props.toggleExpand }>
          <p className="closeLabel">
            { `- Click here to hide locally saved images.` }
          </p>
          <p className="imageSelectLabel">
            { `Click on an image to view avilable options.` }
          </p>
        </div>
      )
    }
  }
  return imageLabel
}

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
          delete 
        </a>
        <a onClick={ () => props.downloadSegments(image) }>
          download 
        </a>
        <a onClick={ () => props.loadIntoStudio(image, 'one') }>
          load#1 
        </a>
        <a onClick={ () => props.loadIntoStudio(image, 'two') }>
          load#2
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
  if (imageID === props.selectedImage) {
    return `selectedImageThumb`
  } else {
    return `savedImageThumb`
  }
}

const generateImageComponent = props => {
  const images = props.savedImages
  return images.map(
    image => {
      return (
        <div 
          key={ image.id } 
          className={ applyImageClass(props, image.id) }
          onMouseEnter={ () => props.setHoverImage(image.id) } 
          onMouseLeave={ () => props.setHoverImage('') }>
            
            <span 
              className="imageLabel top"
              onClick={ () => handleImageClick(props, image.id) }>
              <span className="imageTitle">
                { getFormattedName(image) }
              </span>
            </span>

            { displaySelectControls(props, image) }

            <img
              className="thumbImage"
              src={ getThumbSource(props, image) }
              alt={ image.id } 
              onClick={ () => handleImageClick(props, image.id) }
              />

            { image.id !== props.selectedImage ?
              <span 
                className="imageLabel bottom"
                onClick={ () => handleImageClick(props, image.id) }>
                { ` ${ Object.keys(image.segments).length-2 } segments` }
              </span>
              :
              <span />
            }
          </div>
      )
    }
  )
}

export default FileGallery