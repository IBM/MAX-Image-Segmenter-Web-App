import React, { Component } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import AppHeader from './components/AppHeader'
import UploadForm from './components/UploadForm'
import KonvaDisplay from './components/KonvaDisplay'
import ImageDisplay from './components/ImageDisplay'
import UserInfoText from './components/UserInfoText'
import TextOutput from './components/TextOutput'
import LoadedStudioImage from './components/LoadedStudioImage'
import ImageCarousel from './components/ImageCarousel'
import Footer from './components/Footer'
import { cleanDocs, getAllDocs, saveToPouch, deleteSingleImage, deleteAllImages, isEmpty, isNonEmpty, getSingleImage } from './utils'
import './styles/App.css'


export default class App extends Component {
  initialState = {
    image: {},
    previewImg: {},
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
        savedImages: cleanDocs(await getAllDocs()),
        mode: this.studioReady() ? 'studio' : 'studio-loading',
        previewImg: {}
      })
      // here, state needs to be updated to get rid of these bool flags and use string mode

      if (isEmpty(this.state.studio)) {
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
          mode: this.studioReady() ? 'studio' : 'studio-loading'
        })
      } else {
        console.log(`loaded studio - overwriting the front image`)
        this.setState({
          mode: this.studioReady() ? 'studio' : 'studio-loading'
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
      this.uploadModeToggle()
    } else if (imageID === 'ERASE ALL IMAGES') {
      this.handleBulkDelete()
    } else {
      this.setState({ 
        ...this.state,
        selectedImage : imageID,
        image: {},
        previewImg: {}
      })
    }
  }

  uploadModeToggle = () => {
    if (this.state.mode === 'upload') {
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
        studio: this.state.studio,
        mode: 'upload'
      })
    }
  }

  renderMainColumn() {
    if (this.state.mode === 'initial') {
      return <UserInfoText mode={ this.state.mode } />
    } else if (this.state.mode === 'studio-loading' && isNonEmpty(this.state.image)) {
      return (
        <TextOutput 
          image={ this.state.image } 
          studio={ this.state.studio } />
        )
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
              studio={ this.state.studio }
              canvas={ this.canvasRef.current }
              addSegURL={ this.addSegURL }
              setAppPreviewImg={ newImage =>
                this.setState({ 
                  previewImg: newImage, 
                  image: {}
                }) 
              } 
              setAppImageData={newImage =>
                this.setState({ 
                  image: newImage
                }) 
              } />
          }
        </span>
      )
    } else if (this.state.mode === 'studio') {
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
    const check = ((isNonEmpty(this.state.studio.one) && isNonEmpty(this.state.studio.two)) &&
    (this.state.studio.one.selected || this.state.studio.two.selected))
    return check
  }

  handleStudioSegmentSelect = (slotNum, segment) => {
    const otherSlot = slotNum === 'one' ? 'two' : 'one'
    if (this.state.studio[slotNum].selected === segment) {
      this.setState({
        studio: {
          ...this.state.studio,
          [slotNum]: {
            ...this.state.studio[slotNum],
            selected: null
          }
        },
        mode: isNonEmpty(this.state.studio[otherSlot]) ? 'studio' : 'studio-loading'
      })
    } else {
      this.setState({
        studio: {
          ...this.state.studio,
          [slotNum]: {
            ...this.state.studio[slotNum],
            selected: segment
          }
        },
        mode: isNonEmpty(this.state.studio[otherSlot]) ? 'studio' : 'studio-loading'
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
              { // this can be cleaned up by extracting into a 'renderSideColumn' method
                this.state.mode === 'studio-loading' && isEmpty(this.state.studio.one) ?
                  <UserInfoText mode={ this.state.mode } />
                :
                  null
              }
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
              {
                this.state.mode === 'upload' && isNonEmpty(this.state.previewImg) && 
                isEmpty(this.state.studio.one) ?
                  <div className="uploadWrapper">
                    <UserInfoText mode='loading-left' />
                  </div>
                :
                  null
              }
            </Col>

            <Col 
              className="centerCol"
              xs={ 6 }>   
              <div className="uploadWrapper">
                { this.renderMainColumn() }
              </div>
            </Col>

            <Col 
              className="sideCol"
              xs={ 3 }>
              { // this can be cleaned up by extracting into a 'renderSideColumn' method
                this.state.mode === 'studio-loading' && isEmpty(this.state.studio.two) ?
                  <UserInfoText mode={ this.state.mode } />
                :
                  null
              }
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
                this.state.mode === 'upload' && isNonEmpty(this.state.previewImg) &&
                isEmpty(this.state.studio.two) ?
                  <div className="uploadWrapper">
                    <UserInfoText mode='loading-right' />
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
                  },
                  mode: this.studioReady() ? 'studio' : 'studio-loading'
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