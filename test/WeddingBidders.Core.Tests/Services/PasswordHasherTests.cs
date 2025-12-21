using FluentAssertions;
using WeddingBidders.Core.Services;

namespace WeddingBidders.Core.Tests.Services;

public class PasswordHasherTests
{
    private readonly PasswordHasher _passwordHasher;

    public PasswordHasherTests()
    {
        _passwordHasher = new PasswordHasher();
    }

    [Fact]
    public void GenerateSalt_ShouldReturn16Bytes()
    {
        // Act
        var salt = _passwordHasher.GenerateSalt();

        // Assert
        salt.Should().HaveCount(16);
    }

    [Fact]
    public void GenerateSalt_ShouldGenerateUniqueSalts()
    {
        // Act
        var salt1 = _passwordHasher.GenerateSalt();
        var salt2 = _passwordHasher.GenerateSalt();

        // Assert
        salt1.Should().NotBeEquivalentTo(salt2);
    }

    [Fact]
    public void HashPassword_ShouldReturnConsistentHash()
    {
        // Arrange
        var password = "TestPassword123";
        var salt = _passwordHasher.GenerateSalt();

        // Act
        var hash1 = _passwordHasher.HashPassword(password, salt);
        var hash2 = _passwordHasher.HashPassword(password, salt);

        // Assert
        hash1.Should().Be(hash2);
    }

    [Fact]
    public void HashPassword_ShouldReturnDifferentHashForDifferentSalts()
    {
        // Arrange
        var password = "TestPassword123";
        var salt1 = _passwordHasher.GenerateSalt();
        var salt2 = _passwordHasher.GenerateSalt();

        // Act
        var hash1 = _passwordHasher.HashPassword(password, salt1);
        var hash2 = _passwordHasher.HashPassword(password, salt2);

        // Assert
        hash1.Should().NotBe(hash2);
    }

    [Fact]
    public void VerifyPassword_ShouldReturnTrueForCorrectPassword()
    {
        // Arrange
        var password = "TestPassword123";
        var salt = _passwordHasher.GenerateSalt();
        var hashedPassword = _passwordHasher.HashPassword(password, salt);

        // Act
        var result = _passwordHasher.VerifyPassword(password, hashedPassword, salt);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void VerifyPassword_ShouldReturnFalseForIncorrectPassword()
    {
        // Arrange
        var password = "TestPassword123";
        var wrongPassword = "WrongPassword456";
        var salt = _passwordHasher.GenerateSalt();
        var hashedPassword = _passwordHasher.HashPassword(password, salt);

        // Act
        var result = _passwordHasher.VerifyPassword(wrongPassword, hashedPassword, salt);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void VerifyPassword_ShouldReturnFalseForWrongSalt()
    {
        // Arrange
        var password = "TestPassword123";
        var salt1 = _passwordHasher.GenerateSalt();
        var salt2 = _passwordHasher.GenerateSalt();
        var hashedPassword = _passwordHasher.HashPassword(password, salt1);

        // Act
        var result = _passwordHasher.VerifyPassword(password, hashedPassword, salt2);

        // Assert
        result.Should().BeFalse();
    }
}
