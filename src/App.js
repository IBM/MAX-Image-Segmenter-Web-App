import './App.css'
import React, { Component } from 'react'
import UploadForm from './components/UploadForm'
import AppHeader from './components/AppHeader'
import FileGallery from './components/FileGallery'
import ImageDisplay from './components/ImageDisplay'
import Footer from './components/Footer'
import { getAllDocs, cleanDocs, saveToPouch } from './utils'

const initialState = {
  localFilesExpanded: false,
  savedImages: [],
  hoverImage: '',
  selectedImage: '',
  imageLoaded: false,
  image: {},
  selectedObject: '',
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  resetLoadState = () => {
    this.setState({ 
      imageLoaded: false, 
      canvasReady: false,
      localFilesExpanded: false 
    })
  }

  setPreviewImg = newImage => {
    this.setState({ 
      previewImg: newImage, 
      image: {}, 
      canvasReady: false 
    })
  }

  setImageData = newImage => {
    this.setState({ 
      image: newImage,
      localFilesExpanded: false,
      imageLoaded: true  
    })
  }

  setSelectedObject = objType => {
    this.setState({
      selectedObject: objType
    })
  }

  addSegURL = async (name, url) => {
    this.setState({
      image: {
        ...this.state.image,
        urls: { 
          ...this.state.image.urls,
          [name]: url
        }
      }
    })
    if (Object.keys(this.state.image.urls).length === Object.keys(this.state.image.foundSegments).length+1) {
      const { urls, name, width, height } = this.state.image
      const pouchResponse = await saveToPouch({ urls, name, width, height })
      console.log(`Saved image w/ MAX Model Data in PouchDB. id: ${pouchResponse.id}`)
      this.reloadDisplay()
    }
  }

  reloadDisplay = () => {
    this.setState({
      canvasReady: true,
      selectedObject: 'colormap'
    })
  }

  renderCanvas() {
    if (this.state.canvasReady) {
      return (
        <ImageDisplay 
        setSelectedObject={ this.setSelectedObject }
        selectedObject={ this.state.selectedObject }
        image={ this.state.image } />
      )
    } else if (this.state.previewImg) {
      return (
        <ImageDisplay
          previewImg={ this.state.previewImg } />
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
          setAppPreviewImg={ this.setPreviewImg } />
        {
          this.state.previewImg || this.state.canvasReady ?
            this.renderCanvas()
          :
          <p />
        }
        <FileGallery 
          expanded={ this.state.localFilesExpanded }
          savedImages={ this.state.savedImages }
          hoverImage={ this.state.hoverImage }
          selectedImage={ this.state.selectedImage }
          setHoverImage={ hoverImageID => this.setState({ hoverImage : hoverImageID }) }
          setSelectedImage={ selectImageID => this.setState({ selectedImage : selectImageID }) }
          toggleExpand={ async () => 
            this.setState({ 
              localFilesExpanded: !this.state.localFilesExpanded, 
              savedImages: cleanDocs(await getAllDocs())
            }) 
          } />
        <Footer />
      </div>
    )
  }
}
