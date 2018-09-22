import React from 'react'
import { downloadSegments } from './utils'

const ImageSegmentList = props => {
  let scrollClass
  const segments = Object.keys(props.image.segments)
  if (segments.length > 5) {
    scrollClass = 'segmentListScrollLong'
  } else if (segments.length > 3) {
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
        Download all segments
      </span>
    </div>
  )
}

export default ImageSegmentList