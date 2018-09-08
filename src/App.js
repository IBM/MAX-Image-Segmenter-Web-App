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

  resetLoadState = () => {
    this.setState({ 
      'imageLoaded' : false, 
      'localFilesExpanded': false 
    })
  }

  setImageData = newImage => {
    this.setState({ 
      'image': newImage,
      'localFilesExpanded' : false,
      'imageLoaded': true  
    })
  }

  addSegURL = (name, url) => {
    this.setState({
      'image' : {
        ...this.state.image,
        'urls' : {
          ...this.state.image.urls,
          [name] : url
        }
      }
    })
  }

  renderCanvas() {
    if (this.state.imageLoaded) {
      return (
        <CanvasDisplay 
          image={ this.state.image }
        />
    )}
  }

  render() {
    return (
      <div className="App">
        <AppHeader 
          modelType={ this.state.modelType }  
          toggleFunc={ this.handleModelToggle }
        />
        {
          this.state.imageLoaded ?
            this.renderCanvas() 
          :
            <UploadForm 
              modelType={ this.state.modelType }
              resetLoadState={ this.resetLoadState }
              setAppImageData={ this.setImageData }
              imageLoaded={ this.state.imageLoaded }
              addSegURL={ this.addSegURL }
            />
        }
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
