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
import { cleanDocs, getAllDocs, saveToPouch, deleteSingleImage, deleteAllImages, isNonEmpty, getSingleImage } from './utils'
import './styles/App.css'
import UserInfoText from './components/UserInfoText'

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
    studio: {},
    mode: 'initial'
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
    console.log('initialLoad')
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
      console.log(`Saved image w/ MAX Model Data in PouchDB. id: ${ pouchResponse.id }`)
      this.setState({
        canvasReady: true,
        selectedObject: 'colormap',
        savedImages: cleanDocs(await getAllDocs()),
        uploadMode: false,
        previewImg: {}
      })
      // here, state needs to be updated to get rid of these bool flags and use string mode

      if (!isNonEmpty(this.state.studio)) {
        console.log(`empty studio - could go in the BG slot`)
        const singleImageDoc = await getSingleImage(pouchResponse.id)
        this.setState({
          studio: {
            one: cleanDocs({ rows: [{value: pouchResponse.rev,  doc: singleImageDoc}] })[0],
          },
          mode: 'studio-loading'
        })
      } else if (isNonEmpty(this.state.studio.one)) {
        console.log(`BG image preloaded - could go in the front slot`)
        const singleImageDoc = await getSingleImage(pouchResponse.id)
        this.setState({
          studio: {
            ...this.state.studio,
            two: cleanDocs({ rows: [{value: pouchResponse.rev,  doc: singleImageDoc}] })[0]
          },
          mode: 'studio'
        })
      } else {
        console.log(`loaded studio - overwriting the front image`)
        this.setState({
          mode: 'studio'
        })
      }
    }
    return null
  }

  handleImageDelete = async image => {
    console.log(`deleted image id: ${(await deleteSingleImage(image)).id}`)
    this.setState({
      savedImages : this.state.savedImages.filter(doc => doc.id !== image.id)
    })
  }

  handleBulkDelete = async () => {
    await deleteAllImages()
    this.setState(this.initialState)
  }

  handleImageSelect = imageID => {
    if (imageID === 'ADD AN IMAGE') {
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
        savedImages: this.state.savedImages,
        studio: this.state.studio,
        mode: isNonEmpty(this.state.studio) ? 'studio-loading' : 'initial'
      })
    } else {
      this.setState({ 
        ...this.initialState,
        savedImages: this.state.savedImages,
        uploadMode: true,
        studio: this.state.studio,
        mode: 'upload'
      })
    }
  }

  renderMainColumn() {
    if (this.state.mode === 'initial') {
      return <UserInfoText mode={ this.state.mode } />
    } else if (this.state.mode === 'studio-loading') {
      return <UserInfoText mode={ this.state.mode } />
    } else if (this.state.mode === 'upload') { 
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
              imageLoaded={ this.state.canvasReady }
              addSegURL={ this.addSegURL }
              imageName={ this.state.image.name }
              setAppPreviewImg={ newImage =>
                this.setState({ 
                  previewImg: newImage, 
                  image: {}, 
                  canvasReady: false 
                }) 
              } 
              setAppImageData={newImage =>
                this.setState({ 
                  image: newImage,
                  imageLoaded: true  
                }) 
              } />
          }
        </span>
      )
    } /* 
      else if (isNonEmpty(this.state.image)) {
      return (
          <ImageDisplay 
            image={ this.state.image } 
            selectedObject={ this.state.selectedObject }
            setSelectedObject={ object =>
              this.setState({
                selectedObject : object
              })
            } />
      )
    } 
      */
      else if (this.studioReady()) {
        return (
          <KonvaDisplay 
            BG={ this.state.studio.one } 
            selected={ {
              BG: this.state.studio.one.selected,
              front: this.state.studio.two.selected
            } }
            front={ this.state.studio.two } />
        )
    }
  }

  studioReady = () => {
    return (
      (isNonEmpty(this.state.studio.one) && isNonEmpty(this.state.studio.two)) &&
      (isNonEmpty(this.state.studio.one.selected) || isNonEmpty(this.state.studio.two.selected))
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
                  <div className="uploadWrapper">
                    <LoadedStudioImage 
                      label={ `Background` }
                      image={ this.state.studio.one } 
                      segSelect={ seg => 
                        this.handleStudioSegmentSelect('one', seg) } /> 
                  </div>
                :
                  null
              }
              { /*
                !this.state.uploadMode && isNonEmpty(this.state.image) ?
                  <div className="uploadWrapper">
                    <TextOutput
                      side={ `left` }
                      image={ this.state.image }
                      segData={ this.state.image.response } 
                      setSelectedObject={ object =>
                        this.setState({
                          selectedObject : object
                        })
                      } />
                  </div>
                :
                  null
                  */
              }
              {
                this.state.uploadMode && isNonEmpty(this.state.previewImg) && 
                !isNonEmpty(this.state.studio.one) ?
                  <div className="uploadWrapper">
                    <TextOutput />
                  </div>
                :
                  null
              }
            </Col>

            <Col 
              className={ isNonEmpty(this.state.studio) || this.state.uploadMode || isNonEmpty(this.state.image) ? "centerCol" : "centerCol.empty" }
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
                  <div className="uploadWrapper">
                    <LoadedStudioImage 
                      label={ `Front Layer` }
                      image={ this.state.studio.two } 
                      segSelect={ seg => 
                        this.handleStudioSegmentSelect('two', seg) } /> 
                  </div>
                :
                  null
              }
              {
                /*
                !this.state.uploadMode && isNonEmpty(this.state.image) ?
                  <div className="uploadWrapper">
                    <TextOutput
                      side={ `right` }
                      image={ this.state.image }
                      segData={ this.state.image.response }
                      setSelectedObject={ object =>
                        this.setState({
                          selectedObject : object
                        })
                      } />
                  </div>
                :
                  null
                */
              }
              {
                this.state.uploadMode && isNonEmpty(this.state.previewImg) &&
                !isNonEmpty(this.state.studio.two) ?
                  <div className="uploadWrapper">
                    <TextOutput />
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
              bulkDelete={ () => this.handleBulkDelete() } 
              setUploadMode={ () => this.handleUploadToggle() }
              deleteImage={ image => this.handleImageDelete(image) }
              setSelectedImage={ imageID => this.handleImageSelect(imageID) }
              setHoverImage={ imageID => 
                this.setState({ hoverImage : imageID }) 
              }
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