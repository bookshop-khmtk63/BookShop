# Stage 1: Build the application
FROM maven:3.9.3-eclipse-temurin-17 AS build
WORKDIR /app

# Copy pom.xml và tải dependencies trước (tăng tốc build nhờ cache)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy toàn bộ source code và build
COPY src ./src
RUN mvn clean package -DskipTests
RUN mvn clean package -DskipTests -Dfile.encoding=UTF-8


# Stage 2: Run the application
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy jar từ stage build
COPY --from=build /app/target/*.jar app.jar

# Expose port (nếu Spring Boot mặc định 8080)
EXPOSE 8080

# Chạy Spring Boot app
ENTRYPOINT ["java","-Xmx256m", "-jar", "app.jar"]
