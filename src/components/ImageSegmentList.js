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
  const sortedList = ['source', 'colormap']
    .concat(segments.filter(seg => seg !== 'source' && seg !== 'colormap').sort()) 
  return (
    <div className={ scrollClass }>
      { sortedList.map(seg => {
        const segLabelClass = getSegLabelClass(seg, props)
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
        <Glyphicon glyph="floppy-save" /> <span className="dlText ">{` Download All Segments`}</span>
      </span>
    </div>
  )
}

export default ImageSegmentList

const getSegmentText = segLabel => {
  if (segLabel === 'source') {
    return (
      <span>
        <Glyphicon glyph="picture" /> 
        {` Source Image`}
      </span>
      )
  } else if (segLabel === 'colormap') {
    return (
      <span>
        <Glyphicon glyph="equalizer" /> 
        {` Highlighted Colormap`}
      </span>
      )
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

const getSegLabelClass = (seg, props) => {
  if (props.selected === seg) {
    return `studioSegLabel selected`
  } else if (props.selected === 'none' && seg === 'source') {
    return `studioSegLabel default`
  } else { 
    return `studioSegLabel`
  }
}