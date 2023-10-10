FROM node:16-alpine3.18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .

# For npm@5 or later, copy package-lock.json as well
COPY package-lock.json .

RUN npm install

# Bundle app source
COPY . .

EXPOSE 5001

CMD [ "npm", "start" ]