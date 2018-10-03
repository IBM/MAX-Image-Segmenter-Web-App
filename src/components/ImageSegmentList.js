import React from 'react'
import { Glyphicon } from 'react-bootstrap'
import { downloadSegments } from '../utils'
import '../styles/ImageSegmentList.css'

const ImageSegmentList = props => {
  let scrollClass
  const segments = Object.keys(props.image.segments)
  if (segments.length > 7) {
    scrollClass = 'segmentListScrollLong'
  } else if (segments.length > 5) {
    scrollClass = 'segmentListScroll'
  } else {
    scrollClass = 'segmentList'
  }

  const sortedList = ['source', 'colormap'].concat(segments.filter(seg => seg !== 'source' && seg !== 'colormap').sort())
  
  return (
    <div className={ scrollClass }>
      { sortedList.map(seg => {
        const segLabelClass = seg === props.selected ? 
          `studioSegLabel selected` : `studioSegLabel`
        return (
          <span 
            key={ seg }
            className={ `${segLabelClass} ${getClassTail(seg)}` }
            onClick={ () => props.selectSeg(seg) }>
            { getSegmentText(seg) }
          </span>
        )
      }) }
      <span 
        key='download'
        className="downloadSegLabel"
        onClick={ () => downloadSegments(props.image) }>
        <Glyphicon glyph="floppy-disk" /> <span className="dlText ">{` Download All Segments`}</span>
      </span>
    </div>
  )
}

export default ImageSegmentList

const getSegmentText = segLabel => {
  if (segLabel === 'source') {
    return 'Source Image'
  } else if (segLabel === 'colormap') {
    return 'Highlighted Colormap'
  } else {
    return segLabel
  }
}

const getClassTail = segLabel => {
  if (segLabel === 'source' || segLabel === 'colormap') {
    return `faded`
  } else {
    return null
  }
}