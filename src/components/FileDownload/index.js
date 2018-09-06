import './FileDownload.css'
import React from 'react'
import { getAttachmentURL } from '../../utils'

const FileDownload = props => {
    return (
      <div className="fileDownloadContainer" 
        onClick={ props.toggleExpand } 
      >
        <p>
          + Click here to view locally stored files in PouchDB.
        </p>
        { 
          props.expanded ? JSON.stringify(props.savedDocs) : <p />
        }
      </div>
    )
}

const getPictureFromDoc = doc => {
  // get the base64 from getAttachment (pouchDB lib)
  // use that.. modified how we need to get a src we can use
  //  - as a reference, look at how we did it in initial canvas
  
  return getAttachmentURL(doc.id, 'source')
} 

const generateDocComponent = async doc => {
  const blob = await getAttachmentURL(doc.id, 'source')
  return (
    <div key={doc.id} className="savedDocLabel">
      <p className="fileName">{doc.id}</p> 
      <img src={ `http://www.com` } alt={ doc.id }/>
      <p>{ Object.keys(doc.doc._attachments).length } segments: </p>
      <p>{ Object.keys(doc.doc._attachments).join(', ') }</p>
      <div onClick={async () => console.log(`${JSON.stringify(Object.keys(doc.doc._attachments))}`)}>Click to Download</div>
    </div>)
}

const parseSavedDocs = docs => {
  return (
    docs.map(doc => generateDocComponent(doc)) || []
  )
}

export default FileDownload