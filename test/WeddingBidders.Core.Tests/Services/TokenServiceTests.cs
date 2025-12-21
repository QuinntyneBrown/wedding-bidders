using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using FluentAssertions;
using WeddingBidders.Core.Services;

namespace WeddingBidders.Core.Tests.Services;

public class TokenServiceTests
{
    private readonly TokenService _tokenService;
    private const string SecretKey = "TestSecretKeyThatIsAtLeast32CharactersLong!";
    private const string Issuer = "TestIssuer";
    private const string Audience = "TestAudience";
    private const int ExpirationMinutes = 60;

    public TokenServiceTests()
    {
        _tokenService = new TokenService(SecretKey, Issuer, Audience, ExpirationMinutes);
    }

    [Fact]
    public void GenerateAccessToken_ShouldReturnValidJwtToken()
    {
        // Arrange
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, Guid.NewGuid().ToString()),
            new(ClaimTypes.Name, "testuser@test.com")
        };

        // Act
        var token = _tokenService.GenerateAccessToken(claims);

        // Assert
        token.Should().NotBeNullOrEmpty();
        var handler = new JwtSecurityTokenHandler();
        handler.CanReadToken(token).Should().BeTrue();
    }

    [Fact]
    public void GenerateAccessToken_ShouldContainProvidedClaims()
    {
        // Arrange
        var userId = Guid.NewGuid().ToString();
        var username = "testuser@test.com";
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId),
            new(ClaimTypes.Name, username)
        };

        // Act
        var token = _tokenService.GenerateAccessToken(claims);
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        // Assert
        jwtToken.Claims.Should().Contain(c => c.Type == ClaimTypes.NameIdentifier && c.Value == userId);
        jwtToken.Claims.Should().Contain(c => c.Type == ClaimTypes.Name && c.Value == username);
    }

    [Fact]
    public void GenerateAccessToken_ShouldContainStandardClaims()
    {
        // Arrange
        var claims = new List<Claim>();

        // Act
        var token = _tokenService.GenerateAccessToken(claims);
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);

        // Assert
        jwtToken.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Jti);
        jwtToken.Claims.Should().Contain(c => c.Type == JwtRegisteredClaimNames.Iat);
        jwtToken.Issuer.Should().Be(Issuer);
        jwtToken.Audiences.Should().Contain(Audience);
    }

    [Fact]
    public void GenerateRefreshToken_ShouldReturnNonEmptyString()
    {
        // Act
        var refreshToken = _tokenService.GenerateRefreshToken();

        // Assert
        refreshToken.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void GenerateRefreshToken_ShouldReturnUniqueTokens()
    {
        // Act
        var token1 = _tokenService.GenerateRefreshToken();
        var token2 = _tokenService.GenerateRefreshToken();

        // Assert
        token1.Should().NotBe(token2);
    }

    [Fact]
    public void GetPrincipalFromExpiredToken_ShouldReturnPrincipalForValidToken()
    {
        // Arrange
        var userId = Guid.NewGuid().ToString();
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId)
        };
        var token = _tokenService.GenerateAccessToken(claims);

        // Act
        var principal = _tokenService.GetPrincipalFromExpiredToken(token);

        // Assert
        principal.Should().NotBeNull();
        principal!.Claims.Should().Contain(c => c.Type == ClaimTypes.NameIdentifier && c.Value == userId);
    }

    [Fact]
    public void GetPrincipalFromExpiredToken_ShouldReturnNullForInvalidToken()
    {
        // Arrange
        var invalidToken = "invalid.token.here";

        // Act & Assert
        var act = () => _tokenService.GetPrincipalFromExpiredToken(invalidToken);
        act.Should().Throw<Exception>();
    }
}
