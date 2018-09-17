import React, { Component } from 'react'
import KonvaImg from '../KonvaImg'
import { Stage, Layer } from 'react-konva'

export default class KonvaDisplay extends Component {
  initialState = {
    image1: {
      xPos: 250,
      yPos: 250
    },
    image2: {
      xPos: 250,
      yPos: 250
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
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

  downloadStage = () => {  
    var dataURL = this.stageRef._stage.toDataURL()
    this.downloadURI(dataURL, 'stage.png');
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
                  height={500}
                  width={300}
                  src={this.props.imageURL1}
                  x={this.state.image1.xPos}
                  y={this.state.image1.yPos}
                  draggable
                  onDragEnd={this.handleDragEndOne} />    
                <KonvaImg
                  height={500}
                  width={500}
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
