import React from 'react'
import ImageSegmentList from './ImageSegmentList'

const LoadedImage = props => {
  const { image, label, segSelect } = props
  const selected = image.selected
  const source = image.segments.source

  return (
    <div className="panel panel-default" style={ { textAlign: 'center' } }>
      <h3 className="panel-heading text loadedImageLabel">{ label }</h3>
      <div className="loadedImageWrapper">
        <img
          alt={ label } 
          className="loadedImageThumb"
          src={ selected ? image.segments[selected].url : source.url } />
        <ImageSegmentList 
          selectSeg={ segSelect }
          segments={ Object.keys(image.segments) } />
      </div>
    </div>
  )
}

export default LoadedImage