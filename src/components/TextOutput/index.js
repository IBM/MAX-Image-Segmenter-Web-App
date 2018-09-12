import './TextOutput.css'
import React from 'react'
import { COLOR_MAP } from '../../utils'

const TextOutput = props => {
  return (
    <div  style={ { display: props.display } }>
      <div className ="textBox panel panel-default">
        <p>
          { `Resized ` }
          <a onClick={ () => props.selectObject('source') }>
            { props.image.name }
          </a> 
          { ` to ${ props.image.width }x${ props.image.height } 
           and identified ${ props.image.foundSegments.length } 
           object segments.` }
        </p>
        <p>
          { `Click the following to labels to view the MAX Image Segmenter ` }
          <b 
            className='maxLabel' 
            onClick={ () => props.selectObject('colormap') }>
              { `color map` }
          </b> 
          { ` or the objects:` }
          { props.image.foundSegments.filter(name=>name!=='colormap').map(objType => getObjLabel(props, objType)) }.
        </p>
      </div>
    </div>
  )
}

const getObjLabel = (props, objType) => {
  const objects = props.image.foundSegments.filter(name=>name!=='colormap')
  let labelText = objType + `, `
  if (objects.indexOf(objType) === objects.length - 1) {
    labelText = objType
  }
  return (
    <span
      className='objLabel'
      key={ objType }  
      onClick={ () => props.selectObject(objType) }
      style={ { 
        'fontSize' : '1.3em',
        'display' : 'inline-block',
        'cursor' : 'pointer',
        'marginLeft' : '5px',
        'textDecoration' : 'underline', 
        'color' : 
          objType === 'background' ? 
            'inherit' : Object.keys(COLOR_MAP)[objects.indexOf(objType) - 1] 
      } }>
      { labelText }
    </span>
  )
}

export default TextOutput
