import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <footer>
        <p className="maxMsg">
          Start building your own Machine Learning powered apps 
          with open-souce models from the 
          <a 
            className="footerLink" 
            href="https://developer.ibm.com/code/exchanges/models/">
              {` Model Asset eXchange.`}
          </a>
        </p>
        <div className="footerLinks">
          <div>
            Created at the 
            <a
              className="footerLink" 
              href="https://developer.ibm.com/code/open/centers/codait/">
                {` IBM Center for Open-Source Data & AI Technologies.`}
            </a>
          </div>
          <div>
            Source code available on 
            <a
              className="footerLink" 
              href="https://github.com/IBM/MAX-ImgSeg-Magic-Cropping-Tool">
                {` GitHub.`}
            </a>
          </div>            
        </div>
    </footer>
  )
}

export default Footer
