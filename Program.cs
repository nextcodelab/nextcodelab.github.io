using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using nextcodelab.github.io;
using nextcodelab.github.io.Helpers;
using nextcodelab.github.io.Shared;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) });
MainLayout.devInfo = await InfoHelper.GetDevInfoAsync();
await builder.Build().RunAsync();
