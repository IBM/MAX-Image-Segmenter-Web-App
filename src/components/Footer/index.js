import React from 'react'
import './Footer.css'

const Footer = () => {
  return (
    <div className="footerContainer">
      <div>
        <p className="maxMessage">
          Start building your own Machine Learning powered apps with open-souce models from the <a href="https://developer.ibm.com/code/exchanges/models/">Model Asset eXchange.</a>
        </p>
      </div>
      <hr/>
      <footer>
        <p className="left">Created at the <a href="https://developer.ibm.com/code/open/centers/codait/">IBM Center for Open-Source Data & AI Technologies.</a></p>
        <p className="right">Source code <i>not yet</i> available on <a href="https://www.github.com">GitHub.</a></p>
      </footer>
    </div>
  )
}

export default Footer
