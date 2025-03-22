using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Backend.Data;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var connectionString = "Host=dpg-cvfgr05ds78s73flnot0-a.oregon-postgres.render.com;Port=5432;Database=taskmanagementdb_i0ad;Username=taskmanagementdb_i0ad_user;Password=30DW0fsbrLi4byiHtX9w3qrhCeQrxwdD;SslMode=Require;";
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseNpgsql(connectionString);
        return new AppDbContext(); 
    }
}