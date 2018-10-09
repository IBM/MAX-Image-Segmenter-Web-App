# MAX Image Segmenter Web App: Magic Cropping Tool

Most images that are shared online depict one or many objects, usually in some setting or against some kind of backdrop. When editing images, it can take considerable time and effort to crop these individual objects out, whether they are to be processed further elsewhere or used in some new composition. This application uses a Deep Learning model from the [Model Asset eXchange (MAX)](https://developer.ibm.com/code/exchanges/models/) to automate this process and spark creativity.

In this application, the [MAX Image Segmenter](https://github.com/IBM/MAX-Image-Segmenter model) model is used to identify the objects in a user-submitted image on a pixel-by-pixel level. These categorized pixels are then used to generate a version of the image with each unique type of object highlighted in a separate color, called a colormap. Each segment is then split into its own image file which can be downloaded for use elsewhere. As subsequent images are uploaded, they will be added to the carousel in the lower portion of the screen and saved in the browser, using PouchDB. From this carousel, images can be reviewed, deleted, or loaded into the "Studio".

In the Studio section of the app, two images may be loaded into an interface that allows for drag-and-drop combinations of any two objects within them. Any new images you may happen to create here can also be downloaded.

When the reader has completed this Code Pattern, they will understand how to:

* Build a docker image of the Image Segmenter MAX Model
* Deploy a deep learning model with a REST endpoint
* Recognize objects segments in an image using the MAX Model's REST API
* Run a web application that using the model's REST API
* Interact with processed object segments to create new images

<br>
<div style="text-align: center;">
  <img src="./static/arch.png" alt="Architectural Diagram" />
</div>

# Flow

1. User submits image using the web app UI
2. MAX Model API processes image and returns JSON response
3. Web app uses JSON response to crop objects from image and display them to user
4. User interacts with object segments from uploaded images using web app UI

# Installation Steps

## Run Locally

### Step 1: Start the MAX Model API
* [Start the Model Server](#1-start-the-model-server)
* [Experiment with the API (Optional)](#2-experiment-with-the-api-optional)

### Step 2: Start the Web App

* [Option 1: Run the App with `npm`](#option-1-run-the-app-with-npm)
* [Option 2: Run the App with Docker](#option-2-run-the-app-with-docker)

### Alternate Install Methods: 

* [Build/Run MAX Model + Web App in One Step with Docker-Compose](#buildrun-max-model--web-app-in-one-step-with-docker-compose)

<br>

## Step 1: Start the MAX Image Segmenter Model

> NOTE: The set of instructions in this section are a modified version of the ones found in the [MAX Image Segmenter Model gitHub repo](https://github.com/IBM/MAX-Image-Segmenter)

This app leverages the API server included with the MAX Image Segmenter model located [here](https://github.com/IBM/MAX-Image-Segmenter). 

The official docs recommend using [Docker](https://docs.docker.com/) to run the MAX model server on your machine, which is also the recommended method to build and run this app. See the [Docker install docs](https://docs.docker.com/install/) for more information.

### 1. Start the Model Server

Use the following command to start the MAX model server:  
```bash
docker run -it -p 5000:5000 -e CORS_ENABLE=true codait/max-image-segmenter
```  

Leave this window open and perform the following steps in a new terminal window.

### 2. Experiment with the API (Optional)

The API server automatically generates an interactive Swagger documentation page.
Go to `http://localhost:5000` to load it. From there you can explore the API and also create test requests.

## Step 2: Start the Web App

### Option 1: Run the App with `npm`

First, clone this repo with the command: 
```bash
git clone https://github.com/IBM/MAX-Image-Segmenter-Web-App.git
```

Enter the directory with `cd`, then install dependencies with the command: 
```bash
npm install
```

Finally, start the app with: 
```bash
npm start
```

Open your browser and navigate to `http://localhost:3000` to view the app.

### Option 2: Run the App with Docker

Start the app with the command: 
```bash
docker run -it -p 3000:3000 kastentx/max-cropping-tool
```   

Open your browser and navigate to `http://localhost:3000` to view the app.

#### To Stop

This command will stop all running containers:  
```bash
docker kill $(docker ps -aq)
```

See the [Docker docs](https://docs.docker.com/) for more information about removing images and containers that you've accumulated. 

#### Troubleshooting

If you receive errors about ports being in use, check to make sure nothing else is already using ports `5000` or `3000` which are needed by this app. To make sure the containers aren't already running, use the command `docker ps` to list all running containers.

# Alternate Install Methods 

### Build/Run MAX Model + Web App in One Step with Docker-Compose

First, download the configuration file with the following command:  
```bash
curl https://raw.githubusercontent.com/IBM/MAX-Image-Segmenter-Web-App/master/docker-compose.yml > docker-compose.yml
```

Then, in the same directory run the MAX Model and Web App with [docker-compose](https://docs.docker.com/compose/) using the following command:
```bash
docker-compose up -d
```

Open your browser and navigate to `http://localhost:3000` to view the app, 
or `http://localhost:5000` to view the MAX Model API documentation.

#### To Stop

Stop the Web App and MAX Model server with the following command: 
```bash
docker-compose stop
```

#### Troubleshooting

If you receive an error about duplicate containers or container names already being in use, or you just want to get rid of all saved containers use the command:
```bash
docker rm $(docker ps -aq)
```

<hr>
<div style="text-align: center">

#### Uploading Images
<i>coming soon</i>

#### MAX Image Segmenter Response
<i>coming soon</i>

#### Loading Images into the Studio
<i>coming soon</i>

#### Creating Images with Saved Objects in Studio
<i>coming soon</i>

<b>DEMO VIDEO</b> <br>  
<i>in development</i>
</div>
