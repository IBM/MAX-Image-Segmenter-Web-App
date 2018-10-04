# MAX Image Segmenter Web App: Magic Cropping Tool

_intro_

_arch diagram_


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

# Step 1: Start the MAX Image Segmenter Model

> NOTE: The set of instructions in this section are a modified version of the ones found in the [MAX Image Segmenter model repo](https://github.com/IBM/MAX-Image-Segmenter)

This app leverages the API server included with the MAX Image Segmenter model located [here](https://github.com/IBM/MAX-Image-Segmenter). 

The official docs recommend using [Docker](https://docs.docker.com/) to run the MAX model server on your machine, which is also the recommended method to build and run this app. See the [Docker install docs](https://docs.docker.com/install/) for more information.

## 1. Start the Model Server

Use the following command to start the MAX model server:  
```
docker run -it -p 5000:5000 -e CORS_ENABLE=true kastentx/cors-max-imgseg
```  

Leave this window open and perform the folllowing steps in a new terminal window.

## 2. Experiment with the API (Optional)

The API server automatically generates an interactive Swagger documentation page.
Go to `http://localhost:5000` to load it. From there you can explore the API and also create test requests.

# Step 2: Start the Web App

## Option 1: Run the App with `npm`

First, clone this repo with the command: 
```
git clone https://github.com/IBM/MAX-Image-Segmenter-Web-App.git
```

Enter the directory with `cd`, then install dependencies with the command: 
```
npm install
```

Finally, start the app with: 
```
npm start
```

Open your browser and navigate to `http://localhost:3000` to view the app.

## Option 2: Run the App with Docker

Start the app with the command: 
```
docker run -it -p 3000:3000 kastentx/max-cropping-tool
```   

Open your browser and navigate to `http://localhost:3000` to view the app.

### To Stop

This command will stop all running containers:  
```
docker kill $(docker ps -aq)
```

See the [Docker docs](https://docs.docker.com/) for more information about removing images and containers that you've accumulated. 

### Troubleshooting

If you receive errors about ports being in use, check to make sure nothing else is already using ports `5000` or `3000` which are needed by this app. To make sure the containers aren't already running, use the command `docker ps` to list all running containers.

# Alternate Install Methods 

## Build/Run MAX Model + Web App in One Step with Docker-Compose

First, download the configuriation file with the following command:  
```
curl https://raw.githubusercontent.com/IBM/MAX-Image-Segmenter-Web-App/master/docker-compose.yml > docker-compose.yml
```

Then, in the same directory use the following command to build and run the MAX Model and Web App with [docker-compose](https://docs.docker.com/compose/).
```
docker-compose up -d
```

Open your browser and navigate to `http://localhost:3000` to view the app, 
or `http://localhost:5000` to view the MAX Model API documentation.

### To Stop

Stop the Web App and MAX Model server with the following command: 
```
docker-compose stop
```

### Troubleshooting

If you receive an error about duplicate containers or container names already being in use, or you just want to get rid of all saved containers use the command:
```
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
