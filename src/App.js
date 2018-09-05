import './App.css'
import React, { Component } from 'react'
import UploadForm from './components/UploadForm'
import AppHeader from './components/AppHeader'
import Footer from './components/Footer'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      "modelType" : 'mobile'
    }
  }

  handleToggle = () => {
    const modelSelection = this.state.modelType === 'mobile' ? 'full' : 'mobile'
    this.setState({
      'modelType': modelSelection
    })
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
        <Footer />
      </div>
    );
  }
}

export default App
