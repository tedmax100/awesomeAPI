FROM node:10.15.3-jessie-slim

RUN mkdir -p /usr/src/bo_portal
WORKDIR /usr/src/bo_portal

COPY package.json /usr/src/bo_portal
COPY . /usr/src/bo_portal

RUN npm install
RUN npm audit fix
RUN npm install -g jest
RUN npm install -g typescript
RUN tsc

EXPOSE 3000

CMD [ "npm", "start" ]