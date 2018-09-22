import '../styles/AppHeader.css'
import React from 'react'
import logo from '../codait-logo.png'

const AppHeader = props => { 
  return (
    <div className="titleBanner">
      <img className="logoImg" src={ logo } alt="logo" />
      <span className="titleText">
        <u><b>MAX</b> Image Segmenter</u> -  Magic Cropping Tool
      </span>
    </div>
  )
}

export default AppHeader