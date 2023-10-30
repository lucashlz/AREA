FROM node:16

WORKDIR /app

COPY src/ public/ package* ./

RUN npm install --force

RUN npm i react-scripts

CMD [ "npm", "start" ]
