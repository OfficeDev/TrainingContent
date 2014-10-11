// from https://github.com/MSOpenTech/cordova-azure-mobile-services/blob/master/www/MobileServices.Web.Ext.js
// special patch to correctly work on Ripple emulator
if (window.tinyHippos) { // https://gist.github.com/triceam/4658021
    var restoreOriginalWindowOpen = function () {

        // if our module is called before InAppBrowser
        cordova.define.remove("org.apache.cordova.inappbrowser.inappbrowser");
        cordova.define("org.apache.cordova.inappbrowser.inappbrowser", function (require, exports, module) {
            module.exports = window.open;
        });

        // if our module is called after InAppBrowser
        var modulemapper = cordova.require('cordova/modulemapper');

        var restoreFunc = function (name) {
            var origFunc = modulemapper.getOriginalSymbol(window, 'window.' + name);
            if (origFunc) {
                window[name] = origFunc;
            }
        }

        restoreFunc('open');
    }

    document.addEventListener('deviceready', function () { restoreOriginalWindowOpen(); }, false);
}

