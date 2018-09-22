import React from 'react'
import { Carousel } from 'react-bootstrap'
import CarouselThumb from './CarouselThumb'
import { isNonEmpty } from './utils'

const NewCarousel = props => {
  return (
  <Carousel
    interval={ null }>
    { getCarouselPages(props) }
  </Carousel>
  )
}

const addImageThumb = () => ({
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

const deleteAllImagesThumb = () => ({
  id: `ERASE ALL IMAGES`,
  segments: { 
    source: { 
      url: `x`
    },
    colormap: {
      url: 'z'
    } 
  }
})

const getCarouselPageItems = (imageThumbs, pageNum, numPages) => {
  const startPos = pageNum * 3
  const endPos = startPos + 3
  let pageImages = [addImageThumb()].concat(imageThumbs.slice(startPos, endPos))
  return pageImages
}

const getCarouselPages = props => {
  const numImages = isNonEmpty(props.images) ? props.images.length : 0
  const numPages = numImages % 3 !== 0 ? Math.ceil(numImages / 3) : Math.ceil(numImages / 3) + 1
  const { 
    hoverImage, 
    selectedImage, 
    uploadMode,
    setHoverImage, 
    setSelectedImage,
    deleteImage, 
    loadIntoStudio,
    images
  } = props
  const imageThumbs = images.concat(deleteAllImagesThumb())
  let pages = []

  if (numImages !== 0) {
    for (let i=0; i<numPages; i++) {
      pages.push(
        <Carousel.Item
          key={ i }
          animateIn={ true }
          animateOut={ true }>
          <div className="caroCard">
            { getCarouselPageItems(imageThumbs, i, numPages).map((img, i) => 
              <CarouselThumb
                thumbProps={ {
                  hoverImage,
                  selectedImage,
                  setHoverImage,
                  setSelectedImage,
                  deleteImage,
                  loadIntoStudio,
                  uploadMode
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
            { getCarouselPageItems(imageThumbs, 0, 0).map((img, i) => 
              <CarouselThumb
                thumbProps={ {
                  hoverImage,
                  selectedImage,
                  setHoverImage,
                  setSelectedImage,
                  deleteImage,
                  loadIntoStudio,
                  uploadMode
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

export default NewCarousel