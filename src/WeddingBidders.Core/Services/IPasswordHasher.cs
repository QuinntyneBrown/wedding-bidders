namespace WeddingBidders.Core.Services;

public interface IPasswordHasher
{
    string HashPassword(string password, byte[] salt);
    bool VerifyPassword(string password, string hashedPassword, byte[] salt);
    byte[] GenerateSalt();
}
