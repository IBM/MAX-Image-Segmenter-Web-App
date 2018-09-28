import React from 'react'
import '../styles/ImageDisplay.css'

const ImageDisplay = props => (
  <div>
    <img 
      className="panel panel-default mainDisplay"
      alt={ props.previewImg.name } 
      src={ props.previewImg.urls.source } />
  </div>
)

export default ImageDisplay