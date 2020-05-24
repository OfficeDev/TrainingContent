// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.AzureAD.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.Identity.Client;
using System.Security.Claims;

namespace ProductCatalogWeb
{
  public class Startup
  {
    public Startup(IConfiguration configuration)
    {
      Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // This method gets called by the runtime. Use this method to add services to the container.
    public void ConfigureServices(IServiceCollection services)
    {
      services.AddAuthentication(AzureADDefaults.AuthenticationScheme)
          .AddAzureAD(options => Configuration.Bind("AzureAd", options));

      var appSettings = new AzureADOptions();
      Configuration.Bind("AzureAd", appSettings);

      var application = ConfidentialClientApplicationBuilder.Create(appSettings.ClientId)
                            .WithAuthority(appSettings.Instance + appSettings.TenantId + "/v2.0/")
                            .WithRedirectUri("https://localhost:5001" + appSettings.CallbackPath)
                            .WithClientSecret(appSettings.ClientSecret)
                            .Build();
      services.AddSingleton(application);

      services.Configure<OpenIdConnectOptions>(AzureADDefaults.OpenIdScheme, options =>
      {
        // configure authority to use v2 endpoint
        options.Authority = options.Authority + "/v2.0/";

        // asking Azure AD for id_token (to establish identity) and
        // authorization code (to get access/refresh tokens for calling services)
        options.ResponseType = OpenIdConnectResponseType.CodeIdToken;

        // add the permission scopes you want the application to use
        options.Scope.Add("offline_access");
        Constants.ProductCatalogAPI.SCOPES.ForEach(s => options.Scope.Add(s));

        options.TokenValidationParameters.NameClaimType = "preferred_username";

        // wire up event to do second part of code authorization flow (exchanging authorization code for token)
        var handler = options.Events.OnAuthorizationCodeReceived;
        options.Events.OnAuthorizationCodeReceived = async context =>
        {
          // handle the auth code returned post signin
          context.HandleCodeRedemption();
          if (!context.HttpContext.User.Claims.Any())
          {
            (context.HttpContext.User.Identity as ClaimsIdentity).AddClaims(context.Principal.Claims);
          }

          // get token
          var token = await application.AcquireTokenByAuthorizationCode(options.Scope, context.ProtocolMessage.Code).ExecuteAsync();

          context.HandleCodeRedemption(null, token.IdToken);
          await handler(context).ConfigureAwait(false);
        };
      });

      services.AddControllersWithViews(options =>
      {
        var policy = new AuthorizationPolicyBuilder()
                  .RequireAuthenticatedUser()
                  .Build();
        options.Filters.Add(new AuthorizeFilter(policy));
      });
      services.AddRazorPages();
    }

    // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
      if (env.IsDevelopment())
      {
        app.UseDeveloperExceptionPage();
      }
      else
      {
        app.UseExceptionHandler("/Home/Error");
        // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
        app.UseHsts();
      }
      app.UseHttpsRedirection();
      app.UseStaticFiles();

      app.UseRouting();

      app.UseAuthentication();
      app.UseAuthorization();

      app.UseEndpoints(endpoints =>
      {
        endpoints.MapControllerRoute(
                  name: "default",
                  pattern: "{controller=Home}/{action=Index}/{id?}");
        endpoints.MapRazorPages();
      });
    }
  }
}
