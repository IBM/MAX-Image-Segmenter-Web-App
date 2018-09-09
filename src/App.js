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

  reset() {
    this.setState(initialState)
  }

  componentDidMount = async () => {
    const myDocs = cleanDocs(await getAllDocs())
    console.log(`mounted with docs[0] ${JSON.stringify(myDocs[0])}`)
    if (myDocs.length > 0)
      console.log(`mounted with docs[0]segments ${JSON.stringify(Object.keys(myDocs[0].segments))}`)
    
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
    console.log(`name is getting put in doc as ${name}`)
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
      console.log('current image urls ' + Object.keys(this.state.image.urls))
      console.log('current foundsges ' + JSON.stringify(this.state.image.foundSegments))
      this.saveToPouch(this.state.image)
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
        <UploadForm 
          modelType={ this.state.modelType }
          resetLoadState={ this.resetLoadState }
          setAppImageData={ this.setImageData }
          imageLoaded={ this.state.imageLoaded }
          addSegURL={ this.addSegURL }
        />
        {
          this.state.imageLoaded ?
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
          toggleExpand={ async () => 
            this.setState({ 
              localFilesExpanded: !this.state.localFilesExpanded, 
              savedDocs: cleanDocs(await getAllDocs()) 
            }) 
          }
        />
        <Footer />
      </div>
    );
  }
}
