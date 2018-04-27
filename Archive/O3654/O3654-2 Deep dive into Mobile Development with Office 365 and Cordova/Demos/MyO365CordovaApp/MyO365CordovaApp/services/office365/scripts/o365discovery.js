var O365Discovery;
(function (O365Discovery) {
    O365Discovery.deferred;

    var Request = (function () {
        function Request(requestUri) {
            this.requestUri = requestUri;
            this.headers = {};
            this.disableCache = false;
        }
        return Request;
    })();
    O365Discovery.Request = Request;

    O365Discovery.capabilityScopes = {
        AllSites: {
            Read: 'AllSites.Read',
            Write: 'AllSites.Write',
            Manage: 'AllSites.Manage',
            FullControl: 'AllSites.FullControl'
        },
        MyFiles: {
            Read: 'MyFiles.Read',
            Write: 'MyFiles.Write'
        },
        user_impersonation: 'user_impersonation',
        full_access: 'full_access',
        Mail: {
            Read: 'Mail.Read',
            Write: 'Mail.Write',
            Sent: 'Mail.Send'
        },
        Calendars: {
            Read: 'Calendars.Read',
            Write: 'Calendars.Write'
        },
        Contacts: {
            Read: 'Contacts.Read',
            Write: 'Contacts.Write'
        }
    };

    (function (AccountType) {
        AccountType[AccountType["MicrosoftAccount"] = 1] = "MicrosoftAccount";
        AccountType[AccountType["OrganizationalId"] = 2] = "OrganizationalId";
    })(O365Discovery.AccountType || (O365Discovery.AccountType = {}));
    var AccountType = O365Discovery.AccountType;

    var ServiceCapability = (function () {
        function ServiceCapability(result) {
            this._result = result;
        }
        Object.defineProperty(ServiceCapability.prototype, "capability", {
            get: function () {
                return this._result.Capability;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ServiceCapability.prototype, "endpointUri", {
            get: function () {
                return this._result.ServiceEndpointUri;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ServiceCapability.prototype, "name", {
            get: function () {
                return this._result.ServiceName;
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(ServiceCapability.prototype, "resourceId", {
            get: function () {
                return this._result.ServiceResourceId;
            },
            enumerable: true,
            configurable: true
        });
        return ServiceCapability;
    })();
    O365Discovery.ServiceCapability = ServiceCapability;

    var Context = (function () {
        function Context(redirectUri) {
            this._discoveryUri = 'https://api.office.com/discovery/me/';
            this._redirectUri = 'http://localhost/';
            if (!redirectUri) {
                if (O365Auth.Settings.redirectUri) {
                    this._redirectUri = O365Auth.Settings.redirectUri;
                }
            } else {
                this._redirectUri = redirectUri;
            }
        }
        Context.prototype.getDeferred = function () {
            if (O365Discovery.deferred) {
                return O365Discovery.deferred();
            }

            return new Microsoft.Utility.Deferred();
        };

        Context.prototype.ajax = function (request) {
            var deferred = new Microsoft.Utility.Deferred(), xhr = new XMLHttpRequest();

            if (!request.method) {
                request.method = 'GET';
            }

            xhr.open(request.method.toUpperCase(), request.requestUri, true);

            if (request.headers) {
                for (name in request.headers) {
                    var value = request.headers[name];
                    xhr.setRequestHeader(name, request.headers[name]);
                }
            }

            xhr.onreadystatechange = function (e) {
                if (xhr.readyState == 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                        deferred.resolve(xhr.responseText);
                    } else {
                        deferred.reject(xhr);
                    }
                } else {
                    deferred.notify(xhr.readyState);
                }
            };

            if (request.data) {
                xhr.send(request.data);
            } else {
                xhr.send();
            }

            return deferred;
        };

        Context.prototype.getParameterByName = function (url, name) {
            var qmark = url.indexOf('?');

            if (qmark <= 0) {
                return '';
            }

            var regex = new RegExp('[\\?&]' + name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]') + '=([^&#]*)'), results = regex.exec(url.substr(qmark));

            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        };

        Context.prototype.firstSignIn = function (scopes, redirectUri) {
            if (!redirectUri) {
                redirectUri = this._redirectUri;
            }

            var deferred = this.getDeferred(), authorizationUri = this._discoveryUri + 'FirstSignIn?scope=' + scopes + '&redirect_uri=' + encodeURIComponent(redirectUri);

            var onRedirect = function (e) {
                var loadUri = e.url;

                if (loadUri.substr(0, redirectUri.length).toLowerCase() === redirectUri.toLowerCase()) {
                    ref.close();

                    var response = {
                        user_email: this.getParameterByName(loadUri, 'user_email'),
                        account_type: Number(this.getParameterByName(loadUri, 'account_type')),
                        authorization_service: this.getParameterByName(loadUri, 'authorization_service'),
                        token_service: this.getParameterByName(loadUri, 'token_service'),
                        scope: this.getParameterByName(loadUri, 'scope'),
                        unsupported_scope: this.getParameterByName(loadUri, 'unsupported_scope'),
                        discovery_service: this.getParameterByName(loadUri, 'discovery_service'),
                        discovery_resource: this.getParameterByName(loadUri, 'discovery_resource')
                    };

                    deferred.resolve(response);
                }
            }.bind(this);

            var ref = window.open(authorizationUri, '_blank', 'location=yes');

            if (!ref) {
                deferred.reject(new Microsoft.Utility.Exception('The logon dialog was blocked by popup blocker'));
            } else {
                ref.addEventListener('loadstart', onRedirect);

                if (window["tinyHippos"]) {
                    window["__rippleFireEvent"] = onRedirect;
                }
            }

            return deferred;
        };

        Context.prototype.services = function (getAccessTokenFn) {
            var _this = this;
            var deferred = new Microsoft.Utility.Deferred();

            getAccessTokenFn().then((function (value) {
                var request = new Request(_this._discoveryUri + '/services');
                request.headers['Accept'] = 'application/json;odata=verbose';
                request.headers['Authorization'] = 'Bearer ' + value;
                _this.ajax(request).then((function (value) {
                    var parsedData = JSON.parse(value), results = [];

                    parsedData.d.results.forEach(function (v, i, a) {
                        results.push(new ServiceCapability(v));
                    });

                    deferred.resolve(results);
                }).bind(_this), deferred.reject.bind(deferred));
            }).bind(this), deferred.reject.bind(deferred));

            return deferred;
        };

        Context.prototype.allServices = function () {
        };
        return Context;
    })();
    O365Discovery.Context = Context;
})(O365Discovery || (O365Discovery = {}));
//# sourceMappingURL=o365discovery.js.map
