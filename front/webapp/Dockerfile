FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install --force

RUN npm i react-scripts

COPY . .

CMD [ "npm", "start" ]
