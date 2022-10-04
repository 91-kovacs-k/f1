## Available Scripts

In the project directory, you can run:

### `npm run be`

Runs the app in the development mode.\
Open [http://localhost:4000](http://localhost:4000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run fe`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run create-docker-network`

Creates a docker network with the name of f1-net. This command should be run first, so the containers can be started with this network.

### `npm run pull-mssql-docker`

Downloads the Microsoft SQL 2019 database's latest image from dockerhub.

### `npm run database-mssql`

Runs the Microsoft SQL database's container (docker) in f1-net docker network. It's necessary to pull the image first from dockerhub.

### `npm run be-build-docker`

Creates a docker image for the backend with the tag of '91kovacsk/f1-be'.

### `npm run be-run-docker`

Runs the backend docker image in f1-net docker network.

### `npm run fe-build-docker`

Creates a docker image for the frontend with the tag of '91kovacsk/f1-fe'.

### `npm run fe-run-docker`

Runs the frontend docker image in f1-net docker network.

### `npm run clear-docker-containers`

Stops and deletes the frontend and backend docker containers.

### `npm run clear-docker-images`

Deletes the frontend and backend docker images.