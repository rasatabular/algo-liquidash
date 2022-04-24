# AlgoFi-LiquiDash

Retrieve and present a dashboard based for the ulitization of the amount that is available for an account to borrow on [AlgoFi](https://www.algofi.org/).

The utilisation is computed based on the amount of the collateral that each wallet address owner has provided to AlgoFi versus the amount of assests that the wallet has borrowed. Find more information about how [lending and liquidataions work](https://docs.algofi.org/algofi-lending/master/liquidating-users).

[Application Demo](https://www.goaldata.org)

## System Design

The backend system has three parts and can be found and run under the `backend/` directory by using the `docker-compose.yml` file. It consists of:
 - a MongoDB container for storing the list of the storage accounts and the data of each storage account
 - a `fetcher` container which is responsible for making API requests with the [AlgoFi SDK](https://github.com/Algofiorg/algofi-py-sdk) and fetch the storage account data
 - a `api` container which uses the [FastAPI](https://fastapi.tiangolo.com/) to serve data

 The frontend part consists of a React application that makes requests to the `api` backend and is responsible for presenting data.

## Deploying the system

Deploying the system is handled by Docker and `docker-compose`. You need to [install docker](https://docs.docker.com/engine/install/ubuntu/) and also install `docker-compose`. If you want to deploy it on a cloud service provider you need to also specify a [Docker context](https://docs.docker.com/engine/context/working-with-contexts/).

After installing Docker you need to:
1. First you need to specify the mnemonic for an Algorand wallet address as an environment variable `WALLET_SEED`.
2. Specify an email address to be related with the TLS certificates. Specify this by using the `TLS_EMAIL` environment variable.

Then for **deploying on your local machine**:
    docker-compose build
    docker-compose up -d

And for **deploying on the cloud**:
    DOCKER_CONTEXT=liquidata docker compose -f docker-compose.yml -f docker-compose.prod.yml build
    DOCKER_CONTEXT=liquidata docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

The `fetcher` container has the `LOOP` environment variable that can be used to run the `fetcher` continuously.

## Limitations and Future Improvement

Fetching data with the `fetcher` uses REST API calls that are slow. Running a dedicated node/indexer to support the application can considerably speed up fetching the results.