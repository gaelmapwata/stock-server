# NODE TYPESCRIPT STARTER

## Features

In this module we use `jsonwebtoken` to protect the routes of this api

https://github.com/auth0/node-jsonwebtoken#readme

## Installation

1. Add environnement variables `cp .env.example .env`
1. Install dependencies: `yarn install`
1. Build TS to JS: `yarn build`
1. Update ***JWT_SECRET*** key in ***.env***

## Run development server

Serve with hot reload at http://localhost:port/ : `yarn dev`

Api will runing on  http://localhost:port/api

## Run production server

Build for production and launch server:

```
yarn build
yarn start
```


## Generate static project

`yarn generate`


## DOCKER

- Create image `docker build . -t node-typecript-starter`

- Run container `docker run -p 8000:8000 -d node-typecript-starter`
