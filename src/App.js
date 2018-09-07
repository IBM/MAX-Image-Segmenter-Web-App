import './App.css'
import React, { Component } from 'react'
import UploadForm from './components/UploadForm'
import AppHeader from './components/AppHeader'
import FileDownload from './components/FileDownload'
import Footer from './components/Footer'
import { DBMode, getAllDocs, cleanDocs } from './utils';

const initialState = {
  'modelType' : 'mobile',
  'dbType' : DBMode,
  'localFilesExpanded' : false,
  'savedDocs' : [],
  'imageLoaded' : false
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
    this.setState({
      savedDocs : cleanDocs(await getAllDocs())
    })
  }

  handleToggle = () => {
    const modelSelection = this.state.modelType === 'mobile' ? 'full' : 'mobile'
    this.setState({
      'modelType': modelSelection
    })
  }

  generatePouchDocList = () => {
    return this.state.pouchDocs
  }

  render() {
    return (
      <div className="App">
        <AppHeader 
          modelType={ this.state.modelType }  
          toggleFunc={ () => this.handleToggle() }
        />
        <UploadForm 
          modelType={ this.state.modelType }
          setImageLoadState={ imageLoadState => this.setState({ imageLoaded : imageLoadState, localFilesExpanded: false }) }
          resetApp={ () => this.reset() }
          imageLoaded={ this.state.imageLoaded }
        />
        <FileDownload 
          expanded={ this.state.localFilesExpanded }
          dbType={ this.state.dbType }
          savedDocs={ this.state.savedDocs }
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
