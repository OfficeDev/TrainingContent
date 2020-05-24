// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace ProductCatalog
{
  public static class ScopeValidator
  {

    /// <summary>
    /// When applied to a <see cref="HttpContext"/>, verifies that the user authenticated in the
    /// web API has any of the accepted scopes.
    /// If the authenticated user doesn't have any of these <paramref name="acceptedScopes"/>, the
    /// method throws an HTTP Unauthorized error with a message noting which scopes are expected in the token.
    /// </summary>
    /// <param name="acceptedScopes">Scopes accepted by this API</param>
    /// <exception cref="HttpRequestException"/> with a <see cref="HttpResponse.StatusCode"/> set to
    /// <see cref="HttpStatusCode.Unauthorized"/>
    public static void VerifyUserHasAnyAcceptedScope(this HttpContext context, params string[] acceptedScopes)
    {
      if (acceptedScopes == null)
      {
        throw new ArgumentNullException(nameof(acceptedScopes));
      }
      Claim scopeClaim = context?.User?.FindFirst("http://schemas.microsoft.com/identity/claims/scope");
      if (scopeClaim == null || !scopeClaim.Value.Split(' ').Intersect(acceptedScopes).Any())
      {
        context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        string message = $"The 'scope' claim doesn't contain scopes '{string.Join(",", acceptedScopes)}' or was not found";
        throw new HttpRequestException(message);
      }
    }
  }
}