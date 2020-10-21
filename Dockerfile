FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

RUN npm run build

EXPOSE 6700

RUN rm -rf node_modules

RUN npm install --production

RUN npm run createDb

RUN rm -rf tests emptyDb 

CMD ["npm", "run", "local"]