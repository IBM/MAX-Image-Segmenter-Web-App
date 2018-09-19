import './App.css'
import React, { Component } from 'react'
import { cleanDocs, getAllDocs, saveToPouch, deleteSingleImage, deleteAllImages, isNonEmpty } from './utils'
import { Grid, Row, Col } from 'react-bootstrap'
import AppHeader from './AppHeader'
import UploadForm from './UploadForm'
import KonvaDisplay from './KonvaDisplay'
import ImageDisplay from './ImageDisplay'
import LoadedImage from './LoadedImage'
import Carousel from './Carousel'
import Footer from './Footer'

export default class App extends Component {
  initialState = {
    uploadMode: false,
    imageLoaded: false,
    image: {},
    previewImg: {},
    selectedObject: 'colormap',
    localFilesExpanded: false,
    savedImages: [],
    hoverImage: '',
    selectedImage: '',
    studio: {}
  }

  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()
    this.state = this.initialState
  }

  componentDidMount = async () => {
    this.setState({
      savedImages: cleanDocs(await getAllDocs())
    })
  }


  // 'uploadForm' methods here
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
        savedImages: cleanDocs(await getAllDocs()),
        uploadMode: false
      })
    }
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

  handleImageSelect = imageID => {
    if (imageID === 'CLICK TO ADD AN IMAGE') {
      this.uploadModeToggle(imageID)
    } else {
      this.setState({ 
        ...this.state,
        selectedImage : imageID,
        image: {},
        previewImg: {},
        uploadMode: false 
      })
    }
  }

  uploadModeToggle = imageID => {
    const newSetting = !this.state.uploadMode
    if (newSetting === false) {
      this.setState(this.initialState)
    } else {
      this.setState({ 
        selectedImage : imageID,
        uploadMode: true,
        studio: {} 
      })
    }
    
  }

  renderMainColumn() {
    if (this.state.uploadMode) { 
      return (
        <div className="uploadWrapper">
          <canvas 
            ref={ this.canvasRef }
            style={ { display: 'none' } }>
          </canvas>    
          { isNonEmpty(this.state.previewImg) ? 
            <ImageDisplay 
              previewImg={ this.state.previewImg } />
          :
            <UploadForm 
              canvas={ this.canvasRef.current }
              setAppImageData={ this.setImageData }
              imageLoaded={ this.state.canvasReady }
              addSegURL={ this.addSegURL }
              imageName={ this.state.image.name }
              setAppPreviewImg={ this.setPreviewImg } />
          }
        </div>

      )
    } else if (isNonEmpty(this.state.image)) {
      return (
        <div className="uploadWrapper">
          <ImageDisplay 
            image={ this.state.image } 
            selectedObject={ this.state.selectedObject }
            setSelectedObject={ object => {
              this.setState({
                selectedObject : object
              })
            } } />
        </div>
      )
    } else if (this.studioReady()) {
      console.log('konva ready')
      return (
        <KonvaDisplay 
          BG={ this.state.studio.one } 
          front={ this.state.studio.two } />
      )
    }
  }

  studioReady = () => {
    return (
      (isNonEmpty(this.state.studio.one) && isNonEmpty(this.state.studio.two)) &&
      (isNonEmpty(this.state.studio.one.selected) && isNonEmpty(this.state.studio.two.selected))
    )
  }

  handleStudioSegmentSelect = (slotNum, segment) => {
    this.setState({
      studio: {
        ...this.state.studio,
        [slotNum]: {
          ...this.state.studio[slotNum],
          selected: segment
        }
      }
    })
  }

  render() {
    return (
        <Grid className="gridLayout" fluid={ true }>
          <Row className='appHeader'>
            <AppHeader />
          </Row>

          <Row className="mainContent">
            <Col 
              className="sideCol"
              xs={ 12 } 
              md={ 3 }>
              { isNonEmpty(this.state.studio.one) ?
                <div>
                  <LoadedImage 
                    label={ `Background` }
                    image={ this.state.studio.one } 
                    segSelect={ seg => this.handleStudioSegmentSelect('one', seg) } /> 
                </div>
              :
                null
              }
            </Col>

            <Col 
              className={isNonEmpty(this.state.studio) || this.state.uploadMode || isNonEmpty(this.state.previewImg) ? "centerCol" : "centerCol.empty"}
              xs={ 12 }
              md={ 6 }>   
                { this.renderMainColumn() }
            </Col>

            <Col 
              className="sideCol"
              xs={ 12 }
              md={ 3 }>
              { isNonEmpty(this.state.studio.two) ?
                <div>
                  <LoadedImage 
                    label={ `Front Layer` }
                    image={ this.state.studio.two } 
                    segSelect={ seg => this.handleStudioSegmentSelect('two', seg) } /> 
                </div>
              :
                null
              }
            </Col>
          </Row>

          { /*
            <Row className="controlBar">
              <ControlBar />
            </Row>
          */ }

          <Row className="carousel">
            <Carousel
              images={ this.state.savedImages }
              hoverImage={ this.state.hoverImage }
              selectedImage={ this.state.selectedImage }
              deleteImage={ image => this.handleImageDelete(image) }
              bulkDelete={ () => this.handleBulkDelete() } 
              setUploadMode={ () => this.handleUploadToggle() }
              setHoverImage={ imageID => 
                this.setState({ hoverImage : imageID }) 
              }
              setSelectedImage={ imageID => this.handleImageSelect(imageID) }
              loadIntoStudio={ (image, slotNum) =>
                this.setState({ 
                  studio: {
                    ...this.state.studio,
                    [slotNum]: image
                  }  
                }) } />
          </Row>

          <Row className="footer">
            <Footer />
          </Row>
        </Grid> 
    )
  }
}

/*
          <button
              onClick={ () => this.downloadStage() }>
              Download
          </button>
*/