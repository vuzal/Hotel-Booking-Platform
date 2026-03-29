
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app


COPY . .

# Gradlew faylına icra icazəsi veririk
RUN chmod +x gradlew
# Gradle vasitəsilə layihəni yığırıq (Jar faylı yaradırıq)
RUN ./gradlew clean build -x test

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

ENTRYPOINT ["java", "-Xmx512m", "-jar", "app.jar"]