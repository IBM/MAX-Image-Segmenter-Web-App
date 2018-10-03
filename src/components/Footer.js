import React, { Component } from 'react'
import Particles from 'react-particles-js'
import '../styles/Footer.css'

export default class Footer extends Component { 
  shouldComponentUpdate(nextProps, nextState) {
    return false
  }

  render() {
    return (
      <footer>
        <Particles
          className='particles'
          params={ particleParams } />
        <div className="footerMsgBox">
          <p className="maxMsg">
            Start building your own Machine Learning powered apps 
            with open-source models from the 
            <a href="https://developer.ibm.com/code/exchanges/models/">
                {` Model Asset eXchange.`}
            </a>
          </p>
        </div>
        <div className="footerLinks">
          <div className="maxLink left">
            Created at the 
            <a href="https://developer.ibm.com/code/open/centers/codait/">
                {` IBM Center for Open-Source Data & AI Technologies.`}
            </a>
          </div>
          <div className="maxLink right">
            Source code available on 
            <a href="https://github.com/IBM/MAX-Image-Segmenter-Web-App">
                {` GitHub.`}
            </a>
          </div>            
        </div>
      </footer>
    )
  }
}

const particleParams = {
  "particles": {
    "number": {
      "value": 120,
      "density": {
        "enable": true,
        "value_area": 950
      }
    },
    "color": {
      "value": "#00aaaa"
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#00aaaa"
      },
      "polygon": {
        "nb_sides": 5
      }
    },
    "opacity": {
      "value": 0.4,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 2,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#00aaaa",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 4,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "bounce",
      "bounce": true,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "retina_detect": false
}