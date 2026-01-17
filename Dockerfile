# build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy solution and project files for restoration
COPY src/backend/CardManagement.sln ./src/backend/
COPY src/backend/CardManagement.Api/CardManagement.Api.csproj ./src/backend/CardManagement.Api/
COPY src/backend/Infrastructure/Infrastructure.csproj ./src/backend/Infrastructure/
COPY src/backend/Shared/Shared.csproj ./src/backend/Shared/
COPY src/backend/Modules/Card/Card.csproj ./src/backend/Modules/Card/
COPY src/backend/Modules/User/User.csproj ./src/backend/Modules/User/
COPY src/backend/Modules/Payment/Payment.csproj ./src/backend/Modules/Payment/

# Restore dependencies targeting the API project specifically
RUN dotnet restore src/backend/CardManagement.Api/CardManagement.Api.csproj

# Copy the rest of the source code
COPY src/backend/ ./src/backend/

# Publish the application
RUN dotnet publish src/backend/CardManagement.Api/CardManagement.Api.csproj -c Release -o /out

# final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /out .

# Create a directory for the SQLite database with full permissions
RUN mkdir -p /app/data && chmod 777 /app/data

# Environment variables for Render
ENV ASPNETCORE_URLS=http://+:10000
ENV ConnectionStrings__DefaultConnection="Data Source=/app/data/cardmanagement.db"

EXPOSE 10000

ENTRYPOINT ["dotnet", "CardManagement.Api.dll"]
