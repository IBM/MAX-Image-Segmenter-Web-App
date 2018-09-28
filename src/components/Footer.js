import React from 'react'
import '../styles/Footer.css'

const Footer = () => (
  <footer>
    <p className="maxMsg">
      Start building your own Machine Learning powered apps 
      with open-source models from the 
      <a 
        className="maxLink" 
        href="https://developer.ibm.com/code/exchanges/models/">
          {` Model Asset eXchange.`}
      </a>
    </p>
    <div className="footerLinks">
      <div>
        Created at the 
        <a
          className="maxLink" 
          href="https://developer.ibm.com/code/open/centers/codait/">
            {` IBM Center for Open-Source Data & AI Technologies.`}
        </a>
      </div>
      <div>
        Source code available on 
        <a
          className="maxLink" 
          href="https://github.com/IBM/MAX-Image-Segmenter-Web-App">
            {` GitHub.`}
        </a>
      </div>            
    </div>
  </footer>
)

export default Footer