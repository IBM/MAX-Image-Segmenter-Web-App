import './AppHeader.css'
import React from 'react'
import logo from './codait-logo.png'

const AppHeader = props => { 
  return (
    <div>
      <div className="titleBanner">
      <img className="logoImg" src={ logo } alt="logo" />
        <span>
         <u><b>MAX</b> Image Segmenter</u> -  Magic Cropping Tool
        </span>
      </div>
      <hr/>

    </div>
  )
}

export default AppHeader