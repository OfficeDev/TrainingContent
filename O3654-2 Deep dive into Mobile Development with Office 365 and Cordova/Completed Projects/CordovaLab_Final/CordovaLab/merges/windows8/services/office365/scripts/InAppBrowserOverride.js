/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

/*jslint sloppy:true */
/*global Windows:true, require, document, setTimeout, window, module */



(function ()
{
    var IAB = {
        close: function (win, lose) {
        },
        show: function (win, lose) {
        },
        open: function (win, lose, args) {
            var strUrl = args[0],
                target = args[1],
                features = args[2],
                url,
                elem;

            url = new Windows.Foundation.Uri(strUrl);

            if (target === "_system") {
                Windows.System.Launcher.launchUriAsync(url);
            } else if (target === "_blank") {
                var qs = strUrl.substr(strUrl.indexOf("?") + 1).split('#')[0];

                var qsMap = (function (a) {
                    if (a == "") return {};
                    var b = {};
                    for (var i = 0; i < a.length; ++i) {
                        var p = a[i].split('=');
                        if (p.length != 2) continue;
                        b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                    }
                    return b;
                })(qs.split('&'));

                var endURI = new Windows.Foundation.Uri(qsMap["redirect_uri"]);

                var self = {
                    channels: {
                        'loadstart': new Array()
                    },

                    addEventListener: function (eventname, f) {
                        if (eventname in this.channels) {
                            this.channels[eventname][this.channels[eventname].length] = f;
                        }
                    },
                    removeEventListener: function (eventname, f) {
                        if (eventname in this.channels) {
                            for (i = 0; i < this.channels[eventname].length; i++) {
                                if (i === f) {
                                    this.channels[eventname].splice(i, 1);
                                    break;
                                }
                            }
                        }
                    },
                };

                var successHandler = function (result) {
                    win({ url: result.responseData, type: "loadstart" });
                    if (result.responseStatus === Windows.Security.Authentication.Web.WebAuthenticationStatus.errorHttp) {
                    }
                };

                Windows.Security.Authentication.Web.WebAuthenticationBroker.authenticateAsync(Windows.Security.Authentication.Web.WebAuthenticationOptions.none, url, endURI).done(successHandler, function (err) {
                    lose({ message: err.message });
                });

            } else {
                window.location = strUrl;
            }


        },
    };

    document.addEventListener('deviceready', function () {
        window.cordova.commandProxy.remove("InAppBrowser");
        window.cordova.commandProxy.add("InAppBrowser", IAB);
    }, false);
})();
