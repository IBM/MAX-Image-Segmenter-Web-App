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
      
      `Load another image using the carousel below to begin creating new images.`
      )
  }
}