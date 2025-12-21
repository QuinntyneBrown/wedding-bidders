using System.Security.Cryptography;

namespace WeddingBidders.Core.Services;

public class PasswordHasher : IPasswordHasher
{
    private const int Iterations = 10000;
    private const int SaltSize = 16; // 128 bits
    private const int HashSize = 32; // 256 bits

    public string HashPassword(string password, byte[] salt)
    {
        using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(HashSize);
        return Convert.ToBase64String(hash);
    }

    public bool VerifyPassword(string password, string hashedPassword, byte[] salt)
    {
        var hashToVerify = HashPassword(password, salt);
        return hashToVerify == hashedPassword;
    }

    public byte[] GenerateSalt()
    {
        var salt = new byte[SaltSize];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(salt);
        return salt;
    }
}
