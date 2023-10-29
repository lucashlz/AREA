FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm i react-scripts

COPY . .

CMD [ "npm", "start" ]
