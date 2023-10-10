# Java Backend
FROM maven:3.9.0-eclipse-temurin-17-alpine AS build

COPY ../Payment-java-api/v1api/ .

RUN mvn clean package -DskipTests


FROM openjdk:19

COPY --from=build /target/Troopapi-0.0.1-SNAPSHOT.jar troopapi.jar

ENV PORT=8080

EXPOSE 8080

CMD [ "java", "-jar", "troopapi.jar" ]