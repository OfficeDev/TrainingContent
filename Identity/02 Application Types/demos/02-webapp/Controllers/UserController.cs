// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

using Microsoft.Graph;

namespace _02_webapp.Controllers
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

  public async Task<IActionResult> Index()
  {
    var request = this._graphServiceClient.Me.Request().GetHttpRequestMessage();
    request.Properties["User"] = HttpContext.User;
    var response = await this._graphServiceClient.HttpProvider.SendAsync(request);
    var handler = new ResponseHandler(new Serializer());
    var user = await handler.HandleResponse<User>(response);

    return View(user);
  }
}
}