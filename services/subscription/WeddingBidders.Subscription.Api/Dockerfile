FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["shared/WeddingBidders.Shared.Core/WeddingBidders.Shared.Core.csproj", "shared/WeddingBidders.Shared.Core/"]
COPY ["shared/WeddingBidders.Shared.Messaging/WeddingBidders.Shared.Messaging.csproj", "shared/WeddingBidders.Shared.Messaging/"]
COPY ["subscription/WeddingBidders.Subscription.Core/WeddingBidders.Subscription.Core.csproj", "subscription/WeddingBidders.Subscription.Core/"]
COPY ["subscription/WeddingBidders.Subscription.Infrastructure/WeddingBidders.Subscription.Infrastructure.csproj", "subscription/WeddingBidders.Subscription.Infrastructure/"]
COPY ["subscription/WeddingBidders.Subscription.Api/WeddingBidders.Subscription.Api.csproj", "subscription/WeddingBidders.Subscription.Api/"]
RUN dotnet restore "subscription/WeddingBidders.Subscription.Api/WeddingBidders.Subscription.Api.csproj"
COPY . .
WORKDIR "/src/subscription/WeddingBidders.Subscription.Api"
RUN dotnet build "WeddingBidders.Subscription.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WeddingBidders.Subscription.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WeddingBidders.Subscription.Api.dll"]
