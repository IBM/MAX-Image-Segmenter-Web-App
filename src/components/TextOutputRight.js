import '../styles/TextOutput.css'
import React from 'react'
import { COLOR_MAP, downloadSegments } from '../utils'

const TextOutputRight = props => {
  return (
    <div className ="textBox panel panel-default">
      <p>
        { 
          `The MAX model identified the following 
          ${ props.image.foundSegments.filter(name=> name!=='colormap').length }
           object segments: (Click to view) ` 
        }
      </p>
      <p className="outputSegText">
        { props.image.foundSegments.sort().filter(name=> name!=='colormap').map(objType => getObjLabel(props, objType)) }.
      </p>
      <span 
        key='download'
        className="download outputDLButton"
        onClick={ () => downloadSegments(freshSegments(props.image)) }>
        Download all Object Segments
      </span>
    </div>
  )
}

const freshSegments = image => {
  const segments = Object.keys(image.urls)
  return {
    id: `0-${image.name.split('.')[0]}`,
    segments: segments.map( seg => {
      return {
        name: seg, 
        url: image.urls[seg]
      }
    })
  }
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
      onClick={ () => props.setSelectedObject(objType) }
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

export default TextOutputRight
