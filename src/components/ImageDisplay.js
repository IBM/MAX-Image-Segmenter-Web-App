import '../styles/ImageDisplay.css'
import React from 'react'
import { isNonEmpty } from '../utils'

const ImageDisplay = props => {
  if (isNonEmpty(props.previewImg)) {
    return (
      <div>
        <img 
          className="panel panel-default mainDisplay"
          alt={ props.previewImg.name } 
          src={ props.previewImg.urls.source } />
      </div>
    )
  } else if (isNonEmpty(props.image)) {
    return (
      <div>
        <img 
          className="panel panel-default mainDisplay"
          alt={ props.image.name } 
          src={ props.image.urls[props.selectedObject] } />
      </div>
    )  
  } else {
    return (
      <span />
    )
  }
}

export default ImageDisplay