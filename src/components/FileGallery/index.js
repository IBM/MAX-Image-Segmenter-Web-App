import './FileGallery.css'
import React from 'react'
import { deleteLocalImages, downloadSegments } from '../../utils'
 
const FileGallery = props => {
  return (
    <div className="fileGalleryContainer" >
      { getToggleText(props) }
      { props.expanded ? 
        <div className="galleryBox">
          <div className="imageGallery">
            { generateDocComponent(props) }
          </div>
          <div className="panel panel-default deleteBox">
            <div className="panel-heading">
              <p>
                { `Click the button below to ERASE all images from local storage.` }
              </p>
            </div>
            <button 
              className="btn btn-danger deleteBtn"
              onClick={ () => deleteLocalImages(props.toggleExpand) }>
              Delete Saved Images
            </button>
          </div>
        </div>
            : 
        <p /> 
      }
    </div>
  )
}

const getToggleText = props => {
  let label = (
    <p className="openLabel" onClick={ props.toggleExpand }>
      { `+ Click here to view your saved images in PouchDB.` }
    </p>
  )
  if (props.expanded) {
    label = (
      <div>
        <p className="closeLabel" onClick={ props.toggleExpand }>
          { `- Click here to hide locally saved images.` }
        </p>
        <p className="downloadLabel">
          { `Click on an image to view avilable options.` }
        </p>
      </div>
    )
  }
  return label
}

const getThumbSource = (hoverDoc, doc) => {
  if (hoverDoc === doc.id) {
    return doc.segments.source.url
  } else {
    return doc.segments.colormap.url
  }
}

const displaySelectControls = (props, doc) => {
  if (props.selectedImage === doc.id) {
    return (
      <div className="controlPanel">
        <a>delete </a>
        <a onClick={ () => downloadSegments(doc) }>download </a>
        <a>load#1 </a>
        <a>load#2</a>
      </div>
    )
  }
}

const handleImageClick = (props, docID) => {
  if (docID !== props.selectedImage) {
    props.setSelectedImage(docID)
  } else {
    props.setSelectedImage('')
  }
}

const applyImageClass = (props, docID) => {
  if (docID === props.selectedImage) {
    return `selectedImageThumb`
  } else {
    return `savedImageThumb`
  }
}

const generateDocComponent = props => {
  // should check to see if the doc is currently selected,
  // and if so, apply hover styles regardless of hover
  
  // also, should apply the onClick function to only certain elements, 
  // so clicking in the control panel won't close it
  const docs = props.savedImages
  return docs.map(
    doc => {
      return (
        <div 
          key={doc.id} 
          className={ applyImageClass(props, doc.id) }
          onMouseEnter={ () => props.setHoverImage(doc.id) } 
          onMouseLeave={ () => props.setHoverImage('') } 
          onClick={ () => handleImageClick(props, doc.id) }>
            
            <p className="imageLabel top">
              <span className="imageTitle">
                { doc.id.split('-')[1] }
              </span>
            </p>

            { displaySelectControls(props, doc) }

            <img
              className="thumbImage"
              src={ getThumbSource(props.hoverImage, doc) }
              alt={ doc.id } 
              />

            { doc.id !== props.selectedImage ?
              <p className="imageLabel bottom">
                { ` ${ Object.keys(doc.segments).length-2 } segments` }
              </p>
              :
              <span />
            }


          </div>
      )
    }
  )
}

export default FileGallery