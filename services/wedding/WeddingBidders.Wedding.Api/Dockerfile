FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["shared/WeddingBidders.Shared.Core/WeddingBidders.Shared.Core.csproj", "shared/WeddingBidders.Shared.Core/"]
COPY ["shared/WeddingBidders.Shared.Messaging/WeddingBidders.Shared.Messaging.csproj", "shared/WeddingBidders.Shared.Messaging/"]
COPY ["wedding/WeddingBidders.Wedding.Core/WeddingBidders.Wedding.Core.csproj", "wedding/WeddingBidders.Wedding.Core/"]
COPY ["wedding/WeddingBidders.Wedding.Infrastructure/WeddingBidders.Wedding.Infrastructure.csproj", "wedding/WeddingBidders.Wedding.Infrastructure/"]
COPY ["wedding/WeddingBidders.Wedding.Api/WeddingBidders.Wedding.Api.csproj", "wedding/WeddingBidders.Wedding.Api/"]
RUN dotnet restore "wedding/WeddingBidders.Wedding.Api/WeddingBidders.Wedding.Api.csproj"
COPY . .
WORKDIR "/src/wedding/WeddingBidders.Wedding.Api"
RUN dotnet build "WeddingBidders.Wedding.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WeddingBidders.Wedding.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WeddingBidders.Wedding.Api.dll"]
