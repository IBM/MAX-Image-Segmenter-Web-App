import './FileDownload.css'
import React from 'react'
import { saveAs } from 'file-saver/FileSaver'
import b64toBlob  from 'b64-to-blob'
 
const FileDownload = props => {
    return (
      <div className="fileDownloadContainer" 
        onClick={ props.toggleExpand } 
      >
        <p>
          + Click here to view locally stored files in PouchDB.
        </p>
        { 
          props.expanded ? 
          generateDocComponent(props.savedDocs) 
            : 
          <p />
        }
      </div>
    )
}

const downloadImage = doc => {
  // get the base64 from getAttachment (pouchDB lib)
  // use that.. modified how we need to get a src we can use
  //  - as a reference, look at how we did it in initial canvas
  console.log(`downloading image!`)

} 

const generateDocComponent = docs => {
  return docs.map(
    doc => (
      <div key={doc.id} className="savedDocLabel">
        <p className="fileName">
          {doc.id.split('-')[1]}
        </p>
        <img
          src={ doc.segments[0].url } 
          alt={ doc.id } 
          onClick={ () => saveAs(b64toBlob(doc.segments[0].url.split(',')[1], 'image/png'), 'sampleSource.png') }
        />
        <p className="segCount">{ doc.segments.length } 
          segments: 
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

export default FileDownload