# MAX Image Segmenter: Magic Cropping Tool Web App

## Install Option 1: Build/Run in one step with Docker-Compose

First, download the configuriation file from a terminal window with the command `curl https://raw.githubusercontent.com/IBM/MAX-ImgSeg-Magic-Cropping-Tool/downloads/docker-compose.yml > docker-compose.yml`

Then, in the same directory as this file you've just downloaded, use the following command to build and run the containers with [docker-compose](https://docs.docker.com/compose/).
`docker-compose up -d --build`

Open your browser and navigate to `http://localhost:4444` to run the app, 
or `http://localhost:5000` to view the MAX model's API documentation.

### To Stop

This command will stop both the front-end app and the Model's API service.
`docker-compose stop`

### Troubleshooting

If you receive an error about duplicate containers or container names already being in use, or you just want to get rid of all saved containers use the command:
`docker rm $(docker ps -aq)`

## Install Option 2: Build/Run each container individually with Docker

First, run the latest version of the MAX Image Segmenter API server with the command `docker run -it -p 5000:5000 kastentx/cors-dualmode-imgseg` _(development-use image)_

Then, run the Magic Cropping Tool frontend app with the command `docker run -it -p 4444:4444 kastentx/img-upload-app` _(development-use image)_

Open your browser and navigate to `http://localhost:4444` to run the app, 
or `http://localhost:5000` to view the MAX model's API documentation.

### To Stop

This command will stop all running containers.
`docker kill $(docker ps -aq)`

To remove the containers from your system, use the similar command from the section above. See the [Docker docs](https://docs.docker.com/) for more information about removing images and containers that you've accumulated. 

### Troubleshooting

If you receive errors about ports being in use, check to make sure nothing else is already using ports `5000` or `4444` which are needed by this app. To make sure the containers aren't already running, use the command `docker ps` to list all running containers.

## Install Option 3: Deploy the MAX model and app to a Kubernetes cluster

* insert directions on setting up a free cluster
  * should be able to do through ibmcloud CLI
  * if not, steps to set up through UI w/ screen shots
  * offer up minikube as an option?
* review how to set up terminal env vars for `kubectl`
* get public IP with `ibmcloud ks workers mycluster-ntk`
* get public NodePorts with `kubectl get svc`
* set details needed in the yaml file
  * rename (if cloudant/creds are still an issue going forward)
* `kubctl -f apply <single-pod-deployment.yaml>`
  
_As of now, the public nodePort and public IP address must be set properly in the YAML file for the MAX model to be accesible from the app. A better deployment/service configuration is being written that shouldn't need this step._

## Install Option 4: Build/Run the app locally with `npm`

First, clone this repo.

Then, `cd` into the new directory. 

* `npm install`
* rename the environment file with `mv sample.env .env`
  * the need for this may change depending on the fate of the cloudant/object storage integration
* `npm start`

The app will be running at `http://localhost:4444`

![App UI](./screenshots/app-ui.png)

![Sample Output](./screenshots/app-output.png)

