/*
* Copyright (c) Microsoft Corporation. All rights reserved.
* Licensed under the MIT license.
*/
using System;

namespace OfficeDev.Talent.Management
{
  public class InterviewRequest
  {
      public Candidate Candidate { get; set; }
      public string ReqId { get; set; }
      public string PositionTitle { get; set; }
      public bool Remote { get; set; }
      public DateTime Date { get; set; }
  }
}