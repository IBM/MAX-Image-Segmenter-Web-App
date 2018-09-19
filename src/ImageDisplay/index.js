import './ImageDisplay.css'
import React from 'react'
import TextOutput from '../TextOutput'
import { isNonEmpty } from '../utils';

const ImageDisplay = props => {
  if (isNonEmpty(props.previewImg)) {
    return (
      <div>
        { renderLoadingMsg() }
        <div className="panel panel-default mainDisplay">
          <img 
            alt={ props.previewImg.name } 
            src={ props.previewImg.urls.source } 
            width={ props.previewImg.width } 
            height={ props.previewImg.height } />
        </div>
      </div>
    )
  } else if (isNonEmpty(props.image)) {
    return (
      <div>
        <TextOutput 
          image={ props.image }
          selectObject={ props.setSelectedObject }
          segData={ props.image.response } />
        <div className="panel panel-default mainDisplay">
          <img 
            alt={ props.image.name } 
            src={ props.image.urls[props.selectedObject] } />
        </div>
      </div>
    )  
  } else {
    return (
      <span />
    )
  }
}

const renderLoadingMsg = () => {
  return (
    <p style={{margin: '2% auto 0 auto', height: '120px', border: '1px solid #ddd'}}>LOADING...</p>
  )
}

export default ImageDisplay