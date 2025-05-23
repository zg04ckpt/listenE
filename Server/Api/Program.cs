using Core.Modules.Auth.Configurations;
using Core.Modules.Auth.Interfaces.IServices;
using Core.Modules.Auth.Services;
using Core.Shared.DTOs;
using Core.Shared.Utilities;
using Data;
using Data.Repositories;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using Serilog;
using Serilog.Events;
using Core.Shared.Configurations;
using Core.Shared.Interfaces.IRepository;
using Core.Shared.Interfaces.IService;
using Core.Shared.Services;
using StackExchange.Redis;
using Api.Middlewares;
using Core.Modules.BasicListening.Interfaces;
using Core.Modules.BasicListening.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.HttpOverrides;
using Core.Modules.ToeicPractice.Interfaces.IService;
using Core.Modules.ToeicPractice.Services;
using Core.Modules.ToeicPractice.Interfaces.IRepository;
using Core.Modules.UserModule.Interfaces.IRepositories;
using Core.Modules.UserModule.Interfaces.IServices;
using Core.Modules.UserModule.Services;
using System.Security.Claims;


var builder = WebApplication.CreateBuilder(args);

// Add file logging
builder.Host.UseSerilog((context, config) => {
    config
        .MinimumLevel.Information()
        .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
        .WriteTo.Console()
        .WriteTo.File(
            path: "Logs/app-log-.txt",          
            rollingInterval: RollingInterval.Day,
            outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level:u3}] {Message}{NewLine}{Exception}"
        );
});

// Appconfig mapping
builder.Services.Configure<AuthConfig>(builder.Configuration.GetSection("AuthConfig"));
builder.Services.Configure<RedisConfig>(builder.Configuration.GetSection("RedisConfig"));
builder.Services.Configure<CookieConfiguration>(builder.Configuration.GetSection("Cookie"));
builder.Services.Configure<MailConfiguration>(builder.Configuration.GetSection("MailConfig"));
builder.Services.Configure<DefaultValues>(builder.Configuration.GetSection("DefaultValues"));
builder.Services.Configure<CommonConfig>(builder.Configuration.GetSection("CommonConfig"));

// Add db context
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseMySql(
        EnvHelper.GetMySQLConnectionString(),
        new MySqlServerVersion(new Version(8, 0, 37)));
});

// Add redis
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var redisConfig = ConfigurationOptions.Parse(
        builder.Configuration.GetSection("RedisConfig")["ConnectionString"]!, true);
    redisConfig.AbortOnConnectFail = false;
    return ConnectionMultiplexer.Connect(redisConfig);
});

#region Add repositories
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<IUserRepository,  UserRepository>();
builder.Services.AddScoped<IQuestionGroupRepository, QuestionGroupRepository>();
#endregion

#region Add services
builder.Services.AddHttpContextAccessor();

builder.Services.AddSingleton<IRedisService, RedisService>();
builder.Services.AddSingleton<IStorageService, StorageService>();
builder.Services.AddSingleton<IMailService, MailService>();

builder.Services.AddTransient<IAuthService, AuthService>();
builder.Services.AddTransient<ITopicService, TopicService>();
builder.Services.AddTransient<ITrackService, TrackService>();
builder.Services.AddTransient<ISegmentService, SegmentService>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IToeicQuestionService, ToeicQuestionService>();
builder.Services.AddTransient<IToeicQuestionTagService, ToeicQuestionTagService>();
#endregion

#region Add middlewares
builder.Services.AddTransient<HandleGlobalExceptionMiddleware>();
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
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.None; 
        options.SlidingExpiration = true;
        options.Events.OnRedirectToLogin = async context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            await context.Response.WriteAsJsonAsync(new ApiErrorDto
            {
                Code = ApiHelper.ErrorCodes.UNAUTHORIZED,
                Message = "Login to continue."
            });
        };
        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            return Task.CompletedTask;
        };
    })
    .AddGoogle("Google", options =>
    {
        options.ClientId = EnvHelper.GetGoogleClientId();
        options.ClientSecret = EnvHelper.GetGoogleClientSecret();
        options.SignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
        options.ClaimActions.MapJsonKey("image", "picture");
        options.Events.OnRedirectToAuthorizationEndpoint = context =>
        {
            context.RedirectUri = context.RedirectUri.Replace("http://", "https://");
            context.HttpContext.Response.Redirect(context.RedirectUri);
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

// Controller name
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
            Code = ApiHelper.ErrorCodes.FAILED_VALIDATION,
            Errors = errors
        });
    }; 
});

// Add cor
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllClients", builder =>
        builder.WithOrigins("http://localhost:5173", "https://listen-e.vercel.app")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials());
});

// Fix bug redirect_uri (gg auth) not correct, that cause by nginx redirect from https => http
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedHost;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// Add authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("OnlyAdmin", policy => policy.RequireClaim(ClaimTypes.Role, "Admin"));
    options.AddPolicy("OnlyManager", policy => policy.RequireClaim(ClaimTypes.Role, "Manager"));
});

var app = builder.Build();
app.UseForwardedHeaders();
app.UseCors("AllowAllClients");
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<HandleGlobalExceptionMiddleware>();

app.UseHttpsRedirection();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed data
using var scope = app.Services.CreateScope();
await Seeder.SeedData(scope.ServiceProvider.GetRequiredService<AppDbContext>());

app.Run();
