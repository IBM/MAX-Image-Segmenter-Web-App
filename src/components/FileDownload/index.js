import './FileDownload.css'
import React from 'react'

const FileDownload = props => {
    return (
      <div className="fileDownloadContainer" 
        onClick={ props.toggleExpand } 
        style={ {} } 
      >
        <p>
          Click here to view locally stored files in PouchDB.
        </p>
        { props.expanded ? JSON.stringify(props.savedDocs) : '' }
      </div>
    )
}

export default FileDownload