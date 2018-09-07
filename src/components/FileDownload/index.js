import './FileDownload.css'
import React from 'react'
import { saveAs } from 'file-saver/FileSaver'
import b64toBlob  from 'b64-to-blob'
import { base64toURL, deleteLocalImages } from '../../utils';
 
const FileDownload = props => {
    return (
      <div className="fileDownloadContainer" >
        { getToggleText(props) }
        { props.expanded ? 
          <div className="imageGallery">
            { generateDocComponent(props.savedDocs) }
            <div className="panel panel-default deleteBox">
              <div className="panel-heading">
              <p>
                { `Click the button below to ERASE all images from local storage.` }
              </p>
              </div>
              <button 
                className="btn btn-danger"
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
      { `+ Click here to view locally stored images in PouchDB.` }
    </p>
  )
  if (props.expanded) {
    label = (
      <div>
        <p className="closeLabel" onClick={ props.toggleExpand }>
          { `- Click here to hide locally stored images.` }
        </p>
        <p className="downloadLabel">
          { `Click on a saved image to download each of its segments as `
            + `individual image files.` }
        </p>
      </div>
    )
  }
  return label
}

const generateDocComponent = docs => {
  return docs.map(
    doc => (
      <div key={doc.id} className="savedDocLabel">
        <img
          src={ base64toURL(doc.segments[0].base64) } 
          alt={ doc.id } 
          onClick={ () => downloadSegments(doc.id.split('-')[1], doc.segments) }
        />
        <p className="fileName">
          {`${ doc.id.split('-')[1] }`/*: ${ doc.segments.length } segments`*/ }
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
  saveAs(b64toBlob(segment.base64, 'image/png'), `${imgName}-${segment.name}.png`)
}

const downloadSegments = async (imgName, docSegments) => {
  for (let seg in docSegments) {
    downloadSingleSeg(imgName, docSegments[seg])
  }
}

export default FileDownload