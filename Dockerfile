# base image
FROM node:9.6.1

# create app directory
RUN mkdir -p /workspace

# set working directory
WORKDIR /workspace

# envrionment variables
ENV REACT_APP_LOCAL_MODEL_PORT=5000 \
    PORT=3000

# install and cache app dependencies
COPY . /workspace
RUN npm install --silent

# start app
CMD ["npm", "start"]