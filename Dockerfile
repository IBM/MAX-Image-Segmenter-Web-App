# base image
FROM node:9.6.1

# create app directory
RUN mkdir -p /workspace

# set working directory
WORKDIR /workspace

# envrionment variables
ENV REACT_APP_LOCAL_MODEL_PORT=5000 \
    REACT_APP_KUBE_MODEL_PORT= \
    REACT_APP_KUBE_IP= \
    REACT_APP_DEPLOY_TYPE= \
    PORT=4444

# install and cache app dependencies
COPY . /workspace
RUN npm install --silent

# start app
CMD ["npm", "start"]