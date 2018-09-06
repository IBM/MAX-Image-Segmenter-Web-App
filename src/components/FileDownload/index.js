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
          props.expanded ? generateDocComponent(props.savedDocs) : <p />
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

const generateDocComponent = docs => {
  //const blob = await getAttachmentURL(doc.id, 'source')
  return docs.map(
    doc => (
      <div key={doc.id} className="savedDocLabel">
      <p className="fileName">{doc.id}</p> 
        <img src={ doc.segments[0].url } alt={ doc.id }/>
        <p>{ doc.segments.length } segments: </p>
        <p>{ doc.segments.map(seg=>seg.name).join(', ') }</p>
        <div onClick={async () => console.log(`${JSON.stringify(Object.keys(doc.segments))}`)}>Click to Download</div>
      </div>
    )
  )
}

const parseSavedDocs = docs => { 
 return docs.map(
   doc=> ({
    name: doc._id, 
    segments: Object.keys(doc._attachments).map(
      segName => ({ 
        name: segName,
        hasData : doc._attachments[segName] && true,
        url: (`data:image/png;base64,${doc._attachments[segName].data}`)
      }))
  }))
}

export default FileDownload