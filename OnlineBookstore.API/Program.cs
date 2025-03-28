using Microsoft.EntityFrameworkCore;
using OnlineBookstore.API.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddDbContext<BookstoreContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// ✅ FIX: Add in-memory cache to support session
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession();
builder.Services.AddHttpContextAccessor();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000")  // MUST match your React app
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // ✅ needed for cookies/session
    });
});


var app = builder.Build();

app.UseRouting();
app.UseCors("AllowReactApp");
app.UseSession(); // ✅ This can now work!
app.UseAuthorization();

app.MapControllers();
app.Run();
