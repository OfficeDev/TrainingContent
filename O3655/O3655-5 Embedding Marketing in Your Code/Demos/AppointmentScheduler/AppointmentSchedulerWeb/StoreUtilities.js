
/* To use the script, call the function like follows :
var buyURLLink;

getBuyURL("en-US","en-US",4,"{ce9460fd-2750-4d48-a32c-0498620550ca}").done(function(buyURL){
   // Add code here for the returned value
   buyURLLink = buyURL;   
});

*/
var licenseCollection;
var topLicense;
var xmlDoc;
var context;


function getBuyURL(var_purchaseMarket , var_numSeats, var_productID){
 var dfd = $.Deferred(function(){
	purchaseMarket = var_purchaseMarket;
	numSeats = var_numSeats;
	productID = var_productID;
	
	context = SP.ClientContext.get_current();

    //Retrieve license from SharePoint
    licenseCollection = SP.Utilities.Utility.getAppLicenseInformation(context, productID);
    

    context.executeQueryAsync(
         function(){
			var buyURL = "";
			 if (licenseCollection.get_count() > 0) {
				topLicense = licenseCollection.get_item(0).get_rawXMLLicenseToken();

				//debug
				//alert("License retrieved from SharePoint: \n" + topLicense);
				
				// parse asset ID
				xmlDoc = $.parseXML(topLicense);
				assetID = xmlDoc.getElementsByTagName("t")[0].getAttribute("aid");
				buyURL = getURLString(purchaseMarket , numSeats, assetID);
				
			}
			else {
				buyURL = "No License";
			}
          
            dfd.resolve(buyURL);
         },
         function(){
            dfd.reject(args.get_message());
         }
      );
   });
   return dfd.promise();
}



//Retrieval call succeeded (doesn't mean there is a license, look at the contents to see if there is one)
function getAssetID() {

    if (licenseCollection.get_count() > 0) {
        topLicense = licenseCollection.get_item(0).get_rawXMLLicenseToken();

        //debug
        //alert("License retrieved from SharePoint: \n" + topLicense);
        
		// parse asset ID
		xmlDoc = $.parseXML(topLicense);
		assetID = xmlDoc.getElementsByTagName("t")[0].getAttribute("aid");
		
		
    }
    else {
        alert("The user doesn't have a license");
    }
	
	//alert(getURLString(purchaseMarket , numSeats, assetID));

}

// This function is executed if the above call fails. This is possible if
function getAssetIDFail(sender, args) {
    alert('Failed to retrieve license. Please refresh the page and try again.' + args.get_message());
	assetID = "WA0000000"
		
	
}



function getURLString(purchaseMarket , numSeats, assetID){

	
	
	var SPHostWeb =  _spPageContextInfo.webAbsoluteUrl;	
	
	if (_spPageContextInfo.isAppWeb){
		var dotIndex = SPHostWeb.indexOf(".");
		var appWebStartIndex = SPHostWeb.lastIndexOf("/");
		var layoutsRoot = SPHostWeb.substring(0,dotIndex-15)+SPHostWeb.substring(dotIndex,appWebStartIndex); // Remove App Web from the URL to create Storefront URL at client side
	} 
	else {
		var layoutsRoot = SPHostWeb;
	}
	var storeFrontURL = layoutsRoot + "/" + _spPageContextInfo.layoutsUrl +  "/storefront.aspx";					
	
	var callBackURL = storeFrontURL + "?task=OfficeRedirect";					
	var callBackURLEncoded = encodeURIComponent(callBackURL);
	
	
	// Generate the same redirect url that sharepoint store uses to communicate with Office Store to preserve all logging and use flow
	
	var buyURL = storeFrontURL + "?task=GoToOfficeUrl"
				+ "&osut=3"
				+ "&clid=" + encodeURIComponent(_spPageContextInfo.currentUICultureName) 
				+ "&SPDeployID=1"
				+ "&SPStorefrontQueryStringForwardai=" + assetID 
				+ "&SPStorefrontQueryStringForwardPT=SharePointPurchase"
				+ "&SPStorefrontQueryStringForwardSeats=" + numSeats 
				+ "&SPStorefrontQueryStringForwardPM=" + purchaseMarket
				+ "&SPStorefrontQueryStringForwardcallbackurl=" + callBackURLEncoded
	   
	//console.log(buyURL);
	return buyURL;

}


function getReviewURL(productId){

	var reviewURL = "https://go.microsoft.com/fwlink/?LinkID=524410&clcid=0x409"
					+ "&productId=" + productId					
					+ "&cmu=" + _spPageContextInfo.currentUICultureName; // Automatically retrieve the user culture UI

	//console.log(reviewURL);
	return reviewURL;
}

function getReviewURL(productId, contentMarket){

	var reviewURL = "https://go.microsoft.com/fwlink/?LinkID=524410&clcid=0x409"
					+ "&productId=" + productId
					+ "&cmf=" + contentMarket
					+ "&cmu=" + _spPageContextInfo.currentUICultureName; // Automatically retrieve the user culture UI

	//console.log(reviewURL);
	return reviewURL;
}