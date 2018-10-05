import React from 'react'
import '../styles/UserInfoText.css'

const UserInfoText = props => {
  return (
    <div className="uploadWrapper">
      <div className="textBox userInfo">
        { renderMessage(props.mode, props.hasImages) }
      </div>
    </div>
  )
}

export default UserInfoText

const renderMessage = (mode, hasImages) => {
  if (mode === 'initial') {
    if (hasImages){
      return `Select or Add an Image below to begin.`
    } else {
      return `Click the 'Add an Image' button below to begin.`
    }
  } else if (mode === 'studio-loading') {
    return `Choose another image to begin combining objects and creating images in the Studio.`
  } else if (mode === 'loading-left') {
    return `Talking to MAX Model...`
  } else if (mode === 'loading-right') {
    return `Identifying Objects...`
  }
}