FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["gateway/WeddingBidders.Gateway/WeddingBidders.Gateway.csproj", "gateway/WeddingBidders.Gateway/"]
RUN dotnet restore "gateway/WeddingBidders.Gateway/WeddingBidders.Gateway.csproj"
COPY . .
WORKDIR "/src/gateway/WeddingBidders.Gateway"
RUN dotnet build "WeddingBidders.Gateway.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WeddingBidders.Gateway.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WeddingBidders.Gateway.dll"]
