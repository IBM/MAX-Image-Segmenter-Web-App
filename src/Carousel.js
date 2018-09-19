import React, { Component } from 'react'
import { Carousel } from 'react-bootstrap'
import CarouselThumb from './CarouselThumb'

export default class ControlledCarousel extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      index: 0,
      direction: null
    }
  }

  handleSelect = (selectedIndex, e) => {
    this.setState({
      index: selectedIndex,
      direction: e.direction
    });
  }

  addImageThumb = () => ({
    id: `CLICK TO ADD AN IMAGE`,
    segments: { 
      source: { 
        url: `x`
      },
      colormap: {
        url: 'z'
      } 
    }
  })

  getCarouselPageItems = pageNum => {
    // we have to adjust for the 'fake' first element
    const startPos = pageNum === 0 ? 0 : ((pageNum - 1) * 4) + 3
    const endPos = pageNum === 0 ? startPos + 3 : startPos + 4
    const imagesForPage = pageNum === 0 ? [this.addImageThumb()].concat(this.props.images.slice(startPos, endPos)) : this.props.images.slice(startPos, endPos)
    return imagesForPage
  }

  getCarouselPages = () => {
    const numImages = this.props.images.length
    const numPages = Math.ceil(numImages / 4)
    const { 
      hoverImage, 
      selectedImage, 
      setHoverImage, 
      setSelectedImage, 
      deleteImage,
      loadIntoStudio 
    } = this.props
    let pages = []
    if (numImages !== 0) {
      for (let i=0; i<numPages; i++) {
        pages.push(
          <Carousel.Item
            key={ i }
            animateIn={ true }
            animateOut={ true }>
            <div className="caroCard">
              { this.getCarouselPageItems(i).map((img, i) => 
                <CarouselThumb
                  thumbProps={ {
                    hoverImage,
                    selectedImage,
                    setHoverImage,
                    setSelectedImage,
                    deleteImage,
                    loadIntoStudio
                  } }
                  key={ i }
                  image={ img } />
              ) }
            </div>
          </Carousel.Item> 
        )
      }
    } else {
      pages.push(
        <Carousel.Item
            key={ 0 }
            animateIn={ true }
            animateOut={ true }>
            <div className="caroCard">
              { this.getCarouselPageItems(0).map((img, i) => 
                <CarouselThumb
                  thumbProps={ {
                    hoverImage,
                    selectedImage,
                    setHoverImage,
                    setSelectedImage,
                    deleteImage,
                    loadIntoStudio
                  } }
                  key={ i }
                  image={ img } />
              ) }
            </div>
          </Carousel.Item> 
      )  
    }
    return pages
  }
  
  render() {
    const { index, direction } = this.state
    return (
      <Carousel
        activeIndex={ index }
        direction={ direction }
        onSelect={ this.handleSelect }>
        { this.getCarouselPages() }
      </Carousel>
    )
  }
}