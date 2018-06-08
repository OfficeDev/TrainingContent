using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace ClientCredsAddin.Models.JsonHelpers {

  public class AadUserResponseJson {
    [JsonProperty(PropertyName = "d")]
    public AadUserData Data { get; set; }
  }

  public class AadUserData {
    [JsonProperty(PropertyName = "results")]
    public AadUserJson[] Users { get; set; }
  }

  public class AadUserJson{
    public __Metadata __metadata { get; set; }
    public Manager manager { get; set; }
    public Directreports directReports { get; set; }
    public Members members { get; set; }
    public Memberof memberOf { get; set; }
    public Permissions permissions { get; set; }
    public Registereddevices registeredDevices { get; set; }
    public Owneddevices ownedDevices { get; set; }
    public string objectType { get; set; }
    public string objectId { get; set; }
    public bool accountEnabled { get; set; }
    public Assignedlicenses assignedLicenses { get; set; }
    public Assignedplans assignedPlans { get; set; }
    public object city { get; set; }
    public string country { get; set; }
    public object department { get; set; }
    public object dirSyncEnabled { get; set; }
    public string displayName { get; set; }
    public object facsimileTelephoneNumber { get; set; }
    public string givenName { get; set; }
    public object jobTitle { get; set; }
    public object lastDirSyncTime { get; set; }
    public string mail { get; set; }
    public string mailNickname { get; set; }
    public string mobile { get; set; }
    public Othermails otherMails { get; set; }
    public string passwordPolicies { get; set; }
    public object passwordProfile { get; set; }
    public object physicalDeliveryOfficeName { get; set; }
    public object postalCode { get; set; }
    public string preferredLanguage { get; set; }
    public Provisionedplans provisionedPlans { get; set; }
    public Provisioningerrors provisioningErrors { get; set; }
    public Proxyaddresses proxyAddresses { get; set; }
    public object state { get; set; }
    public object streetAddress { get; set; }
    public string surname { get; set; }
    public string telephoneNumber { get; set; }
    public Thumbnailphoto thumbnailPhoto { get; set; }
    public string usageLocation { get; set; }
    public string userPrincipalName { get; set; }
  }

  public class __Metadata {
    public string id { get; set; }
    public string uri { get; set; }
    public string type { get; set; }
    public Actions actions { get; set; }
  }

  public class Actions {
    public HttpsGraphWindowsNetB752a1097C4b43259608C81b3b4ff631MetadataDirectorydataserviceCheckmembergroups[] httpsgraphwindowsnetb752a1097c4b43259608c81b3b4ff631metadataDirectoryDataServicecheckMemberGroups { get; set; }
    public HttpsGraphWindowsNetB752a1097C4b43259608C81b3b4ff631MetadataDirectorydataserviceGetmembergroups[] httpsgraphwindowsnetb752a1097c4b43259608c81b3b4ff631metadataDirectoryDataServicegetMemberGroups { get; set; }
  }

  public class HttpsGraphWindowsNetB752a1097C4b43259608C81b3b4ff631MetadataDirectorydataserviceCheckmembergroups {
    public string title { get; set; }
    public string target { get; set; }
  }

  public class HttpsGraphWindowsNetB752a1097C4b43259608C81b3b4ff631MetadataDirectorydataserviceGetmembergroups {
    public string title { get; set; }
    public string target { get; set; }
  }

  public class Manager {
    public __Deferred __deferred { get; set; }
  }

  public class __Deferred {
    public string uri { get; set; }
  }

  public class Directreports {
    public __Deferred1 __deferred { get; set; }
  }

  public class __Deferred1 {
    public string uri { get; set; }
  }

  public class Members {
    public __Deferred2 __deferred { get; set; }
  }

  public class __Deferred2 {
    public string uri { get; set; }
  }

  public class Memberof {
    public __Deferred3 __deferred { get; set; }
  }

  public class __Deferred3 {
    public string uri { get; set; }
  }

  public class Permissions {
    public __Deferred4 __deferred { get; set; }
  }

  public class __Deferred4 {
    public string uri { get; set; }
  }

  public class Registereddevices {
    public __Deferred5 __deferred { get; set; }
  }

  public class __Deferred5 {
    public string uri { get; set; }
  }

  public class Owneddevices {
    public __Deferred6 __deferred { get; set; }
  }

  public class __Deferred6 {
    public string uri { get; set; }
  }

  public class Assignedlicenses {
    public __Metadata1 __metadata { get; set; }
    public Result1[] results { get; set; }
  }

  public class __Metadata1 {
    public string type { get; set; }
  }

  public class Result1 {
    public Disabledplans disabledPlans { get; set; }
    public string skuId { get; set; }
  }

  public class Disabledplans {
    public __Metadata2 __metadata { get; set; }
    public object[] results { get; set; }
  }

  public class __Metadata2 {
    public string type { get; set; }
  }

  public class Assignedplans {
    public __Metadata3 __metadata { get; set; }
    public Result2[] results { get; set; }
  }

  public class __Metadata3 {
    public string type { get; set; }
  }

  public class Result2 {
    public DateTime assignedTimestamp { get; set; }
    public string capabilityStatus { get; set; }
    public string service { get; set; }
    public string servicePlanId { get; set; }
  }

  public class Othermails {
    public __Metadata4 __metadata { get; set; }
    public string[] results { get; set; }
  }

  public class __Metadata4 {
    public string type { get; set; }
  }

  public class Provisionedplans {
    public __Metadata5 __metadata { get; set; }
    public Result3[] results { get; set; }
  }

  public class __Metadata5 {
    public string type { get; set; }
  }

  public class Result3 {
    public string capabilityStatus { get; set; }
    public string provisioningStatus { get; set; }
    public string service { get; set; }
  }

  public class Provisioningerrors {
    public __Metadata6 __metadata { get; set; }
    public object[] results { get; set; }
  }

  public class __Metadata6 {
    public string type { get; set; }
  }

  public class Proxyaddresses {
    public __Metadata7 __metadata { get; set; }
    public string[] results { get; set; }
  }

  public class __Metadata7 {
    public string type { get; set; }
  }

  public class Thumbnailphoto {
    public __Mediaresource __mediaresource { get; set; }
  }

  public class __Mediaresource {
    public string edit_media { get; set; }
  }

}