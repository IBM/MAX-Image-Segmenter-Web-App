import React, { Component } from 'react'
import KonvaImg from '../KonvaImg'
import { Stage, Layer } from 'react-konva'

export default class KonvaDisplay extends Component {
  initialState = {
    image1: {
      xPos: 0,
      yPos: 0
    },
    image2: {
      xPos: 0,
      yPos: 0
    }
  }

  constructor(props) {
    super(props)
    this.state = this.initialState
  }

  handleDragEndOne = e => {
    this.setState({
      image1: {
        xPos: e.target.x(),
        yPos: e.target.y()
      }
    })
  }

  handleDragEndTwo = e => {
    this.setState({
      image2: {
        xPos: e.target.x(),
        yPos: e.target.y()
      }
    })
  }

  downloadURI(uri, name) {
    let link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

  downloadStage = () => {  
    const dataURL = this.stageRef._stage.toDataURL()
    this.downloadURI(dataURL, 'MAX-Studio.png');
  }

  render() {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            flexFlow: 'row',
            alignContent: 'center',
            justifyContent: 'center'
          }}>
          <Stage
              ref={ref => this.stageRef = ref }
              height={513}
              width={513}>
              <Layer>
                <KonvaImg

                  src={this.props.imageURL1}
                  x={this.state.image1.xPos}
                  y={this.state.image1.yPos}
                  draggable
                  onDragEnd={this.handleDragEndOne} />    
                <KonvaImg
 
                  src={this.props.imageURL2}
                  x={this.state.image2.xPos}
                  y={this.state.image2.yPos}
                  draggable
                  onDragEnd={this.handleDragEndTwo} />            
              </Layer>
            </Stage>
        </div>
        <button
          onClick={ () => this.downloadStage() }>
          Download
        </button>
      </div>
    )
  }
}
