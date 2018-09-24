import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import AppHeader from './components/AppHeader'
import UploadForm from './components/UploadForm'
import KonvaDisplay from './components/KonvaDisplay'
import ImageDisplay from './components/ImageDisplay'
import TextOutput from './components/TextOutput'
import LoadedStudioImage from './components/LoadedStudioImage'
import ImageCarousel from './components/ImageCarousel'
import Footer from './components/Footer'
import { cleanDocs, getAllDocs, saveToPouch, deleteSingleImage, deleteAllImages, isNonEmpty } from './utils'
import './styles/App.css'

export default class App extends Component {
  initialState = {
    uploadMode: false,
    imageLoaded: false,
    image: {},
    previewImg: {},
    selectedObject: 'colormap',
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
    return null
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
      savedImages : this.state.savedImages.filter(doc => doc.id !== image.id)
    })
  }

  handleBulkDelete = async () => {
    await deleteAllImages()
    this.setState(this.initialState)
  }

  handleImageSelect = imageID => {
    if (imageID === 'CLICK TO ADD AN IMAGE') {
      this.uploadModeToggle(imageID)
    } else if (imageID === 'ERASE ALL IMAGES') {
      this.handleBulkDelete()
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
      this.setState({
        ...this.initialState,
        savedImages: this.state.savedImages
      })
    } else {
      this.setState({ 
        ...this.initialState,
        savedImages: this.state.savedImages,
        uploadMode: true,
      })
    }
  }

  renderMainColumn() {
    if (this.state.uploadMode) { 
      return (
        <span>
          <canvas 
            ref={ this.canvasRef }
            style={ { display: 'none' } }>
          </canvas>    
          { 
            isNonEmpty(this.state.previewImg) ? 
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
        </span>

      )
    } else if (isNonEmpty(this.state.image)) {
      return (
          <ImageDisplay 
            image={ this.state.image } 
            selectedObject={ this.state.selectedObject }
            setSelectedObject={ object => {
              this.setState({
                selectedObject : object
              })
            } } />
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
    if (this.state.studio[slotNum].selected === segment) {
      console.log(`matching`)
      this.setState({
        studio: {
          ...this.state.studio,
          [slotNum]: {
            ...this.state.studio[slotNum],
            selected: null
          }
        }
      })
    } else {
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
  }

  render() {
    return (
      <Grid fluid={ true }>
        <Row className='stickyHead'>
          <AppHeader />
        </Row>
        <div className="appContent">
          <Row className="mainContent">
            <Col 
              className="sideCol"
              xs={ 3 }>
              { 
                isNonEmpty(this.state.studio.one) ?
                  <div>
                    <LoadedStudioImage 
                      label={ `Background` }
                      image={ this.state.studio.one } 
                      segSelect={ seg => this.handleStudioSegmentSelect('one', seg) } /> 
                  </div>
                :
                  null
              }
              {
                !this.state.uploadMode && isNonEmpty(this.state.image) ?
                <div className="uploadWrapper">
                  <TextOutput
                    side={ `left` }
                    image={ this.state.image }
                    segData={ this.state.image.response } 
                    setSelectedObject={ object => {
                      this.setState({
                        selectedObject : object
                      })
                    } } />
                </div>
                :
                  null
              }
            </Col>

            <Col 
              className={ isNonEmpty(this.state.studio) || this.state.uploadMode || isNonEmpty(this.state.previewImg) ? "centerCol" : "centerCol.empty" }
              xs={ 6 }>   
              <div className="uploadWrapper">
                { this.renderMainColumn() }
              </div>
            </Col>

            <Col 
              className="sideCol"
              xs={ 3 }>
              { 
                isNonEmpty(this.state.studio.two) ?
                  <div>
                    <LoadedStudioImage 
                      label={ `Front Layer` }
                      image={ this.state.studio.two } 
                      segSelect={ seg => this.handleStudioSegmentSelect('two', seg) } /> 
                  </div>
                :
                  null
              }
              {
                !this.state.uploadMode && isNonEmpty(this.state.image) ?
                <div className="uploadWrapper">
                  <TextOutput
                    side={ `right` }
                    image={ this.state.image }
                    segData={ this.state.image.response }
                    setSelectedObject={ object => {
                      this.setState({
                        selectedObject : object
                      })
                    } } />
                </div>
                :
                  null
              }
            </Col>
          </Row>
        </div>
        <div className="stickyFoot">
          <Row className="carousel">
            <ImageCarousel
              images={ this.state.savedImages }
              hoverImage={ this.state.hoverImage }
              selectedImage={ this.state.selectedImage }
              uploadMode={ this.state.uploadMode }
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
        </div>
    </Grid> 
    )
  }
}