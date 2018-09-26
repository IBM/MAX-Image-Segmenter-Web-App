import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import { downloadSegments } from '../utils'
import '../styles/ImageSegmentList.css'

const ImageSegmentList = props => {
  let scrollClass
  const segments = Object.keys(props.image.segments)
  if (segments.length > 5) {
    scrollClass = 'segmentListScrollLong'
  } else if (segments.length > 4) {
    scrollClass = 'segmentListScroll'
  } else {
    scrollClass = 'segmentList'
  }
  
  return (
    <div className={ scrollClass }>
      { segments.sort().map(seg => {
        const segLabelClass = seg === props.selected ? 
          'studioSegLabel selected' : 'studioSegLabel'
        return (
          <span 
            key={ seg }
            className={segLabelClass}
            onClick={ () => props.selectSeg(seg) }>
            { seg }
          </span>
        )
      }) }
      <span 
        key='download'
        className="downloadSegLabel"
        onClick={ () => downloadSegments(props.image) }>
        <Glyphicon glyph="floppy-disk" /> <span className="dlText ">{` Download Segments`}</span>
      </span>
    </div>
  )
}

export default ImageSegmentList