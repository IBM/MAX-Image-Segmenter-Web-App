import './App.css'
import React, { Component } from 'react'
import UploadForm from './components/UploadForm'
import AppHeader from './components/AppHeader'
import FileDownload from './components/FileDownload'
import CanvasDisplay from './components/CanvasDisplay'
import Footer from './components/Footer'
import { DBMode, getAllDocs, cleanDocs } from './utils';

const initialState = {
  'modelType' : 'mobile',
  'dbType' : DBMode,
  'localFilesExpanded' : false,
  'savedDocs' : [],
  'hoverDoc' : '',
  'imageLoaded' : false,
  'image' : {}
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  reset() {
    this.setState(initialState)
  }

  componentDidMount = async () => {
    this.setState({
      savedDocs : cleanDocs(await getAllDocs())
    })
  }

  handleModelToggle = () => {
    const modelSelection = this.state.modelType === 'mobile' ? 'full' : 'mobile'
    this.setState({
      'modelType': modelSelection
    })
  }

  setImageData = (segData, newImage) => {
    this.setState({
      'segData' : segData, 
      'image': newImage,
      'imageLoaded' : true,
      'localFilesExpanded' : false 
    })
  }

  renderCanvas() {
    if (this.state.imageLoaded && Object.keys(this.state.image.urls).length === this.state.image.foundSegments.length + 2) {
      console.log('passed the "ready to render canvas" check')
      return (
        <CanvasDisplay 
          style={ { 'marginTop': '20px' } }
          image={ this.state.image }
          segData={ this.state.segData }
        />
  )} else {
    return (
      <p />
    )
  }
  }

  render() {
    return (
      <div className="App">
        <AppHeader 
          modelType={ this.state.modelType }  
          toggleFunc={ this.handleModelToggle }
        />
        <UploadForm 
          modelType={ this.state.modelType }
          resetLoadState={ () => this.setState({ 'imageLoaded' : false, 'localFilesExpanded': false }) }
          setAppImageData={this.setImageData }
          imageLoaded={ this.state.imageLoaded }
        />
        { this.renderCanvas() }


        {/*
        <FileDownload 
          expanded={ this.state.localFilesExpanded }
          dbType={ this.state.dbType }
          savedDocs={ this.state.savedDocs }
          hoverDoc={ this.state.hoverDoc }
          setHoverDoc={ hoverDocID => this.setState({ hoverDoc : hoverDocID }) }
          toggleExpand={ async () => 
            this.setState({ 
              localFilesExpanded: !this.state.localFilesExpanded, 
              savedDocs: cleanDocs(await getAllDocs()) 
            }) 
          }
        />
        */}
        <Footer />
      </div>
    );
  }
}
