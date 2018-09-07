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
          <div>
            { generateDocComponent(props.savedDocs) }
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
      { `+ Click here to view locally stored files in PouchDB.` }
    </p>
  )
  if (props.expanded) {
    label = (
      <div>
        <p className="closeLabel" onClick={ props.toggleExpand }>
          { `- Click here to collapse locally stored files in PouchDB.` }
        </p>
        <p 
          className="deleteLabel"
          onClick={ () => deleteLocalImages(props.toggleExpand) }
        >
          { `Click HERE to clear all images from local storage.` }
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
        <p className="fileName">
          {doc.id.split('-')[1]}
        </p>
        <img
          src={ base64toURL(doc.segments[0].base64) } 
          alt={ doc.id } 
          onClick={ () => downloadSegments(doc.id.split('-')[1], doc.segments) }
        />
        <p className="segCount">{ doc.segments.length } 
         {` segments:` }
        </p>
        { 
          <p className="segList">
            { doc.segments.map(seg=>seg.name).join(', ') }
          </p> 
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