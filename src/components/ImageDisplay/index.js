import './ImageDisplay.css'
import React from 'react'
import TextOutput from '../TextOutput'

const ImageDisplay = props => {
  if (props.previewImg) {
    return (
      <div>
        <div className="panel panel-default mainDisplay">
          <img alt={ props.previewImg.name } src={ props.previewImg.urls.source } width={ props.previewImg.width } height={ props.previewImg.height }/>
        </div>
        { renderLoadingMsg() }
      </div>
    )
  } else {
    return (
      <div>
        <div className="panel panel-default mainDisplay">
          <img alt={ props.image.name } src={ props.image.urls[props.selectedObject] } />
        </div>
        <TextOutput 
          image={ props.image }
          selectObject={ props.setSelectedObject }
          segData={ props.image.response }
        />
      </div>
    )  
  }
}

const renderLoadingMsg = () => {
  return (
    <p>LOADING...</p>
  )
}

export default ImageDisplay