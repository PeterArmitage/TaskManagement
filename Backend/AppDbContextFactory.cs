using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Backend.Data;
using Microsoft.Extensions.Configuration;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("RENDER_STRING");
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(connectionString);

        // Create a configuration instance
        var configuration = new ConfigurationBuilder()
            .AddEnvironmentVariables()
            .Build();

        return new AppDbContext(optionsBuilder.Options, configuration);
    }
}