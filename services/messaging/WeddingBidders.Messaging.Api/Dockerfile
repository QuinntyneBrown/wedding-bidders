FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["shared/WeddingBidders.Shared.Core/WeddingBidders.Shared.Core.csproj", "shared/WeddingBidders.Shared.Core/"]
COPY ["shared/WeddingBidders.Shared.Messaging/WeddingBidders.Shared.Messaging.csproj", "shared/WeddingBidders.Shared.Messaging/"]
COPY ["messaging/WeddingBidders.Messaging.Core/WeddingBidders.Messaging.Core.csproj", "messaging/WeddingBidders.Messaging.Core/"]
COPY ["messaging/WeddingBidders.Messaging.Infrastructure/WeddingBidders.Messaging.Infrastructure.csproj", "messaging/WeddingBidders.Messaging.Infrastructure/"]
COPY ["messaging/WeddingBidders.Messaging.Api/WeddingBidders.Messaging.Api.csproj", "messaging/WeddingBidders.Messaging.Api/"]
RUN dotnet restore "messaging/WeddingBidders.Messaging.Api/WeddingBidders.Messaging.Api.csproj"
COPY . .
WORKDIR "/src/messaging/WeddingBidders.Messaging.Api"
RUN dotnet build "WeddingBidders.Messaging.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WeddingBidders.Messaging.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WeddingBidders.Messaging.Api.dll"]
