// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

using Microsoft.Identity.Client;

namespace Helpers
{
  public class GraphUserAccount : Microsoft.Identity.Client.IAccount
  {
    public string Email;
    public string ObjectId;
    public string TenantId;
    public string Username { get; set; }
    public string Environment { get; set; }
    public AccountId HomeAccountId { get; set; }

    public GraphUserAccount(System.Security.Claims.ClaimsPrincipal claimsPrincipal)
    {
      this.Email = claimsPrincipal.FindFirst("preferred_username")?.Value;
      this.ObjectId = claimsPrincipal.FindFirst("http://schemas.microsoft.com/identity/claims/objectidentifier")?.Value;
      this.TenantId = claimsPrincipal.FindFirst("http://schemas.microsoft.com/identity/claims/tenantid")?.Value;

      this.Username = this.Email;
      this.Environment = "login.windows.net";
      this.HomeAccountId = new AccountId($"{this.ObjectId}.{this.TenantId}", this.ObjectId, this.TenantId);
    }
  }
}