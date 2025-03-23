using Core.Modules.AuthModule.Configurations;
using Core.Modules.AuthModule.Entities;
using Core.Modules.AuthModule.Interfaces.IServices;
using Core.Modules.AuthModule.Services;
using Core.Shared.DTOs;
using Core.Shared.Interfaces;
using Core.Shared.Utilities;
using Data;
using Data.Repositories;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;


var builder = WebApplication.CreateBuilder(args);


// Appconfig mapping
builder.Services.Configure<CookieConfiguration>(builder.Configuration.GetSection("Cookie"));

// Add db context
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(
        EnvHelper.GetMySQLConnectionString(),
        new MySqlServerVersion(new Version(8, 0, 37)));
});

builder.Services.AddHttpContextAccessor();

#region Add repositories
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
#endregion

#region Add services
builder.Services.AddTransient<IAuthService, AuthService>();
#endregion



// Add session_based auth
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
    .AddCookie(options =>
    {
        var cookieConfig = builder.Configuration.GetSection("Cookie").Get<CookieConfiguration>();
        options.Cookie.Name = cookieConfig.Name;
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        //options.Cookie.SecurePolicy = CookieSecurePolicy.Always; Set in product
        options.Cookie.SameSite = SameSiteMode.None; 
        options.SlidingExpiration = true;
        options.Events.OnRedirectToLogin = async context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsJsonAsync(new ApiErrorDto
            {
                Code = ApiErrorCodes.UNAUTHORIZED,
                Error = "Login to continue."
            });
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    });

// Add api version
builder.Services.AddApiVersioning(options =>
{
    options.ReportApiVersions = true;
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.ApiVersionReader = new UrlSegmentApiVersionReader();
});

// Config url
builder.Services.AddRouting(options => 
{
    options.LowercaseUrls = true;
});

// Controller
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Format json result
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Override failed validation response
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var errors = context.ModelState
            .Where(e => e.Value?.Errors.Count > 0)
            .Select(e => new ValidationErrorItem
            {
                Name = e.Key,
                Description = e.Value!.Errors.First().ErrorMessage,
            }).ToArray();

        return new BadRequestObjectResult(new ApiValidationErrorDto
        {
            Message = "Validation failed",
            Code = "INVALID_VALIDATION",
            Errors = errors
        });
    }; 
});

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed data
using var scope = app.Services.CreateScope();
await Seeder.SeedData(
    scope.ServiceProvider.GetRequiredService<AppDbContext>(),
    scope.ServiceProvider.GetRequiredService<IRepository<User>>(),
    scope.ServiceProvider.GetRequiredService<IRepository<Role>>(),
    scope.ServiceProvider.GetRequiredService<IRepository<UserRole>>());

app.Run();
