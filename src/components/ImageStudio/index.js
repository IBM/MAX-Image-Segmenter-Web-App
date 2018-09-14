import './ImageStudio.css'
import React from 'react'
import { getFormattedName } from '../../utils'

const generateStudioImage = (props, num) => {
  const image = props.images[num]
  return (
    <div className={`panel panel-default studioImage ${ num }`}>
      <h3 className='studioImageTitle'>
        { getFormattedName(image) }
      </h3>
      <img 
        className="studioImageThumb"
        src={ image.segments.source.url }
        alt={ image.id }
      />
      <div className="ObjBtnContainer">
        { Object.keys(image.segments).map(seg => {
          let buttonStyle = `studioObjBtn`
          if (image.selected === seg) {
            buttonStyle = `studioObjBtnActive`
          }
          return (
            <button 
              key={seg}
              className={`${buttonStyle} btn`}
              onClick={ () => props.setStudioSegment({num, seg})}>
              {seg}
            </button>
          ) }) 
        }
      </div>
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
            generateStudioImage(props, 'one')
          : 
            <span /> 
        }

        { 
          props.images.two ? 
            generateStudioImage(props, 'two')
          : 
            <span /> 
        }
      </div>
      <canvas className="panel panel-default studioCanvas">
        big ol canvas
      </canvas>
    </div>
  )
}

export default ImageStudio
