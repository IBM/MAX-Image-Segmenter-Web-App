import './App.css'
import React, { Component } from 'react'
import UploadForm from './components/UploadForm'
import AppHeader from './components/AppHeader'
import FileDownload from './components/FileDownload'
import ImageDisplay from './components/ImageDisplay'
import Footer from './components/Footer'
import { DBType, getAllDocs, cleanDocs, bulkSaveAttachments } from './utils';

const initialState = {
  'modelType' : 'mobile',
  'DBType' : DBType,
  'localFilesExpanded' : false,
  'savedDocs' : [],
  'hoverDoc' : '',
  'imageLoaded' : false,
  'image' : {},
  'selectedObject' : '',
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
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

  setSelectedObject = objType => {
    this.setState({
      'selectedObject' : objType
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
        'canvasReady' : true,
        'selectedObject' : 'colormap'
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
        <ImageDisplay 
        setSelectedObject={ this.setSelectedObject }
        selectedObject={ this.state.selectedObject }
        image={ this.state.image }
        />
      )
    } else if (this.state.previewImg) {
      return (
        <ImageDisplay
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
        {
          this.state.DBType === 'local' ?
            <FileDownload 
              expanded={ this.state.localFilesExpanded }
              dBType={ this.state.dBType }
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
          :
            <p />
        }
        <Footer />
      </div>
    );
  }
}
