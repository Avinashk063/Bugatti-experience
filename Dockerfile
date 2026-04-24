FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["Bugatti/Bugatti.csproj", "Bugatti/"]
RUN dotnet restore "Bugatti/Bugatti.csproj"

COPY . .
WORKDIR "/src/Bugatti"
RUN dotnet publish "Bugatti.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_ENVIRONMENT=Production
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "dotnet Bugatti.dll --urls http://0.0.0.0:${PORT:-8080}"]
