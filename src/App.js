import './App.css'
import React, { Component } from 'react'
import UploadForm from './components/UploadForm'
import AppHeader from './components/AppHeader'
import FileDownload from './components/FileDownload'
import CanvasDisplay from './components/CanvasDisplay'
import Footer from './components/Footer'
import { DBMode, getAllDocs, cleanDocs, bulkSaveAttachments } from './utils';

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

  componentDidMount = async () => {
    this.setState({
      savedDocs : cleanDocs(await getAllDocs())
    })
  }

  componentDidUpdate = async () => {
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
      'canvasReady' : false,
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
    //console.log(`name is getting put in doc as ${name}`)
    this.setState({
      'image' : {
        ...this.state.image,
        'urls' : { 
          ...this.state.image.urls,
          [name]: url
        }
      }
    })
    if (Object.keys(this.state.image.urls).length === Object.keys(this.state.image.foundSegments).length+1){
      //console.log('current image urls ' + Object.keys(this.state.image.urls))
      //console.log('current foundsges ' + JSON.stringify(this.state.image.foundSegments))
      this.saveToPouch(this.state.image)
      this.setState({
        'canvasReady' : true
      })
    }
  }

  saveToPouch = async imageObj => {  
    const bulkUploadJSON = await bulkSaveAttachments({ 
      urls : imageObj.urls, 
      name : imageObj.name, 
      width: imageObj.width,
      height : imageObj.height })
    console.log(`bulk upload fired. id: ${bulkUploadJSON.id}`)
  }

  renderCanvas() {
    if (this.state.canvasReady) {
      return (
        <CanvasDisplay 
          image={ this.state.image }
        />
      )
    } else if (this.state.previewImg) {
      return (
        <CanvasDisplay
          previewImg={ this.state.previewImg }
        />
      )
    }
  }

  render() {
    return (
      <div className="App">
        <AppHeader />
        <UploadForm 
          toggleFunc={ this.handleModelToggle }
          modelType={ this.state.modelType }
          resetLoadState={ () => this.forceUpdate() }
          setAppImageData={ this.setImageData }
          imageLoaded={ this.state.canvasReady }
          addSegURL={ this.addSegURL }
          imageName={ this.state.image.name }
          setPreviewImg={ image => this.setState({ previewImg: image, image: {}, canvasReady: false }) }
        />
        {
          this.state.previewImg || this.state.canvasReady ?
            this.renderCanvas()
          :
          <p />
        }
        <FileDownload 
          expanded={ this.state.localFilesExpanded }
          dbType={ this.state.dbType }
          savedDocs={ this.state.savedDocs }
          hoverDoc={ this.state.hoverDoc }
          setHoverDoc={ hoverDocID => this.setState({ hoverDoc : hoverDocID }) }
          toggleExpand={ () => 
            this.setState({ 
              localFilesExpanded: !this.state.localFilesExpanded, 
              savedDocs: this.state.savedDocs
            }) 
          }
        />
        <Footer />
      </div>
    );
  }
}
