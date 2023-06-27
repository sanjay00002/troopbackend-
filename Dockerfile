# FROM node:16-alpine3.18 as nodeBuild

# # Create app directory
# WORKDIR /usr/src/app

# # Install app dependencies
# COPY package.json .

# # For npm@5 or later, copy package-lock.json as well
# COPY package-lock.json .

# RUN npm install

# # Bundle app source
# COPY . .

# EXPOSE 5000

# CMD [ "npm", "start" ]

# # Java Backend
# FROM maven:3.9.0-eclipse-temurin-17-alpine AS build

# COPY ./Payment-java-api/v1api/ .

# RUN mvn clean package -DskipTests


# FROM openjdk:19
# COPY --from=build /target/Troopapi-0.0.1-SNAPSHOT.jar troopapi.jar
# ENV PORT=8080

# EXPOSE 8080

# ENTRYPOINT [ "java", "-jar", "troopapi.jar" ]

# COPY --from=nodeBuild ./usr/src/app .

# CMD [ "npm", "start" ]



# # Stage 1: Node.js Backend Build
# FROM node:16-alpine3.18 as node_builder
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy application code
# COPY . .

# # Build the Node.js backend
# # RUN npm start
# CMD [ "npm", "start" ]


# # Stage 2: Java Backend Build
# FROM maven:3.9.0-eclipse-temurin-17-alpine as java_builder
# WORKDIR /app

# # Copy the Java backend code
# COPY Payment-java-api/v1api/ ./Payment-java-api

# # Build the Java backend (replace with your own build commands)
# WORKDIR /app/Payment-java-api
# RUN mvn clean install 

# # Stage 3: Production Environment
# FROM openjdk:19-alpine3.16

# # Copy built artifacts from previous stages
# COPY --from=node_builder /app ./node-app
# COPY --from=java_builder /app/Payment-java-api/target ./java-app

# # Set the working directory
# WORKDIR /app

# # Install any additional dependencies (if required)
# RUN apk update && apk add --no-cache curl
# RUN curl -sL https://deb.nodesource.com/setup_16.x | ash -s
# RUN apk add --no-cache nodejs

# # Install npm dependencies
# COPY package*.json ./
# RUN npm install

# # Expose necessary ports
# # For Java backend
# EXPOSE 8080
# # For Node.js backend
# EXPOSE 5000

# # Install supervisord
# # RUN apt update && apt-get install -y supervisor
# RUN apk add --no-cache supervisor

# # Copy supervisor configuration file
# COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# # Define the startup command
# CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]


# Stage 1: Node.js Backend Build
FROM node:16 as node_builder
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build the Node.js backend
CMD npm start

# Stage 2: Java Backend Build
FROM maven:3.8.5-openjdk-17 as java_builder
WORKDIR /app

# Copy the Java backend code
COPY Payment-java-api/v1api/ ./Payment-java-api

# Build the Java backend (replace with your own build commands)
WORKDIR /app/Payment-java-api
RUN mvn clean package -DskipTests

# Stage 3: Production Environment
FROM ubuntu:20.04

# Install Java
RUN apt-get update && apt-get install -y openjdk-17-jdk

# Copy built artifacts from previous stages
COPY --from=node_builder /app ./node-app
COPY --from=java_builder /app/Payment-java-api/target ./java-app

# Set the working directory
WORKDIR /app

# Install Node.js and npm
RUN apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Install npm dependencies
COPY package*.json ./
RUN npm install

# Expose necessary ports
# For Java backend
EXPOSE 8080
# For Node.js backend
EXPOSE 5000

# Install supervisord
RUN apt-get install -y supervisor

# Create a directory for supervisor logs
RUN mkdir -p /var/log/supervisor

# Copy supervisor configuration file
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Define the startup command
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
# CMD ["cd /node-app", "&&", "npm", "start", "&&", "cd ..", "&&", "cd /java-app", "&&", "java", "-jar", "./Troopapi-0.0.1-SNAPSHOT.jar"]
