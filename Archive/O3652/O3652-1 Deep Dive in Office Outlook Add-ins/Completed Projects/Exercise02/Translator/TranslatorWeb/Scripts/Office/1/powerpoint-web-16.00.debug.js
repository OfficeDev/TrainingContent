/* PowerPointer web application specific API library */
/* Version: 16.0.7610.1000 */
/*
	Copyright (c) Microsoft Corporation.  All rights reserved.
*/


/*
	Your use of this file is governed by the Microsoft Services Agreement http://go.microsoft.com/fwlink/?LinkId=266419.
*/

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var OfficeExt;
(function (OfficeExt) {
    var MicrosoftAjaxFactory = (function () {
        function MicrosoftAjaxFactory() {
        }
        MicrosoftAjaxFactory.prototype.isMsAjaxLoaded = function () {
            if (typeof (Sys) !== 'undefined' && typeof (Type) !== 'undefined' &&
                Sys.StringBuilder && typeof (Sys.StringBuilder) === "function" &&
                Type.registerNamespace && typeof (Type.registerNamespace) === "function" &&
                Type.registerClass && typeof (Type.registerClass) === "function" &&
                typeof (Function._validateParams) === "function" &&
                Sys.Serialization && Sys.Serialization.JavaScriptSerializer && typeof (Sys.Serialization.JavaScriptSerializer.serialize) === "function") {
                return true;
            }
            else {
                return false;
            }
        };
        MicrosoftAjaxFactory.prototype.loadMsAjaxFull = function (callback) {
            var msAjaxCDNPath = (window.location.protocol.toLowerCase() === 'https:' ? 'https:' : 'http:') + '//ajax.aspnetcdn.com/ajax/3.5/MicrosoftAjax.js';
            OSF.OUtil.loadScript(msAjaxCDNPath, callback);
        };
        Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxError", {
            get: function () {
                if (this._msAjaxError == null && this.isMsAjaxLoaded()) {
                    this._msAjaxError = Error;
                }
                return this._msAjaxError;
            },
            set: function (errorClass) {
                this._msAjaxError = errorClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxString", {
            get: function () {
                if (this._msAjaxString == null && this.isMsAjaxLoaded()) {
                    this._msAjaxString = String;
                }
                return this._msAjaxString;
            },
            set: function (stringClass) {
                this._msAjaxString = stringClass;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxDebug", {
            get: function () {
                if (this._msAjaxDebug == null && this.isMsAjaxLoaded()) {
                    this._msAjaxDebug = Sys.Debug;
                }
                return this._msAjaxDebug;
            },
            set: function (debugClass) {
                this._msAjaxDebug = debugClass;
            },
            enumerable: true,
            configurable: true
        });
        return MicrosoftAjaxFactory;
    })();
    OfficeExt.MicrosoftAjaxFactory = MicrosoftAjaxFactory;
})(OfficeExt || (OfficeExt = {}));
var OsfMsAjaxFactory = new OfficeExt.MicrosoftAjaxFactory();
var OSF = OSF || {};
var OfficeExt;
(function (OfficeExt) {
    var SafeStorage = (function () {
        function SafeStorage(_internalStorage) {
            this._internalStorage = _internalStorage;
        }
        SafeStorage.prototype.getItem = function (key) {
            try {
                return this._internalStorage && this._internalStorage.getItem(key);
            }
            catch (e) {
                return null;
            }
        };
        SafeStorage.prototype.setItem = function (key, data) {
            try {
                this._internalStorage && this._internalStorage.setItem(key, data);
            }
            catch (e) {
            }
        };
        SafeStorage.prototype.clear = function () {
            try {
                this._internalStorage && this._internalStorage.clear();
            }
            catch (e) {
            }
        };
        SafeStorage.prototype.removeItem = function (key) {
            try {
                this._internalStorage && this._internalStorage.removeItem(key);
            }
            catch (e) {
            }
        };
        SafeStorage.prototype.getKeysWithPrefix = function (keyPrefix) {
            var keyList = [];
            try {
                var len = this._internalStorage && this._internalStorage.length || 0;
                for (var i = 0; i < len; i++) {
                    var key = this._internalStorage.key(i);
                    if (key.indexOf(keyPrefix) === 0) {
                        keyList.push(key);
                    }
                }
            }
            catch (e) {
            }
            return keyList;
        };
        return SafeStorage;
    })();
    OfficeExt.SafeStorage = SafeStorage;
})(OfficeExt || (OfficeExt = {}));
OSF.XdmFieldName = {
    ConversationUrl: "ConversationUrl",
    AppId: "AppId"
};
OSF.WindowNameItemKeys = {
    BaseFrameName: "baseFrameName",
    HostInfo: "hostInfo",
    XdmInfo: "xdmInfo",
    SerializerVersion: "serializerVersion",
    AppContext: "appContext"
};
OSF.OUtil = (function () {
    var _uniqueId = -1;
    var _xdmInfoKey = '&_xdm_Info=';
    var _serializerVersionKey = '&_serializer_version=';
    var _xdmSessionKeyPrefix = '_xdm_';
    var _serializerVersionKeyPrefix = '_serializer_version=';
    var _fragmentSeparator = '#';
    var _fragmentInfoDelimiter = '&';
    var _classN = "class";
    var _loadedScripts = {};
    var _defaultScriptLoadingTimeout = 30000;
    var _safeSessionStorage = null;
    var _safeLocalStorage = null;
    var _rndentropy = new Date().getTime();
    function _random() {
        var nextrand = 0x7fffffff * (Math.random());
        nextrand ^= _rndentropy ^ ((new Date().getMilliseconds()) << Math.floor(Math.random() * (31 - 10)));
        return nextrand.toString(16);
    }
    ;
    function _getSessionStorage() {
        if (!_safeSessionStorage) {
            try {
                var sessionStorage = window.sessionStorage;
            }
            catch (ex) {
                sessionStorage = null;
            }
            _safeSessionStorage = new OfficeExt.SafeStorage(sessionStorage);
        }
        return _safeSessionStorage;
    }
    ;
    function _reOrderTabbableElements(elements) {
        var bucket0 = [];
        var bucketPositive = [];
        var i;
        var len = elements.length;
        var ele;
        for (i = 0; i < len; i++) {
            ele = elements[i];
            if (ele.tabIndex) {
                if (ele.tabIndex > 0) {
                    bucketPositive.push(ele);
                }
                else if (ele.tabIndex === 0) {
                    bucket0.push(ele);
                }
            }
            else {
                bucket0.push(ele);
            }
        }
        bucketPositive = bucketPositive.sort(function (left, right) {
            var diff = left.tabIndex - right.tabIndex;
            if (diff === 0) {
                diff = bucketPositive.indexOf(left) - bucketPositive.indexOf(right);
            }
            return diff;
        });
        return [].concat(bucketPositive, bucket0);
    }
    ;
    return {
        set_entropy: function OSF_OUtil$set_entropy(entropy) {
            if (typeof entropy == "string") {
                for (var i = 0; i < entropy.length; i += 4) {
                    var temp = 0;
                    for (var j = 0; j < 4 && i + j < entropy.length; j++) {
                        temp = (temp << 8) + entropy.charCodeAt(i + j);
                    }
                    _rndentropy ^= temp;
                }
            }
            else if (typeof entropy == "number") {
                _rndentropy ^= entropy;
            }
            else {
                _rndentropy ^= 0x7fffffff * Math.random();
            }
            _rndentropy &= 0x7fffffff;
        },
        extend: function OSF_OUtil$extend(child, parent) {
            var F = function () { };
            F.prototype = parent.prototype;
            child.prototype = new F();
            child.prototype.constructor = child;
            child.uber = parent.prototype;
            if (parent.prototype.constructor === Object.prototype.constructor) {
                parent.prototype.constructor = parent;
            }
        },
        setNamespace: function OSF_OUtil$setNamespace(name, parent) {
            if (parent && name && !parent[name]) {
                parent[name] = {};
            }
        },
        unsetNamespace: function OSF_OUtil$unsetNamespace(name, parent) {
            if (parent && name && parent[name]) {
                delete parent[name];
            }
        },
        loadScript: function OSF_OUtil$loadScript(url, callback, timeoutInMs) {
            if (url && callback) {
                var doc = window.document;
                var _loadedScriptEntry = _loadedScripts[url];
                if (!_loadedScriptEntry) {
                    var script = doc.createElement("script");
                    script.type = "text/javascript";
                    _loadedScriptEntry = { loaded: false, pendingCallbacks: [callback], timer: null };
                    _loadedScripts[url] = _loadedScriptEntry;
                    var onLoadCallback = function OSF_OUtil_loadScript$onLoadCallback() {
                        if (_loadedScriptEntry.timer != null) {
                            clearTimeout(_loadedScriptEntry.timer);
                            delete _loadedScriptEntry.timer;
                        }
                        _loadedScriptEntry.loaded = true;
                        var pendingCallbackCount = _loadedScriptEntry.pendingCallbacks.length;
                        for (var i = 0; i < pendingCallbackCount; i++) {
                            var currentCallback = _loadedScriptEntry.pendingCallbacks.shift();
                            currentCallback();
                        }
                    };
                    var onLoadError = function OSF_OUtil_loadScript$onLoadError() {
                        delete _loadedScripts[url];
                        if (_loadedScriptEntry.timer != null) {
                            clearTimeout(_loadedScriptEntry.timer);
                            delete _loadedScriptEntry.timer;
                        }
                        var pendingCallbackCount = _loadedScriptEntry.pendingCallbacks.length;
                        for (var i = 0; i < pendingCallbackCount; i++) {
                            var currentCallback = _loadedScriptEntry.pendingCallbacks.shift();
                            currentCallback();
                        }
                    };
                    if (script.readyState) {
                        script.onreadystatechange = function () {
                            if (script.readyState == "loaded" || script.readyState == "complete") {
                                script.onreadystatechange = null;
                                onLoadCallback();
                            }
                        };
                    }
                    else {
                        script.onload = onLoadCallback;
                    }
                    script.onerror = onLoadError;
                    timeoutInMs = timeoutInMs || _defaultScriptLoadingTimeout;
                    _loadedScriptEntry.timer = setTimeout(onLoadError, timeoutInMs);
                    script.src = url;
                    doc.getElementsByTagName("head")[0].appendChild(script);
                }
                else if (_loadedScriptEntry.loaded) {
                    callback();
                }
                else {
                    _loadedScriptEntry.pendingCallbacks.push(callback);
                }
            }
        },
        loadCSS: function OSF_OUtil$loadCSS(url) {
            if (url) {
                var doc = window.document;
                var link = doc.createElement("link");
                link.type = "text/css";
                link.rel = "stylesheet";
                link.href = url;
                doc.getElementsByTagName("head")[0].appendChild(link);
            }
        },
        parseEnum: function OSF_OUtil$parseEnum(str, enumObject) {
            var parsed = enumObject[str.trim()];
            if (typeof (parsed) == 'undefined') {
                OsfMsAjaxFactory.msAjaxDebug.trace("invalid enumeration string:" + str);
                throw OsfMsAjaxFactory.msAjaxError.argument("str");
            }
            return parsed;
        },
        delayExecutionAndCache: function OSF_OUtil$delayExecutionAndCache() {
            var obj = { calc: arguments[0] };
            return function () {
                if (obj.calc) {
                    obj.val = obj.calc.apply(this, arguments);
                    delete obj.calc;
                }
                return obj.val;
            };
        },
        getUniqueId: function OSF_OUtil$getUniqueId() {
            _uniqueId = _uniqueId + 1;
            return _uniqueId.toString();
        },
        formatString: function OSF_OUtil$formatString() {
            var args = arguments;
            var source = args[0];
            return source.replace(/{(\d+)}/gm, function (match, number) {
                var index = parseInt(number, 10) + 1;
                return args[index] === undefined ? '{' + number + '}' : args[index];
            });
        },
        generateConversationId: function OSF_OUtil$generateConversationId() {
            return [_random(), _random(), (new Date()).getTime().toString()].join('_');
        },
        getFrameName: function OSF_OUtil$getFrameName(cacheKey) {
            return _xdmSessionKeyPrefix + cacheKey + this.generateConversationId();
        },
        addXdmInfoAsHash: function OSF_OUtil$addXdmInfoAsHash(url, xdmInfoValue) {
            return OSF.OUtil.addInfoAsHash(url, _xdmInfoKey, xdmInfoValue, false);
        },
        addSerializerVersionAsHash: function OSF_OUtil$addSerializerVersionAsHash(url, serializerVersion) {
            return OSF.OUtil.addInfoAsHash(url, _serializerVersionKey, serializerVersion, true);
        },
        addInfoAsHash: function OSF_OUtil$addInfoAsHash(url, keyName, infoValue, encodeInfo) {
            url = url.trim() || '';
            var urlParts = url.split(_fragmentSeparator);
            var urlWithoutFragment = urlParts.shift();
            var fragment = urlParts.join(_fragmentSeparator);
            var newFragment;
            if (encodeInfo) {
                newFragment = [keyName, encodeURIComponent(infoValue), fragment].join('');
            }
            else {
                newFragment = [fragment, keyName, infoValue].join('');
            }
            return [urlWithoutFragment, _fragmentSeparator, newFragment].join('');
        },
        parseHostInfoFromWindowName: function OSF_OUtil$parseHostInfoFromWindowName(skipSessionStorage, windowName) {
            return OSF.OUtil.parseInfoFromWindowName(skipSessionStorage, windowName, OSF.WindowNameItemKeys.HostInfo);
        },
        parseXdmInfo: function OSF_OUtil$parseXdmInfo(skipSessionStorage) {
            var xdmInfoValue = OSF.OUtil.parseXdmInfoWithGivenFragment(skipSessionStorage, window.location.hash);
            if (!xdmInfoValue) {
                xdmInfoValue = OSF.OUtil.parseXdmInfoFromWindowName(skipSessionStorage, window.name);
            }
            return xdmInfoValue;
        },
        parseXdmInfoFromWindowName: function OSF_OUtil$parseXdmInfoFromWindowName(skipSessionStorage, windowName) {
            return OSF.OUtil.parseInfoFromWindowName(skipSessionStorage, windowName, OSF.WindowNameItemKeys.XdmInfo);
        },
        parseXdmInfoWithGivenFragment: function OSF_OUtil$parseXdmInfoWithGivenFragment(skipSessionStorage, fragment) {
            return OSF.OUtil.parseInfoWithGivenFragment(_xdmInfoKey, _xdmSessionKeyPrefix, false, skipSessionStorage, fragment);
        },
        parseSerializerVersion: function OSF_OUtil$parseSerializerVersion(skipSessionStorage) {
            var serializerVersion = OSF.OUtil.parseSerializerVersionWithGivenFragment(skipSessionStorage, window.location.hash);
            if (isNaN(serializerVersion)) {
                serializerVersion = OSF.OUtil.parseSerializerVersionFromWindowName(skipSessionStorage, window.name);
            }
            return serializerVersion;
        },
        parseSerializerVersionFromWindowName: function OSF_OUtil$parseSerializerVersionFromWindowName(skipSessionStorage, windowName) {
            return parseInt(OSF.OUtil.parseInfoFromWindowName(skipSessionStorage, windowName, OSF.WindowNameItemKeys.SerializerVersion));
        },
        parseSerializerVersionWithGivenFragment: function OSF_OUtil$parseSerializerVersionWithGivenFragment(skipSessionStorage, fragment) {
            return parseInt(OSF.OUtil.parseInfoWithGivenFragment(_serializerVersionKey, _serializerVersionKeyPrefix, true, skipSessionStorage, fragment));
        },
        parseInfoFromWindowName: function OSF_OUtil$parseInfoFromWindowName(skipSessionStorage, windowName, infoKey) {
            try {
                var windowNameObj = JSON.parse(windowName);
                var infoValue = windowNameObj != null ? windowNameObj[infoKey] : null;
                var osfSessionStorage = _getSessionStorage();
                if (!skipSessionStorage && osfSessionStorage && windowNameObj != null) {
                    var sessionKey = windowNameObj[OSF.WindowNameItemKeys.BaseFrameName] + infoKey;
                    if (infoValue) {
                        osfSessionStorage.setItem(sessionKey, infoValue);
                    }
                    else {
                        infoValue = osfSessionStorage.getItem(sessionKey);
                    }
                }
                return infoValue;
            }
            catch (Exception) {
                return null;
            }
        },
        parseInfoWithGivenFragment: function OSF_OUtil$parseInfoWithGivenFragment(infoKey, infoKeyPrefix, decodeInfo, skipSessionStorage, fragment) {
            var fragmentParts = fragment.split(infoKey);
            var infoValue = fragmentParts.length > 1 ? fragmentParts[fragmentParts.length - 1] : null;
            if (decodeInfo && infoValue != null) {
                if (infoValue.indexOf(_fragmentInfoDelimiter) >= 0) {
                    infoValue = infoValue.split(_fragmentInfoDelimiter)[0];
                }
                infoValue = decodeURIComponent(infoValue);
            }
            var osfSessionStorage = _getSessionStorage();
            if (!skipSessionStorage && osfSessionStorage) {
                var sessionKeyStart = window.name.indexOf(infoKeyPrefix);
                if (sessionKeyStart > -1) {
                    var sessionKeyEnd = window.name.indexOf(";", sessionKeyStart);
                    if (sessionKeyEnd == -1) {
                        sessionKeyEnd = window.name.length;
                    }
                    var sessionKey = window.name.substring(sessionKeyStart, sessionKeyEnd);
                    if (infoValue) {
                        osfSessionStorage.setItem(sessionKey, infoValue);
                    }
                    else {
                        infoValue = osfSessionStorage.getItem(sessionKey);
                    }
                }
            }
            return infoValue;
        },
        getConversationId: function OSF_OUtil$getConversationId() {
            var searchString = window.location.search;
            var conversationId = null;
            if (searchString) {
                var index = searchString.indexOf("&");
                conversationId = index > 0 ? searchString.substring(1, index) : searchString.substr(1);
                if (conversationId && conversationId.charAt(conversationId.length - 1) === '=') {
                    conversationId = conversationId.substring(0, conversationId.length - 1);
                    if (conversationId) {
                        conversationId = decodeURIComponent(conversationId);
                    }
                }
            }
            return conversationId;
        },
        getInfoItems: function OSF_OUtil$getInfoItems(strInfo) {
            var items = strInfo.split("$");
            if (typeof items[1] == "undefined") {
                items = strInfo.split("|");
            }
            if (typeof items[1] == "undefined") {
                items = strInfo.split("%7C");
            }
            return items;
        },
        getXdmFieldValue: function OSF_OUtil$getXdmFieldValue(xdmFieldName, skipSessionStorage) {
            var fieldValue = '';
            var xdmInfoValue = OSF.OUtil.parseXdmInfo(skipSessionStorage);
            if (xdmInfoValue) {
                var items = OSF.OUtil.getInfoItems(xdmInfoValue);
                if (items != undefined && items.length >= 3) {
                    switch (xdmFieldName) {
                        case OSF.XdmFieldName.ConversationUrl:
                            fieldValue = items[2];
                            break;
                        case OSF.XdmFieldName.AppId:
                            fieldValue = items[1];
                            break;
                    }
                }
            }
            return fieldValue;
        },
        validateParamObject: function OSF_OUtil$validateParamObject(params, expectedProperties, callback) {
            var e = Function._validateParams(arguments, [{ name: "params", type: Object, mayBeNull: false },
                { name: "expectedProperties", type: Object, mayBeNull: false },
                { name: "callback", type: Function, mayBeNull: true }
            ]);
            if (e)
                throw e;
            for (var p in expectedProperties) {
                e = Function._validateParameter(params[p], expectedProperties[p], p);
                if (e)
                    throw e;
            }
        },
        writeProfilerMark: function OSF_OUtil$writeProfilerMark(text) {
            if (window.msWriteProfilerMark) {
                window.msWriteProfilerMark(text);
                OsfMsAjaxFactory.msAjaxDebug.trace(text);
            }
        },
        outputDebug: function OSF_OUtil$outputDebug(text) {
            if (typeof (OsfMsAjaxFactory) !== 'undefined' && OsfMsAjaxFactory.msAjaxDebug && OsfMsAjaxFactory.msAjaxDebug.trace) {
                OsfMsAjaxFactory.msAjaxDebug.trace(text);
            }
        },
        defineNondefaultProperty: function OSF_OUtil$defineNondefaultProperty(obj, prop, descriptor, attributes) {
            descriptor = descriptor || {};
            for (var nd in attributes) {
                var attribute = attributes[nd];
                if (descriptor[attribute] == undefined) {
                    descriptor[attribute] = true;
                }
            }
            Object.defineProperty(obj, prop, descriptor);
            return obj;
        },
        defineNondefaultProperties: function OSF_OUtil$defineNondefaultProperties(obj, descriptors, attributes) {
            descriptors = descriptors || {};
            for (var prop in descriptors) {
                OSF.OUtil.defineNondefaultProperty(obj, prop, descriptors[prop], attributes);
            }
            return obj;
        },
        defineEnumerableProperty: function OSF_OUtil$defineEnumerableProperty(obj, prop, descriptor) {
            return OSF.OUtil.defineNondefaultProperty(obj, prop, descriptor, ["enumerable"]);
        },
        defineEnumerableProperties: function OSF_OUtil$defineEnumerableProperties(obj, descriptors) {
            return OSF.OUtil.defineNondefaultProperties(obj, descriptors, ["enumerable"]);
        },
        defineMutableProperty: function OSF_OUtil$defineMutableProperty(obj, prop, descriptor) {
            return OSF.OUtil.defineNondefaultProperty(obj, prop, descriptor, ["writable", "enumerable", "configurable"]);
        },
        defineMutableProperties: function OSF_OUtil$defineMutableProperties(obj, descriptors) {
            return OSF.OUtil.defineNondefaultProperties(obj, descriptors, ["writable", "enumerable", "configurable"]);
        },
        finalizeProperties: function OSF_OUtil$finalizeProperties(obj, descriptor) {
            descriptor = descriptor || {};
            var props = Object.getOwnPropertyNames(obj);
            var propsLength = props.length;
            for (var i = 0; i < propsLength; i++) {
                var prop = props[i];
                var desc = Object.getOwnPropertyDescriptor(obj, prop);
                if (!desc.get && !desc.set) {
                    desc.writable = descriptor.writable || false;
                }
                desc.configurable = descriptor.configurable || false;
                desc.enumerable = descriptor.enumerable || true;
                Object.defineProperty(obj, prop, desc);
            }
            return obj;
        },
        mapList: function OSF_OUtil$MapList(list, mapFunction) {
            var ret = [];
            if (list) {
                for (var item in list) {
                    ret.push(mapFunction(list[item]));
                }
            }
            return ret;
        },
        listContainsKey: function OSF_OUtil$listContainsKey(list, key) {
            for (var item in list) {
                if (key == item) {
                    return true;
                }
            }
            return false;
        },
        listContainsValue: function OSF_OUtil$listContainsElement(list, value) {
            for (var item in list) {
                if (value == list[item]) {
                    return true;
                }
            }
            return false;
        },
        augmentList: function OSF_OUtil$augmentList(list, addenda) {
            var add = list.push ? function (key, value) { list.push(value); } : function (key, value) { list[key] = value; };
            for (var key in addenda) {
                add(key, addenda[key]);
            }
        },
        redefineList: function OSF_Outil$redefineList(oldList, newList) {
            for (var key1 in oldList) {
                delete oldList[key1];
            }
            for (var key2 in newList) {
                oldList[key2] = newList[key2];
            }
        },
        isArray: function OSF_OUtil$isArray(obj) {
            return Object.prototype.toString.apply(obj) === "[object Array]";
        },
        isFunction: function OSF_OUtil$isFunction(obj) {
            return Object.prototype.toString.apply(obj) === "[object Function]";
        },
        isDate: function OSF_OUtil$isDate(obj) {
            return Object.prototype.toString.apply(obj) === "[object Date]";
        },
        addEventListener: function OSF_OUtil$addEventListener(element, eventName, listener) {
            if (element.addEventListener) {
                element.addEventListener(eventName, listener, false);
            }
            else if ((Sys.Browser.agent === Sys.Browser.InternetExplorer) && element.attachEvent) {
                element.attachEvent("on" + eventName, listener);
            }
            else {
                element["on" + eventName] = listener;
            }
        },
        removeEventListener: function OSF_OUtil$removeEventListener(element, eventName, listener) {
            if (element.removeEventListener) {
                element.removeEventListener(eventName, listener, false);
            }
            else if ((Sys.Browser.agent === Sys.Browser.InternetExplorer) && element.detachEvent) {
                element.detachEvent("on" + eventName, listener);
            }
            else {
                element["on" + eventName] = null;
            }
        },
        getCookieValue: function OSF_OUtil$getCookieValue(cookieName) {
            var tmpCookieString = RegExp(cookieName + "[^;]+").exec(document.cookie);
            return tmpCookieString.toString().replace(/^[^=]+./, "");
        },
        xhrGet: function OSF_OUtil$xhrGet(url, onSuccess, onError) {
            var xmlhttp;
            try {
                xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        if (xmlhttp.status == 200) {
                            onSuccess(xmlhttp.responseText);
                        }
                        else {
                            onError(xmlhttp.status);
                        }
                    }
                };
                xmlhttp.open("GET", url, true);
                xmlhttp.send();
            }
            catch (ex) {
                onError(ex);
            }
        },
        xhrGetFull: function OSF_OUtil$xhrGetFull(url, oneDriveFileName, onSuccess, onError) {
            var xmlhttp;
            var requestedFileName = oneDriveFileName;
            try {
                xmlhttp = new XMLHttpRequest();
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        if (xmlhttp.status == 200) {
                            onSuccess(xmlhttp, requestedFileName);
                        }
                        else {
                            onError(xmlhttp.status);
                        }
                    }
                };
                xmlhttp.open("GET", url, true);
                xmlhttp.send();
            }
            catch (ex) {
                onError(ex);
            }
        },
        encodeBase64: function OSF_Outil$encodeBase64(input) {
            if (!input)
                return input;
            var codex = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv" + "wxyz0123456789+/=";
            var output = [];
            var temp = [];
            var index = 0;
            var c1, c2, c3, a, b, c;
            var i;
            var length = input.length;
            do {
                c1 = input.charCodeAt(index++);
                c2 = input.charCodeAt(index++);
                c3 = input.charCodeAt(index++);
                i = 0;
                a = c1 & 255;
                b = c1 >> 8;
                c = c2 & 255;
                temp[i++] = a >> 2;
                temp[i++] = ((a & 3) << 4) | (b >> 4);
                temp[i++] = ((b & 15) << 2) | (c >> 6);
                temp[i++] = c & 63;
                if (!isNaN(c2)) {
                    a = c2 >> 8;
                    b = c3 & 255;
                    c = c3 >> 8;
                    temp[i++] = a >> 2;
                    temp[i++] = ((a & 3) << 4) | (b >> 4);
                    temp[i++] = ((b & 15) << 2) | (c >> 6);
                    temp[i++] = c & 63;
                }
                if (isNaN(c2)) {
                    temp[i - 1] = 64;
                }
                else if (isNaN(c3)) {
                    temp[i - 2] = 64;
                    temp[i - 1] = 64;
                }
                for (var t = 0; t < i; t++) {
                    output.push(codex.charAt(temp[t]));
                }
            } while (index < length);
            return output.join("");
        },
        getSessionStorage: function OSF_Outil$getSessionStorage() {
            return _getSessionStorage();
        },
        getLocalStorage: function OSF_Outil$getLocalStorage() {
            if (!_safeLocalStorage) {
                try {
                    var localStorage = window.localStorage;
                }
                catch (ex) {
                    localStorage = null;
                }
                _safeLocalStorage = new OfficeExt.SafeStorage(localStorage);
            }
            return _safeLocalStorage;
        },
        convertIntToCssHexColor: function OSF_Outil$convertIntToCssHexColor(val) {
            var hex = "#" + (Number(val) + 0x1000000).toString(16).slice(-6);
            return hex;
        },
        attachClickHandler: function OSF_Outil$attachClickHandler(element, handler) {
            element.onclick = function (e) {
                handler();
            };
            element.ontouchend = function (e) {
                handler();
                e.preventDefault();
            };
        },
        getQueryStringParamValue: function OSF_Outil$getQueryStringParamValue(queryString, paramName) {
            var e = Function._validateParams(arguments, [{ name: "queryString", type: String, mayBeNull: false },
                { name: "paramName", type: String, mayBeNull: false }
            ]);
            if (e) {
                OsfMsAjaxFactory.msAjaxDebug.trace("OSF_Outil_getQueryStringParamValue: Parameters cannot be null.");
                return "";
            }
            var queryExp = new RegExp("[\\?&]" + paramName + "=([^&#]*)", "i");
            if (!queryExp.test(queryString)) {
                OsfMsAjaxFactory.msAjaxDebug.trace("OSF_Outil_getQueryStringParamValue: The parameter is not found.");
                return "";
            }
            return queryExp.exec(queryString)[1];
        },
        isiOS: function OSF_Outil$isiOS() {
            return (window.navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false);
        },
        isChrome: function OSF_Outil$isChrome() {
            return (window.navigator.userAgent.indexOf("Chrome") > 0) && !OSF.OUtil.isEdge();
        },
        isEdge: function OSF_Outil$isEdge() {
            return window.navigator.userAgent.indexOf("Edge") > 0;
        },
        isIE: function OSF_Outil$isIE() {
            return window.navigator.userAgent.indexOf("Trident") > 0;
        },
        isFirefox: function OSF_Outil$isFirefox() {
            return window.navigator.userAgent.indexOf("Firefox") > 0;
        },
        shallowCopy: function OSF_Outil$shallowCopy(sourceObj) {
            if (sourceObj == null) {
                return null;
            }
            else if (Array.isArray(sourceObj)) {
                var copyArr = [];
                for (var i = 0; i < sourceObj.length; i++) {
                    copyArr.push(sourceObj[i]);
                }
                return copyArr;
            }
            else {
                var copyObj = sourceObj.constructor();
                for (var property in sourceObj) {
                    if (sourceObj.hasOwnProperty(property)) {
                        copyObj[property] = sourceObj[property];
                    }
                }
                return copyObj;
            }
        },
        createObject: function OSF_Outil$createObject(properties) {
            var obj = null;
            if (properties) {
                obj = {};
                var len = properties.length;
                for (var i = 0; i < len; i++) {
                    obj[properties[i].name] = properties[i].value;
                }
            }
            return obj;
        },
        addClass: function OSF_OUtil$addClass(elmt, val) {
            if (!OSF.OUtil.hasClass(elmt, val)) {
                var className = elmt.getAttribute(_classN);
                if (className) {
                    elmt.setAttribute(_classN, className + " " + val);
                }
                else {
                    elmt.setAttribute(_classN, val);
                }
            }
        },
        hasClass: function OSF_OUtil$hasClass(elmt, clsName) {
            var className = elmt.getAttribute(_classN);
            return className && className.match(new RegExp('(\\s|^)' + clsName + '(\\s|$)'));
        },
        focusToFirstTabbable: function OSF_OUtil$focusToFirstTabbable(all, backward) {
            var next;
            var focused = false;
            var candidate;
            var setFlag = function (e) {
                focused = true;
            };
            var findNextPos = function (allLen, currPos, backward) {
                if (currPos < 0 || currPos > allLen) {
                    return -1;
                }
                else if (currPos === 0 && backward) {
                    return -1;
                }
                else if (currPos === allLen - 1 && !backward) {
                    return -1;
                }
                if (backward) {
                    return currPos - 1;
                }
                else {
                    return currPos + 1;
                }
            };
            all = _reOrderTabbableElements(all);
            next = backward ? all.length - 1 : 0;
            if (all.length === 0) {
                return null;
            }
            while (!focused && next >= 0 && next < all.length) {
                candidate = all[next];
                window.focus();
                candidate.addEventListener('focus', setFlag);
                candidate.focus();
                candidate.removeEventListener('focus', setFlag);
                next = findNextPos(all.length, next, backward);
                if (!focused && candidate === document.activeElement) {
                    focused = true;
                }
            }
            if (focused) {
                return candidate;
            }
            else {
                return null;
            }
        },
        focusToNextTabbable: function OSF_OUtil$focusToNextTabbable(all, curr, shift) {
            var currPos;
            var next;
            var focused = false;
            var candidate;
            var setFlag = function (e) {
                focused = true;
            };
            var findCurrPos = function (all, curr) {
                var i = 0;
                for (; i < all.length; i++) {
                    if (all[i] === curr) {
                        return i;
                    }
                }
                return -1;
            };
            var findNextPos = function (allLen, currPos, shift) {
                if (currPos < 0 || currPos > allLen) {
                    return -1;
                }
                else if (currPos === 0 && shift) {
                    return -1;
                }
                else if (currPos === allLen - 1 && !shift) {
                    return -1;
                }
                if (shift) {
                    return currPos - 1;
                }
                else {
                    return currPos + 1;
                }
            };
            all = _reOrderTabbableElements(all);
            currPos = findCurrPos(all, curr);
            next = findNextPos(all.length, currPos, shift);
            if (next < 0) {
                return null;
            }
            while (!focused && next >= 0 && next < all.length) {
                candidate = all[next];
                candidate.addEventListener('focus', setFlag);
                candidate.focus();
                candidate.removeEventListener('focus', setFlag);
                next = findNextPos(all.length, next, shift);
                if (!focused && candidate === document.activeElement) {
                    focused = true;
                }
            }
            if (focused) {
                return candidate;
            }
            else {
                return null;
            }
        }
    };
})();
OSF.OUtil.Guid = (function () {
    var hexCode = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
    return {
        generateNewGuid: function OSF_Outil_Guid$generateNewGuid() {
            var result = "";
            var tick = (new Date()).getTime();
            var index = 0;
            for (; index < 32 && tick > 0; index++) {
                if (index == 8 || index == 12 || index == 16 || index == 20) {
                    result += "-";
                }
                result += hexCode[tick % 16];
                tick = Math.floor(tick / 16);
            }
            for (; index < 32; index++) {
                if (index == 8 || index == 12 || index == 16 || index == 20) {
                    result += "-";
                }
                result += hexCode[Math.floor(Math.random() * 16)];
            }
            return result;
        }
    };
})();
window.OSF = OSF;
OSF.OUtil.setNamespace("OSF", window);
OSF.AppName = {
    Unsupported: 0,
    Excel: 1,
    Word: 2,
    PowerPoint: 4,
    Outlook: 8,
    ExcelWebApp: 16,
    WordWebApp: 32,
    OutlookWebApp: 64,
    Project: 128,
    AccessWebApp: 256,
    PowerpointWebApp: 512,
    ExcelIOS: 1024,
    Sway: 2048,
    WordIOS: 4096,
    PowerPointIOS: 8192,
    Access: 16384,
    Lync: 32768,
    OutlookIOS: 65536,
    OneNoteWebApp: 131072,
    OneNote: 262144,
    ExcelWinRT: 524288,
    WordWinRT: 1048576,
    PowerpointWinRT: 2097152,
    OutlookAndroid: 4194304,
    OneNoteWinRT: 8388608,
    ExcelAndroid: 8388609,
    VisioWebApp: 8388610
};
OSF.InternalPerfMarker = {
    DataCoercionBegin: "Agave.HostCall.CoerceDataStart",
    DataCoercionEnd: "Agave.HostCall.CoerceDataEnd"
};
OSF.HostCallPerfMarker = {
    IssueCall: "Agave.HostCall.IssueCall",
    ReceiveResponse: "Agave.HostCall.ReceiveResponse",
    RuntimeExceptionRaised: "Agave.HostCall.RuntimeExecptionRaised"
};
OSF.AgaveHostAction = {
    "Select": 0,
    "UnSelect": 1,
    "CancelDialog": 2,
    "InsertAgave": 3,
    "CtrlF6In": 4,
    "CtrlF6Exit": 5,
    "CtrlF6ExitShift": 6,
    "SelectWithError": 7,
    "NotifyHostError": 8,
    "RefreshAddinCommands": 9,
    "PageIsReady": 10,
    "TabIn": 11,
    "TabInShift": 12,
    "TabExit": 13,
    "TabExitShift": 14,
    "EscExit": 15,
    "F2Exit": 16,
    "ExitNoFocusable": 17,
    "ExitNoFocusableShift": 18
};
OSF.SharedConstants = {
    "NotificationConversationIdSuffix": '_ntf'
};
OSF.DialogMessageType = {
    DialogMessageReceived: 0,
    DialogParentMessageReceived: 1,
    DialogClosed: 12006
};
OSF.OfficeAppContext = function OSF_OfficeAppContext(id, appName, appVersion, appUILocale, dataLocale, docUrl, clientMode, settings, reason, osfControlType, eToken, correlationId, appInstanceId, touchEnabled, commerceAllowed, appMinorVersion, requirementMatrix, hostCustomMessage, hostFullVersion, clientWindowHeight, clientWindowWidth, addinName, appDomains, dialogRequirementMatrix) {
    this._id = id;
    this._appName = appName;
    this._appVersion = appVersion;
    this._appUILocale = appUILocale;
    this._dataLocale = dataLocale;
    this._docUrl = docUrl;
    this._clientMode = clientMode;
    this._settings = settings;
    this._reason = reason;
    this._osfControlType = osfControlType;
    this._eToken = eToken;
    this._correlationId = correlationId;
    this._appInstanceId = appInstanceId;
    this._touchEnabled = touchEnabled;
    this._commerceAllowed = commerceAllowed;
    this._appMinorVersion = appMinorVersion;
    this._requirementMatrix = requirementMatrix;
    this._hostCustomMessage = hostCustomMessage;
    this._hostFullVersion = hostFullVersion;
    this._isDialog = false;
    this._clientWindowHeight = clientWindowHeight;
    this._clientWindowWidth = clientWindowWidth;
    this._addinName = addinName;
    this._appDomains = appDomains;
    this._dialogRequirementMatrix = dialogRequirementMatrix;
    this.get_id = function get_id() { return this._id; };
    this.get_appName = function get_appName() { return this._appName; };
    this.get_appVersion = function get_appVersion() { return this._appVersion; };
    this.get_appUILocale = function get_appUILocale() { return this._appUILocale; };
    this.get_dataLocale = function get_dataLocale() { return this._dataLocale; };
    this.get_docUrl = function get_docUrl() { return this._docUrl; };
    this.get_clientMode = function get_clientMode() { return this._clientMode; };
    this.get_bindings = function get_bindings() { return this._bindings; };
    this.get_settings = function get_settings() { return this._settings; };
    this.get_reason = function get_reason() { return this._reason; };
    this.get_osfControlType = function get_osfControlType() { return this._osfControlType; };
    this.get_eToken = function get_eToken() { return this._eToken; };
    this.get_correlationId = function get_correlationId() { return this._correlationId; };
    this.get_appInstanceId = function get_appInstanceId() { return this._appInstanceId; };
    this.get_touchEnabled = function get_touchEnabled() { return this._touchEnabled; };
    this.get_commerceAllowed = function get_commerceAllowed() { return this._commerceAllowed; };
    this.get_appMinorVersion = function get_appMinorVersion() { return this._appMinorVersion; };
    this.get_requirementMatrix = function get_requirementMatrix() { return this._requirementMatrix; };
    this.get_dialogRequirementMatrix = function get_dialogRequirementMatrix() { return this._dialogRequirementMatrix; };
    this.get_hostCustomMessage = function get_hostCustomMessage() { return this._hostCustomMessage; };
    this.get_hostFullVersion = function get_hostFullVersion() { return this._hostFullVersion; };
    this.get_isDialog = function get_isDialog() { return this._isDialog; };
    this.get_clientWindowHeight = function get_clientWindowHeight() { return this._clientWindowHeight; };
    this.get_clientWindowWidth = function get_clientWindowWidth() { return this._clientWindowWidth; };
    this.get_addinName = function get_addinName() { return this._addinName; };
    this.get_appDomains = function get_appDomains() { return this._appDomains; };
};
OSF.OsfControlType = {
    DocumentLevel: 0,
    ContainerLevel: 1
};
OSF.ClientMode = {
    ReadOnly: 0,
    ReadWrite: 1
};
OSF.OUtil.setNamespace("Microsoft", window);
OSF.OUtil.setNamespace("Office", Microsoft);
OSF.OUtil.setNamespace("Client", Microsoft.Office);
OSF.OUtil.setNamespace("WebExtension", Microsoft.Office);
Microsoft.Office.WebExtension.InitializationReason = {
    Inserted: "inserted",
    DocumentOpened: "documentOpened"
};
Microsoft.Office.WebExtension.ValueFormat = {
    Unformatted: "unformatted",
    Formatted: "formatted"
};
Microsoft.Office.WebExtension.FilterType = {
    All: "all"
};
Microsoft.Office.WebExtension.Parameters = {
    BindingType: "bindingType",
    CoercionType: "coercionType",
    ValueFormat: "valueFormat",
    FilterType: "filterType",
    Columns: "columns",
    SampleData: "sampleData",
    GoToType: "goToType",
    SelectionMode: "selectionMode",
    Id: "id",
    PromptText: "promptText",
    ItemName: "itemName",
    FailOnCollision: "failOnCollision",
    StartRow: "startRow",
    StartColumn: "startColumn",
    RowCount: "rowCount",
    ColumnCount: "columnCount",
    Callback: "callback",
    AsyncContext: "asyncContext",
    Data: "data",
    Rows: "rows",
    OverwriteIfStale: "overwriteIfStale",
    FileType: "fileType",
    EventType: "eventType",
    Handler: "handler",
    SliceSize: "sliceSize",
    SliceIndex: "sliceIndex",
    ActiveView: "activeView",
    Status: "status",
    Xml: "xml",
    Namespace: "namespace",
    Prefix: "prefix",
    XPath: "xPath",
    Text: "text",
    ImageLeft: "imageLeft",
    ImageTop: "imageTop",
    ImageWidth: "imageWidth",
    ImageHeight: "imageHeight",
    TaskId: "taskId",
    FieldId: "fieldId",
    FieldValue: "fieldValue",
    ServerUrl: "serverUrl",
    ListName: "listName",
    ResourceId: "resourceId",
    ViewType: "viewType",
    ViewName: "viewName",
    GetRawValue: "getRawValue",
    CellFormat: "cellFormat",
    TableOptions: "tableOptions",
    TaskIndex: "taskIndex",
    ResourceIndex: "resourceIndex",
    CustomFieldId: "customFieldId",
    Url: "url",
    MessageHandler: "messageHandler",
    Width: "width",
    Height: "height",
    RequireHTTPs: "requireHTTPS",
    MessageToParent: "messageToParent",
    DisplayInIframe: "displayInIframe",
    MessageContent: "messageContent"
};
OSF.OUtil.setNamespace("DDA", OSF);
OSF.DDA.DocumentMode = {
    ReadOnly: 1,
    ReadWrite: 0
};
OSF.DDA.PropertyDescriptors = {
    AsyncResultStatus: "AsyncResultStatus"
};
OSF.DDA.EventDescriptors = {};
OSF.DDA.ListDescriptors = {};
OSF.DDA.UI = {};
OSF.DDA.getXdmEventName = function OSF_DDA$GetXdmEventName(id, eventType) {
    if (eventType == Microsoft.Office.WebExtension.EventType.BindingSelectionChanged ||
        eventType == Microsoft.Office.WebExtension.EventType.BindingDataChanged ||
        eventType == Microsoft.Office.WebExtension.EventType.DataNodeDeleted ||
        eventType == Microsoft.Office.WebExtension.EventType.DataNodeInserted ||
        eventType == Microsoft.Office.WebExtension.EventType.DataNodeReplaced) {
        return id + "_" + eventType;
    }
    else {
        return eventType;
    }
};
OSF.DDA.MethodDispId = {
    dispidMethodMin: 64,
    dispidGetSelectedDataMethod: 64,
    dispidSetSelectedDataMethod: 65,
    dispidAddBindingFromSelectionMethod: 66,
    dispidAddBindingFromPromptMethod: 67,
    dispidGetBindingMethod: 68,
    dispidReleaseBindingMethod: 69,
    dispidGetBindingDataMethod: 70,
    dispidSetBindingDataMethod: 71,
    dispidAddRowsMethod: 72,
    dispidClearAllRowsMethod: 73,
    dispidGetAllBindingsMethod: 74,
    dispidLoadSettingsMethod: 75,
    dispidSaveSettingsMethod: 76,
    dispidGetDocumentCopyMethod: 77,
    dispidAddBindingFromNamedItemMethod: 78,
    dispidAddColumnsMethod: 79,
    dispidGetDocumentCopyChunkMethod: 80,
    dispidReleaseDocumentCopyMethod: 81,
    dispidNavigateToMethod: 82,
    dispidGetActiveViewMethod: 83,
    dispidGetDocumentThemeMethod: 84,
    dispidGetOfficeThemeMethod: 85,
    dispidGetFilePropertiesMethod: 86,
    dispidClearFormatsMethod: 87,
    dispidSetTableOptionsMethod: 88,
    dispidSetFormatsMethod: 89,
    dispidExecuteRichApiRequestMethod: 93,
    dispidAppCommandInvocationCompletedMethod: 94,
    dispidCloseContainerMethod: 97,
    dispidGetSelectedTaskMethod: 110,
    dispidGetSelectedResourceMethod: 111,
    dispidGetTaskMethod: 112,
    dispidGetResourceFieldMethod: 113,
    dispidGetWSSUrlMethod: 114,
    dispidGetTaskFieldMethod: 115,
    dispidGetProjectFieldMethod: 116,
    dispidGetSelectedViewMethod: 117,
    dispidGetTaskByIndexMethod: 118,
    dispidGetResourceByIndexMethod: 119,
    dispidSetTaskFieldMethod: 120,
    dispidSetResourceFieldMethod: 121,
    dispidGetMaxTaskIndexMethod: 122,
    dispidGetMaxResourceIndexMethod: 123,
    dispidCreateTaskMethod: 124,
    dispidAddDataPartMethod: 128,
    dispidGetDataPartByIdMethod: 129,
    dispidGetDataPartsByNamespaceMethod: 130,
    dispidGetDataPartXmlMethod: 131,
    dispidGetDataPartNodesMethod: 132,
    dispidDeleteDataPartMethod: 133,
    dispidGetDataNodeValueMethod: 134,
    dispidGetDataNodeXmlMethod: 135,
    dispidGetDataNodesMethod: 136,
    dispidSetDataNodeValueMethod: 137,
    dispidSetDataNodeXmlMethod: 138,
    dispidAddDataNamespaceMethod: 139,
    dispidGetDataUriByPrefixMethod: 140,
    dispidGetDataPrefixByUriMethod: 141,
    dispidGetDataNodeTextMethod: 142,
    dispidSetDataNodeTextMethod: 143,
    dispidMessageParentMethod: 144,
    dispidSendMessageMethod: 145,
    dispidMethodMax: 145
};
OSF.DDA.EventDispId = {
    dispidEventMin: 0,
    dispidInitializeEvent: 0,
    dispidSettingsChangedEvent: 1,
    dispidDocumentSelectionChangedEvent: 2,
    dispidBindingSelectionChangedEvent: 3,
    dispidBindingDataChangedEvent: 4,
    dispidDocumentOpenEvent: 5,
    dispidDocumentCloseEvent: 6,
    dispidActiveViewChangedEvent: 7,
    dispidDocumentThemeChangedEvent: 8,
    dispidOfficeThemeChangedEvent: 9,
    dispidDialogMessageReceivedEvent: 10,
    dispidDialogNotificationShownInAddinEvent: 11,
    dispidDialogParentMessageReceivedEvent: 12,
    dispidActivationStatusChangedEvent: 32,
    dispidAppCommandInvokedEvent: 39,
    dispidOlkItemSelectedChangedEvent: 46,
    dispidTaskSelectionChangedEvent: 56,
    dispidResourceSelectionChangedEvent: 57,
    dispidViewSelectionChangedEvent: 58,
    dispidDataNodeAddedEvent: 60,
    dispidDataNodeReplacedEvent: 61,
    dispidDataNodeDeletedEvent: 62,
    dispidEventMax: 63
};
OSF.DDA.ErrorCodeManager = (function () {
    var _errorMappings = {};
    return {
        getErrorArgs: function OSF_DDA_ErrorCodeManager$getErrorArgs(errorCode) {
            var errorArgs = _errorMappings[errorCode];
            if (!errorArgs) {
                errorArgs = _errorMappings[this.errorCodes.ooeInternalError];
            }
            else {
                if (!errorArgs.name) {
                    errorArgs.name = _errorMappings[this.errorCodes.ooeInternalError].name;
                }
                if (!errorArgs.message) {
                    errorArgs.message = _errorMappings[this.errorCodes.ooeInternalError].message;
                }
            }
            return errorArgs;
        },
        addErrorMessage: function OSF_DDA_ErrorCodeManager$addErrorMessage(errorCode, errorNameMessage) {
            _errorMappings[errorCode] = errorNameMessage;
        },
        errorCodes: {
            ooeSuccess: 0,
            ooeChunkResult: 1,
            ooeCoercionTypeNotSupported: 1000,
            ooeGetSelectionNotMatchDataType: 1001,
            ooeCoercionTypeNotMatchBinding: 1002,
            ooeInvalidGetRowColumnCounts: 1003,
            ooeSelectionNotSupportCoercionType: 1004,
            ooeInvalidGetStartRowColumn: 1005,
            ooeNonUniformPartialGetNotSupported: 1006,
            ooeGetDataIsTooLarge: 1008,
            ooeFileTypeNotSupported: 1009,
            ooeGetDataParametersConflict: 1010,
            ooeInvalidGetColumns: 1011,
            ooeInvalidGetRows: 1012,
            ooeInvalidReadForBlankRow: 1013,
            ooeUnsupportedDataObject: 2000,
            ooeCannotWriteToSelection: 2001,
            ooeDataNotMatchSelection: 2002,
            ooeOverwriteWorksheetData: 2003,
            ooeDataNotMatchBindingSize: 2004,
            ooeInvalidSetStartRowColumn: 2005,
            ooeInvalidDataFormat: 2006,
            ooeDataNotMatchCoercionType: 2007,
            ooeDataNotMatchBindingType: 2008,
            ooeSetDataIsTooLarge: 2009,
            ooeNonUniformPartialSetNotSupported: 2010,
            ooeInvalidSetColumns: 2011,
            ooeInvalidSetRows: 2012,
            ooeSetDataParametersConflict: 2013,
            ooeCellDataAmountBeyondLimits: 2014,
            ooeSelectionCannotBound: 3000,
            ooeBindingNotExist: 3002,
            ooeBindingToMultipleSelection: 3003,
            ooeInvalidSelectionForBindingType: 3004,
            ooeOperationNotSupportedOnThisBindingType: 3005,
            ooeNamedItemNotFound: 3006,
            ooeMultipleNamedItemFound: 3007,
            ooeInvalidNamedItemForBindingType: 3008,
            ooeUnknownBindingType: 3009,
            ooeOperationNotSupportedOnMatrixData: 3010,
            ooeInvalidColumnsForBinding: 3011,
            ooeSettingNameNotExist: 4000,
            ooeSettingsCannotSave: 4001,
            ooeSettingsAreStale: 4002,
            ooeOperationNotSupported: 5000,
            ooeInternalError: 5001,
            ooeDocumentReadOnly: 5002,
            ooeEventHandlerNotExist: 5003,
            ooeInvalidApiCallInContext: 5004,
            ooeShuttingDown: 5005,
            ooeUnsupportedEnumeration: 5007,
            ooeIndexOutOfRange: 5008,
            ooeBrowserAPINotSupported: 5009,
            ooeInvalidParam: 5010,
            ooeRequestTimeout: 5011,
            ooeTooManyIncompleteRequests: 5100,
            ooeRequestTokenUnavailable: 5101,
            ooeActivityLimitReached: 5102,
            ooeCustomXmlNodeNotFound: 6000,
            ooeCustomXmlError: 6100,
            ooeCustomXmlExceedQuota: 6101,
            ooeCustomXmlOutOfDate: 6102,
            ooeNoCapability: 7000,
            ooeCannotNavTo: 7001,
            ooeSpecifiedIdNotExist: 7002,
            ooeNavOutOfBound: 7004,
            ooeElementMissing: 8000,
            ooeProtectedError: 8001,
            ooeInvalidCellsValue: 8010,
            ooeInvalidTableOptionValue: 8011,
            ooeInvalidFormatValue: 8012,
            ooeRowIndexOutOfRange: 8020,
            ooeColIndexOutOfRange: 8021,
            ooeFormatValueOutOfRange: 8022,
            ooeCellFormatAmountBeyondLimits: 8023,
            ooeMemoryFileLimit: 11000,
            ooeNetworkProblemRetrieveFile: 11001,
            ooeInvalidSliceSize: 11002,
            ooeInvalidCallback: 11101,
            ooeInvalidWidth: 12000,
            ooeInvalidHeight: 12001,
            ooeNavigationError: 12002,
            ooeInvalidScheme: 12003,
            ooeAppDomains: 12004,
            ooeRequireHTTPS: 12005,
            ooeWebDialogClosed: 12006,
            ooeDialogAlreadyOpened: 12007,
            ooeEndUserAllow: 12008,
            ooeEndUserIgnore: 12009,
            ooeNotUILessDialog: 12010,
            ooeCrossZone: 12011
        },
        initializeErrorMessages: function OSF_DDA_ErrorCodeManager$initializeErrorMessages(stringNS) {
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotSupported] = { name: stringNS.L_InvalidCoercion, message: stringNS.L_CoercionTypeNotSupported };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetSelectionNotMatchDataType] = { name: stringNS.L_DataReadError, message: stringNS.L_GetSelectionNotSupported };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding] = { name: stringNS.L_InvalidCoercion, message: stringNS.L_CoercionTypeNotMatchBinding };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetRowColumnCounts] = { name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetRowColumnCounts };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSelectionNotSupportCoercionType] = { name: stringNS.L_DataReadError, message: stringNS.L_SelectionNotSupportCoercionType };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetStartRowColumn] = { name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetStartRowColumn };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNonUniformPartialGetNotSupported] = { name: stringNS.L_DataReadError, message: stringNS.L_NonUniformPartialGetNotSupported };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetDataIsTooLarge] = { name: stringNS.L_DataReadError, message: stringNS.L_GetDataIsTooLarge };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeFileTypeNotSupported] = { name: stringNS.L_DataReadError, message: stringNS.L_FileTypeNotSupported };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetDataParametersConflict] = { name: stringNS.L_DataReadError, message: stringNS.L_GetDataParametersConflict };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetColumns] = { name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetColumns };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetRows] = { name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetRows };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidReadForBlankRow] = { name: stringNS.L_DataReadError, message: stringNS.L_InvalidReadForBlankRow };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedDataObject] = { name: stringNS.L_DataWriteError, message: stringNS.L_UnsupportedDataObject };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCannotWriteToSelection] = { name: stringNS.L_DataWriteError, message: stringNS.L_CannotWriteToSelection };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchSelection] = { name: stringNS.L_DataWriteError, message: stringNS.L_DataNotMatchSelection };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOverwriteWorksheetData] = { name: stringNS.L_DataWriteError, message: stringNS.L_OverwriteWorksheetData };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchBindingSize] = { name: stringNS.L_DataWriteError, message: stringNS.L_DataNotMatchBindingSize };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetStartRowColumn] = { name: stringNS.L_DataWriteError, message: stringNS.L_InvalidSetStartRowColumn };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidDataFormat] = { name: stringNS.L_InvalidFormat, message: stringNS.L_InvalidDataFormat };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchCoercionType] = { name: stringNS.L_InvalidDataObject, message: stringNS.L_DataNotMatchCoercionType };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchBindingType] = { name: stringNS.L_InvalidDataObject, message: stringNS.L_DataNotMatchBindingType };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSetDataIsTooLarge] = { name: stringNS.L_DataWriteError, message: stringNS.L_SetDataIsTooLarge };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNonUniformPartialSetNotSupported] = { name: stringNS.L_DataWriteError, message: stringNS.L_NonUniformPartialSetNotSupported };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetColumns] = { name: stringNS.L_DataWriteError, message: stringNS.L_InvalidSetColumns };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetRows] = { name: stringNS.L_DataWriteError, message: stringNS.L_InvalidSetRows };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSetDataParametersConflict] = { name: stringNS.L_DataWriteError, message: stringNS.L_SetDataParametersConflict };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSelectionCannotBound] = { name: stringNS.L_BindingCreationError, message: stringNS.L_SelectionCannotBound };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBindingNotExist] = { name: stringNS.L_InvalidBindingError, message: stringNS.L_BindingNotExist };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBindingToMultipleSelection] = { name: stringNS.L_BindingCreationError, message: stringNS.L_BindingToMultipleSelection };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSelectionForBindingType] = { name: stringNS.L_BindingCreationError, message: stringNS.L_InvalidSelectionForBindingType };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupportedOnThisBindingType] = { name: stringNS.L_InvalidBindingOperation, message: stringNS.L_OperationNotSupportedOnThisBindingType };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNamedItemNotFound] = { name: stringNS.L_BindingCreationError, message: stringNS.L_NamedItemNotFound };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeMultipleNamedItemFound] = { name: stringNS.L_BindingCreationError, message: stringNS.L_MultipleNamedItemFound };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidNamedItemForBindingType] = { name: stringNS.L_BindingCreationError, message: stringNS.L_InvalidNamedItemForBindingType };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnknownBindingType] = { name: stringNS.L_InvalidBinding, message: stringNS.L_UnknownBindingType };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupportedOnMatrixData] = { name: stringNS.L_InvalidBindingOperation, message: stringNS.L_OperationNotSupportedOnMatrixData };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidColumnsForBinding] = { name: stringNS.L_InvalidBinding, message: stringNS.L_InvalidColumnsForBinding };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingNameNotExist] = { name: stringNS.L_ReadSettingsError, message: stringNS.L_SettingNameNotExist };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingsCannotSave] = { name: stringNS.L_SaveSettingsError, message: stringNS.L_SettingsCannotSave };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingsAreStale] = { name: stringNS.L_SettingsStaleError, message: stringNS.L_SettingsAreStale };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupported] = { name: stringNS.L_HostError, message: stringNS.L_OperationNotSupported };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError] = { name: stringNS.L_InternalError, message: stringNS.L_InternalErrorDescription };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDocumentReadOnly] = { name: stringNS.L_PermissionDenied, message: stringNS.L_DocumentReadOnly };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerNotExist] = { name: stringNS.L_EventRegistrationError, message: stringNS.L_EventHandlerNotExist };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext] = { name: stringNS.L_InvalidAPICall, message: stringNS.L_InvalidApiCallInContext };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeShuttingDown] = { name: stringNS.L_ShuttingDown, message: stringNS.L_ShuttingDown };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedEnumeration] = { name: stringNS.L_UnsupportedEnumeration, message: stringNS.L_UnsupportedEnumerationMessage };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeIndexOutOfRange] = { name: stringNS.L_IndexOutOfRange, message: stringNS.L_IndexOutOfRange };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBrowserAPINotSupported] = { name: stringNS.L_APINotSupported, message: stringNS.L_BrowserAPINotSupported };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequestTimeout] = { name: stringNS.L_APICallFailed, message: stringNS.L_RequestTimeout };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeTooManyIncompleteRequests] = { name: stringNS.L_APICallFailed, message: stringNS.L_TooManyIncompleteRequests };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequestTokenUnavailable] = { name: stringNS.L_APICallFailed, message: stringNS.L_RequestTokenUnavailable };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeActivityLimitReached] = { name: stringNS.L_APICallFailed, message: stringNS.L_ActivityLimitReached };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlNodeNotFound] = { name: stringNS.L_InvalidNode, message: stringNS.L_CustomXmlNodeNotFound };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlError] = { name: stringNS.L_CustomXmlError, message: stringNS.L_CustomXmlError };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlExceedQuota] = { name: stringNS.L_CustomXmlExceedQuotaName, message: stringNS.L_CustomXmlExceedQuotaMessage };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlOutOfDate] = { name: stringNS.L_CustomXmlOutOfDateName, message: stringNS.L_CustomXmlOutOfDateMessage };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability] = { name: stringNS.L_PermissionDenied, message: stringNS.L_NoCapability };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCannotNavTo] = { name: stringNS.L_CannotNavigateTo, message: stringNS.L_CannotNavigateTo };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSpecifiedIdNotExist] = { name: stringNS.L_SpecifiedIdNotExist, message: stringNS.L_SpecifiedIdNotExist };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNavOutOfBound] = { name: stringNS.L_NavOutOfBound, message: stringNS.L_NavOutOfBound };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCellDataAmountBeyondLimits] = { name: stringNS.L_DataWriteReminder, message: stringNS.L_CellDataAmountBeyondLimits };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeElementMissing] = { name: stringNS.L_MissingParameter, message: stringNS.L_ElementMissing };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeProtectedError] = { name: stringNS.L_PermissionDenied, message: stringNS.L_NoCapability };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidCellsValue] = { name: stringNS.L_InvalidValue, message: stringNS.L_InvalidCellsValue };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidTableOptionValue] = { name: stringNS.L_InvalidValue, message: stringNS.L_InvalidTableOptionValue };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidFormatValue] = { name: stringNS.L_InvalidValue, message: stringNS.L_InvalidFormatValue };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRowIndexOutOfRange] = { name: stringNS.L_OutOfRange, message: stringNS.L_RowIndexOutOfRange };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeColIndexOutOfRange] = { name: stringNS.L_OutOfRange, message: stringNS.L_ColIndexOutOfRange };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeFormatValueOutOfRange] = { name: stringNS.L_OutOfRange, message: stringNS.L_FormatValueOutOfRange };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCellFormatAmountBeyondLimits] = { name: stringNS.L_FormattingReminder, message: stringNS.L_CellFormatAmountBeyondLimits };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeMemoryFileLimit] = { name: stringNS.L_MemoryLimit, message: stringNS.L_CloseFileBeforeRetrieve };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNetworkProblemRetrieveFile] = { name: stringNS.L_NetworkProblem, message: stringNS.L_NetworkProblemRetrieveFile };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSliceSize] = { name: stringNS.L_InvalidValue, message: stringNS.L_SliceSizeNotSupported };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDialogAlreadyOpened] = { name: stringNS.L_DisplayDialogError, message: stringNS.L_DialogAlreadyOpened };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidWidth] = { name: stringNS.L_IndexOutOfRange, message: stringNS.L_IndexOutOfRange };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidHeight] = { name: stringNS.L_IndexOutOfRange, message: stringNS.L_IndexOutOfRange };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNavigationError] = { name: stringNS.L_DisplayDialogError, message: stringNS.L_NetworkProblem };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidScheme] = { name: stringNS.L_DialogNavigateError, message: stringNS.L_DialogAddressNotTrusted };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeAppDomains] = { name: stringNS.L_DisplayDialogError, message: stringNS.L_DialogAddressNotTrusted };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequireHTTPS] = { name: stringNS.L_DisplayDialogError, message: stringNS.L_DialogAddressNotTrusted };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeEndUserIgnore] = { name: stringNS.L_DisplayDialogError, message: stringNS.L_UserClickIgnore };
            _errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCrossZone] = { name: stringNS.L_DisplayDialogError, message: stringNS.L_NewWindowCrossZoneErrorString };
        }
    };
})();
var OfficeExt;
(function (OfficeExt) {
    var Requirement;
    (function (Requirement) {
        var RequirementMatrix = (function () {
            function RequirementMatrix(_setMap) {
                this.isSetSupported = function _isSetSupported(name, minVersion) {
                    if (name == undefined) {
                        return false;
                    }
                    if (minVersion == undefined) {
                        minVersion = 0;
                    }
                    var setSupportArray = this._setMap;
                    var sets = setSupportArray._sets;
                    if (sets.hasOwnProperty(name.toLowerCase())) {
                        var setMaxVersion = sets[name.toLowerCase()];
                        return setMaxVersion > 0 && setMaxVersion >= minVersion;
                    }
                    else {
                        return false;
                    }
                };
                this._setMap = _setMap;
                this.isSetSupported = this.isSetSupported.bind(this);
            }
            return RequirementMatrix;
        })();
        Requirement.RequirementMatrix = RequirementMatrix;
        var DefaultSetRequirement = (function () {
            function DefaultSetRequirement(setMap) {
                this._addSetMap = function DefaultSetRequirement_addSetMap(addedSet) {
                    for (var name in addedSet) {
                        this._sets[name] = addedSet[name];
                    }
                };
                this._sets = setMap;
            }
            return DefaultSetRequirement;
        })();
        Requirement.DefaultSetRequirement = DefaultSetRequirement;
        var DefaultDialogSetRequirement = (function (_super) {
            __extends(DefaultDialogSetRequirement, _super);
            function DefaultDialogSetRequirement() {
                _super.call(this, {
                    "dialogapi": 1.1
                });
            }
            return DefaultDialogSetRequirement;
        })(DefaultSetRequirement);
        Requirement.DefaultDialogSetRequirement = DefaultDialogSetRequirement;
        var ExcelClientDefaultSetRequirement = (function (_super) {
            __extends(ExcelClientDefaultSetRequirement, _super);
            function ExcelClientDefaultSetRequirement() {
                _super.call(this, {
                    "bindingevents": 1.1,
                    "documentevents": 1.1,
                    "excelapi": 1.1,
                    "matrixbindings": 1.1,
                    "matrixcoercion": 1.1,
                    "selection": 1.1,
                    "settings": 1.1,
                    "tablebindings": 1.1,
                    "tablecoercion": 1.1,
                    "textbindings": 1.1,
                    "textcoercion": 1.1
                });
            }
            return ExcelClientDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.ExcelClientDefaultSetRequirement = ExcelClientDefaultSetRequirement;
        var ExcelClientV1DefaultSetRequirement = (function (_super) {
            __extends(ExcelClientV1DefaultSetRequirement, _super);
            function ExcelClientV1DefaultSetRequirement() {
                _super.call(this);
                this._addSetMap({
                    "imagecoercion": 1.1
                });
            }
            return ExcelClientV1DefaultSetRequirement;
        })(ExcelClientDefaultSetRequirement);
        Requirement.ExcelClientV1DefaultSetRequirement = ExcelClientV1DefaultSetRequirement;
        var OutlookClientDefaultSetRequirement = (function (_super) {
            __extends(OutlookClientDefaultSetRequirement, _super);
            function OutlookClientDefaultSetRequirement() {
                _super.call(this, {
                    "mailbox": 1.3
                });
            }
            return OutlookClientDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.OutlookClientDefaultSetRequirement = OutlookClientDefaultSetRequirement;
        var WordClientDefaultSetRequirement = (function (_super) {
            __extends(WordClientDefaultSetRequirement, _super);
            function WordClientDefaultSetRequirement() {
                _super.call(this, {
                    "bindingevents": 1.1,
                    "compressedfile": 1.1,
                    "customxmlparts": 1.1,
                    "documentevents": 1.1,
                    "file": 1.1,
                    "htmlcoercion": 1.1,
                    "matrixbindings": 1.1,
                    "matrixcoercion": 1.1,
                    "ooxmlcoercion": 1.1,
                    "pdffile": 1.1,
                    "selection": 1.1,
                    "settings": 1.1,
                    "tablebindings": 1.1,
                    "tablecoercion": 1.1,
                    "textbindings": 1.1,
                    "textcoercion": 1.1,
                    "textfile": 1.1,
                    "wordapi": 1.1
                });
            }
            return WordClientDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.WordClientDefaultSetRequirement = WordClientDefaultSetRequirement;
        var WordClientV1DefaultSetRequirement = (function (_super) {
            __extends(WordClientV1DefaultSetRequirement, _super);
            function WordClientV1DefaultSetRequirement() {
                _super.call(this);
                this._addSetMap({
                    "customxmlparts": 1.2,
                    "wordapi": 1.2,
                    "imagecoercion": 1.1
                });
            }
            return WordClientV1DefaultSetRequirement;
        })(WordClientDefaultSetRequirement);
        Requirement.WordClientV1DefaultSetRequirement = WordClientV1DefaultSetRequirement;
        var PowerpointClientDefaultSetRequirement = (function (_super) {
            __extends(PowerpointClientDefaultSetRequirement, _super);
            function PowerpointClientDefaultSetRequirement() {
                _super.call(this, {
                    "activeview": 1.1,
                    "compressedfile": 1.1,
                    "documentevents": 1.1,
                    "file": 1.1,
                    "pdffile": 1.1,
                    "selection": 1.1,
                    "settings": 1.1,
                    "textcoercion": 1.1
                });
            }
            return PowerpointClientDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.PowerpointClientDefaultSetRequirement = PowerpointClientDefaultSetRequirement;
        var PowerpointClientV1DefaultSetRequirement = (function (_super) {
            __extends(PowerpointClientV1DefaultSetRequirement, _super);
            function PowerpointClientV1DefaultSetRequirement() {
                _super.call(this);
                this._addSetMap({
                    "imagecoercion": 1.1
                });
            }
            return PowerpointClientV1DefaultSetRequirement;
        })(PowerpointClientDefaultSetRequirement);
        Requirement.PowerpointClientV1DefaultSetRequirement = PowerpointClientV1DefaultSetRequirement;
        var ProjectClientDefaultSetRequirement = (function (_super) {
            __extends(ProjectClientDefaultSetRequirement, _super);
            function ProjectClientDefaultSetRequirement() {
                _super.call(this, {
                    "selection": 1.1,
                    "textcoercion": 1.1
                });
            }
            return ProjectClientDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.ProjectClientDefaultSetRequirement = ProjectClientDefaultSetRequirement;
        var ExcelWebDefaultSetRequirement = (function (_super) {
            __extends(ExcelWebDefaultSetRequirement, _super);
            function ExcelWebDefaultSetRequirement() {
                _super.call(this, {
                    "bindingevents": 1.1,
                    "documentevents": 1.1,
                    "matrixbindings": 1.1,
                    "matrixcoercion": 1.1,
                    "selection": 1.1,
                    "settings": 1.1,
                    "tablebindings": 1.1,
                    "tablecoercion": 1.1,
                    "textbindings": 1.1,
                    "textcoercion": 1.1,
                    "file": 1.1
                });
            }
            return ExcelWebDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.ExcelWebDefaultSetRequirement = ExcelWebDefaultSetRequirement;
        var WordWebDefaultSetRequirement = (function (_super) {
            __extends(WordWebDefaultSetRequirement, _super);
            function WordWebDefaultSetRequirement() {
                _super.call(this, {
                    "compressedfile": 1.1,
                    "documentevents": 1.1,
                    "file": 1.1,
                    "imagecoercion": 1.1,
                    "matrixcoercion": 1.1,
                    "ooxmlcoercion": 1.1,
                    "pdffile": 1.1,
                    "selection": 1.1,
                    "settings": 1.1,
                    "tablecoercion": 1.1,
                    "textcoercion": 1.1,
                    "textfile": 1.1
                });
            }
            return WordWebDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.WordWebDefaultSetRequirement = WordWebDefaultSetRequirement;
        var PowerpointWebDefaultSetRequirement = (function (_super) {
            __extends(PowerpointWebDefaultSetRequirement, _super);
            function PowerpointWebDefaultSetRequirement() {
                _super.call(this, {
                    "activeview": 1.1,
                    "settings": 1.1
                });
            }
            return PowerpointWebDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.PowerpointWebDefaultSetRequirement = PowerpointWebDefaultSetRequirement;
        var OutlookWebDefaultSetRequirement = (function (_super) {
            __extends(OutlookWebDefaultSetRequirement, _super);
            function OutlookWebDefaultSetRequirement() {
                _super.call(this, {
                    "mailbox": 1.3
                });
            }
            return OutlookWebDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.OutlookWebDefaultSetRequirement = OutlookWebDefaultSetRequirement;
        var SwayWebDefaultSetRequirement = (function (_super) {
            __extends(SwayWebDefaultSetRequirement, _super);
            function SwayWebDefaultSetRequirement() {
                _super.call(this, {
                    "activeview": 1.1,
                    "documentevents": 1.1,
                    "selection": 1.1,
                    "settings": 1.1,
                    "textcoercion": 1.1
                });
            }
            return SwayWebDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.SwayWebDefaultSetRequirement = SwayWebDefaultSetRequirement;
        var AccessWebDefaultSetRequirement = (function (_super) {
            __extends(AccessWebDefaultSetRequirement, _super);
            function AccessWebDefaultSetRequirement() {
                _super.call(this, {
                    "bindingevents": 1.1,
                    "partialtablebindings": 1.1,
                    "settings": 1.1,
                    "tablebindings": 1.1,
                    "tablecoercion": 1.1
                });
            }
            return AccessWebDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.AccessWebDefaultSetRequirement = AccessWebDefaultSetRequirement;
        var ExcelIOSDefaultSetRequirement = (function (_super) {
            __extends(ExcelIOSDefaultSetRequirement, _super);
            function ExcelIOSDefaultSetRequirement() {
                _super.call(this, {
                    "bindingevents": 1.1,
                    "documentevents": 1.1,
                    "matrixbindings": 1.1,
                    "matrixcoercion": 1.1,
                    "selection": 1.1,
                    "settings": 1.1,
                    "tablebindings": 1.1,
                    "tablecoercion": 1.1,
                    "textbindings": 1.1,
                    "textcoercion": 1.1
                });
            }
            return ExcelIOSDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.ExcelIOSDefaultSetRequirement = ExcelIOSDefaultSetRequirement;
        var WordIOSDefaultSetRequirement = (function (_super) {
            __extends(WordIOSDefaultSetRequirement, _super);
            function WordIOSDefaultSetRequirement() {
                _super.call(this, {
                    "bindingevents": 1.1,
                    "compressedfile": 1.1,
                    "customxmlparts": 1.1,
                    "documentevents": 1.1,
                    "file": 1.1,
                    "htmlcoercion": 1.1,
                    "matrixbindings": 1.1,
                    "matrixcoercion": 1.1,
                    "ooxmlcoercion": 1.1,
                    "pdffile": 1.1,
                    "selection": 1.1,
                    "settings": 1.1,
                    "tablebindings": 1.1,
                    "tablecoercion": 1.1,
                    "textbindings": 1.1,
                    "textcoercion": 1.1,
                    "textfile": 1.1
                });
            }
            return WordIOSDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.WordIOSDefaultSetRequirement = WordIOSDefaultSetRequirement;
        var WordIOSV1DefaultSetRequirement = (function (_super) {
            __extends(WordIOSV1DefaultSetRequirement, _super);
            function WordIOSV1DefaultSetRequirement() {
                _super.call(this);
                this._addSetMap({
                    "customxmlparts": 1.2,
                    "wordapi": 1.2
                });
            }
            return WordIOSV1DefaultSetRequirement;
        })(WordIOSDefaultSetRequirement);
        Requirement.WordIOSV1DefaultSetRequirement = WordIOSV1DefaultSetRequirement;
        var PowerpointIOSDefaultSetRequirement = (function (_super) {
            __extends(PowerpointIOSDefaultSetRequirement, _super);
            function PowerpointIOSDefaultSetRequirement() {
                _super.call(this, {
                    "activeview": 1.1,
                    "compressedfile": 1.1,
                    "documentevents": 1.1,
                    "file": 1.1,
                    "pdffile": 1.1,
                    "selection": 1.1,
                    "settings": 1.1,
                    "textcoercion": 1.1
                });
            }
            return PowerpointIOSDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.PowerpointIOSDefaultSetRequirement = PowerpointIOSDefaultSetRequirement;
        var OutlookIOSDefaultSetRequirement = (function (_super) {
            __extends(OutlookIOSDefaultSetRequirement, _super);
            function OutlookIOSDefaultSetRequirement() {
                _super.call(this, {
                    "mailbox": 1.1
                });
            }
            return OutlookIOSDefaultSetRequirement;
        })(DefaultSetRequirement);
        Requirement.OutlookIOSDefaultSetRequirement = OutlookIOSDefaultSetRequirement;
        var RequirementsMatrixFactory = (function () {
            function RequirementsMatrixFactory() {
            }
            RequirementsMatrixFactory.initializeOsfDda = function () {
                OSF.OUtil.setNamespace("Requirement", OSF.DDA);
            };
            RequirementsMatrixFactory.getDefaultRequirementMatrix = function (appContext) {
                this.initializeDefaultSetMatrix();
                var defaultRequirementMatrix = undefined;
                var clientRequirement = appContext.get_requirementMatrix();
                if (clientRequirement != undefined && clientRequirement.length > 0 && typeof (JSON) !== "undefined") {
                    var matrixItem = JSON.parse(appContext.get_requirementMatrix().toLowerCase());
                    defaultRequirementMatrix = new RequirementMatrix(new DefaultSetRequirement(matrixItem));
                }
                else {
                    var appLocator = RequirementsMatrixFactory.getClientFullVersionString(appContext);
                    if (RequirementsMatrixFactory.DefaultSetArrayMatrix != undefined && RequirementsMatrixFactory.DefaultSetArrayMatrix[appLocator] != undefined) {
                        defaultRequirementMatrix = new RequirementMatrix(RequirementsMatrixFactory.DefaultSetArrayMatrix[appLocator]);
                    }
                    else {
                        defaultRequirementMatrix = new RequirementMatrix(new DefaultSetRequirement({}));
                    }
                }
                return defaultRequirementMatrix;
            };
            RequirementsMatrixFactory.getDefaultDialogRequirementMatrix = function (appContext) {
                var defaultRequirementMatrix = undefined;
                var clientRequirement = appContext.get_dialogRequirementMatrix();
                if (clientRequirement != undefined && clientRequirement.length > 0 && typeof (JSON) !== "undefined") {
                    var matrixItem = JSON.parse(appContext.get_requirementMatrix().toLowerCase());
                    defaultRequirementMatrix = new RequirementMatrix(new DefaultSetRequirement(matrixItem));
                }
                else {
                    defaultRequirementMatrix = new RequirementMatrix(new DefaultDialogSetRequirement());
                }
                return defaultRequirementMatrix;
            };
            RequirementsMatrixFactory.getClientFullVersionString = function (appContext) {
                var appMinorVersion = appContext.get_appMinorVersion();
                var appMinorVersionString = "";
                var appFullVersion = "";
                var appName = appContext.get_appName();
                var isIOSClient = appName == 1024 ||
                    appName == 4096 ||
                    appName == 8192 ||
                    appName == 65536;
                if (isIOSClient && appContext.get_appVersion() == 1) {
                    if (appName == 4096 && appMinorVersion >= 15) {
                        appFullVersion = "16.00.01";
                    }
                    else {
                        appFullVersion = "16.00";
                    }
                }
                else if (appContext.get_appName() == 64) {
                    appFullVersion = appContext.get_appVersion();
                }
                else {
                    if (appMinorVersion < 10) {
                        appMinorVersionString = "0" + appMinorVersion;
                    }
                    else {
                        appMinorVersionString = "" + appMinorVersion;
                    }
                    appFullVersion = appContext.get_appVersion() + "." + appMinorVersionString;
                }
                return appContext.get_appName() + "-" + appFullVersion;
            };
            RequirementsMatrixFactory.initializeDefaultSetMatrix = function () {
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_RCLIENT_1600] = new ExcelClientDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_RCLIENT_1600] = new WordClientDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_RCLIENT_1600] = new PowerpointClientDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_RCLIENT_1601] = new ExcelClientV1DefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_RCLIENT_1601] = new WordClientV1DefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_RCLIENT_1601] = new PowerpointClientV1DefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_RCLIENT_1600] = new OutlookClientDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_WAC_1600] = new ExcelWebDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_WAC_1600] = new WordWebDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_WAC_1600] = new OutlookWebDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_WAC_1601] = new OutlookWebDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Project_RCLIENT_1600] = new ProjectClientDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Access_WAC_1600] = new AccessWebDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_WAC_1600] = new PowerpointWebDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_IOS_1600] = new ExcelIOSDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.SWAY_WAC_1600] = new SwayWebDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_IOS_1600] = new WordIOSDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_IOS_16001] = new WordIOSV1DefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_IOS_1600] = new PowerpointIOSDefaultSetRequirement();
                RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_IOS_1600] = new OutlookIOSDefaultSetRequirement();
            };
            RequirementsMatrixFactory.Excel_RCLIENT_1600 = "1-16.00";
            RequirementsMatrixFactory.Excel_RCLIENT_1601 = "1-16.01";
            RequirementsMatrixFactory.Word_RCLIENT_1600 = "2-16.00";
            RequirementsMatrixFactory.Word_RCLIENT_1601 = "2-16.01";
            RequirementsMatrixFactory.PowerPoint_RCLIENT_1600 = "4-16.00";
            RequirementsMatrixFactory.PowerPoint_RCLIENT_1601 = "4-16.01";
            RequirementsMatrixFactory.Outlook_RCLIENT_1600 = "8-16.00";
            RequirementsMatrixFactory.Excel_WAC_1600 = "16-16.00";
            RequirementsMatrixFactory.Word_WAC_1600 = "32-16.00";
            RequirementsMatrixFactory.Outlook_WAC_1600 = "64-16.00";
            RequirementsMatrixFactory.Outlook_WAC_1601 = "64-16.01";
            RequirementsMatrixFactory.Project_RCLIENT_1600 = "128-16.00";
            RequirementsMatrixFactory.Access_WAC_1600 = "256-16.00";
            RequirementsMatrixFactory.PowerPoint_WAC_1600 = "512-16.00";
            RequirementsMatrixFactory.Excel_IOS_1600 = "1024-16.00";
            RequirementsMatrixFactory.SWAY_WAC_1600 = "2048-16.00";
            RequirementsMatrixFactory.Word_IOS_1600 = "4096-16.00";
            RequirementsMatrixFactory.Word_IOS_16001 = "4096-16.00.01";
            RequirementsMatrixFactory.PowerPoint_IOS_1600 = "8192-16.00";
            RequirementsMatrixFactory.Outlook_IOS_1600 = "65536-16.00";
            RequirementsMatrixFactory.DefaultSetArrayMatrix = {};
            return RequirementsMatrixFactory;
        })();
        Requirement.RequirementsMatrixFactory = RequirementsMatrixFactory;
    })(Requirement = OfficeExt.Requirement || (OfficeExt.Requirement = {}));
})(OfficeExt || (OfficeExt = {}));
OfficeExt.Requirement.RequirementsMatrixFactory.initializeOsfDda();
Microsoft.Office.WebExtension.ApplicationMode = {
    WebEditor: "webEditor",
    WebViewer: "webViewer",
    Client: "client"
};
Microsoft.Office.WebExtension.DocumentMode = {
    ReadOnly: "readOnly",
    ReadWrite: "readWrite"
};
OSF.NamespaceManager = (function OSF_NamespaceManager() {
    var _userOffice;
    var _useShortcut = false;
    return {
        enableShortcut: function OSF_NamespaceManager$enableShortcut() {
            if (!_useShortcut) {
                if (window.Office) {
                    _userOffice = window.Office;
                }
                else {
                    OSF.OUtil.setNamespace("Office", window);
                }
                window.Office = Microsoft.Office.WebExtension;
                _useShortcut = true;
            }
        },
        disableShortcut: function OSF_NamespaceManager$disableShortcut() {
            if (_useShortcut) {
                if (_userOffice) {
                    window.Office = _userOffice;
                }
                else {
                    OSF.OUtil.unsetNamespace("Office", window);
                }
                _useShortcut = false;
            }
        }
    };
})();
OSF.NamespaceManager.enableShortcut();
Microsoft.Office.WebExtension.useShortNamespace = function Microsoft_Office_WebExtension_useShortNamespace(useShortcut) {
    if (useShortcut) {
        OSF.NamespaceManager.enableShortcut();
    }
    else {
        OSF.NamespaceManager.disableShortcut();
    }
};
Microsoft.Office.WebExtension.select = function Microsoft_Office_WebExtension_select(str, errorCallback) {
    var promise;
    if (str && typeof str == "string") {
        var index = str.indexOf("#");
        if (index != -1) {
            var op = str.substring(0, index);
            var target = str.substring(index + 1);
            switch (op) {
                case "binding":
                case "bindings":
                    if (target) {
                        promise = new OSF.DDA.BindingPromise(target);
                    }
                    break;
            }
        }
    }
    if (!promise) {
        if (errorCallback) {
            var callbackType = typeof errorCallback;
            if (callbackType == "function") {
                var callArgs = {};
                callArgs[Microsoft.Office.WebExtension.Parameters.Callback] = errorCallback;
                OSF.DDA.issueAsyncResult(callArgs, OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext, OSF.DDA.ErrorCodeManager.getErrorArgs(OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext));
            }
            else {
                throw OSF.OUtil.formatString(Strings.OfficeOM.L_CallbackNotAFunction, callbackType);
            }
        }
    }
    else {
        promise.onFail = errorCallback;
        return promise;
    }
};
OSF.DDA.Context = function OSF_DDA_Context(officeAppContext, document, license, appOM, getOfficeTheme) {
    OSF.OUtil.defineEnumerableProperties(this, {
        "contentLanguage": {
            value: officeAppContext.get_dataLocale()
        },
        "displayLanguage": {
            value: officeAppContext.get_appUILocale()
        },
        "touchEnabled": {
            value: officeAppContext.get_touchEnabled()
        },
        "commerceAllowed": {
            value: officeAppContext.get_commerceAllowed()
        }
    });
    if (license) {
        OSF.OUtil.defineEnumerableProperty(this, "license", {
            value: license
        });
    }
    if (officeAppContext.ui) {
        OSF.OUtil.defineEnumerableProperty(this, "ui", {
            value: officeAppContext.ui
        });
    }
    if (officeAppContext.get_isDialog()) {
        var requirements = OfficeExt.Requirement.RequirementsMatrixFactory.getDefaultDialogRequirementMatrix(officeAppContext);
        OSF.OUtil.defineEnumerableProperty(this, "requirements", {
            value: requirements
        });
    }
    else {
        if (document) {
            OSF.OUtil.defineEnumerableProperty(this, "document", {
                value: document
            });
        }
        if (appOM) {
            var displayName = appOM.displayName || "appOM";
            delete appOM.displayName;
            OSF.OUtil.defineEnumerableProperty(this, displayName, {
                value: appOM
            });
        }
        if (getOfficeTheme) {
            OSF.OUtil.defineEnumerableProperty(this, "officeTheme", {
                get: function () {
                    return getOfficeTheme();
                }
            });
        }
        var requirements = OfficeExt.Requirement.RequirementsMatrixFactory.getDefaultRequirementMatrix(officeAppContext);
        OSF.OUtil.defineEnumerableProperty(this, "requirements", {
            value: requirements
        });
    }
};
OSF.DDA.OutlookContext = function OSF_DDA_OutlookContext(appContext, settings, license, appOM, getOfficeTheme) {
    OSF.DDA.OutlookContext.uber.constructor.call(this, appContext, null, license, appOM, getOfficeTheme);
    if (settings) {
        OSF.OUtil.defineEnumerableProperty(this, "roamingSettings", {
            value: settings
        });
    }
};
OSF.OUtil.extend(OSF.DDA.OutlookContext, OSF.DDA.Context);
OSF.DDA.OutlookAppOm = function OSF_DDA_OutlookAppOm(appContext, window, appReady) { };
OSF.DDA.Document = function OSF_DDA_Document(officeAppContext, settings) {
    var mode;
    switch (officeAppContext.get_clientMode()) {
        case OSF.ClientMode.ReadOnly:
            mode = Microsoft.Office.WebExtension.DocumentMode.ReadOnly;
            break;
        case OSF.ClientMode.ReadWrite:
            mode = Microsoft.Office.WebExtension.DocumentMode.ReadWrite;
            break;
    }
    ;
    if (settings) {
        OSF.OUtil.defineEnumerableProperty(this, "settings", {
            value: settings
        });
    }
    ;
    OSF.OUtil.defineMutableProperties(this, {
        "mode": {
            value: mode
        },
        "url": {
            value: officeAppContext.get_docUrl()
        }
    });
};
OSF.DDA.JsomDocument = function OSF_DDA_JsomDocument(officeAppContext, bindingFacade, settings) {
    OSF.DDA.JsomDocument.uber.constructor.call(this, officeAppContext, settings);
    if (bindingFacade) {
        OSF.OUtil.defineEnumerableProperty(this, "bindings", {
            get: function OSF_DDA_Document$GetBindings() { return bindingFacade; }
        });
    }
    var am = OSF.DDA.AsyncMethodNames;
    OSF.DDA.DispIdHost.addAsyncMethods(this, [
        am.GetSelectedDataAsync,
        am.SetSelectedDataAsync
    ]);
    OSF.DDA.DispIdHost.addEventSupport(this, new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged]));
};
OSF.OUtil.extend(OSF.DDA.JsomDocument, OSF.DDA.Document);
OSF.OUtil.defineEnumerableProperty(Microsoft.Office.WebExtension, "context", {
    get: function Microsoft_Office_WebExtension$GetContext() {
        var context;
        if (OSF && OSF._OfficeAppFactory) {
            context = OSF._OfficeAppFactory.getContext();
        }
        return context;
    }
});
OSF.DDA.License = function OSF_DDA_License(eToken) {
    OSF.OUtil.defineEnumerableProperty(this, "value", {
        value: eToken
    });
};
OSF.DDA.ApiMethodCall = function OSF_DDA_ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName) {
    var requiredCount = requiredParameters.length;
    var getInvalidParameterString = OSF.OUtil.delayExecutionAndCache(function () {
        return OSF.OUtil.formatString(Strings.OfficeOM.L_InvalidParameters, displayName);
    });
    this.verifyArguments = function OSF_DDA_ApiMethodCall$VerifyArguments(params, args) {
        for (var name in params) {
            var param = params[name];
            var arg = args[name];
            if (param["enum"]) {
                switch (typeof arg) {
                    case "string":
                        if (OSF.OUtil.listContainsValue(param["enum"], arg)) {
                            break;
                        }
                    case "undefined":
                        throw OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedEnumeration;
                    default:
                        throw getInvalidParameterString();
                }
            }
            if (param["types"]) {
                if (!OSF.OUtil.listContainsValue(param["types"], typeof arg)) {
                    throw getInvalidParameterString();
                }
            }
        }
    };
    this.extractRequiredArguments = function OSF_DDA_ApiMethodCall$ExtractRequiredArguments(userArgs, caller, stateInfo) {
        if (userArgs.length < requiredCount) {
            throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_MissingRequiredArguments);
        }
        var requiredArgs = [];
        var index;
        for (index = 0; index < requiredCount; index++) {
            requiredArgs.push(userArgs[index]);
        }
        this.verifyArguments(requiredParameters, requiredArgs);
        var ret = {};
        for (index = 0; index < requiredCount; index++) {
            var param = requiredParameters[index];
            var arg = requiredArgs[index];
            if (param.verify) {
                var isValid = param.verify(arg, caller, stateInfo);
                if (!isValid) {
                    throw getInvalidParameterString();
                }
            }
            ret[param.name] = arg;
        }
        return ret;
    },
        this.fillOptions = function OSF_DDA_ApiMethodCall$FillOptions(options, requiredArgs, caller, stateInfo) {
            options = options || {};
            for (var optionName in supportedOptions) {
                if (!OSF.OUtil.listContainsKey(options, optionName)) {
                    var value = undefined;
                    var option = supportedOptions[optionName];
                    if (option.calculate && requiredArgs) {
                        value = option.calculate(requiredArgs, caller, stateInfo);
                    }
                    if (!value && option.defaultValue !== undefined) {
                        value = option.defaultValue;
                    }
                    options[optionName] = value;
                }
            }
            return options;
        };
    this.constructCallArgs = function OSF_DAA_ApiMethodCall$ConstructCallArgs(required, options, caller, stateInfo) {
        var callArgs = {};
        for (var r in required) {
            callArgs[r] = required[r];
        }
        for (var o in options) {
            callArgs[o] = options[o];
        }
        for (var s in privateStateCallbacks) {
            callArgs[s] = privateStateCallbacks[s](caller, stateInfo);
        }
        if (checkCallArgs) {
            callArgs = checkCallArgs(callArgs, caller, stateInfo);
        }
        return callArgs;
    };
};
OSF.OUtil.setNamespace("AsyncResultEnum", OSF.DDA);
OSF.DDA.AsyncResultEnum.Properties = {
    Context: "Context",
    Value: "Value",
    Status: "Status",
    Error: "Error"
};
Microsoft.Office.WebExtension.AsyncResultStatus = {
    Succeeded: "succeeded",
    Failed: "failed"
};
OSF.DDA.AsyncResultEnum.ErrorCode = {
    Success: 0,
    Failed: 1
};
OSF.DDA.AsyncResultEnum.ErrorProperties = {
    Name: "Name",
    Message: "Message",
    Code: "Code"
};
OSF.DDA.AsyncMethodNames = {};
OSF.DDA.AsyncMethodNames.addNames = function (methodNames) {
    for (var entry in methodNames) {
        var am = {};
        OSF.OUtil.defineEnumerableProperties(am, {
            "id": {
                value: entry
            },
            "displayName": {
                value: methodNames[entry]
            }
        });
        OSF.DDA.AsyncMethodNames[entry] = am;
    }
};
OSF.DDA.AsyncMethodCall = function OSF_DDA_AsyncMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, onSucceeded, onFailed, checkCallArgs, displayName) {
    var requiredCount = requiredParameters.length;
    var apiMethods = new OSF.DDA.ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName);
    function OSF_DAA_AsyncMethodCall$ExtractOptions(userArgs, requiredArgs, caller, stateInfo) {
        if (userArgs.length > requiredCount + 2) {
            throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyArguments);
        }
        var options, parameterCallback;
        for (var i = userArgs.length - 1; i >= requiredCount; i--) {
            var argument = userArgs[i];
            switch (typeof argument) {
                case "object":
                    if (options) {
                        throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalObjects);
                    }
                    else {
                        options = argument;
                    }
                    break;
                case "function":
                    if (parameterCallback) {
                        throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalFunction);
                    }
                    else {
                        parameterCallback = argument;
                    }
                    break;
                default:
                    throw OsfMsAjaxFactory.msAjaxError.argument(Strings.OfficeOM.L_InValidOptionalArgument);
                    break;
            }
        }
        options = apiMethods.fillOptions(options, requiredArgs, caller, stateInfo);
        if (parameterCallback) {
            if (options[Microsoft.Office.WebExtension.Parameters.Callback]) {
                throw Strings.OfficeOM.L_RedundantCallbackSpecification;
            }
            else {
                options[Microsoft.Office.WebExtension.Parameters.Callback] = parameterCallback;
            }
        }
        apiMethods.verifyArguments(supportedOptions, options);
        return options;
    }
    ;
    this.verifyAndExtractCall = function OSF_DAA_AsyncMethodCall$VerifyAndExtractCall(userArgs, caller, stateInfo) {
        var required = apiMethods.extractRequiredArguments(userArgs, caller, stateInfo);
        var options = OSF_DAA_AsyncMethodCall$ExtractOptions(userArgs, required, caller, stateInfo);
        var callArgs = apiMethods.constructCallArgs(required, options, caller, stateInfo);
        return callArgs;
    };
    this.processResponse = function OSF_DAA_AsyncMethodCall$ProcessResponse(status, response, caller, callArgs) {
        var payload;
        if (status == OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
            if (onSucceeded) {
                payload = onSucceeded(response, caller, callArgs);
            }
            else {
                payload = response;
            }
        }
        else {
            if (onFailed) {
                payload = onFailed(status, response);
            }
            else {
                payload = OSF.DDA.ErrorCodeManager.getErrorArgs(status);
            }
        }
        return payload;
    };
    this.getCallArgs = function (suppliedArgs) {
        var options, parameterCallback;
        for (var i = suppliedArgs.length - 1; i >= requiredCount; i--) {
            var argument = suppliedArgs[i];
            switch (typeof argument) {
                case "object":
                    options = argument;
                    break;
                case "function":
                    parameterCallback = argument;
                    break;
            }
        }
        options = options || {};
        if (parameterCallback) {
            options[Microsoft.Office.WebExtension.Parameters.Callback] = parameterCallback;
        }
        return options;
    };
};
OSF.DDA.AsyncMethodCallFactory = (function () {
    return {
        manufacture: function (params) {
            var supportedOptions = params.supportedOptions ? OSF.OUtil.createObject(params.supportedOptions) : [];
            var privateStateCallbacks = params.privateStateCallbacks ? OSF.OUtil.createObject(params.privateStateCallbacks) : [];
            return new OSF.DDA.AsyncMethodCall(params.requiredArguments || [], supportedOptions, privateStateCallbacks, params.onSucceeded, params.onFailed, params.checkCallArgs, params.method.displayName);
        }
    };
})();
OSF.DDA.AsyncMethodCalls = {};
OSF.DDA.AsyncMethodCalls.define = function (callDefinition) {
    OSF.DDA.AsyncMethodCalls[callDefinition.method.id] = OSF.DDA.AsyncMethodCallFactory.manufacture(callDefinition);
};
OSF.DDA.Error = function OSF_DDA_Error(name, message, code) {
    OSF.OUtil.defineEnumerableProperties(this, {
        "name": {
            value: name
        },
        "message": {
            value: message
        },
        "code": {
            value: code
        }
    });
};
OSF.DDA.AsyncResult = function OSF_DDA_AsyncResult(initArgs, errorArgs) {
    OSF.OUtil.defineEnumerableProperties(this, {
        "value": {
            value: initArgs[OSF.DDA.AsyncResultEnum.Properties.Value]
        },
        "status": {
            value: errorArgs ? Microsoft.Office.WebExtension.AsyncResultStatus.Failed : Microsoft.Office.WebExtension.AsyncResultStatus.Succeeded
        }
    });
    if (initArgs[OSF.DDA.AsyncResultEnum.Properties.Context]) {
        OSF.OUtil.defineEnumerableProperty(this, "asyncContext", {
            value: initArgs[OSF.DDA.AsyncResultEnum.Properties.Context]
        });
    }
    if (errorArgs) {
        OSF.OUtil.defineEnumerableProperty(this, "error", {
            value: new OSF.DDA.Error(errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code])
        });
    }
};
OSF.DDA.issueAsyncResult = function OSF_DDA$IssueAsyncResult(callArgs, status, payload) {
    var callback = callArgs[Microsoft.Office.WebExtension.Parameters.Callback];
    if (callback) {
        var asyncInitArgs = {};
        asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Context] = callArgs[Microsoft.Office.WebExtension.Parameters.AsyncContext];
        var errorArgs;
        if (status == OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
            asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Value] = payload;
        }
        else {
            errorArgs = {};
            payload = payload || OSF.DDA.ErrorCodeManager.getErrorArgs(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
            errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code] = status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
            errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name] = payload.name || payload;
            errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message] = payload.message || payload;
        }
        callback(new OSF.DDA.AsyncResult(asyncInitArgs, errorArgs));
    }
};
OSF.DDA.SyncMethodNames = {};
OSF.DDA.SyncMethodNames.addNames = function (methodNames) {
    for (var entry in methodNames) {
        var am = {};
        OSF.OUtil.defineEnumerableProperties(am, {
            "id": {
                value: entry
            },
            "displayName": {
                value: methodNames[entry]
            }
        });
        OSF.DDA.SyncMethodNames[entry] = am;
    }
};
OSF.DDA.SyncMethodCall = function OSF_DDA_SyncMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName) {
    var requiredCount = requiredParameters.length;
    var apiMethods = new OSF.DDA.ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName);
    function OSF_DAA_SyncMethodCall$ExtractOptions(userArgs, requiredArgs, caller, stateInfo) {
        if (userArgs.length > requiredCount + 1) {
            throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyArguments);
        }
        var options, parameterCallback;
        for (var i = userArgs.length - 1; i >= requiredCount; i--) {
            var argument = userArgs[i];
            switch (typeof argument) {
                case "object":
                    if (options) {
                        throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalObjects);
                    }
                    else {
                        options = argument;
                    }
                    break;
                default:
                    throw OsfMsAjaxFactory.msAjaxError.argument(Strings.OfficeOM.L_InValidOptionalArgument);
                    break;
            }
        }
        options = apiMethods.fillOptions(options, requiredArgs, caller, stateInfo);
        apiMethods.verifyArguments(supportedOptions, options);
        return options;
    }
    ;
    this.verifyAndExtractCall = function OSF_DAA_AsyncMethodCall$VerifyAndExtractCall(userArgs, caller, stateInfo) {
        var required = apiMethods.extractRequiredArguments(userArgs, caller, stateInfo);
        var options = OSF_DAA_SyncMethodCall$ExtractOptions(userArgs, required, caller, stateInfo);
        var callArgs = apiMethods.constructCallArgs(required, options, caller, stateInfo);
        return callArgs;
    };
};
OSF.DDA.SyncMethodCallFactory = (function () {
    return {
        manufacture: function (params) {
            var supportedOptions = params.supportedOptions ? OSF.OUtil.createObject(params.supportedOptions) : [];
            return new OSF.DDA.SyncMethodCall(params.requiredArguments || [], supportedOptions, params.privateStateCallbacks, params.checkCallArgs, params.method.displayName);
        }
    };
})();
OSF.DDA.SyncMethodCalls = {};
OSF.DDA.SyncMethodCalls.define = function (callDefinition) {
    OSF.DDA.SyncMethodCalls[callDefinition.method.id] = OSF.DDA.SyncMethodCallFactory.manufacture(callDefinition);
};
OSF.DDA.ListType = (function () {
    var listTypes = {};
    return {
        setListType: function OSF_DDA_ListType$AddListType(t, prop) { listTypes[t] = prop; },
        isListType: function OSF_DDA_ListType$IsListType(t) { return OSF.OUtil.listContainsKey(listTypes, t); },
        getDescriptor: function OSF_DDA_ListType$getDescriptor(t) { return listTypes[t]; }
    };
})();
OSF.DDA.HostParameterMap = function (specialProcessor, mappings) {
    var toHostMap = "toHost";
    var fromHostMap = "fromHost";
    var sourceData = "sourceData";
    var self = "self";
    var dynamicTypes = {};
    dynamicTypes[Microsoft.Office.WebExtension.Parameters.Data] = {
        toHost: function (data) {
            if (data != null && data.rows !== undefined) {
                var tableData = {};
                tableData[OSF.DDA.TableDataProperties.TableRows] = data.rows;
                tableData[OSF.DDA.TableDataProperties.TableHeaders] = data.headers;
                data = tableData;
            }
            return data;
        },
        fromHost: function (args) {
            return args;
        }
    };
    dynamicTypes[Microsoft.Office.WebExtension.Parameters.SampleData] = dynamicTypes[Microsoft.Office.WebExtension.Parameters.Data];
    function mapValues(preimageSet, mapping) {
        var ret = preimageSet ? {} : undefined;
        for (var entry in preimageSet) {
            var preimage = preimageSet[entry];
            var image;
            if (OSF.DDA.ListType.isListType(entry)) {
                image = [];
                for (var subEntry in preimage) {
                    image.push(mapValues(preimage[subEntry], mapping));
                }
            }
            else if (OSF.OUtil.listContainsKey(dynamicTypes, entry)) {
                image = dynamicTypes[entry][mapping](preimage);
            }
            else if (mapping == fromHostMap && specialProcessor.preserveNesting(entry)) {
                image = mapValues(preimage, mapping);
            }
            else {
                var maps = mappings[entry];
                if (maps) {
                    var map = maps[mapping];
                    if (map) {
                        image = map[preimage];
                        if (image === undefined) {
                            image = preimage;
                        }
                    }
                }
                else {
                    image = preimage;
                }
            }
            ret[entry] = image;
        }
        return ret;
    }
    ;
    function generateArguments(imageSet, parameters) {
        var ret;
        for (var param in parameters) {
            var arg;
            if (specialProcessor.isComplexType(param)) {
                arg = generateArguments(imageSet, mappings[param][toHostMap]);
            }
            else {
                arg = imageSet[param];
            }
            if (arg != undefined) {
                if (!ret) {
                    ret = {};
                }
                var index = parameters[param];
                if (index == self) {
                    index = param;
                }
                ret[index] = specialProcessor.pack(param, arg);
            }
        }
        return ret;
    }
    ;
    function extractArguments(source, parameters, extracted) {
        if (!extracted) {
            extracted = {};
        }
        for (var param in parameters) {
            var index = parameters[param];
            var value;
            if (index == self) {
                value = source;
            }
            else if (index == sourceData) {
                extracted[param] = source.toArray();
                continue;
            }
            else {
                value = source[index];
            }
            if (value === null || value === undefined) {
                extracted[param] = undefined;
            }
            else {
                value = specialProcessor.unpack(param, value);
                var map;
                if (specialProcessor.isComplexType(param)) {
                    map = mappings[param][fromHostMap];
                    if (specialProcessor.preserveNesting(param)) {
                        extracted[param] = extractArguments(value, map);
                    }
                    else {
                        extractArguments(value, map, extracted);
                    }
                }
                else {
                    if (OSF.DDA.ListType.isListType(param)) {
                        map = {};
                        var entryDescriptor = OSF.DDA.ListType.getDescriptor(param);
                        map[entryDescriptor] = self;
                        var extractedValues = new Array(value.length);
                        for (var item in value) {
                            extractedValues[item] = extractArguments(value[item], map);
                        }
                        extracted[param] = extractedValues;
                    }
                    else {
                        extracted[param] = value;
                    }
                }
            }
        }
        return extracted;
    }
    ;
    function applyMap(mapName, preimage, mapping) {
        var parameters = mappings[mapName][mapping];
        var image;
        if (mapping == "toHost") {
            var imageSet = mapValues(preimage, mapping);
            image = generateArguments(imageSet, parameters);
        }
        else if (mapping == "fromHost") {
            var argumentSet = extractArguments(preimage, parameters);
            image = mapValues(argumentSet, mapping);
        }
        return image;
    }
    ;
    if (!mappings) {
        mappings = {};
    }
    this.addMapping = function (mapName, description) {
        var toHost, fromHost;
        if (description.map) {
            toHost = description.map;
            fromHost = {};
            for (var preimage in toHost) {
                var image = toHost[preimage];
                if (image == self) {
                    image = preimage;
                }
                fromHost[image] = preimage;
            }
        }
        else {
            toHost = description.toHost;
            fromHost = description.fromHost;
        }
        var pair = mappings[mapName];
        if (pair) {
            var currMap = pair[toHostMap];
            for (var th in currMap)
                toHost[th] = currMap[th];
            currMap = pair[fromHostMap];
            for (var fh in currMap)
                fromHost[fh] = currMap[fh];
        }
        else {
            pair = mappings[mapName] = {};
        }
        pair[toHostMap] = toHost;
        pair[fromHostMap] = fromHost;
    };
    this.toHost = function (mapName, preimage) { return applyMap(mapName, preimage, toHostMap); };
    this.fromHost = function (mapName, image) { return applyMap(mapName, image, fromHostMap); };
    this.self = self;
    this.sourceData = sourceData;
    this.addComplexType = function (ct) { specialProcessor.addComplexType(ct); };
    this.getDynamicType = function (dt) { return specialProcessor.getDynamicType(dt); };
    this.setDynamicType = function (dt, handler) { specialProcessor.setDynamicType(dt, handler); };
    this.dynamicTypes = dynamicTypes;
    this.doMapValues = function (preimageSet, mapping) { return mapValues(preimageSet, mapping); };
};
OSF.DDA.SpecialProcessor = function (complexTypes, dynamicTypes) {
    this.addComplexType = function OSF_DDA_SpecialProcessor$addComplexType(ct) {
        complexTypes.push(ct);
    };
    this.getDynamicType = function OSF_DDA_SpecialProcessor$getDynamicType(dt) {
        return dynamicTypes[dt];
    };
    this.setDynamicType = function OSF_DDA_SpecialProcessor$setDynamicType(dt, handler) {
        dynamicTypes[dt] = handler;
    };
    this.isComplexType = function OSF_DDA_SpecialProcessor$isComplexType(t) {
        return OSF.OUtil.listContainsValue(complexTypes, t);
    };
    this.isDynamicType = function OSF_DDA_SpecialProcessor$isDynamicType(p) {
        return OSF.OUtil.listContainsKey(dynamicTypes, p);
    };
    this.preserveNesting = function OSF_DDA_SpecialProcessor$preserveNesting(p) {
        var pn = [];
        if (OSF.DDA.PropertyDescriptors)
            pn.push(OSF.DDA.PropertyDescriptors.Subset);
        if (OSF.DDA.DataNodeEventProperties) {
            pn = pn.concat([
                OSF.DDA.DataNodeEventProperties.OldNode,
                OSF.DDA.DataNodeEventProperties.NewNode,
                OSF.DDA.DataNodeEventProperties.NextSiblingNode
            ]);
        }
        return OSF.OUtil.listContainsValue(pn, p);
    };
    this.pack = function OSF_DDA_SpecialProcessor$pack(param, arg) {
        var value;
        if (this.isDynamicType(param)) {
            value = dynamicTypes[param].toHost(arg);
        }
        else {
            value = arg;
        }
        return value;
    };
    this.unpack = function OSF_DDA_SpecialProcessor$unpack(param, arg) {
        var value;
        if (this.isDynamicType(param)) {
            value = dynamicTypes[param].fromHost(arg);
        }
        else {
            value = arg;
        }
        return value;
    };
};
OSF.DDA.getDecoratedParameterMap = function (specialProcessor, initialDefs) {
    var parameterMap = new OSF.DDA.HostParameterMap(specialProcessor);
    var self = parameterMap.self;
    function createObject(properties) {
        var obj = null;
        if (properties) {
            obj = {};
            var len = properties.length;
            for (var i = 0; i < len; i++) {
                obj[properties[i].name] = properties[i].value;
            }
        }
        return obj;
    }
    parameterMap.define = function define(definition) {
        var args = {};
        var toHost = createObject(definition.toHost);
        if (definition.invertible) {
            args.map = toHost;
        }
        else if (definition.canonical) {
            args.toHost = args.fromHost = toHost;
        }
        else {
            args.toHost = toHost;
            args.fromHost = createObject(definition.fromHost);
        }
        parameterMap.addMapping(definition.type, args);
        if (definition.isComplexType)
            parameterMap.addComplexType(definition.type);
    };
    for (var id in initialDefs)
        parameterMap.define(initialDefs[id]);
    return parameterMap;
};
OSF.OUtil.setNamespace("DispIdHost", OSF.DDA);
OSF.DDA.DispIdHost.Methods = {
    InvokeMethod: "invokeMethod",
    AddEventHandler: "addEventHandler",
    RemoveEventHandler: "removeEventHandler",
    OpenDialog: "openDialog",
    CloseDialog: "closeDialog",
    MessageParent: "messageParent",
    SendMessage: "sendMessage"
};
OSF.DDA.DispIdHost.Delegates = {
    ExecuteAsync: "executeAsync",
    RegisterEventAsync: "registerEventAsync",
    UnregisterEventAsync: "unregisterEventAsync",
    ParameterMap: "parameterMap",
    OpenDialog: "openDialog",
    CloseDialog: "closeDialog",
    MessageParent: "messageParent",
    SendMessage: "sendMessage"
};
OSF.DDA.DispIdHost.Facade = function OSF_DDA_DispIdHost_Facade(getDelegateMethods, parameterMap) {
    var dispIdMap = {};
    var jsom = OSF.DDA.AsyncMethodNames;
    var did = OSF.DDA.MethodDispId;
    var methodMap = {
        "GoToByIdAsync": did.dispidNavigateToMethod,
        "GetSelectedDataAsync": did.dispidGetSelectedDataMethod,
        "SetSelectedDataAsync": did.dispidSetSelectedDataMethod,
        "GetDocumentCopyChunkAsync": did.dispidGetDocumentCopyChunkMethod,
        "ReleaseDocumentCopyAsync": did.dispidReleaseDocumentCopyMethod,
        "GetDocumentCopyAsync": did.dispidGetDocumentCopyMethod,
        "AddFromSelectionAsync": did.dispidAddBindingFromSelectionMethod,
        "AddFromPromptAsync": did.dispidAddBindingFromPromptMethod,
        "AddFromNamedItemAsync": did.dispidAddBindingFromNamedItemMethod,
        "GetAllAsync": did.dispidGetAllBindingsMethod,
        "GetByIdAsync": did.dispidGetBindingMethod,
        "ReleaseByIdAsync": did.dispidReleaseBindingMethod,
        "GetDataAsync": did.dispidGetBindingDataMethod,
        "SetDataAsync": did.dispidSetBindingDataMethod,
        "AddRowsAsync": did.dispidAddRowsMethod,
        "AddColumnsAsync": did.dispidAddColumnsMethod,
        "DeleteAllDataValuesAsync": did.dispidClearAllRowsMethod,
        "RefreshAsync": did.dispidLoadSettingsMethod,
        "SaveAsync": did.dispidSaveSettingsMethod,
        "GetActiveViewAsync": did.dispidGetActiveViewMethod,
        "GetFilePropertiesAsync": did.dispidGetFilePropertiesMethod,
        "GetOfficeThemeAsync": did.dispidGetOfficeThemeMethod,
        "GetDocumentThemeAsync": did.dispidGetDocumentThemeMethod,
        "ClearFormatsAsync": did.dispidClearFormatsMethod,
        "SetTableOptionsAsync": did.dispidSetTableOptionsMethod,
        "SetFormatsAsync": did.dispidSetFormatsMethod,
        "ExecuteRichApiRequestAsync": did.dispidExecuteRichApiRequestMethod,
        "AppCommandInvocationCompletedAsync": did.dispidAppCommandInvocationCompletedMethod,
        "CloseContainerAsync": did.dispidCloseContainerMethod,
        "AddDataPartAsync": did.dispidAddDataPartMethod,
        "GetDataPartByIdAsync": did.dispidGetDataPartByIdMethod,
        "GetDataPartsByNameSpaceAsync": did.dispidGetDataPartsByNamespaceMethod,
        "GetPartXmlAsync": did.dispidGetDataPartXmlMethod,
        "GetPartNodesAsync": did.dispidGetDataPartNodesMethod,
        "DeleteDataPartAsync": did.dispidDeleteDataPartMethod,
        "GetNodeValueAsync": did.dispidGetDataNodeValueMethod,
        "GetNodeXmlAsync": did.dispidGetDataNodeXmlMethod,
        "GetRelativeNodesAsync": did.dispidGetDataNodesMethod,
        "SetNodeValueAsync": did.dispidSetDataNodeValueMethod,
        "SetNodeXmlAsync": did.dispidSetDataNodeXmlMethod,
        "AddDataPartNamespaceAsync": did.dispidAddDataNamespaceMethod,
        "GetDataPartNamespaceAsync": did.dispidGetDataUriByPrefixMethod,
        "GetDataPartPrefixAsync": did.dispidGetDataPrefixByUriMethod,
        "GetNodeTextAsync": did.dispidGetDataNodeTextMethod,
        "SetNodeTextAsync": did.dispidSetDataNodeTextMethod,
        "GetSelectedTask": did.dispidGetSelectedTaskMethod,
        "GetTask": did.dispidGetTaskMethod,
        "GetWSSUrl": did.dispidGetWSSUrlMethod,
        "GetTaskField": did.dispidGetTaskFieldMethod,
        "GetSelectedResource": did.dispidGetSelectedResourceMethod,
        "GetResourceField": did.dispidGetResourceFieldMethod,
        "GetProjectField": did.dispidGetProjectFieldMethod,
        "GetSelectedView": did.dispidGetSelectedViewMethod,
        "GetTaskByIndex": did.dispidGetTaskByIndexMethod,
        "GetResourceByIndex": did.dispidGetResourceByIndexMethod,
        "SetTaskField": did.dispidSetTaskFieldMethod,
        "SetResourceField": did.dispidSetResourceFieldMethod,
        "GetMaxTaskIndex": did.dispidGetMaxTaskIndexMethod,
        "GetMaxResourceIndex": did.dispidGetMaxResourceIndexMethod,
        "CreateTask": did.dispidCreateTaskMethod
    };
    for (var method in methodMap) {
        if (jsom[method]) {
            dispIdMap[jsom[method].id] = methodMap[method];
        }
    }
    jsom = OSF.DDA.SyncMethodNames;
    did = OSF.DDA.MethodDispId;
    var asyncMethodMap = {
        "MessageParent": did.dispidMessageParentMethod,
        "SendMessage": did.dispidSendMessageMethod
    };
    for (var method in asyncMethodMap) {
        if (jsom[method]) {
            dispIdMap[jsom[method].id] = asyncMethodMap[method];
        }
    }
    jsom = Microsoft.Office.WebExtension.EventType;
    did = OSF.DDA.EventDispId;
    var eventMap = {
        "SettingsChanged": did.dispidSettingsChangedEvent,
        "DocumentSelectionChanged": did.dispidDocumentSelectionChangedEvent,
        "BindingSelectionChanged": did.dispidBindingSelectionChangedEvent,
        "BindingDataChanged": did.dispidBindingDataChangedEvent,
        "ActiveViewChanged": did.dispidActiveViewChangedEvent,
        "OfficeThemeChanged": did.dispidOfficeThemeChangedEvent,
        "DocumentThemeChanged": did.dispidDocumentThemeChangedEvent,
        "AppCommandInvoked": did.dispidAppCommandInvokedEvent,
        "DialogMessageReceived": did.dispidDialogMessageReceivedEvent,
        "DialogParentMessageReceived": did.dispidDialogParentMessageReceivedEvent,
        "ItemChanged": did.dispidOlkItemSelectedChangedEvent,
        "TaskSelectionChanged": did.dispidTaskSelectionChangedEvent,
        "ResourceSelectionChanged": did.dispidResourceSelectionChangedEvent,
        "ViewSelectionChanged": did.dispidViewSelectionChangedEvent,
        "DataNodeInserted": did.dispidDataNodeAddedEvent,
        "DataNodeReplaced": did.dispidDataNodeReplacedEvent,
        "DataNodeDeleted": did.dispidDataNodeDeletedEvent
    };
    for (var event in eventMap) {
        if (jsom[event]) {
            dispIdMap[jsom[event]] = eventMap[event];
        }
    }
    function onException(ex, asyncMethodCall, suppliedArgs, callArgs) {
        if (typeof ex == "number") {
            if (!callArgs) {
                callArgs = asyncMethodCall.getCallArgs(suppliedArgs);
            }
            OSF.DDA.issueAsyncResult(callArgs, ex, OSF.DDA.ErrorCodeManager.getErrorArgs(ex));
        }
        else {
            throw ex;
        }
    }
    ;
    this[OSF.DDA.DispIdHost.Methods.InvokeMethod] = function OSF_DDA_DispIdHost_Facade$InvokeMethod(method, suppliedArguments, caller, privateState) {
        var callArgs;
        try {
            var methodName = method.id;
            var asyncMethodCall = OSF.DDA.AsyncMethodCalls[methodName];
            callArgs = asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, privateState);
            var dispId = dispIdMap[methodName];
            var delegate = getDelegateMethods(methodName);
            var richApiInExcelMethodSubstitution = null;
            if (window.Excel && window.Office.context.requirements.isSetSupported("RedirectV1Api")) {
                window.Excel._RedirectV1APIs = true;
            }
            if (window.Excel && window.Excel._RedirectV1APIs && (richApiInExcelMethodSubstitution = window.Excel._V1APIMap[methodName])) {
                if (richApiInExcelMethodSubstitution.preprocess) {
                    callArgs = richApiInExcelMethodSubstitution.preprocess(callArgs);
                }
                var ctx = new window.Excel.RequestContext();
                var result = richApiInExcelMethodSubstitution.call(ctx, callArgs);
                ctx.sync()
                    .then(function () {
                    var response = result.value;
                    var status = response.status;
                    delete response["status"];
                    delete response["@odata.type"];
                    if (richApiInExcelMethodSubstitution.postprocess) {
                        response = richApiInExcelMethodSubstitution.postprocess(response, callArgs);
                    }
                    if (status != 0) {
                        response = OSF.DDA.ErrorCodeManager.getErrorArgs(status);
                    }
                    OSF.DDA.issueAsyncResult(callArgs, status, response);
                })["catch"](function (error) {
                    OSF.DDA.issueAsyncResult(callArgs, OSF.DDA.ErrorCodeManager.errorCodes.ooeFailure, null);
                });
            }
            else {
                var hostCallArgs;
                if (parameterMap.toHost) {
                    hostCallArgs = parameterMap.toHost(dispId, callArgs);
                }
                else {
                    hostCallArgs = callArgs;
                }
                delegate[OSF.DDA.DispIdHost.Delegates.ExecuteAsync]({
                    "dispId": dispId,
                    "hostCallArgs": hostCallArgs,
                    "onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { },
                    "onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { },
                    "onComplete": function (status, hostResponseArgs) {
                        var responseArgs;
                        if (status == OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
                            if (parameterMap.fromHost) {
                                responseArgs = parameterMap.fromHost(dispId, hostResponseArgs);
                            }
                            else {
                                responseArgs = hostResponseArgs;
                            }
                        }
                        else {
                            responseArgs = hostResponseArgs;
                        }
                        var payload = asyncMethodCall.processResponse(status, responseArgs, caller, callArgs);
                        OSF.DDA.issueAsyncResult(callArgs, status, payload);
                    }
                });
            }
        }
        catch (ex) {
            onException(ex, asyncMethodCall, suppliedArguments, callArgs);
        }
    };
    this[OSF.DDA.DispIdHost.Methods.AddEventHandler] = function OSF_DDA_DispIdHost_Facade$AddEventHandler(suppliedArguments, eventDispatch, caller, isPopupWindow) {
        var callArgs;
        var eventType, handler;
        function onEnsureRegistration(status) {
            if (status == OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
                var added = eventDispatch.addEventHandler(eventType, handler);
                if (!added) {
                    status = OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerAdditionFailed;
                }
            }
            var error;
            if (status != OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
                error = OSF.DDA.ErrorCodeManager.getErrorArgs(status);
            }
            OSF.DDA.issueAsyncResult(callArgs, status, error);
        }
        try {
            var asyncMethodCall = OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.AddHandlerAsync.id];
            callArgs = asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
            eventType = callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
            handler = callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
            if (isPopupWindow) {
                onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
                return;
            }
            if (eventDispatch.getEventHandlerCount(eventType) == 0) {
                var dispId = dispIdMap[eventType];
                var invoker = getDelegateMethods(eventType)[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync];
                invoker({
                    "eventType": eventType,
                    "dispId": dispId,
                    "targetId": caller.id || "",
                    "onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
                    "onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
                    "onComplete": onEnsureRegistration,
                    "onEvent": function handleEvent(hostArgs) {
                        var args = parameterMap.fromHost(dispId, hostArgs);
                        eventDispatch.fireEvent(OSF.DDA.OMFactory.manufactureEventArgs(eventType, caller, args));
                    }
                });
            }
            else {
                onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
            }
        }
        catch (ex) {
            onException(ex, asyncMethodCall, suppliedArguments, callArgs);
        }
    };
    this[OSF.DDA.DispIdHost.Methods.RemoveEventHandler] = function OSF_DDA_DispIdHost_Facade$RemoveEventHandler(suppliedArguments, eventDispatch, caller) {
        var callArgs;
        var eventType, handler;
        function onEnsureRegistration(status) {
            var error;
            if (status != OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
                error = OSF.DDA.ErrorCodeManager.getErrorArgs(status);
            }
            OSF.DDA.issueAsyncResult(callArgs, status, error);
        }
        try {
            var asyncMethodCall = OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.RemoveHandlerAsync.id];
            callArgs = asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
            eventType = callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
            handler = callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
            var status, removeSuccess;
            if (handler === null) {
                removeSuccess = eventDispatch.clearEventHandlers(eventType);
                status = OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess;
            }
            else {
                removeSuccess = eventDispatch.removeEventHandler(eventType, handler);
                status = removeSuccess ? OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess : OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerNotExist;
            }
            if (removeSuccess && eventDispatch.getEventHandlerCount(eventType) == 0) {
                var dispId = dispIdMap[eventType];
                var invoker = getDelegateMethods(eventType)[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync];
                invoker({
                    "eventType": eventType,
                    "dispId": dispId,
                    "targetId": caller.id || "",
                    "onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
                    "onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
                    "onComplete": onEnsureRegistration
                });
            }
            else {
                onEnsureRegistration(status);
            }
        }
        catch (ex) {
            onException(ex, asyncMethodCall, suppliedArguments, callArgs);
        }
    };
    this[OSF.DDA.DispIdHost.Methods.OpenDialog] = function OSF_DDA_DispIdHost_Facade$OpenDialog(suppliedArguments, eventDispatch, caller) {
        var callArgs;
        var targetId;
        var dialogMessageEvent = Microsoft.Office.WebExtension.EventType.DialogMessageReceived;
        var dialogOtherEvent = Microsoft.Office.WebExtension.EventType.DialogEventReceived;
        function onEnsureRegistration(status) {
            var payload;
            if (status != OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
                payload = OSF.DDA.ErrorCodeManager.getErrorArgs(status);
            }
            else {
                var onSucceedArgs = {};
                onSucceedArgs[Microsoft.Office.WebExtension.Parameters.Id] = targetId;
                onSucceedArgs[Microsoft.Office.WebExtension.Parameters.Data] = eventDispatch;
                var payload = asyncMethodCall.processResponse(status, onSucceedArgs, caller, callArgs);
                OSF.DialogShownStatus.hasDialogShown = true;
                eventDispatch.clearEventHandlers(dialogMessageEvent);
                eventDispatch.clearEventHandlers(dialogOtherEvent);
            }
            OSF.DDA.issueAsyncResult(callArgs, status, payload);
        }
        try {
            if (dialogMessageEvent == undefined || dialogOtherEvent == undefined) {
                onEnsureRegistration(OSF.DDA.ErrorCodeManager.ooeOperationNotSupported);
            }
            if (OSF.DDA.AsyncMethodNames.DisplayDialogAsync == null) {
                onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
                return;
            }
            var asyncMethodCall = OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.DisplayDialogAsync.id];
            callArgs = asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
            var dispId = dispIdMap[dialogMessageEvent];
            var delegateMethods = getDelegateMethods(dialogMessageEvent);
            var invoker = delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog] != undefined ?
                delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog] :
                delegateMethods[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync];
            targetId = JSON.stringify(callArgs);
            invoker({
                "eventType": dialogMessageEvent,
                "dispId": dispId,
                "targetId": targetId,
                "onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
                "onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
                "onComplete": onEnsureRegistration,
                "onEvent": function handleEvent(hostArgs) {
                    var args = parameterMap.fromHost(dispId, hostArgs);
                    var event = OSF.DDA.OMFactory.manufactureEventArgs(dialogMessageEvent, caller, args);
                    if (event.type == dialogOtherEvent) {
                        var payload = OSF.DDA.ErrorCodeManager.getErrorArgs(event.error);
                        var errorArgs = {};
                        errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code] = status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
                        errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name] = payload.name || payload;
                        errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message] = payload.message || payload;
                        event.error = new OSF.DDA.Error(errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]);
                    }
                    eventDispatch.fireOrQueueEvent(event);
                    if (args[OSF.DDA.PropertyDescriptors.MessageType] == OSF.DialogMessageType.DialogClosed) {
                        eventDispatch.clearEventHandlers(dialogMessageEvent);
                        eventDispatch.clearEventHandlers(dialogOtherEvent);
                        eventDispatch.clearEventHandlers(Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived);
                        OSF.DialogShownStatus.hasDialogShown = false;
                    }
                }
            });
        }
        catch (ex) {
            onException(ex, asyncMethodCall, suppliedArguments, callArgs);
        }
    };
    this[OSF.DDA.DispIdHost.Methods.CloseDialog] = function OSF_DDA_DispIdHost_Facade$CloseDialog(suppliedArguments, targetId, eventDispatch, caller) {
        var callArgs;
        var dialogMessageEvent, dialogOtherEvent;
        var closeStatus = OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess;
        function closeCallback(status) {
            closeStatus = status;
            OSF.DialogShownStatus.hasDialogShown = false;
        }
        try {
            var asyncMethodCall = OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.CloseAsync.id];
            callArgs = asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
            dialogMessageEvent = Microsoft.Office.WebExtension.EventType.DialogMessageReceived;
            dialogOtherEvent = Microsoft.Office.WebExtension.EventType.DialogEventReceived;
            eventDispatch.clearEventHandlers(dialogMessageEvent);
            eventDispatch.clearEventHandlers(dialogOtherEvent);
            var dispId = dispIdMap[dialogMessageEvent];
            var delegateMethods = getDelegateMethods(dialogMessageEvent);
            var invoker = delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog] != undefined ?
                delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog] :
                delegateMethods[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync];
            invoker({
                "eventType": dialogMessageEvent,
                "dispId": dispId,
                "targetId": targetId,
                "onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
                "onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
                "onComplete": closeCallback
            });
        }
        catch (ex) {
            onException(ex, asyncMethodCall, suppliedArguments, callArgs);
        }
        if (closeStatus != OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
            throw OSF.OUtil.formatString(Strings.OfficeOM.L_FunctionCallFailed, OSF.DDA.AsyncMethodNames.CloseAsync.displayName, closeStatus);
        }
    };
    this[OSF.DDA.DispIdHost.Methods.MessageParent] = function OSF_DDA_DispIdHost_Facade$MessageParent(suppliedArguments, caller) {
        var stateInfo = {};
        var syncMethodCall = OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.MessageParent.id];
        var callArgs = syncMethodCall.verifyAndExtractCall(suppliedArguments, caller, stateInfo);
        var delegate = getDelegateMethods(OSF.DDA.SyncMethodNames.MessageParent.id);
        var invoker = delegate[OSF.DDA.DispIdHost.Delegates.MessageParent];
        var dispId = dispIdMap[OSF.DDA.SyncMethodNames.MessageParent.id];
        return invoker({
            "dispId": dispId,
            "hostCallArgs": callArgs,
            "onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
            "onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); }
        });
    };
    this[OSF.DDA.DispIdHost.Methods.SendMessage] = function OSF_DDA_DispIdHost_Facade$SendMessage(suppliedArguments, eventDispatch, caller) {
        var stateInfo = {};
        var syncMethodCall = OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.SendMessage.id];
        var callArgs = syncMethodCall.verifyAndExtractCall(suppliedArguments, caller, stateInfo);
        var delegate = getDelegateMethods(OSF.DDA.SyncMethodNames.SendMessage.id);
        var invoker = delegate[OSF.DDA.DispIdHost.Delegates.SendMessage];
        var dispId = dispIdMap[OSF.DDA.SyncMethodNames.SendMessage.id];
        return invoker({
            "dispId": dispId,
            "hostCallArgs": callArgs,
            "onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
            "onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); }
        });
    };
};
OSF.DDA.DispIdHost.addAsyncMethods = function OSF_DDA_DispIdHost$AddAsyncMethods(target, asyncMethodNames, privateState) {
    for (var entry in asyncMethodNames) {
        var method = asyncMethodNames[entry];
        var name = method.displayName;
        if (!target[name]) {
            OSF.OUtil.defineEnumerableProperty(target, name, {
                value: (function (asyncMethod) {
                    return function () {
                        var invokeMethod = OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.InvokeMethod];
                        invokeMethod(asyncMethod, arguments, target, privateState);
                    };
                })(method)
            });
        }
    }
};
OSF.DDA.DispIdHost.addEventSupport = function OSF_DDA_DispIdHost$AddEventSupport(target, eventDispatch, isPopupWindow) {
    var add = OSF.DDA.AsyncMethodNames.AddHandlerAsync.displayName;
    var remove = OSF.DDA.AsyncMethodNames.RemoveHandlerAsync.displayName;
    if (!target[add]) {
        OSF.OUtil.defineEnumerableProperty(target, add, {
            value: function () {
                var addEventHandler = OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.AddEventHandler];
                addEventHandler(arguments, eventDispatch, target, isPopupWindow);
            }
        });
    }
    if (!target[remove]) {
        OSF.OUtil.defineEnumerableProperty(target, remove, {
            value: function () {
                var removeEventHandler = OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.RemoveEventHandler];
                removeEventHandler(arguments, eventDispatch, target);
            }
        });
    }
};
OSF.ShowWindowDialogParameterKeys = {
    Url: "url",
    Width: "width",
    Height: "height",
    DisplayInIframe: "displayInIframe"
};
OSF.HostThemeButtonStyleKeys = {
    ButtonBorderColor: "buttonBorderColor",
    ButtonBackgroundColor: "buttonBackgroundColor"
};
var OfficeExt;
(function (OfficeExt) {
    var WACUtils;
    (function (WACUtils) {
        var _trustedDomain = "^https:\/\/[a-zA-Z0-9]+\.(officeapps\.live|officeapps-df\.live|partner\.officewebapps)\.com\/";
        function parseAppContextFromWindowName(skipSessionStorage, windowName) {
            return OSF.OUtil.parseInfoFromWindowName(skipSessionStorage, windowName, OSF.WindowNameItemKeys.AppContext);
        }
        WACUtils.parseAppContextFromWindowName = parseAppContextFromWindowName;
        function serializeObjectToString(response) {
            if (typeof (JSON) !== "undefined") {
                try {
                    return JSON.stringify(response);
                }
                catch (ex) {
                }
            }
            return "";
        }
        WACUtils.serializeObjectToString = serializeObjectToString;
        function isHostTrusted() {
            return (new RegExp(_trustedDomain)).test(OSF.getClientEndPoint()._targetUrl);
        }
        WACUtils.isHostTrusted = isHostTrusted;
        function addHostInfoAsQueryParam(url, hostInfoValue) {
            if (!url) {
                return null;
            }
            url = url.trim() || '';
            var questionMark = "?";
            var hostInfo = "_host_Info=";
            var ampHostInfo = "&_host_Info=";
            var fragmentSeparator = "#";
            var urlParts = url.split(fragmentSeparator);
            var urlWithoutFragment = urlParts.shift();
            var fragment = urlParts.join(fragmentSeparator);
            var querySplits = urlWithoutFragment.split(questionMark);
            var urlWithoutFragmentWithHostInfo;
            if (querySplits.length > 1) {
                urlWithoutFragmentWithHostInfo = urlWithoutFragment + ampHostInfo + hostInfoValue;
            }
            else if (querySplits.length > 0) {
                urlWithoutFragmentWithHostInfo = urlWithoutFragment + questionMark + hostInfo + hostInfoValue;
            }
            return [urlWithoutFragmentWithHostInfo, fragmentSeparator, fragment].join('');
        }
        WACUtils.addHostInfoAsQueryParam = addHostInfoAsQueryParam;
        function getDomainForUrl(url) {
            if (!url) {
                return null;
            }
            var url_parser = document.createElement('a');
            url_parser.href = url;
            return url_parser.protocol + "//" + url_parser.host;
        }
        WACUtils.getDomainForUrl = getDomainForUrl;
    })(WACUtils = OfficeExt.WACUtils || (OfficeExt.WACUtils = {}));
})(OfficeExt || (OfficeExt = {}));
var OfficeExt;
(function (OfficeExt) {
    var MsAjaxTypeHelper = (function () {
        function MsAjaxTypeHelper() {
        }
        MsAjaxTypeHelper.isInstanceOfType = function (type, instance) {
            if (typeof (instance) === "undefined" || instance === null)
                return false;
            if (instance instanceof type)
                return true;
            var instanceType = instance.constructor;
            if (!instanceType || (typeof (instanceType) !== "function") || !instanceType.__typeName || instanceType.__typeName === 'Object') {
                instanceType = Object;
            }
            return !!(instanceType === type) ||
                (instanceType.__typeName && type.__typeName && instanceType.__typeName === type.__typeName);
        };
        return MsAjaxTypeHelper;
    })();
    OfficeExt.MsAjaxTypeHelper = MsAjaxTypeHelper;
    var MsAjaxError = (function () {
        function MsAjaxError() {
        }
        MsAjaxError.create = function (message, errorInfo) {
            var err = new Error(message);
            err.message = message;
            if (errorInfo) {
                for (var v in errorInfo) {
                    err[v] = errorInfo[v];
                }
            }
            err.popStackFrame();
            return err;
        };
        MsAjaxError.parameterCount = function (message) {
            var displayMessage = "Sys.ParameterCountException: " + (message ? message : "Parameter count mismatch.");
            var err = MsAjaxError.create(displayMessage, { name: 'Sys.ParameterCountException' });
            err.popStackFrame();
            return err;
        };
        MsAjaxError.argument = function (paramName, message) {
            var displayMessage = "Sys.ArgumentException: " + (message ? message : "Value does not fall within the expected range.");
            if (paramName) {
                displayMessage += "\n" + MsAjaxString.format("Parameter name: {0}", paramName);
            }
            var err = MsAjaxError.create(displayMessage, { name: "Sys.ArgumentException", paramName: paramName });
            err.popStackFrame();
            return err;
        };
        MsAjaxError.argumentNull = function (paramName, message) {
            var displayMessage = "Sys.ArgumentNullException: " + (message ? message : "Value cannot be null.");
            if (paramName) {
                displayMessage += "\n" + MsAjaxString.format("Parameter name: {0}", paramName);
            }
            var err = MsAjaxError.create(displayMessage, { name: "Sys.ArgumentNullException", paramName: paramName });
            err.popStackFrame();
            return err;
        };
        MsAjaxError.argumentOutOfRange = function (paramName, actualValue, message) {
            var displayMessage = "Sys.ArgumentOutOfRangeException: " + (message ? message : "Specified argument was out of the range of valid values.");
            if (paramName) {
                displayMessage += "\n" + MsAjaxString.format("Parameter name: {0}", paramName);
            }
            if (typeof (actualValue) !== "undefined" && actualValue !== null) {
                displayMessage += "\n" + MsAjaxString.format("Actual value was {0}.", actualValue);
            }
            var err = MsAjaxError.create(displayMessage, {
                name: "Sys.ArgumentOutOfRangeException",
                paramName: paramName,
                actualValue: actualValue
            });
            err.popStackFrame();
            return err;
        };
        MsAjaxError.argumentType = function (paramName, actualType, expectedType, message) {
            var displayMessage = "Sys.ArgumentTypeException: ";
            if (message) {
                displayMessage += message;
            }
            else if (actualType && expectedType) {
                displayMessage += MsAjaxString.format("Object of type '{0}' cannot be converted to type '{1}'.", actualType.getName ? actualType.getName() : actualType, expectedType.getName ? expectedType.getName() : expectedType);
            }
            else {
                displayMessage += "Object cannot be converted to the required type.";
            }
            if (paramName) {
                displayMessage += "\n" + MsAjaxString.format("Parameter name: {0}", paramName);
            }
            var err = MsAjaxError.create(displayMessage, {
                name: "Sys.ArgumentTypeException",
                paramName: paramName,
                actualType: actualType,
                expectedType: expectedType
            });
            err.popStackFrame();
            return err;
        };
        MsAjaxError.argumentUndefined = function (paramName, message) {
            var displayMessage = "Sys.ArgumentUndefinedException: " + (message ? message : "Value cannot be undefined.");
            if (paramName) {
                displayMessage += "\n" + MsAjaxString.format("Parameter name: {0}", paramName);
            }
            var err = MsAjaxError.create(displayMessage, { name: "Sys.ArgumentUndefinedException", paramName: paramName });
            err.popStackFrame();
            return err;
        };
        MsAjaxError.invalidOperation = function (message) {
            var displayMessage = "Sys.InvalidOperationException: " + (message ? message : "Operation is not valid due to the current state of the object.");
            var err = MsAjaxError.create(displayMessage, { name: 'Sys.InvalidOperationException' });
            err.popStackFrame();
            return err;
        };
        return MsAjaxError;
    })();
    OfficeExt.MsAjaxError = MsAjaxError;
    var MsAjaxString = (function () {
        function MsAjaxString() {
        }
        MsAjaxString.format = function (format) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var source = format;
            return source.replace(/{(\d+)}/gm, function (match, number) {
                var index = parseInt(number, 10);
                return args[index] === undefined ? '{' + number + '}' : args[index];
            });
        };
        MsAjaxString.startsWith = function (str, prefix) {
            return (str.substr(0, prefix.length) === prefix);
        };
        return MsAjaxString;
    })();
    OfficeExt.MsAjaxString = MsAjaxString;
    var MsAjaxDebug = (function () {
        function MsAjaxDebug() {
        }
        MsAjaxDebug.trace = function (text) {
            if (typeof Debug !== "undefined" && Debug.writeln)
                Debug.writeln(text);
            if (window.console && window.console.log)
                window.console.log(text);
            if (window.opera && window.opera.postError)
                window.opera.postError(text);
            if (window.debugService && window.debugService.trace)
                window.debugService.trace(text);
            var a = document.getElementById("TraceConsole");
            if (a && a.tagName.toUpperCase() === "TEXTAREA") {
                a.innerHTML += text + "\n";
            }
        };
        return MsAjaxDebug;
    })();
    OfficeExt.MsAjaxDebug = MsAjaxDebug;
    if (!OsfMsAjaxFactory.isMsAjaxLoaded()) {
        var registerTypeInternal = function registerTypeInternal(type, name, isClass) {
            if (type.__typeName === undefined) {
                type.__typeName = name;
            }
            if (type.__class === undefined) {
                type.__class = isClass;
            }
        };
        registerTypeInternal(Function, "Function", true);
        registerTypeInternal(Error, "Error", true);
        registerTypeInternal(Object, "Object", true);
        registerTypeInternal(String, "String", true);
        registerTypeInternal(Boolean, "Boolean", true);
        registerTypeInternal(Date, "Date", true);
        registerTypeInternal(Number, "Number", true);
        registerTypeInternal(RegExp, "RegExp", true);
        registerTypeInternal(Array, "Array", true);
        if (!Function.createCallback) {
            Function.createCallback = function Function$createCallback(method, context) {
                var e = Function._validateParams(arguments, [
                    { name: "method", type: Function },
                    { name: "context", mayBeNull: true }
                ]);
                if (e)
                    throw e;
                return function () {
                    var l = arguments.length;
                    if (l > 0) {
                        var args = [];
                        for (var i = 0; i < l; i++) {
                            args[i] = arguments[i];
                        }
                        args[l] = context;
                        return method.apply(this, args);
                    }
                    return method.call(this, context);
                };
            };
        }
        if (!Function.createDelegate) {
            Function.createDelegate = function Function$createDelegate(instance, method) {
                var e = Function._validateParams(arguments, [
                    { name: "instance", mayBeNull: true },
                    { name: "method", type: Function }
                ]);
                if (e)
                    throw e;
                return function () {
                    return method.apply(instance, arguments);
                };
            };
        }
        if (!Function._validateParams) {
            Function._validateParams = function (params, expectedParams, validateParameterCount) {
                var e, expectedLength = expectedParams.length;
                validateParameterCount = validateParameterCount || (typeof (validateParameterCount) === "undefined");
                e = Function._validateParameterCount(params, expectedParams, validateParameterCount);
                if (e) {
                    e.popStackFrame();
                    return e;
                }
                for (var i = 0, l = params.length; i < l; i++) {
                    var expectedParam = expectedParams[Math.min(i, expectedLength - 1)], paramName = expectedParam.name;
                    if (expectedParam.parameterArray) {
                        paramName += "[" + (i - expectedLength + 1) + "]";
                    }
                    else if (!validateParameterCount && (i >= expectedLength)) {
                        break;
                    }
                    e = Function._validateParameter(params[i], expectedParam, paramName);
                    if (e) {
                        e.popStackFrame();
                        return e;
                    }
                }
                return null;
            };
        }
        if (!Function._validateParameterCount) {
            Function._validateParameterCount = function (params, expectedParams, validateParameterCount) {
                var i, error, expectedLen = expectedParams.length, actualLen = params.length;
                if (actualLen < expectedLen) {
                    var minParams = expectedLen;
                    for (i = 0; i < expectedLen; i++) {
                        var param = expectedParams[i];
                        if (param.optional || param.parameterArray) {
                            minParams--;
                        }
                    }
                    if (actualLen < minParams) {
                        error = true;
                    }
                }
                else if (validateParameterCount && (actualLen > expectedLen)) {
                    error = true;
                    for (i = 0; i < expectedLen; i++) {
                        if (expectedParams[i].parameterArray) {
                            error = false;
                            break;
                        }
                    }
                }
                if (error) {
                    var e = MsAjaxError.parameterCount();
                    e.popStackFrame();
                    return e;
                }
                return null;
            };
        }
        if (!Function._validateParameter) {
            Function._validateParameter = function (param, expectedParam, paramName) {
                var e, expectedType = expectedParam.type, expectedInteger = !!expectedParam.integer, expectedDomElement = !!expectedParam.domElement, mayBeNull = !!expectedParam.mayBeNull;
                e = Function._validateParameterType(param, expectedType, expectedInteger, expectedDomElement, mayBeNull, paramName);
                if (e) {
                    e.popStackFrame();
                    return e;
                }
                var expectedElementType = expectedParam.elementType, elementMayBeNull = !!expectedParam.elementMayBeNull;
                if (expectedType === Array && typeof (param) !== "undefined" && param !== null &&
                    (expectedElementType || !elementMayBeNull)) {
                    var expectedElementInteger = !!expectedParam.elementInteger, expectedElementDomElement = !!expectedParam.elementDomElement;
                    for (var i = 0; i < param.length; i++) {
                        var elem = param[i];
                        e = Function._validateParameterType(elem, expectedElementType, expectedElementInteger, expectedElementDomElement, elementMayBeNull, paramName + "[" + i + "]");
                        if (e) {
                            e.popStackFrame();
                            return e;
                        }
                    }
                }
                return null;
            };
        }
        if (!Function._validateParameterType) {
            Function._validateParameterType = function (param, expectedType, expectedInteger, expectedDomElement, mayBeNull, paramName) {
                var e, i;
                if (typeof (param) === "undefined") {
                    if (mayBeNull) {
                        return null;
                    }
                    else {
                        e = OfficeExt.MsAjaxError.argumentUndefined(paramName);
                        e.popStackFrame();
                        return e;
                    }
                }
                if (param === null) {
                    if (mayBeNull) {
                        return null;
                    }
                    else {
                        e = OfficeExt.MsAjaxError.argumentNull(paramName);
                        e.popStackFrame();
                        return e;
                    }
                }
                if (expectedType && !OfficeExt.MsAjaxTypeHelper.isInstanceOfType(expectedType, param)) {
                    e = OfficeExt.MsAjaxError.argumentType(paramName, typeof (param), expectedType);
                    e.popStackFrame();
                    return e;
                }
                return null;
            };
        }
        if (!window.Type) {
            window.Type = Function;
        }
        if (!Type.registerNamespace) {
            Type.registerNamespace = function (ns) {
                var namespaceParts = ns.split('.');
                var currentNamespace = window;
                for (var i = 0; i < namespaceParts.length; i++) {
                    currentNamespace[namespaceParts[i]] = currentNamespace[namespaceParts[i]] || {};
                    currentNamespace = currentNamespace[namespaceParts[i]];
                }
            };
        }
        if (!Type.prototype.registerClass) {
            Type.prototype.registerClass = function (cls) { cls = {}; };
        }
        if (typeof (Sys) === "undefined") {
            Type.registerNamespace('Sys');
        }
        if (!Error.prototype.popStackFrame) {
            Error.prototype.popStackFrame = function () {
                if (arguments.length !== 0)
                    throw MsAjaxError.parameterCount();
                if (typeof (this.stack) === "undefined" || this.stack === null ||
                    typeof (this.fileName) === "undefined" || this.fileName === null ||
                    typeof (this.lineNumber) === "undefined" || this.lineNumber === null) {
                    return;
                }
                var stackFrames = this.stack.split("\n");
                var currentFrame = stackFrames[0];
                var pattern = this.fileName + ":" + this.lineNumber;
                while (typeof (currentFrame) !== "undefined" &&
                    currentFrame !== null &&
                    currentFrame.indexOf(pattern) === -1) {
                    stackFrames.shift();
                    currentFrame = stackFrames[0];
                }
                var nextFrame = stackFrames[1];
                if (typeof (nextFrame) === "undefined" || nextFrame === null) {
                    return;
                }
                var nextFrameParts = nextFrame.match(/@(.*):(\d+)$/);
                if (typeof (nextFrameParts) === "undefined" || nextFrameParts === null) {
                    return;
                }
                this.fileName = nextFrameParts[1];
                this.lineNumber = parseInt(nextFrameParts[2]);
                stackFrames.shift();
                this.stack = stackFrames.join("\n");
            };
        }
        OsfMsAjaxFactory.msAjaxError = MsAjaxError;
        OsfMsAjaxFactory.msAjaxString = MsAjaxString;
        OsfMsAjaxFactory.msAjaxDebug = MsAjaxDebug;
    }
})(OfficeExt || (OfficeExt = {}));
OSF.OUtil.setNamespace("Microsoft", window);
OSF.OUtil.setNamespace("Office", Microsoft);
OSF.OUtil.setNamespace("Common", Microsoft.Office);
OSF.SerializerVersion = {
    MsAjax: 0,
    Browser: 1
};
var OfficeExt;
(function (OfficeExt) {
    function appSpecificCheckOriginFunction(url, eventObj, messageObj, checkOriginFunction) {
        return true;
    }
    ;
    OfficeExt.appSpecificCheckOrigin = appSpecificCheckOriginFunction;
})(OfficeExt || (OfficeExt = {}));
Microsoft.Office.Common.InvokeType = { "async": 0,
    "sync": 1,
    "asyncRegisterEvent": 2,
    "asyncUnregisterEvent": 3,
    "syncRegisterEvent": 4,
    "syncUnregisterEvent": 5
};
Microsoft.Office.Common.InvokeResultCode = {
    "noError": 0,
    "errorInRequest": -1,
    "errorHandlingRequest": -2,
    "errorInResponse": -3,
    "errorHandlingResponse": -4,
    "errorHandlingRequestAccessDenied": -5,
    "errorHandlingMethodCallTimedout": -6
};
Microsoft.Office.Common.MessageType = { "request": 0,
    "response": 1
};
Microsoft.Office.Common.ActionType = { "invoke": 0,
    "registerEvent": 1,
    "unregisterEvent": 2 };
Microsoft.Office.Common.ResponseType = { "forCalling": 0,
    "forEventing": 1
};
Microsoft.Office.Common.MethodObject = function Microsoft_Office_Common_MethodObject(method, invokeType, blockingOthers) {
    this._method = method;
    this._invokeType = invokeType;
    this._blockingOthers = blockingOthers;
};
Microsoft.Office.Common.MethodObject.prototype = {
    getMethod: function Microsoft_Office_Common_MethodObject$getMethod() {
        return this._method;
    },
    getInvokeType: function Microsoft_Office_Common_MethodObject$getInvokeType() {
        return this._invokeType;
    },
    getBlockingFlag: function Microsoft_Office_Common_MethodObject$getBlockingFlag() {
        return this._blockingOthers;
    }
};
Microsoft.Office.Common.EventMethodObject = function Microsoft_Office_Common_EventMethodObject(registerMethodObject, unregisterMethodObject) {
    this._registerMethodObject = registerMethodObject;
    this._unregisterMethodObject = unregisterMethodObject;
};
Microsoft.Office.Common.EventMethodObject.prototype = {
    getRegisterMethodObject: function Microsoft_Office_Common_EventMethodObject$getRegisterMethodObject() {
        return this._registerMethodObject;
    },
    getUnregisterMethodObject: function Microsoft_Office_Common_EventMethodObject$getUnregisterMethodObject() {
        return this._unregisterMethodObject;
    }
};
Microsoft.Office.Common.ServiceEndPoint = function Microsoft_Office_Common_ServiceEndPoint(serviceEndPointId) {
    var e = Function._validateParams(arguments, [
        { name: "serviceEndPointId", type: String, mayBeNull: false }
    ]);
    if (e)
        throw e;
    this._methodObjectList = {};
    this._eventHandlerProxyList = {};
    this._Id = serviceEndPointId;
    this._conversations = {};
    this._policyManager = null;
    this._appDomains = {};
    this._onHandleRequestError = null;
};
Microsoft.Office.Common.ServiceEndPoint.prototype = {
    registerMethod: function Microsoft_Office_Common_ServiceEndPoint$registerMethod(methodName, method, invokeType, blockingOthers) {
        var e = Function._validateParams(arguments, [{ name: "methodName", type: String, mayBeNull: false },
            { name: "method", type: Function, mayBeNull: false },
            { name: "invokeType", type: Number, mayBeNull: false },
            { name: "blockingOthers", type: Boolean, mayBeNull: false }
        ]);
        if (e)
            throw e;
        if (invokeType !== Microsoft.Office.Common.InvokeType.async
            && invokeType !== Microsoft.Office.Common.InvokeType.sync) {
            throw OsfMsAjaxFactory.msAjaxError.argument("invokeType");
        }
        var methodObject = new Microsoft.Office.Common.MethodObject(method, invokeType, blockingOthers);
        this._methodObjectList[methodName] = methodObject;
    },
    unregisterMethod: function Microsoft_Office_Common_ServiceEndPoint$unregisterMethod(methodName) {
        var e = Function._validateParams(arguments, [
            { name: "methodName", type: String, mayBeNull: false }
        ]);
        if (e)
            throw e;
        delete this._methodObjectList[methodName];
    },
    registerEvent: function Microsoft_Office_Common_ServiceEndPoint$registerEvent(eventName, registerMethod, unregisterMethod) {
        var e = Function._validateParams(arguments, [{ name: "eventName", type: String, mayBeNull: false },
            { name: "registerMethod", type: Function, mayBeNull: false },
            { name: "unregisterMethod", type: Function, mayBeNull: false }
        ]);
        if (e)
            throw e;
        var methodObject = new Microsoft.Office.Common.EventMethodObject(new Microsoft.Office.Common.MethodObject(registerMethod, Microsoft.Office.Common.InvokeType.syncRegisterEvent, false), new Microsoft.Office.Common.MethodObject(unregisterMethod, Microsoft.Office.Common.InvokeType.syncUnregisterEvent, false));
        this._methodObjectList[eventName] = methodObject;
    },
    registerEventEx: function Microsoft_Office_Common_ServiceEndPoint$registerEventEx(eventName, registerMethod, registerMethodInvokeType, unregisterMethod, unregisterMethodInvokeType) {
        var e = Function._validateParams(arguments, [{ name: "eventName", type: String, mayBeNull: false },
            { name: "registerMethod", type: Function, mayBeNull: false },
            { name: "registerMethodInvokeType", type: Number, mayBeNull: false },
            { name: "unregisterMethod", type: Function, mayBeNull: false },
            { name: "unregisterMethodInvokeType", type: Number, mayBeNull: false }
        ]);
        if (e)
            throw e;
        var methodObject = new Microsoft.Office.Common.EventMethodObject(new Microsoft.Office.Common.MethodObject(registerMethod, registerMethodInvokeType, false), new Microsoft.Office.Common.MethodObject(unregisterMethod, unregisterMethodInvokeType, false));
        this._methodObjectList[eventName] = methodObject;
    },
    unregisterEvent: function (eventName) {
        var e = Function._validateParams(arguments, [
            { name: "eventName", type: String, mayBeNull: false }
        ]);
        if (e)
            throw e;
        this.unregisterMethod(eventName);
    },
    registerConversation: function Microsoft_Office_Common_ServiceEndPoint$registerConversation(conversationId, conversationUrl, appDomains, serializerVersion) {
        var e = Function._validateParams(arguments, [
            { name: "conversationId", type: String, mayBeNull: false },
            { name: "conversationUrl", type: String, mayBeNull: false, optional: true },
            { name: "appDomains", type: Object, mayBeNull: true, optional: true },
            { name: "serializerVersion", type: Number, mayBeNull: true, optional: true }
        ]);
        if (e)
            throw e;
        ;
        if (appDomains) {
            if (!(appDomains instanceof Array)) {
                throw OsfMsAjaxFactory.msAjaxError.argument("appDomains");
            }
            this._appDomains[conversationId] = appDomains;
        }
        this._conversations[conversationId] = { url: conversationUrl, serializerVersion: serializerVersion };
    },
    unregisterConversation: function Microsoft_Office_Common_ServiceEndPoint$unregisterConversation(conversationId) {
        var e = Function._validateParams(arguments, [
            { name: "conversationId", type: String, mayBeNull: false }
        ]);
        if (e)
            throw e;
        delete this._conversations[conversationId];
    },
    setPolicyManager: function Microsoft_Office_Common_ServiceEndPoint$setPolicyManager(policyManager) {
        var e = Function._validateParams(arguments, [
            { name: "policyManager", type: Object, mayBeNull: false }
        ]);
        if (e)
            throw e;
        if (!policyManager.checkPermission) {
            throw OsfMsAjaxFactory.msAjaxError.argument("policyManager");
        }
        this._policyManager = policyManager;
    },
    getPolicyManager: function Microsoft_Office_Common_ServiceEndPoint$getPolicyManager() {
        return this._policyManager;
    },
    dispose: function Microsoft_Office_Common_ServiceEndPoint$dispose() {
        this._methodObjectList = null;
        this._eventHandlerProxyList = null;
        this._Id = null;
        this._conversations = null;
        this._policyManager = null;
        this._appDomains = null;
        this._onHandleRequestError = null;
    }
};
Microsoft.Office.Common.ClientEndPoint = function Microsoft_Office_Common_ClientEndPoint(conversationId, targetWindow, targetUrl, serializerVersion) {
    var e = Function._validateParams(arguments, [
        { name: "conversationId", type: String, mayBeNull: false },
        { name: "targetWindow", mayBeNull: false },
        { name: "targetUrl", type: String, mayBeNull: false },
        { name: "serializerVersion", type: Number, mayBeNull: true, optional: true }
    ]);
    if (e)
        throw e;
    try {
        if (!targetWindow.postMessage) {
            throw OsfMsAjaxFactory.msAjaxError.argument("targetWindow");
        }
    }
    catch (ex) {
        if (!Object.prototype.hasOwnProperty.call(targetWindow, "postMessage")) {
            throw OsfMsAjaxFactory.msAjaxError.argument("targetWindow");
        }
    }
    this._conversationId = conversationId;
    this._targetWindow = targetWindow;
    this._targetUrl = targetUrl;
    this._callingIndex = 0;
    this._callbackList = {};
    this._eventHandlerList = {};
    if (serializerVersion != null) {
        this._serializerVersion = serializerVersion;
    }
    else {
        this._serializerVersion = OSF.SerializerVersion.Browser;
    }
};
Microsoft.Office.Common.ClientEndPoint.prototype = {
    invoke: function Microsoft_Office_Common_ClientEndPoint$invoke(targetMethodName, callback, param) {
        var e = Function._validateParams(arguments, [{ name: "targetMethodName", type: String, mayBeNull: false },
            { name: "callback", type: Function, mayBeNull: true },
            { name: "param", mayBeNull: true }
        ]);
        if (e)
            throw e;
        var correlationId = this._callingIndex++;
        var now = new Date();
        var callbackEntry = { "callback": callback, "createdOn": now.getTime() };
        if (param && typeof param === "object" && typeof param.__timeout__ === "number") {
            callbackEntry.timeout = param.__timeout__;
            delete param.__timeout__;
        }
        this._callbackList[correlationId] = callbackEntry;
        try {
            var callRequest = new Microsoft.Office.Common.Request(targetMethodName, Microsoft.Office.Common.ActionType.invoke, this._conversationId, correlationId, param);
            var msg = Microsoft.Office.Common.MessagePackager.envelope(callRequest, this._serializerVersion);
            this._targetWindow.postMessage(msg, this._targetUrl);
            Microsoft.Office.Common.XdmCommunicationManager._startMethodTimeoutTimer();
        }
        catch (ex) {
            try {
                if (callback !== null)
                    callback(Microsoft.Office.Common.InvokeResultCode.errorInRequest, ex);
            }
            finally {
                delete this._callbackList[correlationId];
            }
        }
    },
    registerForEvent: function Microsoft_Office_Common_ClientEndPoint$registerForEvent(targetEventName, eventHandler, callback, data) {
        var e = Function._validateParams(arguments, [{ name: "targetEventName", type: String, mayBeNull: false },
            { name: "eventHandler", type: Function, mayBeNull: false },
            { name: "callback", type: Function, mayBeNull: true },
            { name: "data", mayBeNull: true, optional: true }
        ]);
        if (e)
            throw e;
        var correlationId = this._callingIndex++;
        var now = new Date();
        this._callbackList[correlationId] = { "callback": callback, "createdOn": now.getTime() };
        try {
            var callRequest = new Microsoft.Office.Common.Request(targetEventName, Microsoft.Office.Common.ActionType.registerEvent, this._conversationId, correlationId, data);
            var msg = Microsoft.Office.Common.MessagePackager.envelope(callRequest, this._serializerVersion);
            this._targetWindow.postMessage(msg, this._targetUrl);
            Microsoft.Office.Common.XdmCommunicationManager._startMethodTimeoutTimer();
            this._eventHandlerList[targetEventName] = eventHandler;
        }
        catch (ex) {
            try {
                if (callback !== null) {
                    callback(Microsoft.Office.Common.InvokeResultCode.errorInRequest, ex);
                }
            }
            finally {
                delete this._callbackList[correlationId];
            }
        }
    },
    unregisterForEvent: function Microsoft_Office_Common_ClientEndPoint$unregisterForEvent(targetEventName, callback, data) {
        var e = Function._validateParams(arguments, [{ name: "targetEventName", type: String, mayBeNull: false },
            { name: "callback", type: Function, mayBeNull: true },
            { name: "data", mayBeNull: true, optional: true }
        ]);
        if (e)
            throw e;
        var correlationId = this._callingIndex++;
        var now = new Date();
        this._callbackList[correlationId] = { "callback": callback, "createdOn": now.getTime() };
        try {
            var callRequest = new Microsoft.Office.Common.Request(targetEventName, Microsoft.Office.Common.ActionType.unregisterEvent, this._conversationId, correlationId, data);
            var msg = Microsoft.Office.Common.MessagePackager.envelope(callRequest, this._serializerVersion);
            this._targetWindow.postMessage(msg, this._targetUrl);
            Microsoft.Office.Common.XdmCommunicationManager._startMethodTimeoutTimer();
        }
        catch (ex) {
            try {
                if (callback !== null) {
                    callback(Microsoft.Office.Common.InvokeResultCode.errorInRequest, ex);
                }
            }
            finally {
                delete this._callbackList[correlationId];
            }
        }
        finally {
            delete this._eventHandlerList[targetEventName];
        }
    }
};
Microsoft.Office.Common.XdmCommunicationManager = (function () {
    var _invokerQueue = [];
    var _lastMessageProcessTime = null;
    var _messageProcessingTimer = null;
    var _processInterval = 10;
    var _blockingFlag = false;
    var _methodTimeoutTimer = null;
    var _methodTimeoutProcessInterval = 2000;
    var _methodTimeoutDefault = 65000;
    var _methodTimeout = _methodTimeoutDefault;
    var _serviceEndPoints = {};
    var _clientEndPoints = {};
    var _initialized = false;
    function _lookupServiceEndPoint(conversationId) {
        for (var id in _serviceEndPoints) {
            if (_serviceEndPoints[id]._conversations[conversationId]) {
                return _serviceEndPoints[id];
            }
        }
        OsfMsAjaxFactory.msAjaxDebug.trace("Unknown conversation Id.");
        throw OsfMsAjaxFactory.msAjaxError.argument("conversationId");
    }
    ;
    function _lookupClientEndPoint(conversationId) {
        var clientEndPoint = _clientEndPoints[conversationId];
        if (!clientEndPoint) {
            OsfMsAjaxFactory.msAjaxDebug.trace("Unknown conversation Id.");
        }
        return clientEndPoint;
    }
    ;
    function _lookupMethodObject(serviceEndPoint, messageObject) {
        var methodOrEventMethodObject = serviceEndPoint._methodObjectList[messageObject._actionName];
        if (!methodOrEventMethodObject) {
            OsfMsAjaxFactory.msAjaxDebug.trace("The specified method is not registered on service endpoint:" + messageObject._actionName);
            throw OsfMsAjaxFactory.msAjaxError.argument("messageObject");
        }
        var methodObject = null;
        if (messageObject._actionType === Microsoft.Office.Common.ActionType.invoke) {
            methodObject = methodOrEventMethodObject;
        }
        else if (messageObject._actionType === Microsoft.Office.Common.ActionType.registerEvent) {
            methodObject = methodOrEventMethodObject.getRegisterMethodObject();
        }
        else {
            methodObject = methodOrEventMethodObject.getUnregisterMethodObject();
        }
        return methodObject;
    }
    ;
    function _enqueInvoker(invoker) {
        _invokerQueue.push(invoker);
    }
    ;
    function _dequeInvoker() {
        if (_messageProcessingTimer !== null) {
            if (!_blockingFlag) {
                if (_invokerQueue.length > 0) {
                    var invoker = _invokerQueue.shift();
                    _executeCommand(invoker);
                }
                else {
                    clearInterval(_messageProcessingTimer);
                    _messageProcessingTimer = null;
                }
            }
        }
        else {
            OsfMsAjaxFactory.msAjaxDebug.trace("channel is not ready.");
        }
    }
    ;
    function _executeCommand(invoker) {
        _blockingFlag = invoker.getInvokeBlockingFlag();
        invoker.invoke();
        _lastMessageProcessTime = (new Date()).getTime();
    }
    ;
    function _checkMethodTimeout() {
        if (_methodTimeoutTimer) {
            var clientEndPoint;
            var methodCallsNotTimedout = 0;
            var now = new Date();
            var timeoutValue;
            for (var conversationId in _clientEndPoints) {
                clientEndPoint = _clientEndPoints[conversationId];
                for (var correlationId in clientEndPoint._callbackList) {
                    var callbackEntry = clientEndPoint._callbackList[correlationId];
                    timeoutValue = callbackEntry.timeout ? callbackEntry.timeout : _methodTimeout;
                    if (timeoutValue >= 0 && Math.abs(now.getTime() - callbackEntry.createdOn) >= timeoutValue) {
                        try {
                            if (callbackEntry.callback) {
                                callbackEntry.callback(Microsoft.Office.Common.InvokeResultCode.errorHandlingMethodCallTimedout, null);
                            }
                        }
                        finally {
                            delete clientEndPoint._callbackList[correlationId];
                        }
                    }
                    else {
                        methodCallsNotTimedout++;
                    }
                    ;
                }
            }
            if (methodCallsNotTimedout === 0) {
                clearInterval(_methodTimeoutTimer);
                _methodTimeoutTimer = null;
            }
        }
        else {
            OsfMsAjaxFactory.msAjaxDebug.trace("channel is not ready.");
        }
    }
    ;
    function _postCallbackHandler() {
        _blockingFlag = false;
    }
    ;
    function _registerListener(listener) {
        if (window.addEventListener) {
            window.addEventListener("message", listener, false);
        }
        else if ((navigator.userAgent.indexOf("MSIE") > -1) && window.attachEvent) {
            window.attachEvent("onmessage", listener);
        }
        else {
            OsfMsAjaxFactory.msAjaxDebug.trace("Browser doesn't support the required API.");
            throw OsfMsAjaxFactory.msAjaxError.argument("Browser");
        }
    }
    ;
    function _checkOrigin(url, origin) {
        var res = false;
        if (url === true) {
            return true;
        }
        if (!url || !origin || !url.length || !origin.length) {
            return res;
        }
        var url_parser, org_parser;
        url_parser = document.createElement('a');
        org_parser = document.createElement('a');
        url_parser.href = url;
        org_parser.href = origin;
        res = _urlCompare(url_parser, org_parser);
        delete url_parser, org_parser;
        return res;
    }
    function _checkOriginWithAppDomains(allowed_domains, origin) {
        var res = false;
        if (!origin || !origin.length || !(allowed_domains) || !(allowed_domains instanceof Array) || !allowed_domains.length) {
            return res;
        }
        var org_parser = document.createElement('a');
        var app_domain_parser = document.createElement('a');
        org_parser.href = origin;
        for (var i = 0; i < allowed_domains.length && !res; i++) {
            if (allowed_domains[i].indexOf("://") !== -1) {
                app_domain_parser.href = allowed_domains[i];
                res = _urlCompare(org_parser, app_domain_parser);
            }
        }
        delete org_parser, app_domain_parser;
        return res;
    }
    function _urlCompare(url_parser1, url_parser2) {
        return ((url_parser1.hostname == url_parser2.hostname) &&
            (url_parser1.protocol == url_parser2.protocol) &&
            (url_parser1.port == url_parser2.port));
    }
    function _receive(e) {
        if (!OSF) {
            return;
        }
        if (e.data != '') {
            var messageObject;
            var serializerVersion = OSF.SerializerVersion.Browser;
            var serializedMessage = e.data;
            try {
                messageObject = Microsoft.Office.Common.MessagePackager.unenvelope(serializedMessage, OSF.SerializerVersion.Browser);
                serializerVersion = messageObject._serializerVersion != null ? messageObject._serializerVersion : serializerVersion;
            }
            catch (ex) {
                return;
            }
            if (messageObject._messageType === Microsoft.Office.Common.MessageType.request) {
                var requesterUrl = (e.origin == null || e.origin == "null") ? messageObject._origin : e.origin;
                try {
                    var serviceEndPoint = _lookupServiceEndPoint(messageObject._conversationId);
                    ;
                    var conversation = serviceEndPoint._conversations[messageObject._conversationId];
                    serializerVersion = conversation.serializerVersion != null ? conversation.serializerVersion : serializerVersion;
                    ;
                    if (!_checkOrigin(conversation.url, e.origin) && !_checkOriginWithAppDomains(serviceEndPoint._appDomains[messageObject._conversationId], e.origin)) {
                        throw "Failed origin check";
                    }
                    var policyManager = serviceEndPoint.getPolicyManager();
                    if (policyManager && !policyManager.checkPermission(messageObject._conversationId, messageObject._actionName, messageObject._data)) {
                        throw "Access Denied";
                    }
                    var methodObject = _lookupMethodObject(serviceEndPoint, messageObject);
                    var invokeCompleteCallback = new Microsoft.Office.Common.InvokeCompleteCallback(e.source, requesterUrl, messageObject._actionName, messageObject._conversationId, messageObject._correlationId, _postCallbackHandler, serializerVersion);
                    var invoker = new Microsoft.Office.Common.Invoker(methodObject, messageObject._data, invokeCompleteCallback, serviceEndPoint._eventHandlerProxyList, messageObject._conversationId, messageObject._actionName, serializerVersion);
                    var shouldEnque = true;
                    if (_messageProcessingTimer == null) {
                        if ((_lastMessageProcessTime == null || (new Date()).getTime() - _lastMessageProcessTime > _processInterval) && !_blockingFlag) {
                            _executeCommand(invoker);
                            shouldEnque = false;
                        }
                        else {
                            _messageProcessingTimer = setInterval(_dequeInvoker, _processInterval);
                        }
                    }
                    if (shouldEnque) {
                        _enqueInvoker(invoker);
                    }
                }
                catch (ex) {
                    if (serviceEndPoint && serviceEndPoint._onHandleRequestError) {
                        serviceEndPoint._onHandleRequestError(messageObject, ex);
                    }
                    var errorCode = Microsoft.Office.Common.InvokeResultCode.errorHandlingRequest;
                    if (ex == "Access Denied") {
                        errorCode = Microsoft.Office.Common.InvokeResultCode.errorHandlingRequestAccessDenied;
                    }
                    var callResponse = new Microsoft.Office.Common.Response(messageObject._actionName, messageObject._conversationId, messageObject._correlationId, errorCode, Microsoft.Office.Common.ResponseType.forCalling, ex);
                    var envelopedResult = Microsoft.Office.Common.MessagePackager.envelope(callResponse, serializerVersion);
                    if (e.source && e.source.postMessage) {
                        e.source.postMessage(envelopedResult, requesterUrl);
                    }
                }
            }
            else if (messageObject._messageType === Microsoft.Office.Common.MessageType.response) {
                var clientEndPoint = _lookupClientEndPoint(messageObject._conversationId);
                if (!clientEndPoint) {
                    return;
                }
                clientEndPoint._serializerVersion = serializerVersion;
                ;
                if (!_checkOrigin(clientEndPoint._targetUrl, e.origin)) {
                    throw "Failed orgin check";
                }
                if (messageObject._responseType === Microsoft.Office.Common.ResponseType.forCalling) {
                    var callbackEntry = clientEndPoint._callbackList[messageObject._correlationId];
                    if (callbackEntry) {
                        try {
                            if (callbackEntry.callback)
                                callbackEntry.callback(messageObject._errorCode, messageObject._data);
                        }
                        finally {
                            delete clientEndPoint._callbackList[messageObject._correlationId];
                        }
                    }
                }
                else {
                    var eventhandler = clientEndPoint._eventHandlerList[messageObject._actionName];
                    if (eventhandler !== undefined && eventhandler !== null) {
                        eventhandler(messageObject._data);
                    }
                }
            }
            else {
                return;
            }
        }
    }
    ;
    function _initialize() {
        if (!_initialized) {
            _registerListener(_receive);
            _initialized = true;
        }
    }
    ;
    return {
        connect: function Microsoft_Office_Common_XdmCommunicationManager$connect(conversationId, targetWindow, targetUrl, serializerVersion) {
            var clientEndPoint = _clientEndPoints[conversationId];
            if (!clientEndPoint) {
                _initialize();
                clientEndPoint = new Microsoft.Office.Common.ClientEndPoint(conversationId, targetWindow, targetUrl, serializerVersion);
                _clientEndPoints[conversationId] = clientEndPoint;
            }
            return clientEndPoint;
        },
        getClientEndPoint: function Microsoft_Office_Common_XdmCommunicationManager$getClientEndPoint(conversationId) {
            var e = Function._validateParams(arguments, [
                { name: "conversationId", type: String, mayBeNull: false }
            ]);
            if (e)
                throw e;
            return _clientEndPoints[conversationId];
        },
        createServiceEndPoint: function Microsoft_Office_Common_XdmCommunicationManager$createServiceEndPoint(serviceEndPointId) {
            _initialize();
            var serviceEndPoint = new Microsoft.Office.Common.ServiceEndPoint(serviceEndPointId);
            _serviceEndPoints[serviceEndPointId] = serviceEndPoint;
            return serviceEndPoint;
        },
        getServiceEndPoint: function Microsoft_Office_Common_XdmCommunicationManager$getServiceEndPoint(serviceEndPointId) {
            var e = Function._validateParams(arguments, [
                { name: "serviceEndPointId", type: String, mayBeNull: false }
            ]);
            if (e)
                throw e;
            return _serviceEndPoints[serviceEndPointId];
        },
        deleteClientEndPoint: function Microsoft_Office_Common_XdmCommunicationManager$deleteClientEndPoint(conversationId) {
            var e = Function._validateParams(arguments, [
                { name: "conversationId", type: String, mayBeNull: false }
            ]);
            if (e)
                throw e;
            delete _clientEndPoints[conversationId];
        },
        deleteServiceEndPoint: function Microsoft_Office_Common_XdmCommunicationManager$deleteServiceEndPoint(serviceEndPointId) {
            var e = Function._validateParams(arguments, [
                { name: "serviceEndPointId", type: String, mayBeNull: false }
            ]);
            if (e)
                throw e;
            delete _serviceEndPoints[serviceEndPointId];
        },
        checkUrlWithAppDomains: function Microsoft_Office_Common_XdmCommunicationManager$_checkUrlWithAppDomains(appDomains, origin) {
            return _checkOriginWithAppDomains(appDomains, origin);
        },
        _setMethodTimeout: function Microsoft_Office_Common_XdmCommunicationManager$_setMethodTimeout(methodTimeout) {
            var e = Function._validateParams(arguments, [
                { name: "methodTimeout", type: Number, mayBeNull: false }
            ]);
            if (e)
                throw e;
            _methodTimeout = (methodTimeout <= 0) ? _methodTimeoutDefault : methodTimeout;
        },
        _startMethodTimeoutTimer: function Microsoft_Office_Common_XdmCommunicationManager$_startMethodTimeoutTimer() {
            if (!_methodTimeoutTimer) {
                _methodTimeoutTimer = setInterval(_checkMethodTimeout, _methodTimeoutProcessInterval);
            }
        }
    };
})();
Microsoft.Office.Common.Message = function Microsoft_Office_Common_Message(messageType, actionName, conversationId, correlationId, data) {
    var e = Function._validateParams(arguments, [{ name: "messageType", type: Number, mayBeNull: false },
        { name: "actionName", type: String, mayBeNull: false },
        { name: "conversationId", type: String, mayBeNull: false },
        { name: "correlationId", mayBeNull: false },
        { name: "data", mayBeNull: true, optional: true }
    ]);
    if (e)
        throw e;
    this._messageType = messageType;
    this._actionName = actionName;
    this._conversationId = conversationId;
    this._correlationId = correlationId;
    this._origin = window.location.href;
    if (typeof data == "undefined") {
        this._data = null;
    }
    else {
        this._data = data;
    }
};
Microsoft.Office.Common.Message.prototype = {
    getActionName: function Microsoft_Office_Common_Message$getActionName() {
        return this._actionName;
    },
    getConversationId: function Microsoft_Office_Common_Message$getConversationId() {
        return this._conversationId;
    },
    getCorrelationId: function Microsoft_Office_Common_Message$getCorrelationId() {
        return this._correlationId;
    },
    getOrigin: function Microsoft_Office_Common_Message$getOrigin() {
        return this._origin;
    },
    getData: function Microsoft_Office_Common_Message$getData() {
        return this._data;
    },
    getMessageType: function Microsoft_Office_Common_Message$getMessageType() {
        return this._messageType;
    }
};
Microsoft.Office.Common.Request = function Microsoft_Office_Common_Request(actionName, actionType, conversationId, correlationId, data) {
    Microsoft.Office.Common.Request.uber.constructor.call(this, Microsoft.Office.Common.MessageType.request, actionName, conversationId, correlationId, data);
    this._actionType = actionType;
};
OSF.OUtil.extend(Microsoft.Office.Common.Request, Microsoft.Office.Common.Message);
Microsoft.Office.Common.Request.prototype.getActionType = function Microsoft_Office_Common_Request$getActionType() {
    return this._actionType;
};
Microsoft.Office.Common.Response = function Microsoft_Office_Common_Response(actionName, conversationId, correlationId, errorCode, responseType, data) {
    Microsoft.Office.Common.Response.uber.constructor.call(this, Microsoft.Office.Common.MessageType.response, actionName, conversationId, correlationId, data);
    this._errorCode = errorCode;
    this._responseType = responseType;
};
OSF.OUtil.extend(Microsoft.Office.Common.Response, Microsoft.Office.Common.Message);
Microsoft.Office.Common.Response.prototype.getErrorCode = function Microsoft_Office_Common_Response$getErrorCode() {
    return this._errorCode;
};
Microsoft.Office.Common.Response.prototype.getResponseType = function Microsoft_Office_Common_Response$getResponseType() {
    return this._responseType;
};
Microsoft.Office.Common.MessagePackager = {
    envelope: function Microsoft_Office_Common_MessagePackager$envelope(messageObject, serializerVersion) {
        if (typeof (messageObject) === "object") {
            messageObject._serializerVersion = OSF.SerializerVersion.Browser;
        }
        return JSON.stringify(messageObject);
    },
    unenvelope: function Microsoft_Office_Common_MessagePackager$unenvelope(messageObject, serializerVersion) {
        return JSON.parse(messageObject);
    }
};
Microsoft.Office.Common.ResponseSender = function Microsoft_Office_Common_ResponseSender(requesterWindow, requesterUrl, actionName, conversationId, correlationId, responseType, serializerVersion) {
    var e = Function._validateParams(arguments, [{ name: "requesterWindow", mayBeNull: false },
        { name: "requesterUrl", type: String, mayBeNull: false },
        { name: "actionName", type: String, mayBeNull: false },
        { name: "conversationId", type: String, mayBeNull: false },
        { name: "correlationId", mayBeNull: false },
        { name: "responsetype", type: Number, maybeNull: false },
        { name: "serializerVersion", type: Number, maybeNull: true, optional: true }
    ]);
    if (e)
        throw e;
    this._requesterWindow = requesterWindow;
    this._requesterUrl = requesterUrl;
    this._actionName = actionName;
    this._conversationId = conversationId;
    this._correlationId = correlationId;
    this._invokeResultCode = Microsoft.Office.Common.InvokeResultCode.noError;
    this._responseType = responseType;
    var me = this;
    this._send = function (result) {
        try {
            var response = new Microsoft.Office.Common.Response(me._actionName, me._conversationId, me._correlationId, me._invokeResultCode, me._responseType, result);
            var envelopedResult = Microsoft.Office.Common.MessagePackager.envelope(response, serializerVersion);
            me._requesterWindow.postMessage(envelopedResult, me._requesterUrl);
            ;
        }
        catch (ex) {
            OsfMsAjaxFactory.msAjaxDebug.trace("ResponseSender._send error:" + ex.message);
        }
    };
};
Microsoft.Office.Common.ResponseSender.prototype = {
    getRequesterWindow: function Microsoft_Office_Common_ResponseSender$getRequesterWindow() {
        return this._requesterWindow;
    },
    getRequesterUrl: function Microsoft_Office_Common_ResponseSender$getRequesterUrl() {
        return this._requesterUrl;
    },
    getActionName: function Microsoft_Office_Common_ResponseSender$getActionName() {
        return this._actionName;
    },
    getConversationId: function Microsoft_Office_Common_ResponseSender$getConversationId() {
        return this._conversationId;
    },
    getCorrelationId: function Microsoft_Office_Common_ResponseSender$getCorrelationId() {
        return this._correlationId;
    },
    getSend: function Microsoft_Office_Common_ResponseSender$getSend() {
        return this._send;
    },
    setResultCode: function Microsoft_Office_Common_ResponseSender$setResultCode(resultCode) {
        this._invokeResultCode = resultCode;
    }
};
Microsoft.Office.Common.InvokeCompleteCallback = function Microsoft_Office_Common_InvokeCompleteCallback(requesterWindow, requesterUrl, actionName, conversationId, correlationId, postCallbackHandler, serializerVersion) {
    Microsoft.Office.Common.InvokeCompleteCallback.uber.constructor.call(this, requesterWindow, requesterUrl, actionName, conversationId, correlationId, Microsoft.Office.Common.ResponseType.forCalling, serializerVersion);
    this._postCallbackHandler = postCallbackHandler;
    var me = this;
    this._send = function (result, responseCode) {
        if (responseCode != undefined) {
            me._invokeResultCode = responseCode;
        }
        try {
            var response = new Microsoft.Office.Common.Response(me._actionName, me._conversationId, me._correlationId, me._invokeResultCode, me._responseType, result);
            var envelopedResult = Microsoft.Office.Common.MessagePackager.envelope(response, serializerVersion);
            me._requesterWindow.postMessage(envelopedResult, me._requesterUrl);
            me._postCallbackHandler();
        }
        catch (ex) {
            OsfMsAjaxFactory.msAjaxDebug.trace("InvokeCompleteCallback._send error:" + ex.message);
        }
    };
};
OSF.OUtil.extend(Microsoft.Office.Common.InvokeCompleteCallback, Microsoft.Office.Common.ResponseSender);
Microsoft.Office.Common.Invoker = function Microsoft_Office_Common_Invoker(methodObject, paramValue, invokeCompleteCallback, eventHandlerProxyList, conversationId, eventName, serializerVersion) {
    var e = Function._validateParams(arguments, [
        { name: "methodObject", mayBeNull: false },
        { name: "paramValue", mayBeNull: true },
        { name: "invokeCompleteCallback", mayBeNull: false },
        { name: "eventHandlerProxyList", mayBeNull: true },
        { name: "conversationId", type: String, mayBeNull: false },
        { name: "eventName", type: String, mayBeNull: false },
        { name: "serializerVersion", type: Number, mayBeNull: true, optional: true }
    ]);
    if (e)
        throw e;
    this._methodObject = methodObject;
    this._param = paramValue;
    this._invokeCompleteCallback = invokeCompleteCallback;
    this._eventHandlerProxyList = eventHandlerProxyList;
    this._conversationId = conversationId;
    this._eventName = eventName;
    this._serializerVersion = serializerVersion;
};
Microsoft.Office.Common.Invoker.prototype = {
    invoke: function Microsoft_Office_Common_Invoker$invoke() {
        try {
            var result;
            switch (this._methodObject.getInvokeType()) {
                case Microsoft.Office.Common.InvokeType.async:
                    this._methodObject.getMethod()(this._param, this._invokeCompleteCallback.getSend());
                    break;
                case Microsoft.Office.Common.InvokeType.sync:
                    result = this._methodObject.getMethod()(this._param);
                    this._invokeCompleteCallback.getSend()(result);
                    break;
                case Microsoft.Office.Common.InvokeType.syncRegisterEvent:
                    var eventHandlerProxy = this._createEventHandlerProxyObject(this._invokeCompleteCallback);
                    result = this._methodObject.getMethod()(eventHandlerProxy.getSend(), this._param);
                    this._eventHandlerProxyList[this._conversationId + this._eventName] = eventHandlerProxy.getSend();
                    this._invokeCompleteCallback.getSend()(result);
                    break;
                case Microsoft.Office.Common.InvokeType.syncUnregisterEvent:
                    var eventHandler = this._eventHandlerProxyList[this._conversationId + this._eventName];
                    result = this._methodObject.getMethod()(eventHandler, this._param);
                    delete this._eventHandlerProxyList[this._conversationId + this._eventName];
                    this._invokeCompleteCallback.getSend()(result);
                    break;
                case Microsoft.Office.Common.InvokeType.asyncRegisterEvent:
                    var eventHandlerProxyAsync = this._createEventHandlerProxyObject(this._invokeCompleteCallback);
                    this._methodObject.getMethod()(eventHandlerProxyAsync.getSend(), this._invokeCompleteCallback.getSend(), this._param);
                    this._eventHandlerProxyList[this._callerId + this._eventName] = eventHandlerProxyAsync.getSend();
                    break;
                case Microsoft.Office.Common.InvokeType.asyncUnregisterEvent:
                    var eventHandlerAsync = this._eventHandlerProxyList[this._callerId + this._eventName];
                    this._methodObject.getMethod()(eventHandlerAsync, this._invokeCompleteCallback.getSend(), this._param);
                    delete this._eventHandlerProxyList[this._callerId + this._eventName];
                    break;
                default:
                    break;
            }
        }
        catch (ex) {
            this._invokeCompleteCallback.setResultCode(Microsoft.Office.Common.InvokeResultCode.errorInResponse);
            this._invokeCompleteCallback.getSend()(ex);
        }
    },
    getInvokeBlockingFlag: function Microsoft_Office_Common_Invoker$getInvokeBlockingFlag() {
        return this._methodObject.getBlockingFlag();
    },
    _createEventHandlerProxyObject: function Microsoft_Office_Common_Invoker$_createEventHandlerProxyObject(invokeCompleteObject) {
        return new Microsoft.Office.Common.ResponseSender(invokeCompleteObject.getRequesterWindow(), invokeCompleteObject.getRequesterUrl(), invokeCompleteObject.getActionName(), invokeCompleteObject.getConversationId(), invokeCompleteObject.getCorrelationId(), Microsoft.Office.Common.ResponseType.forEventing, this._serializerVersion);
    }
};
OSF.OUtil.setNamespace("WAC", OSF.DDA);
OSF.DDA.WAC.UniqueArguments = {
    Data: "Data",
    Properties: "Properties",
    BindingRequest: "DdaBindingsMethod",
    BindingResponse: "Bindings",
    SingleBindingResponse: "singleBindingResponse",
    GetData: "DdaGetBindingData",
    AddRowsColumns: "DdaAddRowsColumns",
    SetData: "DdaSetBindingData",
    ClearFormats: "DdaClearBindingFormats",
    SetFormats: "DdaSetBindingFormats",
    SettingsRequest: "DdaSettingsMethod",
    BindingEventSource: "ddaBinding",
    ArrayData: "ArrayData"
};
OSF.OUtil.setNamespace("Delegate", OSF.DDA.WAC);
OSF.DDA.WAC.Delegate.SpecialProcessor = function OSF_DDA_WAC_Delegate_SpecialProcessor() {
    var complexTypes = [
        OSF.DDA.WAC.UniqueArguments.SingleBindingResponse,
        OSF.DDA.WAC.UniqueArguments.BindingRequest,
        OSF.DDA.WAC.UniqueArguments.BindingResponse,
        OSF.DDA.WAC.UniqueArguments.GetData,
        OSF.DDA.WAC.UniqueArguments.AddRowsColumns,
        OSF.DDA.WAC.UniqueArguments.SetData,
        OSF.DDA.WAC.UniqueArguments.ClearFormats,
        OSF.DDA.WAC.UniqueArguments.SetFormats,
        OSF.DDA.WAC.UniqueArguments.SettingsRequest,
        OSF.DDA.WAC.UniqueArguments.BindingEventSource
    ];
    var dynamicTypes = {};
    OSF.DDA.WAC.Delegate.SpecialProcessor.uber.constructor.call(this, complexTypes, dynamicTypes);
};
OSF.OUtil.extend(OSF.DDA.WAC.Delegate.SpecialProcessor, OSF.DDA.SpecialProcessor);
OSF.DDA.WAC.Delegate.ParameterMap = OSF.DDA.getDecoratedParameterMap(new OSF.DDA.WAC.Delegate.SpecialProcessor(), []);
OSF.OUtil.setNamespace("WAC", OSF.DDA);
OSF.OUtil.setNamespace("Delegate", OSF.DDA.WAC);
OSF.DDA.WAC.getDelegateMethods = function OSF_DDA_WAC_getDelegateMethods() {
    var delegateMethods = {};
    delegateMethods[OSF.DDA.DispIdHost.Delegates.ExecuteAsync] = OSF.DDA.WAC.Delegate.executeAsync;
    delegateMethods[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync] = OSF.DDA.WAC.Delegate.registerEventAsync;
    delegateMethods[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync] = OSF.DDA.WAC.Delegate.unregisterEventAsync;
    delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog] = OSF.DDA.WAC.Delegate.openDialog;
    delegateMethods[OSF.DDA.DispIdHost.Delegates.MessageParent] = OSF.DDA.WAC.Delegate.messageParent;
    delegateMethods[OSF.DDA.DispIdHost.Delegates.SendMessage] = OSF.DDA.WAC.Delegate.sendMessage;
    delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog] = OSF.DDA.WAC.Delegate.closeDialog;
    return delegateMethods;
};
OSF.DDA.WAC.Delegate.version = 1;
OSF.DDA.WAC.Delegate.executeAsync = function OSF_DDA_WAC_Delegate$executeAsync(args) {
    if (!args.hostCallArgs) {
        args.hostCallArgs = {};
    }
    args.hostCallArgs["DdaMethod"] = {
        "ControlId": OSF._OfficeAppFactory.getId(),
        "Version": OSF.DDA.WAC.Delegate.version,
        "DispatchId": args.dispId
    };
    args.hostCallArgs["__timeout__"] = -1;
    if (args.onCalling) {
        args.onCalling();
    }
    var startTime = (new Date()).getTime();
    OSF.getClientEndPoint().invoke("executeMethod", function OSF_DDA_WAC_Delegate$OMFacade$OnResponse(xdmStatus, payload) {
        if (args.onReceiving) {
            args.onReceiving();
        }
        var error;
        if (xdmStatus == Microsoft.Office.Common.InvokeResultCode.noError) {
            OSF.DDA.WAC.Delegate.version = payload["Version"];
            error = payload["Error"];
        }
        else {
            switch (xdmStatus) {
                case Microsoft.Office.Common.InvokeResultCode.errorHandlingRequestAccessDenied:
                    error = OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability;
                    break;
                default:
                    error = OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
                    break;
            }
        }
        if (args.onComplete) {
            args.onComplete(error, payload);
        }
        if (OSF.AppTelemetry) {
            OSF.AppTelemetry.onMethodDone(args.dispId, args.hostCallArgs, Math.abs((new Date()).getTime() - startTime), error);
        }
    }, args.hostCallArgs);
};
OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent = function OSF_DDA_WAC_Delegate$GetOnAfterRegisterEvent(register, args) {
    var startTime = (new Date()).getTime();
    return function OSF_DDA_WAC_Delegate$OnAfterRegisterEvent(xdmStatus, payload) {
        if (args.onReceiving) {
            args.onReceiving();
        }
        var status;
        if (xdmStatus != Microsoft.Office.Common.InvokeResultCode.noError) {
            switch (xdmStatus) {
                case Microsoft.Office.Common.InvokeResultCode.errorHandlingRequestAccessDenied:
                    status = OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability;
                    break;
                default:
                    status = OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
                    break;
            }
        }
        else {
            if (payload) {
                if (payload["Error"]) {
                    status = payload["Error"];
                }
                else {
                    status = OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess;
                }
            }
            else {
                status = OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
            }
        }
        if (args.onComplete) {
            args.onComplete(status);
        }
        if (OSF.AppTelemetry) {
            OSF.AppTelemetry.onRegisterDone(register, args.dispId, Math.abs((new Date()).getTime() - startTime), status);
        }
    };
};
OSF.DDA.WAC.Delegate.registerEventAsync = function OSF_DDA_WAC_Delegate$RegisterEventAsync(args) {
    if (args.onCalling) {
        args.onCalling();
    }
    OSF.getClientEndPoint().registerForEvent(OSF.DDA.getXdmEventName(args.targetId, args.eventType), function OSF_DDA_WACOMFacade$OnEvent(payload) {
        if (args.onEvent) {
            args.onEvent(payload);
        }
        if (OSF.AppTelemetry) {
            OSF.AppTelemetry.onEventDone(args.dispId);
        }
    }, OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent(true, args), {
        "controlId": OSF._OfficeAppFactory.getId(),
        "eventDispId": args.dispId,
        "targetId": args.targetId
    });
};
OSF.DDA.WAC.Delegate.unregisterEventAsync = function OSF_DDA_WAC_Delegate$UnregisterEventAsync(args) {
    if (args.onCalling) {
        args.onCalling();
    }
    OSF.getClientEndPoint().unregisterForEvent(OSF.DDA.getXdmEventName(args.targetId, args.eventType), OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent(false, args), {
        "controlId": OSF._OfficeAppFactory.getId(),
        "eventDispId": args.dispId,
        "targetId": args.targetId
    });
};
OSF.OUtil.setNamespace("WebApp", OSF);
OSF.WebApp.AddHostInfoAndXdmInfo = function OSF_WebApp$AddHostInfoAndXdmInfo(url) {
    if (OSF._OfficeAppFactory.getWindowLocationSearch && OSF._OfficeAppFactory.getWindowLocationHash) {
        return url + OSF._OfficeAppFactory.getWindowLocationSearch() + OSF._OfficeAppFactory.getWindowLocationHash();
    }
    else {
        return url;
    }
};
OSF.WebApp._UpdateLinksForHostAndXdmInfo = function OSF_WebApp$_UpdateLinksForHostAndXdmInfo() {
    var links = document.querySelectorAll("a[data-officejs-navigate]");
    for (var i = 0; i < links.length; i++) {
        if (OSF.WebApp._isGoodUrl(links[i].href)) {
            links[i].href = OSF.WebApp.AddHostInfoAndXdmInfo(links[i].href);
        }
    }
    var forms = document.querySelectorAll("form[data-officejs-navigate]");
    for (var i = 0; i < forms.length; i++) {
        var form = forms[i];
        if (OSF.WebApp._isGoodUrl(form.action)) {
            form.action = OSF.WebApp.AddHostInfoAndXdmInfo(form.action);
        }
    }
};
OSF.WebApp._isGoodUrl = function OSF_WebApp$_isGoodUrl(url) {
    if (typeof url == 'undefined')
        return false;
    url = url.trim();
    var colonIndex = url.indexOf(':');
    var protocol = colonIndex > 0 ? url.substr(0, colonIndex) : null;
    var goodUrl = protocol !== null ? protocol.toLowerCase() === "http" || protocol.toLowerCase() === "https" : true;
    goodUrl = goodUrl && url != "#" && url != "/" && url != "" && url != OSF._OfficeAppFactory.getWebAppState().webAppUrl;
    return goodUrl;
};
OSF.InitializationHelper = function OSF_InitializationHelper(hostInfo, webAppState, context, settings, hostFacade) {
    this._hostInfo = hostInfo;
    this._webAppState = webAppState;
    this._context = context;
    this._settings = settings;
    this._hostFacade = hostFacade;
    this._appContext = {};
    this._tabbableElements = "a[href]:not([tabindex='-1'])," + "area[href]:not([tabindex='-1'])," + "button:not([disabled]):not([tabindex='-1'])," + "input:not([disabled]):not([tabindex='-1'])," + "select:not([disabled]):not([tabindex='-1'])," + "textarea:not([disabled]):not([tabindex='-1'])," + "*[tabindex]:not([tabindex='-1'])," + "*[contenteditable]:not([disabled]):not([tabindex='-1'])";
    this._initializeSettings = function OSF_InitializationHelper$initializeSettings(appContext, refreshSupported) {
        var settings;
        var serializedSettings = appContext.get_settings();
        var osfSessionStorage = OSF.OUtil.getSessionStorage();
        if (osfSessionStorage) {
            var storageSettings = osfSessionStorage.getItem(OSF._OfficeAppFactory.getCachedSessionSettingsKey());
            if (storageSettings) {
                serializedSettings = JSON.parse(storageSettings);
            }
            else {
                storageSettings = JSON.stringify(serializedSettings);
                osfSessionStorage.setItem(OSF._OfficeAppFactory.getCachedSessionSettingsKey(), storageSettings);
            }
        }
        var deserializedSettings = OSF.DDA.SettingsManager.deserializeSettings(serializedSettings);
        if (refreshSupported) {
            settings = new OSF.DDA.RefreshableSettings(deserializedSettings);
        }
        else {
            settings = new OSF.DDA.Settings(deserializedSettings);
        }
        return settings;
    };
    var windowOpen = function OSF_InitializationHelper$windowOpen(windowObj) {
        var proxy = window.open;
        windowObj.open = function (strUrl, strWindowName, strWindowFeatures) {
            var windowObject = null;
            try {
                windowObject = proxy(strUrl, strWindowName, strWindowFeatures);
            }
            catch (ex) {
                if (OSF.AppTelemetry) {
                    OSF.AppTelemetry.logAppCommonMessage("Exception happens at windowOpen." + ex);
                }
            }
            if (!windowObject) {
                var params = {
                    "strUrl": strUrl,
                    "strWindowName": strWindowName,
                    "strWindowFeatures": strWindowFeatures
                };
                OSF._OfficeAppFactory.getClientEndPoint().invoke("ContextActivationManager_openWindowInHost", null, params);
            }
            return windowObject;
        };
    };
    windowOpen(window);
};
OSF.InitializationHelper.prototype.saveAndSetDialogInfo = function OSF_InitializationHelper$saveAndSetDialogInfo(hostInfoValue) {
    var getAppIdFromWindowLocation = function OSF_InitializationHelper$getAppIdFromWindowLocation() {
        var xdmInfoValue = OSF.OUtil.parseXdmInfo(true);
        if (xdmInfoValue) {
            var items = xdmInfoValue.split("|");
            return items[1];
        }
        return null;
    };
    var osfSessionStorage = OSF.OUtil.getSessionStorage();
    if (osfSessionStorage) {
        if (!hostInfoValue) {
            hostInfoValue = OSF.OUtil.parseHostInfoFromWindowName(true, OSF._OfficeAppFactory.getWindowName());
        }
        if (hostInfoValue && hostInfoValue.indexOf("isDialog") > -1) {
            var appId = getAppIdFromWindowLocation();
            if (appId != null) {
                osfSessionStorage.setItem(appId + "IsDialog", "true");
            }
        }
        this._hostInfo.isDialog = osfSessionStorage.getItem(OSF.OUtil.getXdmFieldValue(OSF.XdmFieldName.AppId, false) + "IsDialog") != null ? true : false;
    }
};
OSF.InitializationHelper.prototype.getAppContext = function OSF_InitializationHelper$getAppContext(wnd, gotAppContext) {
    var me = this;
    var getInvocationCallbackWebApp = function OSF_InitializationHelper_getAppContextAsync$getInvocationCallbackWebApp(errorCode, appContext) {
        var settings;
        if (appContext._appName === OSF.AppName.ExcelWebApp) {
            var serializedSettings = appContext._settings;
            settings = {};
            for (var index in serializedSettings) {
                var setting = serializedSettings[index];
                settings[setting[0]] = setting[1];
            }
        }
        else {
            settings = appContext._settings;
        }
        if (errorCode === 0 && appContext._id != undefined && appContext._appName != undefined && appContext._appVersion != undefined && appContext._appUILocale != undefined && appContext._dataLocale != undefined &&
            appContext._docUrl != undefined && appContext._clientMode != undefined && appContext._settings != undefined && appContext._reason != undefined) {
            me._appContext = appContext;
            var appInstanceId = (appContext._appInstanceId ? appContext._appInstanceId : appContext._id);
            var touchEnabled = false;
            var commerceAllowed = true;
            var minorVersion = 0;
            if (appContext._appMinorVersion != undefined) {
                minorVersion = appContext._appMinorVersion;
            }
            var requirementMatrix = undefined;
            if (appContext._requirementMatrix != undefined) {
                requirementMatrix = appContext._requirementMatrix;
            }
            var returnedContext = new OSF.OfficeAppContext(appContext._id, appContext._appName, appContext._appVersion, appContext._appUILocale, appContext._dataLocale, appContext._docUrl, appContext._clientMode, settings, appContext._reason, appContext._osfControlType, appContext._eToken, appContext._correlationId, appInstanceId, touchEnabled, commerceAllowed, minorVersion, requirementMatrix, appContext._hostCustomMessage, appContext._hostFullVersion, appContext._clientWindowHeight, appContext._clientWindowWidth, appContext._addinName);
            if (OSF.AppTelemetry) {
                OSF.AppTelemetry.initialize(returnedContext);
            }
            gotAppContext(returnedContext);
        }
        else {
            var errorMsg = "Function ContextActivationManager_getAppContextAsync call failed. ErrorCode is " + errorCode + ", exception: " + appContext;
            if (OSF.AppTelemetry) {
                OSF.AppTelemetry.logAppException(errorMsg);
            }
            throw errorMsg;
        }
    };
    try {
        if (this._hostInfo.isDialog && window.opener != null) {
            var appContext = OfficeExt.WACUtils.parseAppContextFromWindowName(false, OSF._OfficeAppFactory.getWindowName());
            getInvocationCallbackWebApp(0, appContext);
        }
        else {
            this._webAppState.clientEndPoint.invoke("ContextActivationManager_getAppContextAsync", getInvocationCallbackWebApp, this._webAppState.id);
        }
    }
    catch (ex) {
        if (OSF.AppTelemetry) {
            OSF.AppTelemetry.logAppException("Exception thrown when trying to invoke getAppContextAsync. Exception:[" + ex + "]");
        }
        throw ex;
    }
};
OSF.InitializationHelper.prototype.setAgaveHostCommunication = function OSF_InitializationHelper$setAgaveHostCommunication() {
    try {
        var me = this;
        var xdmInfoValue = OSF.OUtil.parseXdmInfoWithGivenFragment(false, OSF._OfficeAppFactory.getWindowLocationHash());
        if (!xdmInfoValue && OSF._OfficeAppFactory.getWindowName) {
            xdmInfoValue = OSF.OUtil.parseXdmInfoFromWindowName(false, OSF._OfficeAppFactory.getWindowName());
        }
        if (xdmInfoValue) {
            var xdmItems = OSF.OUtil.getInfoItems(xdmInfoValue);
            if (xdmItems != undefined && xdmItems.length >= 3) {
                me._webAppState.conversationID = xdmItems[0];
                me._webAppState.id = xdmItems[1];
                me._webAppState.webAppUrl = xdmItems[2].indexOf(":") >= 0 ? xdmItems[2] : decodeURIComponent(xdmItems[2]);
            }
        }
        me._webAppState.wnd = window.opener != null ? window.opener : window.parent;
        var serializerVersion = OSF.OUtil.parseSerializerVersionWithGivenFragment(false, OSF._OfficeAppFactory.getWindowLocationHash());
        if (isNaN(serializerVersion) && OSF._OfficeAppFactory.getWindowName) {
            serializerVersion = OSF.OUtil.parseSerializerVersionFromWindowName(false, OSF._OfficeAppFactory.getWindowName());
        }
        me._webAppState.serializerVersion = serializerVersion;
        me._webAppState.clientEndPoint = Microsoft.Office.Common.XdmCommunicationManager.connect(me._webAppState.conversationID, me._webAppState.wnd, me._webAppState.webAppUrl, me._webAppState.serializerVersion);
        me._webAppState.serviceEndPoint = Microsoft.Office.Common.XdmCommunicationManager.createServiceEndPoint(me._webAppState.id);
        var notificationConversationId = me._webAppState.conversationID + OSF.SharedConstants.NotificationConversationIdSuffix;
        me._webAppState.serviceEndPoint.registerConversation(notificationConversationId, me._webAppState.webAppUrl);
        if (this._hostInfo.isDialog && window.opener != null) {
            return;
        }
        var notifyAgave = function OSF__OfficeAppFactory_initialize$notifyAgave(actionId) {
            switch (actionId) {
                case OSF.AgaveHostAction.Select:
                    me._webAppState.focused = true;
                    break;
                case OSF.AgaveHostAction.UnSelect:
                    me._webAppState.focused = false;
                    break;
                case OSF.AgaveHostAction.TabIn:
                case OSF.AgaveHostAction.CtrlF6In:
                    window.focus();
                    var list = document.querySelectorAll(me._tabbableElements);
                    var focused = OSF.OUtil.focusToFirstTabbable(list, false);
                    if (!focused) {
                        window.blur();
                        me._webAppState.focused = false;
                        me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.ExitNoFocusable]);
                    }
                    break;
                case OSF.AgaveHostAction.TabInShift:
                    window.focus();
                    var list = document.querySelectorAll(me._tabbableElements);
                    var focused = OSF.OUtil.focusToFirstTabbable(list, true);
                    if (!focused) {
                        window.blur();
                        me._webAppState.focused = false;
                        me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.ExitNoFocusableShift]);
                    }
                    break;
                default:
                    OsfMsAjaxFactory.msAjaxDebug.trace("actionId " + actionId + " notifyAgave is wrong.");
                    break;
            }
        };
        me._webAppState.serviceEndPoint.registerMethod("Office_notifyAgave", notifyAgave, Microsoft.Office.Common.InvokeType.async, false);
        OSF.OUtil.addEventListener(window, "focus", function () {
            if (!me._webAppState.focused) {
                me._webAppState.focused = true;
            }
            me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.Select]);
        });
        OSF.OUtil.addEventListener(window, "blur", function () {
            if (!OSF) {
                return;
            }
            if (me._webAppState.focused) {
                me._webAppState.focused = false;
            }
            me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.UnSelect]);
        });
        OSF.OUtil.addEventListener(window, "keydown", function (e) {
            e.preventDefault = e.preventDefault || function () {
                e.returnValue = false;
            };
            if (e.keyCode == 117 && (e.ctrlKey || e.metaKey)) {
                var actionId = OSF.AgaveHostAction.CtrlF6Exit;
                if (e.shiftKey) {
                    actionId = OSF.AgaveHostAction.CtrlF6ExitShift;
                }
                me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, actionId]);
            }
            else if (e.keyCode == 9) {
                e.preventDefault();
                var allTabbableElements = document.querySelectorAll(me._tabbableElements);
                var focused = OSF.OUtil.focusToNextTabbable(allTabbableElements, e.target || e.srcElement, e.shiftKey);
                if (!focused) {
                    if (me._hostInfo.isDialog) {
                        OSF.OUtil.focusToFirstTabbable(allTabbableElements, e.shiftKey);
                    }
                    else {
                        if (e.shiftKey) {
                            me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.TabExitShift]);
                        }
                        else {
                            me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.TabExit]);
                        }
                    }
                }
            }
            else if (e.keyCode == 27) {
                e.preventDefault();
                me.dismissDialogNotification && me.dismissDialogNotification();
                me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.EscExit]);
            }
            else if (e.keyCode == 113) {
                e.preventDefault();
                me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.F2Exit]);
            }
        });
        OSF.OUtil.addEventListener(window, "keypress", function (e) {
            if (e.keyCode == 117 && e.ctrlKey) {
                if (e.preventDefault) {
                    e.preventDefault();
                }
                else {
                    e.returnValue = false;
                }
            }
        });
    }
    catch (ex) {
        if (OSF.AppTelemetry) {
            OSF.AppTelemetry.logAppException("Exception thrown in setAgaveHostCommunication. Exception:[" + ex + "]");
        }
        throw ex;
    }
};
OSF.InitializationHelper.prototype.initWebDialog = function OSF_InitializationHelper$initWebDialog(appContext) {
    if (appContext.get_isDialog()) {
        if (OSF.DDA.UI.ChildUI) {
            var isPopupWindow = (window.opener != null);
            appContext.ui = new OSF.DDA.UI.ChildUI(isPopupWindow);
            if (isPopupWindow) {
                this.registerMessageReceivedEventForWindowDialog && this.registerMessageReceivedEventForWindowDialog();
            }
        }
    }
    else {
        if (OSF.DDA.UI.ParentUI) {
            appContext.ui = new OSF.DDA.UI.ParentUI();
            if (OfficeExt.Container) {
                OSF.DDA.DispIdHost.addAsyncMethods(appContext.ui, [OSF.DDA.AsyncMethodNames.CloseContainerAsync]);
            }
        }
    }
};
OSF.getClientEndPoint = function OSF$getClientEndPoint() {
    var initializationHelper = OSF._OfficeAppFactory.getInitializationHelper();
    return initializationHelper._webAppState.clientEndPoint;
};
OSF.InitializationHelper.prototype.prepareRightAfterWebExtensionInitialize = function OSF_InitializationHelper$prepareRightAfterWebExtensionInitialize() {
    if (this._hostInfo.isDialog) {
        window.focus();
        var list = document.querySelectorAll(this._tabbableElements);
        var focused = OSF.OUtil.focusToFirstTabbable(list, false);
        if (!focused) {
            window.blur();
            this._webAppState.focused = false;
            this._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [this._webAppState.id, OSF.AgaveHostAction.ExitNoFocusable]);
        }
    }
};
OSF.CommonUI = {
    HostButtonBorderColor: "#f5ba9d",
    HostButtonBackgroundColor: "#fcf0ed"
};
var OSFLog;
(function (OSFLog) {
    var BaseUsageData = (function () {
        function BaseUsageData(table) {
            this._table = table;
            this._fields = {};
        }
        Object.defineProperty(BaseUsageData.prototype, "Fields", {
            get: function () {
                return this._fields;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(BaseUsageData.prototype, "Table", {
            get: function () {
                return this._table;
            },
            enumerable: true,
            configurable: true
        });
        BaseUsageData.prototype.SerializeFields = function () {
        };
        BaseUsageData.prototype.SetSerializedField = function (key, value) {
            if (typeof (value) !== "undefined" && value !== null) {
                this._serializedFields[key] = value.toString();
            }
        };
        BaseUsageData.prototype.SerializeRow = function () {
            this._serializedFields = {};
            this.SetSerializedField("Table", this._table);
            this.SerializeFields();
            return JSON.stringify(this._serializedFields);
        };
        return BaseUsageData;
    })();
    OSFLog.BaseUsageData = BaseUsageData;
    var AppActivatedUsageData = (function (_super) {
        __extends(AppActivatedUsageData, _super);
        function AppActivatedUsageData() {
            _super.call(this, "AppActivated");
        }
        Object.defineProperty(AppActivatedUsageData.prototype, "CorrelationId", {
            get: function () { return this.Fields["CorrelationId"]; },
            set: function (value) { this.Fields["CorrelationId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "SessionId", {
            get: function () { return this.Fields["SessionId"]; },
            set: function (value) { this.Fields["SessionId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "AppId", {
            get: function () { return this.Fields["AppId"]; },
            set: function (value) { this.Fields["AppId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "AppInstanceId", {
            get: function () { return this.Fields["AppInstanceId"]; },
            set: function (value) { this.Fields["AppInstanceId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "AppURL", {
            get: function () { return this.Fields["AppURL"]; },
            set: function (value) { this.Fields["AppURL"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "AssetId", {
            get: function () { return this.Fields["AssetId"]; },
            set: function (value) { this.Fields["AssetId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "Browser", {
            get: function () { return this.Fields["Browser"]; },
            set: function (value) { this.Fields["Browser"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "UserId", {
            get: function () { return this.Fields["UserId"]; },
            set: function (value) { this.Fields["UserId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "Host", {
            get: function () { return this.Fields["Host"]; },
            set: function (value) { this.Fields["Host"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "HostVersion", {
            get: function () { return this.Fields["HostVersion"]; },
            set: function (value) { this.Fields["HostVersion"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "ClientId", {
            get: function () { return this.Fields["ClientId"]; },
            set: function (value) { this.Fields["ClientId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "AppSizeWidth", {
            get: function () { return this.Fields["AppSizeWidth"]; },
            set: function (value) { this.Fields["AppSizeWidth"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "AppSizeHeight", {
            get: function () { return this.Fields["AppSizeHeight"]; },
            set: function (value) { this.Fields["AppSizeHeight"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "Message", {
            get: function () { return this.Fields["Message"]; },
            set: function (value) { this.Fields["Message"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "DocUrl", {
            get: function () { return this.Fields["DocUrl"]; },
            set: function (value) { this.Fields["DocUrl"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "OfficeJSVersion", {
            get: function () { return this.Fields["OfficeJSVersion"]; },
            set: function (value) { this.Fields["OfficeJSVersion"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppActivatedUsageData.prototype, "HostJSVersion", {
            get: function () { return this.Fields["HostJSVersion"]; },
            set: function (value) { this.Fields["HostJSVersion"] = value; },
            enumerable: true,
            configurable: true
        });
        AppActivatedUsageData.prototype.SerializeFields = function () {
            this.SetSerializedField("CorrelationId", this.CorrelationId);
            this.SetSerializedField("SessionId", this.SessionId);
            this.SetSerializedField("AppId", this.AppId);
            this.SetSerializedField("AppInstanceId", this.AppInstanceId);
            this.SetSerializedField("AppURL", this.AppURL);
            this.SetSerializedField("AssetId", this.AssetId);
            this.SetSerializedField("Browser", this.Browser);
            this.SetSerializedField("UserId", this.UserId);
            this.SetSerializedField("Host", this.Host);
            this.SetSerializedField("HostVersion", this.HostVersion);
            this.SetSerializedField("ClientId", this.ClientId);
            this.SetSerializedField("AppSizeWidth", this.AppSizeWidth);
            this.SetSerializedField("AppSizeHeight", this.AppSizeHeight);
            this.SetSerializedField("Message", this.Message);
            this.SetSerializedField("DocUrl", this.DocUrl);
            this.SetSerializedField("OfficeJSVersion", this.OfficeJSVersion);
            this.SetSerializedField("HostJSVersion", this.HostJSVersion);
        };
        return AppActivatedUsageData;
    })(BaseUsageData);
    OSFLog.AppActivatedUsageData = AppActivatedUsageData;
    var ScriptLoadUsageData = (function (_super) {
        __extends(ScriptLoadUsageData, _super);
        function ScriptLoadUsageData() {
            _super.call(this, "ScriptLoad");
        }
        Object.defineProperty(ScriptLoadUsageData.prototype, "CorrelationId", {
            get: function () { return this.Fields["CorrelationId"]; },
            set: function (value) { this.Fields["CorrelationId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScriptLoadUsageData.prototype, "SessionId", {
            get: function () { return this.Fields["SessionId"]; },
            set: function (value) { this.Fields["SessionId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScriptLoadUsageData.prototype, "ScriptId", {
            get: function () { return this.Fields["ScriptId"]; },
            set: function (value) { this.Fields["ScriptId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScriptLoadUsageData.prototype, "StartTime", {
            get: function () { return this.Fields["StartTime"]; },
            set: function (value) { this.Fields["StartTime"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ScriptLoadUsageData.prototype, "ResponseTime", {
            get: function () { return this.Fields["ResponseTime"]; },
            set: function (value) { this.Fields["ResponseTime"] = value; },
            enumerable: true,
            configurable: true
        });
        ScriptLoadUsageData.prototype.SerializeFields = function () {
            this.SetSerializedField("CorrelationId", this.CorrelationId);
            this.SetSerializedField("SessionId", this.SessionId);
            this.SetSerializedField("ScriptId", this.ScriptId);
            this.SetSerializedField("StartTime", this.StartTime);
            this.SetSerializedField("ResponseTime", this.ResponseTime);
        };
        return ScriptLoadUsageData;
    })(BaseUsageData);
    OSFLog.ScriptLoadUsageData = ScriptLoadUsageData;
    var AppClosedUsageData = (function (_super) {
        __extends(AppClosedUsageData, _super);
        function AppClosedUsageData() {
            _super.call(this, "AppClosed");
        }
        Object.defineProperty(AppClosedUsageData.prototype, "CorrelationId", {
            get: function () { return this.Fields["CorrelationId"]; },
            set: function (value) { this.Fields["CorrelationId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppClosedUsageData.prototype, "SessionId", {
            get: function () { return this.Fields["SessionId"]; },
            set: function (value) { this.Fields["SessionId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppClosedUsageData.prototype, "FocusTime", {
            get: function () { return this.Fields["FocusTime"]; },
            set: function (value) { this.Fields["FocusTime"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppClosedUsageData.prototype, "AppSizeFinalWidth", {
            get: function () { return this.Fields["AppSizeFinalWidth"]; },
            set: function (value) { this.Fields["AppSizeFinalWidth"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppClosedUsageData.prototype, "AppSizeFinalHeight", {
            get: function () { return this.Fields["AppSizeFinalHeight"]; },
            set: function (value) { this.Fields["AppSizeFinalHeight"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppClosedUsageData.prototype, "OpenTime", {
            get: function () { return this.Fields["OpenTime"]; },
            set: function (value) { this.Fields["OpenTime"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppClosedUsageData.prototype, "CloseMethod", {
            get: function () { return this.Fields["CloseMethod"]; },
            set: function (value) { this.Fields["CloseMethod"] = value; },
            enumerable: true,
            configurable: true
        });
        AppClosedUsageData.prototype.SerializeFields = function () {
            this.SetSerializedField("CorrelationId", this.CorrelationId);
            this.SetSerializedField("SessionId", this.SessionId);
            this.SetSerializedField("FocusTime", this.FocusTime);
            this.SetSerializedField("AppSizeFinalWidth", this.AppSizeFinalWidth);
            this.SetSerializedField("AppSizeFinalHeight", this.AppSizeFinalHeight);
            this.SetSerializedField("OpenTime", this.OpenTime);
            this.SetSerializedField("CloseMethod", this.CloseMethod);
        };
        return AppClosedUsageData;
    })(BaseUsageData);
    OSFLog.AppClosedUsageData = AppClosedUsageData;
    var APIUsageUsageData = (function (_super) {
        __extends(APIUsageUsageData, _super);
        function APIUsageUsageData() {
            _super.call(this, "APIUsage");
        }
        Object.defineProperty(APIUsageUsageData.prototype, "CorrelationId", {
            get: function () { return this.Fields["CorrelationId"]; },
            set: function (value) { this.Fields["CorrelationId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APIUsageUsageData.prototype, "SessionId", {
            get: function () { return this.Fields["SessionId"]; },
            set: function (value) { this.Fields["SessionId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APIUsageUsageData.prototype, "APIType", {
            get: function () { return this.Fields["APIType"]; },
            set: function (value) { this.Fields["APIType"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APIUsageUsageData.prototype, "APIID", {
            get: function () { return this.Fields["APIID"]; },
            set: function (value) { this.Fields["APIID"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APIUsageUsageData.prototype, "Parameters", {
            get: function () { return this.Fields["Parameters"]; },
            set: function (value) { this.Fields["Parameters"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APIUsageUsageData.prototype, "ResponseTime", {
            get: function () { return this.Fields["ResponseTime"]; },
            set: function (value) { this.Fields["ResponseTime"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(APIUsageUsageData.prototype, "ErrorType", {
            get: function () { return this.Fields["ErrorType"]; },
            set: function (value) { this.Fields["ErrorType"] = value; },
            enumerable: true,
            configurable: true
        });
        APIUsageUsageData.prototype.SerializeFields = function () {
            this.SetSerializedField("CorrelationId", this.CorrelationId);
            this.SetSerializedField("SessionId", this.SessionId);
            this.SetSerializedField("APIType", this.APIType);
            this.SetSerializedField("APIID", this.APIID);
            this.SetSerializedField("Parameters", this.Parameters);
            this.SetSerializedField("ResponseTime", this.ResponseTime);
            this.SetSerializedField("ErrorType", this.ErrorType);
        };
        return APIUsageUsageData;
    })(BaseUsageData);
    OSFLog.APIUsageUsageData = APIUsageUsageData;
    var AppInitializationUsageData = (function (_super) {
        __extends(AppInitializationUsageData, _super);
        function AppInitializationUsageData() {
            _super.call(this, "AppInitialization");
        }
        Object.defineProperty(AppInitializationUsageData.prototype, "CorrelationId", {
            get: function () { return this.Fields["CorrelationId"]; },
            set: function (value) { this.Fields["CorrelationId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppInitializationUsageData.prototype, "SessionId", {
            get: function () { return this.Fields["SessionId"]; },
            set: function (value) { this.Fields["SessionId"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppInitializationUsageData.prototype, "SuccessCode", {
            get: function () { return this.Fields["SuccessCode"]; },
            set: function (value) { this.Fields["SuccessCode"] = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AppInitializationUsageData.prototype, "Message", {
            get: function () { return this.Fields["Message"]; },
            set: function (value) { this.Fields["Message"] = value; },
            enumerable: true,
            configurable: true
        });
        AppInitializationUsageData.prototype.SerializeFields = function () {
            this.SetSerializedField("CorrelationId", this.CorrelationId);
            this.SetSerializedField("SessionId", this.SessionId);
            this.SetSerializedField("SuccessCode", this.SuccessCode);
            this.SetSerializedField("Message", this.Message);
        };
        return AppInitializationUsageData;
    })(BaseUsageData);
    OSFLog.AppInitializationUsageData = AppInitializationUsageData;
})(OSFLog || (OSFLog = {}));
var Logger;
(function (Logger) {
    "use strict";
    (function (TraceLevel) {
        TraceLevel[TraceLevel["info"] = 0] = "info";
        TraceLevel[TraceLevel["warning"] = 1] = "warning";
        TraceLevel[TraceLevel["error"] = 2] = "error";
    })(Logger.TraceLevel || (Logger.TraceLevel = {}));
    var TraceLevel = Logger.TraceLevel;
    (function (SendFlag) {
        SendFlag[SendFlag["none"] = 0] = "none";
        SendFlag[SendFlag["flush"] = 1] = "flush";
    })(Logger.SendFlag || (Logger.SendFlag = {}));
    var SendFlag = Logger.SendFlag;
    function allowUploadingData() {
        if (OSF.Logger && OSF.Logger.ulsEndpoint) {
            OSF.Logger.ulsEndpoint.loadProxyFrame();
        }
    }
    Logger.allowUploadingData = allowUploadingData;
    function sendLog(traceLevel, message, flag) {
        if (OSF.Logger && OSF.Logger.ulsEndpoint) {
            var jsonObj = { traceLevel: traceLevel, message: message, flag: flag, internalLog: true };
            var logs = JSON.stringify(jsonObj);
            OSF.Logger.ulsEndpoint.writeLog(logs);
        }
    }
    Logger.sendLog = sendLog;
    function creatULSEndpoint() {
        try {
            return new ULSEndpointProxy();
        }
        catch (e) {
            return null;
        }
    }
    var ULSEndpointProxy = (function () {
        function ULSEndpointProxy() {
            var _this = this;
            this.proxyFrame = null;
            this.telemetryEndPoint = "https://telemetryservice.firstpartyapps.oaspapps.com/telemetryservice/telemetryproxy.html";
            this.buffer = [];
            this.proxyFrameReady = false;
            OSF.OUtil.addEventListener(window, "message", function (e) { return _this.tellProxyFrameReady(e); });
            setTimeout(function () {
                _this.loadProxyFrame();
            }, 3000);
        }
        ULSEndpointProxy.prototype.writeLog = function (log) {
            if (this.proxyFrameReady === true) {
                this.proxyFrame.contentWindow.postMessage(log, ULSEndpointProxy.telemetryOrigin);
            }
            else {
                if (this.buffer.length < 128) {
                    this.buffer.push(log);
                }
            }
        };
        ULSEndpointProxy.prototype.loadProxyFrame = function () {
            if (this.proxyFrame == null) {
                this.proxyFrame = document.createElement("iframe");
                this.proxyFrame.setAttribute("style", "display:none");
                this.proxyFrame.setAttribute("src", this.telemetryEndPoint);
                document.head.appendChild(this.proxyFrame);
            }
        };
        ULSEndpointProxy.prototype.tellProxyFrameReady = function (e) {
            var _this = this;
            if (e.data === "ProxyFrameReadyToLog") {
                this.proxyFrameReady = true;
                for (var i = 0; i < this.buffer.length; i++) {
                    this.writeLog(this.buffer[i]);
                }
                this.buffer.length = 0;
                OSF.OUtil.removeEventListener(window, "message", function (e) { return _this.tellProxyFrameReady(e); });
            }
            else if (e.data === "ProxyFrameReadyToInit") {
                var initJson = { appName: "Office APPs", sessionId: OSF.OUtil.Guid.generateNewGuid() };
                var initStr = JSON.stringify(initJson);
                this.proxyFrame.contentWindow.postMessage(initStr, ULSEndpointProxy.telemetryOrigin);
            }
        };
        ULSEndpointProxy.telemetryOrigin = "https://telemetryservice.firstpartyapps.oaspapps.com";
        return ULSEndpointProxy;
    })();
    if (!OSF.Logger) {
        OSF.Logger = Logger;
    }
    Logger.ulsEndpoint = creatULSEndpoint();
})(Logger || (Logger = {}));
var OSFAppTelemetry;
(function (OSFAppTelemetry) {
    "use strict";
    var appInfo;
    var sessionId = OSF.OUtil.Guid.generateNewGuid();
    var osfControlAppCorrelationId = "";
    var omexDomainRegex = new RegExp("^https?://store\\.office(ppe|-int)?\\.com/", "i");
    ;
    var AppInfo = (function () {
        function AppInfo() {
        }
        return AppInfo;
    })();
    var Event = (function () {
        function Event(name, handler) {
            this.name = name;
            this.handler = handler;
        }
        return Event;
    })();
    var AppStorage = (function () {
        function AppStorage() {
            this.clientIDKey = "Office API client";
            this.logIdSetKey = "Office App Log Id Set";
        }
        AppStorage.prototype.getClientId = function () {
            var clientId = this.getValue(this.clientIDKey);
            if (!clientId || clientId.length <= 0 || clientId.length > 40) {
                clientId = OSF.OUtil.Guid.generateNewGuid();
                this.setValue(this.clientIDKey, clientId);
            }
            return clientId;
        };
        AppStorage.prototype.saveLog = function (logId, log) {
            var logIdSet = this.getValue(this.logIdSetKey);
            logIdSet = ((logIdSet && logIdSet.length > 0) ? (logIdSet + ";") : "") + logId;
            this.setValue(this.logIdSetKey, logIdSet);
            this.setValue(logId, log);
        };
        AppStorage.prototype.enumerateLog = function (callback, clean) {
            var logIdSet = this.getValue(this.logIdSetKey);
            if (logIdSet) {
                var ids = logIdSet.split(";");
                for (var id in ids) {
                    var logId = ids[id];
                    var log = this.getValue(logId);
                    if (log) {
                        if (callback) {
                            callback(logId, log);
                        }
                        if (clean) {
                            this.remove(logId);
                        }
                    }
                }
                if (clean) {
                    this.remove(this.logIdSetKey);
                }
            }
        };
        AppStorage.prototype.getValue = function (key) {
            var osfLocalStorage = OSF.OUtil.getLocalStorage();
            var value = "";
            if (osfLocalStorage) {
                value = osfLocalStorage.getItem(key);
            }
            return value;
        };
        AppStorage.prototype.setValue = function (key, value) {
            var osfLocalStorage = OSF.OUtil.getLocalStorage();
            if (osfLocalStorage) {
                osfLocalStorage.setItem(key, value);
            }
        };
        AppStorage.prototype.remove = function (key) {
            var osfLocalStorage = OSF.OUtil.getLocalStorage();
            if (osfLocalStorage) {
                try {
                    osfLocalStorage.removeItem(key);
                }
                catch (ex) {
                }
            }
        };
        return AppStorage;
    })();
    var AppLogger = (function () {
        function AppLogger() {
        }
        AppLogger.prototype.LogData = function (data) {
            if (!OSF.Logger) {
                return;
            }
            OSF.Logger.sendLog(OSF.Logger.TraceLevel.info, data.SerializeRow(), OSF.Logger.SendFlag.none);
        };
        AppLogger.prototype.LogRawData = function (log) {
            if (!OSF.Logger) {
                return;
            }
            OSF.Logger.sendLog(OSF.Logger.TraceLevel.info, log, OSF.Logger.SendFlag.none);
        };
        return AppLogger;
    })();
    function initialize(context) {
        if (!OSF.Logger) {
            return;
        }
        if (appInfo) {
            return;
        }
        appInfo = new AppInfo();
        if (context.get_hostFullVersion()) {
            appInfo.hostVersion = context.get_hostFullVersion();
        }
        else {
            appInfo.hostVersion = context.get_appVersion();
        }
        appInfo.appId = context.get_id();
        appInfo.host = context.get_appName();
        appInfo.browser = window.navigator.userAgent;
        appInfo.correlationId = context.get_correlationId();
        appInfo.clientId = (new AppStorage()).getClientId();
        appInfo.appInstanceId = context.get_appInstanceId();
        if (appInfo.appInstanceId) {
            appInfo.appInstanceId = appInfo.appInstanceId.replace(/[{}]/g, "").toLowerCase();
        }
        appInfo.message = context.get_hostCustomMessage();
        appInfo.officeJSVersion = OSF.ConstantNames.FileVersion;
        appInfo.hostJSVersion = "16.0.7610.1000";
        var docUrl = context.get_docUrl();
        appInfo.docUrl = omexDomainRegex.test(docUrl) ? docUrl : "";
        var url = location.href;
        if (url) {
            url = url.split("?")[0].split("#")[0];
        }
        appInfo.appURL = url;
        (function getUserIdAndAssetIdFromToken(token, appInfo) {
            var xmlContent;
            var parser;
            var xmlDoc;
            appInfo.assetId = "";
            appInfo.userId = "";
            try {
                xmlContent = decodeURIComponent(token);
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(xmlContent, "text/xml");
                var cidNode = xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("cid");
                var oidNode = xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("oid");
                if (cidNode && cidNode.nodeValue) {
                    appInfo.userId = cidNode.nodeValue;
                }
                else if (oidNode && oidNode.nodeValue) {
                    appInfo.userId = oidNode.nodeValue;
                }
                appInfo.assetId = xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("aid").nodeValue;
            }
            catch (e) {
            }
            finally {
                xmlContent = null;
                xmlDoc = null;
                parser = null;
            }
        })(context.get_eToken(), appInfo);
        (function handleLifecycle() {
            var startTime = new Date();
            var lastFocus = null;
            var focusTime = 0;
            var finished = false;
            var adjustFocusTime = function () {
                if (document.hasFocus()) {
                    if (lastFocus == null) {
                        lastFocus = new Date();
                    }
                }
                else if (lastFocus) {
                    focusTime += Math.abs((new Date()).getTime() - lastFocus.getTime());
                    lastFocus = null;
                }
            };
            var eventList = [];
            eventList.push(new Event("focus", adjustFocusTime));
            eventList.push(new Event("blur", adjustFocusTime));
            eventList.push(new Event("focusout", adjustFocusTime));
            eventList.push(new Event("focusin", adjustFocusTime));
            var exitFunction = function () {
                for (var i = 0; i < eventList.length; i++) {
                    OSF.OUtil.removeEventListener(window, eventList[i].name, eventList[i].handler);
                }
                eventList.length = 0;
                if (!finished) {
                    if (document.hasFocus() && lastFocus) {
                        focusTime += Math.abs((new Date()).getTime() - lastFocus.getTime());
                        lastFocus = null;
                    }
                    OSFAppTelemetry.onAppClosed(Math.abs((new Date()).getTime() - startTime.getTime()), focusTime);
                    finished = true;
                }
            };
            eventList.push(new Event("beforeunload", exitFunction));
            eventList.push(new Event("unload", exitFunction));
            for (var i = 0; i < eventList.length; i++) {
                OSF.OUtil.addEventListener(window, eventList[i].name, eventList[i].handler);
            }
            adjustFocusTime();
        })();
        OSFAppTelemetry.onAppActivated();
    }
    OSFAppTelemetry.initialize = initialize;
    function onAppActivated() {
        if (!appInfo) {
            return;
        }
        (new AppStorage()).enumerateLog(function (id, log) { return (new AppLogger()).LogRawData(log); }, true);
        var data = new OSFLog.AppActivatedUsageData();
        data.SessionId = sessionId;
        data.AppId = appInfo.appId;
        data.AssetId = appInfo.assetId;
        data.AppURL = appInfo.appURL;
        data.UserId = appInfo.userId;
        data.ClientId = appInfo.clientId;
        data.Browser = appInfo.browser;
        data.Host = appInfo.host;
        data.HostVersion = appInfo.hostVersion;
        data.CorrelationId = appInfo.correlationId;
        data.AppSizeWidth = window.innerWidth;
        data.AppSizeHeight = window.innerHeight;
        data.AppInstanceId = appInfo.appInstanceId;
        data.Message = appInfo.message;
        data.DocUrl = appInfo.docUrl;
        data.OfficeJSVersion = appInfo.officeJSVersion;
        data.HostJSVersion = appInfo.hostJSVersion;
        (new AppLogger()).LogData(data);
        setTimeout(function () {
            if (!OSF.Logger) {
                return;
            }
            OSF.Logger.allowUploadingData();
        }, 100);
    }
    OSFAppTelemetry.onAppActivated = onAppActivated;
    function onScriptDone(scriptId, msStartTime, msResponseTime, appCorrelationId) {
        var data = new OSFLog.ScriptLoadUsageData();
        data.CorrelationId = appCorrelationId;
        data.SessionId = sessionId;
        data.ScriptId = scriptId;
        data.StartTime = msStartTime;
        data.ResponseTime = msResponseTime;
        (new AppLogger()).LogData(data);
    }
    OSFAppTelemetry.onScriptDone = onScriptDone;
    function onCallDone(apiType, id, parameters, msResponseTime, errorType) {
        if (!appInfo) {
            return;
        }
        var data = new OSFLog.APIUsageUsageData();
        data.CorrelationId = osfControlAppCorrelationId;
        data.SessionId = sessionId;
        data.APIType = apiType;
        data.APIID = id;
        data.Parameters = parameters;
        data.ResponseTime = msResponseTime;
        data.ErrorType = errorType;
        (new AppLogger()).LogData(data);
    }
    OSFAppTelemetry.onCallDone = onCallDone;
    ;
    function onMethodDone(id, args, msResponseTime, errorType) {
        var parameters = null;
        if (args) {
            if (typeof args == "number") {
                parameters = String(args);
            }
            else if (typeof args === "object") {
                for (var index in args) {
                    if (parameters !== null) {
                        parameters += ",";
                    }
                    else {
                        parameters = "";
                    }
                    if (typeof args[index] == "number") {
                        parameters += String(args[index]);
                    }
                }
            }
            else {
                parameters = "";
            }
        }
        OSF.AppTelemetry.onCallDone("method", id, parameters, msResponseTime, errorType);
    }
    OSFAppTelemetry.onMethodDone = onMethodDone;
    function onPropertyDone(propertyName, msResponseTime) {
        OSF.AppTelemetry.onCallDone("property", -1, propertyName, msResponseTime);
    }
    OSFAppTelemetry.onPropertyDone = onPropertyDone;
    function onEventDone(id, errorType) {
        OSF.AppTelemetry.onCallDone("event", id, null, 0, errorType);
    }
    OSFAppTelemetry.onEventDone = onEventDone;
    function onRegisterDone(register, id, msResponseTime, errorType) {
        OSF.AppTelemetry.onCallDone(register ? "registerevent" : "unregisterevent", id, null, msResponseTime, errorType);
    }
    OSFAppTelemetry.onRegisterDone = onRegisterDone;
    function onAppClosed(openTime, focusTime) {
        if (!appInfo) {
            return;
        }
        var data = new OSFLog.AppClosedUsageData();
        data.CorrelationId = osfControlAppCorrelationId;
        data.SessionId = sessionId;
        data.FocusTime = focusTime;
        data.OpenTime = openTime;
        data.AppSizeFinalWidth = window.innerWidth;
        data.AppSizeFinalHeight = window.innerHeight;
        (new AppStorage()).saveLog(sessionId, data.SerializeRow());
    }
    OSFAppTelemetry.onAppClosed = onAppClosed;
    function setOsfControlAppCorrelationId(correlationId) {
        osfControlAppCorrelationId = correlationId;
    }
    OSFAppTelemetry.setOsfControlAppCorrelationId = setOsfControlAppCorrelationId;
    function doAppInitializationLogging(isException, message) {
        var data = new OSFLog.AppInitializationUsageData();
        data.CorrelationId = osfControlAppCorrelationId;
        data.SessionId = sessionId;
        data.SuccessCode = isException ? 1 : 0;
        data.Message = message;
        (new AppLogger()).LogData(data);
    }
    OSFAppTelemetry.doAppInitializationLogging = doAppInitializationLogging;
    function logAppCommonMessage(message) {
        doAppInitializationLogging(false, message);
    }
    OSFAppTelemetry.logAppCommonMessage = logAppCommonMessage;
    function logAppException(errorMessage) {
        doAppInitializationLogging(true, errorMessage);
    }
    OSFAppTelemetry.logAppException = logAppException;
    OSF.AppTelemetry = OSFAppTelemetry;
})(OSFAppTelemetry || (OSFAppTelemetry = {}));
Microsoft.Office.WebExtension.TableData = function Microsoft_Office_WebExtension_TableData(rows, headers) {
    function fixData(data) {
        if (data == null || data == undefined) {
            return null;
        }
        try {
            for (var dim = OSF.DDA.DataCoercion.findArrayDimensionality(data, 2); dim < 2; dim++) {
                data = [data];
            }
            return data;
        }
        catch (ex) {
        }
    }
    ;
    OSF.OUtil.defineEnumerableProperties(this, {
        "headers": {
            get: function () { return headers; },
            set: function (value) {
                headers = fixData(value);
            }
        },
        "rows": {
            get: function () { return rows; },
            set: function (value) {
                rows = (value == null || (OSF.OUtil.isArray(value) && (value.length == 0))) ?
                    [] :
                    fixData(value);
            }
        }
    });
    this.headers = headers;
    this.rows = rows;
};
OSF.DDA.OMFactory = OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureTableData = function OSF_DDA_OMFactory$manufactureTableData(tableDataProperties) {
    return new Microsoft.Office.WebExtension.TableData(tableDataProperties[OSF.DDA.TableDataProperties.TableRows], tableDataProperties[OSF.DDA.TableDataProperties.TableHeaders]);
};
Microsoft.Office.WebExtension.CoercionType = {
    Text: "text",
    Matrix: "matrix",
    Table: "table"
};
OSF.DDA.DataCoercion = (function OSF_DDA_DataCoercion() {
    return {
        findArrayDimensionality: function OSF_DDA_DataCoercion$findArrayDimensionality(obj) {
            if (OSF.OUtil.isArray(obj)) {
                var dim = 0;
                for (var index = 0; index < obj.length; index++) {
                    dim = Math.max(dim, OSF.DDA.DataCoercion.findArrayDimensionality(obj[index]));
                }
                return dim + 1;
            }
            else {
                return 0;
            }
        },
        getCoercionDefaultForBinding: function OSF_DDA_DataCoercion$getCoercionDefaultForBinding(bindingType) {
            switch (bindingType) {
                case Microsoft.Office.WebExtension.BindingType.Matrix: return Microsoft.Office.WebExtension.CoercionType.Matrix;
                case Microsoft.Office.WebExtension.BindingType.Table: return Microsoft.Office.WebExtension.CoercionType.Table;
                case Microsoft.Office.WebExtension.BindingType.Text:
                default:
                    return Microsoft.Office.WebExtension.CoercionType.Text;
            }
        },
        getBindingDefaultForCoercion: function OSF_DDA_DataCoercion$getBindingDefaultForCoercion(coercionType) {
            switch (coercionType) {
                case Microsoft.Office.WebExtension.CoercionType.Matrix: return Microsoft.Office.WebExtension.BindingType.Matrix;
                case Microsoft.Office.WebExtension.CoercionType.Table: return Microsoft.Office.WebExtension.BindingType.Table;
                case Microsoft.Office.WebExtension.CoercionType.Text:
                case Microsoft.Office.WebExtension.CoercionType.Html:
                case Microsoft.Office.WebExtension.CoercionType.Ooxml:
                default:
                    return Microsoft.Office.WebExtension.BindingType.Text;
            }
        },
        determineCoercionType: function OSF_DDA_DataCoercion$determineCoercionType(data) {
            if (data == null || data == undefined)
                return null;
            var sourceType = null;
            var runtimeType = typeof data;
            if (data.rows !== undefined) {
                sourceType = Microsoft.Office.WebExtension.CoercionType.Table;
            }
            else if (OSF.OUtil.isArray(data)) {
                sourceType = Microsoft.Office.WebExtension.CoercionType.Matrix;
            }
            else if (runtimeType == "string" || runtimeType == "number" || runtimeType == "boolean" || OSF.OUtil.isDate(data)) {
                sourceType = Microsoft.Office.WebExtension.CoercionType.Text;
            }
            else {
                throw OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedDataObject;
            }
            return sourceType;
        },
        coerceData: function OSF_DDA_DataCoercion$coerceData(data, destinationType, sourceType) {
            sourceType = sourceType || OSF.DDA.DataCoercion.determineCoercionType(data);
            if (sourceType && sourceType != destinationType) {
                OSF.OUtil.writeProfilerMark(OSF.InternalPerfMarker.DataCoercionBegin);
                data = OSF.DDA.DataCoercion._coerceDataFromTable(destinationType, OSF.DDA.DataCoercion._coerceDataToTable(data, sourceType));
                OSF.OUtil.writeProfilerMark(OSF.InternalPerfMarker.DataCoercionEnd);
            }
            return data;
        },
        _matrixToText: function OSF_DDA_DataCoercion$_matrixToText(matrix) {
            if (matrix.length == 1 && matrix[0].length == 1)
                return "" + matrix[0][0];
            var val = "";
            for (var i = 0; i < matrix.length; i++) {
                val += matrix[i].join("\t") + "\n";
            }
            return val.substring(0, val.length - 1);
        },
        _textToMatrix: function OSF_DDA_DataCoercion$_textToMatrix(text) {
            var ret = text.split("\n");
            for (var i = 0; i < ret.length; i++)
                ret[i] = ret[i].split("\t");
            return ret;
        },
        _tableToText: function OSF_DDA_DataCoercion$_tableToText(table) {
            var headers = "";
            if (table.headers != null) {
                headers = OSF.DDA.DataCoercion._matrixToText([table.headers]) + "\n";
            }
            var rows = OSF.DDA.DataCoercion._matrixToText(table.rows);
            if (rows == "") {
                headers = headers.substring(0, headers.length - 1);
            }
            return headers + rows;
        },
        _tableToMatrix: function OSF_DDA_DataCoercion$_tableToMatrix(table) {
            var matrix = table.rows;
            if (table.headers != null) {
                matrix.unshift(table.headers);
            }
            return matrix;
        },
        _coerceDataFromTable: function OSF_DDA_DataCoercion$_coerceDataFromTable(coercionType, table) {
            var value;
            switch (coercionType) {
                case Microsoft.Office.WebExtension.CoercionType.Table:
                    value = table;
                    break;
                case Microsoft.Office.WebExtension.CoercionType.Matrix:
                    value = OSF.DDA.DataCoercion._tableToMatrix(table);
                    break;
                case Microsoft.Office.WebExtension.CoercionType.SlideRange:
                    value = null;
                    if (OSF.DDA.OMFactory.manufactureSlideRange) {
                        value = OSF.DDA.OMFactory.manufactureSlideRange(OSF.DDA.DataCoercion._tableToText(table));
                    }
                    if (value == null) {
                        value = OSF.DDA.DataCoercion._tableToText(table);
                    }
                    break;
                case Microsoft.Office.WebExtension.CoercionType.Text:
                case Microsoft.Office.WebExtension.CoercionType.Html:
                case Microsoft.Office.WebExtension.CoercionType.Ooxml:
                default:
                    value = OSF.DDA.DataCoercion._tableToText(table);
                    break;
            }
            return value;
        },
        _coerceDataToTable: function OSF_DDA_DataCoercion$_coerceDataToTable(data, sourceType) {
            if (sourceType == undefined) {
                sourceType = OSF.DDA.DataCoercion.determineCoercionType(data);
            }
            var value;
            switch (sourceType) {
                case Microsoft.Office.WebExtension.CoercionType.Table:
                    value = data;
                    break;
                case Microsoft.Office.WebExtension.CoercionType.Matrix:
                    value = new Microsoft.Office.WebExtension.TableData(data);
                    break;
                case Microsoft.Office.WebExtension.CoercionType.Text:
                case Microsoft.Office.WebExtension.CoercionType.Html:
                case Microsoft.Office.WebExtension.CoercionType.Ooxml:
                default:
                    value = new Microsoft.Office.WebExtension.TableData(OSF.DDA.DataCoercion._textToMatrix(data));
                    break;
            }
            return value;
        }
    };
})();
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.CoercionType, { SlideRange: "slideRange" });
OSF.DDA.SlideProperties = {
    Id: 0,
    Title: 1,
    Index: 2
};
OSF.DDA.Slide = function OSF_DDA_Slide(id, title, index) {
    OSF.OUtil.defineEnumerableProperties(this, {
        "id": {
            value: id
        },
        "title": {
            value: title
        },
        "index": {
            value: index
        }
    });
};
OSF.DDA.SlideRange = function OSF_DDA_SlideRange(slides) {
    OSF.OUtil.defineEnumerableProperties(this, {
        "slides": {
            value: slides
        }
    });
};
OSF.DDA.OMFactory = OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureSlideRange = function OSF_DDA_OMFactory$manufactureSlideRange(input) {
    var items = null;
    if (JSON) {
        items = JSON.parse(input);
    }
    else {
        items = Sys.Serialization.JavaScriptSerializer.deserialize(input);
    }
    if (items == null) {
        return null;
    }
    var numField = 0;
    for (var key in OSF.DDA.SlideProperties) {
        if (OSF.DDA.SlideProperties.hasOwnProperty(key)) {
            numField++;
        }
    }
    var slides = [];
    var dataValid = true;
    for (var i = 0; i < items.length && dataValid; i++) {
        dataValid = false;
        if (items[i].length == numField) {
            var id = parseInt(items[i][OSF.DDA.SlideProperties.Id]);
            var title = items[i][OSF.DDA.SlideProperties.Title];
            var index = parseInt(items[i][OSF.DDA.SlideProperties.Index]);
            if (!isNaN(id) && !isNaN(index)) {
                dataValid = true;
                slides.push(new OSF.DDA.Slide(id, title, index));
            }
        }
    }
    if (!dataValid) {
        return null;
    }
    return new OSF.DDA.SlideRange(slides);
};
Microsoft.Office.WebExtension.BindingType = {
    Table: "table",
    Text: "text",
    Matrix: "matrix"
};
OSF.DDA.BindingProperties = {
    Id: "BindingId",
    Type: Microsoft.Office.WebExtension.Parameters.BindingType
};
OSF.OUtil.augmentList(OSF.DDA.ListDescriptors, { BindingList: "BindingList" });
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
    Subset: "subset",
    BindingProperties: "BindingProperties"
});
OSF.DDA.ListType.setListType(OSF.DDA.ListDescriptors.BindingList, OSF.DDA.PropertyDescriptors.BindingProperties);
OSF.DDA.BindingPromise = function OSF_DDA_BindingPromise(bindingId, errorCallback) {
    this._id = bindingId;
    OSF.OUtil.defineEnumerableProperty(this, "onFail", {
        get: function () {
            return errorCallback;
        },
        set: function (onError) {
            var t = typeof onError;
            if (t != "undefined" && t != "function") {
                throw OSF.OUtil.formatString(Strings.OfficeOM.L_CallbackNotAFunction, t);
            }
            errorCallback = onError;
        }
    });
};
OSF.DDA.BindingPromise.prototype = {
    _fetch: function OSF_DDA_BindingPromise$_fetch(onComplete) {
        if (this.binding) {
            if (onComplete)
                onComplete(this.binding);
        }
        else {
            if (!this._binding) {
                var me = this;
                Microsoft.Office.WebExtension.context.document.bindings.getByIdAsync(this._id, function (asyncResult) {
                    if (asyncResult.status == Microsoft.Office.WebExtension.AsyncResultStatus.Succeeded) {
                        OSF.OUtil.defineEnumerableProperty(me, "binding", {
                            value: asyncResult.value
                        });
                        if (onComplete)
                            onComplete(me.binding);
                    }
                    else {
                        if (me.onFail)
                            me.onFail(asyncResult);
                    }
                });
            }
        }
        return this;
    },
    getDataAsync: function OSF_DDA_BindingPromise$getDataAsync() {
        var args = arguments;
        this._fetch(function onComplete(binding) { binding.getDataAsync.apply(binding, args); });
        return this;
    },
    setDataAsync: function OSF_DDA_BindingPromise$setDataAsync() {
        var args = arguments;
        this._fetch(function onComplete(binding) { binding.setDataAsync.apply(binding, args); });
        return this;
    },
    addHandlerAsync: function OSF_DDA_BindingPromise$addHandlerAsync() {
        var args = arguments;
        this._fetch(function onComplete(binding) { binding.addHandlerAsync.apply(binding, args); });
        return this;
    },
    removeHandlerAsync: function OSF_DDA_BindingPromise$removeHandlerAsync() {
        var args = arguments;
        this._fetch(function onComplete(binding) { binding.removeHandlerAsync.apply(binding, args); });
        return this;
    }
};
OSF.DDA.BindingFacade = function OSF_DDA_BindingFacade(docInstance) {
    this._eventDispatches = [];
    OSF.OUtil.defineEnumerableProperty(this, "document", {
        value: docInstance
    });
    var am = OSF.DDA.AsyncMethodNames;
    OSF.DDA.DispIdHost.addAsyncMethods(this, [
        am.AddFromSelectionAsync,
        am.AddFromNamedItemAsync,
        am.GetAllAsync,
        am.GetByIdAsync,
        am.ReleaseByIdAsync
    ]);
};
OSF.DDA.UnknownBinding = function OSF_DDA_UknonwnBinding(id, docInstance) {
    OSF.OUtil.defineEnumerableProperties(this, {
        "document": { value: docInstance },
        "id": { value: id }
    });
};
OSF.DDA.Binding = function OSF_DDA_Binding(id, docInstance) {
    OSF.OUtil.defineEnumerableProperties(this, {
        "document": {
            value: docInstance
        },
        "id": {
            value: id
        }
    });
    var am = OSF.DDA.AsyncMethodNames;
    OSF.DDA.DispIdHost.addAsyncMethods(this, [
        am.GetDataAsync,
        am.SetDataAsync
    ]);
    var et = Microsoft.Office.WebExtension.EventType;
    var bindingEventDispatches = docInstance.bindings._eventDispatches;
    if (!bindingEventDispatches[id]) {
        bindingEventDispatches[id] = new OSF.EventDispatch([
            et.BindingSelectionChanged,
            et.BindingDataChanged
        ]);
    }
    var eventDispatch = bindingEventDispatches[id];
    OSF.DDA.DispIdHost.addEventSupport(this, eventDispatch);
};
OSF.DDA.generateBindingId = function OSF_DDA$GenerateBindingId() {
    return "UnnamedBinding_" + OSF.OUtil.getUniqueId() + "_" + new Date().getTime();
};
OSF.DDA.OMFactory = OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureBinding = function OSF_DDA_OMFactory$manufactureBinding(bindingProperties, containingDocument) {
    var id = bindingProperties[OSF.DDA.BindingProperties.Id];
    var rows = bindingProperties[OSF.DDA.BindingProperties.RowCount];
    var cols = bindingProperties[OSF.DDA.BindingProperties.ColumnCount];
    var hasHeaders = bindingProperties[OSF.DDA.BindingProperties.HasHeaders];
    var binding;
    switch (bindingProperties[OSF.DDA.BindingProperties.Type]) {
        case Microsoft.Office.WebExtension.BindingType.Text:
            binding = new OSF.DDA.TextBinding(id, containingDocument);
            break;
        case Microsoft.Office.WebExtension.BindingType.Matrix:
            binding = new OSF.DDA.MatrixBinding(id, containingDocument, rows, cols);
            break;
        case Microsoft.Office.WebExtension.BindingType.Table:
            var isExcelApp = function () {
                return (OSF.DDA.ExcelDocument)
                    && (Microsoft.Office.WebExtension.context.document)
                    && (Microsoft.Office.WebExtension.context.document instanceof OSF.DDA.ExcelDocument);
            };
            var tableBindingObject;
            if (isExcelApp() && OSF.DDA.ExcelTableBinding) {
                tableBindingObject = OSF.DDA.ExcelTableBinding;
            }
            else {
                tableBindingObject = OSF.DDA.TableBinding;
            }
            binding = new tableBindingObject(id, containingDocument, rows, cols, hasHeaders);
            break;
        default:
            binding = new OSF.DDA.UnknownBinding(id, containingDocument);
    }
    return binding;
};
OSF.DDA.AsyncMethodNames.addNames({
    AddFromSelectionAsync: "addFromSelectionAsync",
    AddFromNamedItemAsync: "addFromNamedItemAsync",
    GetAllAsync: "getAllAsync",
    GetByIdAsync: "getByIdAsync",
    ReleaseByIdAsync: "releaseByIdAsync",
    GetDataAsync: "getDataAsync",
    SetDataAsync: "setDataAsync"
});
(function () {
    function processBinding(bindingDescriptor) {
        return OSF.DDA.OMFactory.manufactureBinding(bindingDescriptor, Microsoft.Office.WebExtension.context.document);
    }
    function getObjectId(obj) { return obj.id; }
    function processData(dataDescriptor, caller, callArgs) {
        var data = dataDescriptor[Microsoft.Office.WebExtension.Parameters.Data];
        if (OSF.DDA.TableDataProperties && data && (data[OSF.DDA.TableDataProperties.TableRows] != undefined || data[OSF.DDA.TableDataProperties.TableHeaders] != undefined)) {
            data = OSF.DDA.OMFactory.manufactureTableData(data);
        }
        data = OSF.DDA.DataCoercion.coerceData(data, callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType]);
        return data == undefined ? null : data;
    }
    OSF.DDA.AsyncMethodCalls.define({
        method: OSF.DDA.AsyncMethodNames.AddFromSelectionAsync,
        requiredArguments: [
            {
                "name": Microsoft.Office.WebExtension.Parameters.BindingType,
                "enum": Microsoft.Office.WebExtension.BindingType
            }
        ],
        supportedOptions: [{
                name: Microsoft.Office.WebExtension.Parameters.Id,
                value: {
                    "types": ["string"],
                    "calculate": OSF.DDA.generateBindingId
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.Columns,
                value: {
                    "types": ["object"],
                    "defaultValue": null
                }
            }
        ],
        privateStateCallbacks: [],
        onSucceeded: processBinding
    });
    OSF.DDA.AsyncMethodCalls.define({
        method: OSF.DDA.AsyncMethodNames.AddFromNamedItemAsync,
        requiredArguments: [{
                "name": Microsoft.Office.WebExtension.Parameters.ItemName,
                "types": ["string"]
            },
            {
                "name": Microsoft.Office.WebExtension.Parameters.BindingType,
                "enum": Microsoft.Office.WebExtension.BindingType
            }
        ],
        supportedOptions: [{
                name: Microsoft.Office.WebExtension.Parameters.Id,
                value: {
                    "types": ["string"],
                    "calculate": OSF.DDA.generateBindingId
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.Columns,
                value: {
                    "types": ["object"],
                    "defaultValue": null
                }
            }
        ],
        privateStateCallbacks: [
            {
                name: Microsoft.Office.WebExtension.Parameters.FailOnCollision,
                value: function () { return true; }
            }
        ],
        onSucceeded: processBinding
    });
    OSF.DDA.AsyncMethodCalls.define({
        method: OSF.DDA.AsyncMethodNames.GetAllAsync,
        requiredArguments: [],
        supportedOptions: [],
        privateStateCallbacks: [],
        onSucceeded: function (response) { return OSF.OUtil.mapList(response[OSF.DDA.ListDescriptors.BindingList], processBinding); }
    });
    OSF.DDA.AsyncMethodCalls.define({
        method: OSF.DDA.AsyncMethodNames.GetByIdAsync,
        requiredArguments: [
            {
                "name": Microsoft.Office.WebExtension.Parameters.Id,
                "types": ["string"]
            }
        ],
        supportedOptions: [],
        privateStateCallbacks: [],
        onSucceeded: processBinding
    });
    OSF.DDA.AsyncMethodCalls.define({
        method: OSF.DDA.AsyncMethodNames.ReleaseByIdAsync,
        requiredArguments: [
            {
                "name": Microsoft.Office.WebExtension.Parameters.Id,
                "types": ["string"]
            }
        ],
        supportedOptions: [],
        privateStateCallbacks: [],
        onSucceeded: function (response, caller, callArgs) {
            var id = callArgs[Microsoft.Office.WebExtension.Parameters.Id];
            delete caller._eventDispatches[id];
        }
    });
    OSF.DDA.AsyncMethodCalls.define({
        method: OSF.DDA.AsyncMethodNames.GetDataAsync,
        requiredArguments: [],
        supportedOptions: [{
                name: Microsoft.Office.WebExtension.Parameters.CoercionType,
                value: {
                    "enum": Microsoft.Office.WebExtension.CoercionType,
                    "calculate": function (requiredArgs, binding) { return OSF.DDA.DataCoercion.getCoercionDefaultForBinding(binding.type); }
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.ValueFormat,
                value: {
                    "enum": Microsoft.Office.WebExtension.ValueFormat,
                    "defaultValue": Microsoft.Office.WebExtension.ValueFormat.Unformatted
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.FilterType,
                value: {
                    "enum": Microsoft.Office.WebExtension.FilterType,
                    "defaultValue": Microsoft.Office.WebExtension.FilterType.All
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.Rows,
                value: {
                    "types": ["object", "string"],
                    "defaultValue": null
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.Columns,
                value: {
                    "types": ["object"],
                    "defaultValue": null
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.StartRow,
                value: {
                    "types": ["number"],
                    "defaultValue": 0
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.StartColumn,
                value: {
                    "types": ["number"],
                    "defaultValue": 0
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.RowCount,
                value: {
                    "types": ["number"],
                    "defaultValue": 0
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.ColumnCount,
                value: {
                    "types": ["number"],
                    "defaultValue": 0
                }
            }
        ],
        checkCallArgs: function (callArgs, caller, stateInfo) {
            if (callArgs[Microsoft.Office.WebExtension.Parameters.StartRow] == 0 &&
                callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn] == 0 &&
                callArgs[Microsoft.Office.WebExtension.Parameters.RowCount] == 0 &&
                callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount] == 0) {
                delete callArgs[Microsoft.Office.WebExtension.Parameters.StartRow];
                delete callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn];
                delete callArgs[Microsoft.Office.WebExtension.Parameters.RowCount];
                delete callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount];
            }
            if (callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType] != OSF.DDA.DataCoercion.getCoercionDefaultForBinding(caller.type) &&
                (callArgs[Microsoft.Office.WebExtension.Parameters.StartRow] ||
                    callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn] ||
                    callArgs[Microsoft.Office.WebExtension.Parameters.RowCount] ||
                    callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount])) {
                throw OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding;
            }
            return callArgs;
        },
        privateStateCallbacks: [
            {
                name: Microsoft.Office.WebExtension.Parameters.Id,
                value: getObjectId
            }
        ],
        onSucceeded: processData
    });
    OSF.DDA.AsyncMethodCalls.define({
        method: OSF.DDA.AsyncMethodNames.SetDataAsync,
        requiredArguments: [
            {
                "name": Microsoft.Office.WebExtension.Parameters.Data,
                "types": ["string", "object", "number", "boolean"]
            }
        ],
        supportedOptions: [{
                name: Microsoft.Office.WebExtension.Parameters.CoercionType,
                value: {
                    "enum": Microsoft.Office.WebExtension.CoercionType,
                    "calculate": function (requiredArgs) { return OSF.DDA.DataCoercion.determineCoercionType(requiredArgs[Microsoft.Office.WebExtension.Parameters.Data]); }
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.Rows,
                value: {
                    "types": ["object", "string"],
                    "defaultValue": null
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.Columns,
                value: {
                    "types": ["object"],
                    "defaultValue": null
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.StartRow,
                value: {
                    "types": ["number"],
                    "defaultValue": 0
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.StartColumn,
                value: {
                    "types": ["number"],
                    "defaultValue": 0
                }
            }
        ],
        checkCallArgs: function (callArgs, caller, stateInfo) {
            if (callArgs[Microsoft.Office.WebExtension.Parameters.StartRow] == 0 &&
                callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn] == 0) {
                delete callArgs[Microsoft.Office.WebExtension.Parameters.StartRow];
                delete callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn];
            }
            if (callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType] != OSF.DDA.DataCoercion.getCoercionDefaultForBinding(caller.type) &&
                (callArgs[Microsoft.Office.WebExtension.Parameters.StartRow] ||
                    callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn])) {
                throw OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding;
            }
            return callArgs;
        },
        privateStateCallbacks: [
            {
                name: Microsoft.Office.WebExtension.Parameters.Id,
                value: getObjectId
            }
        ]
    });
})();
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, { TableDataProperties: "TableDataProperties" });
OSF.OUtil.augmentList(OSF.DDA.BindingProperties, {
    RowCount: "BindingRowCount",
    ColumnCount: "BindingColumnCount",
    HasHeaders: "HasHeaders"
});
OSF.DDA.TableDataProperties = {
    TableRows: "TableRows",
    TableHeaders: "TableHeaders"
};
OSF.DDA.TableBinding = function OSF_DDA_TableBinding(id, docInstance, rows, cols, hasHeaders) {
    OSF.DDA.TableBinding.uber.constructor.call(this, id, docInstance);
    OSF.OUtil.defineEnumerableProperties(this, {
        "type": {
            value: Microsoft.Office.WebExtension.BindingType.Table
        },
        "rowCount": {
            value: rows ? rows : 0
        },
        "columnCount": {
            value: cols ? cols : 0
        },
        "hasHeaders": {
            value: hasHeaders ? hasHeaders : false
        }
    });
    var am = OSF.DDA.AsyncMethodNames;
    OSF.DDA.DispIdHost.addAsyncMethods(this, [
        am.AddRowsAsync,
        am.AddColumnsAsync,
        am.DeleteAllDataValuesAsync
    ]);
};
OSF.OUtil.extend(OSF.DDA.TableBinding, OSF.DDA.Binding);
OSF.DDA.AsyncMethodNames.addNames({
    AddRowsAsync: "addRowsAsync",
    AddColumnsAsync: "addColumnsAsync",
    DeleteAllDataValuesAsync: "deleteAllDataValuesAsync"
});
(function () {
    function getObjectId(obj) { return obj.id; }
    OSF.DDA.AsyncMethodCalls.define({
        method: OSF.DDA.AsyncMethodNames.AddRowsAsync,
        requiredArguments: [
            {
                "name": Microsoft.Office.WebExtension.Parameters.Data,
                "types": ["object"]
            }
        ],
        supportedOptions: [],
        privateStateCallbacks: [
            {
                name: Microsoft.Office.WebExtension.Parameters.Id,
                value: getObjectId
            }
        ]
    });
    OSF.DDA.AsyncMethodCalls.define({
        method: OSF.DDA.AsyncMethodNames.AddColumnsAsync,
        requiredArguments: [
            {
                "name": Microsoft.Office.WebExtension.Parameters.Data,
                "types": ["object"]
            }
        ],
        supportedOptions: [],
        privateStateCallbacks: [
            {
                name: Microsoft.Office.WebExtension.Parameters.Id,
                value: getObjectId
            }
        ]
    });
    OSF.DDA.AsyncMethodCalls.define({
        method: OSF.DDA.AsyncMethodNames.DeleteAllDataValuesAsync,
        requiredArguments: [],
        supportedOptions: [],
        privateStateCallbacks: [
            {
                name: Microsoft.Office.WebExtension.Parameters.Id,
                value: getObjectId
            }
        ]
    });
})();
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.WAC.UniqueArguments.GetData,
    toHost: [
        { name: Microsoft.Office.WebExtension.Parameters.Id, value: "BindingId" },
        { name: Microsoft.Office.WebExtension.Parameters.CoercionType, value: "CoerceType" },
        { name: Microsoft.Office.WebExtension.Parameters.ValueFormat, value: "ValueFormat" },
        { name: Microsoft.Office.WebExtension.Parameters.FilterType, value: "FilterType" },
        { name: Microsoft.Office.WebExtension.Parameters.Rows, value: "Rows" },
        { name: Microsoft.Office.WebExtension.Parameters.Columns, value: "Columns" },
        { name: Microsoft.Office.WebExtension.Parameters.StartRow, value: "StartRow" },
        { name: Microsoft.Office.WebExtension.Parameters.StartColumn, value: "StartCol" },
        { name: Microsoft.Office.WebExtension.Parameters.RowCount, value: "RowCount" },
        { name: Microsoft.Office.WebExtension.Parameters.ColumnCount, value: "ColCount" }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.WAC.UniqueArguments.SetData,
    toHost: [
        { name: Microsoft.Office.WebExtension.Parameters.Id, value: "BindingId" },
        { name: Microsoft.Office.WebExtension.Parameters.CoercionType, value: "CoerceType" },
        { name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data },
        { name: Microsoft.Office.WebExtension.Parameters.Rows, value: "Rows" },
        { name: Microsoft.Office.WebExtension.Parameters.Columns, value: "Columns" },
        { name: Microsoft.Office.WebExtension.Parameters.StartRow, value: "StartRow" },
        { name: Microsoft.Office.WebExtension.Parameters.StartColumn, value: "StartCol" },
        { name: Microsoft.Office.WebExtension.Parameters.ImageLeft, value: "ImageLeft" },
        { name: Microsoft.Office.WebExtension.Parameters.ImageTop, value: "ImageTop" },
        { name: Microsoft.Office.WebExtension.Parameters.ImageWidth, value: "ImageWidth" },
        { name: Microsoft.Office.WebExtension.Parameters.ImageHeight, value: "ImageHeight" }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.PropertyDescriptors.BindingProperties);
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.WAC.UniqueArguments.BindingRequest,
    toHost: [
        { name: Microsoft.Office.WebExtension.Parameters.ItemName, value: "ItemName" },
        { name: Microsoft.Office.WebExtension.Parameters.Id, value: "BindingId" },
        { name: Microsoft.Office.WebExtension.Parameters.BindingType, value: "BindingType" },
        { name: Microsoft.Office.WebExtension.Parameters.PromptText, value: "PromptText" },
        { name: Microsoft.Office.WebExtension.Parameters.Columns, value: "Columns" },
        { name: Microsoft.Office.WebExtension.Parameters.SampleData, value: "SampleData" },
        { name: Microsoft.Office.WebExtension.Parameters.FailOnCollision, value: "FailOnCollision" }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.BindingType,
    toHost: [
        { name: Microsoft.Office.WebExtension.BindingType.Text, value: 2 },
        { name: Microsoft.Office.WebExtension.BindingType.Matrix, value: 3 },
        { name: Microsoft.Office.WebExtension.BindingType.Table, value: 1 }
    ],
    invertible: true
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.PropertyDescriptors.BindingProperties,
    fromHost: [
        { name: OSF.DDA.BindingProperties.Id, value: "Name" },
        { name: OSF.DDA.BindingProperties.Type, value: "BindingType" },
        { name: OSF.DDA.BindingProperties.RowCount, value: "RowCount" },
        { name: OSF.DDA.BindingProperties.ColumnCount, value: "ColCount" },
        { name: OSF.DDA.BindingProperties.HasHeaders, value: "HasHeaders" }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.WAC.UniqueArguments.SingleBindingResponse,
    fromHost: [
        { name: OSF.DDA.PropertyDescriptors.BindingProperties, value: 0 }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidAddBindingFromSelectionMethod,
    fromHost: [
        { name: OSF.DDA.WAC.UniqueArguments.SingleBindingResponse, value: OSF.DDA.WAC.UniqueArguments.BindingResponse }
    ],
    toHost: [
        { name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidAddBindingFromNamedItemMethod,
    fromHost: [
        { name: OSF.DDA.WAC.UniqueArguments.SingleBindingResponse, value: OSF.DDA.WAC.UniqueArguments.BindingResponse }
    ],
    toHost: [
        { name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidReleaseBindingMethod,
    toHost: [
        { name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetBindingMethod,
    fromHost: [
        { name: OSF.DDA.WAC.UniqueArguments.SingleBindingResponse, value: OSF.DDA.WAC.UniqueArguments.BindingResponse }
    ],
    toHost: [
        { name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetAllBindingsMethod,
    fromHost: [
        { name: OSF.DDA.ListDescriptors.BindingList, value: OSF.DDA.WAC.UniqueArguments.BindingResponse }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetBindingDataMethod,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data }
    ],
    toHost: [
        { name: OSF.DDA.WAC.UniqueArguments.GetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidSetBindingDataMethod,
    toHost: [
        { name: OSF.DDA.WAC.UniqueArguments.SetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidAddRowsMethod,
    toHost: [
        { name: OSF.DDA.WAC.UniqueArguments.AddRowsColumns, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidAddColumnsMethod,
    toHost: [
        { name: OSF.DDA.WAC.UniqueArguments.AddRowsColumns, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidClearAllRowsMethod,
    toHost: [
        { name: OSF.DDA.WAC.UniqueArguments.BindingRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.WAC.UniqueArguments.AddRowsColumns,
    toHost: [
        { name: Microsoft.Office.WebExtension.Parameters.Id, value: "BindingId" },
        { name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.PropertyDescriptors.Subset,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.StartRow, value: "StartRow" },
        { name: Microsoft.Office.WebExtension.Parameters.StartColumn, value: "StartCol" },
        { name: Microsoft.Office.WebExtension.Parameters.RowCount, value: "RowCount" },
        { name: Microsoft.Office.WebExtension.Parameters.ColumnCount, value: "ColCount" }
    ]
});
OSF.DDA.AsyncMethodNames.addNames({
    GetSelectedDataAsync: "getSelectedDataAsync",
    SetSelectedDataAsync: "setSelectedDataAsync"
});
(function () {
    function processData(dataDescriptor, caller, callArgs) {
        var data = dataDescriptor[Microsoft.Office.WebExtension.Parameters.Data];
        if (OSF.DDA.TableDataProperties && data && (data[OSF.DDA.TableDataProperties.TableRows] != undefined || data[OSF.DDA.TableDataProperties.TableHeaders] != undefined)) {
            data = OSF.DDA.OMFactory.manufactureTableData(data);
        }
        data = OSF.DDA.DataCoercion.coerceData(data, callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType]);
        return data == undefined ? null : data;
    }
    OSF.DDA.AsyncMethodCalls.define({
        method: OSF.DDA.AsyncMethodNames.GetSelectedDataAsync,
        requiredArguments: [
            {
                "name": Microsoft.Office.WebExtension.Parameters.CoercionType,
                "enum": Microsoft.Office.WebExtension.CoercionType
            }
        ],
        supportedOptions: [
            {
                name: Microsoft.Office.WebExtension.Parameters.ValueFormat,
                value: {
                    "enum": Microsoft.Office.WebExtension.ValueFormat,
                    "defaultValue": Microsoft.Office.WebExtension.ValueFormat.Unformatted
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.FilterType,
                value: {
                    "enum": Microsoft.Office.WebExtension.FilterType,
                    "defaultValue": Microsoft.Office.WebExtension.FilterType.All
                }
            }
        ],
        privateStateCallbacks: [],
        onSucceeded: processData
    });
    OSF.DDA.AsyncMethodCalls.define({
        method: OSF.DDA.AsyncMethodNames.SetSelectedDataAsync,
        requiredArguments: [
            {
                "name": Microsoft.Office.WebExtension.Parameters.Data,
                "types": ["string", "object", "number", "boolean"]
            }
        ],
        supportedOptions: [
            {
                name: Microsoft.Office.WebExtension.Parameters.CoercionType,
                value: {
                    "enum": Microsoft.Office.WebExtension.CoercionType,
                    "calculate": function (requiredArgs) {
                        return OSF.DDA.DataCoercion.determineCoercionType(requiredArgs[Microsoft.Office.WebExtension.Parameters.Data]);
                    }
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.ImageLeft,
                value: {
                    "types": ["number", "boolean"],
                    "defaultValue": false
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.ImageTop,
                value: {
                    "types": ["number", "boolean"],
                    "defaultValue": false
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.ImageWidth,
                value: {
                    "types": ["number", "boolean"],
                    "defaultValue": false
                }
            },
            {
                name: Microsoft.Office.WebExtension.Parameters.ImageHeight,
                value: {
                    "types": ["number", "boolean"],
                    "defaultValue": false
                }
            }
        ],
        privateStateCallbacks: []
    });
})();
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetSelectedDataMethod,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.WAC.UniqueArguments.Data }
    ],
    toHost: [
        { name: OSF.DDA.WAC.UniqueArguments.GetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidSetSelectedDataMethod,
    toHost: [
        { name: OSF.DDA.WAC.UniqueArguments.SetData, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
Microsoft.Office.WebExtension.EventType = {};
OSF.EventDispatch = function OSF_EventDispatch(eventTypes) {
    this._eventHandlers = {};
    this._queuedEventsArgs = {};
    for (var entry in eventTypes) {
        var eventType = eventTypes[entry];
        this._eventHandlers[eventType] = [];
        this._queuedEventsArgs[eventType] = [];
    }
};
OSF.EventDispatch.prototype = {
    getSupportedEvents: function OSF_EventDispatch$getSupportedEvents() {
        var events = [];
        for (var eventName in this._eventHandlers)
            events.push(eventName);
        return events;
    },
    supportsEvent: function OSF_EventDispatch$supportsEvent(event) {
        var isSupported = false;
        for (var eventName in this._eventHandlers) {
            if (event == eventName) {
                isSupported = true;
                break;
            }
        }
        return isSupported;
    },
    hasEventHandler: function OSF_EventDispatch$hasEventHandler(eventType, handler) {
        var handlers = this._eventHandlers[eventType];
        if (handlers && handlers.length > 0) {
            for (var h in handlers) {
                if (handlers[h] === handler)
                    return true;
            }
        }
        return false;
    },
    addEventHandler: function OSF_EventDispatch$addEventHandler(eventType, handler) {
        if (typeof handler != "function") {
            return false;
        }
        var handlers = this._eventHandlers[eventType];
        if (handlers && !this.hasEventHandler(eventType, handler)) {
            handlers.push(handler);
            return true;
        }
        else {
            return false;
        }
    },
    addEventHandlerAndFireQueuedEvent: function OSF_EventDispatch$addEventHandlerAndFireQueuedEvent(eventType, handler) {
        var handlers = this._eventHandlers[eventType];
        var isFirstHandler = handlers.length == 0;
        var succeed = this.addEventHandler(eventType, handler);
        if (isFirstHandler && succeed) {
            this.fireQueuedEvent(eventType);
        }
        return succeed;
    },
    removeEventHandler: function OSF_EventDispatch$removeEventHandler(eventType, handler) {
        var handlers = this._eventHandlers[eventType];
        if (handlers && handlers.length > 0) {
            for (var index = 0; index < handlers.length; index++) {
                if (handlers[index] === handler) {
                    handlers.splice(index, 1);
                    return true;
                }
            }
        }
        return false;
    },
    clearEventHandlers: function OSF_EventDispatch$clearEventHandlers(eventType) {
        if (typeof this._eventHandlers[eventType] != "undefined" && this._eventHandlers[eventType].length > 0) {
            this._eventHandlers[eventType] = [];
            return true;
        }
        return false;
    },
    getEventHandlerCount: function OSF_EventDispatch$getEventHandlerCount(eventType) {
        return this._eventHandlers[eventType] != undefined ? this._eventHandlers[eventType].length : -1;
    },
    fireEvent: function OSF_EventDispatch$fireEvent(eventArgs) {
        if (eventArgs.type == undefined)
            return false;
        var eventType = eventArgs.type;
        if (eventType && this._eventHandlers[eventType]) {
            var eventHandlers = this._eventHandlers[eventType];
            for (var handler in eventHandlers)
                eventHandlers[handler](eventArgs);
            return true;
        }
        else {
            return false;
        }
    },
    fireOrQueueEvent: function OSF_EventDispatch$fireOrQueueEvent(eventArgs) {
        var eventType = eventArgs.type;
        if (eventType && this._eventHandlers[eventType]) {
            var eventHandlers = this._eventHandlers[eventType];
            var queuedEvents = this._queuedEventsArgs[eventType];
            if (eventHandlers.length == 0) {
                queuedEvents.push(eventArgs);
            }
            else {
                this.fireEvent(eventArgs);
            }
            return true;
        }
        else {
            return false;
        }
    },
    fireQueuedEvent: function OSF_EventDispatch$queueEvent(eventType) {
        if (eventType && this._eventHandlers[eventType]) {
            var eventHandlers = this._eventHandlers[eventType];
            var queuedEvents = this._queuedEventsArgs[eventType];
            if (eventHandlers.length > 0) {
                var eventHandler = eventHandlers[0];
                while (queuedEvents.length > 0) {
                    var eventArgs = queuedEvents.shift();
                    eventHandler(eventArgs);
                }
                return true;
            }
        }
        return false;
    }
};
OSF.DDA.OMFactory = OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureEventArgs = function OSF_DDA_OMFactory$manufactureEventArgs(eventType, target, eventProperties) {
    var args;
    switch (eventType) {
        case Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged:
            args = new OSF.DDA.DocumentSelectionChangedEventArgs(target);
            break;
        case Microsoft.Office.WebExtension.EventType.BindingSelectionChanged:
            args = new OSF.DDA.BindingSelectionChangedEventArgs(this.manufactureBinding(eventProperties, target.document), eventProperties[OSF.DDA.PropertyDescriptors.Subset]);
            break;
        case Microsoft.Office.WebExtension.EventType.BindingDataChanged:
            args = new OSF.DDA.BindingDataChangedEventArgs(this.manufactureBinding(eventProperties, target.document));
            break;
        case Microsoft.Office.WebExtension.EventType.SettingsChanged:
            args = new OSF.DDA.SettingsChangedEventArgs(target);
            break;
        case Microsoft.Office.WebExtension.EventType.ActiveViewChanged:
            args = new OSF.DDA.ActiveViewChangedEventArgs(eventProperties);
            break;
        case Microsoft.Office.WebExtension.EventType.OfficeThemeChanged:
            args = new OSF.DDA.Theming.OfficeThemeChangedEventArgs(eventProperties);
            break;
        case Microsoft.Office.WebExtension.EventType.DocumentThemeChanged:
            args = new OSF.DDA.Theming.DocumentThemeChangedEventArgs(eventProperties);
            break;
        case Microsoft.Office.WebExtension.EventType.AppCommandInvoked:
            args = OSF.DDA.AppCommand.AppCommandInvokedEventArgs.create(eventProperties);
            break;
        case Microsoft.Office.WebExtension.EventType.DataNodeInserted:
            args = new OSF.DDA.NodeInsertedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NewNode]), eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
            break;
        case Microsoft.Office.WebExtension.EventType.DataNodeReplaced:
            args = new OSF.DDA.NodeReplacedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.OldNode]), this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NewNode]), eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
            break;
        case Microsoft.Office.WebExtension.EventType.DataNodeDeleted:
            args = new OSF.DDA.NodeDeletedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.OldNode]), this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NextSiblingNode]), eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
            break;
        case Microsoft.Office.WebExtension.EventType.TaskSelectionChanged:
            args = new OSF.DDA.TaskSelectionChangedEventArgs(target);
            break;
        case Microsoft.Office.WebExtension.EventType.ResourceSelectionChanged:
            args = new OSF.DDA.ResourceSelectionChangedEventArgs(target);
            break;
        case Microsoft.Office.WebExtension.EventType.ViewSelectionChanged:
            args = new OSF.DDA.ViewSelectionChangedEventArgs(target);
            break;
        case Microsoft.Office.WebExtension.EventType.DialogMessageReceived:
            args = new OSF.DDA.DialogEventArgs(eventProperties);
            break;
        case Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived:
            args = new OSF.DDA.DialogParentEventArgs(eventProperties);
            break;
        case Microsoft.Office.WebExtension.EventType.ItemChanged:
            if (OSF._OfficeAppFactory.getHostInfo()["hostType"] == "outlook" || OSF._OfficeAppFactory.getHostInfo()["hostType"] == "outlookwebapp") {
                args = new OSF.DDA.OlkItemSelectedChangedEventArgs(eventProperties);
                target.initialize(args["initialData"]);
                target.setCurrentItemNumber(args["itemNumber"].itemNumber);
            }
            else {
                throw OsfMsAjaxFactory.msAjaxError.argument(Microsoft.Office.WebExtension.Parameters.EventType, OSF.OUtil.formatString(Strings.OfficeOM.L_NotSupportedEventType, eventType));
            }
            break;
        default:
            throw OsfMsAjaxFactory.msAjaxError.argument(Microsoft.Office.WebExtension.Parameters.EventType, OSF.OUtil.formatString(Strings.OfficeOM.L_NotSupportedEventType, eventType));
    }
    return args;
};
OSF.DDA.AsyncMethodNames.addNames({
    AddHandlerAsync: "addHandlerAsync",
    RemoveHandlerAsync: "removeHandlerAsync"
});
OSF.DDA.AsyncMethodCalls.define({
    method: OSF.DDA.AsyncMethodNames.AddHandlerAsync,
    requiredArguments: [{
            "name": Microsoft.Office.WebExtension.Parameters.EventType,
            "enum": Microsoft.Office.WebExtension.EventType,
            "verify": function (eventType, caller, eventDispatch) { return eventDispatch.supportsEvent(eventType); }
        },
        {
            "name": Microsoft.Office.WebExtension.Parameters.Handler,
            "types": ["function"]
        }
    ],
    supportedOptions: [],
    privateStateCallbacks: []
});
OSF.DDA.AsyncMethodCalls.define({
    method: OSF.DDA.AsyncMethodNames.RemoveHandlerAsync,
    requiredArguments: [
        {
            "name": Microsoft.Office.WebExtension.Parameters.EventType,
            "enum": Microsoft.Office.WebExtension.EventType,
            "verify": function (eventType, caller, eventDispatch) { return eventDispatch.supportsEvent(eventType); }
        }
    ],
    supportedOptions: [
        {
            name: Microsoft.Office.WebExtension.Parameters.Handler,
            value: {
                "types": ["function", "object"],
                "defaultValue": null
            }
        }
    ],
    privateStateCallbacks: []
});
OSF.OUtil.augmentList(OSF.DDA.EventDescriptors, { ActiveViewChangedEvent: "ActiveViewChangedEvent" });
Microsoft.Office.WebExtension.ActiveView = {
    Read: "read",
    Edit: "edit"
};
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
    ActiveViewChanged: "activeViewChanged"
});
OSF.DDA.AsyncMethodNames.addNames({
    GetActiveViewAsync: "getActiveViewAsync"
});
OSF.DDA.AsyncMethodCalls.define({
    method: OSF.DDA.AsyncMethodNames.GetActiveViewAsync,
    requiredArguments: [],
    supportedOptions: [],
    privateStateCallbacks: [],
    onSucceeded: function (response) {
        var data = response[Microsoft.Office.WebExtension.Parameters.ActiveView];
        return data == undefined ? null : data;
    }
});
OSF.DDA.ActiveViewChangedEventArgs = function OSF_DDA_ActiveViewChangedEventArgs(activeView) {
    OSF.OUtil.defineEnumerableProperties(this, {
        "type": {
            value: Microsoft.Office.WebExtension.EventType.ActiveViewChanged
        },
        "activeView": {
            value: activeView.activeView
        }
    });
};
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetActiveViewMethod,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.ActiveView, value: Microsoft.Office.WebExtension.Parameters.Data }
    ]
});
Microsoft.Office.WebExtension.GoToType = {
    Binding: "binding",
    NamedItem: "namedItem",
    Slide: "slide",
    Index: "index"
};
Microsoft.Office.WebExtension.SelectionMode = {
    Default: "default",
    Selected: "selected",
    None: "none"
};
Microsoft.Office.WebExtension.Index = {
    First: "first",
    Last: "last",
    Next: "next",
    Previous: "previous"
};
OSF.DDA.AsyncMethodNames.addNames({ GoToByIdAsync: "goToByIdAsync" });
OSF.DDA.AsyncMethodCalls.define({
    method: OSF.DDA.AsyncMethodNames.GoToByIdAsync,
    requiredArguments: [{
            "name": Microsoft.Office.WebExtension.Parameters.Id,
            "types": ["string", "number"]
        },
        {
            "name": Microsoft.Office.WebExtension.Parameters.GoToType,
            "enum": Microsoft.Office.WebExtension.GoToType
        }
    ],
    supportedOptions: [
        {
            name: Microsoft.Office.WebExtension.Parameters.SelectionMode,
            value: {
                "enum": Microsoft.Office.WebExtension.SelectionMode,
                "defaultValue": Microsoft.Office.WebExtension.SelectionMode.Default
            }
        }
    ]
});
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.DDA.Marshaling.NavigationKeys = {
    NavigationRequest: "DdaGoToByIdMethod",
    Id: "Id",
    GoToType: "GoToType",
    SelectionMode: "SelectionMode"
};
var OSF_DDA_Marshaling_GoToType;
(function (OSF_DDA_Marshaling_GoToType) {
    OSF_DDA_Marshaling_GoToType[OSF_DDA_Marshaling_GoToType["Binding"] = 0] = "Binding";
    OSF_DDA_Marshaling_GoToType[OSF_DDA_Marshaling_GoToType["NamedItem"] = 1] = "NamedItem";
    OSF_DDA_Marshaling_GoToType[OSF_DDA_Marshaling_GoToType["Slide"] = 2] = "Slide";
    OSF_DDA_Marshaling_GoToType[OSF_DDA_Marshaling_GoToType["Index"] = 3] = "Index";
})(OSF_DDA_Marshaling_GoToType || (OSF_DDA_Marshaling_GoToType = {}));
;
OSF.DDA.Marshaling.GoToType = OSF_DDA_Marshaling_GoToType;
var OSF_DDA_Marshaling_SelectionMode;
(function (OSF_DDA_Marshaling_SelectionMode) {
    OSF_DDA_Marshaling_SelectionMode[OSF_DDA_Marshaling_SelectionMode["Default"] = 0] = "Default";
    OSF_DDA_Marshaling_SelectionMode[OSF_DDA_Marshaling_SelectionMode["Selected"] = 1] = "Selected";
    OSF_DDA_Marshaling_SelectionMode[OSF_DDA_Marshaling_SelectionMode["None"] = 2] = "None";
})(OSF_DDA_Marshaling_SelectionMode || (OSF_DDA_Marshaling_SelectionMode = {}));
;
OSF.DDA.Marshaling.SelectionMode = OSF_DDA_Marshaling_SelectionMode;
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.Marshaling.NavigationKeys.NavigationRequest);
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.Marshaling.NavigationKeys.NavigationRequest,
    toHost: [
        { name: Microsoft.Office.WebExtension.Parameters.Id, value: OSF.DDA.Marshaling.NavigationKeys.Id },
        { name: Microsoft.Office.WebExtension.Parameters.GoToType, value: OSF.DDA.Marshaling.NavigationKeys.GoToType },
        { name: Microsoft.Office.WebExtension.Parameters.SelectionMode, value: OSF.DDA.Marshaling.NavigationKeys.SelectionMode }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.GoToType,
    toHost: [
        { name: Microsoft.Office.WebExtension.GoToType.Binding, value: OSF.DDA.Marshaling.GoToType.Binding },
        { name: Microsoft.Office.WebExtension.GoToType.NamedItem, value: OSF.DDA.Marshaling.GoToType.NamedItem },
        { name: Microsoft.Office.WebExtension.GoToType.Slide, value: OSF.DDA.Marshaling.GoToType.Slide },
        { name: Microsoft.Office.WebExtension.GoToType.Index, value: OSF.DDA.Marshaling.GoToType.Index }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.SelectionMode,
    toHost: [
        { name: Microsoft.Office.WebExtension.SelectionMode.Default, value: OSF.DDA.Marshaling.SelectionMode.Default },
        { name: Microsoft.Office.WebExtension.SelectionMode.Selected, value: OSF.DDA.Marshaling.SelectionMode.Selected },
        { name: Microsoft.Office.WebExtension.SelectionMode.None, value: OSF.DDA.Marshaling.SelectionMode.None }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidNavigateToMethod,
    toHost: [
        { name: OSF.DDA.Marshaling.NavigationKeys.NavigationRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
Microsoft.Office.WebExtension.FileType = {
    Text: "text",
    Compressed: "compressed",
    Pdf: "pdf"
};
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
    FileProperties: "FileProperties",
    FileSliceProperties: "FileSliceProperties"
});
OSF.DDA.FileProperties = {
    Handle: "FileHandle",
    FileSize: "FileSize",
    SliceSize: Microsoft.Office.WebExtension.Parameters.SliceSize
};
OSF.DDA.File = function OSF_DDA_File(handle, fileSize, sliceSize) {
    OSF.OUtil.defineEnumerableProperties(this, {
        "size": {
            value: fileSize
        },
        "sliceCount": {
            value: Math.ceil(fileSize / sliceSize)
        }
    });
    var privateState = {};
    privateState[OSF.DDA.FileProperties.Handle] = handle;
    privateState[OSF.DDA.FileProperties.SliceSize] = sliceSize;
    var am = OSF.DDA.AsyncMethodNames;
    OSF.DDA.DispIdHost.addAsyncMethods(this, [
        am.GetDocumentCopyChunkAsync,
        am.ReleaseDocumentCopyAsync
    ], privateState);
};
OSF.DDA.FileSliceOffset = "fileSliceoffset";
OSF.DDA.AsyncMethodNames.addNames({
    GetDocumentCopyAsync: "getFileAsync",
    GetDocumentCopyChunkAsync: "getSliceAsync",
    ReleaseDocumentCopyAsync: "closeAsync"
});
OSF.DDA.AsyncMethodCalls.define({
    method: OSF.DDA.AsyncMethodNames.GetDocumentCopyAsync,
    requiredArguments: [
        {
            "name": Microsoft.Office.WebExtension.Parameters.FileType,
            "enum": Microsoft.Office.WebExtension.FileType
        }
    ],
    supportedOptions: [
        {
            name: Microsoft.Office.WebExtension.Parameters.SliceSize,
            value: {
                "types": ["number"],
                "defaultValue": 4 * 1024 * 1024
            }
        }
    ],
    checkCallArgs: function (callArgs, caller, stateInfo) {
        var sliceSize = callArgs[Microsoft.Office.WebExtension.Parameters.SliceSize];
        if (sliceSize <= 0 || sliceSize > (4 * 1024 * 1024)) {
            throw OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSliceSize;
        }
        return callArgs;
    },
    onSucceeded: function (fileDescriptor, caller, callArgs) {
        return new OSF.DDA.File(fileDescriptor[OSF.DDA.FileProperties.Handle], fileDescriptor[OSF.DDA.FileProperties.FileSize], callArgs[Microsoft.Office.WebExtension.Parameters.SliceSize]);
    }
});
OSF.DDA.AsyncMethodCalls.define({
    method: OSF.DDA.AsyncMethodNames.GetDocumentCopyChunkAsync,
    requiredArguments: [
        {
            "name": Microsoft.Office.WebExtension.Parameters.SliceIndex,
            "types": ["number"]
        }
    ],
    privateStateCallbacks: [
        {
            name: OSF.DDA.FileProperties.Handle,
            value: function (caller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.Handle]; }
        },
        {
            name: OSF.DDA.FileProperties.SliceSize,
            value: function (caller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.SliceSize]; }
        }
    ],
    checkCallArgs: function (callArgs, caller, stateInfo) {
        var index = callArgs[Microsoft.Office.WebExtension.Parameters.SliceIndex];
        if (index < 0 || index >= caller.sliceCount) {
            throw OSF.DDA.ErrorCodeManager.errorCodes.ooeIndexOutOfRange;
        }
        callArgs[OSF.DDA.FileSliceOffset] = parseInt((index * stateInfo[OSF.DDA.FileProperties.SliceSize]).toString());
        return callArgs;
    },
    onSucceeded: function (sliceDescriptor, caller, callArgs) {
        var slice = {};
        OSF.OUtil.defineEnumerableProperties(slice, {
            "data": {
                value: sliceDescriptor[Microsoft.Office.WebExtension.Parameters.Data]
            },
            "index": {
                value: callArgs[Microsoft.Office.WebExtension.Parameters.SliceIndex]
            },
            "size": {
                value: sliceDescriptor[OSF.DDA.FileProperties.SliceSize]
            }
        });
        return slice;
    }
});
OSF.DDA.AsyncMethodCalls.define({
    method: OSF.DDA.AsyncMethodNames.ReleaseDocumentCopyAsync,
    privateStateCallbacks: [
        {
            name: OSF.DDA.FileProperties.Handle,
            value: function (caller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.Handle]; }
        }
    ]
});
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.OUtil.setNamespace("File", OSF.DDA.Marshaling);
var OSF_DDA_Marshaling_File_FilePropertiesKeys;
(function (OSF_DDA_Marshaling_File_FilePropertiesKeys) {
    OSF_DDA_Marshaling_File_FilePropertiesKeys[OSF_DDA_Marshaling_File_FilePropertiesKeys["Handle"] = 0] = "Handle";
    OSF_DDA_Marshaling_File_FilePropertiesKeys[OSF_DDA_Marshaling_File_FilePropertiesKeys["FileSize"] = 1] = "FileSize";
})(OSF_DDA_Marshaling_File_FilePropertiesKeys || (OSF_DDA_Marshaling_File_FilePropertiesKeys = {}));
;
OSF.DDA.Marshaling.File.FilePropertiesKeys = OSF_DDA_Marshaling_File_FilePropertiesKeys;
var OSF_DDA_Marshaling_File_SlicePropertiesKeys;
(function (OSF_DDA_Marshaling_File_SlicePropertiesKeys) {
    OSF_DDA_Marshaling_File_SlicePropertiesKeys[OSF_DDA_Marshaling_File_SlicePropertiesKeys["Data"] = 0] = "Data";
    OSF_DDA_Marshaling_File_SlicePropertiesKeys[OSF_DDA_Marshaling_File_SlicePropertiesKeys["SliceSize"] = 1] = "SliceSize";
})(OSF_DDA_Marshaling_File_SlicePropertiesKeys || (OSF_DDA_Marshaling_File_SlicePropertiesKeys = {}));
;
OSF.DDA.Marshaling.File.SlicePropertiesKeys = OSF_DDA_Marshaling_File_SlicePropertiesKeys;
var OSF_DDA_Marshaling_File_FileType;
(function (OSF_DDA_Marshaling_File_FileType) {
    OSF_DDA_Marshaling_File_FileType[OSF_DDA_Marshaling_File_FileType["Text"] = 0] = "Text";
    OSF_DDA_Marshaling_File_FileType[OSF_DDA_Marshaling_File_FileType["Compressed"] = 1] = "Compressed";
    OSF_DDA_Marshaling_File_FileType[OSF_DDA_Marshaling_File_FileType["Pdf"] = 2] = "Pdf";
})(OSF_DDA_Marshaling_File_FileType || (OSF_DDA_Marshaling_File_FileType = {}));
;
OSF.DDA.Marshaling.File.FileType = OSF_DDA_Marshaling_File_FileType;
var OSF_DDA_Marshaling_File_ParameterKeys;
(function (OSF_DDA_Marshaling_File_ParameterKeys) {
    OSF_DDA_Marshaling_File_ParameterKeys[OSF_DDA_Marshaling_File_ParameterKeys["FileType"] = 0] = "FileType";
    OSF_DDA_Marshaling_File_ParameterKeys[OSF_DDA_Marshaling_File_ParameterKeys["SliceSize"] = 1] = "SliceSize";
    OSF_DDA_Marshaling_File_ParameterKeys[OSF_DDA_Marshaling_File_ParameterKeys["Handle"] = 2] = "Handle";
    OSF_DDA_Marshaling_File_ParameterKeys[OSF_DDA_Marshaling_File_ParameterKeys["SliceIndex"] = 3] = "SliceIndex";
})(OSF_DDA_Marshaling_File_ParameterKeys || (OSF_DDA_Marshaling_File_ParameterKeys = {}));
;
OSF.DDA.Marshaling.File.ParameterKeys = OSF_DDA_Marshaling_File_ParameterKeys;
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.PropertyDescriptors.FileProperties);
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.PropertyDescriptors.FileSliceProperties);
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.PropertyDescriptors.FileProperties,
    fromHost: [
        { name: OSF.DDA.FileProperties.Handle, value: OSF.DDA.Marshaling.File.FilePropertiesKeys.Handle },
        { name: OSF.DDA.FileProperties.FileSize, value: OSF.DDA.Marshaling.File.FilePropertiesKeys.FileSize }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.PropertyDescriptors.FileSliceProperties,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.Marshaling.File.SlicePropertiesKeys.Data },
        { name: OSF.DDA.FileProperties.SliceSize, value: OSF.DDA.Marshaling.File.SlicePropertiesKeys.SliceSize }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.FileType,
    toHost: [
        { name: Microsoft.Office.WebExtension.FileType.Text, value: OSF.DDA.Marshaling.File.FileType.Text },
        { name: Microsoft.Office.WebExtension.FileType.Compressed, value: OSF.DDA.Marshaling.File.FileType.Compressed },
        { name: Microsoft.Office.WebExtension.FileType.Pdf, value: OSF.DDA.Marshaling.File.FileType.Pdf }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetDocumentCopyMethod,
    toHost: [
        { name: Microsoft.Office.WebExtension.Parameters.FileType, value: OSF.DDA.Marshaling.File.ParameterKeys.FileType },
        { name: Microsoft.Office.WebExtension.Parameters.SliceSize, value: OSF.DDA.Marshaling.File.ParameterKeys.SliceSize }
    ],
    fromHost: [
        { name: OSF.DDA.PropertyDescriptors.FileProperties, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetDocumentCopyChunkMethod,
    toHost: [
        { name: OSF.DDA.FileProperties.Handle, value: OSF.DDA.Marshaling.File.ParameterKeys.Handle },
        { name: Microsoft.Office.WebExtension.Parameters.SliceIndex, value: OSF.DDA.Marshaling.File.ParameterKeys.SliceIndex }
    ],
    fromHost: [
        { name: OSF.DDA.PropertyDescriptors.FileSliceProperties, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidReleaseDocumentCopyMethod,
    toHost: [{ name: OSF.DDA.FileProperties.Handle, value: OSF.DDA.Marshaling.File.ParameterKeys.Handle }]
});
OSF.DDA.FilePropertiesDescriptor = {
    Url: "Url"
};
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
    FilePropertiesDescriptor: "FilePropertiesDescriptor"
});
Microsoft.Office.WebExtension.FileProperties = function Microsoft_Office_WebExtension_FileProperties(filePropertiesDescriptor) {
    OSF.OUtil.defineEnumerableProperties(this, {
        "url": {
            value: filePropertiesDescriptor[OSF.DDA.FilePropertiesDescriptor.Url]
        }
    });
};
OSF.DDA.AsyncMethodNames.addNames({ GetFilePropertiesAsync: "getFilePropertiesAsync" });
OSF.DDA.AsyncMethodCalls.define({
    method: OSF.DDA.AsyncMethodNames.GetFilePropertiesAsync,
    fromHost: [
        { name: OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor, value: 0 }
    ],
    requiredArguments: [],
    supportedOptions: [],
    onSucceeded: function (filePropertiesDescriptor, caller, callArgs) {
        return new Microsoft.Office.WebExtension.FileProperties(filePropertiesDescriptor);
    }
});
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
var OSF_DDA_Marshaling_FilePropertiesKeys;
(function (OSF_DDA_Marshaling_FilePropertiesKeys) {
    OSF_DDA_Marshaling_FilePropertiesKeys[OSF_DDA_Marshaling_FilePropertiesKeys["Properties"] = 0] = "Properties";
    OSF_DDA_Marshaling_FilePropertiesKeys[OSF_DDA_Marshaling_FilePropertiesKeys["Url"] = 1] = "Url";
})(OSF_DDA_Marshaling_FilePropertiesKeys || (OSF_DDA_Marshaling_FilePropertiesKeys = {}));
;
OSF.DDA.Marshaling.FilePropertiesKeys = OSF_DDA_Marshaling_FilePropertiesKeys;
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor);
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor,
    fromHost: [
        { name: OSF.DDA.FilePropertiesDescriptor.Url, value: OSF.DDA.Marshaling.FilePropertiesKeys.Url }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetFilePropertiesMethod,
    fromHost: [
        { name: OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor, value: OSF.DDA.Marshaling.FilePropertiesKeys.Properties }
    ]
});
OSF.DDA.AsyncMethodNames.addNames({
    GetOfficeThemeAsync: "getOfficeThemeAsync",
    GetDocumentThemeAsync: "getDocumentThemeAsync"
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
    OfficeThemeChanged: "officeThemeChanged",
    DocumentThemeChanged: "documentThemeChanged"
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.Parameters, {
    DocumentTheme: "documentTheme",
    OfficeTheme: "officeTheme"
});
OSF.OUtil.augmentList(OSF.DDA.EventDescriptors, {
    DocumentThemeChangedEvent: "DocumentThemeChangedEvent",
    OfficeThemeChangedEvent: "OfficeThemeChangedEvent"
});
OSF.OUtil.setNamespace("Theming", OSF.DDA);
OSF.DDA.Theming.OfficeThemeEnum = {
    PrimaryFontColor: "primaryFontColor",
    PrimaryBackgroundColor: "primaryBackgroundColor",
    SecondaryFontColor: "secondaryFontColor",
    SecondaryBackgroundColor: "secondaryBackgroundColor"
};
OSF.DDA.Theming.DocumentThemeEnum = {
    PrimaryFontColor: "primaryFontColor",
    PrimaryBackgroundColor: "primaryBackgroundColor",
    SecondaryFontColor: "secondaryFontColor",
    SecondaryBackgroundColor: "secondaryBackgroundColor",
    Accent1: "accent1",
    Accent2: "accent2",
    Accent3: "accent3",
    Accent4: "accent4",
    Accent5: "accent5",
    Accent6: "accent6",
    Hyperlink: "hyperlink",
    FollowedHyperlink: "followedHyperlink",
    HeaderLatinFont: "headerLatinFont",
    HeaderEastAsianFont: "headerEastAsianFont",
    HeaderScriptFont: "headerScriptFont",
    HeaderLocalizedFont: "headerLocalizedFont",
    BodyLatinFont: "bodyLatinFont",
    BodyEastAsianFont: "bodyEastAsianFont",
    BodyScriptFont: "bodyScriptFont",
    BodyLocalizedFont: "bodyLocalizedFont"
};
OSF.DDA.Theming.ConvertToDocumentTheme = function OSF_DDA_Theming_ConvertToDocumentTheme(response) {
    var mappingDocumentTheme = [
        { name: "primaryFontColor", needToConvertToHex: true },
        { name: "primaryBackgroundColor", needToConvertToHex: true },
        { name: "secondaryFontColor", needToConvertToHex: true },
        { name: "secondaryBackgroundColor", needToConvertToHex: true },
        { name: "accent1", needToConvertToHex: true },
        { name: "accent2", needToConvertToHex: true },
        { name: "accent3", needToConvertToHex: true },
        { name: "accent4", needToConvertToHex: true },
        { name: "accent5", needToConvertToHex: true },
        { name: "accent6", needToConvertToHex: true },
        { name: "hyperlink", needToConvertToHex: true },
        { name: "followedHyperlink", needToConvertToHex: true },
        { name: "headerLatinFont", needToConvertToHex: false },
        { name: "headerEastAsianFont", needToConvertToHex: false },
        { name: "headerScriptFont", needToConvertToHex: false },
        { name: "headerLocalizedFont", needToConvertToHex: false },
        { name: "bodyLatinFont", needToConvertToHex: false },
        { name: "bodyEastAsianFont", needToConvertToHex: false },
        { name: "bodyScriptFont", needToConvertToHex: false },
        { name: "bodyLocalizedFont", needToConvertToHex: false }
    ];
    var result = {};
    for (var i = 0; i < mappingDocumentTheme.length; i++) {
        if (mappingDocumentTheme[i].needToConvertToHex) {
            result[mappingDocumentTheme[i].name] = OSF.OUtil.convertIntToCssHexColor(response[mappingDocumentTheme[i].name]);
        }
        else {
            result[mappingDocumentTheme[i].name] = response[mappingDocumentTheme[i].name];
        }
    }
    return result;
};
OSF.DDA.Theming.ConvertToOfficeTheme = function OSF_DDA_Theming_ConvertToOfficeTheme(response) {
    var result = {};
    for (var key in response) {
        result[key] = OSF.OUtil.convertIntToCssHexColor(response[key]);
    }
    return result;
};
OSF.DDA.AsyncMethodCalls.define({
    method: OSF.DDA.AsyncMethodNames.GetDocumentThemeAsync,
    requiredArguments: [],
    supportedOptions: [],
    privateStateCallbacks: [],
    onSucceeded: OSF.DDA.Theming.ConvertToDocumentTheme
});
OSF.DDA.AsyncMethodCalls.define({
    method: OSF.DDA.AsyncMethodNames.GetOfficeThemeAsync,
    requiredArguments: [],
    supportedOptions: [],
    privateStateCallbacks: [],
    onSucceeded: OSF.DDA.Theming.ConvertToOfficeTheme
});
OSF.DDA.Theming.OfficeThemeChangedEventArgs = function OSF_DDA_Theming_OfficeThemeChangedEventArgs(officeTheme) {
    var ret = OSF.DDA.Theming.ConvertToOfficeTheme(officeTheme);
    OSF.OUtil.defineEnumerableProperties(this, {
        "type": {
            value: Microsoft.Office.WebExtension.EventType.OfficeThemeChanged
        },
        "officeTheme": {
            value: ret
        }
    });
};
OSF.DDA.Theming.DocumentThemeChangedEventArgs = function OSF_DDA_Theming_DocumentThemeChangedEventArgs(documentTheme) {
    var ret = OSF.DDA.Theming.ConvertToDocumentTheme(documentTheme);
    OSF.OUtil.defineEnumerableProperties(this, {
        "type": {
            value: Microsoft.Office.WebExtension.EventType.DocumentThemeChanged
        },
        "documentTheme": {
            value: ret
        }
    });
};
var OSF_DDA_Theming_InternalThemeHandler = (function () {
    function OSF_DDA_Theming_InternalThemeHandler() {
        this._pseudoDocumentObject = null;
        this._previousDocumentThemeData = null;
        this._previousOfficeThemeData = null;
        this._officeCss = null;
        this._asyncCallsCompleted = null;
        this._onAsyncCallsCompleted = null;
    }
    OSF_DDA_Theming_InternalThemeHandler.prototype.InitializeAndChangeOnce = function (callback) {
        this._officeCss = this._getOfficeThemesCss();
        if (!this._officeCss) {
            if (callback) {
                callback();
            }
            return;
        }
        this._onAsyncCallsCompleted = callback;
        this._pseudoDocumentObject = {};
        var pseudoDoc = this._pseudoDocumentObject;
        OSF.DDA.DispIdHost.addAsyncMethods(pseudoDoc, [
            OSF.DDA.AsyncMethodNames.GetOfficeThemeAsync,
            OSF.DDA.AsyncMethodNames.GetDocumentThemeAsync
        ]);
        OSF.DDA.DispIdHost.addEventSupport(pseudoDoc, new OSF.EventDispatch([
            Microsoft.Office.WebExtension.EventType.OfficeThemeChanged,
            Microsoft.Office.WebExtension.EventType.DocumentThemeChanged
        ]));
        this._asyncCallsCompleted = {};
        this._asyncCallsCompleted[OSF.DDA.AsyncMethodNames.GetOfficeThemeAsync] = false;
        this._asyncCallsCompleted[OSF.DDA.AsyncMethodNames.GetDocumentThemeAsync] = false;
        this._getAndProcessThemeData(pseudoDoc.getDocumentThemeAsync, Function.createDelegate(this, this._processDocumentThemeData), OSF.DDA.AsyncMethodNames.GetDocumentThemeAsync);
        this._getAndProcessThemeData(pseudoDoc.getOfficeThemeAsync, Function.createDelegate(this, this._processOfficeThemeData), OSF.DDA.AsyncMethodNames.GetOfficeThemeAsync);
    };
    OSF_DDA_Theming_InternalThemeHandler.prototype._getOfficeThemesCss = function () {
        function getOfficeThemesCssInternal() {
            var cssFileName = "officethemes.css";
            for (var i = 0; i < document.styleSheets.length; i++) {
                var ss = document.styleSheets[i];
                if (!ss.disabled
                    && ss.href
                    && cssFileName == ss.href.substring(ss.href.length - cssFileName.length, ss.href.length).toLowerCase()) {
                    if ((!ss.cssRules) && (!ss.rules)) {
                        return null;
                    }
                    else {
                        return ss;
                    }
                }
            }
        }
        try {
            return getOfficeThemesCssInternal();
        }
        catch (e) {
            return null;
        }
    };
    OSF_DDA_Theming_InternalThemeHandler.prototype._changeCss = function (officeCss, selector, newRule) {
        var length = officeCss.cssRules ? officeCss.cssRules.length : officeCss.rules.length;
        for (var i = 0; i < length; i++) {
            var rule;
            if (officeCss.cssRules) {
                rule = officeCss.cssRules[i];
            }
            else {
                rule = officeCss.rules[i];
            }
            var ruleSelector = rule.selectorText;
            if (ruleSelector && ruleSelector.toLowerCase() == selector.toLowerCase()) {
                if (officeCss.cssRules) {
                    officeCss.deleteRule(i);
                    officeCss.insertRule(ruleSelector + newRule, i);
                }
                else {
                    officeCss.removeRule(i);
                    officeCss.addRule(ruleSelector, newRule, i);
                }
            }
        }
    };
    OSF_DDA_Theming_InternalThemeHandler.prototype._changeDocumentThemeData = function (data) {
        var documentThemeCssMapping = [
            { name: "primaryFontColor", cssSelector: ".office-docTheme-primary-fontColor", cssProperty: "color" },
            { name: "primaryBackgroundColor", cssSelector: ".office-docTheme-primary-bgColor", cssProperty: "background-color" },
            { name: "secondaryFontColor", cssSelector: ".office-docTheme-secondary-fontColor", cssProperty: "color" },
            { name: "secondaryBackgroundColor", cssSelector: ".office-docTheme-secondary-bgColor", cssProperty: "background-color" },
            { name: "accent1", cssSelector: ".office-contentAccent1-color", cssProperty: "color" },
            { name: "accent2", cssSelector: ".office-contentAccent2-color", cssProperty: "color" },
            { name: "accent3", cssSelector: ".office-contentAccent3-color", cssProperty: "color" },
            { name: "accent4", cssSelector: ".office-contentAccent4-color", cssProperty: "color" },
            { name: "accent5", cssSelector: ".office-contentAccent5-color", cssProperty: "color" },
            { name: "accent6", cssSelector: ".office-contentAccent6-color", cssProperty: "color" },
            { name: "accent1", cssSelector: ".office-contentAccent1-bgColor", cssProperty: "background-color" },
            { name: "accent2", cssSelector: ".office-contentAccent2-bgColor", cssProperty: "background-color" },
            { name: "accent3", cssSelector: ".office-contentAccent3-bgColor", cssProperty: "background-color" },
            { name: "accent4", cssSelector: ".office-contentAccent4-bgColor", cssProperty: "background-color" },
            { name: "accent5", cssSelector: ".office-contentAccent5-bgColor", cssProperty: "background-color" },
            { name: "accent6", cssSelector: ".office-contentAccent6-bgColor", cssProperty: "background-color" },
            { name: "accent1", cssSelector: ".office-contentAccent1-borderColor", cssProperty: "border-color" },
            { name: "accent2", cssSelector: ".office-contentAccent2-borderColor", cssProperty: "border-color" },
            { name: "accent3", cssSelector: ".office-contentAccent3-borderColor", cssProperty: "border-color" },
            { name: "accent4", cssSelector: ".office-contentAccent4-borderColor", cssProperty: "border-color" },
            { name: "accent5", cssSelector: ".office-contentAccent5-borderColor", cssProperty: "border-color" },
            { name: "accent6", cssSelector: ".office-contentAccent6-borderColor", cssProperty: "border-color" },
            { name: "hyperlink", cssSelector: ".office-a", cssProperty: "color" },
            { name: "followedHyperlink", cssSelector: ".office-a:visited", cssProperty: "color" },
            { name: "headerLatinFont", cssSelector: ".office-headerFont-latin", cssProperty: "font-family" },
            { name: "headerEastAsianFont", cssSelector: ".office-headerFont-eastAsian", cssProperty: "font-family" },
            { name: "headerScriptFont", cssSelector: ".office-headerFont-script", cssProperty: "font-family" },
            { name: "headerLocalizedFont", cssSelector: ".office-headerFont-localized", cssProperty: "font-family" },
            { name: "bodyLatinFont", cssSelector: ".office-bodyFont-latin", cssProperty: "font-family" },
            { name: "bodyEastAsianFont", cssSelector: ".office-bodyFont-eastAsian", cssProperty: "font-family" },
            { name: "bodyScriptFont", cssSelector: ".office-bodyFont-script", cssProperty: "font-family" },
            { name: "bodyLocalizedFont", cssSelector: ".office-bodyFont-localized", cssProperty: "font-family" }
        ];
        var realData = data.type == "documentThemeChanged" ? data.documentTheme : data;
        for (var i = 0; i < documentThemeCssMapping.length; i++) {
            if (this._previousDocumentThemeData === null || this._previousDocumentThemeData[documentThemeCssMapping[i].name] != realData[documentThemeCssMapping[i].name]) {
                if (realData[documentThemeCssMapping[i].name] != null && realData[documentThemeCssMapping[i].name] != "") {
                    var insertableText = realData[documentThemeCssMapping[i].name];
                    if (documentThemeCssMapping[i].cssProperty === "font-family") {
                        insertableText = '"' + insertableText.replace(/"/g, '\\"') + '"';
                    }
                    this._changeCss(this._officeCss, documentThemeCssMapping[i].cssSelector, "{" + documentThemeCssMapping[i].cssProperty + ":" + insertableText + ";}");
                }
                else {
                    this._changeCss(this._officeCss, documentThemeCssMapping[i].cssSelector, "{}");
                }
            }
        }
        this._previousDocumentThemeData = realData;
    };
    OSF_DDA_Theming_InternalThemeHandler.prototype._changeOfficeThemeData = function (data) {
        var officeThemeCssMapping = [
            { name: "primaryFontColor", cssSelector: ".office-officeTheme-primary-fontColor", cssProperty: "color" },
            { name: "primaryBackgroundColor", cssSelector: ".office-officeTheme-primary-bgColor", cssProperty: "background-color" },
            { name: "secondaryFontColor", cssSelector: ".office-officeTheme-secondary-fontColor", cssProperty: "color" },
            { name: "secondaryBackgroundColor", cssSelector: ".office-officeTheme-secondary-bgColor", cssProperty: "background-color" }
        ];
        var realData = data.type == "officeThemeChanged" ? data.officeTheme : data;
        for (var i = 0; i < officeThemeCssMapping.length; i++) {
            if (this._previousOfficeThemeData === null || this._previousOfficeThemeData[officeThemeCssMapping[i].name] != realData[officeThemeCssMapping[i].name]) {
                if (realData[officeThemeCssMapping[i].name] !== undefined) {
                    this._changeCss(this._officeCss, officeThemeCssMapping[i].cssSelector, "{" + officeThemeCssMapping[i].cssProperty + ":" + realData[officeThemeCssMapping[i].name] + ";}");
                }
            }
        }
        this._previousOfficeThemeData = realData;
    };
    OSF_DDA_Theming_InternalThemeHandler.prototype._getAndProcessThemeData = function (getThemeMethod, processResultCallback, getThemeMethodIdentifier) {
        getThemeMethod(Function.createDelegate(this, function (asyncResult) {
            if (asyncResult.status == "succeeded") {
                var data = asyncResult.value;
                processResultCallback(data);
            }
            if (this._areAllCallsCompleted(getThemeMethodIdentifier) && this._onAsyncCallsCompleted) {
                this._onAsyncCallsCompleted();
                this._onAsyncCallsCompleted = null;
            }
        }));
    };
    OSF_DDA_Theming_InternalThemeHandler.prototype._processOfficeThemeData = function (data) {
        this._changeOfficeThemeData(data);
        this._pseudoDocumentObject.addHandlerAsync(Microsoft.Office.WebExtension.EventType.OfficeThemeChanged, Function.createDelegate(this, this._changeOfficeThemeData), null);
    };
    OSF_DDA_Theming_InternalThemeHandler.prototype._processDocumentThemeData = function (data) {
        this._changeDocumentThemeData(data);
        this._pseudoDocumentObject.addHandlerAsync(Microsoft.Office.WebExtension.EventType.DocumentThemeChanged, Function.createDelegate(this, this._changeDocumentThemeData), null);
    };
    OSF_DDA_Theming_InternalThemeHandler.prototype._areAllCallsCompleted = function (completedCall) {
        var asyncCallsCompleted;
        if (!(asyncCallsCompleted = this._asyncCallsCompleted)) {
            return true;
        }
        if (completedCall && asyncCallsCompleted.hasOwnProperty(completedCall)) {
            asyncCallsCompleted[completedCall] = true;
        }
        for (var call in asyncCallsCompleted) {
            if (asyncCallsCompleted.hasOwnProperty(call) && asyncCallsCompleted[call]) {
                continue;
            }
            return false;
        }
        return true;
    };
    return OSF_DDA_Theming_InternalThemeHandler;
})();
OSF.DDA.Theming.InternalThemeHandler = OSF_DDA_Theming_InternalThemeHandler;
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
var OSF_DDA_Marshaling_ThemingKeys;
(function (OSF_DDA_Marshaling_ThemingKeys) {
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["DocumentTheme"] = 0] = "DocumentTheme";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["OfficeTheme"] = 1] = "OfficeTheme";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["Background1"] = 2] = "Background1";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["Text1"] = 3] = "Text1";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["Background2"] = 4] = "Background2";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["Text2"] = 5] = "Text2";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["Accent1"] = 6] = "Accent1";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["Accent2"] = 7] = "Accent2";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["Accent3"] = 8] = "Accent3";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["Accent4"] = 9] = "Accent4";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["Accent5"] = 10] = "Accent5";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["Accent6"] = 11] = "Accent6";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["Hyperlink"] = 12] = "Hyperlink";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["FollowedHyperlink"] = 13] = "FollowedHyperlink";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["HdLatin"] = 14] = "HdLatin";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["HdEastAsian"] = 15] = "HdEastAsian";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["HdScript"] = 16] = "HdScript";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["HdLocalized"] = 17] = "HdLocalized";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["BdLatin"] = 18] = "BdLatin";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["BdEastAsian"] = 19] = "BdEastAsian";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["BdScript"] = 20] = "BdScript";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["BdLocalized"] = 21] = "BdLocalized";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["BackgroundColor"] = 22] = "BackgroundColor";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["PrimaryText"] = 23] = "PrimaryText";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["PrimaryBackground"] = 24] = "PrimaryBackground";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["SecondaryText"] = 25] = "SecondaryText";
    OSF_DDA_Marshaling_ThemingKeys[OSF_DDA_Marshaling_ThemingKeys["SecondaryBackground"] = 26] = "SecondaryBackground";
})(OSF_DDA_Marshaling_ThemingKeys || (OSF_DDA_Marshaling_ThemingKeys = {}));
;
OSF.DDA.Marshaling.ThemingKeys = OSF_DDA_Marshaling_ThemingKeys;
var parameterMap = OSF.DDA.WAC.Delegate.ParameterMap;
var hostKeys = OSF.DDA.Marshaling.ThemingKeys;
parameterMap.addComplexType(Microsoft.Office.WebExtension.Parameters.DocumentTheme);
parameterMap.addComplexType(Microsoft.Office.WebExtension.Parameters.OfficeTheme);
parameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetDocumentThemeMethod,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.DocumentTheme, value: hostKeys.DocumentTheme }
    ]
});
parameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetOfficeThemeMethod,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.OfficeTheme, value: hostKeys.OfficeTheme }
    ]
});
parameterMap.define({
    type: OSF.DDA.EventDispId.dispidDocumentThemeChangedEvent,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.DocumentTheme, value: hostKeys.DocumentTheme }
    ]
});
parameterMap.define({
    type: OSF.DDA.EventDispId.dispidOfficeThemeChangedEvent,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.OfficeTheme, value: hostKeys.OfficeTheme }
    ]
});
var destKeys = OSF.DDA.Theming.DocumentThemeEnum;
parameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.DocumentTheme,
    fromHost: [
        { name: destKeys.PrimaryBackgroundColor, value: hostKeys.Background1 },
        { name: destKeys.PrimaryFontColor, value: hostKeys.Text1 },
        { name: destKeys.SecondaryBackgroundColor, value: hostKeys.Background2 },
        { name: destKeys.SecondaryFontColor, value: hostKeys.Text2 },
        { name: destKeys.Accent1, value: hostKeys.Accent1 },
        { name: destKeys.Accent2, value: hostKeys.Accent2 },
        { name: destKeys.Accent3, value: hostKeys.Accent3 },
        { name: destKeys.Accent4, value: hostKeys.Accent4 },
        { name: destKeys.Accent5, value: hostKeys.Accent5 },
        { name: destKeys.Accent6, value: hostKeys.Accent6 },
        { name: destKeys.Hyperlink, value: hostKeys.Hyperlink },
        { name: destKeys.FollowedHyperlink, value: hostKeys.FollowedHyperlink },
        { name: destKeys.HeaderLatinFont, value: hostKeys.HdLatin },
        { name: destKeys.HeaderEastAsianFont, value: hostKeys.HdEastAsian },
        { name: destKeys.HeaderScriptFont, value: hostKeys.HdScript },
        { name: destKeys.HeaderLocalizedFont, value: hostKeys.HdLocalized },
        { name: destKeys.BodyLatinFont, value: hostKeys.BdLatin },
        { name: destKeys.BodyEastAsianFont, value: hostKeys.BdEastAsian },
        { name: destKeys.BodyScriptFont, value: hostKeys.BdScript },
        { name: destKeys.BodyLocalizedFont, value: hostKeys.BdLocalized }
    ]
});
destKeys = OSF.DDA.Theming.OfficeThemeEnum;
parameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.OfficeTheme,
    fromHost: [
        { name: destKeys.PrimaryFontColor, value: hostKeys.PrimaryText },
        { name: destKeys.PrimaryBackgroundColor, value: hostKeys.PrimaryBackground },
        { name: destKeys.SecondaryFontColor, value: hostKeys.SecondaryText },
        { name: destKeys.SecondaryBackgroundColor, value: hostKeys.SecondaryBackground }
    ]
});
OSF.DDA.SettingsManager = {
    SerializedSettings: "serializedSettings",
    RefreshingSettings: "refreshingSettings",
    DateJSONPrefix: "Date(",
    DataJSONSuffix: ")",
    serializeSettings: function OSF_DDA_SettingsManager$serializeSettings(settingsCollection) {
        var ret = {};
        for (var key in settingsCollection) {
            var value = settingsCollection[key];
            try {
                if (JSON) {
                    value = JSON.stringify(value, function dateReplacer(k, v) {
                        return OSF.OUtil.isDate(this[k]) ? OSF.DDA.SettingsManager.DateJSONPrefix + this[k].getTime() + OSF.DDA.SettingsManager.DataJSONSuffix : v;
                    });
                }
                else {
                    value = Sys.Serialization.JavaScriptSerializer.serialize(value);
                }
                ret[key] = value;
            }
            catch (ex) {
            }
        }
        return ret;
    },
    deserializeSettings: function OSF_DDA_SettingsManager$deserializeSettings(serializedSettings) {
        var ret = {};
        serializedSettings = serializedSettings || {};
        for (var key in serializedSettings) {
            var value = serializedSettings[key];
            try {
                if (JSON) {
                    value = JSON.parse(value, function dateReviver(k, v) {
                        var d;
                        if (typeof v === 'string' && v && v.length > 6 && v.slice(0, 5) === OSF.DDA.SettingsManager.DateJSONPrefix && v.slice(-1) === OSF.DDA.SettingsManager.DataJSONSuffix) {
                            d = new Date(parseInt(v.slice(5, -1)));
                            if (d) {
                                return d;
                            }
                        }
                        return v;
                    });
                }
                else {
                    value = Sys.Serialization.JavaScriptSerializer.deserialize(value, true);
                }
                ret[key] = value;
            }
            catch (ex) {
            }
        }
        return ret;
    }
};
OSF.DDA.Settings = function OSF_DDA_Settings(settings) {
    settings = settings || {};
    var cacheSessionSettings = function (settings) {
        var osfSessionStorage = OSF.OUtil.getSessionStorage();
        if (osfSessionStorage) {
            var serializedSettings = OSF.DDA.SettingsManager.serializeSettings(settings);
            var storageSettings = JSON ? JSON.stringify(serializedSettings) : Sys.Serialization.JavaScriptSerializer.serialize(serializedSettings);
            osfSessionStorage.setItem(OSF._OfficeAppFactory.getCachedSessionSettingsKey(), storageSettings);
        }
    };
    OSF.OUtil.defineEnumerableProperties(this, {
        "get": {
            value: function OSF_DDA_Settings$get(name) {
                var e = Function._validateParams(arguments, [
                    { name: "name", type: String, mayBeNull: false }
                ]);
                if (e)
                    throw e;
                var setting = settings[name];
                return typeof (setting) === 'undefined' ? null : setting;
            }
        },
        "set": {
            value: function OSF_DDA_Settings$set(name, value) {
                var e = Function._validateParams(arguments, [
                    { name: "name", type: String, mayBeNull: false },
                    { name: "value", mayBeNull: true }
                ]);
                if (e)
                    throw e;
                settings[name] = value;
                cacheSessionSettings(settings);
            }
        },
        "remove": {
            value: function OSF_DDA_Settings$remove(name) {
                var e = Function._validateParams(arguments, [
                    { name: "name", type: String, mayBeNull: false }
                ]);
                if (e)
                    throw e;
                delete settings[name];
                cacheSessionSettings(settings);
            }
        }
    });
    OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.AsyncMethodNames.SaveAsync], settings);
};
OSF.DDA.RefreshableSettings = function OSF_DDA_RefreshableSettings(settings) {
    OSF.DDA.RefreshableSettings.uber.constructor.call(this, settings);
    OSF.DDA.DispIdHost.addAsyncMethods(this, [OSF.DDA.AsyncMethodNames.RefreshAsync], settings);
    OSF.DDA.DispIdHost.addEventSupport(this, new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.SettingsChanged]));
};
OSF.OUtil.extend(OSF.DDA.RefreshableSettings, OSF.DDA.Settings);
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
    SettingsChanged: "settingsChanged"
});
OSF.DDA.SettingsChangedEventArgs = function OSF_DDA_SettingsChangedEventArgs(settingsInstance) {
    OSF.OUtil.defineEnumerableProperties(this, {
        "type": {
            value: Microsoft.Office.WebExtension.EventType.SettingsChanged
        },
        "settings": {
            value: settingsInstance
        }
    });
};
OSF.DDA.AsyncMethodNames.addNames({
    RefreshAsync: "refreshAsync",
    SaveAsync: "saveAsync"
});
OSF.DDA.AsyncMethodCalls.define({
    method: OSF.DDA.AsyncMethodNames.RefreshAsync,
    requiredArguments: [],
    supportedOptions: [],
    privateStateCallbacks: [
        {
            name: OSF.DDA.SettingsManager.RefreshingSettings,
            value: function getRefreshingSettings(settingsInstance, settingsCollection) {
                return settingsCollection;
            }
        }
    ],
    onSucceeded: function deserializeSettings(serializedSettingsDescriptor, refreshingSettings, refreshingSettingsArgs) {
        var serializedSettings = serializedSettingsDescriptor[OSF.DDA.SettingsManager.SerializedSettings];
        var newSettings = OSF.DDA.SettingsManager.deserializeSettings(serializedSettings);
        var oldSettings = refreshingSettingsArgs[OSF.DDA.SettingsManager.RefreshingSettings];
        for (var setting in oldSettings) {
            refreshingSettings.remove(setting);
        }
        for (var setting in newSettings) {
            refreshingSettings.set(setting, newSettings[setting]);
        }
        return refreshingSettings;
    }
});
OSF.DDA.AsyncMethodCalls.define({
    method: OSF.DDA.AsyncMethodNames.SaveAsync,
    requiredArguments: [],
    supportedOptions: [
        {
            name: Microsoft.Office.WebExtension.Parameters.OverwriteIfStale,
            value: {
                "types": ["boolean"],
                "defaultValue": true
            }
        }
    ],
    privateStateCallbacks: [
        {
            name: OSF.DDA.SettingsManager.SerializedSettings,
            value: function serializeSettings(settingsInstance, settingsCollection) {
                return OSF.DDA.SettingsManager.serializeSettings(settingsCollection);
            }
        }
    ]
});
OSF.DDA.WAC.SettingsTranslator = (function () {
    var keyIndex = 0;
    var valueIndex = 1;
    return {
        read: function OSF_DDA_WAC_SettingsTranslator$read(payload) {
            var serializedSettings = {};
            var settingsPayload = payload.Settings;
            for (var index in settingsPayload) {
                var setting = settingsPayload[index];
                serializedSettings[setting[keyIndex]] = setting[valueIndex];
            }
            return serializedSettings;
        },
        write: function OSF_DDA_WAC_SettingsTranslator$write(serializedSettings) {
            var settingsPayload = [];
            for (var key in serializedSettings) {
                var setting = [];
                setting[keyIndex] = key;
                setting[valueIndex] = serializedSettings[key];
                settingsPayload.push(setting);
            }
            return settingsPayload;
        }
    };
})();
OSF.DDA.WAC.Delegate.ParameterMap.setDynamicType(OSF.DDA.SettingsManager.SerializedSettings, {
    toHost: OSF.DDA.WAC.SettingsTranslator.write,
    fromHost: OSF.DDA.WAC.SettingsTranslator.read
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.WAC.UniqueArguments.SettingsRequest,
    toHost: [
        { name: Microsoft.Office.WebExtension.Parameters.OverwriteIfStale, value: "OverwriteIfStale" },
        { name: OSF.DDA.SettingsManager.SerializedSettings, value: OSF.DDA.WAC.UniqueArguments.Properties }
    ],
    invertible: true
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidLoadSettingsMethod,
    fromHost: [
        { name: OSF.DDA.SettingsManager.SerializedSettings, value: OSF.DDA.WAC.UniqueArguments.Properties }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidSaveSettingsMethod,
    toHost: [
        { name: OSF.DDA.WAC.UniqueArguments.SettingsRequest, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({ type: OSF.DDA.EventDispId.dispidSettingsChangedEvent });
var OfficeExt;
(function (OfficeExt) {
    var AppCommand;
    (function (AppCommand) {
        var AppCommandManager = (function () {
            function AppCommandManager() {
                var _this = this;
                this._pseudoDocument = null;
                this._eventDispatch = null;
                this._processAppCommandInvocation = function (args) {
                    var verifyResult = _this._verifyManifestCallback(args.callbackName);
                    if (verifyResult.errorCode != OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
                        _this._invokeAppCommandCompletedMethod(args.appCommandId, verifyResult.errorCode, "");
                        return;
                    }
                    var eventObj = _this._constructEventObjectForCallback(args);
                    if (eventObj) {
                        window.setTimeout(function () { verifyResult.callback(eventObj); }, 0);
                    }
                    else {
                        _this._invokeAppCommandCompletedMethod(args.appCommandId, OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError, "");
                    }
                };
            }
            AppCommandManager.initializeOsfDda = function () {
                OSF.DDA.AsyncMethodNames.addNames({
                    AppCommandInvocationCompletedAsync: "appCommandInvocationCompletedAsync"
                });
                OSF.DDA.AsyncMethodCalls.define({
                    method: OSF.DDA.AsyncMethodNames.AppCommandInvocationCompletedAsync,
                    requiredArguments: [{
                            "name": Microsoft.Office.WebExtension.Parameters.Id,
                            "types": ["string"]
                        },
                        {
                            "name": Microsoft.Office.WebExtension.Parameters.Status,
                            "types": ["number"]
                        },
                        {
                            "name": Microsoft.Office.WebExtension.Parameters.Data,
                            "types": ["string"]
                        }
                    ]
                });
                OSF.OUtil.augmentList(OSF.DDA.EventDescriptors, {
                    AppCommandInvokedEvent: "AppCommandInvokedEvent"
                });
                OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
                    AppCommandInvoked: "appCommandInvoked"
                });
                OSF.OUtil.setNamespace("AppCommand", OSF.DDA);
                OSF.DDA.AppCommand.AppCommandInvokedEventArgs = OfficeExt.AppCommand.AppCommandInvokedEventArgs;
            };
            AppCommandManager.prototype.initializeAndChangeOnce = function (callback) {
                AppCommand.registerDdaFacade();
                this._pseudoDocument = {};
                OSF.DDA.DispIdHost.addAsyncMethods(this._pseudoDocument, [
                    OSF.DDA.AsyncMethodNames.AppCommandInvocationCompletedAsync,
                ]);
                this._eventDispatch = new OSF.EventDispatch([
                    Microsoft.Office.WebExtension.EventType.AppCommandInvoked,
                ]);
                var onRegisterCompleted = function (result) {
                    if (callback) {
                        if (result.status == "succeeded") {
                            callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
                        }
                        else {
                            callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
                        }
                    }
                };
                OSF.DDA.DispIdHost.addEventSupport(this._pseudoDocument, this._eventDispatch);
                this._pseudoDocument.addHandlerAsync(Microsoft.Office.WebExtension.EventType.AppCommandInvoked, this._processAppCommandInvocation, onRegisterCompleted);
            };
            AppCommandManager.prototype._verifyManifestCallback = function (callbackName) {
                var defaultResult = { callback: null, errorCode: OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidCallback };
                callbackName = callbackName.trim();
                try {
                    var callList = callbackName.split(".");
                    var parentObject = window;
                    for (var i = 0; i < callList.length - 1; i++) {
                        if (parentObject[callList[i]] && (typeof parentObject[callList[i]] == "object" || typeof parentObject[callList[i]] == "function")) {
                            parentObject = parentObject[callList[i]];
                        }
                        else {
                            return defaultResult;
                        }
                    }
                    var callbackFunc = parentObject[callList[callList.length - 1]];
                    if (typeof callbackFunc != "function") {
                        return defaultResult;
                    }
                }
                catch (e) {
                    return defaultResult;
                }
                return { callback: callbackFunc, errorCode: OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess };
            };
            AppCommandManager.prototype._invokeAppCommandCompletedMethod = function (appCommandId, resultCode, data) {
                this._pseudoDocument.appCommandInvocationCompletedAsync(appCommandId, resultCode, data);
            };
            AppCommandManager.prototype._constructEventObjectForCallback = function (args) {
                var _this = this;
                var eventObj = new AppCommandCallbackEventArgs();
                try {
                    var jsonData = JSON.parse(args.eventObjStr);
                    this._translateEventObjectInternal(jsonData, eventObj);
                    Object.defineProperty(eventObj, 'completed', {
                        value: function (completedContext) {
                            eventObj.completedContext = completedContext;
                            var jsonString = JSON.stringify(eventObj);
                            _this._invokeAppCommandCompletedMethod(args.appCommandId, OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess, jsonString);
                        },
                        enumerable: true
                    });
                }
                catch (e) {
                    eventObj = null;
                }
                return eventObj;
            };
            AppCommandManager.prototype._translateEventObjectInternal = function (input, output) {
                for (var key in input) {
                    if (!input.hasOwnProperty(key))
                        continue;
                    var inputChild = input[key];
                    if (typeof inputChild == "object" && inputChild != null) {
                        OSF.OUtil.defineEnumerableProperty(output, key, {
                            value: {}
                        });
                        this._translateEventObjectInternal(inputChild, output[key]);
                    }
                    else {
                        Object.defineProperty(output, key, {
                            value: inputChild,
                            enumerable: true,
                            writable: true
                        });
                    }
                }
            };
            AppCommandManager.prototype._constructObjectByTemplate = function (template, input) {
                var output = {};
                if (!template || !input)
                    return output;
                for (var key in template) {
                    if (template.hasOwnProperty(key)) {
                        output[key] = null;
                        if (input[key] != null) {
                            var templateChild = template[key];
                            var inputChild = input[key];
                            var inputChildType = typeof inputChild;
                            if (typeof templateChild == "object" && templateChild != null) {
                                output[key] = this._constructObjectByTemplate(templateChild, inputChild);
                            }
                            else if (inputChildType == "number" || inputChildType == "string" || inputChildType == "boolean") {
                                output[key] = inputChild;
                            }
                        }
                    }
                }
                return output;
            };
            AppCommandManager.instance = function () {
                if (AppCommandManager._instance == null) {
                    AppCommandManager._instance = new AppCommandManager();
                }
                return AppCommandManager._instance;
            };
            AppCommandManager._instance = null;
            return AppCommandManager;
        })();
        AppCommand.AppCommandManager = AppCommandManager;
        var AppCommandInvokedEventArgs = (function () {
            function AppCommandInvokedEventArgs(appCommandId, callbackName, eventObjStr) {
                this.type = Microsoft.Office.WebExtension.EventType.AppCommandInvoked;
                this.appCommandId = appCommandId;
                this.callbackName = callbackName;
                this.eventObjStr = eventObjStr;
            }
            AppCommandInvokedEventArgs.create = function (eventProperties) {
                return new AppCommandInvokedEventArgs(eventProperties[AppCommand.AppCommandInvokedEventEnums.AppCommandId], eventProperties[AppCommand.AppCommandInvokedEventEnums.CallbackName], eventProperties[AppCommand.AppCommandInvokedEventEnums.EventObjStr]);
            };
            return AppCommandInvokedEventArgs;
        })();
        AppCommand.AppCommandInvokedEventArgs = AppCommandInvokedEventArgs;
        var AppCommandCallbackEventArgs = (function () {
            function AppCommandCallbackEventArgs() {
            }
            return AppCommandCallbackEventArgs;
        })();
        AppCommand.AppCommandCallbackEventArgs = AppCommandCallbackEventArgs;
        AppCommand.AppCommandInvokedEventEnums = {
            AppCommandId: "appCommandId",
            CallbackName: "callbackName",
            EventObjStr: "eventObjStr"
        };
    })(AppCommand = OfficeExt.AppCommand || (OfficeExt.AppCommand = {}));
})(OfficeExt || (OfficeExt = {}));
OfficeExt.AppCommand.AppCommandManager.initializeOsfDda();
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.OUtil.setNamespace("AppCommand", OSF.DDA.Marshaling);
var OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys;
(function (OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys) {
    OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys[OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys["AppCommandId"] = 0] = "AppCommandId";
    OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys[OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys["CallbackName"] = 1] = "CallbackName";
    OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys[OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys["EventObjStr"] = 2] = "EventObjStr";
})(OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys || (OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys = {}));
;
OSF.DDA.Marshaling.AppCommand.AppCommandInvokedEventKeys = OSF_DDA_Marshaling_AppCommand_AppCommandInvokedEventKeys;
var OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys;
(function (OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys) {
    OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys[OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys["Id"] = 0] = "Id";
    OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys[OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys["Status"] = 1] = "Status";
    OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys[OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys["Data"] = 2] = "Data";
})(OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys || (OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys = {}));
;
OSF.DDA.Marshaling.AppCommand.AppCommandCompletedMethodParameterKeys = OSF_DDA_Marshaling_AppCommand_AppCommandCompletedMethodParameterKeys;
var OfficeExt;
(function (OfficeExt) {
    var AppCommand;
    (function (AppCommand) {
        function registerDdaFacade() {
            if (OSF.DDA.WAC) {
                var parameterMap = OSF.DDA.WAC.Delegate.ParameterMap;
                parameterMap.define({
                    type: OSF.DDA.MethodDispId.dispidAppCommandInvocationCompletedMethod,
                    toHost: [
                        { name: Microsoft.Office.WebExtension.Parameters.Id, value: OSF.DDA.Marshaling.AppCommand.AppCommandCompletedMethodParameterKeys.Id },
                        { name: Microsoft.Office.WebExtension.Parameters.Status, value: OSF.DDA.Marshaling.AppCommand.AppCommandCompletedMethodParameterKeys.Status },
                        { name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.Marshaling.AppCommand.AppCommandCompletedMethodParameterKeys.Data }
                    ]
                });
                parameterMap.define({
                    type: OSF.DDA.EventDispId.dispidAppCommandInvokedEvent,
                    fromHost: [
                        { name: OSF.DDA.EventDescriptors.AppCommandInvokedEvent, value: parameterMap.self }
                    ]
                });
                parameterMap.addComplexType(OSF.DDA.EventDescriptors.AppCommandInvokedEvent);
                parameterMap.define({
                    type: OSF.DDA.EventDescriptors.AppCommandInvokedEvent,
                    fromHost: [
                        { name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.AppCommandId, value: OSF.DDA.Marshaling.AppCommand.AppCommandInvokedEventKeys.AppCommandId },
                        { name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.CallbackName, value: OSF.DDA.Marshaling.AppCommand.AppCommandInvokedEventKeys.CallbackName },
                        { name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.EventObjStr, value: OSF.DDA.Marshaling.AppCommand.AppCommandInvokedEventKeys.EventObjStr },
                    ]
                });
            }
        }
        AppCommand.registerDdaFacade = registerDdaFacade;
    })(AppCommand = OfficeExt.AppCommand || (OfficeExt.AppCommand = {}));
})(OfficeExt || (OfficeExt = {}));
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.CoercionType, { Image: "image" });
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, { DocumentSelectionChanged: "documentSelectionChanged" });
OSF.DDA.DocumentSelectionChangedEventArgs = function OSF_DDA_DocumentSelectionChangedEventArgs(docInstance) {
    OSF.OUtil.defineEnumerableProperties(this, {
        "type": {
            value: Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged
        },
        "document": {
            value: docInstance
        }
    });
};
OSF.DDA.WAC.Delegate.ParameterMap.define({ type: OSF.DDA.EventDispId.dispidDocumentSelectionChangedEvent });
OSF.DialogShownStatus = { hasDialogShown: false, isWindowDialog: false };
OSF.OUtil.augmentList(OSF.DDA.EventDescriptors, {
    DialogMessageReceivedEvent: "DialogMessageReceivedEvent"
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType, {
    DialogMessageReceived: "dialogMessageReceived",
    DialogEventReceived: "dialogEventReceived"
});
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors, {
    MessageType: "messageType",
    MessageContent: "messageContent"
});
OSF.DDA.DialogEventType = {};
OSF.OUtil.augmentList(OSF.DDA.DialogEventType, {
    DialogClosed: "dialogClosed",
    NavigationFailed: "naviationFailed"
});
OSF.DDA.AsyncMethodNames.addNames({
    DisplayDialogAsync: "displayDialogAsync",
    CloseAsync: "close"
});
OSF.DDA.SyncMethodNames.addNames({
    MessageParent: "messageParent",
    AddMessageHandler: "addEventHandler",
    SendMessage: "sendMessage"
});
OSF.DDA.UI.ParentUI = function OSF_DDA_ParentUI() {
    var eventDispatch = new OSF.EventDispatch([
        Microsoft.Office.WebExtension.EventType.DialogMessageReceived,
        Microsoft.Office.WebExtension.EventType.DialogEventReceived,
        Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived
    ]);
    var openDialogName = OSF.DDA.AsyncMethodNames.DisplayDialogAsync.displayName;
    var target = this;
    if (!target[openDialogName]) {
        OSF.OUtil.defineEnumerableProperty(target, openDialogName, {
            value: function () {
                var openDialog = OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.OpenDialog];
                openDialog(arguments, eventDispatch, target);
            }
        });
    }
    OSF.OUtil.finalizeProperties(this);
};
OSF.DDA.UI.ChildUI = function OSF_DDA_ChildUI(isPopupWindow) {
    var messageParentName = OSF.DDA.SyncMethodNames.MessageParent.displayName;
    var target = this;
    if (!target[messageParentName]) {
        OSF.OUtil.defineEnumerableProperty(target, messageParentName, {
            value: function () {
                var messageParent = OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.MessageParent];
                return messageParent(arguments, target);
            }
        });
    }
    var addEventHandler = OSF.DDA.SyncMethodNames.AddMessageHandler.displayName;
    if (!target[addEventHandler] && typeof OSF.DialogParentMessageEventDispatch != "undefined") {
        OSF.DDA.DispIdHost.addEventSupport(target, OSF.DialogParentMessageEventDispatch, isPopupWindow);
    }
    OSF.OUtil.finalizeProperties(this);
};
OSF.DialogHandler = function OSF_DialogHandler() { };
OSF.DDA.DialogEventArgs = function OSF_DDA_DialogEventArgs(message) {
    if (message[OSF.DDA.PropertyDescriptors.MessageType] == OSF.DialogMessageType.DialogMessageReceived) {
        OSF.OUtil.defineEnumerableProperties(this, {
            "type": {
                value: Microsoft.Office.WebExtension.EventType.DialogMessageReceived
            },
            "message": {
                value: message[OSF.DDA.PropertyDescriptors.MessageContent]
            }
        });
    }
    else {
        OSF.OUtil.defineEnumerableProperties(this, {
            "type": {
                value: Microsoft.Office.WebExtension.EventType.DialogEventReceived
            },
            "error": {
                value: message[OSF.DDA.PropertyDescriptors.MessageType]
            }
        });
    }
};
OSF.DDA.DialogParentEventArgs = function OSF_DDA_DialogParentEventArgs(message) {
    OSF.OUtil.defineEnumerableProperties(this, {
        "type": {
            value: Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived
        },
        "message": {
            value: message[OSF.DDA.PropertyDescriptors.MessageContent]
        }
    });
};
OSF.DDA.AsyncMethodCalls.define({
    method: OSF.DDA.AsyncMethodNames.DisplayDialogAsync,
    requiredArguments: [
        {
            "name": Microsoft.Office.WebExtension.Parameters.Url,
            "types": ["string"]
        }
    ],
    supportedOptions: [
        {
            name: Microsoft.Office.WebExtension.Parameters.Width,
            value: {
                "types": ["number"],
                "defaultValue": 99
            }
        },
        {
            name: Microsoft.Office.WebExtension.Parameters.Height,
            value: {
                "types": ["number"],
                "defaultValue": 99
            }
        },
        {
            name: Microsoft.Office.WebExtension.Parameters.RequireHTTPs,
            value: {
                "types": ["boolean"],
                "defaultValue": true
            }
        },
        {
            name: Microsoft.Office.WebExtension.Parameters.DisplayInIframe,
            value: {
                "types": ["boolean"],
                "defaultValue": false
            }
        }
    ],
    privateStateCallbacks: [],
    onSucceeded: function (args, caller, callArgs) {
        var targetId = args[Microsoft.Office.WebExtension.Parameters.Id];
        var eventDispatch = args[Microsoft.Office.WebExtension.Parameters.Data];
        var dialog = new OSF.DialogHandler();
        var closeDialog = OSF.DDA.AsyncMethodNames.CloseAsync.displayName;
        OSF.OUtil.defineEnumerableProperty(dialog, closeDialog, {
            value: function () {
                var closeDialogfunction = OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.CloseDialog];
                closeDialogfunction(arguments, targetId, eventDispatch, dialog);
            }
        });
        var addHandler = OSF.DDA.SyncMethodNames.AddMessageHandler.displayName;
        OSF.OUtil.defineEnumerableProperty(dialog, addHandler, {
            value: function () {
                var syncMethodCall = OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.AddMessageHandler.id];
                var callArgs = syncMethodCall.verifyAndExtractCall(arguments, dialog, eventDispatch);
                var eventType = callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
                var handler = callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
                return eventDispatch.addEventHandlerAndFireQueuedEvent(eventType, handler);
            }
        });
        var sendMessage = OSF.DDA.SyncMethodNames.SendMessage.displayName;
        OSF.OUtil.defineEnumerableProperty(dialog, sendMessage, {
            value: function () {
                var execute = OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.SendMessage];
                return execute(arguments, eventDispatch, dialog);
            }
        });
        return dialog;
    },
    checkCallArgs: function (callArgs, caller, stateInfo) {
        if (callArgs[Microsoft.Office.WebExtension.Parameters.Width] <= 0) {
            callArgs[Microsoft.Office.WebExtension.Parameters.Width] = 1;
        }
        if (callArgs[Microsoft.Office.WebExtension.Parameters.Width] > 100) {
            callArgs[Microsoft.Office.WebExtension.Parameters.Width] = 99;
        }
        if (callArgs[Microsoft.Office.WebExtension.Parameters.Height] <= 0) {
            callArgs[Microsoft.Office.WebExtension.Parameters.Height] = 1;
        }
        if (callArgs[Microsoft.Office.WebExtension.Parameters.Height] > 100) {
            callArgs[Microsoft.Office.WebExtension.Parameters.Height] = 99;
        }
        if (!callArgs[Microsoft.Office.WebExtension.Parameters.RequireHTTPs]) {
            callArgs[Microsoft.Office.WebExtension.Parameters.RequireHTTPs] = true;
        }
        return callArgs;
    }
});
OSF.DDA.AsyncMethodCalls.define({
    method: OSF.DDA.AsyncMethodNames.CloseAsync,
    requiredArguments: [],
    supportedOptions: [],
    privateStateCallbacks: []
});
OSF.DDA.SyncMethodCalls.define({
    method: OSF.DDA.SyncMethodNames.MessageParent,
    requiredArguments: [
        {
            "name": Microsoft.Office.WebExtension.Parameters.MessageToParent,
            "types": ["string", "number", "boolean"]
        }
    ],
    supportedOptions: []
});
OSF.DDA.SyncMethodCalls.define({
    method: OSF.DDA.SyncMethodNames.AddMessageHandler,
    requiredArguments: [
        {
            "name": Microsoft.Office.WebExtension.Parameters.EventType,
            "enum": Microsoft.Office.WebExtension.EventType,
            "verify": function (eventType, caller, eventDispatch) { return eventDispatch.supportsEvent(eventType); }
        },
        {
            "name": Microsoft.Office.WebExtension.Parameters.Handler,
            "types": ["function"]
        }
    ],
    supportedOptions: []
});
OSF.DDA.SyncMethodCalls.define({
    method: OSF.DDA.SyncMethodNames.SendMessage,
    requiredArguments: [
        {
            "name": Microsoft.Office.WebExtension.Parameters.MessageContent,
            "types": ["string"]
        }
    ],
    supportedOptions: [],
    privateStateCallbacks: []
});
OSF.OUtil.setNamespace("Marshaling", OSF.DDA);
OSF.OUtil.setNamespace("Dialog", OSF.DDA.Marshaling);
OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys = {
    MessageType: "messageType",
    MessageContent: "messageContent"
};
OSF.DDA.Marshaling.Dialog.DialogParentMessageReceivedEventKeys = {
    MessageType: "messageType",
    MessageContent: "messageContent"
};
OSF.DDA.Marshaling.MessageParentKeys = {
    MessageToParent: "messageToParent"
};
OSF.DDA.Marshaling.DialogNotificationShownEventType = {
    DialogNotificationShown: "dialogNotificationShown"
};
OSF.DDA.Marshaling.SendMessageKeys = {
    MessageContent: "messageContent"
};
var OfficeExt;
(function (OfficeExt) {
    var WacCommonUICssManager;
    (function (WacCommonUICssManager) {
        var hostType = {
            Excel: "excel",
            Word: "word",
            PowerPoint: "powerpoint",
            Outlook: "outlook"
        };
        function getDialogCssManager(applicationHostType) {
            switch (applicationHostType) {
                case hostType.Excel:
                case hostType.Word:
                case hostType.PowerPoint:
                case hostType.Outlook:
                    return new DefaultDialogCSSManager();
                default:
                    return new DefaultDialogCSSManager();
            }
            return null;
        }
        WacCommonUICssManager.getDialogCssManager = getDialogCssManager;
        var DefaultDialogCSSManager = (function () {
            function DefaultDialogCSSManager() {
                this.overlayElementCSS = [
                    "position: absolute",
                    "top: 0",
                    "left: 0",
                    "width: 100%",
                    "height: 100%",
                    "background-color: rgba(198, 198, 198, 0.5)",
                    "z-index: 99998"
                ];
                this.dialogNotificationPanelCSS = [
                    "width: 100%",
                    "height: 190px",
                    "position: absolute",
                    "z-index: 99999",
                    "background-color: rgba(255, 255, 255, 1)",
                    "left: 0px",
                    "top: 50%",
                    "margin-top: -95px"
                ];
                this.newWindowNotificationTextPanelCSS = [
                    "margin: 20px 14px",
                    "font-family: Segoe UI,Arial,Verdana,sans-serif",
                    "font-size: 14px",
                    "height: 100px",
                    "line-height: 100px"
                ];
                this.newWindowNotificationTextSpanCSS = [
                    "display: inline-block",
                    "line-height: normal",
                    "vertical-align: middle"
                ];
                this.crossZoneNotificationTextPanelCSS = [
                    "margin: 20px 14px",
                    "font-family: Segoe UI,Arial,Verdana,sans-serif",
                    "font-size: 14px",
                    "height: 100px",
                ];
                this.dialogNotificationButtonPanelCSS = "margin:0px 9px";
                this.buttonStyleCSS = [
                    "text-align: center",
                    "width: 70px",
                    "height: 25px",
                    "font-size: 14px",
                    "font-family: Segoe UI,Arial,Verdana,sans-serif",
                    "margin: 0px 5px",
                    "border-width: 1px",
                    "border-style: solid"
                ];
            }
            DefaultDialogCSSManager.prototype.getOverlayElementCSS = function () {
                return this.overlayElementCSS.join(";");
            };
            DefaultDialogCSSManager.prototype.getDialogNotificationPanelCSS = function () {
                return this.dialogNotificationPanelCSS.join(";");
            };
            DefaultDialogCSSManager.prototype.getNewWindowNotificationTextPanelCSS = function () {
                return this.newWindowNotificationTextPanelCSS.join(";");
            };
            DefaultDialogCSSManager.prototype.getNewWindowNotificationTextSpanCSS = function () {
                return this.newWindowNotificationTextSpanCSS.join(";");
            };
            DefaultDialogCSSManager.prototype.getCrossZoneNotificationTextPanelCSS = function () {
                return this.crossZoneNotificationTextPanelCSS.join(";");
            };
            DefaultDialogCSSManager.prototype.getDialogNotificationButtonPanelCSS = function () {
                return this.dialogNotificationButtonPanelCSS;
            };
            DefaultDialogCSSManager.prototype.getDialogButtonCSS = function () {
                return this.buttonStyleCSS.join(";");
            };
            return DefaultDialogCSSManager;
        })();
        WacCommonUICssManager.DefaultDialogCSSManager = DefaultDialogCSSManager;
    })(WacCommonUICssManager = OfficeExt.WacCommonUICssManager || (OfficeExt.WacCommonUICssManager = {}));
})(OfficeExt || (OfficeExt = {}));
var OfficeExt;
(function (OfficeExt) {
    var AddinNativeAction;
    (function (AddinNativeAction) {
        var Dialog;
        (function (Dialog) {
            var windowInstance = null;
            var handler = null;
            var overlayElement = null;
            var dialogNotificationPanel = null;
            var closeDialogKey = "osfDialogInternal:action=closeDialog";
            var showDialogCallback = null;
            var hasCrossZoneNotification = false;
            var checkWindowDialogCloseInterval = -1;
            var hostThemeButtonStyle = null;
            var commonButtonBorderColor = "#ababab";
            var commonButtonBackgroundColor = "#ffffff";
            var commonEventInButtonBackgroundColor = "#ccc";
            var newWindowNotificationId = "newWindowNotificaiton";
            var crossZoneNotificationId = "crossZoneNotification";
            var configureBrowserLinkId = "configureBrowserLink";
            var registerDialogNotificationShownArgs = {
                "dispId": OSF.DDA.EventDispId.dispidDialogNotificationShownInAddinEvent,
                "eventType": OSF.DDA.Marshaling.DialogNotificationShownEventType.DialogNotificationShown,
                "onComplete": null
            };
            function setHostThemeButtonStyle(args) {
                var hostThemeButtonStyleArgs = args.input;
                if (hostThemeButtonStyleArgs != null) {
                    hostThemeButtonStyle = {
                        HostButtonBorderColor: hostThemeButtonStyleArgs[OSF.HostThemeButtonStyleKeys.ButtonBorderColor],
                        HostButtonBackgroundColor: hostThemeButtonStyleArgs[OSF.HostThemeButtonStyleKeys.ButtonBackgroundColor]
                    };
                }
                args.completed();
            }
            Dialog.setHostThemeButtonStyle = setHostThemeButtonStyle;
            function handleNewWindowDialog(dialogInfo) {
                try {
                    hasCrossZoneNotification = false;
                    var ignoreButtonKeyDownClick = false;
                    var hostInfoObj = OSF._OfficeAppFactory.getInitializationHelper()._hostInfo;
                    var dialogCssManager = OfficeExt.WacCommonUICssManager.getDialogCssManager(hostInfoObj.hostType);
                    var notificationText = OSF.OUtil.formatString(Strings.OfficeOM.L_ShowWindowDialogNotification, OSF._OfficeAppFactory.getInitializationHelper()._appContext._addinName);
                    overlayElement = createOverlayElement(dialogCssManager);
                    document.body.insertBefore(overlayElement, document.body.firstChild);
                    dialogNotificationPanel = createNotificationPanel(dialogCssManager, notificationText);
                    dialogNotificationPanel.id = newWindowNotificationId;
                    var dialogNotificationButtonPanel = createButtonPanel(dialogCssManager);
                    var allowButton = createButtonControl(dialogCssManager, Strings.OfficeOM.L_ShowWindowDialogNotificationAllow);
                    var ignoreButton = createButtonControl(dialogCssManager, Strings.OfficeOM.L_ShowWindowDialogNotificationIgnore);
                    dialogNotificationButtonPanel.appendChild(allowButton);
                    dialogNotificationButtonPanel.appendChild(ignoreButton);
                    dialogNotificationPanel.appendChild(dialogNotificationButtonPanel);
                    document.body.insertBefore(dialogNotificationPanel, document.body.firstChild);
                    allowButton.onclick = function () {
                        showDialog(dialogInfo);
                        if (!hasCrossZoneNotification) {
                            dismissDialogNotification();
                        }
                    };
                    function ignoreButtonClickEventHandler() {
                        function unregisterDialogNotificationShownEventCallback(status) {
                            removeDialogNotificationElement();
                            setFocusOnFirstElement(status);
                            showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeEndUserIgnore);
                        }
                        registerDialogNotificationShownArgs.onComplete = unregisterDialogNotificationShownEventCallback;
                        OSF.DDA.WAC.Delegate.unregisterEventAsync(registerDialogNotificationShownArgs);
                    }
                    ignoreButton.onclick = ignoreButtonClickEventHandler;
                    allowButton.addEventListener("keydown", function (event) {
                        if (event.shiftKey && event.keyCode == 9) {
                            handleButtonControlEventOut(allowButton);
                            handleButtonControlEventIn(ignoreButton);
                            ignoreButton.focus();
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }, false);
                    ignoreButton.addEventListener("keydown", function (event) {
                        if (!event.shiftKey && event.keyCode == 9) {
                            handleButtonControlEventOut(ignoreButton);
                            handleButtonControlEventIn(allowButton);
                            allowButton.focus();
                            event.preventDefault();
                            event.stopPropagation();
                        }
                        else if (event.keyCode == 13) {
                            ignoreButtonKeyDownClick = true;
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }, false);
                    ignoreButton.addEventListener("keyup", function (event) {
                        if (event.keyCode == 13 && ignoreButtonKeyDownClick) {
                            ignoreButtonKeyDownClick = false;
                            ignoreButtonClickEventHandler();
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }, false);
                    window.focus();
                    function registerDialogNotificationShownEventCallback(status) {
                        allowButton.focus();
                    }
                    registerDialogNotificationShownArgs.onComplete = registerDialogNotificationShownEventCallback;
                    OSF.DDA.WAC.Delegate.registerEventAsync(registerDialogNotificationShownArgs);
                }
                catch (e) {
                    if (OSF.AppTelemetry) {
                        OSF.AppTelemetry.logAppException("Exception happens at new window dialog." + e);
                    }
                    showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
                }
            }
            Dialog.handleNewWindowDialog = handleNewWindowDialog;
            function closeDialog(callback) {
                try {
                    if (windowInstance != null) {
                        var appDomains = OSF._OfficeAppFactory.getInitializationHelper()._appContext._appDomains;
                        if (appDomains) {
                            for (var i = 0; i < appDomains.length && appDomains[i].indexOf("://") !== -1; i++) {
                                windowInstance.postMessage(closeDialogKey, appDomains[i]);
                            }
                        }
                        if (windowInstance != null && !windowInstance.closed) {
                            windowInstance.close();
                        }
                        window.removeEventListener("message", receiveMessage);
                        window.clearInterval(checkWindowDialogCloseInterval);
                        windowInstance = null;
                        callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
                    }
                    else {
                        callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
                    }
                }
                catch (e) {
                    if (OSF.AppTelemetry) {
                        OSF.AppTelemetry.logAppException("Exception happens at close window dialog." + e);
                    }
                    callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
                }
            }
            Dialog.closeDialog = closeDialog;
            function messageParent(params) {
                var message = params.hostCallArgs[Microsoft.Office.WebExtension.Parameters.MessageToParent];
                var appDomains = OSF._OfficeAppFactory.getInitializationHelper()._appContext._appDomains;
                if (appDomains) {
                    for (var i = 0; i < appDomains.length && appDomains[i].indexOf("://") !== -1; i++) {
                        window.opener.postMessage(message, appDomains[i]);
                    }
                }
            }
            Dialog.messageParent = messageParent;
            function sendMessage(params) {
                if (windowInstance != null) {
                    var message = params.hostCallArgs, appDomains = OSF._OfficeAppFactory.getInitializationHelper()._appContext._appDomains;
                    if (appDomains) {
                        for (var i = 0; i < appDomains.length && appDomains[i].indexOf("://") !== -1; i++) {
                            if (typeof message != "string") {
                                message = JSON.stringify(message);
                            }
                            windowInstance.postMessage(message, appDomains[i]);
                        }
                    }
                }
            }
            Dialog.sendMessage = sendMessage;
            function registerMessageReceivedEvent() {
                function receiveCloseDialogMessage(event) {
                    if (event.source == window.opener) {
                        if (typeof event.data === "string" && event.data.indexOf(closeDialogKey) > -1) {
                            window.close();
                        }
                        else {
                            var messageContent = event.data, type = typeof messageContent;
                            if (messageContent && (type == "object" || type == "string")) {
                                if (type == "string") {
                                    messageContent = JSON.parse(messageContent);
                                }
                                var eventArgs = OSF.DDA.OMFactory.manufactureEventArgs(Microsoft.Office.WebExtension.EventType.DialogParentMessageReceived, null, messageContent);
                                OSF.DialogParentMessageEventDispatch.fireEvent(eventArgs);
                            }
                        }
                    }
                }
                window.addEventListener("message", receiveCloseDialogMessage);
            }
            Dialog.registerMessageReceivedEvent = registerMessageReceivedEvent;
            function setHandlerAndShowDialogCallback(onEventHandler, callback) {
                handler = onEventHandler;
                showDialogCallback = callback;
            }
            Dialog.setHandlerAndShowDialogCallback = setHandlerAndShowDialogCallback;
            function escDismissDialogNotification() {
                try {
                    if (dialogNotificationPanel && (dialogNotificationPanel.id == newWindowNotificationId) && showDialogCallback) {
                        showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeEndUserIgnore);
                    }
                }
                catch (e) {
                    if (OSF.AppTelemetry) {
                        OSF.AppTelemetry.logAppException("Error happened during executing displayDialogAsync callback." + e);
                    }
                }
                dismissDialogNotification();
            }
            Dialog.escDismissDialogNotification = escDismissDialogNotification;
            function showCrossZoneNotification(windowUrl, hostType) {
                var okButtonKeyDownClick = false;
                var dialogCssManager = OfficeExt.WacCommonUICssManager.getDialogCssManager(hostType);
                overlayElement = createOverlayElement(dialogCssManager);
                document.body.insertBefore(overlayElement, document.body.firstChild);
                dialogNotificationPanel = createNotificationPanelForCrossZoneIssue(dialogCssManager, windowUrl);
                dialogNotificationPanel.id = crossZoneNotificationId;
                var dialogNotificationButtonPanel = createButtonPanel(dialogCssManager);
                var okButton = createButtonControl(dialogCssManager, "OK");
                dialogNotificationButtonPanel.appendChild(okButton);
                dialogNotificationPanel.appendChild(dialogNotificationButtonPanel);
                document.body.insertBefore(dialogNotificationPanel, document.body.firstChild);
                hasCrossZoneNotification = true;
                okButton.onclick = function () {
                    dismissDialogNotification();
                };
                okButton.addEventListener("keydown", function (event) {
                    if (event.keyCode == 9) {
                        document.getElementById(configureBrowserLinkId).focus();
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    else if (event.keyCode == 13) {
                        okButtonKeyDownClick = true;
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }, false);
                okButton.addEventListener("keyup", function (event) {
                    if (event.keyCode == 13 && okButtonKeyDownClick) {
                        okButtonKeyDownClick = false;
                        dismissDialogNotification();
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }, false);
                document.getElementById(configureBrowserLinkId).addEventListener("keydown", function (event) {
                    if (event.keyCode == 9) {
                        okButton.focus();
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }, false);
                window.focus();
                okButton.focus();
            }
            Dialog.showCrossZoneNotification = showCrossZoneNotification;
            function receiveMessage(event) {
                if (event.source == windowInstance) {
                    try {
                        var dialogMessageReceivedArgs = {};
                        dialogMessageReceivedArgs[OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys.MessageType] = OSF.DialogMessageType.DialogMessageReceived;
                        dialogMessageReceivedArgs[OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys.MessageContent] = event.data;
                        handler(dialogMessageReceivedArgs);
                    }
                    catch (e) {
                        if (OSF.AppTelemetry) {
                            OSF.AppTelemetry.logAppException("Error happened during receive message handler." + e);
                        }
                    }
                }
            }
            function showDialog(dialogInfo) {
                var hostInfoObj = OSF._OfficeAppFactory.getInitializationHelper()._hostInfo;
                var hostInfoVals = [
                    hostInfoObj.hostType,
                    hostInfoObj.hostPlatform,
                    hostInfoObj.hostSpecificFileVersion,
                    hostInfoObj.hostLocale,
                    hostInfoObj.osfControlAppCorrelationId,
                    "isDialog"
                ];
                var hostInfo = hostInfoVals.join("|");
                var appContext = OSF._OfficeAppFactory.getInitializationHelper()._appContext;
                var windowUrl = dialogInfo[OSF.ShowWindowDialogParameterKeys.Url];
                windowUrl = OfficeExt.WACUtils.addHostInfoAsQueryParam(windowUrl, hostInfo);
                var windowName = JSON.parse(window.name);
                windowName[OSF.WindowNameItemKeys.HostInfo] = hostInfo;
                windowName[OSF.WindowNameItemKeys.AppContext] = appContext;
                var width = dialogInfo[OSF.ShowWindowDialogParameterKeys.Width] * appContext._clientWindowWidth / 100;
                var height = dialogInfo[OSF.ShowWindowDialogParameterKeys.Height] * appContext._clientWindowHeight / 100;
                var left = appContext._clientWindowWidth / 2 - width / 2;
                var top = appContext._clientWindowHeight / 2 - height / 2;
                var windowSpecs = "width=" + width + ", height=" + height + ", left=" + left + ", top=" + top + ",channelmode=no,directories=no,fullscreen=no,location=no,menubar=no,resizable=yes,scrollbars=yes,status=no,titlebar=yes,toolbar=no";
                windowInstance = window.open(windowUrl, OfficeExt.WACUtils.serializeObjectToString(windowName), windowSpecs);
                if (windowInstance == null) {
                    OSF.AppTelemetry.logAppCommonMessage("Encountered cross zone issue in displayDialogAsync api.");
                    removeDialogNotificationElement();
                    showCrossZoneNotification(windowUrl, hostInfoObj.hostType);
                    showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeCrossZone);
                    return;
                }
                window.addEventListener("message", receiveMessage);
                function checkWindowClose() {
                    try {
                        if (windowInstance == null || windowInstance.closed) {
                            window.clearInterval(checkWindowDialogCloseInterval);
                            window.removeEventListener("message", receiveMessage);
                            var dialogClosedArgs = {};
                            dialogClosedArgs[OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys.MessageType] = OSF.DialogMessageType.DialogClosed;
                            handler(dialogClosedArgs);
                        }
                    }
                    catch (e) {
                        if (OSF.AppTelemetry) {
                            OSF.AppTelemetry.logAppException("Error happened during check or handle window close." + e);
                        }
                    }
                }
                checkWindowDialogCloseInterval = window.setInterval(checkWindowClose, 1000);
                if (showDialogCallback != null) {
                    showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
                }
                else {
                    if (OSF.AppTelemetry) {
                        OSF.AppTelemetry.logAppException("showDialogCallback can not be null.");
                    }
                }
            }
            function createButtonControl(dialogCssManager, buttonValue) {
                var buttonControl = document.createElement("input");
                buttonControl.setAttribute("type", "button");
                buttonControl.style.cssText = dialogCssManager.getDialogButtonCSS();
                buttonControl.style.borderColor = commonButtonBorderColor;
                buttonControl.style.backgroundColor = commonButtonBackgroundColor;
                buttonControl.setAttribute("value", buttonValue);
                var buttonControlEventInHandler = function () {
                    handleButtonControlEventIn(buttonControl);
                };
                var buttonControlEventOutHandler = function () {
                    handleButtonControlEventOut(buttonControl);
                };
                buttonControl.addEventListener("mouseover", buttonControlEventInHandler);
                buttonControl.addEventListener("focus", buttonControlEventInHandler);
                buttonControl.addEventListener("mouseout", buttonControlEventOutHandler);
                buttonControl.addEventListener("focusout", buttonControlEventOutHandler);
                return buttonControl;
            }
            function handleButtonControlEventIn(buttonControl) {
                if (hostThemeButtonStyle != null) {
                    buttonControl.style.borderColor = hostThemeButtonStyle.HostButtonBorderColor;
                    buttonControl.style.backgroundColor = hostThemeButtonStyle.HostButtonBackgroundColor;
                }
                else if (OSF.CommonUI && OSF.CommonUI.HostButtonBorderColor && OSF.CommonUI.HostButtonBackgroundColor) {
                    buttonControl.style.borderColor = OSF.CommonUI.HostButtonBorderColor;
                    buttonControl.style.backgroundColor = OSF.CommonUI.HostButtonBackgroundColor;
                }
                else {
                    buttonControl.style.backgroundColor = commonEventInButtonBackgroundColor;
                }
            }
            function handleButtonControlEventOut(buttonControl) {
                buttonControl.style.borderColor = commonButtonBorderColor;
                buttonControl.style.backgroundColor = commonButtonBackgroundColor;
            }
            function dismissDialogNotification() {
                function unregisterDialogNotificationShownEventCallback(status) {
                    removeDialogNotificationElement();
                    setFocusOnFirstElement(status);
                }
                registerDialogNotificationShownArgs.onComplete = unregisterDialogNotificationShownEventCallback;
                OSF.DDA.WAC.Delegate.unregisterEventAsync(registerDialogNotificationShownArgs);
            }
            function removeDialogNotificationElement() {
                if (dialogNotificationPanel != null) {
                    document.body.removeChild(dialogNotificationPanel);
                    dialogNotificationPanel = null;
                }
                if (overlayElement != null) {
                    document.body.removeChild(overlayElement);
                    overlayElement = null;
                }
            }
            function createOverlayElement(dialogCssManager) {
                var overlayElement = document.createElement("div");
                overlayElement.style.cssText = dialogCssManager.getOverlayElementCSS();
                return overlayElement;
            }
            function createNotificationPanel(dialogCssManager, notificationString) {
                var dialogNotificationPanel = document.createElement("div");
                dialogNotificationPanel.style.cssText = dialogCssManager.getDialogNotificationPanelCSS();
                var dialogNotificationTextPanel = document.createElement("div");
                dialogNotificationTextPanel.style.cssText = dialogCssManager.getNewWindowNotificationTextPanelCSS();
                if (document.documentElement.getAttribute("dir") == "rtl") {
                    dialogNotificationTextPanel.style.paddingRight = "30px";
                }
                else {
                    dialogNotificationTextPanel.style.paddingLeft = "30px";
                }
                var dialogNotificationTextSpan = document.createElement("span");
                dialogNotificationTextSpan.style.cssText = dialogCssManager.getNewWindowNotificationTextSpanCSS();
                dialogNotificationTextSpan.innerText = notificationString;
                dialogNotificationTextPanel.appendChild(dialogNotificationTextSpan);
                dialogNotificationPanel.appendChild(dialogNotificationTextPanel);
                return dialogNotificationPanel;
            }
            function createButtonPanel(dialogCssManager) {
                var dialogNotificationButtonPanel = document.createElement("div");
                dialogNotificationButtonPanel.style.cssText = dialogCssManager.getDialogNotificationButtonPanelCSS();
                if (document.documentElement.getAttribute("dir") == "rtl") {
                    dialogNotificationButtonPanel.style.cssFloat = "left";
                }
                else {
                    dialogNotificationButtonPanel.style.cssFloat = "right";
                }
                return dialogNotificationButtonPanel;
            }
            function setFocusOnFirstElement(status) {
                if (status != OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
                    var list = document.querySelectorAll(OSF._OfficeAppFactory.getInitializationHelper()._tabbableElements);
                    OSF.OUtil.focusToFirstTabbable(list, false);
                }
            }
            function createNotificationPanelForCrossZoneIssue(dialogCssManager, windowUrl) {
                var dialogNotificationPanel = document.createElement("div");
                dialogNotificationPanel.style.cssText = dialogCssManager.getDialogNotificationPanelCSS();
                var dialogNotificationTextPanel = document.createElement("div");
                dialogNotificationTextPanel.style.cssText = dialogCssManager.getCrossZoneNotificationTextPanelCSS();
                var configureBrowserLink = document.createElement("a");
                configureBrowserLink.id = configureBrowserLinkId;
                configureBrowserLink.href = "#";
                configureBrowserLink.innerText = Strings.OfficeOM.L_NewWindowCrossZoneConfigureBrowserLink;
                configureBrowserLink.setAttribute("onclick", "window.open('https://support.microsoft.com/en-us/help/17479/windows-internet-explorer-11-change-security-privacy-settings', '_blank', 'fullscreen=1')");
                var dialogNotificationTextSpan = document.createElement("span");
                if (Strings.OfficeOM.L_NewWindowCrossZone) {
                    dialogNotificationTextSpan.innerHTML = OSF.OUtil.formatString(Strings.OfficeOM.L_NewWindowCrossZone, configureBrowserLink.outerHTML, OfficeExt.WACUtils.getDomainForUrl(windowUrl));
                }
                dialogNotificationTextPanel.appendChild(dialogNotificationTextSpan);
                dialogNotificationPanel.appendChild(dialogNotificationTextPanel);
                return dialogNotificationPanel;
            }
        })(Dialog = AddinNativeAction.Dialog || (AddinNativeAction.Dialog = {}));
    })(AddinNativeAction = OfficeExt.AddinNativeAction || (OfficeExt.AddinNativeAction = {}));
})(OfficeExt || (OfficeExt = {}));
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.EventDispId.dispidDialogMessageReceivedEvent,
    fromHost: [
        { name: OSF.DDA.EventDescriptors.DialogMessageReceivedEvent, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.EventDescriptors.DialogMessageReceivedEvent);
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.EventDescriptors.DialogMessageReceivedEvent,
    fromHost: [
        { name: OSF.DDA.PropertyDescriptors.MessageType, value: OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys.MessageType },
        { name: OSF.DDA.PropertyDescriptors.MessageContent, value: OSF.DDA.Marshaling.Dialog.DialogMessageReceivedEventKeys.MessageContent }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.EventDispId.dispidDialogParentMessageReceivedEvent,
    fromHost: [
        { name: OSF.DDA.EventDescriptors.DialogParentMessageReceivedEvent, value: OSF.DDA.WAC.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.addComplexType(OSF.DDA.EventDescriptors.DialogParentMessageReceivedEvent);
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.EventDescriptors.DialogParentMessageReceivedEvent,
    fromHost: [
        { name: OSF.DDA.PropertyDescriptors.MessageType, value: OSF.DDA.Marshaling.Dialog.DialogParentMessageReceivedEventKeys.MessageType },
        { name: OSF.DDA.PropertyDescriptors.MessageContent, value: OSF.DDA.Marshaling.Dialog.DialogParentMessageReceivedEventKeys.MessageContent }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidMessageParentMethod,
    toHost: [
        { name: Microsoft.Office.WebExtension.Parameters.MessageToParent, value: OSF.DDA.Marshaling.MessageParentKeys.MessageToParent }
    ]
});
OSF.DDA.WAC.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidSendMessageMethod,
    toHost: [
        { name: Microsoft.Office.WebExtension.Parameters.MessageContent, value: OSF.DDA.Marshaling.SendMessageKeys.MessageContent }
    ]
});
OSF.DDA.WAC.Delegate.openDialog = function OSF_DDA_WAC_Delegate$OpenDialog(args) {
    var httpsIdentifyString = "https://";
    var httpIdentifyString = "http://";
    var dialogInfo = JSON.parse(args.targetId);
    var callback = OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent(true, args);
    function showDialogCallback(status) {
        var payload = { "Error": status };
        callback(Microsoft.Office.Common.InvokeResultCode.noError, payload);
    }
    if (OSF.DialogShownStatus.hasDialogShown) {
        showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeDialogAlreadyOpened);
        return;
    }
    var dialogUrl = dialogInfo[OSF.ShowWindowDialogParameterKeys.Url].toLowerCase();
    if (dialogUrl == null || !(dialogUrl.substr(0, httpsIdentifyString.length) === httpsIdentifyString)) {
        if (dialogUrl.substr(0, httpIdentifyString.length) === httpIdentifyString) {
            showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeRequireHTTPS);
        }
        else {
            showDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidScheme);
        }
        return;
    }
    if (!dialogInfo[OSF.ShowWindowDialogParameterKeys.DisplayInIframe]) {
        OSF.DialogShownStatus.isWindowDialog = true;
        OfficeExt.AddinNativeAction.Dialog.setHandlerAndShowDialogCallback(function OSF_DDA_WACDelegate$RegisterEventAsync_OnEvent(payload) {
            if (args.onEvent) {
                args.onEvent(payload);
            }
            if (OSF.AppTelemetry) {
                OSF.AppTelemetry.onEventDone(args.dispId);
            }
        }, showDialogCallback);
        OfficeExt.AddinNativeAction.Dialog.handleNewWindowDialog(dialogInfo);
    }
    else {
        OSF.DialogShownStatus.isWindowDialog = false;
        OSF.DDA.WAC.Delegate.registerEventAsync(args);
    }
};
OSF.DDA.WAC.Delegate.messageParent = function OSF_DDA_WAC_Delegate$MessageParent(args) {
    if (window.opener != null) {
        OfficeExt.AddinNativeAction.Dialog.messageParent(args);
    }
    else {
        OSF.DDA.WAC.Delegate.executeAsync(args);
    }
};
OSF.DDA.WAC.Delegate.sendMessage = function OSF_DDA_WAC_Delegate$SendMessage(args) {
    if (OSF.DialogShownStatus.hasDialogShown) {
        if (OSF.DialogShownStatus.isWindowDialog) {
            OfficeExt.AddinNativeAction.Dialog.sendMessage(args);
        }
        else {
            OSF.DDA.WAC.Delegate.executeAsync(args);
        }
    }
};
OSF.DDA.WAC.Delegate.closeDialog = function OSF_DDA_WAC_Delegate$CloseDialog(args) {
    var callback = OSF.DDA.WAC.Delegate._getOnAfterRegisterEvent(false, args);
    function closeDialogCallback(status) {
        var payload = { "Error": status };
        callback(Microsoft.Office.Common.InvokeResultCode.noError, payload);
    }
    if (!OSF.DialogShownStatus.hasDialogShown) {
        closeDialogCallback(OSF.DDA.ErrorCodeManager.errorCodes.ooeWebDialogClosed);
    }
    else {
        if (OSF.DialogShownStatus.isWindowDialog) {
            if (args.onCalling) {
                args.onCalling();
            }
            OfficeExt.AddinNativeAction.Dialog.closeDialog(closeDialogCallback);
        }
        else {
            OSF.DDA.WAC.Delegate.unregisterEventAsync(args);
        }
    }
};
OSF.InitializationHelper.prototype.dismissDialogNotification = function OSF_InitializationHelper$dismissDialogNotification() {
    OfficeExt.AddinNativeAction.Dialog.escDismissDialogNotification();
};
OSF.InitializationHelper.prototype.registerMessageReceivedEventForWindowDialog = function OSF_InitializationHelper$registerMessageReceivedEventForWindowDialog() {
    OfficeExt.AddinNativeAction.Dialog.registerMessageReceivedEvent();
};
var OfficeExt;
(function (OfficeExt) {
    var AddinNativeAction;
    (function (AddinNativeAction) {
        var Snapshot;
        (function (Snapshot) {
            var SnapshotActionArgs = (function () {
                function SnapshotActionArgs() {
                }
                return SnapshotActionArgs;
            })();
            function loadHtml2CanvasWithOnCompleted(onAllCompleted, onError) {
                var html2canvasLoaded = function () {
                    return typeof (Html2canvas) !== "undefined" && typeof (Html2canvas.html2canvas) !== "undefined";
                };
                var promiseLoaded = function () {
                    return typeof (window.Promise) !== "undefined" || (typeof (OfficeExtension) !== "undefined" && typeof (OfficeExtension.Promise) !== "undefined");
                };
                if (html2canvasLoaded() && promiseLoaded()) {
                    onAllCompleted();
                    return;
                }
                var loadScriptHelper = new ScriptLoading.LoadScriptHelper();
                var basePath = loadScriptHelper.getOfficeJsBasePath();
                var files = {
                    html2canvasJs: 'Html2canvas.debug.js',
                    promiseJs: 'es6-promise.debug.js'
                };
                var onScriptsLoad = function () {
                    if (html2canvasLoaded() && promiseLoaded()) {
                        onAllCompleted();
                    }
                    else {
                        onError();
                    }
                };
                if (!promiseLoaded()) {
                    loadScriptHelper.loadScript(basePath + files.promiseJs, null, function () {
                        loadScriptHelper.loadScript(basePath + files.html2canvasJs, null, onScriptsLoad);
                    });
                }
                else {
                    loadScriptHelper.loadScript(basePath + files.html2canvasJs, null, onScriptsLoad);
                }
            }
            ;
            function generateLatestSnapshot(args) {
                if (!OfficeExt.WACUtils.isHostTrusted || !OfficeExt.WACUtils.isHostTrusted()) {
                    args.completed();
                }
                else {
                    var onFailed = function () {
                        args.completed();
                    };
                    var onRendered = function (canvas) {
                        try {
                            args.result = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
                        }
                        catch (e) {
                        }
                        args.completed();
                    };
                    var onLoadCompleted = function () {
                        try {
                            Html2canvas.html2canvas(document.body, { onrendered: onRendered });
                        }
                        catch (e) {
                            onFailed();
                        }
                    };
                    loadHtml2CanvasWithOnCompleted(onLoadCompleted, onFailed);
                }
            }
            Snapshot.generateLatestSnapshot = generateLatestSnapshot;
        })(Snapshot = AddinNativeAction.Snapshot || (AddinNativeAction.Snapshot = {}));
    })(AddinNativeAction = OfficeExt.AddinNativeAction || (OfficeExt.AddinNativeAction = {}));
})(OfficeExt || (OfficeExt = {}));
var OSFPPTWAC;
(function (OSFPPTWAC) {
    var PowerPointDocument = (function () {
        function PowerPointDocument(officeAppContext, settings) {
            OSF.DDA.DispIdHost.addEventSupport(this, new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.ActiveViewChanged,
                Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged]));
            OSF.DDA.PowerPointDocument.uber.constructor.call(this, officeAppContext, settings);
            OSF.DDA.DispIdHost.addAsyncMethods(this, [
                OSF.DDA.AsyncMethodNames.GetSelectedDataAsync,
                OSF.DDA.AsyncMethodNames.SetSelectedDataAsync,
                OSF.DDA.AsyncMethodNames.GoToByIdAsync,
                OSF.DDA.AsyncMethodNames.GetActiveViewAsync,
                OSF.DDA.AsyncMethodNames.GetDocumentCopyAsync,
                OSF.DDA.AsyncMethodNames.GetFilePropertiesAsync,
                OSF.DDA.SyncMethodNames.MessageParent
            ]);
            OSF.OUtil.finalizeProperties(this);
        }
        return PowerPointDocument;
    })();
    OSFPPTWAC.PowerPointDocument = PowerPointDocument;
})(OSFPPTWAC || (OSFPPTWAC = {}));
OSF.DDA.PowerPointDocument = OSFPPTWAC.PowerPointDocument;
OSF.OUtil.extend(OSF.DDA.PowerPointDocument, OSF.DDA.Document);
OSF.OUtil.redefineList(Microsoft.Office.WebExtension.GoToType, {
    Slide: "slide",
    Index: "index"
});
OSF.InitializationHelper.prototype.loadAppSpecificScriptAndCreateOM = function OSF_InitializationHelper$loadAppSpecificScriptAndCreateOM(appContext, appReady, basePath) {
    OSF.DDA.ErrorCodeManager.initializeErrorMessages(Strings.OfficeOM);
    appContext.doc = new OSF.DDA.PowerPointDocument(appContext, this._initializeSettings(appContext, true));
    appReady();
};
OSF.InitializationHelper.prototype.prepareRightBeforeWebExtensionInitialize = function OSF_InitializationHelper$prepareRightBeforeWebExtensionInitialize(appContext) {
    OSF.WebApp._UpdateLinksForHostAndXdmInfo();
    var license = new OSF.DDA.License(appContext.get_eToken());
    this.initWebDialog(appContext);
    OSF._OfficeAppFactory.setContext(new OSF.DDA.Context(appContext, appContext.doc, license));
    var getActivationCompletedStatusCallback;
    OSF._OfficeAppFactory.setHostFacade(new OSF.DDA.DispIdHost.Facade(OSF.DDA.WAC.getDelegateMethods, OSF.DDA.WAC.Delegate.ParameterMap));
    getActivationCompletedStatusCallback = function (invokeResultCode, status) {
        if (invokeResultCode == 0 && status != true) {
            OSF.getClientEndPoint().registerForEvent("activationCompleted", function () {
                var reason = appContext.get_reason();
                Microsoft.Office.WebExtension.initialize(reason);
            }, null, {
                "controlId": OSF._OfficeAppFactory.getId(),
                "eventDispId": OSF.DDA.EventDispId.dispidActivationStatusChangedEvent,
                "targetId": ""
            });
        }
        else {
            var reason = appContext.get_reason();
            Microsoft.Office.WebExtension.initialize(reason);
        }
    };
    OSF.getClientEndPoint().invoke("getActivationCompletedStatus", getActivationCompletedStatusCallback, this._webAppState.id);
    var themeHandler = new OSF.DDA.Theming.InternalThemeHandler();
    themeHandler.InitializeAndChangeOnce();
    var appCommandHandler = OfficeExt.AppCommand.AppCommandManager.instance();
    appCommandHandler.initializeAndChangeOnce();
};
