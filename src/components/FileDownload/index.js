import './FileDownload.css'
import React from 'react'
import { getAttachment } from '../../utils'

const FileDownload = props => {
    return (
      <div className="fileDownloadContainer" 
        onClick={ props.toggleExpand } 
      >
        <p>
          + Click here to view locally stored files in PouchDB.
        </p>
        { 
          props.expanded ? parseSavedDocs(props.savedDocs) : <p />
        }
      </div>
    )
}

const parseSavedDocs = docs => {
  return (
    docs.map(
      doc => 
        <div key={doc.id} className="savedDocLabel">
          <p className="fileName">{doc.id}</p> 
          <p>{ Object.keys(doc.doc._attachments).length } segments: </p>
          <p>{ Object.keys(doc.doc._attachments).join(', ') }</p>
          <div onClick={() => console.log('download here!')}>Click to Download</div>
        </div>
    ).slice(0,5)
  )
}

export default FileDownload