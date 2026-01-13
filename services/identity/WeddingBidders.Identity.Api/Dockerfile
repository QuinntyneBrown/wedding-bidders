FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["shared/WeddingBidders.Shared.Core/WeddingBidders.Shared.Core.csproj", "shared/WeddingBidders.Shared.Core/"]
COPY ["shared/WeddingBidders.Shared.Messaging/WeddingBidders.Shared.Messaging.csproj", "shared/WeddingBidders.Shared.Messaging/"]
COPY ["identity/WeddingBidders.Identity.Core/WeddingBidders.Identity.Core.csproj", "identity/WeddingBidders.Identity.Core/"]
COPY ["identity/WeddingBidders.Identity.Infrastructure/WeddingBidders.Identity.Infrastructure.csproj", "identity/WeddingBidders.Identity.Infrastructure/"]
COPY ["identity/WeddingBidders.Identity.Api/WeddingBidders.Identity.Api.csproj", "identity/WeddingBidders.Identity.Api/"]
RUN dotnet restore "identity/WeddingBidders.Identity.Api/WeddingBidders.Identity.Api.csproj"
COPY . .
WORKDIR "/src/identity/WeddingBidders.Identity.Api"
RUN dotnet build "WeddingBidders.Identity.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "WeddingBidders.Identity.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WeddingBidders.Identity.Api.dll"]
