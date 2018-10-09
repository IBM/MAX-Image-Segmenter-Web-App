# Short title

Deploy a Deep Learning Powered "Magic Cropping Tool"

# Long title

Deploy a Deep Learning Powered "Magic Cropping Tool" using Pre-Trained Open Source Models

# Offering Type

Artificial Intelligence

# Author

Nick Kasten <Nick.Kasten@ibm.com>
  
# URLs

### Get The Code: 
* GitHub Repo: https://github.com/IBM/MAX-Image-Segmenter-Web-App 

### Other URLs

* _Video Demo Link Coming Soon_
* _Blog Post Link Coming Soon_

# Summary

Use an open-source image segmentation deep learning model to detect different types of objects from within submitted images, then interact with them in a drag-and-drop web application interface to combine them/create new images.

# Description

Most images that are shared online depict one or many objects, usually in some setting or against some kind of backdrop. When editing images, it can take considerable time and effort to crop these individual objects out, whether they are to be processed further elsewhere or used in some new composition. This application uses a Deep Learning model from the Model Asset eXchange (MAX) to automate this process and spark creativity.

In this application, the MAX Image Segmenter model is used to identify the objects in a user-submitted image on a pixel-by-pixel level. These categorized pixels are then used to generate a version of the image with each unique type of object highlighted in a separate color, called a colormap. Each segment is then split into its own image file which can be downloaded for use elsewhere. As subsequent images are uploaded, they will be added to the carousel in the lower portion of the screen and saved in the browser, using PouchDB. From this carousel, images can be reviewed, deleted, or loaded into the "Studio".

In the Studio section of the app, two images may be loaded into an interface that allows for drag-and-drop combinations of any two objects within them. Any new images you may happen to create here can also be downloaded.

When the reader has completed this Code Pattern, they will understand how to:

* Build a docker image of the Image Segmenter MAX Model
* Deploy a deep learning model with a REST endpoint
* Recognize objects segments in an image using the MAX Model's REST API
* Run a web application that using the model's REST API
* Interact with processed object segments to create new images

# Flow

1. User submits image using the web app UI
2. MAX Model API processes image and returns JSON response
3. Web App uses JSON response to crop objects from image and display them to user
4. User interacts with object segments from uploaded images using web app UI

# Instructions

> Find the detailed steps for this pattern in the [readme file](https://github.com/IBM/MAX-Image-Segmenter-Web-App/blob/master/README.md). The steps will show you how to:

1. Start the MAX Model API
2. Start the "Magic Cropping Tool" Web App 

# Components and services

* [IBM Model Asset eXchange](https://developer.ibm.com/code/exchanges/models/): A place for developers to find and use free and open source deep learning models.
* [Docker](https://www.docker.com/): A tool designed to make it easier to create, deploy, and run applications by using containers.
* [React](https://reactjs.org/): An open source JavaScript library for building user interfaces.
* [PouchDB](https://pouchdb.com/): An open-source JavaScript database inspired by Apache CouchDB that is designed to run well within the browser.

# Runtimes

* [JavaScript/Node.js](https://nodejs.org): A JavaScript runtime environment that achieves low latency and high throughput by taking a “non-blocking” approach to serving requests.
* [Python](https://www.python.org/): A programming language that lets you work quickly and integrate systems more effectively.

# Related Links

* [MAX Announcement](https://developer.ibm.com/code/2018/03/20/igniting-a-community-around-deep-learning-models-with-model-asset-exchange-max/): Igniting a community around deep learning models with Model Asset eXchange (MAX).
* [Center for Open-Sourced Data & AI Technologies - CODAIT](https://developer.ibm.com/code/open/centers/codait/): Improving the Enterprise AI Lifecycle in Open Source.