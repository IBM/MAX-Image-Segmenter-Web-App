import './ImageStudio.css'
import React from 'react'
import { getFormattedName } from '../../utils'

const generateStudioImage = (image, num) => {
  return (
    <div className={`studioImage ${ num }`}>
      <h3>
        { getFormattedName(image) }
      </h3>
      <img 
        className="studioImage"
        src={ image.segments.source.url }
        alt={ image.id }
      />
    </div> 
  )
}


const ImageStudio = props => {

  return (
    <div className="panel panel-default imageStudioContainer">
      <h2 className="studioTitle panel panel-heading">MAX Image Studio</h2>
      <div className="sourceImageContainer">
        { 
          props.images.one ? 
            generateStudioImage(props.images.one, 'one')
          : 
            <span /> 
        }

        { 
          props.images.two ? 
          generateStudioImage(props.images.two, 'two')
          : 
            <span /> 
        }
      </div>
      <div className="panel panel-default studioCanvas">
        big ol canvas
      </div>
    </div>
  )
}

export default ImageStudio
