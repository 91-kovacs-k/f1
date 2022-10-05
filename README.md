## Available Scripts

In the project directory, you can run:

### `npm run init` ### THIS NEEDS TO BE EXECUTED FIRST

Creates folders for database at location: C:\data\MSSQL. It creates data, log and secrets subfolders.

### `npm run clear-init` ### WARNING! THIS COMMAND DELETES FILES!!!

Deletes the folder data, log and secrets from C:\data\MSSQL. It also deletes the files inside of them.

### `npm run start` ### NEEDS DOCKER DESKTOP CLIENT TO RUN!

Creates images and containers for MS SQL database, amd for the backend and frontend applications, creates a docker network for them, then runs them in the same network.

### `npm run stop` ### NEEDS DOCKER DESKTOP CLIENT TO RUN!

Tears down the docker containers and delete them including the docker network.

### `npm run clear-docker-images` ### NEEDS DOCKER DESKTOP CLIENT TO RUN!

Deletes the docker image files.

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

### The following scripts are docker scripts

### `npm run create-docker-network`

Creates a docker network with the name of f1-net. This command should be run first, so the containers can be started with this network.

### `npm run mssql-build-docker`

Creates the Microsoft SQL database docker image.

### `npm run mssql-run-docker`

Runs the Microsoft SQL database's docker container in f1-net docker network.

### `npm run mssql-run`

The previous two script in one command.

### `npm run mssql-stop-docker`

Stops and deletes the Microsoft SQL database's docker container and image.

### `npm run be-build-docker`

Creates a docker image for the backend with the tag of '91kovacsk/f1-be'.

### `npm run be-run-docker`

Runs the backend docker image in f1-net docker network.

### `npm run be-run`

The previous two scripts in one command.

### `npm run be-stop-docker`

Stops and deletes the backend docker container and image.

### `npm run fe-build-docker`

Creates a docker image for the frontend with the tag of '91kovacsk/f1-fe'.

### `npm run fe-run-docker`

Runs the frontend docker image in f1-net docker network.

### `npm run fe-run`

The previous two scripts in one command.

### `npm run fe-stop-docker`

Stops and deletes the frontend docker container and image.

### `npm run clear-docker-containers`

Stops and deletes the frontend, backend and mssql docker containers.

### `npm run remove-docker-network`

Deletes the F1-net docker network.