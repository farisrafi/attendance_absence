FROM node:18-alpine

# WORKDIR /app
WORKDIR /usr/src

COPY package*.json ./

RUN npm install

WORKDIR /usr/src/app

COPY . .

EXPOSE 4500

CMD ["npm", "run", "dev"]