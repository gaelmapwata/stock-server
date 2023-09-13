# NODE TYPESCRIPT STARTER

## Installation

1. Add environnement variables `cp .env.example .env`
1. Install dependencies: `yarn install`
2. Build TS to JS: `yarn build`

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
