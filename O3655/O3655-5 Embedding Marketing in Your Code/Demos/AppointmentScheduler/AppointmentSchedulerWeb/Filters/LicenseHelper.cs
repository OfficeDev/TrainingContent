using AppointmentSchedulerWeb.LicenseVerificationService;
using Microsoft.SharePoint.Client;
using System;
using System.Web;
using System.Xml;

namespace AppointmentSchedulerWeb.Filters
{
	public enum LicenseType { Free, Paid, Trial, None }
    public enum UserLimit { Ten, Twenty, Unlimited }
    public enum ExpirationPeriod { Month, Unlimited, None }

    public class LicenseHelper
    {


        public static string GetStorefrontUrl(VerifyEntitlementTokenResponse verifiedLicense, string hostWebUrl, string currentPageUrl, string appName)
        {
            String storeTemplateString = "{0}_layouts/15/storefront.aspx?source={1}&sname={2}&#vw=AppDetailsView,app={3},clg=0,cm=en-US";

            //Note: If you are using the hardcoded token provided in the sample this URL will always point to the Cheezburgers app. 
            return String.Format(storeTemplateString, hostWebUrl, currentPageUrl, appName, verifiedLicense.AssetId);

        }

        public static string GetStoreSearchUrl(string appName, string hostWebUrl, string currentPageUrl)
        {
            String storeSearchTemplateString = "{0}/_layouts/15/storefront.aspx?source={1}&sname={2}#qry={3}";
            return String.Format(storeSearchTemplateString, hostWebUrl, currentPageUrl, appName, appName);

        }

        /// <summary>
        /// Gets the review URL for the app using the productid. This allows you to predict the actual store review url 
        /// where the app will go live. 
        /// </summary>
        /// <owner alias="keithmg">Keith McGuinness</owner>
		public static string GetReviewURL(Guid appProductId)
		{
			return String.Format("http://store.office.com/writereview.aspx?p4=WA&productID={0}", appProductId);
		}

        public static VerifyEntitlementTokenResponse GetAndVerifyLicense(Guid productId, ClientContext ctx)
        {
            //Retrieve license from SharePoint
            string rawLicense = GetLicenseTokenFromSharePoint(productId, ctx);

            if (String.IsNullOrEmpty(rawLicense))
            {
                return null;// No license
            }

            //Validate license with the store
            VerifyEntitlementTokenResponse storeLicense = GetValidatedLicenseFromStore(rawLicense);
            
            return storeLicense;

        }

        private static string GetLicenseTokenFromSharePoint(Guid productId, ClientContext clientContext)
        {
            //Get the license from SP
            ClientResult<AppLicenseCollection> licenseCollection = Microsoft.SharePoint.Client.Utilities.Utility.GetAppLicenseInformation(clientContext, productId);
            clientContext.Load(clientContext.Web);
            clientContext.ExecuteQuery();

            string rawLicenseToken = null;

            foreach (AppLicense license in licenseCollection.Value)
            {
                //just get the first license; you could also traverse all licenses if required but usually the top one is enough because it the most 'relevant' 
                rawLicenseToken = license.RawXMLLicenseToken;
                break;
            }
            return (rawLicenseToken);
        }

        private static VerifyEntitlementTokenResponse GetValidatedLicenseFromStore(
            string rawLicenseToken)
        {
            VerificationServiceClient service = null;
            VerifyEntitlementTokenResponse result = null;
            VerifyEntitlementTokenRequest request = new VerifyEntitlementTokenRequest();
            request.EntitlementToken = rawLicenseToken;

            service = new VerificationServiceClient();
            result = service.VerifyEntitlementToken(request);
            return result;
        }

        private static string AddAttributesToToken(
            String inputXml, 
            String attributeName, 
            String attributeValue)
        {
            XmlDocument xmlDoc = new XmlDocument();
            xmlDoc.LoadXml(inputXml);

            XmlNodeList xmlNodeList = xmlDoc.GetElementsByTagName("t");

            foreach (XmlNode xmlNode in xmlNodeList)
            {
                try
                {
                    if (xmlNode.Attributes.GetNamedItem(attributeName).Value == null) { }
                }
                catch (Exception)
                {
                    XmlAttribute CountryAttr = xmlDoc.CreateAttribute(attributeName);
                    CountryAttr.Value = attributeValue;
                    xmlNode.Attributes.Append(CountryAttr);
                }
            }

            return xmlDoc.OuterXml;
        }

        public static string GenerateTestToken(
            LicenseType licenseType, 
            String productId, 
            UserLimit userLimit, 
            ExpirationPeriod expirationDays, 
            String purchaserId)
        {
            //Note that the AssetId matches that of the Cheezburgers app on the marketplace. 
            //This is just for TEST purposes so that the storefront URL takes you to a valid app page
            string hardCodedBaseToken = "<r v=\"0\"><t aid=\"WA103524926\"  did=\"{3F47392A-2308-4FC6-BF24-740626612B26}\"  ad=\"2012-06-19T21:48:56Z\"  te=\"2112-07-15T23:47:42Z\" sd=\"2012-02-01\" test=\"true\"/><d>449JFz+my0wNoCm0/h+Ci9DsF/W0Q8rqEBqjpe44KkY=</d></r>";



            string userLimitString = string.Empty;
            switch (userLimit){
                case UserLimit.Ten:
                    userLimitString = "10";
                    break;
                case UserLimit.Twenty:
                    userLimitString = "20";
                    break;
                case UserLimit.Unlimited:
                    userLimitString = "Unlimited";
                    break;
            }

            int expirationDaysNumber = 0;
            switch (expirationDays)
            {
                case ExpirationPeriod.Month:
                    expirationDaysNumber = 30;
                    break;
                case ExpirationPeriod.Unlimited:
                    expirationDaysNumber = 9999;
                    break;
                default:
                    expirationDaysNumber = -1;
                    break;

            }

            string tokenXml = hardCodedBaseToken;
            tokenXml = AddAttributesToToken(tokenXml, "pid", productId);
            tokenXml = AddAttributesToToken(tokenXml, "et", UppercaseFirst(licenseType.ToString()));
            tokenXml = AddAttributesToToken(tokenXml, "cid", purchaserId);

            //Set user limit
            if (licenseType == LicenseType.Free)
            {
                tokenXml = AddAttributesToToken(tokenXml, "ts", "0");
            }
            else
            {
                tokenXml = AddAttributesToToken(tokenXml, "ts", userLimitString);
            }

            //Set site license == unlimited users
            if (userLimitString == "Unlimited")
            {
                tokenXml = AddAttributesToToken(tokenXml, "sl", "true");
            }
            else
            {
                tokenXml = AddAttributesToToken(tokenXml, "sl", "false");
            }

            //Set expiration (only supported for Trials)
            if (licenseType == LicenseType.Trial)
            {
                DateTime expirationDate;
                if (expirationDaysNumber == -1)
                {
                    //expired token
                    expirationDate = DateTime.UtcNow.Subtract(TimeSpan.FromDays(10));
                }
                else if (expirationDaysNumber == 9999)
                {
                    //Unlimited trial
                    expirationDate = DateTime.MaxValue;
                }
                else
                {
                    //today + the selected number of days
                    expirationDate = DateTime.UtcNow.AddDays(expirationDaysNumber);
                }
                tokenXml = AddAttributesToToken(tokenXml, "ed", expirationDate.ToString("o"));

            }
            return tokenXml;
        }

        public static void ImportLicense(
            ClientContext ctx, 
            string licenseToken, 
            string iconUrl, 
            string appTitle, 
            string providerName)
        {
            Microsoft.SharePoint.Client.Utilities.Utility.ImportAppLicense(ctx,
                 licenseToken,
                 "en-US",
                 "US",
                 appTitle,
                 iconUrl,
                 providerName,
                 5);

            ctx.ExecuteQuery();
        }


        private static string UppercaseFirst(string s)
        {
            // Check for empty string.
            if (string.IsNullOrEmpty(s))
            {
                return string.Empty;
            }
            // Return char and concat substring.
            return char.ToUpper(s[0]) + s.Substring(1);
        }
    }
}