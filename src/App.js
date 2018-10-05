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
import { cleanDocs, getAllDocs, saveToPouch, deleteAllImages, isEmpty, isNonEmpty, getSingleImage, deleteSingleImage } from './utils'
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
      this.setState({
        canvasReady: true,
        savedImages: cleanDocs(await getAllDocs()),
        mode: this.studioReady() ? 'studio' : 'studio-loading',
        previewImg: {}
      })
      
      if (isEmpty(this.state.studio)) {
        const singleImageDoc = await getSingleImage(pouchResponse.id)
        this.setState({
          studio: {
            one: cleanDocs({ rows: [{value: pouchResponse.rev,  doc: singleImageDoc}] })[0],
          },
          mode: 'studio-loading'
        })
      } else if (isNonEmpty(this.state.studio.one)) {
        const singleImageDoc = await getSingleImage(pouchResponse.id)
        this.setState({
          studio: {
            ...this.state.studio,
            two: cleanDocs({ rows: [{value: pouchResponse.rev,  doc: singleImageDoc}] })[0]
          },
          mode: this.studioReady() ? 'studio' : 'studio-loading'
        })
      } else {
        this.setState({
          mode: this.studioReady() ? 'studio' : 'studio-loading'
        })
      }
    }
    return null
  }

  handleImageDelete = async image => {
    await deleteSingleImage(image)
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

  handleStudioLoad = (image, slotNum) => {
    const otherSlot = slotNum === 'one' ? this.state.studio.two : this.state.studio.one
    this.setState({ 
      studio: {
        ...this.state.studio,
        [slotNum]: image
      },
      mode: isNonEmpty(otherSlot) && otherSlot.selected ? 'studio' : 'studio-loading'
    })
  }

  renderSideColumn = side => {
    const slot = side === 'left' ? 'one' : 'two'
    return (
      <div>
        { 
          this.state.mode === 'studio-loading' && isEmpty(this.state.studio[slot]) ?
            <UserInfoText mode={ this.state.mode } />
          :
            null
        }
        { 
          isNonEmpty(this.state.studio[slot]) ?
            <div className="uploadWrapper">
              <LoadedStudioImage 
                label={ side === 'left' ? `Background` : 'Front Layer' }
                image={ this.state.studio[slot] } 
                segSelect={ seg => 
                  this.handleStudioSegmentSelect(slot, seg) } /> 
            </div>
          :
            null
        }
        {
          this.state.mode === 'upload' && isNonEmpty(this.state.previewImg) && 
          isEmpty(this.state.studio[slot]) ?
            <div className="uploadWrapper">
              <UserInfoText mode={`loading-${ side }` } />
            </div>
          :
            null
        }
      </div>
    )
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
              setAppImageData={ newImage =>
                this.setState({ 
                  image: newImage
                }) 
              }
              handleCrash={ () => 
                this.setState({
                  studio: {},
                  mode: 'initial'
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
          front={ this.state.studio.two } 
          resetStudio={ () => 
            this.setState({
              studio: {},
              mode: 'studio-loading'
            }) 
          } />
      )
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
              { this.renderSideColumn('left') }
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
              { this.renderSideColumn('right') }
            </Col>
          </Row>
        </div>

        <div className="stickyFoot">
          <Row className="carousel">
            <ImageCarousel
              images={ this.state.savedImages }
              hoverImage={ this.state.hoverImage }
              selectedImage={ this.state.selectedImage }
              mode={ this.state.mode }
              bulkDelete={ () => this.handleBulkDelete() } 
              setUploadMode={ () => this.handleUploadToggle() }
              deleteImage={ image => this.handleImageDelete(image) }
              loadIntoStudio={ (image, slotNum) => this.handleStudioLoad(image, slotNum) }
              setSelectedImage={ imageID => this.handleImageSelect(imageID) }
              setHoverImage={ imageID => 
                this.setState({ hoverImage : imageID }) 
              } />
          </Row>
          <Row className="footer">
            <Footer />
          </Row>
        </div>
      </Grid> 
    )
  }
}