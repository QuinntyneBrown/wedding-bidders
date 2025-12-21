using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using WeddingBidders.Infrastructure;

namespace WeddingBidders.Api.Tests.Integration;

public class WeddingBiddersWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureServices(services =>
        {
            // Remove the existing DbContext registration
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<WeddingBiddersContext>));

            if (descriptor != null)
            {
                services.Remove(descriptor);
            }

            // Add in-memory database for testing
            services.AddDbContext<WeddingBiddersContext>(options =>
            {
                options.UseInMemoryDatabase("WeddingBiddersTestDb_" + Guid.NewGuid());
            });

            // Build the service provider
            var sp = services.BuildServiceProvider();

            // Create the database
            using var scope = sp.CreateScope();
            var scopedServices = scope.ServiceProvider;
            var db = scopedServices.GetRequiredService<WeddingBiddersContext>();
            db.Database.EnsureCreated();
        });
    }
}
