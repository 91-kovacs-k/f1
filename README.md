## Available Scripts

The scripts was intended to use in powershell or cmd, and docker client is needed for them! In the project directory, you can run:

### `npm run init` ### THIS NEEDS TO BE EXECUTED FIRST

Creates folders for database beside project's location: ../f1-data/MSSQL. It creates data, log and secrets subfolders.

### `npm run clear-init` ### WARNING! THIS COMMAND WILL DELETE FILES!!!

Deletes the f1-data folder and subfolders: data, log and secrets from ../f1-data. It also deletes the files (!) inside of them.

### `npm run start` 

Creates images and containers for MS SQL database, and for the backend and frontend applications; creates a docker network for them; then runs them in the same network.
For the frontend Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
For the backend you can use [http://localhost:4000](http://localhost:4000) to post/get/put requests.
The database is listening on [http://localhost:1433](http://localhost:1433)

### `npm run stop` 

Tears down the docker containers and delete them including the docker network.

### `npm run clear-docker-images` 

Deletes the docker image files.

### `npm run be`

Runs the app in the development mode.\
You can use [http://localhost:4000](http://localhost:4000) to post/get/put requests.

### `npm run fe`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### The following scripts are docker scripts

### `npm run create-docker-network`

Creates a docker network with the name of f1-net. This command should be run first, so the containers can be started with this network.

### `npm run mssql-build-docker`

Creates the Microsoft SQL database docker image.

### `npm run mssql-run-docker`

Runs the Microsoft SQL database's docker container in f1-net docker network.
The database is listening on [http://localhost:1433](http://localhost:1433)

### `npm run mssql-run`

The previous two script in one command.

### `npm run mssql-stop-docker`

Stops and deletes the Microsoft SQL database's docker container and image.

### `npm run be-build-docker`

Creates a docker image for the backend with the tag of '91kovacsk/f1-be'.

### `npm run be-run-docker`

Runs the backend docker image in f1-net docker network.
You can use [http://localhost:4000](http://localhost:4000) to post/get/put requests.

### `npm run be-run`

The previous two scripts in one command.

### `npm run be-stop-docker`

Stops and deletes the backend docker container and image.

### `npm run fe-build-docker`

Creates a docker image for the frontend with the tag of '91kovacsk/f1-fe'.

### `npm run fe-run-docker`

Runs the frontend docker image in f1-net docker network.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm run fe-run`

The previous two scripts in one command.

### `npm run fe-stop-docker`

Stops and deletes the frontend docker container and image.

### `npm run clear-docker-containers`

Stops and deletes the frontend, backend and mssql docker containers.

### `npm run remove-docker-network`

Deletes the F1-net docker network.