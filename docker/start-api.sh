#!/bin/sh

yarn build
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
yarn start
