// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Microsoft.Identity.Web;

namespace IdentityWeb.Controllers
{
  [Authorize]
  public class UserController : Controller
  {
    private readonly ILogger<UserController> _logger;
    private readonly ITokenAcquisition _tokenAcquisition;

    public UserController(ILogger<UserController> logger, ITokenAcquisition tokenAcquisition)
    {
      _logger = logger;
      _tokenAcquisition = tokenAcquisition;
    }


    [AuthorizeForScopes(Scopes = new[] { "User.Read" })]
    public async Task<IActionResult> Index()
    {
      var graphServiceClient = new GraphServiceClient(new DelegateAuthenticationProvider(async (request) =>
      {
        var accessToken = await _tokenAcquisition.GetAccessTokenForUserAsync(new[] { "User.Read" });
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
      }));

      var user = await graphServiceClient.Me.Request().GetAsync();

      return View(user);
    }
  }
}