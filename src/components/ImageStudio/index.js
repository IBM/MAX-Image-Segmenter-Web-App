import './ImageStudio.css'
import React from 'react'
import { getFormattedName, isNonEmpty } from '../../utils'

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
              onClick={ () => handleObjectClick(props, {num, seg})}>
              {seg}
            </button>
          ) }) 
        }
      </div>
    </div> 
  )
}

const handleObjectClick = (props, {num, seg}) => {
  if (seg !== props.images[num].selected) {
    props.setStudioSegment({num, seg})
  } else {
    props.setStudioSegment({num, seg: ''})
  }
}

const renderStudioCanvas = props => {
  if (isNonEmpty(props.images.one) && isNonEmpty(props.images.one.segments)) {
    return(
      <canvas className="panel panel-default studioCanvas" />
    )
  } else {
    return (
      <span />
    )
  }
  
  
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

      {/* check if there are selections populated in the studio props */ }
      {/* check if there are selections populated in the studio props */ }
      { renderStudioCanvas(props) }
    </div>
  )
}

export default ImageStudio
