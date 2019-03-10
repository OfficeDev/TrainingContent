/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */
namespace ToDoConnector.Models
{
  public class ConnectorSettings
  {
    public string AppType { get; set; }
    public string ConfigName { get; set; }
    public string ContentUrl { get; set; }
    public string EntityId { get; set; }
    public string UserObjectId { get; set; }
    public string WebHookUrl { get; set; }
  }
}