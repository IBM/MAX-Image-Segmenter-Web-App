import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import { COLOR_MAP, downloadSegments, isNonEmpty } from '../utils'
import '../styles/TextOutput.css'

const TextOutput = props => {
  if (props.side === 'right') {
    return (
      <div className="textBox panel panel-default">
        <p>
          { 
            `The MAX model identified the following 
            ${ props.image.foundSegments.filter(name=> name!=='colormap').length }
            object segments: (ADD AN IMAGEview) ` 
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
  } else if (props.side === 'left') {
  return   (    
    <div className="textBox panel panel-default">
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
        click the image thumbnails below to load them into the Studio.
      </p>
    </div>
  )
  } else if (props.side === 'center' && isNonEmpty(props.image)) {
    const numSegments = Object.keys(props.image.foundSegments.filter(name=> name!=='colormap' && name!=='background')).length
    return (
      <div className="textBox panel panel-default">
        <p>
          { 
            `The `}<u>MAX Image Segmenter</u>{` processed the image and identified `}
            <b> { numSegments } </b>
            { ` object segment${ numSegments > 1 ? 's' : '' }: ` }
            <b>
              { Object.values(props.image.foundSegments.filter(name=> name!=='colormap' && name!=='background')).join(', ') } 
            </b>
            { `.` }
        </p>
        <p className="outputStudioText">
          Click the segment buttons below an image to view them individually, or to download them to your local machine.
        </p>
        <div className="arrowIcons">
          { isNonEmpty(props.studio.one) ? 
            <Glyphicon glyph="arrow-left" />
          :
            null 
          }
          { isNonEmpty(props.studio.two) ? 
            <Glyphicon glyph="arrow-right" />
          :
            null 
          }
        </div>
    </div>
  )
  } else {
    return (
      <div className="textBox panel panel-default">
        Talking to MAX Model...
      </div>
    )
  }
}

export default TextOutput

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
