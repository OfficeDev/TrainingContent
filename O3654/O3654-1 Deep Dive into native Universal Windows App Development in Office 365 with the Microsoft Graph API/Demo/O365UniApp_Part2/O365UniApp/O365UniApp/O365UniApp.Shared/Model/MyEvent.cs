using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;

public class MyEvent {
  public string Id { get; set; }
  public string Subject { get; set; }
  public DateTimeOffset? Start { get; set; }
  public DateTimeOffset? End { get; set; }
  public string Location { get; set; }
  public string Body { get; set; }
}