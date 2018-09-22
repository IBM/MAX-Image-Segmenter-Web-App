import '../styles/TextOutput.css'
import React from 'react'

const TextOutputLeft = props => {
  return (
    <div className ="textBox panel panel-default">
      <p> 
        {`Click `} 
        <a className="maxLabel" onClick={ () => props.setSelectedObject('source') }>
          {` here `}
        </a> 
        {` to view the 'input' `} 
        <b>{props.image.name},</b> 
      </p>
      <p>
        {`or `} 
        <a className='maxLabel' onClick={ () => props.setSelectedObject('colormap') }>
          { ` here ` }
        </a>
        { ` to view the MAX-generated `} <b>colormap.</b>  
      </p>
      <p className="outputStudioText">
        To make new images from the objects you've uploaded, 
        click the image thumbnails below and load them into the Studio.
      </p>
    </div>
  )
}

export default TextOutputLeft
