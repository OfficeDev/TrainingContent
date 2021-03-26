// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

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
    private readonly GraphServiceClient _graphServiceClient;

    public UserController(ILogger<UserController> logger, GraphServiceClient graphServiceClient)
    {
      _logger = logger;
      _graphServiceClient = graphServiceClient;
    }


    [AuthorizeForScopes(Scopes = new[] { "User.Read" })]
    public async Task<IActionResult> Index()
    {
      var user = await _graphServiceClient.Me.Request().GetAsync();

      return View(user);
    }
  }
}
