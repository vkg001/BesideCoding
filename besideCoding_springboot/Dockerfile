# Stage 1: Use a Maven image to build the application's .jar file
FROM maven:3.8.5-openjdk-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the entire project into the container
COPY . .

# Run the Maven build command to create the .jar file
RUN mvn clean package -DskipTests


# Stage 2: Create the final, lightweight image to run the application
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the .jar file created in the 'build' stage
COPY --from=build /app/target/besideCoding-0.0.1-SNAPSHOT.jar app.jar

# Tell Render that the application runs on port 8080
EXPOSE 8080

# The command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
