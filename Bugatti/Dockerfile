# Multi-stage Dockerfile for ASP.NET Core (.NET 10)
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file and restore as distinct layer
COPY ["Bugatti.csproj", "./"]
RUN dotnet restore "Bugatti.csproj"

# Copy everything else and publish
COPY . .
RUN dotnet publish "Bugatti.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENV PORT=8080
EXPOSE 8080

# Render provides PORT dynamically; fallback to 8080 for local docker runs
# Use the actual assembly name produced by the project (AssemblyName in csproj is 'DNASoftechSolar')
ENTRYPOINT ["sh", "-c", "dotnet Bugatti.dll --urls http://0.0.0.0:${PORT:-8080}"]