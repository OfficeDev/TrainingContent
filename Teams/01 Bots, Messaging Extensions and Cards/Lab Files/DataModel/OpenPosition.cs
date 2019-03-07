/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 */
namespace OfficeDev.Talent.Management
{
  public class OpenPosition
  {
    public string Title { get; set; }
    public int Applicants { get; set; }
    public int DaysOpen { get; set; }
    public string HiringManager { get; set; }
    public string ReqId { get; set; }
    public int Level { get; set; }
    public string Location { get; set; }
  }
}