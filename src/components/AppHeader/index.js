import './AppHeader.css'
import React from 'react'
import logo from './codait-logo.png'

const AppHeader = props => {
  const modelName = props.modelType === 'mobile' ? 'MobileNet v2 Model' : 'Full Deeplab v3 Model'  
  return (
    <div>
      <div className="title-banner">
      <img className="logoImg" src={ logo } alt="logo" />
        <span>
         <u><b>MAX</b> Image Segmenter</u> -  Magic Cropping Tool
        </span>
      </div>
      <hr/>
      <div className="model-select panel panel-default">
        <span className="text panel-heading">Model Select:</span>
        
        <label className="switch">
          <input 
            type="checkbox" 
            checked={ props.modelType === 'full' }
            onClick={ props.toggleFunc } 
          />
          <span className="slider round"></span>
        </label>
        <h5 className="model-select-label">{modelName}</h5>

      </div>
    </div>
  )
}

export default AppHeader