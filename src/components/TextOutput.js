import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import { isNonEmpty } from '../utils'
import '../styles/TextOutput.css'

const TextOutput = props => {
  if (isNonEmpty(props.image)) {
    const numSegments = Object.keys(props.image.foundSegments.filter(name=> name!=='colormap' && name!=='background')).length
    return (
      <div className="textBox panel panel-default">
        <p>
          { `The ` }
          <span className="modelName">
            MAX Image Segmenter
          </span>
          { ` processed '${ props.image.name }' and identified ` }
          <b> 
            { numSegments } 
          </b>
          { ` object segment${ numSegments !== 1 ? 's' : '' }: ` }
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