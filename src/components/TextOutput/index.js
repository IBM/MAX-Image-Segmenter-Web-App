import React from 'react'
import { COLOR_MAP } from '../../utils'

const TextOutput = props => {
  return (
    <div style={ { display: props.display } }>
      <div className='textBox'>
      <p>
        {`Resized `}<a onClick={ () => props.selectObject('source') }>{props.image.name}</a> {`to ${ props.image.width }x${ props.image.height } and identified ${ props.segData.objectTypes.length } object segments.`}
      </p>
      <p>
        { `Select from the following to labels to view the  ` }
        <b className='maxLabel' onClick={ () => props.selectObject('colormap') }>
          full Image Segmenter color map
        </b> 
        {` or the objects:`}{Object.keys(props.segData.objectPixels).map(objType => getObjLabel(props, objType)) }.
      </p>
      </div>
    </div>
  )
}

const getObjLabel = (props, objType) => {
  const pixelMap = props.segData.objectPixels 
  const objects = Object.keys(pixelMap)
  let labelTail
  objects.indexOf(objType) !== objects.length - 1 ? labelTail = `, ` : labelTail = ``

  return (
  <span 
    key={ objType }  
    onClick={ () => props.selectObject(objType) }
    style={ {
      'fontSize' : '1.3em',
      'display' : 'inline-block',
      'cursor' : 'pointer'
    } }
  >
    <span
      className='objLabel'
      style={ { 
        'marginLeft' : '5px',
        'display' : 'inline-block',
        'textDecoration' : 'underline', 
        'color' : 
          objType === 'background' ? 
            'inherit' : Object.keys(COLOR_MAP)[objects.indexOf(objType) - 1] 
      } }
    >
      { `${objType}${labelTail}` }
    </span>
    
  </span>)
}

export default TextOutput
