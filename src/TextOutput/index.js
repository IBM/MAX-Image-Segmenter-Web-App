import './TextOutput.css'
import React from 'react'
import { COLOR_MAP } from '../utils'

const TextOutput = props => {
  return (
    <div className ="textBox panel panel-default">
      <p>
        { 
          `The MAX model identified the following 
          ${ props.image.foundSegments.filter(name=> name!=='colormap').length }
           object segments: (Click to view) ` 
        }
      </p>
      <p>
        { props.image.foundSegments.sort().filter(name=> name!=='colormap').map(objType => getObjLabel(props, objType)) }.
      </p>

      <p> 
        {`Click `} <a className="maxLabel" onClick={ () => props.selectObject('source') }>{` here `}</a> {`to view the original ${props.image.name}, or `} 
        <a 
          className='maxLabel' 
          onClick={ () => props.selectObject('colormap') }>
            { ` here ` }
        </a>
        { `to view the MAX-generated colormap` }  
      {/* ` was resized to ${ props.image.width }x${ props.image.height }.`*/}
      </p>

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
