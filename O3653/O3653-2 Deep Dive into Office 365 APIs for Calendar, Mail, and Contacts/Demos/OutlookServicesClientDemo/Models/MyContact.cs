using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel;

namespace OutlookServicesClientDemo.Models {
  public class MyContact {
    public string Id { get; set; }
    [DisplayName("First Name")]
    public string GivenName { get; set; }
    [DisplayName("Last Name")]
    public string Surname { get; set; }
    [DisplayName("Company")]
    public string CompanyName { get; set; }
    [DisplayName("Work Phone")]
    public string BusinessPhone { get; set; }
    [DisplayName("Home Phone")]
    public string HomePhone { get; set; }
    [DisplayName("Email Address")]
    public string EmailAddress { get; set; }
  }
}