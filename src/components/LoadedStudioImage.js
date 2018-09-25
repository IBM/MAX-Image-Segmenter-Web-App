import React from 'react'
import ImageSegmentList from './ImageSegmentList'
import '../styles/LoadedStudioImage.css'

const LoadedStudioImage = props => {
  const { image, label, segSelect } = props
  const selected = image.selected
  const source = image.segments.source
  const overflowStyle = Object.keys(image.segments).length > 3 ? 'scroll' : 'hidden' 

  return (
    <div className="panel panel-default imagePanel">
      <h3 className="text loadedImageLabel">
        { label }
      </h3>
      <div className="loadedImageWrapper"
      style={{
        backgroundSize: `contain`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(${ source.url })`
      }}>
      </div>
      <div style={ { maxHeight: '23vh', overflowY: overflowStyle } }>
        <ImageSegmentList 
            selected={ selected }
            selectSeg={ segSelect }
            image={ image } />
      </div>
    </div>
  )
}

export default LoadedStudioImage