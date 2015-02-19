// Register script for MDS if possible
RegisterModuleInit("scenario1.js", RemoteManager_Inject); //MDS registration
RemoteManager_Inject(); //non MDS run

var cacheTimeout = 1800;
var currentTime;
var timeStamp;
var secondaryNavInjected;
var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();
var buildSecondaryNavigation;
var secondaryNavHtml;

if (typeof (Sys) != "undefined" && Boolean(Sys) && Boolean(Sys.Application)) {
    Sys.Application.notifyScriptLoaded();
}

if (typeof (NotifyScriptLoadedAndExecuteWaitingJobs) == "function") {
    NotifyScriptLoadedAndExecuteWaitingJobs("scenario1.js");
}

function RemoteManager_Inject() {

    var jQuery = "https://ajax.aspnetcdn.com/ajax/jQuery/jquery-2.0.2.min.js";

    // inject jQuery script tag into head and then call injectLinks
    loadScript(jQuery, function () {
        injectLinks();
    });
}

function injectLinks() {
    //assigning another alias to jQuery prevents issues if another script is using the $ variable.
    var $s = jQuery.noConflict();
    $s(document).ready(function () {
        // Get localstorage last updated timestamp values if they exist             
        timeStamp = localStorage.getItem("navTimeStamp");
        secondaryNavHtml = localStorage.getItem("navigation");
        // If nothing in localstorage
        if (timeStamp === "" || timeStamp == null || secondaryNavHtml ==="" || secondaryNavHtml == null) {
            // Key expired - Rebuild secondary navigation here and refresh key expiration
            buildNavigation();

            // Set timestamp for expiration
            currentTime = Math.floor((new Date().getTime()) / 1000);
            localStorage.setItem("navTimeStamp", currentTime);
        }
            // Check for expiration. If expired, rebuild navigation 
        else if (isKeyExpired("navTimeStamp")) {
            // Key expired - Rebuild secondary navigation here and refresh key expiration
            buildNavigation();

            // Set timestamp for expiration
            currentTime = Math.floor((new Date().getTime()) / 1000);
            localStorage.setItem("navTimeStamp", currentTime);
        }

        // Inject secondary navigation bar, check for ribbon element depends on site type: OD4B vs SP
        if ($s('#mysite-ribbonrow').length === 0) {
            $s('#s4-ribbonrow').before(secondaryNavHtml);
        }
        else{
            $s('#mysite-ribbonrow').before(secondaryNavHtml);
        }
    });
}

// Check to see if the key has expired
function isKeyExpired(timeStampKey) {

    // Retrieve the example setting for expiration in seconds
    var expiryStamp = localStorage.getItem(timeStampKey);

    if (expiryStamp != null && cacheTimeout != null) {
        // Retrieve the timestamp and compare against specified cache timeout settings to see if it is expired
        var currentTime = Math.floor((new Date().getTime()) / 1000);

        if (currentTime - parseInt(expiryStamp) > parseInt(cacheTimeout)) {
            return true; //Expired
        }
        else {
            return false;
        }
    }
    else {
        //default 
        return true;
    }
}

function buildNavigation() {
    // Retrieve navigation items from data source implementation should go here, replaced with hardcoded navigation elements to inject
    var insertDiv1 =
            "<div class='ms-dialogHidden ms-fullWidth noindex' id='injectionBar' style='border-top-color: rgb(42, 141, 212); border-top-width: 1px; border-top-style: solid; background-color: rgb(0, 114, 198);'>" +
               "<div class='ms-fullWidth removeFocusOutline' id='injectionBarTop' style='height: 30px; position: relative;'>" +
                   "<div class='o365cs-nav-header16 o365cs-base o365cst o365spo o365cs-topnavBGImage' id='O365_InjectionNavHeader' style='height: 30px;max-width: 1920px;' autoid='__Microsoft_O365_Shell_Core_templates_cs_b'>" +
                       "<div class='o365cs-nav-leftAlign o365cs-topnavBGColor'></div>" +
                       "<div class='o365cs-nav-rightAlign' id='O365_TopInjectionMenu'>" +
                           "<div class='o365cs-nav-headerRegion o365cs-topnavBGColor'>" +
                               "<div class='o365cs-nav-O365LinksContainer o365cs-topnavLinkBackground'>" +
                                   "<div class='o365cs-nav-O365Links' style='width: 180px;'><div>" +
                                       "<div style='display: none;'></div>" +
                                       "<div style='float: left;'>" +
                                       "<div class='o365cs-nav-topItem' style='height: 30px;'>" +
                                           "<div>" +
                                           "<a tabindex='0' style='padding-right: 20px;padding-left: 20px;height: 30px;line-height: 20px' title='Go to some site' class='o365button ms-font-m o365cs-nav-item o365cs-nav-link o365cs-topnavText ms-bgc-td-h' id='O365_MainLink_Link1' " +
                                           "role='menuitem' aria-disabled='false' aria-haspopup='false' aria-selected='false' aria-label='Go to some site' " +
                                           "href='http://msdn.microsoft.com'>" +
                                           "<span style='font-size: 12px;line-height:30px;'>Intranet</span>" +
                                           "<span style='display: none;'>" +
                                               "<span class='wf wf-o365-x18 wf-family-o365 header-downcarat' role='presentation></span>" +
                                           "</span>" +
                                           "<div class='o365cs-activeLinkIndicator ms-bcl-w' style='display: none;'></div>" +
                                           "</a>" +
                                           "</div>" +
                                           "<div style='display: none;'></div>" +
                                       "</div>" +
                                       "</div>" +
                                       "<div style='display: none'></div>" +
                                       "<div style='float: left;'>" +
                                       "<div class='o365cs-nav-topItem' style='height: 30px;'>" +
                                           "<div>" +
                                           "<a tabindex='1' style='padding-right: 20px;padding-left: 20px;height: 30px;;line-height: 20px' title='Go to some site' class='o365button ms-font-m o365cs-nav-item o365cs-nav-link o365cs-topnavText ms-bgc-td-h' id='O365_MainLink_Link2' " +
                                           "role='menuitem' aria-disabled='false' aria-haspopup='false' aria-selected='false' aria-label='Go to some site' " +
                                           "href='http://technet.microsoft.com'>" +
                                           "<span style='font-size: 12px;line-height:30px;'>Tools</span>" +
                                           "<span style='display: none;'>" +
                                               "<span class='wf wf-o365-x18 wf-family-o365 header-downcarat' role='presentation></span>" +
                                           "</span>" +
                                           "<div class='o365cs-activeLinkIndicator ms-bcl-w' style='display: none;'></div>" +
                                           "</a>" +
                                           "</div>" +
                                           "<div style='display: none;'></div>" +
                                       "</div>" +
                                       "</div>" +
                                   "</div>" +
                               "</div>" +
                           "</div>" +
                       "</div>" +
                   "</div>" +
               "</div>" +
           "</div>";
    //Store the navigation nodes in local storage
    localStorage.setItem("navigation", insertDiv1);
    secondaryNavHtml = insertDiv1;
}

function loadScript(url, callback) {
    var head = document.getElementsByTagName("head")[0];
    var script = document.createElement("script");
    script.src = url;

    // Attach handlers for all browsers
    var done = false;
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState
                    || this.readyState == "loaded"
                    || this.readyState == "complete")) {
            done = true;

            // Continue your code
            callback();

            // Handle memory leak in IE
            script.onload = script.onreadystatechange = null;
            head.removeChild(script);
        }
    };

    head.appendChild(script);
}
