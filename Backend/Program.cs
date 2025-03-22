using Microsoft.EntityFrameworkCore;
using Backend.Data;
using System.Text.Json.Serialization;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using DotNetEnv;

// Load environment variables
DotNetEnv.Env.Load();

// Create the builder
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    EnvironmentName = Environments.Production
});

// Load environment variables
var dbConnectionString = Environment.GetEnvironmentVariable("DB_CONNECTION_STRING");
var jwtKey = builder.Configuration.GetSection("AppSettings:Token").Value;
var allowedOrigins = new[] { "https://taskmanagementsystem25.netlify.app" };

// Validate environment variables
var environment = builder.Environment.EnvironmentName;
if (environment != "EF")
{
    if (string.IsNullOrEmpty(dbConnectionString) || string.IsNullOrEmpty(jwtKey))
    {
        throw new InvalidOperationException("DB_CONNECTION_STRING or JWT_KEY is not set.");
    }
}

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey ?? throw new InvalidOperationException("JWT_KEY is not set."))),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });

// Add DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(dbConnectionString ?? throw new InvalidOperationException("DB_CONNECTION_STRING is not set.")));

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Middleware pipeline
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Task Management API V1");
    c.RoutePrefix = string.Empty;
});

app.UseRouting();
app.UseCors("AllowSpecificOrigins");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Add logging middleware
app.Use(async (context, next) =>
{
    context.Response.Headers.Append("Access-Control-Allow-Origin", "https://taskmanagementsystem25.netlify.app");
    context.Response.Headers.Append("Access-Control-Allow-Credentials", "true");

    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
    logger.LogInformation($"Request: {context.Request.Method} {context.Request.Path}");

    await next();
});

app.Run();