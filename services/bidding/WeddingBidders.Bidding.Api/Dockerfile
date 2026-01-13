FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["shared/WeddingBidders.Shared.Core/WeddingBidders.Shared.Core.csproj", "shared/WeddingBidders.Shared.Core/"]
COPY ["shared/WeddingBidders.Shared.Messaging/WeddingBidders.Shared.Messaging.csproj", "shared/WeddingBidders.Shared.Messaging/"]
COPY ["bidding/WeddingBidders.Bidding.Core/WeddingBidders.Bidding.Core.csproj", "bidding/WeddingBidders.Bidding.Core/"]
COPY ["bidding/WeddingBidders.Bidding.Infrastructure/WeddingBidders.Bidding.Infrastructure.csproj", "bidding/WeddingBidders.Bidding.Infrastructure/"]
COPY ["bidding/WeddingBidders.Bidding.Api/WeddingBidders.Bidding.Api.csproj", "bidding/WeddingBidders.Bidding.Api/"]
RUN dotnet restore "bidding/WeddingBidders.Bidding.Api/WeddingBidders.Bidding.Api.csproj"
COPY . .
WORKDIR "/src/bidding/WeddingBidders.Bidding.Api"
RUN dotnet build "WeddingBidders.Bidding.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WeddingBidders.Bidding.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WeddingBidders.Bidding.Api.dll"]
