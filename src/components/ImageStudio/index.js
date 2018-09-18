import './ImageStudio.css'
import React from 'react'
import KonvaDisplay from '../KonvaDisplay'
import { getFormattedName } from '../../utils'

const ImageStudio = props => {  
  return (
    <div className="panel panel-default imageStudioContainer">
      <h2 className="studioTitle panel panel-heading">
        MAX Image Studio
      </h2>
      <div className="sourceImageContainer">
        { 
          props.images.one ? 
            generateStudioImage(props, 'one')
          : 
            null
        }
        { 
          props.images.two ? 
            generateStudioImage(props, 'two')
          : 
            null
        }
      </div>
      { props.images.one && props.images.two && 
        props.images.one.selected && props.images.two.selected ? 
          <KonvaDisplay 
            imageURL1={props.images.one.segments[props.images.one.selected].url}
            imageURL2={props.images.two.segments[props.images.two.selected].url} />
        :
          null
      }

    </div>
  )
}

const generateStudioImage = (props, num) => {
  const image = props.images[num]
  return (
    <div className={ `panel panel-default studioImage ${ num }` }>
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
              key={ seg }
              className={ `${ buttonStyle } btn` }
              onClick={ () => handleObjectClick(props, { num, seg })}>
              { seg }
            </button>
          ) }) 
        }
      </div>
    </div> 
  )
}

const handleObjectClick = (props, { num, seg }) => {
  if (seg !== props.images[num].selected) {
    props.setStudioSegment({ num, seg })
  } else {
    props.setStudioSegment({ num, seg: '' })
  }
}

export default ImageStudio