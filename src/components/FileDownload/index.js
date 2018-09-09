import './FileDownload.css'
import React from 'react'
import { saveAs } from 'file-saver/FileSaver'
import b64toBlob  from 'b64-to-blob'
import { deleteLocalImages, URLto64 } from '../../utils';
 
const FileDownload = props => {
  return (
    <div className="fileDownloadContainer" >
      { getToggleText(props) }
      { props.expanded ? 
        <div>
          <div className="imageGallery">
            { generateDocComponent(props) }
          </div>
          <div className="panel panel-default deleteBox">
            <div className="panel-heading">
              <p>
                { `Click the button below to ERASE all images from local storage.` }
              </p>
            </div>
            <button 
              className="btn btn-danger deleteBtn"
              onClick={ () => deleteLocalImages(props.toggleExpand) } 
            >
              Delete Saved Images
            </button>
          </div>
        </div>
            : 
        <p /> 
      }
    </div>
  )
}

const getToggleText = props => {
  
  let label = (
    <p className="openLabel" onClick={ props.toggleExpand }>
      { `+ Click here to view locally cached images in PouchDB.` }
    </p>
  )
  if (props.expanded) {
    label = (
      <div>
        <p className="closeLabel" onClick={ props.toggleExpand }>
          { `- Click here to hide locally cached images.` }
        </p>
        <p className="downloadLabel">
          { `Click on a cached image to download each of its segments as `
            + `individual image files.` }
        </p>
      </div>
    )
  }
  return label
}

const getThumbSource = (hoverDoc, doc) => {
  if (hoverDoc === doc.id){
    return doc.segments[1].url
  } else {
    return doc.segments[0].url
  }
}

const generateDocComponent = props => {
  const docs = props.savedDocs
  return docs.map(
    doc => (
      <div key={doc.id} className="savedDocThumb">
        <img
          src={ /*doc.segments[0].url*/ getThumbSource(props.hoverDoc, doc) } 
          alt={ doc.id }
          onMouseEnter={ () => props.setHoverDoc(doc.id) } 
          onMouseLeave={ () => props.setHoverDoc('') } 
          onClick={ () => downloadSegments(doc.id.split('-')[1], doc.segments) }
        />
        <p className="imageLabel">
          <span className="imageTitle">{ `${ doc.id.split('-')[1] }:`}</span>{ ` ${ doc.segments.length } segments` }
        </p>
        { /*
          <p className="segList">
            { doc.segments.map(seg=>seg.name).join(', ') }
          </p>
          */ 
        } 
      </div>
    )
  )
}

const downloadSingleSeg = (imgName, segment) => {
  saveAs(b64toBlob(URLto64(segment.url), 'image/png'), `${imgName}-${segment.name}.png`)
}

const downloadSegments = async (imgName, docSegments) => {
  for (let seg in docSegments) {
    downloadSingleSeg(imgName, docSegments[seg])
  }
}

export default FileDownload