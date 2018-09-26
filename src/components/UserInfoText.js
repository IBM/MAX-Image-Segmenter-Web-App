import React from 'react'
import '../styles/UserInfoText.css'

const UserInfoText = props => {
  const currentMode = props.mode
  return (
    <div className="textBox panel panel-default userInfo">
      { renderMessage(currentMode) }
    </div>
  )
}

export default UserInfoText

const renderMessage = mode => {
  if (mode === 'initial') {
    return `Click the 'Add an Image' button below to begin.`
  } else if (mode === 'studio-loading') {
    return (

      `Choose or upload another image begin combining objects and creating new images in the Studio.`
      )
  }
}