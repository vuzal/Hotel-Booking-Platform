# 1. Addım: Layihəni yığmaq üçün Java olan bir mühit götürürük
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# 2. Addım: Kodları içəri kopyalayırıq
COPY . .

# 3. Addım: Gradle vasitəsilə layihəni yığırıq (Jar faylı yaradırıq)
RUN ./gradlew clean build -x test

# 4. Addım: İşlək mühitə keçirik
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

# 5. Addım: Proqramı işə salırıq
ENTRYPOINT ["java", "-jar", "app.jar"]