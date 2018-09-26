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
      `Choose another image to begin combining and creating new images in the Studio.`
      )
  } else if (mode === 'loading-left') {
    return `Talking to MAX Model...`
  } else if (mode === 'loading-right') {
    return `Identifying Objects...`
  }
}