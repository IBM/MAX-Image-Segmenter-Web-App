# base image
FROM node:9.6.1

# create app directory
RUN mkdir -p /workspace

# set working directory
WORKDIR /workspace

# envrionment variables
ENV REACT_APP_CLOUDANT_USER= \
    REACT_APP_CLOUDANT_PW= \
    REACT_APP_KUBE_MODEL_PORT=31000 \
    REACT_APP_LOCAL_MODEL_PORT=5000 \
    REACT_APP_DEPLOY_TYPE= \
    REACT_APP_KUBE_IP= \
    PORT=4444

# install and cache app dependencies
COPY . /workspace
RUN npm install --silent

# start app
CMD ["npm", "start"]