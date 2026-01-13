FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["shared/WeddingBidders.Shared.Core/WeddingBidders.Shared.Core.csproj", "shared/WeddingBidders.Shared.Core/"]
COPY ["shared/WeddingBidders.Shared.Messaging/WeddingBidders.Shared.Messaging.csproj", "shared/WeddingBidders.Shared.Messaging/"]
COPY ["support/WeddingBidders.Support.Core/WeddingBidders.Support.Core.csproj", "support/WeddingBidders.Support.Core/"]
COPY ["support/WeddingBidders.Support.Infrastructure/WeddingBidders.Support.Infrastructure.csproj", "support/WeddingBidders.Support.Infrastructure/"]
COPY ["support/WeddingBidders.Support.Api/WeddingBidders.Support.Api.csproj", "support/WeddingBidders.Support.Api/"]
RUN dotnet restore "support/WeddingBidders.Support.Api/WeddingBidders.Support.Api.csproj"
COPY . .
WORKDIR "/src/support/WeddingBidders.Support.Api"
RUN dotnet build "WeddingBidders.Support.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WeddingBidders.Support.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WeddingBidders.Support.Api.dll"]
