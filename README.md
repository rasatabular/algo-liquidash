# AlgoFi-LiquiDash

Retrieve and present a dashboard based for the ulitization of the amount that is available for an account to borrow on [AlgoFi](https://www.algofi.org/).

The utilisation is computed based on the amount of the collateral that each wallet address owner has provided to AlgoFi versus the amount of assests that the wallet has borrowed. Find more information about how [lending and liquidataions work](https://docs.algofi.org/algofi-lending/master/liquidating-users).

[Application Demo](https://goaldata.org)

## System Design

The backend system has three parts and can be found and run under the `backend/` directory by using the `docker-compose.yml` file. It consists of:
 - a MongoDB container for storing the list of the storage accounts and the data of each storage account
 - a `fetcher` container which is responsible for making API requests with the [AlgoFi SDK](https://github.com/Algofiorg/algofi-py-sdk) and fetch the storage account data
 - a `api` container which uses the [FastAPI](https://fastapi.tiangolo.com/) to serve data

 The frontend part consists of a React application that makes requests to the `api` backend and is responsible for presenting data.

## Running the system

### Backend
First you need to specify the mnemonic for an Algorand wallet address as an environment variable

You need to [install docker](https://docs.docker.com/engine/install/ubuntu/) and also install `docker-compose`. Then you need to build the images and run the backend. You can do this with `docker-compose build` and run the backend system by executing `docker-compose up -d` in the `backend` directory.

The `fetcher` container has the `LOOP` environment variable that can be used to run the `fetcher` continuously.

Then you need to install Nginx with

```
sudo apt update
sudo apt install nginx
```

Based on the VM you are deploying you might need to read [this](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04)

### Frontend
You need to `cd` in the `frontend` directory and run `docker build .`