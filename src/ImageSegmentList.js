import React from 'react'

const ImageSegmentList = props => {
  return (
    <div className="segmentListContainer">
      
      { props.segments.map(seg => {
        return (
          <span key={ seg }>
            <a
              key={ seg }
              onClick={ () => props.selectSeg(seg) }>
              { seg }
            </a>
          </span>
        )
      }) }

    </div>
  )
}

export default ImageSegmentList