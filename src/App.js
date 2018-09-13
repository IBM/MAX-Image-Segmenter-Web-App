import './App.css'
import React, { Component } from 'react'
import UploadForm from './components/UploadForm'
import AppHeader from './components/AppHeader'
import FileGallery from './components/FileGallery'
import ImageDisplay from './components/ImageDisplay'
import Footer from './components/Footer'
import { getAllDocs, cleanDocs, saveToPouch, deleteSingleImage, deleteAllImages, downloadSegments } from './utils'

const initialState = {
  localFilesExpanded: false,
  savedImages: [],
  hoverImage: '',
  selectedImage: '',
  imageLoaded: false,
  image: {},
  selectedObject: ''
}

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = initialState
  }

  componentDidMount = async () => {
    this.setState({
      savedImages: cleanDocs(await getAllDocs())
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
      imageLoaded: true  
    })
  }

  handleImageDelete = async image => {
    console.log(await deleteSingleImage(image))
    this.setState({
      savedImages : cleanDocs(await getAllDocs())
    })
  }

  handleBulkDelete = async () => {
    await deleteAllImages()
    this.setState({
      savedImages: cleanDocs(await getAllDocs())
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
      this.setState({
        canvasReady: true,
        selectedObject: 'colormap',
        savedImages: cleanDocs(await getAllDocs())
      })
    }
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
          downloadSegments={ image => downloadSegments(image) }
          deleteImage={ image => this.handleImageDelete(image) }
          bulkDelete={ () => this.handleBulkDelete() } 
          setHoverImage={ imageID => 
            this.setState({ hoverImage : imageID }) 
          }
          setSelectedImage={ imageID => 
            this.setState({ selectedImage : imageID }) 
          }
          toggleExpand={ async () => 
            this.setState({ localFilesExpanded: !this.state.localFilesExpanded }) 
          } />
        <Footer />
      </div>
    )
  }
}
