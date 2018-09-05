import './App.css'
import {} from 'dotenv/config'
import React, { Component } from 'react'
import UploadForm from './components/UploadForm'
import AppHeader from './components/AppHeader'
import FileDownload from './components/FileDownload'
import Footer from './components/Footer'
import { getAllDocs } from './utils';

export default class App extends Component {
  constructor(props) {
    super(props)
    let DBMode = process.env.REACT_APP_CLOUDANT_USER && process.env.REACT_APP_CLOUDANT_PW ? 'remote' : 'local'
    this.state = {
      'modelType' : 'mobile',
      'dbType' : DBMode,
      'localFilesExpanded' : false,
      'savedDocs' : []
    }
  }

  componentDidMount = async () => {
    this.setState({
      savedDocs : await getAllDocs()
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
    //.map(pouchDoc => <div key={ pouchDoc.id }>{ `${ pouchDoc.id } - ${ Object.keys(pouchDoc.doc._attachments).length - 2 } segments` }</div>)
  }

  render() {
    return (
      <div className="App">
        <AppHeader 
          toggleFunc={ () => this.handleToggle() }
          modelType={ this.state.modelType }  
        />
        <UploadForm 
          modelType={ this.state.modelType }
        />
        <FileDownload 
          toggleExpand={ () => this.setState({ localFilesExpanded: !this.state.localFilesExpanded }) }
          expanded={ this.state.localFilesExpanded }
          dbType={ this.state.dbType }
          savedDocs={ this.state.savedDocs }
        />
        <Footer />
      </div>
    );
  }
}
