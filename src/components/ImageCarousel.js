import React from 'react'
import { Carousel } from 'react-bootstrap'
import CarouselThumb from './CarouselThumb'
import { isNonEmpty } from '../utils'
import '../styles/ImageCarousel.css'

const ImageCarousel = props => (
  <Carousel
    className="caroBar"
    interval={ null }>
    { getCarouselPages(props) }
  </Carousel>
)

export default ImageCarousel

const getCarouselPages = props => {
  const numImages = isNonEmpty(props.images) ? props.images.length : 0
  const numPages = numImages % 3 !== 0 ? Math.ceil(numImages / 3) : Math.ceil(numImages / 3) + 1
  const imageThumbs = numImages > 1 ? props.images.concat(deleteAllImagesThumb()) : props.images
  let pages = []

  if (numImages !== 0) {
    for (let i=0; i<numPages; i++) {
      pages.push(
        <Carousel.Item
          key={ i }
          animateIn={ true }
          animateOut={ true }>
          <div className="caroCard">
            { getCarouselPageItems(imageThumbs, i).map((img, i) => 
              <CarouselThumb
                thumbProps={ props }
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
            { getCarouselPageItems(imageThumbs, 0).map((img, i) => 
              <CarouselThumb
                thumbProps={ props }
                key={ i }
                image={ img } />
            ) }
          </div>
        </Carousel.Item> 
    )  
  }
  return pages
}

const addImageThumb = () => ({
  id: `ADD AN IMAGE`,
  segments: { 
    source: { 
      url: null
    },
    colormap: {
      url: null
    } 
  }
})

const deleteAllImagesThumb = () => ({
  id: `ERASE ALL IMAGES`,
  segments: { 
    source: { 
      url: null
    },
    colormap: {
      url: null
    } 
  }
})

const getCarouselPageItems = (imageThumbs, pageNum) => {
  const startPos = pageNum * 3
  const endPos = startPos + 3
  let pageImages = [addImageThumb()].concat(imageThumbs.slice(startPos, endPos))
  return pageImages
}