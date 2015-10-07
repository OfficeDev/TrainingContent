var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Microsoft;
(function (Microsoft) {
    (function (DirectoryServices) {
        (function (Extensions) {
            var ObservableBase = (function () {
                function ObservableBase() {
                    this._changedListeners = [];
                }
                Object.defineProperty(ObservableBase.prototype, "changed", {
                    get: function () {
                        return this._changed;
                    },
                    set: function (value) {
                        var _this = this;
                        this._changed = value;
                        this._changedListeners.forEach((function (value, index, array) {
                            try  {
                                value(_this);
                            } catch (e) {
                            }
                        }).bind(this));
                    },
                    enumerable: true,
                    configurable: true
                });


                ObservableBase.prototype.addChangedListener = function (eventFn) {
                    this._changedListeners.push(eventFn);
                };

                ObservableBase.prototype.removeChangedListener = function (eventFn) {
                    var index = this._changedListeners.indexOf(eventFn);
                    if (index >= 0) {
                        this._changedListeners.splice(index, 1);
                    }
                };
                return ObservableBase;
            })();
            Extensions.ObservableBase = ObservableBase;

            var ObservableCollection = (function (_super) {
                __extends(ObservableCollection, _super);
                function ObservableCollection() {
                    var items = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        items[_i] = arguments[_i + 0];
                    }
                    var _this = this;
                    _super.call(this);
                    this._changedListener = (function (changed) {
                        _this.changed = true;
                    }).bind(this);
                    this._array = items;
                }
                ObservableCollection.prototype.item = function (n) {
                    return this._array[n];
                };

                ObservableCollection.prototype.pop = function () {
                    this.changed = true;
                    var result = this._array.pop();
                    result.removeChangedListener(this._changedListener);
                    return result;
                };

                ObservableCollection.prototype.shift = function () {
                    this.changed = true;
                    var result = this._array.shift();
                    result.removeChangedListener(this._changedListener);
                    return result;
                };

                ObservableCollection.prototype.push = function () {
                    var _this = this;
                    var items = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        items[_i] = arguments[_i + 0];
                    }
                    items.forEach((function (value, index, array) {
                        try  {
                            value.addChangedListener(_this._changedListener);
                            _this._array.push(value);
                        } catch (e) {
                        }
                    }).bind(this));
                    this.changed = true;
                    return this._array.length;
                };

                ObservableCollection.prototype.splice = function (start, deleteCount) {
                    var _this = this;
                    var result = this._array.splice(start, deleteCount);
                    result.forEach((function (value, index, array) {
                        try  {
                            value.removeChangedListener(_this._changedListener);
                        } catch (e) {
                        }
                    }).bind(this));
                    this.changed = true;
                    return result;
                };

                ObservableCollection.prototype.unshift = function () {
                    var items = [];
                    for (var _i = 0; _i < (arguments.length - 0); _i++) {
                        items[_i] = arguments[_i + 0];
                    }
                    for (var index = items.length - 1; index >= 0; index--) {
                        try  {
                            items[index].addChangedListener(this._changedListener);
                            this._array.unshift(items[index]);
                        } catch (e) {
                        }
                    }
                    this.changed = true;
                    return this._array.length;
                };

                ObservableCollection.prototype.forEach = function (callbackfn, thisArg) {
                    this._array.forEach(callbackfn, thisArg);
                };

                ObservableCollection.prototype.map = function (callbackfn, thisArg) {
                    return this._array.map(callbackfn, thisArg);
                };

                ObservableCollection.prototype.filter = function (callbackfn, thisArg) {
                    return this._array.filter(callbackfn, thisArg);
                };

                ObservableCollection.prototype.reduce = function (callbackfn, initialValue) {
                    return this._array.reduce(callbackfn, initialValue);
                };

                ObservableCollection.prototype.reduceRight = function (callbackfn, initialValue) {
                    return this._array.reduceRight(callbackfn, initialValue);
                };

                Object.defineProperty(ObservableCollection.prototype, "length", {
                    get: function () {
                        return this._array.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                return ObservableCollection;
            })(ObservableBase);
            Extensions.ObservableCollection = ObservableCollection;

            var Request = (function () {
                function Request(requestUri) {
                    this.requestUri = requestUri;
                    this.headers = {};
                    this.disableCache = false;
                }
                return Request;
            })();
            Extensions.Request = Request;

            var DataContext = (function () {
                function DataContext(serviceRootUri, extraQueryParameters, getAccessTokenFn) {
                    this._noCache = Date.now();
                    this.serviceRootUri = serviceRootUri;
                    this.extraQueryParameters = extraQueryParameters;
                    this._getAccessTokenFn = getAccessTokenFn;
                }
                Object.defineProperty(DataContext.prototype, "serviceRootUri", {
                    get: function () {
                        return this._serviceRootUri;
                    },
                    set: function (value) {
                        if (value.lastIndexOf("/") === value.length - 1) {
                            value = value.substring(0, value.length - 1);
                        }

                        this._serviceRootUri = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(DataContext.prototype, "extraQueryParameters", {
                    get: function () {
                        return this._extraQueryParameters;
                    },
                    set: function (value) {
                        this._extraQueryParameters = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(DataContext.prototype, "disableCache", {
                    get: function () {
                        return this._disableCache;
                    },
                    set: function (value) {
                        this._disableCache = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                Object.defineProperty(DataContext.prototype, "disableCacheOverride", {
                    get: function () {
                        return this._disableCacheOverride;
                    },
                    set: function (value) {
                        this._disableCacheOverride = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                DataContext.prototype.ajax = function (request) {
                    var deferred = new Microsoft.Utility.Deferred();

                    var xhr = new XMLHttpRequest();

                    if (!request.method) {
                        request.method = 'GET';
                    }

                    xhr.open(request.method.toUpperCase(), request.requestUri, true);

                    if (request.headers) {
                        for (name in request.headers) {
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
                        if (typeof request.data === 'string') {
                            xhr.send(request.data);
                        } else {
                            xhr.send(JSON.stringify(request.data));
                        }
                    } else {
                        xhr.send();
                    }

                    return deferred;
                };

                DataContext.prototype.read = function (path) {
                    return this.request(new Request(this.serviceRootUri + ((this.serviceRootUri.lastIndexOf('/') != this.serviceRootUri.length - 1) ? '/' : '') + path));
                };

                DataContext.prototype.readUrl = function (url) {
                    return this.request(new Request(url));
                };

                DataContext.prototype.request = function (request) {
                    var _this = this;
                    var deferred;

                    this.augmentRequest(request);

                    if (this._getAccessTokenFn) {
                        deferred = new Microsoft.Utility.Deferred();

                        this._getAccessTokenFn().then((function (token) {
                            request.headers["X-ClientService-ClientTag"] = 'Office 365 API Tools, 1.1.0512';
                            request.headers["Authorization"] = 'Bearer ' + token;
                            _this.ajax(request).then(deferred.resolve.bind(deferred), deferred.reject.bind(deferred));
                        }).bind(this), deferred.reject.bind(deferred));
                    } else {
                        deferred = this.ajax(request);
                    }

                    return deferred;
                };

                DataContext.prototype.augmentRequest = function (request) {
                    if (!request.headers) {
                        request.headers = {};
                    }

                    if (!request.headers['Accept']) {
                        request.headers['Accept'] = 'application/json';
                    }

                    if (!request.headers['Content-Type']) {
                        request.headers['Content-Type'] = 'application/json';
                    }

                    if (this.extraQueryParameters) {
                        request.requestUri += (request.requestUri.indexOf('?') >= 0 ? '&' : '?') + this.extraQueryParameters;
                    }

                    if ((!this._disableCacheOverride && request.disableCache) || (this._disableCacheOverride && this._disableCache)) {
                        request.requestUri += (request.requestUri.indexOf('?') >= 0 ? '&' : '?') + '_=' + this._noCache++;
                    }
                };
                return DataContext;
            })();
            Extensions.DataContext = DataContext;

            var PagedCollection = (function () {
                function PagedCollection(context, path, resultFn, data) {
                    this._context = context;
                    this._path = path;
                    this._resultFn = resultFn;
                    this._data = data;
                }
                Object.defineProperty(PagedCollection.prototype, "path", {
                    get: function () {
                        return this._path;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(PagedCollection.prototype, "context", {
                    get: function () {
                        return this._context;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(PagedCollection.prototype, "currentPage", {
                    get: function () {
                        return this._data;
                    },
                    enumerable: true,
                    configurable: true
                });

                PagedCollection.prototype.getNextPage = function () {
                    var _this = this;
                    var deferred = new Microsoft.Utility.Deferred();

                    if (this.path == null) {
                        deferred.resolve(null);
                        return deferred;
                    }

                    var request = new Request(this.path);

                    request.disableCache = true;

                    this.context.request(request).then((function (data) {
                        var parsedData = JSON.parse(data), nextLink = (parsedData['odata.nextLink'] === undefined) ? ((parsedData['@odata.nextLink'] === undefined) ? ((parsedData['__next'] === undefined) ? null : parsedData['__next']) : parsedData['@odata.nextLink']) : parsedData['odata.nextLink'];

                        deferred.resolve(new PagedCollection(_this.context, nextLink, _this._resultFn, _this._resultFn(_this.context, parsedData)));
                    }).bind(this), deferred.reject.bind(deferred));

                    return deferred;
                };
                return PagedCollection;
            })();
            Extensions.PagedCollection = PagedCollection;

            var CollectionQuery = (function () {
                function CollectionQuery(context, path, resultFn) {
                    this._context = context;
                    this._path = path;
                    this._resultFn = resultFn;
                }
                Object.defineProperty(CollectionQuery.prototype, "path", {
                    get: function () {
                        return this._path;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(CollectionQuery.prototype, "context", {
                    get: function () {
                        return this._context;
                    },
                    enumerable: true,
                    configurable: true
                });

                CollectionQuery.prototype.filter = function (filter) {
                    this.addQuery("$filter=" + filter);
                    return this;
                };

                CollectionQuery.prototype.select = function (selection) {
                    if (typeof selection === 'string') {
                        this.addQuery("$select=" + selection);
                    } else if (Array.isArray(selection)) {
                        this.addQuery("$select=" + selection.join(','));
                    } else {
                        throw new Microsoft.Utility.Exception('\'select\' argument must be string or string[].');
                    }
                    return this;
                };

                CollectionQuery.prototype.expand = function (expand) {
                    if (typeof expand === 'string') {
                        this.addQuery("$expand=" + expand);
                    } else if (Array.isArray(expand)) {
                        this.addQuery("$expand=" + expand.join(','));
                    } else {
                        throw new Microsoft.Utility.Exception('\'expand\' argument must be string or string[].');
                    }
                    return this;
                };

                CollectionQuery.prototype.orderBy = function (orderBy) {
                    if (typeof orderBy === 'string') {
                        this.addQuery("$orderby=" + orderBy);
                    } else if (Array.isArray(orderBy)) {
                        this.addQuery("$orderby=" + orderBy.join(','));
                    } else {
                        throw new Microsoft.Utility.Exception('\'orderBy\' argument must be string or string[].');
                    }
                    return this;
                };

                CollectionQuery.prototype.top = function (top) {
                    this.addQuery("$top=" + top);
                    return this;
                };

                CollectionQuery.prototype.skip = function (skip) {
                    this.addQuery("$skip=" + skip);
                    return this;
                };

                CollectionQuery.prototype.addQuery = function (query) {
                    this._query = (this._query ? this._query + "&" : "") + query;
                    return this;
                };

                Object.defineProperty(CollectionQuery.prototype, "query", {
                    get: function () {
                        return this._query;
                    },
                    set: function (value) {
                        this._query = value;
                    },
                    enumerable: true,
                    configurable: true
                });


                CollectionQuery.prototype.fetch = function () {
                    var path = this.path + (this._query ? (this.path.indexOf('?') < 0 ? '?' : '&') + this._query : "");

                    return new Microsoft.DirectoryServices.Extensions.PagedCollection(this.context, path, this._resultFn).getNextPage();
                };

                CollectionQuery.prototype.fetchAll = function (maxItems) {
                    var path = this.path + (this._query ? (this.path.indexOf('?') < 0 ? '?' : '&') + this._query : ""), pagedItems = new Microsoft.DirectoryServices.Extensions.PagedCollection(this.context, path, this._resultFn), accumulator = [], deferred = new Microsoft.Utility.Deferred(), recursive = function (nextPagedItems) {
                        if (!nextPagedItems) {
                            deferred.resolve(accumulator);
                        } else {
                            accumulator = accumulator.concat(nextPagedItems.currentPage);

                            if (accumulator.length > maxItems) {
                                accumulator = accumulator.splice(maxItems);
                                deferred.resolve(accumulator);
                            } else {
                                nextPagedItems.getNextPage().then(function (nextPage) {
                                    return recursive(nextPage);
                                }, deferred.reject.bind(deferred));
                            }
                        }
                    };

                    pagedItems.getNextPage().then(function (nextPage) {
                        return recursive(nextPage);
                    }, deferred.reject.bind(deferred));

                    return deferred;
                };
                return CollectionQuery;
            })();
            Extensions.CollectionQuery = CollectionQuery;

            var QueryableSet = (function () {
                function QueryableSet(context, path, entity) {
                    this._context = context;
                    this._path = path;
                    this._entity = entity;
                }
                Object.defineProperty(QueryableSet.prototype, "context", {
                    get: function () {
                        return this._context;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(QueryableSet.prototype, "entity", {
                    get: function () {
                        return this._entity;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(QueryableSet.prototype, "path", {
                    get: function () {
                        return this._path;
                    },
                    enumerable: true,
                    configurable: true
                });

                QueryableSet.prototype.getPath = function (prop) {
                    return this._path + '/' + prop;
                };
                return QueryableSet;
            })();
            Extensions.QueryableSet = QueryableSet;

            var RestShallowObjectFetcher = (function () {
                function RestShallowObjectFetcher(context, path) {
                    this._path = path;
                    this._context = context;
                }
                Object.defineProperty(RestShallowObjectFetcher.prototype, "context", {
                    get: function () {
                        return this._context;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(RestShallowObjectFetcher.prototype, "path", {
                    get: function () {
                        return this._path;
                    },
                    enumerable: true,
                    configurable: true
                });

                RestShallowObjectFetcher.prototype.getPath = function (prop) {
                    return this._path + '/' + prop;
                };
                return RestShallowObjectFetcher;
            })();
            Extensions.RestShallowObjectFetcher = RestShallowObjectFetcher;

            var ComplexTypeBase = (function (_super) {
                __extends(ComplexTypeBase, _super);
                function ComplexTypeBase() {
                    _super.call(this);
                }
                return ComplexTypeBase;
            })(ObservableBase);
            Extensions.ComplexTypeBase = ComplexTypeBase;

            var EntityBase = (function (_super) {
                __extends(EntityBase, _super);
                function EntityBase(context, path) {
                    _super.call(this);
                    this._path = path;
                    this._context = context;
                }
                Object.defineProperty(EntityBase.prototype, "context", {
                    get: function () {
                        return this._context;
                    },
                    enumerable: true,
                    configurable: true
                });

                Object.defineProperty(EntityBase.prototype, "path", {
                    get: function () {
                        return this._path;
                    },
                    enumerable: true,
                    configurable: true
                });

                EntityBase.prototype.getPath = function (prop) {
                    return this._path + '/' + prop;
                };
                return EntityBase;
            })(ObservableBase);
            Extensions.EntityBase = EntityBase;

            function isUndefined(v) {
                return typeof v === 'undefined';
            }
            Extensions.isUndefined = isUndefined;
        })(DirectoryServices.Extensions || (DirectoryServices.Extensions = {}));
        var Extensions = DirectoryServices.Extensions;
    })(Microsoft.DirectoryServices || (Microsoft.DirectoryServices = {}));
    var DirectoryServices = Microsoft.DirectoryServices;
})(Microsoft || (Microsoft = {}));

var Microsoft;
(function (Microsoft) {
    (function (DirectoryServices) {
        var ActiveDirectoryClient = (function () {
            function ActiveDirectoryClient(serviceRootUri, getAccessTokenFn) {
                this._context = new Microsoft.DirectoryServices.Extensions.DataContext(serviceRootUri, "api-version=1.5", getAccessTokenFn);
            }
            Object.defineProperty(ActiveDirectoryClient.prototype, "context", {
                get: function () {
                    return this._context;
                },
                enumerable: true,
                configurable: true
            });

            ActiveDirectoryClient.prototype.getPath = function (prop) {
                return this.context.serviceRootUri + '/' + prop;
            };

            Object.defineProperty(ActiveDirectoryClient.prototype, "directoryObjects", {
                get: function () {
                    if (this._directoryObjects === undefined) {
                        this._directoryObjects = new DirectoryObjects(this.context, this.getPath('directoryObjects'));
                    }
                    return this._directoryObjects;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ActiveDirectoryClient.prototype, "oauth2PermissionGrants", {
                get: function () {
                    if (this._oauth2PermissionGrants === undefined) {
                        this._oauth2PermissionGrants = new OAuth2PermissionGrants(this.context, this.getPath('oauth2PermissionGrants'));
                    }
                    return this._oauth2PermissionGrants;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ActiveDirectoryClient.prototype, "subscribedSkus", {
                get: function () {
                    if (this._subscribedSkus === undefined) {
                        this._subscribedSkus = new SubscribedSkus(this.context, this.getPath('subscribedSkus'));
                    }
                    return this._subscribedSkus;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ActiveDirectoryClient.prototype, "deletedDirectoryObjects", {
                get: function () {
                    if (this._deletedDirectoryObjects === undefined) {
                        this._deletedDirectoryObjects = new DirectoryObjects(this.context, this.getPath('deletedDirectoryObjects'));
                    }
                    return this._deletedDirectoryObjects;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ActiveDirectoryClient.prototype, "users", {
                get: function () {
                    if (this._users === undefined) {
                        this._users = new Users(this.context, this.getPath('users'));
                    }
                    return this._users;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ActiveDirectoryClient.prototype, "applications", {
                get: function () {
                    if (this._applications === undefined) {
                        this._applications = new Applications(this.context, this.getPath('applications'));
                    }
                    return this._applications;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ActiveDirectoryClient.prototype, "contacts", {
                get: function () {
                    if (this._contacts === undefined) {
                        this._contacts = new Contacts(this.context, this.getPath('contacts'));
                    }
                    return this._contacts;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ActiveDirectoryClient.prototype, "groups", {
                get: function () {
                    if (this._groups === undefined) {
                        this._groups = new Groups(this.context, this.getPath('groups'));
                    }
                    return this._groups;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ActiveDirectoryClient.prototype, "directoryRoles", {
                get: function () {
                    if (this._directoryRoles === undefined) {
                        this._directoryRoles = new DirectoryRoles(this.context, this.getPath('directoryRoles'));
                    }
                    return this._directoryRoles;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ActiveDirectoryClient.prototype, "servicePrincipals", {
                get: function () {
                    if (this._servicePrincipals === undefined) {
                        this._servicePrincipals = new ServicePrincipals(this.context, this.getPath('servicePrincipals'));
                    }
                    return this._servicePrincipals;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ActiveDirectoryClient.prototype, "tenantDetails", {
                get: function () {
                    if (this._tenantDetails === undefined) {
                        this._tenantDetails = new TenantDetails(this.context, this.getPath('tenantDetails'));
                    }
                    return this._tenantDetails;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ActiveDirectoryClient.prototype, "devices", {
                get: function () {
                    if (this._devices === undefined) {
                        this._devices = new Devices(this.context, this.getPath('devices'));
                    }
                    return this._devices;
                },
                enumerable: true,
                configurable: true
            });

            ActiveDirectoryClient.prototype.isMemberOf = function (groupId, memberId) {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("IsMemberOf"));

                request.method = 'POST';
                request.data = JSON.stringify({ "groupId": groupId, "memberId": memberId });

                this.context.request(request).then((function (data) {
                    var parsedData = JSON.parse(data);
                    deferred.resolve(parsedData);
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return ActiveDirectoryClient;
        })();
        DirectoryServices.ActiveDirectoryClient = ActiveDirectoryClient;

        var DirectoryObjectFetcher = (function (_super) {
            __extends(DirectoryObjectFetcher, _super);
            function DirectoryObjectFetcher(context, path) {
                _super.call(this, context, path);
            }
            Object.defineProperty(DirectoryObjectFetcher.prototype, "createdOnBehalfOf", {
                get: function () {
                    if (this._createdOnBehalfOf === undefined) {
                        this._createdOnBehalfOf = new DirectoryObjectFetcher(this.context, this.getPath("createdOnBehalfOf"));
                    }
                    return this._createdOnBehalfOf;
                },
                enumerable: true,
                configurable: true
            });

            DirectoryObjectFetcher.prototype.update_createdOnBehalfOf = function (value) {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("$links/createdOnBehalfOf"));

                request.method = 'PUT';
                request.data = JSON.stringify({ url: value.path });

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            Object.defineProperty(DirectoryObjectFetcher.prototype, "createdObjects", {
                get: function () {
                    if (this._createdObjects === undefined) {
                        this._createdObjects = new DirectoryObjects(this.context, this.getPath("createdObjects"));
                    }
                    return this._createdObjects;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryObjectFetcher.prototype, "manager", {
                get: function () {
                    if (this._manager === undefined) {
                        this._manager = new DirectoryObjectFetcher(this.context, this.getPath("manager"));
                    }
                    return this._manager;
                },
                enumerable: true,
                configurable: true
            });

            DirectoryObjectFetcher.prototype.update_manager = function (value) {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("$links/manager"));

                request.method = 'PUT';
                request.data = JSON.stringify({ url: value.path });

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            Object.defineProperty(DirectoryObjectFetcher.prototype, "directReports", {
                get: function () {
                    if (this._directReports === undefined) {
                        this._directReports = new DirectoryObjects(this.context, this.getPath("directReports"));
                    }
                    return this._directReports;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryObjectFetcher.prototype, "members", {
                get: function () {
                    if (this._members === undefined) {
                        this._members = new DirectoryObjects(this.context, this.getPath("members"));
                    }
                    return this._members;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryObjectFetcher.prototype, "memberOf", {
                get: function () {
                    if (this._memberOf === undefined) {
                        this._memberOf = new DirectoryObjects(this.context, this.getPath("memberOf"));
                    }
                    return this._memberOf;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryObjectFetcher.prototype, "owners", {
                get: function () {
                    if (this._owners === undefined) {
                        this._owners = new DirectoryObjects(this.context, this.getPath("owners"));
                    }
                    return this._owners;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryObjectFetcher.prototype, "ownedObjects", {
                get: function () {
                    if (this._ownedObjects === undefined) {
                        this._ownedObjects = new DirectoryObjects(this.context, this.getPath("ownedObjects"));
                    }
                    return this._ownedObjects;
                },
                enumerable: true,
                configurable: true
            });

            DirectoryObjectFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/directoryObjects' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(DirectoryObject.parseDirectoryObject(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };

            DirectoryObjectFetcher.prototype.checkMemberGroups = function (groupIds) {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("CheckMemberGroups"));

                request.method = 'POST';
                request.data = JSON.stringify({ "groupIds": groupIds });

                this.context.request(request).then((function (data) {
                    var parsedData = JSON.parse(data);
                    deferred.resolve(parsedData.value);
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };

            DirectoryObjectFetcher.prototype.getMemberGroups = function (securityEnabledOnly) {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("GetMemberGroups"));

                request.method = 'POST';
                request.data = JSON.stringify({ "securityEnabledOnly": securityEnabledOnly });

                this.context.request(request).then((function (data) {
                    var parsedData = JSON.parse(data);
                    deferred.resolve(parsedData.value);
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };

            DirectoryObjectFetcher.prototype.getMemberObjects = function (securityEnabledOnly) {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("GetMemberObjects"));

                request.method = 'POST';
                request.data = JSON.stringify({ "securityEnabledOnly": securityEnabledOnly });

                this.context.request(request).then((function (data) {
                    var parsedData = JSON.parse(data);
                    deferred.resolve(parsedData.value);
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return DirectoryObjectFetcher;
        })(DirectoryServices.Extensions.RestShallowObjectFetcher);
        DirectoryServices.DirectoryObjectFetcher = DirectoryObjectFetcher;

        var DirectoryObject = (function (_super) {
            __extends(DirectoryObject, _super);
            function DirectoryObject(context, path, data) {
                _super.call(this, context, path);
                this._odataType = 'Microsoft.DirectoryServices.DirectoryObject';
                this._objectTypeChanged = false;
                this._objectIdChanged = false;
                this._deletionTimestampChanged = false;

                if (!data) {
                    return;
                }

                this._objectType = data.objectType;
                this._objectId = data.objectId;
                this._deletionTimestamp = (data.deletionTimestamp !== null) ? new Date(data.deletionTimestamp) : null;
            }
            Object.defineProperty(DirectoryObject.prototype, "objectType", {
                get: function () {
                    return this._objectType;
                },
                set: function (value) {
                    if (value !== this._objectType) {
                        this._objectTypeChanged = true;
                        this.changed = true;
                    }
                    this._objectType = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryObject.prototype, "objectTypeChanged", {
                get: function () {
                    return this._objectTypeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryObject.prototype, "objectId", {
                get: function () {
                    return this._objectId;
                },
                set: function (value) {
                    if (value !== this._objectId) {
                        this._objectIdChanged = true;
                        this.changed = true;
                    }
                    this._objectId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryObject.prototype, "objectIdChanged", {
                get: function () {
                    return this._objectIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryObject.prototype, "deletionTimestamp", {
                get: function () {
                    return this._deletionTimestamp;
                },
                set: function (value) {
                    if (value !== this._deletionTimestamp) {
                        this._deletionTimestampChanged = true;
                        this.changed = true;
                    }
                    this._deletionTimestamp = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryObject.prototype, "deletionTimestampChanged", {
                get: function () {
                    return this._deletionTimestampChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryObject.prototype, "createdOnBehalfOf", {
                get: function () {
                    if (this._createdOnBehalfOf === undefined) {
                        this._createdOnBehalfOf = new DirectoryObjectFetcher(this.context, this.getPath("createdOnBehalfOf"));
                    }
                    return this._createdOnBehalfOf;
                },
                enumerable: true,
                configurable: true
            });

            DirectoryObject.prototype.update_createdOnBehalfOf = function (value) {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("$links/createdOnBehalfOf"));

                request.method = 'PUT';
                request.data = JSON.stringify({ url: value.path });

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            Object.defineProperty(DirectoryObject.prototype, "createdObjects", {
                get: function () {
                    if (this._createdObjects === undefined) {
                        this._createdObjects = new DirectoryObjects(this.context, this.getPath("createdObjects"));
                    }
                    return this._createdObjects;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryObject.prototype, "manager", {
                get: function () {
                    if (this._manager === undefined) {
                        this._manager = new DirectoryObjectFetcher(this.context, this.getPath("manager"));
                    }
                    return this._manager;
                },
                enumerable: true,
                configurable: true
            });

            DirectoryObject.prototype.update_manager = function (value) {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("$links/manager"));

                request.method = 'PUT';
                request.data = JSON.stringify({ url: value.path });

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            Object.defineProperty(DirectoryObject.prototype, "directReports", {
                get: function () {
                    if (this._directReports === undefined) {
                        this._directReports = new DirectoryObjects(this.context, this.getPath("directReports"));
                    }
                    return this._directReports;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryObject.prototype, "members", {
                get: function () {
                    if (this._members === undefined) {
                        this._members = new DirectoryObjects(this.context, this.getPath("members"));
                    }
                    return this._members;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryObject.prototype, "memberOf", {
                get: function () {
                    if (this._memberOf === undefined) {
                        this._memberOf = new DirectoryObjects(this.context, this.getPath("memberOf"));
                    }
                    return this._memberOf;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryObject.prototype, "owners", {
                get: function () {
                    if (this._owners === undefined) {
                        this._owners = new DirectoryObjects(this.context, this.getPath("owners"));
                    }
                    return this._owners;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryObject.prototype, "ownedObjects", {
                get: function () {
                    if (this._ownedObjects === undefined) {
                        this._ownedObjects = new DirectoryObjects(this.context, this.getPath("ownedObjects"));
                    }
                    return this._ownedObjects;
                },
                enumerable: true,
                configurable: true
            });

            DirectoryObject.prototype.checkMemberGroups = function (groupIds) {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("CheckMemberGroups"));

                request.method = 'POST';
                request.data = JSON.stringify({ "groupIds": groupIds });

                this.context.request(request).then((function (data) {
                    var parsedData = JSON.parse(data);
                    deferred.resolve(parsedData.value);
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };

            DirectoryObject.prototype.getMemberGroups = function (securityEnabledOnly) {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("GetMemberGroups"));

                request.method = 'POST';
                request.data = JSON.stringify({ "securityEnabledOnly": securityEnabledOnly });

                this.context.request(request).then((function (data) {
                    var parsedData = JSON.parse(data);
                    deferred.resolve(parsedData.value);
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };

            DirectoryObject.prototype.getMemberObjects = function (securityEnabledOnly) {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("GetMemberObjects"));

                request.method = 'POST';
                request.data = JSON.stringify({ "securityEnabledOnly": securityEnabledOnly });

                this.context.request(request).then((function (data) {
                    var parsedData = JSON.parse(data);
                    deferred.resolve(parsedData.value);
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };

            DirectoryObject.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/directoryObjects' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(DirectoryObject.parseDirectoryObject(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            DirectoryObject.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            DirectoryObject.parseDirectoryObject = function (context, path, data) {
                if (!data)
                    return null;

                if (data['odata.type']) {
                    if (data['odata.type'] === 'Microsoft.DirectoryServices.Application')
                        return new Application(context, path, data);
                    if (data['odata.type'] === 'Microsoft.DirectoryServices.User')
                        return new User(context, path, data);
                    if (data['odata.type'] === 'Microsoft.DirectoryServices.ExtensionProperty')
                        return new ExtensionProperty(context, path, data);
                    if (data['odata.type'] === 'Microsoft.DirectoryServices.Contact')
                        return new Contact(context, path, data);
                    if (data['odata.type'] === 'Microsoft.DirectoryServices.Device')
                        return new Device(context, path, data);
                    if (data['odata.type'] === 'Microsoft.DirectoryServices.DeviceConfiguration')
                        return new DeviceConfiguration(context, path, data);
                    if (data['odata.type'] === 'Microsoft.DirectoryServices.DirectoryLinkChange')
                        return new DirectoryLinkChange(context, path, data);
                    if (data['odata.type'] === 'Microsoft.DirectoryServices.AppRoleAssignment')
                        return new AppRoleAssignment(context, path, data);
                    if (data['odata.type'] === 'Microsoft.DirectoryServices.Group')
                        return new Group(context, path, data);
                    if (data['odata.type'] === 'Microsoft.DirectoryServices.DirectoryRole')
                        return new DirectoryRole(context, path, data);
                    if (data['odata.type'] === 'Microsoft.DirectoryServices.DirectoryRoleTemplate')
                        return new DirectoryRoleTemplate(context, path, data);
                    if (data['odata.type'] === 'Microsoft.DirectoryServices.ServicePrincipal')
                        return new ServicePrincipal(context, path, data);
                    if (data['odata.type'] === 'Microsoft.DirectoryServices.TenantDetail')
                        return new TenantDetail(context, path, data);
                }

                return new DirectoryObject(context, path, data);
            };

            DirectoryObject.parseDirectoryObjects = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(DirectoryObject.parseDirectoryObject(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            DirectoryObject.prototype.getRequestBody = function () {
                return {
                    objectType: (this.objectTypeChanged && this.objectType) ? this.objectType : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    deletionTimestamp: (this.deletionTimestampChanged && this.deletionTimestamp) ? this.deletionTimestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return DirectoryObject;
        })(DirectoryServices.Extensions.EntityBase);
        DirectoryServices.DirectoryObject = DirectoryObject;

        var ApplicationFetcher = (function (_super) {
            __extends(ApplicationFetcher, _super);
            function ApplicationFetcher(context, path) {
                _super.call(this, context, path);
            }
            Object.defineProperty(ApplicationFetcher.prototype, "extensionProperties", {
                get: function () {
                    if (this._extensionProperties === undefined) {
                        this._extensionProperties = new ExtensionProperties(this.context, this.getPath("extensionProperties"));
                    }
                    return this._extensionProperties;
                },
                enumerable: true,
                configurable: true
            });

            ApplicationFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/applications' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(Application.parseApplication(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };

            ApplicationFetcher.prototype.restore = function (identifierUris) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("Restore"));

                request.method = 'POST';
                request.data = JSON.stringify({ "identifierUris": identifierUris });

                this.context.request(request).then((function (data) {
                    var parsedData = JSON.parse(data);
                    var path = _this.context.serviceRootUri + '/applications' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(Application.parseApplication(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return ApplicationFetcher;
        })(DirectoryObjectFetcher);
        DirectoryServices.ApplicationFetcher = ApplicationFetcher;

        var Application = (function (_super) {
            __extends(Application, _super);
            function Application(context, path, data) {
                var _this = this;
                _super.call(this, context, path, data);
                this._odataType = 'Microsoft.DirectoryServices.Application';
                this._appIdChanged = false;
                this._appRoles = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._appRolesChanged = false;
                this._appRolesChangedListener = (function (value) {
                    _this._appRolesChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._availableToOtherTenantsChanged = false;
                this._displayNameChanged = false;
                this._errorUrlChanged = false;
                this._groupMembershipClaimsChanged = false;
                this._homepageChanged = false;
                this._identifierUris = new Array();
                this._identifierUrisChanged = false;
                this._keyCredentials = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._keyCredentialsChanged = false;
                this._keyCredentialsChangedListener = (function (value) {
                    _this._keyCredentialsChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._knownClientApplications = new Array();
                this._knownClientApplicationsChanged = false;
                this._mainLogoChanged = false;
                this._logoutUrlChanged = false;
                this._oauth2AllowImplicitFlowChanged = false;
                this._oauth2AllowUrlPathMatchingChanged = false;
                this._oauth2Permissions = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._oauth2PermissionsChanged = false;
                this._oauth2PermissionsChangedListener = (function (value) {
                    _this._oauth2PermissionsChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._oauth2RequirePostResponseChanged = false;
                this._passwordCredentials = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._passwordCredentialsChanged = false;
                this._passwordCredentialsChangedListener = (function (value) {
                    _this._passwordCredentialsChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._publicClientChanged = false;
                this._replyUrls = new Array();
                this._replyUrlsChanged = false;
                this._requiredResourceAccess = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._requiredResourceAccessChanged = false;
                this._requiredResourceAccessChangedListener = (function (value) {
                    _this._requiredResourceAccessChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._samlMetadataUrlChanged = false;

                if (!data) {
                    this._appRoles.addChangedListener(this._appRolesChangedListener);
                    this._keyCredentials.addChangedListener(this._keyCredentialsChangedListener);
                    this._oauth2Permissions.addChangedListener(this._oauth2PermissionsChangedListener);
                    this._passwordCredentials.addChangedListener(this._passwordCredentialsChangedListener);
                    this._requiredResourceAccess.addChangedListener(this._requiredResourceAccessChangedListener);
                    return;
                }

                this._appId = data.appId;
                this._appRoles = AppRole.parseAppRoles(data.appRoles);
                this._appRoles.addChangedListener(this._appRolesChangedListener);
                this._availableToOtherTenants = data.availableToOtherTenants;
                this._displayName = data.displayName;
                this._errorUrl = data.errorUrl;
                this._groupMembershipClaims = data.groupMembershipClaims;
                this._homepage = data.homepage;
                this._identifierUris = data.identifierUris;
                this._keyCredentials = KeyCredential.parseKeyCredentials(data.keyCredentials);
                this._keyCredentials.addChangedListener(this._keyCredentialsChangedListener);
                this._knownClientApplications = data.knownClientApplications;
                this._mainLogo = data.mainLogo;
                this._logoutUrl = data.logoutUrl;
                this._oauth2AllowImplicitFlow = data.oauth2AllowImplicitFlow;
                this._oauth2AllowUrlPathMatching = data.oauth2AllowUrlPathMatching;
                this._oauth2Permissions = OAuth2Permission.parseOAuth2Permissions(data.oauth2Permissions);
                this._oauth2Permissions.addChangedListener(this._oauth2PermissionsChangedListener);
                this._oauth2RequirePostResponse = data.oauth2RequirePostResponse;
                this._passwordCredentials = PasswordCredential.parsePasswordCredentials(data.passwordCredentials);
                this._passwordCredentials.addChangedListener(this._passwordCredentialsChangedListener);
                this._publicClient = data.publicClient;
                this._replyUrls = data.replyUrls;
                this._requiredResourceAccess = RequiredResourceAccess.parseRequiredResourceAccesses(data.requiredResourceAccess);
                this._requiredResourceAccess.addChangedListener(this._requiredResourceAccessChangedListener);
                this._samlMetadataUrl = data.samlMetadataUrl;
            }
            Object.defineProperty(Application.prototype, "appId", {
                get: function () {
                    return this._appId;
                },
                set: function (value) {
                    if (value !== this._appId) {
                        this._appIdChanged = true;
                        this.changed = true;
                    }
                    this._appId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Application.prototype, "appIdChanged", {
                get: function () {
                    return this._appIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "appRoles", {
                get: function () {
                    return this._appRoles;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "appRolesChanged", {
                get: function () {
                    return this._appRolesChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "availableToOtherTenants", {
                get: function () {
                    return this._availableToOtherTenants;
                },
                set: function (value) {
                    if (value !== this._availableToOtherTenants) {
                        this._availableToOtherTenantsChanged = true;
                        this.changed = true;
                    }
                    this._availableToOtherTenants = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Application.prototype, "availableToOtherTenantsChanged", {
                get: function () {
                    return this._availableToOtherTenantsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "displayName", {
                get: function () {
                    return this._displayName;
                },
                set: function (value) {
                    if (value !== this._displayName) {
                        this._displayNameChanged = true;
                        this.changed = true;
                    }
                    this._displayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Application.prototype, "displayNameChanged", {
                get: function () {
                    return this._displayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "errorUrl", {
                get: function () {
                    return this._errorUrl;
                },
                set: function (value) {
                    if (value !== this._errorUrl) {
                        this._errorUrlChanged = true;
                        this.changed = true;
                    }
                    this._errorUrl = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Application.prototype, "errorUrlChanged", {
                get: function () {
                    return this._errorUrlChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "groupMembershipClaims", {
                get: function () {
                    return this._groupMembershipClaims;
                },
                set: function (value) {
                    if (value !== this._groupMembershipClaims) {
                        this._groupMembershipClaimsChanged = true;
                        this.changed = true;
                    }
                    this._groupMembershipClaims = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Application.prototype, "groupMembershipClaimsChanged", {
                get: function () {
                    return this._groupMembershipClaimsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "homepage", {
                get: function () {
                    return this._homepage;
                },
                set: function (value) {
                    if (value !== this._homepage) {
                        this._homepageChanged = true;
                        this.changed = true;
                    }
                    this._homepage = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Application.prototype, "homepageChanged", {
                get: function () {
                    return this._homepageChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "identifierUris", {
                get: function () {
                    return this._identifierUris;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "identifierUrisChanged", {
                get: function () {
                    return this._identifierUrisChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "keyCredentials", {
                get: function () {
                    return this._keyCredentials;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "keyCredentialsChanged", {
                get: function () {
                    return this._keyCredentialsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "knownClientApplications", {
                get: function () {
                    return this._knownClientApplications;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "knownClientApplicationsChanged", {
                get: function () {
                    return this._knownClientApplicationsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "mainLogo", {
                get: function () {
                    return this._mainLogo;
                },
                set: function (value) {
                    if (value !== this._mainLogo) {
                        this._mainLogoChanged = true;
                        this.changed = true;
                    }
                    this._mainLogo = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Application.prototype, "mainLogoChanged", {
                get: function () {
                    return this._mainLogoChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "logoutUrl", {
                get: function () {
                    return this._logoutUrl;
                },
                set: function (value) {
                    if (value !== this._logoutUrl) {
                        this._logoutUrlChanged = true;
                        this.changed = true;
                    }
                    this._logoutUrl = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Application.prototype, "logoutUrlChanged", {
                get: function () {
                    return this._logoutUrlChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "oauth2AllowImplicitFlow", {
                get: function () {
                    return this._oauth2AllowImplicitFlow;
                },
                set: function (value) {
                    if (value !== this._oauth2AllowImplicitFlow) {
                        this._oauth2AllowImplicitFlowChanged = true;
                        this.changed = true;
                    }
                    this._oauth2AllowImplicitFlow = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Application.prototype, "oauth2AllowImplicitFlowChanged", {
                get: function () {
                    return this._oauth2AllowImplicitFlowChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "oauth2AllowUrlPathMatching", {
                get: function () {
                    return this._oauth2AllowUrlPathMatching;
                },
                set: function (value) {
                    if (value !== this._oauth2AllowUrlPathMatching) {
                        this._oauth2AllowUrlPathMatchingChanged = true;
                        this.changed = true;
                    }
                    this._oauth2AllowUrlPathMatching = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Application.prototype, "oauth2AllowUrlPathMatchingChanged", {
                get: function () {
                    return this._oauth2AllowUrlPathMatchingChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "oauth2Permissions", {
                get: function () {
                    return this._oauth2Permissions;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "oauth2PermissionsChanged", {
                get: function () {
                    return this._oauth2PermissionsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "oauth2RequirePostResponse", {
                get: function () {
                    return this._oauth2RequirePostResponse;
                },
                set: function (value) {
                    if (value !== this._oauth2RequirePostResponse) {
                        this._oauth2RequirePostResponseChanged = true;
                        this.changed = true;
                    }
                    this._oauth2RequirePostResponse = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Application.prototype, "oauth2RequirePostResponseChanged", {
                get: function () {
                    return this._oauth2RequirePostResponseChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "passwordCredentials", {
                get: function () {
                    return this._passwordCredentials;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "passwordCredentialsChanged", {
                get: function () {
                    return this._passwordCredentialsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "publicClient", {
                get: function () {
                    return this._publicClient;
                },
                set: function (value) {
                    if (value !== this._publicClient) {
                        this._publicClientChanged = true;
                        this.changed = true;
                    }
                    this._publicClient = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Application.prototype, "publicClientChanged", {
                get: function () {
                    return this._publicClientChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "replyUrls", {
                get: function () {
                    return this._replyUrls;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "replyUrlsChanged", {
                get: function () {
                    return this._replyUrlsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "requiredResourceAccess", {
                get: function () {
                    return this._requiredResourceAccess;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "requiredResourceAccessChanged", {
                get: function () {
                    return this._requiredResourceAccessChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "samlMetadataUrl", {
                get: function () {
                    return this._samlMetadataUrl;
                },
                set: function (value) {
                    if (value !== this._samlMetadataUrl) {
                        this._samlMetadataUrlChanged = true;
                        this.changed = true;
                    }
                    this._samlMetadataUrl = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Application.prototype, "samlMetadataUrlChanged", {
                get: function () {
                    return this._samlMetadataUrlChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Application.prototype, "extensionProperties", {
                get: function () {
                    if (this._extensionProperties === undefined) {
                        this._extensionProperties = new ExtensionProperties(this.context, this.getPath("extensionProperties"));
                    }
                    return this._extensionProperties;
                },
                enumerable: true,
                configurable: true
            });

            Application.prototype.restore = function (identifierUris) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("Restore"));

                request.method = 'POST';
                request.data = JSON.stringify({ "identifierUris": identifierUris });

                this.context.request(request).then((function (data) {
                    var parsedData = JSON.parse(data);
                    var path = _this.context.serviceRootUri + '/applications' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(Application.parseApplication(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };

            Application.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/applications' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(Application.parseApplication(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            Application.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            Application.parseApplication = function (context, path, data) {
                if (!data)
                    return null;

                return new Application(context, path, data);
            };

            Application.parseApplications = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(Application.parseApplication(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            Application.prototype.getRequestBody = function () {
                return {
                    appId: (this.appIdChanged && this.appId) ? this.appId : undefined,
                    appRoles: (this.appRolesChanged) ? (function (appRoles) {
                        if (!appRoles) {
                            return undefined;
                        }
                        var converted = [];
                        appRoles.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.appRoles) : undefined,
                    availableToOtherTenants: (this.availableToOtherTenantsChanged && this.availableToOtherTenants) ? this.availableToOtherTenants : undefined,
                    displayName: (this.displayNameChanged && this.displayName) ? this.displayName : undefined,
                    errorUrl: (this.errorUrlChanged && this.errorUrl) ? this.errorUrl : undefined,
                    groupMembershipClaims: (this.groupMembershipClaimsChanged && this.groupMembershipClaims) ? this.groupMembershipClaims : undefined,
                    homepage: (this.homepageChanged && this.homepage) ? this.homepage : undefined,
                    identifierUris: (this.identifierUrisChanged && this.identifierUris) ? this.identifierUris : undefined,
                    keyCredentials: (this.keyCredentialsChanged) ? (function (keyCredentials) {
                        if (!keyCredentials) {
                            return undefined;
                        }
                        var converted = [];
                        keyCredentials.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.keyCredentials) : undefined,
                    knownClientApplications: (this.knownClientApplicationsChanged && this.knownClientApplications) ? this.knownClientApplications : undefined,
                    mainLogo: (this.mainLogoChanged && this.mainLogo) ? this.mainLogo : undefined,
                    logoutUrl: (this.logoutUrlChanged && this.logoutUrl) ? this.logoutUrl : undefined,
                    oauth2AllowImplicitFlow: (this.oauth2AllowImplicitFlowChanged && this.oauth2AllowImplicitFlow) ? this.oauth2AllowImplicitFlow : undefined,
                    oauth2AllowUrlPathMatching: (this.oauth2AllowUrlPathMatchingChanged && this.oauth2AllowUrlPathMatching) ? this.oauth2AllowUrlPathMatching : undefined,
                    oauth2Permissions: (this.oauth2PermissionsChanged) ? (function (oauth2Permissions) {
                        if (!oauth2Permissions) {
                            return undefined;
                        }
                        var converted = [];
                        oauth2Permissions.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.oauth2Permissions) : undefined,
                    oauth2RequirePostResponse: (this.oauth2RequirePostResponseChanged && this.oauth2RequirePostResponse) ? this.oauth2RequirePostResponse : undefined,
                    passwordCredentials: (this.passwordCredentialsChanged) ? (function (passwordCredentials) {
                        if (!passwordCredentials) {
                            return undefined;
                        }
                        var converted = [];
                        passwordCredentials.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.passwordCredentials) : undefined,
                    publicClient: (this.publicClientChanged && this.publicClient) ? this.publicClient : undefined,
                    replyUrls: (this.replyUrlsChanged && this.replyUrls) ? this.replyUrls : undefined,
                    requiredResourceAccess: (this.requiredResourceAccessChanged) ? (function (requiredResourceAccess) {
                        if (!requiredResourceAccess) {
                            return undefined;
                        }
                        var converted = [];
                        requiredResourceAccess.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.requiredResourceAccess) : undefined,
                    samlMetadataUrl: (this.samlMetadataUrlChanged && this.samlMetadataUrl) ? this.samlMetadataUrl : undefined,
                    objectType: (this.objectTypeChanged && this.objectType) ? this.objectType : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    deletionTimestamp: (this.deletionTimestampChanged && this.deletionTimestamp) ? this.deletionTimestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return Application;
        })(DirectoryObject);
        DirectoryServices.Application = Application;

        var UserFetcher = (function (_super) {
            __extends(UserFetcher, _super);
            function UserFetcher(context, path) {
                _super.call(this, context, path);
            }
            Object.defineProperty(UserFetcher.prototype, "appRoleAssignments", {
                get: function () {
                    if (this._appRoleAssignments === undefined) {
                        this._appRoleAssignments = new AppRoleAssignments(this.context, this.getPath("appRoleAssignments"));
                    }
                    return this._appRoleAssignments;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(UserFetcher.prototype, "oauth2PermissionGrants", {
                get: function () {
                    if (this._oauth2PermissionGrants === undefined) {
                        this._oauth2PermissionGrants = new OAuth2PermissionGrants(this.context, this.getPath("oauth2PermissionGrants"));
                    }
                    return this._oauth2PermissionGrants;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(UserFetcher.prototype, "ownedDevices", {
                get: function () {
                    if (this._ownedDevices === undefined) {
                        this._ownedDevices = new DirectoryObjects(this.context, this.getPath("ownedDevices"));
                    }
                    return this._ownedDevices;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(UserFetcher.prototype, "registeredDevices", {
                get: function () {
                    if (this._registeredDevices === undefined) {
                        this._registeredDevices = new DirectoryObjects(this.context, this.getPath("registeredDevices"));
                    }
                    return this._registeredDevices;
                },
                enumerable: true,
                configurable: true
            });

            UserFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/users' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(User.parseUser(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };

            UserFetcher.prototype.assignLicense = function (addLicenses, removeLicenses) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("AssignLicense"));

                request.method = 'POST';
                request.data = JSON.stringify({ "addLicenses": addLicenses, "removeLicenses": removeLicenses });

                this.context.request(request).then((function (data) {
                    var parsedData = JSON.parse(data);
                    var path = _this.context.serviceRootUri + '/users' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(User.parseUser(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return UserFetcher;
        })(DirectoryObjectFetcher);
        DirectoryServices.UserFetcher = UserFetcher;

        var User = (function (_super) {
            __extends(User, _super);
            function User(context, path, data) {
                var _this = this;
                _super.call(this, context, path, data);
                this._odataType = 'Microsoft.DirectoryServices.User';
                this._accountEnabledChanged = false;
                this._assignedLicenses = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._assignedLicensesChanged = false;
                this._assignedLicensesChangedListener = (function (value) {
                    _this._assignedLicensesChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._assignedPlans = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._assignedPlansChanged = false;
                this._assignedPlansChangedListener = (function (value) {
                    _this._assignedPlansChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._cityChanged = false;
                this._countryChanged = false;
                this._departmentChanged = false;
                this._dirSyncEnabledChanged = false;
                this._displayNameChanged = false;
                this._facsimileTelephoneNumberChanged = false;
                this._givenNameChanged = false;
                this._immutableIdChanged = false;
                this._jobTitleChanged = false;
                this._lastDirSyncTimeChanged = false;
                this._mailChanged = false;
                this._mailNicknameChanged = false;
                this._mobileChanged = false;
                this._onPremisesSecurityIdentifierChanged = false;
                this._otherMails = new Array();
                this._otherMailsChanged = false;
                this._passwordPoliciesChanged = false;
                this._passwordProfileChanged = false;
                this._passwordProfileChangedListener = (function (value) {
                    _this._passwordProfileChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._physicalDeliveryOfficeNameChanged = false;
                this._postalCodeChanged = false;
                this._preferredLanguageChanged = false;
                this._provisionedPlans = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._provisionedPlansChanged = false;
                this._provisionedPlansChangedListener = (function (value) {
                    _this._provisionedPlansChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._provisioningErrors = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._provisioningErrorsChanged = false;
                this._provisioningErrorsChangedListener = (function (value) {
                    _this._provisioningErrorsChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._proxyAddresses = new Array();
                this._proxyAddressesChanged = false;
                this._sipProxyAddressChanged = false;
                this._stateChanged = false;
                this._streetAddressChanged = false;
                this._surnameChanged = false;
                this._telephoneNumberChanged = false;
                this._thumbnailPhotoChanged = false;
                this._usageLocationChanged = false;
                this._userPrincipalNameChanged = false;
                this._userTypeChanged = false;

                if (!data) {
                    this._assignedLicenses.addChangedListener(this._assignedLicensesChangedListener);
                    this._assignedPlans.addChangedListener(this._assignedPlansChangedListener);
                    this._provisionedPlans.addChangedListener(this._provisionedPlansChangedListener);
                    this._provisioningErrors.addChangedListener(this._provisioningErrorsChangedListener);
                    return;
                }

                this._accountEnabled = data.accountEnabled;
                this._assignedLicenses = AssignedLicense.parseAssignedLicenses(data.assignedLicenses);
                this._assignedLicenses.addChangedListener(this._assignedLicensesChangedListener);
                this._assignedPlans = AssignedPlan.parseAssignedPlans(data.assignedPlans);
                this._assignedPlans.addChangedListener(this._assignedPlansChangedListener);
                this._city = data.city;
                this._country = data.country;
                this._department = data.department;
                this._dirSyncEnabled = data.dirSyncEnabled;
                this._displayName = data.displayName;
                this._facsimileTelephoneNumber = data.facsimileTelephoneNumber;
                this._givenName = data.givenName;
                this._immutableId = data.immutableId;
                this._jobTitle = data.jobTitle;
                this._lastDirSyncTime = (data.lastDirSyncTime !== null) ? new Date(data.lastDirSyncTime) : null;
                this._mail = data.mail;
                this._mailNickname = data.mailNickname;
                this._mobile = data.mobile;
                this._onPremisesSecurityIdentifier = data.onPremisesSecurityIdentifier;
                this._otherMails = data.otherMails;
                this._passwordPolicies = data.passwordPolicies;
                this._passwordProfile = PasswordProfile.parsePasswordProfile(data.passwordProfile);
                if (this._passwordProfile) {
                    this._passwordProfile.addChangedListener(this._passwordProfileChangedListener);
                }
                this._physicalDeliveryOfficeName = data.physicalDeliveryOfficeName;
                this._postalCode = data.postalCode;
                this._preferredLanguage = data.preferredLanguage;
                this._provisionedPlans = ProvisionedPlan.parseProvisionedPlans(data.provisionedPlans);
                this._provisionedPlans.addChangedListener(this._provisionedPlansChangedListener);
                this._provisioningErrors = ProvisioningError.parseProvisioningErrors(data.provisioningErrors);
                this._provisioningErrors.addChangedListener(this._provisioningErrorsChangedListener);
                this._proxyAddresses = data.proxyAddresses;
                this._sipProxyAddress = data.sipProxyAddress;
                this._state = data.state;
                this._streetAddress = data.streetAddress;
                this._surname = data.surname;
                this._telephoneNumber = data.telephoneNumber;
                this._thumbnailPhoto = data.thumbnailPhoto;
                this._usageLocation = data.usageLocation;
                this._userPrincipalName = data.userPrincipalName;
                this._userType = data.userType;
            }
            Object.defineProperty(User.prototype, "accountEnabled", {
                get: function () {
                    return this._accountEnabled;
                },
                set: function (value) {
                    if (value !== this._accountEnabled) {
                        this._accountEnabledChanged = true;
                        this.changed = true;
                    }
                    this._accountEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "accountEnabledChanged", {
                get: function () {
                    return this._accountEnabledChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "assignedLicenses", {
                get: function () {
                    return this._assignedLicenses;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "assignedLicensesChanged", {
                get: function () {
                    return this._assignedLicensesChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "assignedPlans", {
                get: function () {
                    return this._assignedPlans;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "assignedPlansChanged", {
                get: function () {
                    return this._assignedPlansChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "city", {
                get: function () {
                    return this._city;
                },
                set: function (value) {
                    if (value !== this._city) {
                        this._cityChanged = true;
                        this.changed = true;
                    }
                    this._city = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "cityChanged", {
                get: function () {
                    return this._cityChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "country", {
                get: function () {
                    return this._country;
                },
                set: function (value) {
                    if (value !== this._country) {
                        this._countryChanged = true;
                        this.changed = true;
                    }
                    this._country = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "countryChanged", {
                get: function () {
                    return this._countryChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "department", {
                get: function () {
                    return this._department;
                },
                set: function (value) {
                    if (value !== this._department) {
                        this._departmentChanged = true;
                        this.changed = true;
                    }
                    this._department = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "departmentChanged", {
                get: function () {
                    return this._departmentChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "dirSyncEnabled", {
                get: function () {
                    return this._dirSyncEnabled;
                },
                set: function (value) {
                    if (value !== this._dirSyncEnabled) {
                        this._dirSyncEnabledChanged = true;
                        this.changed = true;
                    }
                    this._dirSyncEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "dirSyncEnabledChanged", {
                get: function () {
                    return this._dirSyncEnabledChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "displayName", {
                get: function () {
                    return this._displayName;
                },
                set: function (value) {
                    if (value !== this._displayName) {
                        this._displayNameChanged = true;
                        this.changed = true;
                    }
                    this._displayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "displayNameChanged", {
                get: function () {
                    return this._displayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "facsimileTelephoneNumber", {
                get: function () {
                    return this._facsimileTelephoneNumber;
                },
                set: function (value) {
                    if (value !== this._facsimileTelephoneNumber) {
                        this._facsimileTelephoneNumberChanged = true;
                        this.changed = true;
                    }
                    this._facsimileTelephoneNumber = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "facsimileTelephoneNumberChanged", {
                get: function () {
                    return this._facsimileTelephoneNumberChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "givenName", {
                get: function () {
                    return this._givenName;
                },
                set: function (value) {
                    if (value !== this._givenName) {
                        this._givenNameChanged = true;
                        this.changed = true;
                    }
                    this._givenName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "givenNameChanged", {
                get: function () {
                    return this._givenNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "immutableId", {
                get: function () {
                    return this._immutableId;
                },
                set: function (value) {
                    if (value !== this._immutableId) {
                        this._immutableIdChanged = true;
                        this.changed = true;
                    }
                    this._immutableId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "immutableIdChanged", {
                get: function () {
                    return this._immutableIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "jobTitle", {
                get: function () {
                    return this._jobTitle;
                },
                set: function (value) {
                    if (value !== this._jobTitle) {
                        this._jobTitleChanged = true;
                        this.changed = true;
                    }
                    this._jobTitle = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "jobTitleChanged", {
                get: function () {
                    return this._jobTitleChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "lastDirSyncTime", {
                get: function () {
                    return this._lastDirSyncTime;
                },
                set: function (value) {
                    if (value !== this._lastDirSyncTime) {
                        this._lastDirSyncTimeChanged = true;
                        this.changed = true;
                    }
                    this._lastDirSyncTime = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "lastDirSyncTimeChanged", {
                get: function () {
                    return this._lastDirSyncTimeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "mail", {
                get: function () {
                    return this._mail;
                },
                set: function (value) {
                    if (value !== this._mail) {
                        this._mailChanged = true;
                        this.changed = true;
                    }
                    this._mail = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "mailChanged", {
                get: function () {
                    return this._mailChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "mailNickname", {
                get: function () {
                    return this._mailNickname;
                },
                set: function (value) {
                    if (value !== this._mailNickname) {
                        this._mailNicknameChanged = true;
                        this.changed = true;
                    }
                    this._mailNickname = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "mailNicknameChanged", {
                get: function () {
                    return this._mailNicknameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "mobile", {
                get: function () {
                    return this._mobile;
                },
                set: function (value) {
                    if (value !== this._mobile) {
                        this._mobileChanged = true;
                        this.changed = true;
                    }
                    this._mobile = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "mobileChanged", {
                get: function () {
                    return this._mobileChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "onPremisesSecurityIdentifier", {
                get: function () {
                    return this._onPremisesSecurityIdentifier;
                },
                set: function (value) {
                    if (value !== this._onPremisesSecurityIdentifier) {
                        this._onPremisesSecurityIdentifierChanged = true;
                        this.changed = true;
                    }
                    this._onPremisesSecurityIdentifier = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "onPremisesSecurityIdentifierChanged", {
                get: function () {
                    return this._onPremisesSecurityIdentifierChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "otherMails", {
                get: function () {
                    return this._otherMails;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "otherMailsChanged", {
                get: function () {
                    return this._otherMailsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "passwordPolicies", {
                get: function () {
                    return this._passwordPolicies;
                },
                set: function (value) {
                    if (value !== this._passwordPolicies) {
                        this._passwordPoliciesChanged = true;
                        this.changed = true;
                    }
                    this._passwordPolicies = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "passwordPoliciesChanged", {
                get: function () {
                    return this._passwordPoliciesChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "passwordProfile", {
                get: function () {
                    return this._passwordProfile;
                },
                set: function (value) {
                    if (this._passwordProfile) {
                        this._passwordProfile.removeChangedListener(this._passwordProfileChangedListener);
                    }
                    if (value !== this._passwordProfile) {
                        this._passwordProfileChanged = true;
                        this.changed = true;
                    }
                    if (this._passwordProfile) {
                        this._passwordProfile.addChangedListener(this._passwordProfileChangedListener);
                    }
                    this._passwordProfile = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "passwordProfileChanged", {
                get: function () {
                    return this._passwordProfileChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "physicalDeliveryOfficeName", {
                get: function () {
                    return this._physicalDeliveryOfficeName;
                },
                set: function (value) {
                    if (value !== this._physicalDeliveryOfficeName) {
                        this._physicalDeliveryOfficeNameChanged = true;
                        this.changed = true;
                    }
                    this._physicalDeliveryOfficeName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "physicalDeliveryOfficeNameChanged", {
                get: function () {
                    return this._physicalDeliveryOfficeNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "postalCode", {
                get: function () {
                    return this._postalCode;
                },
                set: function (value) {
                    if (value !== this._postalCode) {
                        this._postalCodeChanged = true;
                        this.changed = true;
                    }
                    this._postalCode = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "postalCodeChanged", {
                get: function () {
                    return this._postalCodeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "preferredLanguage", {
                get: function () {
                    return this._preferredLanguage;
                },
                set: function (value) {
                    if (value !== this._preferredLanguage) {
                        this._preferredLanguageChanged = true;
                        this.changed = true;
                    }
                    this._preferredLanguage = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "preferredLanguageChanged", {
                get: function () {
                    return this._preferredLanguageChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "provisionedPlans", {
                get: function () {
                    return this._provisionedPlans;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "provisionedPlansChanged", {
                get: function () {
                    return this._provisionedPlansChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "provisioningErrors", {
                get: function () {
                    return this._provisioningErrors;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "provisioningErrorsChanged", {
                get: function () {
                    return this._provisioningErrorsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "proxyAddresses", {
                get: function () {
                    return this._proxyAddresses;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "proxyAddressesChanged", {
                get: function () {
                    return this._proxyAddressesChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "sipProxyAddress", {
                get: function () {
                    return this._sipProxyAddress;
                },
                set: function (value) {
                    if (value !== this._sipProxyAddress) {
                        this._sipProxyAddressChanged = true;
                        this.changed = true;
                    }
                    this._sipProxyAddress = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "sipProxyAddressChanged", {
                get: function () {
                    return this._sipProxyAddressChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "state", {
                get: function () {
                    return this._state;
                },
                set: function (value) {
                    if (value !== this._state) {
                        this._stateChanged = true;
                        this.changed = true;
                    }
                    this._state = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "stateChanged", {
                get: function () {
                    return this._stateChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "streetAddress", {
                get: function () {
                    return this._streetAddress;
                },
                set: function (value) {
                    if (value !== this._streetAddress) {
                        this._streetAddressChanged = true;
                        this.changed = true;
                    }
                    this._streetAddress = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "streetAddressChanged", {
                get: function () {
                    return this._streetAddressChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "surname", {
                get: function () {
                    return this._surname;
                },
                set: function (value) {
                    if (value !== this._surname) {
                        this._surnameChanged = true;
                        this.changed = true;
                    }
                    this._surname = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "surnameChanged", {
                get: function () {
                    return this._surnameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "telephoneNumber", {
                get: function () {
                    return this._telephoneNumber;
                },
                set: function (value) {
                    if (value !== this._telephoneNumber) {
                        this._telephoneNumberChanged = true;
                        this.changed = true;
                    }
                    this._telephoneNumber = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "telephoneNumberChanged", {
                get: function () {
                    return this._telephoneNumberChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "thumbnailPhoto", {
                get: function () {
                    return this._thumbnailPhoto;
                },
                set: function (value) {
                    if (value !== this._thumbnailPhoto) {
                        this._thumbnailPhotoChanged = true;
                        this.changed = true;
                    }
                    this._thumbnailPhoto = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "thumbnailPhotoChanged", {
                get: function () {
                    return this._thumbnailPhotoChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "usageLocation", {
                get: function () {
                    return this._usageLocation;
                },
                set: function (value) {
                    if (value !== this._usageLocation) {
                        this._usageLocationChanged = true;
                        this.changed = true;
                    }
                    this._usageLocation = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "usageLocationChanged", {
                get: function () {
                    return this._usageLocationChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "userPrincipalName", {
                get: function () {
                    return this._userPrincipalName;
                },
                set: function (value) {
                    if (value !== this._userPrincipalName) {
                        this._userPrincipalNameChanged = true;
                        this.changed = true;
                    }
                    this._userPrincipalName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "userPrincipalNameChanged", {
                get: function () {
                    return this._userPrincipalNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "userType", {
                get: function () {
                    return this._userType;
                },
                set: function (value) {
                    if (value !== this._userType) {
                        this._userTypeChanged = true;
                        this.changed = true;
                    }
                    this._userType = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(User.prototype, "userTypeChanged", {
                get: function () {
                    return this._userTypeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "appRoleAssignments", {
                get: function () {
                    if (this._appRoleAssignments === undefined) {
                        this._appRoleAssignments = new AppRoleAssignments(this.context, this.getPath("appRoleAssignments"));
                    }
                    return this._appRoleAssignments;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "oauth2PermissionGrants", {
                get: function () {
                    if (this._oauth2PermissionGrants === undefined) {
                        this._oauth2PermissionGrants = new OAuth2PermissionGrants(this.context, this.getPath("oauth2PermissionGrants"));
                    }
                    return this._oauth2PermissionGrants;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "ownedDevices", {
                get: function () {
                    if (this._ownedDevices === undefined) {
                        this._ownedDevices = new DirectoryObjects(this.context, this.getPath("ownedDevices"));
                    }
                    return this._ownedDevices;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(User.prototype, "registeredDevices", {
                get: function () {
                    if (this._registeredDevices === undefined) {
                        this._registeredDevices = new DirectoryObjects(this.context, this.getPath("registeredDevices"));
                    }
                    return this._registeredDevices;
                },
                enumerable: true,
                configurable: true
            });

            User.prototype.assignLicense = function (addLicenses, removeLicenses) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.getPath("AssignLicense"));

                request.method = 'POST';
                request.data = JSON.stringify({ "addLicenses": addLicenses, "removeLicenses": removeLicenses });

                this.context.request(request).then((function (data) {
                    var parsedData = JSON.parse(data);
                    var path = _this.context.serviceRootUri + '/users' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(User.parseUser(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };

            User.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/users' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(User.parseUser(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            User.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            User.parseUser = function (context, path, data) {
                if (!data)
                    return null;

                return new User(context, path, data);
            };

            User.parseUsers = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(User.parseUser(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            User.prototype.getRequestBody = function () {
                return {
                    accountEnabled: (this.accountEnabledChanged && this.accountEnabled) ? this.accountEnabled : undefined,
                    assignedLicenses: (this.assignedLicensesChanged) ? (function (assignedLicenses) {
                        if (!assignedLicenses) {
                            return undefined;
                        }
                        var converted = [];
                        assignedLicenses.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.assignedLicenses) : undefined,
                    assignedPlans: (this.assignedPlansChanged) ? (function (assignedPlans) {
                        if (!assignedPlans) {
                            return undefined;
                        }
                        var converted = [];
                        assignedPlans.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.assignedPlans) : undefined,
                    city: (this.cityChanged && this.city) ? this.city : undefined,
                    country: (this.countryChanged && this.country) ? this.country : undefined,
                    department: (this.departmentChanged && this.department) ? this.department : undefined,
                    dirSyncEnabled: (this.dirSyncEnabledChanged && this.dirSyncEnabled) ? this.dirSyncEnabled : undefined,
                    displayName: (this.displayNameChanged && this.displayName) ? this.displayName : undefined,
                    facsimileTelephoneNumber: (this.facsimileTelephoneNumberChanged && this.facsimileTelephoneNumber) ? this.facsimileTelephoneNumber : undefined,
                    givenName: (this.givenNameChanged && this.givenName) ? this.givenName : undefined,
                    immutableId: (this.immutableIdChanged && this.immutableId) ? this.immutableId : undefined,
                    jobTitle: (this.jobTitleChanged && this.jobTitle) ? this.jobTitle : undefined,
                    lastDirSyncTime: (this.lastDirSyncTimeChanged && this.lastDirSyncTime) ? this.lastDirSyncTime.toString() : undefined,
                    mail: (this.mailChanged && this.mail) ? this.mail : undefined,
                    mailNickname: (this.mailNicknameChanged && this.mailNickname) ? this.mailNickname : undefined,
                    mobile: (this.mobileChanged && this.mobile) ? this.mobile : undefined,
                    onPremisesSecurityIdentifier: (this.onPremisesSecurityIdentifierChanged && this.onPremisesSecurityIdentifier) ? this.onPremisesSecurityIdentifier : undefined,
                    otherMails: (this.otherMailsChanged && this.otherMails) ? this.otherMails : undefined,
                    passwordPolicies: (this.passwordPoliciesChanged && this.passwordPolicies) ? this.passwordPolicies : undefined,
                    passwordProfile: (this.passwordProfileChanged && this.passwordProfile) ? this.passwordProfile.getRequestBody() : undefined,
                    physicalDeliveryOfficeName: (this.physicalDeliveryOfficeNameChanged && this.physicalDeliveryOfficeName) ? this.physicalDeliveryOfficeName : undefined,
                    postalCode: (this.postalCodeChanged && this.postalCode) ? this.postalCode : undefined,
                    preferredLanguage: (this.preferredLanguageChanged && this.preferredLanguage) ? this.preferredLanguage : undefined,
                    provisionedPlans: (this.provisionedPlansChanged) ? (function (provisionedPlans) {
                        if (!provisionedPlans) {
                            return undefined;
                        }
                        var converted = [];
                        provisionedPlans.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.provisionedPlans) : undefined,
                    provisioningErrors: (this.provisioningErrorsChanged) ? (function (provisioningErrors) {
                        if (!provisioningErrors) {
                            return undefined;
                        }
                        var converted = [];
                        provisioningErrors.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.provisioningErrors) : undefined,
                    proxyAddresses: (this.proxyAddressesChanged && this.proxyAddresses) ? this.proxyAddresses : undefined,
                    sipProxyAddress: (this.sipProxyAddressChanged && this.sipProxyAddress) ? this.sipProxyAddress : undefined,
                    state: (this.stateChanged && this.state) ? this.state : undefined,
                    streetAddress: (this.streetAddressChanged && this.streetAddress) ? this.streetAddress : undefined,
                    surname: (this.surnameChanged && this.surname) ? this.surname : undefined,
                    telephoneNumber: (this.telephoneNumberChanged && this.telephoneNumber) ? this.telephoneNumber : undefined,
                    thumbnailPhoto: (this.thumbnailPhotoChanged && this.thumbnailPhoto) ? this.thumbnailPhoto : undefined,
                    usageLocation: (this.usageLocationChanged && this.usageLocation) ? this.usageLocation : undefined,
                    userPrincipalName: (this.userPrincipalNameChanged && this.userPrincipalName) ? this.userPrincipalName : undefined,
                    userType: (this.userTypeChanged && this.userType) ? this.userType : undefined,
                    objectType: (this.objectTypeChanged && this.objectType) ? this.objectType : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    deletionTimestamp: (this.deletionTimestampChanged && this.deletionTimestamp) ? this.deletionTimestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return User;
        })(DirectoryObject);
        DirectoryServices.User = User;

        var AssignedLicense = (function (_super) {
            __extends(AssignedLicense, _super);
            function AssignedLicense(data) {
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.AssignedLicense';
                this._disabledPlans = new Array();
                this._disabledPlansChanged = false;
                this._skuIdChanged = false;

                if (!data) {
                    return;
                }

                this._disabledPlans = data.disabledPlans;
                this._skuId = data.skuId;
            }
            Object.defineProperty(AssignedLicense.prototype, "disabledPlans", {
                get: function () {
                    return this._disabledPlans;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AssignedLicense.prototype, "disabledPlansChanged", {
                get: function () {
                    return this._disabledPlansChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AssignedLicense.prototype, "skuId", {
                get: function () {
                    return this._skuId;
                },
                set: function (value) {
                    if (value !== this._skuId) {
                        this._skuIdChanged = true;
                        this.changed = true;
                    }
                    this._skuId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssignedLicense.prototype, "skuIdChanged", {
                get: function () {
                    return this._skuIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            AssignedLicense.parseAssignedLicense = function (data) {
                if (!data)
                    return null;

                return new AssignedLicense(data);
            };

            AssignedLicense.parseAssignedLicenses = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(AssignedLicense.parseAssignedLicense(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            AssignedLicense.prototype.getRequestBody = function () {
                return {
                    disabledPlans: (this.disabledPlansChanged && this.disabledPlans) ? this.disabledPlans : undefined,
                    skuId: (this.skuIdChanged && this.skuId) ? this.skuId : undefined,
                    'odata.type': this._odataType
                };
            };
            return AssignedLicense;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.AssignedLicense = AssignedLicense;

        var ExtensionPropertyFetcher = (function (_super) {
            __extends(ExtensionPropertyFetcher, _super);
            function ExtensionPropertyFetcher(context, path) {
                _super.call(this, context, path);
            }
            ExtensionPropertyFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/extensionProperties' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(ExtensionProperty.parseExtensionProperty(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return ExtensionPropertyFetcher;
        })(DirectoryObjectFetcher);
        DirectoryServices.ExtensionPropertyFetcher = ExtensionPropertyFetcher;

        var ExtensionProperty = (function (_super) {
            __extends(ExtensionProperty, _super);
            function ExtensionProperty(context, path, data) {
                _super.call(this, context, path, data);
                this._odataType = 'Microsoft.DirectoryServices.ExtensionProperty';
                this._appDisplayNameChanged = false;
                this._nameChanged = false;
                this._dataTypeChanged = false;
                this._isSyncedFromOnPremisesChanged = false;
                this._targetObjects = new Array();
                this._targetObjectsChanged = false;

                if (!data) {
                    return;
                }

                this._appDisplayName = data.appDisplayName;
                this._name = data.name;
                this._dataType = data.dataType;
                this._isSyncedFromOnPremises = data.isSyncedFromOnPremises;
                this._targetObjects = data.targetObjects;
            }
            Object.defineProperty(ExtensionProperty.prototype, "appDisplayName", {
                get: function () {
                    return this._appDisplayName;
                },
                set: function (value) {
                    if (value !== this._appDisplayName) {
                        this._appDisplayNameChanged = true;
                        this.changed = true;
                    }
                    this._appDisplayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ExtensionProperty.prototype, "appDisplayNameChanged", {
                get: function () {
                    return this._appDisplayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ExtensionProperty.prototype, "name", {
                get: function () {
                    return this._name;
                },
                set: function (value) {
                    if (value !== this._name) {
                        this._nameChanged = true;
                        this.changed = true;
                    }
                    this._name = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ExtensionProperty.prototype, "nameChanged", {
                get: function () {
                    return this._nameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ExtensionProperty.prototype, "dataType", {
                get: function () {
                    return this._dataType;
                },
                set: function (value) {
                    if (value !== this._dataType) {
                        this._dataTypeChanged = true;
                        this.changed = true;
                    }
                    this._dataType = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ExtensionProperty.prototype, "dataTypeChanged", {
                get: function () {
                    return this._dataTypeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ExtensionProperty.prototype, "isSyncedFromOnPremises", {
                get: function () {
                    return this._isSyncedFromOnPremises;
                },
                set: function (value) {
                    if (value !== this._isSyncedFromOnPremises) {
                        this._isSyncedFromOnPremisesChanged = true;
                        this.changed = true;
                    }
                    this._isSyncedFromOnPremises = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ExtensionProperty.prototype, "isSyncedFromOnPremisesChanged", {
                get: function () {
                    return this._isSyncedFromOnPremisesChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ExtensionProperty.prototype, "targetObjects", {
                get: function () {
                    return this._targetObjects;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ExtensionProperty.prototype, "targetObjectsChanged", {
                get: function () {
                    return this._targetObjectsChanged;
                },
                enumerable: true,
                configurable: true
            });

            ExtensionProperty.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/extensionProperties' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(ExtensionProperty.parseExtensionProperty(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            ExtensionProperty.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            ExtensionProperty.parseExtensionProperty = function (context, path, data) {
                if (!data)
                    return null;

                return new ExtensionProperty(context, path, data);
            };

            ExtensionProperty.parseExtensionProperties = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(ExtensionProperty.parseExtensionProperty(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            ExtensionProperty.prototype.getRequestBody = function () {
                return {
                    appDisplayName: (this.appDisplayNameChanged && this.appDisplayName) ? this.appDisplayName : undefined,
                    name: (this.nameChanged && this.name) ? this.name : undefined,
                    dataType: (this.dataTypeChanged && this.dataType) ? this.dataType : undefined,
                    isSyncedFromOnPremises: (this.isSyncedFromOnPremisesChanged && this.isSyncedFromOnPremises) ? this.isSyncedFromOnPremises : undefined,
                    targetObjects: (this.targetObjectsChanged && this.targetObjects) ? this.targetObjects : undefined,
                    objectType: (this.objectTypeChanged && this.objectType) ? this.objectType : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    deletionTimestamp: (this.deletionTimestampChanged && this.deletionTimestamp) ? this.deletionTimestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return ExtensionProperty;
        })(DirectoryObject);
        DirectoryServices.ExtensionProperty = ExtensionProperty;

        var AppRole = (function (_super) {
            __extends(AppRole, _super);
            function AppRole(data) {
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.AppRole';
                this._allowedMemberTypes = new Array();
                this._allowedMemberTypesChanged = false;
                this._descriptionChanged = false;
                this._displayNameChanged = false;
                this._idChanged = false;
                this._isEnabledChanged = false;
                this._valueChanged = false;

                if (!data) {
                    return;
                }

                this._allowedMemberTypes = data.allowedMemberTypes;
                this._description = data.description;
                this._displayName = data.displayName;
                this._id = data.id;
                this._isEnabled = data.isEnabled;
                this._value = data.value;
            }
            Object.defineProperty(AppRole.prototype, "allowedMemberTypes", {
                get: function () {
                    return this._allowedMemberTypes;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AppRole.prototype, "allowedMemberTypesChanged", {
                get: function () {
                    return this._allowedMemberTypesChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AppRole.prototype, "description", {
                get: function () {
                    return this._description;
                },
                set: function (value) {
                    if (value !== this._description) {
                        this._descriptionChanged = true;
                        this.changed = true;
                    }
                    this._description = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AppRole.prototype, "descriptionChanged", {
                get: function () {
                    return this._descriptionChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AppRole.prototype, "displayName", {
                get: function () {
                    return this._displayName;
                },
                set: function (value) {
                    if (value !== this._displayName) {
                        this._displayNameChanged = true;
                        this.changed = true;
                    }
                    this._displayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AppRole.prototype, "displayNameChanged", {
                get: function () {
                    return this._displayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AppRole.prototype, "id", {
                get: function () {
                    return this._id;
                },
                set: function (value) {
                    if (value !== this._id) {
                        this._idChanged = true;
                        this.changed = true;
                    }
                    this._id = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AppRole.prototype, "idChanged", {
                get: function () {
                    return this._idChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AppRole.prototype, "isEnabled", {
                get: function () {
                    return this._isEnabled;
                },
                set: function (value) {
                    if (value !== this._isEnabled) {
                        this._isEnabledChanged = true;
                        this.changed = true;
                    }
                    this._isEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AppRole.prototype, "isEnabledChanged", {
                get: function () {
                    return this._isEnabledChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AppRole.prototype, "value", {
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (value !== this._value) {
                        this._valueChanged = true;
                        this.changed = true;
                    }
                    this._value = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AppRole.prototype, "valueChanged", {
                get: function () {
                    return this._valueChanged;
                },
                enumerable: true,
                configurable: true
            });

            AppRole.parseAppRole = function (data) {
                if (!data)
                    return null;

                return new AppRole(data);
            };

            AppRole.parseAppRoles = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(AppRole.parseAppRole(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            AppRole.prototype.getRequestBody = function () {
                return {
                    allowedMemberTypes: (this.allowedMemberTypesChanged && this.allowedMemberTypes) ? this.allowedMemberTypes : undefined,
                    description: (this.descriptionChanged && this.description) ? this.description : undefined,
                    displayName: (this.displayNameChanged && this.displayName) ? this.displayName : undefined,
                    id: (this.idChanged && this.id) ? this.id : undefined,
                    isEnabled: (this.isEnabledChanged && this.isEnabled) ? this.isEnabled : undefined,
                    value: (this.valueChanged && this.value) ? this.value : undefined,
                    'odata.type': this._odataType
                };
            };
            return AppRole;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.AppRole = AppRole;

        var KeyCredential = (function (_super) {
            __extends(KeyCredential, _super);
            function KeyCredential(data) {
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.KeyCredential';
                this._customKeyIdentifierChanged = false;
                this._endDateChanged = false;
                this._keyIdChanged = false;
                this._startDateChanged = false;
                this._typeChanged = false;
                this._usageChanged = false;
                this._valueChanged = false;

                if (!data) {
                    return;
                }

                this._customKeyIdentifier = data.customKeyIdentifier;
                this._endDate = (data.endDate !== null) ? new Date(data.endDate) : null;
                this._keyId = data.keyId;
                this._startDate = (data.startDate !== null) ? new Date(data.startDate) : null;
                this._type = data.type;
                this._usage = data.usage;
                this._value = data.value;
            }
            Object.defineProperty(KeyCredential.prototype, "customKeyIdentifier", {
                get: function () {
                    return this._customKeyIdentifier;
                },
                set: function (value) {
                    if (value !== this._customKeyIdentifier) {
                        this._customKeyIdentifierChanged = true;
                        this.changed = true;
                    }
                    this._customKeyIdentifier = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(KeyCredential.prototype, "customKeyIdentifierChanged", {
                get: function () {
                    return this._customKeyIdentifierChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(KeyCredential.prototype, "endDate", {
                get: function () {
                    return this._endDate;
                },
                set: function (value) {
                    if (value !== this._endDate) {
                        this._endDateChanged = true;
                        this.changed = true;
                    }
                    this._endDate = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(KeyCredential.prototype, "endDateChanged", {
                get: function () {
                    return this._endDateChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(KeyCredential.prototype, "keyId", {
                get: function () {
                    return this._keyId;
                },
                set: function (value) {
                    if (value !== this._keyId) {
                        this._keyIdChanged = true;
                        this.changed = true;
                    }
                    this._keyId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(KeyCredential.prototype, "keyIdChanged", {
                get: function () {
                    return this._keyIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(KeyCredential.prototype, "startDate", {
                get: function () {
                    return this._startDate;
                },
                set: function (value) {
                    if (value !== this._startDate) {
                        this._startDateChanged = true;
                        this.changed = true;
                    }
                    this._startDate = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(KeyCredential.prototype, "startDateChanged", {
                get: function () {
                    return this._startDateChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(KeyCredential.prototype, "type", {
                get: function () {
                    return this._type;
                },
                set: function (value) {
                    if (value !== this._type) {
                        this._typeChanged = true;
                        this.changed = true;
                    }
                    this._type = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(KeyCredential.prototype, "typeChanged", {
                get: function () {
                    return this._typeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(KeyCredential.prototype, "usage", {
                get: function () {
                    return this._usage;
                },
                set: function (value) {
                    if (value !== this._usage) {
                        this._usageChanged = true;
                        this.changed = true;
                    }
                    this._usage = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(KeyCredential.prototype, "usageChanged", {
                get: function () {
                    return this._usageChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(KeyCredential.prototype, "value", {
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (value !== this._value) {
                        this._valueChanged = true;
                        this.changed = true;
                    }
                    this._value = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(KeyCredential.prototype, "valueChanged", {
                get: function () {
                    return this._valueChanged;
                },
                enumerable: true,
                configurable: true
            });

            KeyCredential.parseKeyCredential = function (data) {
                if (!data)
                    return null;

                return new KeyCredential(data);
            };

            KeyCredential.parseKeyCredentials = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(KeyCredential.parseKeyCredential(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            KeyCredential.prototype.getRequestBody = function () {
                return {
                    customKeyIdentifier: (this.customKeyIdentifierChanged && this.customKeyIdentifier) ? this.customKeyIdentifier : undefined,
                    endDate: (this.endDateChanged && this.endDate) ? this.endDate.toString() : undefined,
                    keyId: (this.keyIdChanged && this.keyId) ? this.keyId : undefined,
                    startDate: (this.startDateChanged && this.startDate) ? this.startDate.toString() : undefined,
                    type: (this.typeChanged && this.type) ? this.type : undefined,
                    usage: (this.usageChanged && this.usage) ? this.usage : undefined,
                    value: (this.valueChanged && this.value) ? this.value : undefined,
                    'odata.type': this._odataType
                };
            };
            return KeyCredential;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.KeyCredential = KeyCredential;

        var OAuth2Permission = (function (_super) {
            __extends(OAuth2Permission, _super);
            function OAuth2Permission(data) {
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.OAuth2Permission';
                this._adminConsentDescriptionChanged = false;
                this._adminConsentDisplayNameChanged = false;
                this._idChanged = false;
                this._isEnabledChanged = false;
                this._typeChanged = false;
                this._userConsentDescriptionChanged = false;
                this._userConsentDisplayNameChanged = false;
                this._valueChanged = false;

                if (!data) {
                    return;
                }

                this._adminConsentDescription = data.adminConsentDescription;
                this._adminConsentDisplayName = data.adminConsentDisplayName;
                this._id = data.id;
                this._isEnabled = data.isEnabled;
                this._type = data.type;
                this._userConsentDescription = data.userConsentDescription;
                this._userConsentDisplayName = data.userConsentDisplayName;
                this._value = data.value;
            }
            Object.defineProperty(OAuth2Permission.prototype, "adminConsentDescription", {
                get: function () {
                    return this._adminConsentDescription;
                },
                set: function (value) {
                    if (value !== this._adminConsentDescription) {
                        this._adminConsentDescriptionChanged = true;
                        this.changed = true;
                    }
                    this._adminConsentDescription = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2Permission.prototype, "adminConsentDescriptionChanged", {
                get: function () {
                    return this._adminConsentDescriptionChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(OAuth2Permission.prototype, "adminConsentDisplayName", {
                get: function () {
                    return this._adminConsentDisplayName;
                },
                set: function (value) {
                    if (value !== this._adminConsentDisplayName) {
                        this._adminConsentDisplayNameChanged = true;
                        this.changed = true;
                    }
                    this._adminConsentDisplayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2Permission.prototype, "adminConsentDisplayNameChanged", {
                get: function () {
                    return this._adminConsentDisplayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(OAuth2Permission.prototype, "id", {
                get: function () {
                    return this._id;
                },
                set: function (value) {
                    if (value !== this._id) {
                        this._idChanged = true;
                        this.changed = true;
                    }
                    this._id = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2Permission.prototype, "idChanged", {
                get: function () {
                    return this._idChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(OAuth2Permission.prototype, "isEnabled", {
                get: function () {
                    return this._isEnabled;
                },
                set: function (value) {
                    if (value !== this._isEnabled) {
                        this._isEnabledChanged = true;
                        this.changed = true;
                    }
                    this._isEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2Permission.prototype, "isEnabledChanged", {
                get: function () {
                    return this._isEnabledChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(OAuth2Permission.prototype, "type", {
                get: function () {
                    return this._type;
                },
                set: function (value) {
                    if (value !== this._type) {
                        this._typeChanged = true;
                        this.changed = true;
                    }
                    this._type = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2Permission.prototype, "typeChanged", {
                get: function () {
                    return this._typeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(OAuth2Permission.prototype, "userConsentDescription", {
                get: function () {
                    return this._userConsentDescription;
                },
                set: function (value) {
                    if (value !== this._userConsentDescription) {
                        this._userConsentDescriptionChanged = true;
                        this.changed = true;
                    }
                    this._userConsentDescription = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2Permission.prototype, "userConsentDescriptionChanged", {
                get: function () {
                    return this._userConsentDescriptionChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(OAuth2Permission.prototype, "userConsentDisplayName", {
                get: function () {
                    return this._userConsentDisplayName;
                },
                set: function (value) {
                    if (value !== this._userConsentDisplayName) {
                        this._userConsentDisplayNameChanged = true;
                        this.changed = true;
                    }
                    this._userConsentDisplayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2Permission.prototype, "userConsentDisplayNameChanged", {
                get: function () {
                    return this._userConsentDisplayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(OAuth2Permission.prototype, "value", {
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (value !== this._value) {
                        this._valueChanged = true;
                        this.changed = true;
                    }
                    this._value = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2Permission.prototype, "valueChanged", {
                get: function () {
                    return this._valueChanged;
                },
                enumerable: true,
                configurable: true
            });

            OAuth2Permission.parseOAuth2Permission = function (data) {
                if (!data)
                    return null;

                return new OAuth2Permission(data);
            };

            OAuth2Permission.parseOAuth2Permissions = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(OAuth2Permission.parseOAuth2Permission(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            OAuth2Permission.prototype.getRequestBody = function () {
                return {
                    adminConsentDescription: (this.adminConsentDescriptionChanged && this.adminConsentDescription) ? this.adminConsentDescription : undefined,
                    adminConsentDisplayName: (this.adminConsentDisplayNameChanged && this.adminConsentDisplayName) ? this.adminConsentDisplayName : undefined,
                    id: (this.idChanged && this.id) ? this.id : undefined,
                    isEnabled: (this.isEnabledChanged && this.isEnabled) ? this.isEnabled : undefined,
                    type: (this.typeChanged && this.type) ? this.type : undefined,
                    userConsentDescription: (this.userConsentDescriptionChanged && this.userConsentDescription) ? this.userConsentDescription : undefined,
                    userConsentDisplayName: (this.userConsentDisplayNameChanged && this.userConsentDisplayName) ? this.userConsentDisplayName : undefined,
                    value: (this.valueChanged && this.value) ? this.value : undefined,
                    'odata.type': this._odataType
                };
            };
            return OAuth2Permission;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.OAuth2Permission = OAuth2Permission;

        var PasswordCredential = (function (_super) {
            __extends(PasswordCredential, _super);
            function PasswordCredential(data) {
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.PasswordCredential';
                this._customKeyIdentifierChanged = false;
                this._endDateChanged = false;
                this._keyIdChanged = false;
                this._startDateChanged = false;
                this._valueChanged = false;

                if (!data) {
                    return;
                }

                this._customKeyIdentifier = data.customKeyIdentifier;
                this._endDate = (data.endDate !== null) ? new Date(data.endDate) : null;
                this._keyId = data.keyId;
                this._startDate = (data.startDate !== null) ? new Date(data.startDate) : null;
                this._value = data.value;
            }
            Object.defineProperty(PasswordCredential.prototype, "customKeyIdentifier", {
                get: function () {
                    return this._customKeyIdentifier;
                },
                set: function (value) {
                    if (value !== this._customKeyIdentifier) {
                        this._customKeyIdentifierChanged = true;
                        this.changed = true;
                    }
                    this._customKeyIdentifier = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(PasswordCredential.prototype, "customKeyIdentifierChanged", {
                get: function () {
                    return this._customKeyIdentifierChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PasswordCredential.prototype, "endDate", {
                get: function () {
                    return this._endDate;
                },
                set: function (value) {
                    if (value !== this._endDate) {
                        this._endDateChanged = true;
                        this.changed = true;
                    }
                    this._endDate = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(PasswordCredential.prototype, "endDateChanged", {
                get: function () {
                    return this._endDateChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PasswordCredential.prototype, "keyId", {
                get: function () {
                    return this._keyId;
                },
                set: function (value) {
                    if (value !== this._keyId) {
                        this._keyIdChanged = true;
                        this.changed = true;
                    }
                    this._keyId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(PasswordCredential.prototype, "keyIdChanged", {
                get: function () {
                    return this._keyIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PasswordCredential.prototype, "startDate", {
                get: function () {
                    return this._startDate;
                },
                set: function (value) {
                    if (value !== this._startDate) {
                        this._startDateChanged = true;
                        this.changed = true;
                    }
                    this._startDate = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(PasswordCredential.prototype, "startDateChanged", {
                get: function () {
                    return this._startDateChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PasswordCredential.prototype, "value", {
                get: function () {
                    return this._value;
                },
                set: function (value) {
                    if (value !== this._value) {
                        this._valueChanged = true;
                        this.changed = true;
                    }
                    this._value = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(PasswordCredential.prototype, "valueChanged", {
                get: function () {
                    return this._valueChanged;
                },
                enumerable: true,
                configurable: true
            });

            PasswordCredential.parsePasswordCredential = function (data) {
                if (!data)
                    return null;

                return new PasswordCredential(data);
            };

            PasswordCredential.parsePasswordCredentials = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(PasswordCredential.parsePasswordCredential(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            PasswordCredential.prototype.getRequestBody = function () {
                return {
                    customKeyIdentifier: (this.customKeyIdentifierChanged && this.customKeyIdentifier) ? this.customKeyIdentifier : undefined,
                    endDate: (this.endDateChanged && this.endDate) ? this.endDate.toString() : undefined,
                    keyId: (this.keyIdChanged && this.keyId) ? this.keyId : undefined,
                    startDate: (this.startDateChanged && this.startDate) ? this.startDate.toString() : undefined,
                    value: (this.valueChanged && this.value) ? this.value : undefined,
                    'odata.type': this._odataType
                };
            };
            return PasswordCredential;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.PasswordCredential = PasswordCredential;

        var RequiredResourceAccess = (function (_super) {
            __extends(RequiredResourceAccess, _super);
            function RequiredResourceAccess(data) {
                var _this = this;
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.RequiredResourceAccess';
                this._resourceAppIdChanged = false;
                this._resourceAccess = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._resourceAccessChanged = false;
                this._resourceAccessChangedListener = (function (value) {
                    _this._resourceAccessChanged = true;
                    _this.changed = true;
                }).bind(this);

                if (!data) {
                    this._resourceAccess.addChangedListener(this._resourceAccessChangedListener);
                    return;
                }

                this._resourceAppId = data.resourceAppId;
                this._resourceAccess = ResourceAccess.parseResourceAccesses(data.resourceAccess);
                this._resourceAccess.addChangedListener(this._resourceAccessChangedListener);
            }
            Object.defineProperty(RequiredResourceAccess.prototype, "resourceAppId", {
                get: function () {
                    return this._resourceAppId;
                },
                set: function (value) {
                    if (value !== this._resourceAppId) {
                        this._resourceAppIdChanged = true;
                        this.changed = true;
                    }
                    this._resourceAppId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(RequiredResourceAccess.prototype, "resourceAppIdChanged", {
                get: function () {
                    return this._resourceAppIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RequiredResourceAccess.prototype, "resourceAccess", {
                get: function () {
                    return this._resourceAccess;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(RequiredResourceAccess.prototype, "resourceAccessChanged", {
                get: function () {
                    return this._resourceAccessChanged;
                },
                enumerable: true,
                configurable: true
            });

            RequiredResourceAccess.parseRequiredResourceAccess = function (data) {
                if (!data)
                    return null;

                return new RequiredResourceAccess(data);
            };

            RequiredResourceAccess.parseRequiredResourceAccesses = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(RequiredResourceAccess.parseRequiredResourceAccess(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            RequiredResourceAccess.prototype.getRequestBody = function () {
                return {
                    resourceAppId: (this.resourceAppIdChanged && this.resourceAppId) ? this.resourceAppId : undefined,
                    resourceAccess: (this.resourceAccessChanged) ? (function (resourceAccess) {
                        if (!resourceAccess) {
                            return undefined;
                        }
                        var converted = [];
                        resourceAccess.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.resourceAccess) : undefined,
                    'odata.type': this._odataType
                };
            };
            return RequiredResourceAccess;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.RequiredResourceAccess = RequiredResourceAccess;

        var ResourceAccess = (function (_super) {
            __extends(ResourceAccess, _super);
            function ResourceAccess(data) {
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.ResourceAccess';
                this._idChanged = false;
                this._typeChanged = false;

                if (!data) {
                    return;
                }

                this._id = data.id;
                this._type = data.type;
            }
            Object.defineProperty(ResourceAccess.prototype, "id", {
                get: function () {
                    return this._id;
                },
                set: function (value) {
                    if (value !== this._id) {
                        this._idChanged = true;
                        this.changed = true;
                    }
                    this._id = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ResourceAccess.prototype, "idChanged", {
                get: function () {
                    return this._idChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ResourceAccess.prototype, "type", {
                get: function () {
                    return this._type;
                },
                set: function (value) {
                    if (value !== this._type) {
                        this._typeChanged = true;
                        this.changed = true;
                    }
                    this._type = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ResourceAccess.prototype, "typeChanged", {
                get: function () {
                    return this._typeChanged;
                },
                enumerable: true,
                configurable: true
            });

            ResourceAccess.parseResourceAccess = function (data) {
                if (!data)
                    return null;

                return new ResourceAccess(data);
            };

            ResourceAccess.parseResourceAccesses = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(ResourceAccess.parseResourceAccess(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            ResourceAccess.prototype.getRequestBody = function () {
                return {
                    id: (this.idChanged && this.id) ? this.id : undefined,
                    type: (this.typeChanged && this.type) ? this.type : undefined,
                    'odata.type': this._odataType
                };
            };
            return ResourceAccess;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.ResourceAccess = ResourceAccess;

        var ContactFetcher = (function (_super) {
            __extends(ContactFetcher, _super);
            function ContactFetcher(context, path) {
                _super.call(this, context, path);
            }
            ContactFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/contacts' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(Contact.parseContact(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return ContactFetcher;
        })(DirectoryObjectFetcher);
        DirectoryServices.ContactFetcher = ContactFetcher;

        var Contact = (function (_super) {
            __extends(Contact, _super);
            function Contact(context, path, data) {
                var _this = this;
                _super.call(this, context, path, data);
                this._odataType = 'Microsoft.DirectoryServices.Contact';
                this._cityChanged = false;
                this._countryChanged = false;
                this._departmentChanged = false;
                this._dirSyncEnabledChanged = false;
                this._displayNameChanged = false;
                this._facsimileTelephoneNumberChanged = false;
                this._givenNameChanged = false;
                this._jobTitleChanged = false;
                this._lastDirSyncTimeChanged = false;
                this._mailChanged = false;
                this._mailNicknameChanged = false;
                this._mobileChanged = false;
                this._physicalDeliveryOfficeNameChanged = false;
                this._postalCodeChanged = false;
                this._provisioningErrors = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._provisioningErrorsChanged = false;
                this._provisioningErrorsChangedListener = (function (value) {
                    _this._provisioningErrorsChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._proxyAddresses = new Array();
                this._proxyAddressesChanged = false;
                this._sipProxyAddressChanged = false;
                this._stateChanged = false;
                this._streetAddressChanged = false;
                this._surnameChanged = false;
                this._telephoneNumberChanged = false;
                this._thumbnailPhotoChanged = false;

                if (!data) {
                    this._provisioningErrors.addChangedListener(this._provisioningErrorsChangedListener);
                    return;
                }

                this._city = data.city;
                this._country = data.country;
                this._department = data.department;
                this._dirSyncEnabled = data.dirSyncEnabled;
                this._displayName = data.displayName;
                this._facsimileTelephoneNumber = data.facsimileTelephoneNumber;
                this._givenName = data.givenName;
                this._jobTitle = data.jobTitle;
                this._lastDirSyncTime = (data.lastDirSyncTime !== null) ? new Date(data.lastDirSyncTime) : null;
                this._mail = data.mail;
                this._mailNickname = data.mailNickname;
                this._mobile = data.mobile;
                this._physicalDeliveryOfficeName = data.physicalDeliveryOfficeName;
                this._postalCode = data.postalCode;
                this._provisioningErrors = ProvisioningError.parseProvisioningErrors(data.provisioningErrors);
                this._provisioningErrors.addChangedListener(this._provisioningErrorsChangedListener);
                this._proxyAddresses = data.proxyAddresses;
                this._sipProxyAddress = data.sipProxyAddress;
                this._state = data.state;
                this._streetAddress = data.streetAddress;
                this._surname = data.surname;
                this._telephoneNumber = data.telephoneNumber;
                this._thumbnailPhoto = data.thumbnailPhoto;
            }
            Object.defineProperty(Contact.prototype, "city", {
                get: function () {
                    return this._city;
                },
                set: function (value) {
                    if (value !== this._city) {
                        this._cityChanged = true;
                        this.changed = true;
                    }
                    this._city = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "cityChanged", {
                get: function () {
                    return this._cityChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "country", {
                get: function () {
                    return this._country;
                },
                set: function (value) {
                    if (value !== this._country) {
                        this._countryChanged = true;
                        this.changed = true;
                    }
                    this._country = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "countryChanged", {
                get: function () {
                    return this._countryChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "department", {
                get: function () {
                    return this._department;
                },
                set: function (value) {
                    if (value !== this._department) {
                        this._departmentChanged = true;
                        this.changed = true;
                    }
                    this._department = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "departmentChanged", {
                get: function () {
                    return this._departmentChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "dirSyncEnabled", {
                get: function () {
                    return this._dirSyncEnabled;
                },
                set: function (value) {
                    if (value !== this._dirSyncEnabled) {
                        this._dirSyncEnabledChanged = true;
                        this.changed = true;
                    }
                    this._dirSyncEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "dirSyncEnabledChanged", {
                get: function () {
                    return this._dirSyncEnabledChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "displayName", {
                get: function () {
                    return this._displayName;
                },
                set: function (value) {
                    if (value !== this._displayName) {
                        this._displayNameChanged = true;
                        this.changed = true;
                    }
                    this._displayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "displayNameChanged", {
                get: function () {
                    return this._displayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "facsimileTelephoneNumber", {
                get: function () {
                    return this._facsimileTelephoneNumber;
                },
                set: function (value) {
                    if (value !== this._facsimileTelephoneNumber) {
                        this._facsimileTelephoneNumberChanged = true;
                        this.changed = true;
                    }
                    this._facsimileTelephoneNumber = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "facsimileTelephoneNumberChanged", {
                get: function () {
                    return this._facsimileTelephoneNumberChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "givenName", {
                get: function () {
                    return this._givenName;
                },
                set: function (value) {
                    if (value !== this._givenName) {
                        this._givenNameChanged = true;
                        this.changed = true;
                    }
                    this._givenName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "givenNameChanged", {
                get: function () {
                    return this._givenNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "jobTitle", {
                get: function () {
                    return this._jobTitle;
                },
                set: function (value) {
                    if (value !== this._jobTitle) {
                        this._jobTitleChanged = true;
                        this.changed = true;
                    }
                    this._jobTitle = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "jobTitleChanged", {
                get: function () {
                    return this._jobTitleChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "lastDirSyncTime", {
                get: function () {
                    return this._lastDirSyncTime;
                },
                set: function (value) {
                    if (value !== this._lastDirSyncTime) {
                        this._lastDirSyncTimeChanged = true;
                        this.changed = true;
                    }
                    this._lastDirSyncTime = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "lastDirSyncTimeChanged", {
                get: function () {
                    return this._lastDirSyncTimeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "mail", {
                get: function () {
                    return this._mail;
                },
                set: function (value) {
                    if (value !== this._mail) {
                        this._mailChanged = true;
                        this.changed = true;
                    }
                    this._mail = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "mailChanged", {
                get: function () {
                    return this._mailChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "mailNickname", {
                get: function () {
                    return this._mailNickname;
                },
                set: function (value) {
                    if (value !== this._mailNickname) {
                        this._mailNicknameChanged = true;
                        this.changed = true;
                    }
                    this._mailNickname = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "mailNicknameChanged", {
                get: function () {
                    return this._mailNicknameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "mobile", {
                get: function () {
                    return this._mobile;
                },
                set: function (value) {
                    if (value !== this._mobile) {
                        this._mobileChanged = true;
                        this.changed = true;
                    }
                    this._mobile = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "mobileChanged", {
                get: function () {
                    return this._mobileChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "physicalDeliveryOfficeName", {
                get: function () {
                    return this._physicalDeliveryOfficeName;
                },
                set: function (value) {
                    if (value !== this._physicalDeliveryOfficeName) {
                        this._physicalDeliveryOfficeNameChanged = true;
                        this.changed = true;
                    }
                    this._physicalDeliveryOfficeName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "physicalDeliveryOfficeNameChanged", {
                get: function () {
                    return this._physicalDeliveryOfficeNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "postalCode", {
                get: function () {
                    return this._postalCode;
                },
                set: function (value) {
                    if (value !== this._postalCode) {
                        this._postalCodeChanged = true;
                        this.changed = true;
                    }
                    this._postalCode = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "postalCodeChanged", {
                get: function () {
                    return this._postalCodeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "provisioningErrors", {
                get: function () {
                    return this._provisioningErrors;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "provisioningErrorsChanged", {
                get: function () {
                    return this._provisioningErrorsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "proxyAddresses", {
                get: function () {
                    return this._proxyAddresses;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "proxyAddressesChanged", {
                get: function () {
                    return this._proxyAddressesChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "sipProxyAddress", {
                get: function () {
                    return this._sipProxyAddress;
                },
                set: function (value) {
                    if (value !== this._sipProxyAddress) {
                        this._sipProxyAddressChanged = true;
                        this.changed = true;
                    }
                    this._sipProxyAddress = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "sipProxyAddressChanged", {
                get: function () {
                    return this._sipProxyAddressChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "state", {
                get: function () {
                    return this._state;
                },
                set: function (value) {
                    if (value !== this._state) {
                        this._stateChanged = true;
                        this.changed = true;
                    }
                    this._state = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "stateChanged", {
                get: function () {
                    return this._stateChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "streetAddress", {
                get: function () {
                    return this._streetAddress;
                },
                set: function (value) {
                    if (value !== this._streetAddress) {
                        this._streetAddressChanged = true;
                        this.changed = true;
                    }
                    this._streetAddress = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "streetAddressChanged", {
                get: function () {
                    return this._streetAddressChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "surname", {
                get: function () {
                    return this._surname;
                },
                set: function (value) {
                    if (value !== this._surname) {
                        this._surnameChanged = true;
                        this.changed = true;
                    }
                    this._surname = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "surnameChanged", {
                get: function () {
                    return this._surnameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "telephoneNumber", {
                get: function () {
                    return this._telephoneNumber;
                },
                set: function (value) {
                    if (value !== this._telephoneNumber) {
                        this._telephoneNumberChanged = true;
                        this.changed = true;
                    }
                    this._telephoneNumber = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "telephoneNumberChanged", {
                get: function () {
                    return this._telephoneNumberChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Contact.prototype, "thumbnailPhoto", {
                get: function () {
                    return this._thumbnailPhoto;
                },
                set: function (value) {
                    if (value !== this._thumbnailPhoto) {
                        this._thumbnailPhotoChanged = true;
                        this.changed = true;
                    }
                    this._thumbnailPhoto = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Contact.prototype, "thumbnailPhotoChanged", {
                get: function () {
                    return this._thumbnailPhotoChanged;
                },
                enumerable: true,
                configurable: true
            });

            Contact.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/contacts' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(Contact.parseContact(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            Contact.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            Contact.parseContact = function (context, path, data) {
                if (!data)
                    return null;

                return new Contact(context, path, data);
            };

            Contact.parseContacts = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(Contact.parseContact(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            Contact.prototype.getRequestBody = function () {
                return {
                    city: (this.cityChanged && this.city) ? this.city : undefined,
                    country: (this.countryChanged && this.country) ? this.country : undefined,
                    department: (this.departmentChanged && this.department) ? this.department : undefined,
                    dirSyncEnabled: (this.dirSyncEnabledChanged && this.dirSyncEnabled) ? this.dirSyncEnabled : undefined,
                    displayName: (this.displayNameChanged && this.displayName) ? this.displayName : undefined,
                    facsimileTelephoneNumber: (this.facsimileTelephoneNumberChanged && this.facsimileTelephoneNumber) ? this.facsimileTelephoneNumber : undefined,
                    givenName: (this.givenNameChanged && this.givenName) ? this.givenName : undefined,
                    jobTitle: (this.jobTitleChanged && this.jobTitle) ? this.jobTitle : undefined,
                    lastDirSyncTime: (this.lastDirSyncTimeChanged && this.lastDirSyncTime) ? this.lastDirSyncTime.toString() : undefined,
                    mail: (this.mailChanged && this.mail) ? this.mail : undefined,
                    mailNickname: (this.mailNicknameChanged && this.mailNickname) ? this.mailNickname : undefined,
                    mobile: (this.mobileChanged && this.mobile) ? this.mobile : undefined,
                    physicalDeliveryOfficeName: (this.physicalDeliveryOfficeNameChanged && this.physicalDeliveryOfficeName) ? this.physicalDeliveryOfficeName : undefined,
                    postalCode: (this.postalCodeChanged && this.postalCode) ? this.postalCode : undefined,
                    provisioningErrors: (this.provisioningErrorsChanged) ? (function (provisioningErrors) {
                        if (!provisioningErrors) {
                            return undefined;
                        }
                        var converted = [];
                        provisioningErrors.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.provisioningErrors) : undefined,
                    proxyAddresses: (this.proxyAddressesChanged && this.proxyAddresses) ? this.proxyAddresses : undefined,
                    sipProxyAddress: (this.sipProxyAddressChanged && this.sipProxyAddress) ? this.sipProxyAddress : undefined,
                    state: (this.stateChanged && this.state) ? this.state : undefined,
                    streetAddress: (this.streetAddressChanged && this.streetAddress) ? this.streetAddress : undefined,
                    surname: (this.surnameChanged && this.surname) ? this.surname : undefined,
                    telephoneNumber: (this.telephoneNumberChanged && this.telephoneNumber) ? this.telephoneNumber : undefined,
                    thumbnailPhoto: (this.thumbnailPhotoChanged && this.thumbnailPhoto) ? this.thumbnailPhoto : undefined,
                    objectType: (this.objectTypeChanged && this.objectType) ? this.objectType : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    deletionTimestamp: (this.deletionTimestampChanged && this.deletionTimestamp) ? this.deletionTimestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return Contact;
        })(DirectoryObject);
        DirectoryServices.Contact = Contact;

        var ProvisioningError = (function (_super) {
            __extends(ProvisioningError, _super);
            function ProvisioningError(data) {
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.ProvisioningError';
                this._errorDetailChanged = false;
                this._resolvedChanged = false;
                this._serviceChanged = false;
                this._timestampChanged = false;

                if (!data) {
                    return;
                }

                this._errorDetail = data.errorDetail;
                this._resolved = data.resolved;
                this._service = data.service;
                this._timestamp = (data.timestamp !== null) ? new Date(data.timestamp) : null;
            }
            Object.defineProperty(ProvisioningError.prototype, "errorDetail", {
                get: function () {
                    return this._errorDetail;
                },
                set: function (value) {
                    if (value !== this._errorDetail) {
                        this._errorDetailChanged = true;
                        this.changed = true;
                    }
                    this._errorDetail = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ProvisioningError.prototype, "errorDetailChanged", {
                get: function () {
                    return this._errorDetailChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ProvisioningError.prototype, "resolved", {
                get: function () {
                    return this._resolved;
                },
                set: function (value) {
                    if (value !== this._resolved) {
                        this._resolvedChanged = true;
                        this.changed = true;
                    }
                    this._resolved = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ProvisioningError.prototype, "resolvedChanged", {
                get: function () {
                    return this._resolvedChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ProvisioningError.prototype, "service", {
                get: function () {
                    return this._service;
                },
                set: function (value) {
                    if (value !== this._service) {
                        this._serviceChanged = true;
                        this.changed = true;
                    }
                    this._service = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ProvisioningError.prototype, "serviceChanged", {
                get: function () {
                    return this._serviceChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ProvisioningError.prototype, "timestamp", {
                get: function () {
                    return this._timestamp;
                },
                set: function (value) {
                    if (value !== this._timestamp) {
                        this._timestampChanged = true;
                        this.changed = true;
                    }
                    this._timestamp = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ProvisioningError.prototype, "timestampChanged", {
                get: function () {
                    return this._timestampChanged;
                },
                enumerable: true,
                configurable: true
            });

            ProvisioningError.parseProvisioningError = function (data) {
                if (!data)
                    return null;

                return new ProvisioningError(data);
            };

            ProvisioningError.parseProvisioningErrors = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(ProvisioningError.parseProvisioningError(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            ProvisioningError.prototype.getRequestBody = function () {
                return {
                    errorDetail: (this.errorDetailChanged && this.errorDetail) ? this.errorDetail : undefined,
                    resolved: (this.resolvedChanged && this.resolved) ? this.resolved : undefined,
                    service: (this.serviceChanged && this.service) ? this.service : undefined,
                    timestamp: (this.timestampChanged && this.timestamp) ? this.timestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return ProvisioningError;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.ProvisioningError = ProvisioningError;

        var DeviceFetcher = (function (_super) {
            __extends(DeviceFetcher, _super);
            function DeviceFetcher(context, path) {
                _super.call(this, context, path);
            }
            Object.defineProperty(DeviceFetcher.prototype, "registeredOwners", {
                get: function () {
                    if (this._registeredOwners === undefined) {
                        this._registeredOwners = new DirectoryObjects(this.context, this.getPath("registeredOwners"));
                    }
                    return this._registeredOwners;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DeviceFetcher.prototype, "registeredUsers", {
                get: function () {
                    if (this._registeredUsers === undefined) {
                        this._registeredUsers = new DirectoryObjects(this.context, this.getPath("registeredUsers"));
                    }
                    return this._registeredUsers;
                },
                enumerable: true,
                configurable: true
            });

            DeviceFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/devices' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(Device.parseDevice(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return DeviceFetcher;
        })(DirectoryObjectFetcher);
        DirectoryServices.DeviceFetcher = DeviceFetcher;

        var Device = (function (_super) {
            __extends(Device, _super);
            function Device(context, path, data) {
                var _this = this;
                _super.call(this, context, path, data);
                this._odataType = 'Microsoft.DirectoryServices.Device';
                this._accountEnabledChanged = false;
                this._alternativeSecurityIds = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._alternativeSecurityIdsChanged = false;
                this._alternativeSecurityIdsChangedListener = (function (value) {
                    _this._alternativeSecurityIdsChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._approximateLastLogonTimestampChanged = false;
                this._deviceIdChanged = false;
                this._deviceMetadataChanged = false;
                this._deviceObjectVersionChanged = false;
                this._deviceOSTypeChanged = false;
                this._deviceOSVersionChanged = false;
                this._devicePhysicalIds = new Array();
                this._devicePhysicalIdsChanged = false;
                this._deviceTrustTypeChanged = false;
                this._dirSyncEnabledChanged = false;
                this._displayNameChanged = false;
                this._lastDirSyncTimeChanged = false;

                if (!data) {
                    this._alternativeSecurityIds.addChangedListener(this._alternativeSecurityIdsChangedListener);
                    return;
                }

                this._accountEnabled = data.accountEnabled;
                this._alternativeSecurityIds = AlternativeSecurityId.parseAlternativeSecurityIds(data.alternativeSecurityIds);
                this._alternativeSecurityIds.addChangedListener(this._alternativeSecurityIdsChangedListener);
                this._approximateLastLogonTimestamp = (data.approximateLastLogonTimestamp !== null) ? new Date(data.approximateLastLogonTimestamp) : null;
                this._deviceId = data.deviceId;
                this._deviceMetadata = data.deviceMetadata;
                this._deviceObjectVersion = data.deviceObjectVersion;
                this._deviceOSType = data.deviceOSType;
                this._deviceOSVersion = data.deviceOSVersion;
                this._devicePhysicalIds = data.devicePhysicalIds;
                this._deviceTrustType = data.deviceTrustType;
                this._dirSyncEnabled = data.dirSyncEnabled;
                this._displayName = data.displayName;
                this._lastDirSyncTime = (data.lastDirSyncTime !== null) ? new Date(data.lastDirSyncTime) : null;
            }
            Object.defineProperty(Device.prototype, "accountEnabled", {
                get: function () {
                    return this._accountEnabled;
                },
                set: function (value) {
                    if (value !== this._accountEnabled) {
                        this._accountEnabledChanged = true;
                        this.changed = true;
                    }
                    this._accountEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Device.prototype, "accountEnabledChanged", {
                get: function () {
                    return this._accountEnabledChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "alternativeSecurityIds", {
                get: function () {
                    return this._alternativeSecurityIds;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "alternativeSecurityIdsChanged", {
                get: function () {
                    return this._alternativeSecurityIdsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "approximateLastLogonTimestamp", {
                get: function () {
                    return this._approximateLastLogonTimestamp;
                },
                set: function (value) {
                    if (value !== this._approximateLastLogonTimestamp) {
                        this._approximateLastLogonTimestampChanged = true;
                        this.changed = true;
                    }
                    this._approximateLastLogonTimestamp = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Device.prototype, "approximateLastLogonTimestampChanged", {
                get: function () {
                    return this._approximateLastLogonTimestampChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "deviceId", {
                get: function () {
                    return this._deviceId;
                },
                set: function (value) {
                    if (value !== this._deviceId) {
                        this._deviceIdChanged = true;
                        this.changed = true;
                    }
                    this._deviceId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Device.prototype, "deviceIdChanged", {
                get: function () {
                    return this._deviceIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "deviceMetadata", {
                get: function () {
                    return this._deviceMetadata;
                },
                set: function (value) {
                    if (value !== this._deviceMetadata) {
                        this._deviceMetadataChanged = true;
                        this.changed = true;
                    }
                    this._deviceMetadata = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Device.prototype, "deviceMetadataChanged", {
                get: function () {
                    return this._deviceMetadataChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "deviceObjectVersion", {
                get: function () {
                    return this._deviceObjectVersion;
                },
                set: function (value) {
                    if (value !== this._deviceObjectVersion) {
                        this._deviceObjectVersionChanged = true;
                        this.changed = true;
                    }
                    this._deviceObjectVersion = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Device.prototype, "deviceObjectVersionChanged", {
                get: function () {
                    return this._deviceObjectVersionChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "deviceOSType", {
                get: function () {
                    return this._deviceOSType;
                },
                set: function (value) {
                    if (value !== this._deviceOSType) {
                        this._deviceOSTypeChanged = true;
                        this.changed = true;
                    }
                    this._deviceOSType = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Device.prototype, "deviceOSTypeChanged", {
                get: function () {
                    return this._deviceOSTypeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "deviceOSVersion", {
                get: function () {
                    return this._deviceOSVersion;
                },
                set: function (value) {
                    if (value !== this._deviceOSVersion) {
                        this._deviceOSVersionChanged = true;
                        this.changed = true;
                    }
                    this._deviceOSVersion = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Device.prototype, "deviceOSVersionChanged", {
                get: function () {
                    return this._deviceOSVersionChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "devicePhysicalIds", {
                get: function () {
                    return this._devicePhysicalIds;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "devicePhysicalIdsChanged", {
                get: function () {
                    return this._devicePhysicalIdsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "deviceTrustType", {
                get: function () {
                    return this._deviceTrustType;
                },
                set: function (value) {
                    if (value !== this._deviceTrustType) {
                        this._deviceTrustTypeChanged = true;
                        this.changed = true;
                    }
                    this._deviceTrustType = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Device.prototype, "deviceTrustTypeChanged", {
                get: function () {
                    return this._deviceTrustTypeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "dirSyncEnabled", {
                get: function () {
                    return this._dirSyncEnabled;
                },
                set: function (value) {
                    if (value !== this._dirSyncEnabled) {
                        this._dirSyncEnabledChanged = true;
                        this.changed = true;
                    }
                    this._dirSyncEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Device.prototype, "dirSyncEnabledChanged", {
                get: function () {
                    return this._dirSyncEnabledChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "displayName", {
                get: function () {
                    return this._displayName;
                },
                set: function (value) {
                    if (value !== this._displayName) {
                        this._displayNameChanged = true;
                        this.changed = true;
                    }
                    this._displayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Device.prototype, "displayNameChanged", {
                get: function () {
                    return this._displayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "lastDirSyncTime", {
                get: function () {
                    return this._lastDirSyncTime;
                },
                set: function (value) {
                    if (value !== this._lastDirSyncTime) {
                        this._lastDirSyncTimeChanged = true;
                        this.changed = true;
                    }
                    this._lastDirSyncTime = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Device.prototype, "lastDirSyncTimeChanged", {
                get: function () {
                    return this._lastDirSyncTimeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "registeredOwners", {
                get: function () {
                    if (this._registeredOwners === undefined) {
                        this._registeredOwners = new DirectoryObjects(this.context, this.getPath("registeredOwners"));
                    }
                    return this._registeredOwners;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Device.prototype, "registeredUsers", {
                get: function () {
                    if (this._registeredUsers === undefined) {
                        this._registeredUsers = new DirectoryObjects(this.context, this.getPath("registeredUsers"));
                    }
                    return this._registeredUsers;
                },
                enumerable: true,
                configurable: true
            });

            Device.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/devices' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(Device.parseDevice(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            Device.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            Device.parseDevice = function (context, path, data) {
                if (!data)
                    return null;

                return new Device(context, path, data);
            };

            Device.parseDevices = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(Device.parseDevice(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            Device.prototype.getRequestBody = function () {
                return {
                    accountEnabled: (this.accountEnabledChanged && this.accountEnabled) ? this.accountEnabled : undefined,
                    alternativeSecurityIds: (this.alternativeSecurityIdsChanged) ? (function (alternativeSecurityIds) {
                        if (!alternativeSecurityIds) {
                            return undefined;
                        }
                        var converted = [];
                        alternativeSecurityIds.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.alternativeSecurityIds) : undefined,
                    approximateLastLogonTimestamp: (this.approximateLastLogonTimestampChanged && this.approximateLastLogonTimestamp) ? this.approximateLastLogonTimestamp.toString() : undefined,
                    deviceId: (this.deviceIdChanged && this.deviceId) ? this.deviceId : undefined,
                    deviceMetadata: (this.deviceMetadataChanged && this.deviceMetadata) ? this.deviceMetadata : undefined,
                    deviceObjectVersion: (this.deviceObjectVersionChanged && this.deviceObjectVersion) ? this.deviceObjectVersion : undefined,
                    deviceOSType: (this.deviceOSTypeChanged && this.deviceOSType) ? this.deviceOSType : undefined,
                    deviceOSVersion: (this.deviceOSVersionChanged && this.deviceOSVersion) ? this.deviceOSVersion : undefined,
                    devicePhysicalIds: (this.devicePhysicalIdsChanged && this.devicePhysicalIds) ? this.devicePhysicalIds : undefined,
                    deviceTrustType: (this.deviceTrustTypeChanged && this.deviceTrustType) ? this.deviceTrustType : undefined,
                    dirSyncEnabled: (this.dirSyncEnabledChanged && this.dirSyncEnabled) ? this.dirSyncEnabled : undefined,
                    displayName: (this.displayNameChanged && this.displayName) ? this.displayName : undefined,
                    lastDirSyncTime: (this.lastDirSyncTimeChanged && this.lastDirSyncTime) ? this.lastDirSyncTime.toString() : undefined,
                    objectType: (this.objectTypeChanged && this.objectType) ? this.objectType : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    deletionTimestamp: (this.deletionTimestampChanged && this.deletionTimestamp) ? this.deletionTimestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return Device;
        })(DirectoryObject);
        DirectoryServices.Device = Device;

        var AlternativeSecurityId = (function (_super) {
            __extends(AlternativeSecurityId, _super);
            function AlternativeSecurityId(data) {
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.AlternativeSecurityId';
                this._typeChanged = false;
                this._identityProviderChanged = false;
                this._keyChanged = false;

                if (!data) {
                    return;
                }

                this._type = data.type;
                this._identityProvider = data.identityProvider;
                this._key = data.key;
            }
            Object.defineProperty(AlternativeSecurityId.prototype, "type", {
                get: function () {
                    return this._type;
                },
                set: function (value) {
                    if (value !== this._type) {
                        this._typeChanged = true;
                        this.changed = true;
                    }
                    this._type = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AlternativeSecurityId.prototype, "typeChanged", {
                get: function () {
                    return this._typeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AlternativeSecurityId.prototype, "identityProvider", {
                get: function () {
                    return this._identityProvider;
                },
                set: function (value) {
                    if (value !== this._identityProvider) {
                        this._identityProviderChanged = true;
                        this.changed = true;
                    }
                    this._identityProvider = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AlternativeSecurityId.prototype, "identityProviderChanged", {
                get: function () {
                    return this._identityProviderChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AlternativeSecurityId.prototype, "key", {
                get: function () {
                    return this._key;
                },
                set: function (value) {
                    if (value !== this._key) {
                        this._keyChanged = true;
                        this.changed = true;
                    }
                    this._key = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AlternativeSecurityId.prototype, "keyChanged", {
                get: function () {
                    return this._keyChanged;
                },
                enumerable: true,
                configurable: true
            });

            AlternativeSecurityId.parseAlternativeSecurityId = function (data) {
                if (!data)
                    return null;

                return new AlternativeSecurityId(data);
            };

            AlternativeSecurityId.parseAlternativeSecurityIds = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(AlternativeSecurityId.parseAlternativeSecurityId(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            AlternativeSecurityId.prototype.getRequestBody = function () {
                return {
                    type: (this.typeChanged && this.type) ? this.type : undefined,
                    identityProvider: (this.identityProviderChanged && this.identityProvider) ? this.identityProvider : undefined,
                    key: (this.keyChanged && this.key) ? this.key : undefined,
                    'odata.type': this._odataType
                };
            };
            return AlternativeSecurityId;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.AlternativeSecurityId = AlternativeSecurityId;

        var DeviceConfigurationFetcher = (function (_super) {
            __extends(DeviceConfigurationFetcher, _super);
            function DeviceConfigurationFetcher(context, path) {
                _super.call(this, context, path);
            }
            DeviceConfigurationFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/deviceConfigurations' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(DeviceConfiguration.parseDeviceConfiguration(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return DeviceConfigurationFetcher;
        })(DirectoryObjectFetcher);
        DirectoryServices.DeviceConfigurationFetcher = DeviceConfigurationFetcher;

        var DeviceConfiguration = (function (_super) {
            __extends(DeviceConfiguration, _super);
            function DeviceConfiguration(context, path, data) {
                _super.call(this, context, path, data);
                this._odataType = 'Microsoft.DirectoryServices.DeviceConfiguration';
                this._publicIssuerCertificates = new Array();
                this._publicIssuerCertificatesChanged = false;
                this._cloudPublicIssuerCertificates = new Array();
                this._cloudPublicIssuerCertificatesChanged = false;
                this._registrationQuotaChanged = false;
                this._maximumRegistrationInactivityPeriodChanged = false;

                if (!data) {
                    return;
                }

                this._publicIssuerCertificates = data.publicIssuerCertificates;
                this._cloudPublicIssuerCertificates = data.cloudPublicIssuerCertificates;
                this._registrationQuota = data.registrationQuota;
                this._maximumRegistrationInactivityPeriod = data.maximumRegistrationInactivityPeriod;
            }
            Object.defineProperty(DeviceConfiguration.prototype, "publicIssuerCertificates", {
                get: function () {
                    return this._publicIssuerCertificates;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DeviceConfiguration.prototype, "publicIssuerCertificatesChanged", {
                get: function () {
                    return this._publicIssuerCertificatesChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DeviceConfiguration.prototype, "cloudPublicIssuerCertificates", {
                get: function () {
                    return this._cloudPublicIssuerCertificates;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DeviceConfiguration.prototype, "cloudPublicIssuerCertificatesChanged", {
                get: function () {
                    return this._cloudPublicIssuerCertificatesChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DeviceConfiguration.prototype, "registrationQuota", {
                get: function () {
                    return this._registrationQuota;
                },
                set: function (value) {
                    if (value !== this._registrationQuota) {
                        this._registrationQuotaChanged = true;
                        this.changed = true;
                    }
                    this._registrationQuota = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DeviceConfiguration.prototype, "registrationQuotaChanged", {
                get: function () {
                    return this._registrationQuotaChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DeviceConfiguration.prototype, "maximumRegistrationInactivityPeriod", {
                get: function () {
                    return this._maximumRegistrationInactivityPeriod;
                },
                set: function (value) {
                    if (value !== this._maximumRegistrationInactivityPeriod) {
                        this._maximumRegistrationInactivityPeriodChanged = true;
                        this.changed = true;
                    }
                    this._maximumRegistrationInactivityPeriod = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DeviceConfiguration.prototype, "maximumRegistrationInactivityPeriodChanged", {
                get: function () {
                    return this._maximumRegistrationInactivityPeriodChanged;
                },
                enumerable: true,
                configurable: true
            });

            DeviceConfiguration.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/deviceConfigurations' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(DeviceConfiguration.parseDeviceConfiguration(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            DeviceConfiguration.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            DeviceConfiguration.parseDeviceConfiguration = function (context, path, data) {
                if (!data)
                    return null;

                return new DeviceConfiguration(context, path, data);
            };

            DeviceConfiguration.parseDeviceConfigurations = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(DeviceConfiguration.parseDeviceConfiguration(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            DeviceConfiguration.prototype.getRequestBody = function () {
                return {
                    publicIssuerCertificates: (this.publicIssuerCertificatesChanged && this.publicIssuerCertificates) ? this.publicIssuerCertificates : undefined,
                    cloudPublicIssuerCertificates: (this.cloudPublicIssuerCertificatesChanged && this.cloudPublicIssuerCertificates) ? this.cloudPublicIssuerCertificates : undefined,
                    registrationQuota: (this.registrationQuotaChanged && this.registrationQuota) ? this.registrationQuota : undefined,
                    maximumRegistrationInactivityPeriod: (this.maximumRegistrationInactivityPeriodChanged && this.maximumRegistrationInactivityPeriod) ? this.maximumRegistrationInactivityPeriod : undefined,
                    objectType: (this.objectTypeChanged && this.objectType) ? this.objectType : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    deletionTimestamp: (this.deletionTimestampChanged && this.deletionTimestamp) ? this.deletionTimestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return DeviceConfiguration;
        })(DirectoryObject);
        DirectoryServices.DeviceConfiguration = DeviceConfiguration;

        var DirectoryLinkChangeFetcher = (function (_super) {
            __extends(DirectoryLinkChangeFetcher, _super);
            function DirectoryLinkChangeFetcher(context, path) {
                _super.call(this, context, path);
            }
            DirectoryLinkChangeFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/directoryLinkChanges' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(DirectoryLinkChange.parseDirectoryLinkChange(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return DirectoryLinkChangeFetcher;
        })(DirectoryObjectFetcher);
        DirectoryServices.DirectoryLinkChangeFetcher = DirectoryLinkChangeFetcher;

        var DirectoryLinkChange = (function (_super) {
            __extends(DirectoryLinkChange, _super);
            function DirectoryLinkChange(context, path, data) {
                _super.call(this, context, path, data);
                this._odataType = 'Microsoft.DirectoryServices.DirectoryLinkChange';
                this._associationTypeChanged = false;
                this._sourceObjectIdChanged = false;
                this._sourceObjectTypeChanged = false;
                this._sourceObjectUriChanged = false;
                this._targetObjectIdChanged = false;
                this._targetObjectTypeChanged = false;
                this._targetObjectUriChanged = false;

                if (!data) {
                    return;
                }

                this._associationType = data.associationType;
                this._sourceObjectId = data.sourceObjectId;
                this._sourceObjectType = data.sourceObjectType;
                this._sourceObjectUri = data.sourceObjectUri;
                this._targetObjectId = data.targetObjectId;
                this._targetObjectType = data.targetObjectType;
                this._targetObjectUri = data.targetObjectUri;
            }
            Object.defineProperty(DirectoryLinkChange.prototype, "associationType", {
                get: function () {
                    return this._associationType;
                },
                set: function (value) {
                    if (value !== this._associationType) {
                        this._associationTypeChanged = true;
                        this.changed = true;
                    }
                    this._associationType = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryLinkChange.prototype, "associationTypeChanged", {
                get: function () {
                    return this._associationTypeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryLinkChange.prototype, "sourceObjectId", {
                get: function () {
                    return this._sourceObjectId;
                },
                set: function (value) {
                    if (value !== this._sourceObjectId) {
                        this._sourceObjectIdChanged = true;
                        this.changed = true;
                    }
                    this._sourceObjectId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryLinkChange.prototype, "sourceObjectIdChanged", {
                get: function () {
                    return this._sourceObjectIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryLinkChange.prototype, "sourceObjectType", {
                get: function () {
                    return this._sourceObjectType;
                },
                set: function (value) {
                    if (value !== this._sourceObjectType) {
                        this._sourceObjectTypeChanged = true;
                        this.changed = true;
                    }
                    this._sourceObjectType = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryLinkChange.prototype, "sourceObjectTypeChanged", {
                get: function () {
                    return this._sourceObjectTypeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryLinkChange.prototype, "sourceObjectUri", {
                get: function () {
                    return this._sourceObjectUri;
                },
                set: function (value) {
                    if (value !== this._sourceObjectUri) {
                        this._sourceObjectUriChanged = true;
                        this.changed = true;
                    }
                    this._sourceObjectUri = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryLinkChange.prototype, "sourceObjectUriChanged", {
                get: function () {
                    return this._sourceObjectUriChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryLinkChange.prototype, "targetObjectId", {
                get: function () {
                    return this._targetObjectId;
                },
                set: function (value) {
                    if (value !== this._targetObjectId) {
                        this._targetObjectIdChanged = true;
                        this.changed = true;
                    }
                    this._targetObjectId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryLinkChange.prototype, "targetObjectIdChanged", {
                get: function () {
                    return this._targetObjectIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryLinkChange.prototype, "targetObjectType", {
                get: function () {
                    return this._targetObjectType;
                },
                set: function (value) {
                    if (value !== this._targetObjectType) {
                        this._targetObjectTypeChanged = true;
                        this.changed = true;
                    }
                    this._targetObjectType = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryLinkChange.prototype, "targetObjectTypeChanged", {
                get: function () {
                    return this._targetObjectTypeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryLinkChange.prototype, "targetObjectUri", {
                get: function () {
                    return this._targetObjectUri;
                },
                set: function (value) {
                    if (value !== this._targetObjectUri) {
                        this._targetObjectUriChanged = true;
                        this.changed = true;
                    }
                    this._targetObjectUri = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryLinkChange.prototype, "targetObjectUriChanged", {
                get: function () {
                    return this._targetObjectUriChanged;
                },
                enumerable: true,
                configurable: true
            });

            DirectoryLinkChange.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/directoryLinkChanges' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(DirectoryLinkChange.parseDirectoryLinkChange(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            DirectoryLinkChange.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            DirectoryLinkChange.parseDirectoryLinkChange = function (context, path, data) {
                if (!data)
                    return null;

                return new DirectoryLinkChange(context, path, data);
            };

            DirectoryLinkChange.parseDirectoryLinkChanges = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(DirectoryLinkChange.parseDirectoryLinkChange(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            DirectoryLinkChange.prototype.getRequestBody = function () {
                return {
                    associationType: (this.associationTypeChanged && this.associationType) ? this.associationType : undefined,
                    sourceObjectId: (this.sourceObjectIdChanged && this.sourceObjectId) ? this.sourceObjectId : undefined,
                    sourceObjectType: (this.sourceObjectTypeChanged && this.sourceObjectType) ? this.sourceObjectType : undefined,
                    sourceObjectUri: (this.sourceObjectUriChanged && this.sourceObjectUri) ? this.sourceObjectUri : undefined,
                    targetObjectId: (this.targetObjectIdChanged && this.targetObjectId) ? this.targetObjectId : undefined,
                    targetObjectType: (this.targetObjectTypeChanged && this.targetObjectType) ? this.targetObjectType : undefined,
                    targetObjectUri: (this.targetObjectUriChanged && this.targetObjectUri) ? this.targetObjectUri : undefined,
                    objectType: (this.objectTypeChanged && this.objectType) ? this.objectType : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    deletionTimestamp: (this.deletionTimestampChanged && this.deletionTimestamp) ? this.deletionTimestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return DirectoryLinkChange;
        })(DirectoryObject);
        DirectoryServices.DirectoryLinkChange = DirectoryLinkChange;

        var AppRoleAssignmentFetcher = (function (_super) {
            __extends(AppRoleAssignmentFetcher, _super);
            function AppRoleAssignmentFetcher(context, path) {
                _super.call(this, context, path);
            }
            AppRoleAssignmentFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/appRoleAssignments' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(AppRoleAssignment.parseAppRoleAssignment(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return AppRoleAssignmentFetcher;
        })(DirectoryObjectFetcher);
        DirectoryServices.AppRoleAssignmentFetcher = AppRoleAssignmentFetcher;

        var AppRoleAssignment = (function (_super) {
            __extends(AppRoleAssignment, _super);
            function AppRoleAssignment(context, path, data) {
                _super.call(this, context, path, data);
                this._odataType = 'Microsoft.DirectoryServices.AppRoleAssignment';
                this._creationTimestampChanged = false;
                this._idChanged = false;
                this._principalDisplayNameChanged = false;
                this._principalIdChanged = false;
                this._principalTypeChanged = false;
                this._resourceDisplayNameChanged = false;
                this._resourceIdChanged = false;

                if (!data) {
                    return;
                }

                this._creationTimestamp = (data.creationTimestamp !== null) ? new Date(data.creationTimestamp) : null;
                this._id = data.id;
                this._principalDisplayName = data.principalDisplayName;
                this._principalId = data.principalId;
                this._principalType = data.principalType;
                this._resourceDisplayName = data.resourceDisplayName;
                this._resourceId = data.resourceId;
            }
            Object.defineProperty(AppRoleAssignment.prototype, "creationTimestamp", {
                get: function () {
                    return this._creationTimestamp;
                },
                set: function (value) {
                    if (value !== this._creationTimestamp) {
                        this._creationTimestampChanged = true;
                        this.changed = true;
                    }
                    this._creationTimestamp = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AppRoleAssignment.prototype, "creationTimestampChanged", {
                get: function () {
                    return this._creationTimestampChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AppRoleAssignment.prototype, "id", {
                get: function () {
                    return this._id;
                },
                set: function (value) {
                    if (value !== this._id) {
                        this._idChanged = true;
                        this.changed = true;
                    }
                    this._id = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AppRoleAssignment.prototype, "idChanged", {
                get: function () {
                    return this._idChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AppRoleAssignment.prototype, "principalDisplayName", {
                get: function () {
                    return this._principalDisplayName;
                },
                set: function (value) {
                    if (value !== this._principalDisplayName) {
                        this._principalDisplayNameChanged = true;
                        this.changed = true;
                    }
                    this._principalDisplayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AppRoleAssignment.prototype, "principalDisplayNameChanged", {
                get: function () {
                    return this._principalDisplayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AppRoleAssignment.prototype, "principalId", {
                get: function () {
                    return this._principalId;
                },
                set: function (value) {
                    if (value !== this._principalId) {
                        this._principalIdChanged = true;
                        this.changed = true;
                    }
                    this._principalId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AppRoleAssignment.prototype, "principalIdChanged", {
                get: function () {
                    return this._principalIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AppRoleAssignment.prototype, "principalType", {
                get: function () {
                    return this._principalType;
                },
                set: function (value) {
                    if (value !== this._principalType) {
                        this._principalTypeChanged = true;
                        this.changed = true;
                    }
                    this._principalType = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AppRoleAssignment.prototype, "principalTypeChanged", {
                get: function () {
                    return this._principalTypeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AppRoleAssignment.prototype, "resourceDisplayName", {
                get: function () {
                    return this._resourceDisplayName;
                },
                set: function (value) {
                    if (value !== this._resourceDisplayName) {
                        this._resourceDisplayNameChanged = true;
                        this.changed = true;
                    }
                    this._resourceDisplayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AppRoleAssignment.prototype, "resourceDisplayNameChanged", {
                get: function () {
                    return this._resourceDisplayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AppRoleAssignment.prototype, "resourceId", {
                get: function () {
                    return this._resourceId;
                },
                set: function (value) {
                    if (value !== this._resourceId) {
                        this._resourceIdChanged = true;
                        this.changed = true;
                    }
                    this._resourceId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AppRoleAssignment.prototype, "resourceIdChanged", {
                get: function () {
                    return this._resourceIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            AppRoleAssignment.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/appRoleAssignments' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(AppRoleAssignment.parseAppRoleAssignment(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            AppRoleAssignment.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            AppRoleAssignment.parseAppRoleAssignment = function (context, path, data) {
                if (!data)
                    return null;

                return new AppRoleAssignment(context, path, data);
            };

            AppRoleAssignment.parseAppRoleAssignments = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(AppRoleAssignment.parseAppRoleAssignment(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            AppRoleAssignment.prototype.getRequestBody = function () {
                return {
                    creationTimestamp: (this.creationTimestampChanged && this.creationTimestamp) ? this.creationTimestamp.toString() : undefined,
                    id: (this.idChanged && this.id) ? this.id : undefined,
                    principalDisplayName: (this.principalDisplayNameChanged && this.principalDisplayName) ? this.principalDisplayName : undefined,
                    principalId: (this.principalIdChanged && this.principalId) ? this.principalId : undefined,
                    principalType: (this.principalTypeChanged && this.principalType) ? this.principalType : undefined,
                    resourceDisplayName: (this.resourceDisplayNameChanged && this.resourceDisplayName) ? this.resourceDisplayName : undefined,
                    resourceId: (this.resourceIdChanged && this.resourceId) ? this.resourceId : undefined,
                    objectType: (this.objectTypeChanged && this.objectType) ? this.objectType : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    deletionTimestamp: (this.deletionTimestampChanged && this.deletionTimestamp) ? this.deletionTimestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return AppRoleAssignment;
        })(DirectoryObject);
        DirectoryServices.AppRoleAssignment = AppRoleAssignment;

        var GroupFetcher = (function (_super) {
            __extends(GroupFetcher, _super);
            function GroupFetcher(context, path) {
                _super.call(this, context, path);
            }
            Object.defineProperty(GroupFetcher.prototype, "appRoleAssignments", {
                get: function () {
                    if (this._appRoleAssignments === undefined) {
                        this._appRoleAssignments = new AppRoleAssignments(this.context, this.getPath("appRoleAssignments"));
                    }
                    return this._appRoleAssignments;
                },
                enumerable: true,
                configurable: true
            });

            GroupFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/groups' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(Group.parseGroup(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return GroupFetcher;
        })(DirectoryObjectFetcher);
        DirectoryServices.GroupFetcher = GroupFetcher;

        var Group = (function (_super) {
            __extends(Group, _super);
            function Group(context, path, data) {
                var _this = this;
                _super.call(this, context, path, data);
                this._odataType = 'Microsoft.DirectoryServices.Group';
                this._descriptionChanged = false;
                this._dirSyncEnabledChanged = false;
                this._displayNameChanged = false;
                this._lastDirSyncTimeChanged = false;
                this._mailChanged = false;
                this._mailNicknameChanged = false;
                this._mailEnabledChanged = false;
                this._onPremisesSecurityIdentifierChanged = false;
                this._provisioningErrors = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._provisioningErrorsChanged = false;
                this._provisioningErrorsChangedListener = (function (value) {
                    _this._provisioningErrorsChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._proxyAddresses = new Array();
                this._proxyAddressesChanged = false;
                this._securityEnabledChanged = false;

                if (!data) {
                    this._provisioningErrors.addChangedListener(this._provisioningErrorsChangedListener);
                    return;
                }

                this._description = data.description;
                this._dirSyncEnabled = data.dirSyncEnabled;
                this._displayName = data.displayName;
                this._lastDirSyncTime = (data.lastDirSyncTime !== null) ? new Date(data.lastDirSyncTime) : null;
                this._mail = data.mail;
                this._mailNickname = data.mailNickname;
                this._mailEnabled = data.mailEnabled;
                this._onPremisesSecurityIdentifier = data.onPremisesSecurityIdentifier;
                this._provisioningErrors = ProvisioningError.parseProvisioningErrors(data.provisioningErrors);
                this._provisioningErrors.addChangedListener(this._provisioningErrorsChangedListener);
                this._proxyAddresses = data.proxyAddresses;
                this._securityEnabled = data.securityEnabled;
            }
            Object.defineProperty(Group.prototype, "description", {
                get: function () {
                    return this._description;
                },
                set: function (value) {
                    if (value !== this._description) {
                        this._descriptionChanged = true;
                        this.changed = true;
                    }
                    this._description = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Group.prototype, "descriptionChanged", {
                get: function () {
                    return this._descriptionChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Group.prototype, "dirSyncEnabled", {
                get: function () {
                    return this._dirSyncEnabled;
                },
                set: function (value) {
                    if (value !== this._dirSyncEnabled) {
                        this._dirSyncEnabledChanged = true;
                        this.changed = true;
                    }
                    this._dirSyncEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Group.prototype, "dirSyncEnabledChanged", {
                get: function () {
                    return this._dirSyncEnabledChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Group.prototype, "displayName", {
                get: function () {
                    return this._displayName;
                },
                set: function (value) {
                    if (value !== this._displayName) {
                        this._displayNameChanged = true;
                        this.changed = true;
                    }
                    this._displayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Group.prototype, "displayNameChanged", {
                get: function () {
                    return this._displayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Group.prototype, "lastDirSyncTime", {
                get: function () {
                    return this._lastDirSyncTime;
                },
                set: function (value) {
                    if (value !== this._lastDirSyncTime) {
                        this._lastDirSyncTimeChanged = true;
                        this.changed = true;
                    }
                    this._lastDirSyncTime = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Group.prototype, "lastDirSyncTimeChanged", {
                get: function () {
                    return this._lastDirSyncTimeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Group.prototype, "mail", {
                get: function () {
                    return this._mail;
                },
                set: function (value) {
                    if (value !== this._mail) {
                        this._mailChanged = true;
                        this.changed = true;
                    }
                    this._mail = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Group.prototype, "mailChanged", {
                get: function () {
                    return this._mailChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Group.prototype, "mailNickname", {
                get: function () {
                    return this._mailNickname;
                },
                set: function (value) {
                    if (value !== this._mailNickname) {
                        this._mailNicknameChanged = true;
                        this.changed = true;
                    }
                    this._mailNickname = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Group.prototype, "mailNicknameChanged", {
                get: function () {
                    return this._mailNicknameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Group.prototype, "mailEnabled", {
                get: function () {
                    return this._mailEnabled;
                },
                set: function (value) {
                    if (value !== this._mailEnabled) {
                        this._mailEnabledChanged = true;
                        this.changed = true;
                    }
                    this._mailEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Group.prototype, "mailEnabledChanged", {
                get: function () {
                    return this._mailEnabledChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Group.prototype, "onPremisesSecurityIdentifier", {
                get: function () {
                    return this._onPremisesSecurityIdentifier;
                },
                set: function (value) {
                    if (value !== this._onPremisesSecurityIdentifier) {
                        this._onPremisesSecurityIdentifierChanged = true;
                        this.changed = true;
                    }
                    this._onPremisesSecurityIdentifier = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Group.prototype, "onPremisesSecurityIdentifierChanged", {
                get: function () {
                    return this._onPremisesSecurityIdentifierChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Group.prototype, "provisioningErrors", {
                get: function () {
                    return this._provisioningErrors;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Group.prototype, "provisioningErrorsChanged", {
                get: function () {
                    return this._provisioningErrorsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Group.prototype, "proxyAddresses", {
                get: function () {
                    return this._proxyAddresses;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Group.prototype, "proxyAddressesChanged", {
                get: function () {
                    return this._proxyAddressesChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Group.prototype, "securityEnabled", {
                get: function () {
                    return this._securityEnabled;
                },
                set: function (value) {
                    if (value !== this._securityEnabled) {
                        this._securityEnabledChanged = true;
                        this.changed = true;
                    }
                    this._securityEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(Group.prototype, "securityEnabledChanged", {
                get: function () {
                    return this._securityEnabledChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Group.prototype, "appRoleAssignments", {
                get: function () {
                    if (this._appRoleAssignments === undefined) {
                        this._appRoleAssignments = new AppRoleAssignments(this.context, this.getPath("appRoleAssignments"));
                    }
                    return this._appRoleAssignments;
                },
                enumerable: true,
                configurable: true
            });

            Group.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/groups' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(Group.parseGroup(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            Group.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            Group.parseGroup = function (context, path, data) {
                if (!data)
                    return null;

                return new Group(context, path, data);
            };

            Group.parseGroups = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(Group.parseGroup(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            Group.prototype.getRequestBody = function () {
                return {
                    description: (this.descriptionChanged && this.description) ? this.description : undefined,
                    dirSyncEnabled: (this.dirSyncEnabledChanged && this.dirSyncEnabled) ? this.dirSyncEnabled : undefined,
                    displayName: (this.displayNameChanged && this.displayName) ? this.displayName : undefined,
                    lastDirSyncTime: (this.lastDirSyncTimeChanged && this.lastDirSyncTime) ? this.lastDirSyncTime.toString() : undefined,
                    mail: (this.mailChanged && this.mail) ? this.mail : undefined,
                    mailNickname: (this.mailNicknameChanged && this.mailNickname) ? this.mailNickname : undefined,
                    mailEnabled: (this.mailEnabledChanged && this.mailEnabled) ? this.mailEnabled : undefined,
                    onPremisesSecurityIdentifier: (this.onPremisesSecurityIdentifierChanged && this.onPremisesSecurityIdentifier) ? this.onPremisesSecurityIdentifier : undefined,
                    provisioningErrors: (this.provisioningErrorsChanged) ? (function (provisioningErrors) {
                        if (!provisioningErrors) {
                            return undefined;
                        }
                        var converted = [];
                        provisioningErrors.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.provisioningErrors) : undefined,
                    proxyAddresses: (this.proxyAddressesChanged && this.proxyAddresses) ? this.proxyAddresses : undefined,
                    securityEnabled: (this.securityEnabledChanged && this.securityEnabled) ? this.securityEnabled : undefined,
                    objectType: (this.objectTypeChanged && this.objectType) ? this.objectType : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    deletionTimestamp: (this.deletionTimestampChanged && this.deletionTimestamp) ? this.deletionTimestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return Group;
        })(DirectoryObject);
        DirectoryServices.Group = Group;

        var DirectoryRoleFetcher = (function (_super) {
            __extends(DirectoryRoleFetcher, _super);
            function DirectoryRoleFetcher(context, path) {
                _super.call(this, context, path);
            }
            DirectoryRoleFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/directoryRoles' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(DirectoryRole.parseDirectoryRole(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return DirectoryRoleFetcher;
        })(DirectoryObjectFetcher);
        DirectoryServices.DirectoryRoleFetcher = DirectoryRoleFetcher;

        var DirectoryRole = (function (_super) {
            __extends(DirectoryRole, _super);
            function DirectoryRole(context, path, data) {
                _super.call(this, context, path, data);
                this._odataType = 'Microsoft.DirectoryServices.DirectoryRole';
                this._descriptionChanged = false;
                this._displayNameChanged = false;
                this._isSystemChanged = false;
                this._roleDisabledChanged = false;
                this._roleTemplateIdChanged = false;

                if (!data) {
                    return;
                }

                this._description = data.description;
                this._displayName = data.displayName;
                this._isSystem = data.isSystem;
                this._roleDisabled = data.roleDisabled;
                this._roleTemplateId = data.roleTemplateId;
            }
            Object.defineProperty(DirectoryRole.prototype, "description", {
                get: function () {
                    return this._description;
                },
                set: function (value) {
                    if (value !== this._description) {
                        this._descriptionChanged = true;
                        this.changed = true;
                    }
                    this._description = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryRole.prototype, "descriptionChanged", {
                get: function () {
                    return this._descriptionChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryRole.prototype, "displayName", {
                get: function () {
                    return this._displayName;
                },
                set: function (value) {
                    if (value !== this._displayName) {
                        this._displayNameChanged = true;
                        this.changed = true;
                    }
                    this._displayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryRole.prototype, "displayNameChanged", {
                get: function () {
                    return this._displayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryRole.prototype, "isSystem", {
                get: function () {
                    return this._isSystem;
                },
                set: function (value) {
                    if (value !== this._isSystem) {
                        this._isSystemChanged = true;
                        this.changed = true;
                    }
                    this._isSystem = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryRole.prototype, "isSystemChanged", {
                get: function () {
                    return this._isSystemChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryRole.prototype, "roleDisabled", {
                get: function () {
                    return this._roleDisabled;
                },
                set: function (value) {
                    if (value !== this._roleDisabled) {
                        this._roleDisabledChanged = true;
                        this.changed = true;
                    }
                    this._roleDisabled = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryRole.prototype, "roleDisabledChanged", {
                get: function () {
                    return this._roleDisabledChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryRole.prototype, "roleTemplateId", {
                get: function () {
                    return this._roleTemplateId;
                },
                set: function (value) {
                    if (value !== this._roleTemplateId) {
                        this._roleTemplateIdChanged = true;
                        this.changed = true;
                    }
                    this._roleTemplateId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryRole.prototype, "roleTemplateIdChanged", {
                get: function () {
                    return this._roleTemplateIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            DirectoryRole.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/directoryRoles' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(DirectoryRole.parseDirectoryRole(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            DirectoryRole.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            DirectoryRole.parseDirectoryRole = function (context, path, data) {
                if (!data)
                    return null;

                return new DirectoryRole(context, path, data);
            };

            DirectoryRole.parseDirectoryRoles = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(DirectoryRole.parseDirectoryRole(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            DirectoryRole.prototype.getRequestBody = function () {
                return {
                    description: (this.descriptionChanged && this.description) ? this.description : undefined,
                    displayName: (this.displayNameChanged && this.displayName) ? this.displayName : undefined,
                    isSystem: (this.isSystemChanged && this.isSystem) ? this.isSystem : undefined,
                    roleDisabled: (this.roleDisabledChanged && this.roleDisabled) ? this.roleDisabled : undefined,
                    roleTemplateId: (this.roleTemplateIdChanged && this.roleTemplateId) ? this.roleTemplateId : undefined,
                    objectType: (this.objectTypeChanged && this.objectType) ? this.objectType : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    deletionTimestamp: (this.deletionTimestampChanged && this.deletionTimestamp) ? this.deletionTimestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return DirectoryRole;
        })(DirectoryObject);
        DirectoryServices.DirectoryRole = DirectoryRole;

        var DirectoryRoleTemplateFetcher = (function (_super) {
            __extends(DirectoryRoleTemplateFetcher, _super);
            function DirectoryRoleTemplateFetcher(context, path) {
                _super.call(this, context, path);
            }
            DirectoryRoleTemplateFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/directoryRoleTemplates' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(DirectoryRoleTemplate.parseDirectoryRoleTemplate(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return DirectoryRoleTemplateFetcher;
        })(DirectoryObjectFetcher);
        DirectoryServices.DirectoryRoleTemplateFetcher = DirectoryRoleTemplateFetcher;

        var DirectoryRoleTemplate = (function (_super) {
            __extends(DirectoryRoleTemplate, _super);
            function DirectoryRoleTemplate(context, path, data) {
                _super.call(this, context, path, data);
                this._odataType = 'Microsoft.DirectoryServices.DirectoryRoleTemplate';
                this._descriptionChanged = false;
                this._displayNameChanged = false;

                if (!data) {
                    return;
                }

                this._description = data.description;
                this._displayName = data.displayName;
            }
            Object.defineProperty(DirectoryRoleTemplate.prototype, "description", {
                get: function () {
                    return this._description;
                },
                set: function (value) {
                    if (value !== this._description) {
                        this._descriptionChanged = true;
                        this.changed = true;
                    }
                    this._description = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryRoleTemplate.prototype, "descriptionChanged", {
                get: function () {
                    return this._descriptionChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DirectoryRoleTemplate.prototype, "displayName", {
                get: function () {
                    return this._displayName;
                },
                set: function (value) {
                    if (value !== this._displayName) {
                        this._displayNameChanged = true;
                        this.changed = true;
                    }
                    this._displayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(DirectoryRoleTemplate.prototype, "displayNameChanged", {
                get: function () {
                    return this._displayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            DirectoryRoleTemplate.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/directoryRoleTemplates' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(DirectoryRoleTemplate.parseDirectoryRoleTemplate(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            DirectoryRoleTemplate.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            DirectoryRoleTemplate.parseDirectoryRoleTemplate = function (context, path, data) {
                if (!data)
                    return null;

                return new DirectoryRoleTemplate(context, path, data);
            };

            DirectoryRoleTemplate.parseDirectoryRoleTemplates = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(DirectoryRoleTemplate.parseDirectoryRoleTemplate(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            DirectoryRoleTemplate.prototype.getRequestBody = function () {
                return {
                    description: (this.descriptionChanged && this.description) ? this.description : undefined,
                    displayName: (this.displayNameChanged && this.displayName) ? this.displayName : undefined,
                    objectType: (this.objectTypeChanged && this.objectType) ? this.objectType : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    deletionTimestamp: (this.deletionTimestampChanged && this.deletionTimestamp) ? this.deletionTimestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return DirectoryRoleTemplate;
        })(DirectoryObject);
        DirectoryServices.DirectoryRoleTemplate = DirectoryRoleTemplate;

        var ServicePrincipalFetcher = (function (_super) {
            __extends(ServicePrincipalFetcher, _super);
            function ServicePrincipalFetcher(context, path) {
                _super.call(this, context, path);
            }
            Object.defineProperty(ServicePrincipalFetcher.prototype, "appRoleAssignedTo", {
                get: function () {
                    if (this._appRoleAssignedTo === undefined) {
                        this._appRoleAssignedTo = new AppRoleAssignments(this.context, this.getPath("appRoleAssignedTo"));
                    }
                    return this._appRoleAssignedTo;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipalFetcher.prototype, "appRoleAssignments", {
                get: function () {
                    if (this._appRoleAssignments === undefined) {
                        this._appRoleAssignments = new AppRoleAssignments(this.context, this.getPath("appRoleAssignments"));
                    }
                    return this._appRoleAssignments;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipalFetcher.prototype, "oauth2PermissionGrants", {
                get: function () {
                    if (this._oauth2PermissionGrants === undefined) {
                        this._oauth2PermissionGrants = new OAuth2PermissionGrants(this.context, this.getPath("oauth2PermissionGrants"));
                    }
                    return this._oauth2PermissionGrants;
                },
                enumerable: true,
                configurable: true
            });

            ServicePrincipalFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/servicePrincipals' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(ServicePrincipal.parseServicePrincipal(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return ServicePrincipalFetcher;
        })(DirectoryObjectFetcher);
        DirectoryServices.ServicePrincipalFetcher = ServicePrincipalFetcher;

        var ServicePrincipal = (function (_super) {
            __extends(ServicePrincipal, _super);
            function ServicePrincipal(context, path, data) {
                var _this = this;
                _super.call(this, context, path, data);
                this._odataType = 'Microsoft.DirectoryServices.ServicePrincipal';
                this._accountEnabledChanged = false;
                this._appDisplayNameChanged = false;
                this._appIdChanged = false;
                this._appOwnerTenantIdChanged = false;
                this._appRoleAssignmentRequiredChanged = false;
                this._appRoles = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._appRolesChanged = false;
                this._appRolesChangedListener = (function (value) {
                    _this._appRolesChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._displayNameChanged = false;
                this._errorUrlChanged = false;
                this._homepageChanged = false;
                this._keyCredentials = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._keyCredentialsChanged = false;
                this._keyCredentialsChangedListener = (function (value) {
                    _this._keyCredentialsChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._logoutUrlChanged = false;
                this._oauth2Permissions = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._oauth2PermissionsChanged = false;
                this._oauth2PermissionsChangedListener = (function (value) {
                    _this._oauth2PermissionsChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._passwordCredentials = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._passwordCredentialsChanged = false;
                this._passwordCredentialsChangedListener = (function (value) {
                    _this._passwordCredentialsChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._preferredTokenSigningKeyThumbprintChanged = false;
                this._publisherNameChanged = false;
                this._replyUrls = new Array();
                this._replyUrlsChanged = false;
                this._samlMetadataUrlChanged = false;
                this._servicePrincipalNames = new Array();
                this._servicePrincipalNamesChanged = false;
                this._tags = new Array();
                this._tagsChanged = false;

                if (!data) {
                    this._appRoles.addChangedListener(this._appRolesChangedListener);
                    this._keyCredentials.addChangedListener(this._keyCredentialsChangedListener);
                    this._oauth2Permissions.addChangedListener(this._oauth2PermissionsChangedListener);
                    this._passwordCredentials.addChangedListener(this._passwordCredentialsChangedListener);
                    return;
                }

                this._accountEnabled = data.accountEnabled;
                this._appDisplayName = data.appDisplayName;
                this._appId = data.appId;
                this._appOwnerTenantId = data.appOwnerTenantId;
                this._appRoleAssignmentRequired = data.appRoleAssignmentRequired;
                this._appRoles = AppRole.parseAppRoles(data.appRoles);
                this._appRoles.addChangedListener(this._appRolesChangedListener);
                this._displayName = data.displayName;
                this._errorUrl = data.errorUrl;
                this._homepage = data.homepage;
                this._keyCredentials = KeyCredential.parseKeyCredentials(data.keyCredentials);
                this._keyCredentials.addChangedListener(this._keyCredentialsChangedListener);
                this._logoutUrl = data.logoutUrl;
                this._oauth2Permissions = OAuth2Permission.parseOAuth2Permissions(data.oauth2Permissions);
                this._oauth2Permissions.addChangedListener(this._oauth2PermissionsChangedListener);
                this._passwordCredentials = PasswordCredential.parsePasswordCredentials(data.passwordCredentials);
                this._passwordCredentials.addChangedListener(this._passwordCredentialsChangedListener);
                this._preferredTokenSigningKeyThumbprint = data.preferredTokenSigningKeyThumbprint;
                this._publisherName = data.publisherName;
                this._replyUrls = data.replyUrls;
                this._samlMetadataUrl = data.samlMetadataUrl;
                this._servicePrincipalNames = data.servicePrincipalNames;
                this._tags = data.tags;
            }
            Object.defineProperty(ServicePrincipal.prototype, "accountEnabled", {
                get: function () {
                    return this._accountEnabled;
                },
                set: function (value) {
                    if (value !== this._accountEnabled) {
                        this._accountEnabledChanged = true;
                        this.changed = true;
                    }
                    this._accountEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ServicePrincipal.prototype, "accountEnabledChanged", {
                get: function () {
                    return this._accountEnabledChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "appDisplayName", {
                get: function () {
                    return this._appDisplayName;
                },
                set: function (value) {
                    if (value !== this._appDisplayName) {
                        this._appDisplayNameChanged = true;
                        this.changed = true;
                    }
                    this._appDisplayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ServicePrincipal.prototype, "appDisplayNameChanged", {
                get: function () {
                    return this._appDisplayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "appId", {
                get: function () {
                    return this._appId;
                },
                set: function (value) {
                    if (value !== this._appId) {
                        this._appIdChanged = true;
                        this.changed = true;
                    }
                    this._appId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ServicePrincipal.prototype, "appIdChanged", {
                get: function () {
                    return this._appIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "appOwnerTenantId", {
                get: function () {
                    return this._appOwnerTenantId;
                },
                set: function (value) {
                    if (value !== this._appOwnerTenantId) {
                        this._appOwnerTenantIdChanged = true;
                        this.changed = true;
                    }
                    this._appOwnerTenantId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ServicePrincipal.prototype, "appOwnerTenantIdChanged", {
                get: function () {
                    return this._appOwnerTenantIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "appRoleAssignmentRequired", {
                get: function () {
                    return this._appRoleAssignmentRequired;
                },
                set: function (value) {
                    if (value !== this._appRoleAssignmentRequired) {
                        this._appRoleAssignmentRequiredChanged = true;
                        this.changed = true;
                    }
                    this._appRoleAssignmentRequired = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ServicePrincipal.prototype, "appRoleAssignmentRequiredChanged", {
                get: function () {
                    return this._appRoleAssignmentRequiredChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "appRoles", {
                get: function () {
                    return this._appRoles;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "appRolesChanged", {
                get: function () {
                    return this._appRolesChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "displayName", {
                get: function () {
                    return this._displayName;
                },
                set: function (value) {
                    if (value !== this._displayName) {
                        this._displayNameChanged = true;
                        this.changed = true;
                    }
                    this._displayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ServicePrincipal.prototype, "displayNameChanged", {
                get: function () {
                    return this._displayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "errorUrl", {
                get: function () {
                    return this._errorUrl;
                },
                set: function (value) {
                    if (value !== this._errorUrl) {
                        this._errorUrlChanged = true;
                        this.changed = true;
                    }
                    this._errorUrl = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ServicePrincipal.prototype, "errorUrlChanged", {
                get: function () {
                    return this._errorUrlChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "homepage", {
                get: function () {
                    return this._homepage;
                },
                set: function (value) {
                    if (value !== this._homepage) {
                        this._homepageChanged = true;
                        this.changed = true;
                    }
                    this._homepage = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ServicePrincipal.prototype, "homepageChanged", {
                get: function () {
                    return this._homepageChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "keyCredentials", {
                get: function () {
                    return this._keyCredentials;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "keyCredentialsChanged", {
                get: function () {
                    return this._keyCredentialsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "logoutUrl", {
                get: function () {
                    return this._logoutUrl;
                },
                set: function (value) {
                    if (value !== this._logoutUrl) {
                        this._logoutUrlChanged = true;
                        this.changed = true;
                    }
                    this._logoutUrl = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ServicePrincipal.prototype, "logoutUrlChanged", {
                get: function () {
                    return this._logoutUrlChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "oauth2Permissions", {
                get: function () {
                    return this._oauth2Permissions;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "oauth2PermissionsChanged", {
                get: function () {
                    return this._oauth2PermissionsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "passwordCredentials", {
                get: function () {
                    return this._passwordCredentials;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "passwordCredentialsChanged", {
                get: function () {
                    return this._passwordCredentialsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "preferredTokenSigningKeyThumbprint", {
                get: function () {
                    return this._preferredTokenSigningKeyThumbprint;
                },
                set: function (value) {
                    if (value !== this._preferredTokenSigningKeyThumbprint) {
                        this._preferredTokenSigningKeyThumbprintChanged = true;
                        this.changed = true;
                    }
                    this._preferredTokenSigningKeyThumbprint = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ServicePrincipal.prototype, "preferredTokenSigningKeyThumbprintChanged", {
                get: function () {
                    return this._preferredTokenSigningKeyThumbprintChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "publisherName", {
                get: function () {
                    return this._publisherName;
                },
                set: function (value) {
                    if (value !== this._publisherName) {
                        this._publisherNameChanged = true;
                        this.changed = true;
                    }
                    this._publisherName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ServicePrincipal.prototype, "publisherNameChanged", {
                get: function () {
                    return this._publisherNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "replyUrls", {
                get: function () {
                    return this._replyUrls;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "replyUrlsChanged", {
                get: function () {
                    return this._replyUrlsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "samlMetadataUrl", {
                get: function () {
                    return this._samlMetadataUrl;
                },
                set: function (value) {
                    if (value !== this._samlMetadataUrl) {
                        this._samlMetadataUrlChanged = true;
                        this.changed = true;
                    }
                    this._samlMetadataUrl = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ServicePrincipal.prototype, "samlMetadataUrlChanged", {
                get: function () {
                    return this._samlMetadataUrlChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "servicePrincipalNames", {
                get: function () {
                    return this._servicePrincipalNames;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "servicePrincipalNamesChanged", {
                get: function () {
                    return this._servicePrincipalNamesChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "tags", {
                get: function () {
                    return this._tags;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "tagsChanged", {
                get: function () {
                    return this._tagsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "appRoleAssignedTo", {
                get: function () {
                    if (this._appRoleAssignedTo === undefined) {
                        this._appRoleAssignedTo = new AppRoleAssignments(this.context, this.getPath("appRoleAssignedTo"));
                    }
                    return this._appRoleAssignedTo;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "appRoleAssignments", {
                get: function () {
                    if (this._appRoleAssignments === undefined) {
                        this._appRoleAssignments = new AppRoleAssignments(this.context, this.getPath("appRoleAssignments"));
                    }
                    return this._appRoleAssignments;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePrincipal.prototype, "oauth2PermissionGrants", {
                get: function () {
                    if (this._oauth2PermissionGrants === undefined) {
                        this._oauth2PermissionGrants = new OAuth2PermissionGrants(this.context, this.getPath("oauth2PermissionGrants"));
                    }
                    return this._oauth2PermissionGrants;
                },
                enumerable: true,
                configurable: true
            });

            ServicePrincipal.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/servicePrincipals' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(ServicePrincipal.parseServicePrincipal(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            ServicePrincipal.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            ServicePrincipal.parseServicePrincipal = function (context, path, data) {
                if (!data)
                    return null;

                return new ServicePrincipal(context, path, data);
            };

            ServicePrincipal.parseServicePrincipals = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(ServicePrincipal.parseServicePrincipal(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            ServicePrincipal.prototype.getRequestBody = function () {
                return {
                    accountEnabled: (this.accountEnabledChanged && this.accountEnabled) ? this.accountEnabled : undefined,
                    appDisplayName: (this.appDisplayNameChanged && this.appDisplayName) ? this.appDisplayName : undefined,
                    appId: (this.appIdChanged && this.appId) ? this.appId : undefined,
                    appOwnerTenantId: (this.appOwnerTenantIdChanged && this.appOwnerTenantId) ? this.appOwnerTenantId : undefined,
                    appRoleAssignmentRequired: (this.appRoleAssignmentRequiredChanged && this.appRoleAssignmentRequired) ? this.appRoleAssignmentRequired : undefined,
                    appRoles: (this.appRolesChanged) ? (function (appRoles) {
                        if (!appRoles) {
                            return undefined;
                        }
                        var converted = [];
                        appRoles.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.appRoles) : undefined,
                    displayName: (this.displayNameChanged && this.displayName) ? this.displayName : undefined,
                    errorUrl: (this.errorUrlChanged && this.errorUrl) ? this.errorUrl : undefined,
                    homepage: (this.homepageChanged && this.homepage) ? this.homepage : undefined,
                    keyCredentials: (this.keyCredentialsChanged) ? (function (keyCredentials) {
                        if (!keyCredentials) {
                            return undefined;
                        }
                        var converted = [];
                        keyCredentials.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.keyCredentials) : undefined,
                    logoutUrl: (this.logoutUrlChanged && this.logoutUrl) ? this.logoutUrl : undefined,
                    oauth2Permissions: (this.oauth2PermissionsChanged) ? (function (oauth2Permissions) {
                        if (!oauth2Permissions) {
                            return undefined;
                        }
                        var converted = [];
                        oauth2Permissions.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.oauth2Permissions) : undefined,
                    passwordCredentials: (this.passwordCredentialsChanged) ? (function (passwordCredentials) {
                        if (!passwordCredentials) {
                            return undefined;
                        }
                        var converted = [];
                        passwordCredentials.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.passwordCredentials) : undefined,
                    preferredTokenSigningKeyThumbprint: (this.preferredTokenSigningKeyThumbprintChanged && this.preferredTokenSigningKeyThumbprint) ? this.preferredTokenSigningKeyThumbprint : undefined,
                    publisherName: (this.publisherNameChanged && this.publisherName) ? this.publisherName : undefined,
                    replyUrls: (this.replyUrlsChanged && this.replyUrls) ? this.replyUrls : undefined,
                    samlMetadataUrl: (this.samlMetadataUrlChanged && this.samlMetadataUrl) ? this.samlMetadataUrl : undefined,
                    servicePrincipalNames: (this.servicePrincipalNamesChanged && this.servicePrincipalNames) ? this.servicePrincipalNames : undefined,
                    tags: (this.tagsChanged && this.tags) ? this.tags : undefined,
                    objectType: (this.objectTypeChanged && this.objectType) ? this.objectType : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    deletionTimestamp: (this.deletionTimestampChanged && this.deletionTimestamp) ? this.deletionTimestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return ServicePrincipal;
        })(DirectoryObject);
        DirectoryServices.ServicePrincipal = ServicePrincipal;

        var TenantDetailFetcher = (function (_super) {
            __extends(TenantDetailFetcher, _super);
            function TenantDetailFetcher(context, path) {
                _super.call(this, context, path);
            }
            TenantDetailFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/tenantDetails' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(TenantDetail.parseTenantDetail(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return TenantDetailFetcher;
        })(DirectoryObjectFetcher);
        DirectoryServices.TenantDetailFetcher = TenantDetailFetcher;

        var TenantDetail = (function (_super) {
            __extends(TenantDetail, _super);
            function TenantDetail(context, path, data) {
                var _this = this;
                _super.call(this, context, path, data);
                this._odataType = 'Microsoft.DirectoryServices.TenantDetail';
                this._assignedPlans = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._assignedPlansChanged = false;
                this._assignedPlansChangedListener = (function (value) {
                    _this._assignedPlansChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._cityChanged = false;
                this._companyLastDirSyncTimeChanged = false;
                this._countryChanged = false;
                this._countryLetterCodeChanged = false;
                this._dirSyncEnabledChanged = false;
                this._displayNameChanged = false;
                this._marketingNotificationEmails = new Array();
                this._marketingNotificationEmailsChanged = false;
                this._postalCodeChanged = false;
                this._preferredLanguageChanged = false;
                this._provisionedPlans = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._provisionedPlansChanged = false;
                this._provisionedPlansChangedListener = (function (value) {
                    _this._provisionedPlansChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._provisioningErrors = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._provisioningErrorsChanged = false;
                this._provisioningErrorsChangedListener = (function (value) {
                    _this._provisioningErrorsChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._stateChanged = false;
                this._streetChanged = false;
                this._technicalNotificationMails = new Array();
                this._technicalNotificationMailsChanged = false;
                this._telephoneNumberChanged = false;
                this._verifiedDomains = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._verifiedDomainsChanged = false;
                this._verifiedDomainsChangedListener = (function (value) {
                    _this._verifiedDomainsChanged = true;
                    _this.changed = true;
                }).bind(this);

                if (!data) {
                    this._assignedPlans.addChangedListener(this._assignedPlansChangedListener);
                    this._provisionedPlans.addChangedListener(this._provisionedPlansChangedListener);
                    this._provisioningErrors.addChangedListener(this._provisioningErrorsChangedListener);
                    this._verifiedDomains.addChangedListener(this._verifiedDomainsChangedListener);
                    return;
                }

                this._assignedPlans = AssignedPlan.parseAssignedPlans(data.assignedPlans);
                this._assignedPlans.addChangedListener(this._assignedPlansChangedListener);
                this._city = data.city;
                this._companyLastDirSyncTime = (data.companyLastDirSyncTime !== null) ? new Date(data.companyLastDirSyncTime) : null;
                this._country = data.country;
                this._countryLetterCode = data.countryLetterCode;
                this._dirSyncEnabled = data.dirSyncEnabled;
                this._displayName = data.displayName;
                this._marketingNotificationEmails = data.marketingNotificationEmails;
                this._postalCode = data.postalCode;
                this._preferredLanguage = data.preferredLanguage;
                this._provisionedPlans = ProvisionedPlan.parseProvisionedPlans(data.provisionedPlans);
                this._provisionedPlans.addChangedListener(this._provisionedPlansChangedListener);
                this._provisioningErrors = ProvisioningError.parseProvisioningErrors(data.provisioningErrors);
                this._provisioningErrors.addChangedListener(this._provisioningErrorsChangedListener);
                this._state = data.state;
                this._street = data.street;
                this._technicalNotificationMails = data.technicalNotificationMails;
                this._telephoneNumber = data.telephoneNumber;
                this._verifiedDomains = VerifiedDomain.parseVerifiedDomains(data.verifiedDomains);
                this._verifiedDomains.addChangedListener(this._verifiedDomainsChangedListener);
            }
            Object.defineProperty(TenantDetail.prototype, "assignedPlans", {
                get: function () {
                    return this._assignedPlans;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "assignedPlansChanged", {
                get: function () {
                    return this._assignedPlansChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "city", {
                get: function () {
                    return this._city;
                },
                set: function (value) {
                    if (value !== this._city) {
                        this._cityChanged = true;
                        this.changed = true;
                    }
                    this._city = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(TenantDetail.prototype, "cityChanged", {
                get: function () {
                    return this._cityChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "companyLastDirSyncTime", {
                get: function () {
                    return this._companyLastDirSyncTime;
                },
                set: function (value) {
                    if (value !== this._companyLastDirSyncTime) {
                        this._companyLastDirSyncTimeChanged = true;
                        this.changed = true;
                    }
                    this._companyLastDirSyncTime = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(TenantDetail.prototype, "companyLastDirSyncTimeChanged", {
                get: function () {
                    return this._companyLastDirSyncTimeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "country", {
                get: function () {
                    return this._country;
                },
                set: function (value) {
                    if (value !== this._country) {
                        this._countryChanged = true;
                        this.changed = true;
                    }
                    this._country = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(TenantDetail.prototype, "countryChanged", {
                get: function () {
                    return this._countryChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "countryLetterCode", {
                get: function () {
                    return this._countryLetterCode;
                },
                set: function (value) {
                    if (value !== this._countryLetterCode) {
                        this._countryLetterCodeChanged = true;
                        this.changed = true;
                    }
                    this._countryLetterCode = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(TenantDetail.prototype, "countryLetterCodeChanged", {
                get: function () {
                    return this._countryLetterCodeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "dirSyncEnabled", {
                get: function () {
                    return this._dirSyncEnabled;
                },
                set: function (value) {
                    if (value !== this._dirSyncEnabled) {
                        this._dirSyncEnabledChanged = true;
                        this.changed = true;
                    }
                    this._dirSyncEnabled = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(TenantDetail.prototype, "dirSyncEnabledChanged", {
                get: function () {
                    return this._dirSyncEnabledChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "displayName", {
                get: function () {
                    return this._displayName;
                },
                set: function (value) {
                    if (value !== this._displayName) {
                        this._displayNameChanged = true;
                        this.changed = true;
                    }
                    this._displayName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(TenantDetail.prototype, "displayNameChanged", {
                get: function () {
                    return this._displayNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "marketingNotificationEmails", {
                get: function () {
                    return this._marketingNotificationEmails;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "marketingNotificationEmailsChanged", {
                get: function () {
                    return this._marketingNotificationEmailsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "postalCode", {
                get: function () {
                    return this._postalCode;
                },
                set: function (value) {
                    if (value !== this._postalCode) {
                        this._postalCodeChanged = true;
                        this.changed = true;
                    }
                    this._postalCode = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(TenantDetail.prototype, "postalCodeChanged", {
                get: function () {
                    return this._postalCodeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "preferredLanguage", {
                get: function () {
                    return this._preferredLanguage;
                },
                set: function (value) {
                    if (value !== this._preferredLanguage) {
                        this._preferredLanguageChanged = true;
                        this.changed = true;
                    }
                    this._preferredLanguage = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(TenantDetail.prototype, "preferredLanguageChanged", {
                get: function () {
                    return this._preferredLanguageChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "provisionedPlans", {
                get: function () {
                    return this._provisionedPlans;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "provisionedPlansChanged", {
                get: function () {
                    return this._provisionedPlansChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "provisioningErrors", {
                get: function () {
                    return this._provisioningErrors;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "provisioningErrorsChanged", {
                get: function () {
                    return this._provisioningErrorsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "state", {
                get: function () {
                    return this._state;
                },
                set: function (value) {
                    if (value !== this._state) {
                        this._stateChanged = true;
                        this.changed = true;
                    }
                    this._state = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(TenantDetail.prototype, "stateChanged", {
                get: function () {
                    return this._stateChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "street", {
                get: function () {
                    return this._street;
                },
                set: function (value) {
                    if (value !== this._street) {
                        this._streetChanged = true;
                        this.changed = true;
                    }
                    this._street = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(TenantDetail.prototype, "streetChanged", {
                get: function () {
                    return this._streetChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "technicalNotificationMails", {
                get: function () {
                    return this._technicalNotificationMails;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "technicalNotificationMailsChanged", {
                get: function () {
                    return this._technicalNotificationMailsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "telephoneNumber", {
                get: function () {
                    return this._telephoneNumber;
                },
                set: function (value) {
                    if (value !== this._telephoneNumber) {
                        this._telephoneNumberChanged = true;
                        this.changed = true;
                    }
                    this._telephoneNumber = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(TenantDetail.prototype, "telephoneNumberChanged", {
                get: function () {
                    return this._telephoneNumberChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "verifiedDomains", {
                get: function () {
                    return this._verifiedDomains;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(TenantDetail.prototype, "verifiedDomainsChanged", {
                get: function () {
                    return this._verifiedDomainsChanged;
                },
                enumerable: true,
                configurable: true
            });

            TenantDetail.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/tenantDetails' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(TenantDetail.parseTenantDetail(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            TenantDetail.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            TenantDetail.parseTenantDetail = function (context, path, data) {
                if (!data)
                    return null;

                return new TenantDetail(context, path, data);
            };

            TenantDetail.parseTenantDetails = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(TenantDetail.parseTenantDetail(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            TenantDetail.prototype.getRequestBody = function () {
                return {
                    assignedPlans: (this.assignedPlansChanged) ? (function (assignedPlans) {
                        if (!assignedPlans) {
                            return undefined;
                        }
                        var converted = [];
                        assignedPlans.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.assignedPlans) : undefined,
                    city: (this.cityChanged && this.city) ? this.city : undefined,
                    companyLastDirSyncTime: (this.companyLastDirSyncTimeChanged && this.companyLastDirSyncTime) ? this.companyLastDirSyncTime.toString() : undefined,
                    country: (this.countryChanged && this.country) ? this.country : undefined,
                    countryLetterCode: (this.countryLetterCodeChanged && this.countryLetterCode) ? this.countryLetterCode : undefined,
                    dirSyncEnabled: (this.dirSyncEnabledChanged && this.dirSyncEnabled) ? this.dirSyncEnabled : undefined,
                    displayName: (this.displayNameChanged && this.displayName) ? this.displayName : undefined,
                    marketingNotificationEmails: (this.marketingNotificationEmailsChanged && this.marketingNotificationEmails) ? this.marketingNotificationEmails : undefined,
                    postalCode: (this.postalCodeChanged && this.postalCode) ? this.postalCode : undefined,
                    preferredLanguage: (this.preferredLanguageChanged && this.preferredLanguage) ? this.preferredLanguage : undefined,
                    provisionedPlans: (this.provisionedPlansChanged) ? (function (provisionedPlans) {
                        if (!provisionedPlans) {
                            return undefined;
                        }
                        var converted = [];
                        provisionedPlans.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.provisionedPlans) : undefined,
                    provisioningErrors: (this.provisioningErrorsChanged) ? (function (provisioningErrors) {
                        if (!provisioningErrors) {
                            return undefined;
                        }
                        var converted = [];
                        provisioningErrors.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.provisioningErrors) : undefined,
                    state: (this.stateChanged && this.state) ? this.state : undefined,
                    street: (this.streetChanged && this.street) ? this.street : undefined,
                    technicalNotificationMails: (this.technicalNotificationMailsChanged && this.technicalNotificationMails) ? this.technicalNotificationMails : undefined,
                    telephoneNumber: (this.telephoneNumberChanged && this.telephoneNumber) ? this.telephoneNumber : undefined,
                    verifiedDomains: (this.verifiedDomainsChanged) ? (function (verifiedDomains) {
                        if (!verifiedDomains) {
                            return undefined;
                        }
                        var converted = [];
                        verifiedDomains.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.verifiedDomains) : undefined,
                    objectType: (this.objectTypeChanged && this.objectType) ? this.objectType : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    deletionTimestamp: (this.deletionTimestampChanged && this.deletionTimestamp) ? this.deletionTimestamp.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return TenantDetail;
        })(DirectoryObject);
        DirectoryServices.TenantDetail = TenantDetail;

        var AssignedPlan = (function (_super) {
            __extends(AssignedPlan, _super);
            function AssignedPlan(data) {
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.AssignedPlan';
                this._assignedTimestampChanged = false;
                this._capabilityStatusChanged = false;
                this._serviceChanged = false;
                this._servicePlanIdChanged = false;

                if (!data) {
                    return;
                }

                this._assignedTimestamp = (data.assignedTimestamp !== null) ? new Date(data.assignedTimestamp) : null;
                this._capabilityStatus = data.capabilityStatus;
                this._service = data.service;
                this._servicePlanId = data.servicePlanId;
            }
            Object.defineProperty(AssignedPlan.prototype, "assignedTimestamp", {
                get: function () {
                    return this._assignedTimestamp;
                },
                set: function (value) {
                    if (value !== this._assignedTimestamp) {
                        this._assignedTimestampChanged = true;
                        this.changed = true;
                    }
                    this._assignedTimestamp = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssignedPlan.prototype, "assignedTimestampChanged", {
                get: function () {
                    return this._assignedTimestampChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AssignedPlan.prototype, "capabilityStatus", {
                get: function () {
                    return this._capabilityStatus;
                },
                set: function (value) {
                    if (value !== this._capabilityStatus) {
                        this._capabilityStatusChanged = true;
                        this.changed = true;
                    }
                    this._capabilityStatus = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssignedPlan.prototype, "capabilityStatusChanged", {
                get: function () {
                    return this._capabilityStatusChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AssignedPlan.prototype, "service", {
                get: function () {
                    return this._service;
                },
                set: function (value) {
                    if (value !== this._service) {
                        this._serviceChanged = true;
                        this.changed = true;
                    }
                    this._service = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssignedPlan.prototype, "serviceChanged", {
                get: function () {
                    return this._serviceChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(AssignedPlan.prototype, "servicePlanId", {
                get: function () {
                    return this._servicePlanId;
                },
                set: function (value) {
                    if (value !== this._servicePlanId) {
                        this._servicePlanIdChanged = true;
                        this.changed = true;
                    }
                    this._servicePlanId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(AssignedPlan.prototype, "servicePlanIdChanged", {
                get: function () {
                    return this._servicePlanIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            AssignedPlan.parseAssignedPlan = function (data) {
                if (!data)
                    return null;

                return new AssignedPlan(data);
            };

            AssignedPlan.parseAssignedPlans = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(AssignedPlan.parseAssignedPlan(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            AssignedPlan.prototype.getRequestBody = function () {
                return {
                    assignedTimestamp: (this.assignedTimestampChanged && this.assignedTimestamp) ? this.assignedTimestamp.toString() : undefined,
                    capabilityStatus: (this.capabilityStatusChanged && this.capabilityStatus) ? this.capabilityStatus : undefined,
                    service: (this.serviceChanged && this.service) ? this.service : undefined,
                    servicePlanId: (this.servicePlanIdChanged && this.servicePlanId) ? this.servicePlanId : undefined,
                    'odata.type': this._odataType
                };
            };
            return AssignedPlan;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.AssignedPlan = AssignedPlan;

        var ProvisionedPlan = (function (_super) {
            __extends(ProvisionedPlan, _super);
            function ProvisionedPlan(data) {
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.ProvisionedPlan';
                this._capabilityStatusChanged = false;
                this._provisioningStatusChanged = false;
                this._serviceChanged = false;

                if (!data) {
                    return;
                }

                this._capabilityStatus = data.capabilityStatus;
                this._provisioningStatus = data.provisioningStatus;
                this._service = data.service;
            }
            Object.defineProperty(ProvisionedPlan.prototype, "capabilityStatus", {
                get: function () {
                    return this._capabilityStatus;
                },
                set: function (value) {
                    if (value !== this._capabilityStatus) {
                        this._capabilityStatusChanged = true;
                        this.changed = true;
                    }
                    this._capabilityStatus = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ProvisionedPlan.prototype, "capabilityStatusChanged", {
                get: function () {
                    return this._capabilityStatusChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ProvisionedPlan.prototype, "provisioningStatus", {
                get: function () {
                    return this._provisioningStatus;
                },
                set: function (value) {
                    if (value !== this._provisioningStatus) {
                        this._provisioningStatusChanged = true;
                        this.changed = true;
                    }
                    this._provisioningStatus = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ProvisionedPlan.prototype, "provisioningStatusChanged", {
                get: function () {
                    return this._provisioningStatusChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ProvisionedPlan.prototype, "service", {
                get: function () {
                    return this._service;
                },
                set: function (value) {
                    if (value !== this._service) {
                        this._serviceChanged = true;
                        this.changed = true;
                    }
                    this._service = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ProvisionedPlan.prototype, "serviceChanged", {
                get: function () {
                    return this._serviceChanged;
                },
                enumerable: true,
                configurable: true
            });

            ProvisionedPlan.parseProvisionedPlan = function (data) {
                if (!data)
                    return null;

                return new ProvisionedPlan(data);
            };

            ProvisionedPlan.parseProvisionedPlans = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(ProvisionedPlan.parseProvisionedPlan(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            ProvisionedPlan.prototype.getRequestBody = function () {
                return {
                    capabilityStatus: (this.capabilityStatusChanged && this.capabilityStatus) ? this.capabilityStatus : undefined,
                    provisioningStatus: (this.provisioningStatusChanged && this.provisioningStatus) ? this.provisioningStatus : undefined,
                    service: (this.serviceChanged && this.service) ? this.service : undefined,
                    'odata.type': this._odataType
                };
            };
            return ProvisionedPlan;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.ProvisionedPlan = ProvisionedPlan;

        var VerifiedDomain = (function (_super) {
            __extends(VerifiedDomain, _super);
            function VerifiedDomain(data) {
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.VerifiedDomain';
                this._capabilitiesChanged = false;
                this._defaultChanged = false;
                this._idChanged = false;
                this._initialChanged = false;
                this._nameChanged = false;
                this._typeChanged = false;

                if (!data) {
                    return;
                }

                this._capabilities = data.capabilities;
                this._default = data.default;
                this._id = data.id;
                this._initial = data.initial;
                this._name = data.name;
                this._type = data.type;
            }
            Object.defineProperty(VerifiedDomain.prototype, "capabilities", {
                get: function () {
                    return this._capabilities;
                },
                set: function (value) {
                    if (value !== this._capabilities) {
                        this._capabilitiesChanged = true;
                        this.changed = true;
                    }
                    this._capabilities = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(VerifiedDomain.prototype, "capabilitiesChanged", {
                get: function () {
                    return this._capabilitiesChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VerifiedDomain.prototype, "default", {
                get: function () {
                    return this._default;
                },
                set: function (value) {
                    if (value !== this._default) {
                        this._defaultChanged = true;
                        this.changed = true;
                    }
                    this._default = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(VerifiedDomain.prototype, "defaultChanged", {
                get: function () {
                    return this._defaultChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VerifiedDomain.prototype, "id", {
                get: function () {
                    return this._id;
                },
                set: function (value) {
                    if (value !== this._id) {
                        this._idChanged = true;
                        this.changed = true;
                    }
                    this._id = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(VerifiedDomain.prototype, "idChanged", {
                get: function () {
                    return this._idChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VerifiedDomain.prototype, "initial", {
                get: function () {
                    return this._initial;
                },
                set: function (value) {
                    if (value !== this._initial) {
                        this._initialChanged = true;
                        this.changed = true;
                    }
                    this._initial = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(VerifiedDomain.prototype, "initialChanged", {
                get: function () {
                    return this._initialChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VerifiedDomain.prototype, "name", {
                get: function () {
                    return this._name;
                },
                set: function (value) {
                    if (value !== this._name) {
                        this._nameChanged = true;
                        this.changed = true;
                    }
                    this._name = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(VerifiedDomain.prototype, "nameChanged", {
                get: function () {
                    return this._nameChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(VerifiedDomain.prototype, "type", {
                get: function () {
                    return this._type;
                },
                set: function (value) {
                    if (value !== this._type) {
                        this._typeChanged = true;
                        this.changed = true;
                    }
                    this._type = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(VerifiedDomain.prototype, "typeChanged", {
                get: function () {
                    return this._typeChanged;
                },
                enumerable: true,
                configurable: true
            });

            VerifiedDomain.parseVerifiedDomain = function (data) {
                if (!data)
                    return null;

                return new VerifiedDomain(data);
            };

            VerifiedDomain.parseVerifiedDomains = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(VerifiedDomain.parseVerifiedDomain(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            VerifiedDomain.prototype.getRequestBody = function () {
                return {
                    capabilities: (this.capabilitiesChanged && this.capabilities) ? this.capabilities : undefined,
                    default: (this.defaultChanged && this.default) ? this.default : undefined,
                    id: (this.idChanged && this.id) ? this.id : undefined,
                    initial: (this.initialChanged && this.initial) ? this.initial : undefined,
                    name: (this.nameChanged && this.name) ? this.name : undefined,
                    type: (this.typeChanged && this.type) ? this.type : undefined,
                    'odata.type': this._odataType
                };
            };
            return VerifiedDomain;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.VerifiedDomain = VerifiedDomain;

        var PasswordProfile = (function (_super) {
            __extends(PasswordProfile, _super);
            function PasswordProfile(data) {
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.PasswordProfile';
                this._passwordChanged = false;
                this._forceChangePasswordNextLoginChanged = false;

                if (!data) {
                    return;
                }

                this._password = data.password;
                this._forceChangePasswordNextLogin = data.forceChangePasswordNextLogin;
            }
            Object.defineProperty(PasswordProfile.prototype, "password", {
                get: function () {
                    return this._password;
                },
                set: function (value) {
                    if (value !== this._password) {
                        this._passwordChanged = true;
                        this.changed = true;
                    }
                    this._password = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(PasswordProfile.prototype, "passwordChanged", {
                get: function () {
                    return this._passwordChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PasswordProfile.prototype, "forceChangePasswordNextLogin", {
                get: function () {
                    return this._forceChangePasswordNextLogin;
                },
                set: function (value) {
                    if (value !== this._forceChangePasswordNextLogin) {
                        this._forceChangePasswordNextLoginChanged = true;
                        this.changed = true;
                    }
                    this._forceChangePasswordNextLogin = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(PasswordProfile.prototype, "forceChangePasswordNextLoginChanged", {
                get: function () {
                    return this._forceChangePasswordNextLoginChanged;
                },
                enumerable: true,
                configurable: true
            });

            PasswordProfile.parsePasswordProfile = function (data) {
                if (!data)
                    return null;

                return new PasswordProfile(data);
            };

            PasswordProfile.parsePasswordProfiles = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(PasswordProfile.parsePasswordProfile(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            PasswordProfile.prototype.getRequestBody = function () {
                return {
                    password: (this.passwordChanged && this.password) ? this.password : undefined,
                    forceChangePasswordNextLogin: (this.forceChangePasswordNextLoginChanged && this.forceChangePasswordNextLogin) ? this.forceChangePasswordNextLogin : undefined,
                    'odata.type': this._odataType
                };
            };
            return PasswordProfile;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.PasswordProfile = PasswordProfile;

        var OAuth2PermissionGrantFetcher = (function (_super) {
            __extends(OAuth2PermissionGrantFetcher, _super);
            function OAuth2PermissionGrantFetcher(context, path) {
                _super.call(this, context, path);
            }
            OAuth2PermissionGrantFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/oAuth2PermissionGrants' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(OAuth2PermissionGrant.parseOAuth2PermissionGrant(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return OAuth2PermissionGrantFetcher;
        })(DirectoryServices.Extensions.RestShallowObjectFetcher);
        DirectoryServices.OAuth2PermissionGrantFetcher = OAuth2PermissionGrantFetcher;

        var OAuth2PermissionGrant = (function (_super) {
            __extends(OAuth2PermissionGrant, _super);
            function OAuth2PermissionGrant(context, path, data) {
                _super.call(this, context, path);
                this._odataType = 'Microsoft.DirectoryServices.OAuth2PermissionGrant';
                this._clientIdChanged = false;
                this._consentTypeChanged = false;
                this._expiryTimeChanged = false;
                this._objectIdChanged = false;
                this._principalIdChanged = false;
                this._resourceIdChanged = false;
                this._scopeChanged = false;
                this._startTimeChanged = false;

                if (!data) {
                    return;
                }

                this._clientId = data.clientId;
                this._consentType = data.consentType;
                this._expiryTime = (data.expiryTime !== null) ? new Date(data.expiryTime) : null;
                this._objectId = data.objectId;
                this._principalId = data.principalId;
                this._resourceId = data.resourceId;
                this._scope = data.scope;
                this._startTime = (data.startTime !== null) ? new Date(data.startTime) : null;
            }
            Object.defineProperty(OAuth2PermissionGrant.prototype, "clientId", {
                get: function () {
                    return this._clientId;
                },
                set: function (value) {
                    if (value !== this._clientId) {
                        this._clientIdChanged = true;
                        this.changed = true;
                    }
                    this._clientId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2PermissionGrant.prototype, "clientIdChanged", {
                get: function () {
                    return this._clientIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(OAuth2PermissionGrant.prototype, "consentType", {
                get: function () {
                    return this._consentType;
                },
                set: function (value) {
                    if (value !== this._consentType) {
                        this._consentTypeChanged = true;
                        this.changed = true;
                    }
                    this._consentType = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2PermissionGrant.prototype, "consentTypeChanged", {
                get: function () {
                    return this._consentTypeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(OAuth2PermissionGrant.prototype, "expiryTime", {
                get: function () {
                    return this._expiryTime;
                },
                set: function (value) {
                    if (value !== this._expiryTime) {
                        this._expiryTimeChanged = true;
                        this.changed = true;
                    }
                    this._expiryTime = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2PermissionGrant.prototype, "expiryTimeChanged", {
                get: function () {
                    return this._expiryTimeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(OAuth2PermissionGrant.prototype, "objectId", {
                get: function () {
                    return this._objectId;
                },
                set: function (value) {
                    if (value !== this._objectId) {
                        this._objectIdChanged = true;
                        this.changed = true;
                    }
                    this._objectId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2PermissionGrant.prototype, "objectIdChanged", {
                get: function () {
                    return this._objectIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(OAuth2PermissionGrant.prototype, "principalId", {
                get: function () {
                    return this._principalId;
                },
                set: function (value) {
                    if (value !== this._principalId) {
                        this._principalIdChanged = true;
                        this.changed = true;
                    }
                    this._principalId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2PermissionGrant.prototype, "principalIdChanged", {
                get: function () {
                    return this._principalIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(OAuth2PermissionGrant.prototype, "resourceId", {
                get: function () {
                    return this._resourceId;
                },
                set: function (value) {
                    if (value !== this._resourceId) {
                        this._resourceIdChanged = true;
                        this.changed = true;
                    }
                    this._resourceId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2PermissionGrant.prototype, "resourceIdChanged", {
                get: function () {
                    return this._resourceIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(OAuth2PermissionGrant.prototype, "scope", {
                get: function () {
                    return this._scope;
                },
                set: function (value) {
                    if (value !== this._scope) {
                        this._scopeChanged = true;
                        this.changed = true;
                    }
                    this._scope = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2PermissionGrant.prototype, "scopeChanged", {
                get: function () {
                    return this._scopeChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(OAuth2PermissionGrant.prototype, "startTime", {
                get: function () {
                    return this._startTime;
                },
                set: function (value) {
                    if (value !== this._startTime) {
                        this._startTimeChanged = true;
                        this.changed = true;
                    }
                    this._startTime = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(OAuth2PermissionGrant.prototype, "startTimeChanged", {
                get: function () {
                    return this._startTimeChanged;
                },
                enumerable: true,
                configurable: true
            });

            OAuth2PermissionGrant.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/oAuth2PermissionGrants' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(OAuth2PermissionGrant.parseOAuth2PermissionGrant(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            OAuth2PermissionGrant.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            OAuth2PermissionGrant.parseOAuth2PermissionGrant = function (context, path, data) {
                if (!data)
                    return null;

                return new OAuth2PermissionGrant(context, path, data);
            };

            OAuth2PermissionGrant.parseOAuth2PermissionGrants = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(OAuth2PermissionGrant.parseOAuth2PermissionGrant(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            OAuth2PermissionGrant.prototype.getRequestBody = function () {
                return {
                    clientId: (this.clientIdChanged && this.clientId) ? this.clientId : undefined,
                    consentType: (this.consentTypeChanged && this.consentType) ? this.consentType : undefined,
                    expiryTime: (this.expiryTimeChanged && this.expiryTime) ? this.expiryTime.toString() : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    principalId: (this.principalIdChanged && this.principalId) ? this.principalId : undefined,
                    resourceId: (this.resourceIdChanged && this.resourceId) ? this.resourceId : undefined,
                    scope: (this.scopeChanged && this.scope) ? this.scope : undefined,
                    startTime: (this.startTimeChanged && this.startTime) ? this.startTime.toString() : undefined,
                    'odata.type': this._odataType
                };
            };
            return OAuth2PermissionGrant;
        })(DirectoryServices.Extensions.EntityBase);
        DirectoryServices.OAuth2PermissionGrant = OAuth2PermissionGrant;

        var SubscribedSkuFetcher = (function (_super) {
            __extends(SubscribedSkuFetcher, _super);
            function SubscribedSkuFetcher(context, path) {
                _super.call(this, context, path);
            }
            SubscribedSkuFetcher.prototype.fetch = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                this.context.readUrl(this.path).then((function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/subscribedSkus' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(SubscribedSku.parseSubscribedSku(_this.context, path, parsedData));
                }).bind(this), deferred.reject.bind(deferred));

                return deferred;
            };
            return SubscribedSkuFetcher;
        })(DirectoryServices.Extensions.RestShallowObjectFetcher);
        DirectoryServices.SubscribedSkuFetcher = SubscribedSkuFetcher;

        var SubscribedSku = (function (_super) {
            __extends(SubscribedSku, _super);
            function SubscribedSku(context, path, data) {
                var _this = this;
                _super.call(this, context, path);
                this._odataType = 'Microsoft.DirectoryServices.SubscribedSku';
                this._capabilityStatusChanged = false;
                this._consumedUnitsChanged = false;
                this._objectIdChanged = false;
                this._prepaidUnitsChanged = false;
                this._prepaidUnitsChangedListener = (function (value) {
                    _this._prepaidUnitsChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._servicePlans = new Microsoft.DirectoryServices.Extensions.ObservableCollection();
                this._servicePlansChanged = false;
                this._servicePlansChangedListener = (function (value) {
                    _this._servicePlansChanged = true;
                    _this.changed = true;
                }).bind(this);
                this._skuIdChanged = false;
                this._skuPartNumberChanged = false;

                if (!data) {
                    this._servicePlans.addChangedListener(this._servicePlansChangedListener);
                    return;
                }

                this._capabilityStatus = data.capabilityStatus;
                this._consumedUnits = data.consumedUnits;
                this._objectId = data.objectId;
                this._prepaidUnits = LicenseUnitsDetail.parseLicenseUnitsDetail(data.prepaidUnits);
                if (this._prepaidUnits) {
                    this._prepaidUnits.addChangedListener(this._prepaidUnitsChangedListener);
                }
                this._servicePlans = ServicePlanInfo.parseServicePlanInfos(data.servicePlans);
                this._servicePlans.addChangedListener(this._servicePlansChangedListener);
                this._skuId = data.skuId;
                this._skuPartNumber = data.skuPartNumber;
            }
            Object.defineProperty(SubscribedSku.prototype, "capabilityStatus", {
                get: function () {
                    return this._capabilityStatus;
                },
                set: function (value) {
                    if (value !== this._capabilityStatus) {
                        this._capabilityStatusChanged = true;
                        this.changed = true;
                    }
                    this._capabilityStatus = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SubscribedSku.prototype, "capabilityStatusChanged", {
                get: function () {
                    return this._capabilityStatusChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubscribedSku.prototype, "consumedUnits", {
                get: function () {
                    return this._consumedUnits;
                },
                set: function (value) {
                    if (value !== this._consumedUnits) {
                        this._consumedUnitsChanged = true;
                        this.changed = true;
                    }
                    this._consumedUnits = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SubscribedSku.prototype, "consumedUnitsChanged", {
                get: function () {
                    return this._consumedUnitsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubscribedSku.prototype, "objectId", {
                get: function () {
                    return this._objectId;
                },
                set: function (value) {
                    if (value !== this._objectId) {
                        this._objectIdChanged = true;
                        this.changed = true;
                    }
                    this._objectId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SubscribedSku.prototype, "objectIdChanged", {
                get: function () {
                    return this._objectIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubscribedSku.prototype, "prepaidUnits", {
                get: function () {
                    return this._prepaidUnits;
                },
                set: function (value) {
                    if (this._prepaidUnits) {
                        this._prepaidUnits.removeChangedListener(this._prepaidUnitsChangedListener);
                    }
                    if (value !== this._prepaidUnits) {
                        this._prepaidUnitsChanged = true;
                        this.changed = true;
                    }
                    if (this._prepaidUnits) {
                        this._prepaidUnits.addChangedListener(this._prepaidUnitsChangedListener);
                    }
                    this._prepaidUnits = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SubscribedSku.prototype, "prepaidUnitsChanged", {
                get: function () {
                    return this._prepaidUnitsChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubscribedSku.prototype, "servicePlans", {
                get: function () {
                    return this._servicePlans;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubscribedSku.prototype, "servicePlansChanged", {
                get: function () {
                    return this._servicePlansChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubscribedSku.prototype, "skuId", {
                get: function () {
                    return this._skuId;
                },
                set: function (value) {
                    if (value !== this._skuId) {
                        this._skuIdChanged = true;
                        this.changed = true;
                    }
                    this._skuId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SubscribedSku.prototype, "skuIdChanged", {
                get: function () {
                    return this._skuIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(SubscribedSku.prototype, "skuPartNumber", {
                get: function () {
                    return this._skuPartNumber;
                },
                set: function (value) {
                    if (value !== this._skuPartNumber) {
                        this._skuPartNumberChanged = true;
                        this.changed = true;
                    }
                    this._skuPartNumber = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(SubscribedSku.prototype, "skuPartNumberChanged", {
                get: function () {
                    return this._skuPartNumberChanged;
                },
                enumerable: true,
                configurable: true
            });

            SubscribedSku.prototype.update = function () {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'PATCH';
                request.data = JSON.stringify(this.getRequestBody());

                this.context.request(request).then(function (data) {
                    var parsedData = JSON.parse(data), path = _this.context.serviceRootUri + '/subscribedSkus' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: parsedData.objectId }]);
                    deferred.resolve(SubscribedSku.parseSubscribedSku(_this.context, path, parsedData));
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            SubscribedSku.prototype.delete = function () {
                var deferred = new Microsoft.Utility.Deferred(), request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                request.method = 'DELETE';

                this.context.request(request).then(function (data) {
                    deferred.resolve(null);
                }, deferred.reject.bind(deferred));

                return deferred;
            };

            SubscribedSku.parseSubscribedSku = function (context, path, data) {
                if (!data)
                    return null;

                return new SubscribedSku(context, path, data);
            };

            SubscribedSku.parseSubscribedSkus = function (context, pathFn, data) {
                var results = [];

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(SubscribedSku.parseSubscribedSku(context, pathFn(data[i]), data[i]));
                    }
                }

                return results;
            };

            SubscribedSku.prototype.getRequestBody = function () {
                return {
                    capabilityStatus: (this.capabilityStatusChanged && this.capabilityStatus) ? this.capabilityStatus : undefined,
                    consumedUnits: (this.consumedUnitsChanged && this.consumedUnits) ? this.consumedUnits : undefined,
                    objectId: (this.objectIdChanged && this.objectId) ? this.objectId : undefined,
                    prepaidUnits: (this.prepaidUnitsChanged && this.prepaidUnits) ? this.prepaidUnits.getRequestBody() : undefined,
                    servicePlans: (this.servicePlansChanged) ? (function (servicePlans) {
                        if (!servicePlans) {
                            return undefined;
                        }
                        var converted = [];
                        servicePlans.forEach(function (value, index, array) {
                            converted.push(value.getRequestBody());
                        });
                        return converted;
                    })(this.servicePlans) : undefined,
                    skuId: (this.skuIdChanged && this.skuId) ? this.skuId : undefined,
                    skuPartNumber: (this.skuPartNumberChanged && this.skuPartNumber) ? this.skuPartNumber : undefined,
                    'odata.type': this._odataType
                };
            };
            return SubscribedSku;
        })(DirectoryServices.Extensions.EntityBase);
        DirectoryServices.SubscribedSku = SubscribedSku;

        var LicenseUnitsDetail = (function (_super) {
            __extends(LicenseUnitsDetail, _super);
            function LicenseUnitsDetail(data) {
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.LicenseUnitsDetail';
                this._enabledChanged = false;
                this._suspendedChanged = false;
                this._warningChanged = false;

                if (!data) {
                    return;
                }

                this._enabled = data.enabled;
                this._suspended = data.suspended;
                this._warning = data.warning;
            }
            Object.defineProperty(LicenseUnitsDetail.prototype, "enabled", {
                get: function () {
                    return this._enabled;
                },
                set: function (value) {
                    if (value !== this._enabled) {
                        this._enabledChanged = true;
                        this.changed = true;
                    }
                    this._enabled = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(LicenseUnitsDetail.prototype, "enabledChanged", {
                get: function () {
                    return this._enabledChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(LicenseUnitsDetail.prototype, "suspended", {
                get: function () {
                    return this._suspended;
                },
                set: function (value) {
                    if (value !== this._suspended) {
                        this._suspendedChanged = true;
                        this.changed = true;
                    }
                    this._suspended = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(LicenseUnitsDetail.prototype, "suspendedChanged", {
                get: function () {
                    return this._suspendedChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(LicenseUnitsDetail.prototype, "warning", {
                get: function () {
                    return this._warning;
                },
                set: function (value) {
                    if (value !== this._warning) {
                        this._warningChanged = true;
                        this.changed = true;
                    }
                    this._warning = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(LicenseUnitsDetail.prototype, "warningChanged", {
                get: function () {
                    return this._warningChanged;
                },
                enumerable: true,
                configurable: true
            });

            LicenseUnitsDetail.parseLicenseUnitsDetail = function (data) {
                if (!data)
                    return null;

                return new LicenseUnitsDetail(data);
            };

            LicenseUnitsDetail.parseLicenseUnitsDetails = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(LicenseUnitsDetail.parseLicenseUnitsDetail(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            LicenseUnitsDetail.prototype.getRequestBody = function () {
                return {
                    enabled: (this.enabledChanged && this.enabled) ? this.enabled : undefined,
                    suspended: (this.suspendedChanged && this.suspended) ? this.suspended : undefined,
                    warning: (this.warningChanged && this.warning) ? this.warning : undefined,
                    'odata.type': this._odataType
                };
            };
            return LicenseUnitsDetail;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.LicenseUnitsDetail = LicenseUnitsDetail;

        var ServicePlanInfo = (function (_super) {
            __extends(ServicePlanInfo, _super);
            function ServicePlanInfo(data) {
                _super.call(this);
                this._odataType = 'Microsoft.DirectoryServices.ServicePlanInfo';
                this._servicePlanIdChanged = false;
                this._servicePlanNameChanged = false;

                if (!data) {
                    return;
                }

                this._servicePlanId = data.servicePlanId;
                this._servicePlanName = data.servicePlanName;
            }
            Object.defineProperty(ServicePlanInfo.prototype, "servicePlanId", {
                get: function () {
                    return this._servicePlanId;
                },
                set: function (value) {
                    if (value !== this._servicePlanId) {
                        this._servicePlanIdChanged = true;
                        this.changed = true;
                    }
                    this._servicePlanId = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ServicePlanInfo.prototype, "servicePlanIdChanged", {
                get: function () {
                    return this._servicePlanIdChanged;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ServicePlanInfo.prototype, "servicePlanName", {
                get: function () {
                    return this._servicePlanName;
                },
                set: function (value) {
                    if (value !== this._servicePlanName) {
                        this._servicePlanNameChanged = true;
                        this.changed = true;
                    }
                    this._servicePlanName = value;
                },
                enumerable: true,
                configurable: true
            });


            Object.defineProperty(ServicePlanInfo.prototype, "servicePlanNameChanged", {
                get: function () {
                    return this._servicePlanNameChanged;
                },
                enumerable: true,
                configurable: true
            });

            ServicePlanInfo.parseServicePlanInfo = function (data) {
                if (!data)
                    return null;

                return new ServicePlanInfo(data);
            };

            ServicePlanInfo.parseServicePlanInfos = function (data) {
                var results = new Microsoft.DirectoryServices.Extensions.ObservableCollection();

                if (data) {
                    for (var i = 0; i < data.length; ++i) {
                        results.push(ServicePlanInfo.parseServicePlanInfo(data[i]));
                    }
                }

                results.changed = false;

                return results;
            };

            ServicePlanInfo.prototype.getRequestBody = function () {
                return {
                    servicePlanId: (this.servicePlanIdChanged && this.servicePlanId) ? this.servicePlanId : undefined,
                    servicePlanName: (this.servicePlanNameChanged && this.servicePlanName) ? this.servicePlanName : undefined,
                    'odata.type': this._odataType
                };
            };
            return ServicePlanInfo;
        })(DirectoryServices.Extensions.ComplexTypeBase);
        DirectoryServices.ServicePlanInfo = ServicePlanInfo;
        var DirectoryObjects = (function (_super) {
            __extends(DirectoryObjects, _super);
            function DirectoryObjects(context, path, entity) {
                var _this = this;
                _super.call(this, context, path, entity);

                this._parseCollectionFn = function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/directoryObjects' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return DirectoryObject.parseDirectoryObjects(context, pathFn, data.value);
                };
            }
            DirectoryObjects.prototype.getDirectoryObject = function (objectId) {
                var path = this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: objectId }]);
                var fetcher = new DirectoryObjectFetcher(this.context, path);
                return fetcher;
            };

            DirectoryObjects.prototype.getDirectoryObjects = function () {
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path, this._parseCollectionFn);
            };

            DirectoryObjects.prototype.addDirectoryObject = function (item) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                if (this.entity == null) {
                    var request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                    request.method = 'POST';
                    request.data = JSON.stringify(item.getRequestBody());

                    this.context.request(request).then((function (data) {
                        var parsedData = JSON.parse(data), objectPath = _this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                        deferred.resolve(DirectoryObject.parseDirectoryObject(_this.context, objectPath, parsedData));
                    }).bind(this), deferred.reject.bind(deferred));
                } else {
                }

                return deferred;
            };
            DirectoryObjects.prototype.asApplications = function () {
                var _this = this;
                var parseCollectionFn = (function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/applications' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return Application.parseApplications(context, pathFn, data.value);
                }).bind(this);
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path + '/$/Microsoft.DirectoryServices.Application()', parseCollectionFn);
            };
            DirectoryObjects.prototype.asUsers = function () {
                var _this = this;
                var parseCollectionFn = (function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/users' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return User.parseUsers(context, pathFn, data.value);
                }).bind(this);
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path + '/$/Microsoft.DirectoryServices.User()', parseCollectionFn);
            };
            DirectoryObjects.prototype.asExtensionProperties = function () {
                var _this = this;
                var parseCollectionFn = (function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/extensionProperties' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return ExtensionProperty.parseExtensionProperties(context, pathFn, data.value);
                }).bind(this);
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path + '/$/Microsoft.DirectoryServices.ExtensionProperty()', parseCollectionFn);
            };
            DirectoryObjects.prototype.asContacts = function () {
                var _this = this;
                var parseCollectionFn = (function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/contacts' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return Contact.parseContacts(context, pathFn, data.value);
                }).bind(this);
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path + '/$/Microsoft.DirectoryServices.Contact()', parseCollectionFn);
            };
            DirectoryObjects.prototype.asDevices = function () {
                var _this = this;
                var parseCollectionFn = (function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/devices' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return Device.parseDevices(context, pathFn, data.value);
                }).bind(this);
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path + '/$/Microsoft.DirectoryServices.Device()', parseCollectionFn);
            };
            DirectoryObjects.prototype.asDeviceConfigurations = function () {
                var _this = this;
                var parseCollectionFn = (function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/deviceConfigurations' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return DeviceConfiguration.parseDeviceConfigurations(context, pathFn, data.value);
                }).bind(this);
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path + '/$/Microsoft.DirectoryServices.DeviceConfiguration()', parseCollectionFn);
            };
            DirectoryObjects.prototype.asDirectoryLinkChanges = function () {
                var _this = this;
                var parseCollectionFn = (function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/directoryLinkChanges' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return DirectoryLinkChange.parseDirectoryLinkChanges(context, pathFn, data.value);
                }).bind(this);
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path + '/$/Microsoft.DirectoryServices.DirectoryLinkChange()', parseCollectionFn);
            };
            DirectoryObjects.prototype.asAppRoleAssignments = function () {
                var _this = this;
                var parseCollectionFn = (function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/appRoleAssignments' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return AppRoleAssignment.parseAppRoleAssignments(context, pathFn, data.value);
                }).bind(this);
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path + '/$/Microsoft.DirectoryServices.AppRoleAssignment()', parseCollectionFn);
            };
            DirectoryObjects.prototype.asGroups = function () {
                var _this = this;
                var parseCollectionFn = (function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/groups' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return Group.parseGroups(context, pathFn, data.value);
                }).bind(this);
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path + '/$/Microsoft.DirectoryServices.Group()', parseCollectionFn);
            };
            DirectoryObjects.prototype.asDirectoryRoles = function () {
                var _this = this;
                var parseCollectionFn = (function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/directoryRoles' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return DirectoryRole.parseDirectoryRoles(context, pathFn, data.value);
                }).bind(this);
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path + '/$/Microsoft.DirectoryServices.DirectoryRole()', parseCollectionFn);
            };
            DirectoryObjects.prototype.asDirectoryRoleTemplates = function () {
                var _this = this;
                var parseCollectionFn = (function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/directoryRoleTemplates' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return DirectoryRoleTemplate.parseDirectoryRoleTemplates(context, pathFn, data.value);
                }).bind(this);
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path + '/$/Microsoft.DirectoryServices.DirectoryRoleTemplate()', parseCollectionFn);
            };
            DirectoryObjects.prototype.asServicePrincipals = function () {
                var _this = this;
                var parseCollectionFn = (function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/servicePrincipals' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return ServicePrincipal.parseServicePrincipals(context, pathFn, data.value);
                }).bind(this);
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path + '/$/Microsoft.DirectoryServices.ServicePrincipal()', parseCollectionFn);
            };
            DirectoryObjects.prototype.asTenantDetails = function () {
                var _this = this;
                var parseCollectionFn = (function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/tenantDetails' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return TenantDetail.parseTenantDetails(context, pathFn, data.value);
                }).bind(this);
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path + '/$/Microsoft.DirectoryServices.TenantDetail()', parseCollectionFn);
            };
            return DirectoryObjects;
        })(DirectoryServices.Extensions.QueryableSet);
        DirectoryServices.DirectoryObjects = DirectoryObjects;
        var OAuth2PermissionGrants = (function (_super) {
            __extends(OAuth2PermissionGrants, _super);
            function OAuth2PermissionGrants(context, path, entity) {
                var _this = this;
                _super.call(this, context, path, entity);

                this._parseCollectionFn = function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/oAuth2PermissionGrants' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return OAuth2PermissionGrant.parseOAuth2PermissionGrants(context, pathFn, data.value);
                };
            }
            OAuth2PermissionGrants.prototype.getOAuth2PermissionGrant = function (objectId) {
                var path = this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: objectId }]);
                var fetcher = new OAuth2PermissionGrantFetcher(this.context, path);
                return fetcher;
            };

            OAuth2PermissionGrants.prototype.getOAuth2PermissionGrants = function () {
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path, this._parseCollectionFn);
            };

            OAuth2PermissionGrants.prototype.addOAuth2PermissionGrant = function (item) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                if (this.entity == null) {
                    var request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                    request.method = 'POST';
                    request.data = JSON.stringify(item.getRequestBody());

                    this.context.request(request).then((function (data) {
                        var parsedData = JSON.parse(data), objectPath = _this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                        deferred.resolve(OAuth2PermissionGrant.parseOAuth2PermissionGrant(_this.context, objectPath, parsedData));
                    }).bind(this), deferred.reject.bind(deferred));
                } else {
                }

                return deferred;
            };
            return OAuth2PermissionGrants;
        })(DirectoryServices.Extensions.QueryableSet);
        DirectoryServices.OAuth2PermissionGrants = OAuth2PermissionGrants;
        var SubscribedSkus = (function (_super) {
            __extends(SubscribedSkus, _super);
            function SubscribedSkus(context, path, entity) {
                var _this = this;
                _super.call(this, context, path, entity);

                this._parseCollectionFn = function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/subscribedSkus' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return SubscribedSku.parseSubscribedSkus(context, pathFn, data.value);
                };
            }
            SubscribedSkus.prototype.getSubscribedSku = function (objectId) {
                var path = this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: objectId }]);
                var fetcher = new SubscribedSkuFetcher(this.context, path);
                return fetcher;
            };

            SubscribedSkus.prototype.getSubscribedSkus = function () {
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path, this._parseCollectionFn);
            };

            SubscribedSkus.prototype.addSubscribedSku = function (item) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                if (this.entity == null) {
                    var request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                    request.method = 'POST';
                    request.data = JSON.stringify(item.getRequestBody());

                    this.context.request(request).then((function (data) {
                        var parsedData = JSON.parse(data), objectPath = _this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                        deferred.resolve(SubscribedSku.parseSubscribedSku(_this.context, objectPath, parsedData));
                    }).bind(this), deferred.reject.bind(deferred));
                } else {
                }

                return deferred;
            };
            return SubscribedSkus;
        })(DirectoryServices.Extensions.QueryableSet);
        DirectoryServices.SubscribedSkus = SubscribedSkus;
        var Users = (function (_super) {
            __extends(Users, _super);
            function Users(context, path, entity) {
                var _this = this;
                _super.call(this, context, path, entity);

                this._parseCollectionFn = function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/users' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return User.parseUsers(context, pathFn, data.value);
                };
            }
            Users.prototype.getUser = function (objectId) {
                var path = this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: objectId }]);
                var fetcher = new UserFetcher(this.context, path);
                return fetcher;
            };

            Users.prototype.getUsers = function () {
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path, this._parseCollectionFn);
            };

            Users.prototype.addUser = function (item) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                if (this.entity == null) {
                    var request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                    request.method = 'POST';
                    request.data = JSON.stringify(item.getRequestBody());

                    this.context.request(request).then((function (data) {
                        var parsedData = JSON.parse(data), objectPath = _this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                        deferred.resolve(User.parseUser(_this.context, objectPath, parsedData));
                    }).bind(this), deferred.reject.bind(deferred));
                } else {
                }

                return deferred;
            };
            return Users;
        })(DirectoryServices.Extensions.QueryableSet);
        DirectoryServices.Users = Users;
        var Applications = (function (_super) {
            __extends(Applications, _super);
            function Applications(context, path, entity) {
                var _this = this;
                _super.call(this, context, path, entity);

                this._parseCollectionFn = function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/applications' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return Application.parseApplications(context, pathFn, data.value);
                };
            }
            Applications.prototype.getApplication = function (objectId) {
                var path = this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: objectId }]);
                var fetcher = new ApplicationFetcher(this.context, path);
                return fetcher;
            };

            Applications.prototype.getApplications = function () {
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path, this._parseCollectionFn);
            };

            Applications.prototype.addApplication = function (item) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                if (this.entity == null) {
                    var request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                    request.method = 'POST';
                    request.data = JSON.stringify(item.getRequestBody());

                    this.context.request(request).then((function (data) {
                        var parsedData = JSON.parse(data), objectPath = _this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                        deferred.resolve(Application.parseApplication(_this.context, objectPath, parsedData));
                    }).bind(this), deferred.reject.bind(deferred));
                } else {
                }

                return deferred;
            };
            return Applications;
        })(DirectoryServices.Extensions.QueryableSet);
        DirectoryServices.Applications = Applications;
        var Contacts = (function (_super) {
            __extends(Contacts, _super);
            function Contacts(context, path, entity) {
                var _this = this;
                _super.call(this, context, path, entity);

                this._parseCollectionFn = function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/contacts' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return Contact.parseContacts(context, pathFn, data.value);
                };
            }
            Contacts.prototype.getContact = function (objectId) {
                var path = this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: objectId }]);
                var fetcher = new ContactFetcher(this.context, path);
                return fetcher;
            };

            Contacts.prototype.getContacts = function () {
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path, this._parseCollectionFn);
            };

            Contacts.prototype.addContact = function (item) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                if (this.entity == null) {
                    var request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                    request.method = 'POST';
                    request.data = JSON.stringify(item.getRequestBody());

                    this.context.request(request).then((function (data) {
                        var parsedData = JSON.parse(data), objectPath = _this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                        deferred.resolve(Contact.parseContact(_this.context, objectPath, parsedData));
                    }).bind(this), deferred.reject.bind(deferred));
                } else {
                }

                return deferred;
            };
            return Contacts;
        })(DirectoryServices.Extensions.QueryableSet);
        DirectoryServices.Contacts = Contacts;
        var Groups = (function (_super) {
            __extends(Groups, _super);
            function Groups(context, path, entity) {
                var _this = this;
                _super.call(this, context, path, entity);

                this._parseCollectionFn = function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/groups' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return Group.parseGroups(context, pathFn, data.value);
                };
            }
            Groups.prototype.getGroup = function (objectId) {
                var path = this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: objectId }]);
                var fetcher = new GroupFetcher(this.context, path);
                return fetcher;
            };

            Groups.prototype.getGroups = function () {
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path, this._parseCollectionFn);
            };

            Groups.prototype.addGroup = function (item) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                if (this.entity == null) {
                    var request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                    request.method = 'POST';
                    request.data = JSON.stringify(item.getRequestBody());

                    this.context.request(request).then((function (data) {
                        var parsedData = JSON.parse(data), objectPath = _this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                        deferred.resolve(Group.parseGroup(_this.context, objectPath, parsedData));
                    }).bind(this), deferred.reject.bind(deferred));
                } else {
                }

                return deferred;
            };
            return Groups;
        })(DirectoryServices.Extensions.QueryableSet);
        DirectoryServices.Groups = Groups;
        var DirectoryRoles = (function (_super) {
            __extends(DirectoryRoles, _super);
            function DirectoryRoles(context, path, entity) {
                var _this = this;
                _super.call(this, context, path, entity);

                this._parseCollectionFn = function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/directoryRoles' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return DirectoryRole.parseDirectoryRoles(context, pathFn, data.value);
                };
            }
            DirectoryRoles.prototype.getDirectoryRole = function (objectId) {
                var path = this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: objectId }]);
                var fetcher = new DirectoryRoleFetcher(this.context, path);
                return fetcher;
            };

            DirectoryRoles.prototype.getDirectoryRoles = function () {
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path, this._parseCollectionFn);
            };

            DirectoryRoles.prototype.addDirectoryRole = function (item) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                if (this.entity == null) {
                    var request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                    request.method = 'POST';
                    request.data = JSON.stringify(item.getRequestBody());

                    this.context.request(request).then((function (data) {
                        var parsedData = JSON.parse(data), objectPath = _this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                        deferred.resolve(DirectoryRole.parseDirectoryRole(_this.context, objectPath, parsedData));
                    }).bind(this), deferred.reject.bind(deferred));
                } else {
                }

                return deferred;
            };
            return DirectoryRoles;
        })(DirectoryServices.Extensions.QueryableSet);
        DirectoryServices.DirectoryRoles = DirectoryRoles;
        var ServicePrincipals = (function (_super) {
            __extends(ServicePrincipals, _super);
            function ServicePrincipals(context, path, entity) {
                var _this = this;
                _super.call(this, context, path, entity);

                this._parseCollectionFn = function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/servicePrincipals' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return ServicePrincipal.parseServicePrincipals(context, pathFn, data.value);
                };
            }
            ServicePrincipals.prototype.getServicePrincipal = function (objectId) {
                var path = this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: objectId }]);
                var fetcher = new ServicePrincipalFetcher(this.context, path);
                return fetcher;
            };

            ServicePrincipals.prototype.getServicePrincipals = function () {
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path, this._parseCollectionFn);
            };

            ServicePrincipals.prototype.addServicePrincipal = function (item) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                if (this.entity == null) {
                    var request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                    request.method = 'POST';
                    request.data = JSON.stringify(item.getRequestBody());

                    this.context.request(request).then((function (data) {
                        var parsedData = JSON.parse(data), objectPath = _this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                        deferred.resolve(ServicePrincipal.parseServicePrincipal(_this.context, objectPath, parsedData));
                    }).bind(this), deferred.reject.bind(deferred));
                } else {
                }

                return deferred;
            };
            return ServicePrincipals;
        })(DirectoryServices.Extensions.QueryableSet);
        DirectoryServices.ServicePrincipals = ServicePrincipals;
        var TenantDetails = (function (_super) {
            __extends(TenantDetails, _super);
            function TenantDetails(context, path, entity) {
                var _this = this;
                _super.call(this, context, path, entity);

                this._parseCollectionFn = function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/tenantDetails' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return TenantDetail.parseTenantDetails(context, pathFn, data.value);
                };
            }
            TenantDetails.prototype.getTenantDetail = function (objectId) {
                var path = this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: objectId }]);
                var fetcher = new TenantDetailFetcher(this.context, path);
                return fetcher;
            };

            TenantDetails.prototype.getTenantDetails = function () {
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path, this._parseCollectionFn);
            };

            TenantDetails.prototype.addTenantDetail = function (item) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                if (this.entity == null) {
                    var request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                    request.method = 'POST';
                    request.data = JSON.stringify(item.getRequestBody());

                    this.context.request(request).then((function (data) {
                        var parsedData = JSON.parse(data), objectPath = _this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                        deferred.resolve(TenantDetail.parseTenantDetail(_this.context, objectPath, parsedData));
                    }).bind(this), deferred.reject.bind(deferred));
                } else {
                }

                return deferred;
            };
            return TenantDetails;
        })(DirectoryServices.Extensions.QueryableSet);
        DirectoryServices.TenantDetails = TenantDetails;
        var Devices = (function (_super) {
            __extends(Devices, _super);
            function Devices(context, path, entity) {
                var _this = this;
                _super.call(this, context, path, entity);

                this._parseCollectionFn = function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/devices' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return Device.parseDevices(context, pathFn, data.value);
                };
            }
            Devices.prototype.getDevice = function (objectId) {
                var path = this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: objectId }]);
                var fetcher = new DeviceFetcher(this.context, path);
                return fetcher;
            };

            Devices.prototype.getDevices = function () {
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path, this._parseCollectionFn);
            };

            Devices.prototype.addDevice = function (item) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                if (this.entity == null) {
                    var request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                    request.method = 'POST';
                    request.data = JSON.stringify(item.getRequestBody());

                    this.context.request(request).then((function (data) {
                        var parsedData = JSON.parse(data), objectPath = _this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                        deferred.resolve(Device.parseDevice(_this.context, objectPath, parsedData));
                    }).bind(this), deferred.reject.bind(deferred));
                } else {
                }

                return deferred;
            };
            return Devices;
        })(DirectoryServices.Extensions.QueryableSet);
        DirectoryServices.Devices = Devices;
        var ExtensionProperties = (function (_super) {
            __extends(ExtensionProperties, _super);
            function ExtensionProperties(context, path, entity) {
                var _this = this;
                _super.call(this, context, path, entity);

                this._parseCollectionFn = function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/extensionProperties' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return ExtensionProperty.parseExtensionProperties(context, pathFn, data.value);
                };
            }
            ExtensionProperties.prototype.getExtensionProperty = function (objectId) {
                var path = this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: objectId }]);
                var fetcher = new ExtensionPropertyFetcher(this.context, path);
                return fetcher;
            };

            ExtensionProperties.prototype.getExtensionProperties = function () {
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path, this._parseCollectionFn);
            };

            ExtensionProperties.prototype.addExtensionProperty = function (item) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                if (this.entity == null) {
                    var request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                    request.method = 'POST';
                    request.data = JSON.stringify(item.getRequestBody());

                    this.context.request(request).then((function (data) {
                        var parsedData = JSON.parse(data), objectPath = _this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                        deferred.resolve(ExtensionProperty.parseExtensionProperty(_this.context, objectPath, parsedData));
                    }).bind(this), deferred.reject.bind(deferred));
                } else {
                }

                return deferred;
            };
            return ExtensionProperties;
        })(DirectoryServices.Extensions.QueryableSet);
        DirectoryServices.ExtensionProperties = ExtensionProperties;
        var AppRoleAssignments = (function (_super) {
            __extends(AppRoleAssignments, _super);
            function AppRoleAssignments(context, path, entity) {
                var _this = this;
                _super.call(this, context, path, entity);

                this._parseCollectionFn = function (context, data) {
                    var pathFn = function (data) {
                        return _this.context.serviceRootUri + '/appRoleAssignments' + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                    };
                    return AppRoleAssignment.parseAppRoleAssignments(context, pathFn, data.value);
                };
            }
            AppRoleAssignments.prototype.getAppRoleAssignment = function (objectId) {
                var path = this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: objectId }]);
                var fetcher = new AppRoleAssignmentFetcher(this.context, path);
                return fetcher;
            };

            AppRoleAssignments.prototype.getAppRoleAssignments = function () {
                return new Microsoft.DirectoryServices.Extensions.CollectionQuery(this.context, this.path, this._parseCollectionFn);
            };

            AppRoleAssignments.prototype.addAppRoleAssignment = function (item) {
                var _this = this;
                var deferred = new Microsoft.Utility.Deferred();

                if (this.entity == null) {
                    var request = new Microsoft.DirectoryServices.Extensions.Request(this.path);

                    request.method = 'POST';
                    request.data = JSON.stringify(item.getRequestBody());

                    this.context.request(request).then((function (data) {
                        var parsedData = JSON.parse(data), objectPath = _this.path + Microsoft.Utility.EncodingHelpers.getKeyExpression([{ name: "objectId", type: "Edm.String", value: data.objectId }]);
                        deferred.resolve(AppRoleAssignment.parseAppRoleAssignment(_this.context, objectPath, parsedData));
                    }).bind(this), deferred.reject.bind(deferred));
                } else {
                }

                return deferred;
            };
            return AppRoleAssignments;
        })(DirectoryServices.Extensions.QueryableSet);
        DirectoryServices.AppRoleAssignments = AppRoleAssignments;
    })(Microsoft.DirectoryServices || (Microsoft.DirectoryServices = {}));
    var DirectoryServices = Microsoft.DirectoryServices;
})(Microsoft || (Microsoft = {}));
