FROM node:10.15.3-jessie-slim

RUN mkdir -p /usr/src/awesomeAPI
WORKDIR /usr/src/awesomeAPI

COPY package.json /usr/src/awesomeAPI
COPY . /usr/src/awesomeAPI

RUN npm install
RUN npm audit fix
RUN npm install -g jest
RUN npm install -g typescript
RUN tsc

EXPOSE 3000

CMD [ "npm", "start" ]