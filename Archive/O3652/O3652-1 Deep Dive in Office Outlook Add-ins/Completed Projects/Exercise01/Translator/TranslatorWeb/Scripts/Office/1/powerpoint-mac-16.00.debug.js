/* PowerPoint Mac specific API library */
/* Version: 16.0.7618.1000 */
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
OSF.OUtil.setNamespace("SafeArray", OSF.DDA);
OSF.DDA.SafeArray.Response = {
    Status: 0,
    Payload: 1
};
OSF.DDA.SafeArray.UniqueArguments = {
    Offset: "offset",
    Run: "run",
    BindingSpecificData: "bindingSpecificData",
    MergedCellGuid: "{66e7831f-81b2-42e2-823c-89e872d541b3}"
};
OSF.OUtil.setNamespace("Delegate", OSF.DDA.SafeArray);
OSF.DDA.SafeArray.Delegate._onException = function OSF_DDA_SafeArray_Delegate$OnException(ex, args) {
    var status;
    var statusNumber = ex.number;
    if (statusNumber) {
        switch (statusNumber) {
            case -2146828218:
                status = OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability;
                break;
            case -2147467259:
                status = OSF.DDA.ErrorCodeManager.errorCodes.ooeDialogAlreadyOpened;
                break;
            case -2146828283:
                status = OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidParam;
                break;
            case -2147209089:
                status = OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidParam;
                break;
            case -2146827850:
            default:
                status = OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
                break;
        }
    }
    if (args.onComplete) {
        args.onComplete(status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
    }
};
OSF.DDA.SafeArray.Delegate._onExceptionSyncMethod = function OSF_DDA_SafeArray_Delegate$OnExceptionSyncMethod(ex, args) {
    var status;
    var number = ex.number;
    if (number) {
        switch (number) {
            case -2146828218:
                status = OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability;
                break;
            case -2146827850:
            default:
                status = OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
                break;
        }
    }
    return status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
};
OSF.DDA.SafeArray.Delegate.SpecialProcessor = function OSF_DDA_SafeArray_Delegate_SpecialProcessor() {
    function _2DVBArrayToJaggedArray(vbArr) {
        var ret;
        try {
            var rows = vbArr.ubound(1);
            var cols = vbArr.ubound(2);
            vbArr = vbArr.toArray();
            if (rows == 1 && cols == 1) {
                ret = [vbArr];
            }
            else {
                ret = [];
                for (var row = 0; row < rows; row++) {
                    var rowArr = [];
                    for (var col = 0; col < cols; col++) {
                        var datum = vbArr[row * cols + col];
                        if (datum != OSF.DDA.SafeArray.UniqueArguments.MergedCellGuid) {
                            rowArr.push(datum);
                        }
                    }
                    if (rowArr.length > 0) {
                        ret.push(rowArr);
                    }
                }
            }
        }
        catch (ex) {
        }
        return ret;
    }
    var complexTypes = [];
    var dynamicTypes = {};
    dynamicTypes[Microsoft.Office.WebExtension.Parameters.Data] = (function () {
        var tableRows = 0;
        var tableHeaders = 1;
        return {
            toHost: function OSF_DDA_SafeArray_Delegate_SpecialProcessor_Data$toHost(data) {
                if (OSF.DDA.TableDataProperties && typeof data != "string" && data[OSF.DDA.TableDataProperties.TableRows] !== undefined) {
                    var tableData = [];
                    tableData[tableRows] = data[OSF.DDA.TableDataProperties.TableRows];
                    tableData[tableHeaders] = data[OSF.DDA.TableDataProperties.TableHeaders];
                    data = tableData;
                }
                return data;
            },
            fromHost: function OSF_DDA_SafeArray_Delegate_SpecialProcessor_Data$fromHost(hostArgs) {
                var ret;
                if (hostArgs.toArray) {
                    var dimensions = hostArgs.dimensions();
                    if (dimensions === 2) {
                        ret = _2DVBArrayToJaggedArray(hostArgs);
                    }
                    else {
                        var array = hostArgs.toArray();
                        if (array.length === 2 && ((array[0] != null && array[0].toArray) || (array[1] != null && array[1].toArray))) {
                            ret = {};
                            ret[OSF.DDA.TableDataProperties.TableRows] = _2DVBArrayToJaggedArray(array[tableRows]);
                            ret[OSF.DDA.TableDataProperties.TableHeaders] = _2DVBArrayToJaggedArray(array[tableHeaders]);
                        }
                        else {
                            ret = array;
                        }
                    }
                }
                else {
                    ret = hostArgs;
                }
                return ret;
            }
        };
    })();
    OSF.DDA.SafeArray.Delegate.SpecialProcessor.uber.constructor.call(this, complexTypes, dynamicTypes);
    this.unpack = function OSF_DDA_SafeArray_Delegate_SpecialProcessor$unpack(param, arg) {
        var value;
        if (this.isComplexType(param) || OSF.DDA.ListType.isListType(param)) {
            var toArraySupported = (arg || typeof arg === "unknown") && arg.toArray;
            value = toArraySupported ? arg.toArray() : arg || {};
        }
        else if (this.isDynamicType(param)) {
            value = dynamicTypes[param].fromHost(arg);
        }
        else {
            value = arg;
        }
        return value;
    };
};
OSF.OUtil.extend(OSF.DDA.SafeArray.Delegate.SpecialProcessor, OSF.DDA.SpecialProcessor);
OSF.DDA.SafeArray.Delegate.ParameterMap = OSF.DDA.getDecoratedParameterMap(new OSF.DDA.SafeArray.Delegate.SpecialProcessor(), [
    {
        type: Microsoft.Office.WebExtension.Parameters.ValueFormat,
        toHost: [
            { name: Microsoft.Office.WebExtension.ValueFormat.Unformatted, value: 0 },
            { name: Microsoft.Office.WebExtension.ValueFormat.Formatted, value: 1 }
        ]
    },
    {
        type: Microsoft.Office.WebExtension.Parameters.FilterType,
        toHost: [
            { name: Microsoft.Office.WebExtension.FilterType.All, value: 0 }
        ]
    }
]);
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.PropertyDescriptors.AsyncResultStatus,
    fromHost: [
        { name: Microsoft.Office.WebExtension.AsyncResultStatus.Succeeded, value: 0 },
        { name: Microsoft.Office.WebExtension.AsyncResultStatus.Failed, value: 1 }
    ]
});
OSF.DDA.SafeArray.Delegate.executeAsync = function OSF_DDA_SafeArray_Delegate$ExecuteAsync(args) {
    function toArray(args) {
        var arrArgs = args;
        if (OSF.OUtil.isArray(args)) {
            var len = arrArgs.length;
            for (var i = 0; i < len; i++) {
                arrArgs[i] = toArray(arrArgs[i]);
            }
        }
        else if (OSF.OUtil.isDate(args)) {
            arrArgs = args.getVarDate();
        }
        else if (typeof args === "object" && !OSF.OUtil.isArray(args)) {
            arrArgs = [];
            for (var index in args) {
                if (!OSF.OUtil.isFunction(args[index])) {
                    arrArgs[index] = toArray(args[index]);
                }
            }
        }
        return arrArgs;
    }
    function fromSafeArray(value) {
        var ret = value;
        if (value != null && value.toArray) {
            var arrayResult = value.toArray();
            ret = new Array(arrayResult.length);
            for (var i = 0; i < arrayResult.length; i++) {
                ret[i] = fromSafeArray(arrayResult[i]);
            }
        }
        return ret;
    }
    try {
        if (args.onCalling) {
            args.onCalling();
        }
        var startTime = (new Date()).getTime();
        OSF.ClientHostController.execute(args.dispId, toArray(args.hostCallArgs), function OSF_DDA_SafeArrayFacade$Execute_OnResponse(hostResponseArgs, resultCode) {
            var result = hostResponseArgs.toArray();
            var status = result[OSF.DDA.SafeArray.Response.Status];
            if (status == OSF.DDA.ErrorCodeManager.errorCodes.ooeChunkResult) {
                var payload = result[OSF.DDA.SafeArray.Response.Payload];
                payload = fromSafeArray(payload);
                if (payload != null) {
                    if (!args._chunkResultData) {
                        args._chunkResultData = new Array();
                    }
                    args._chunkResultData[payload[0]] = payload[1];
                }
                return false;
            }
            if (args.onReceiving) {
                args.onReceiving();
            }
            if (args.onComplete) {
                var payload;
                if (status == OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
                    if (result.length > 2) {
                        payload = [];
                        for (var i = 1; i < result.length; i++)
                            payload[i - 1] = result[i];
                    }
                    else {
                        payload = result[OSF.DDA.SafeArray.Response.Payload];
                    }
                    if (args._chunkResultData) {
                        payload = fromSafeArray(payload);
                        if (payload != null) {
                            var expectedChunkCount = payload[payload.length - 1];
                            if (args._chunkResultData.length == expectedChunkCount) {
                                payload[payload.length - 1] = args._chunkResultData;
                            }
                            else {
                                status = OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
                            }
                        }
                    }
                }
                else {
                    payload = result[OSF.DDA.SafeArray.Response.Payload];
                }
                args.onComplete(status, payload);
            }
            if (OSF.AppTelemetry) {
                OSF.AppTelemetry.onMethodDone(args.dispId, args.hostCallArgs, Math.abs((new Date()).getTime() - startTime), status);
            }
            return true;
        });
    }
    catch (ex) {
        OSF.DDA.SafeArray.Delegate._onException(ex, args);
    }
};
OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent = function OSF_DDA_SafeArrayDelegate$GetOnAfterRegisterEvent(register, args) {
    var startTime = (new Date()).getTime();
    return function OSF_DDA_SafeArrayDelegate$OnAfterRegisterEvent(hostResponseArgs) {
        if (args.onReceiving) {
            args.onReceiving();
        }
        var status = hostResponseArgs.toArray ? hostResponseArgs.toArray()[OSF.DDA.SafeArray.Response.Status] : hostResponseArgs;
        if (args.onComplete) {
            args.onComplete(status);
        }
        if (OSF.AppTelemetry) {
            OSF.AppTelemetry.onRegisterDone(register, args.dispId, Math.abs((new Date()).getTime() - startTime), status);
        }
    };
};
OSF.DDA.SafeArray.Delegate.registerEventAsync = function OSF_DDA_SafeArray_Delegate$RegisterEventAsync(args) {
    if (args.onCalling) {
        args.onCalling();
    }
    var callback = OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent(true, args);
    try {
        OSF.ClientHostController.registerEvent(args.dispId, args.targetId, function OSF_DDA_SafeArrayDelegate$RegisterEventAsync_OnEvent(eventDispId, payload) {
            if (args.onEvent) {
                args.onEvent(payload);
            }
            if (OSF.AppTelemetry) {
                OSF.AppTelemetry.onEventDone(args.dispId);
            }
        }, callback);
    }
    catch (ex) {
        OSF.DDA.SafeArray.Delegate._onException(ex, args);
    }
};
OSF.DDA.SafeArray.Delegate.unregisterEventAsync = function OSF_DDA_SafeArray_Delegate$UnregisterEventAsync(args) {
    if (args.onCalling) {
        args.onCalling();
    }
    var callback = OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent(false, args);
    try {
        OSF.ClientHostController.unregisterEvent(args.dispId, args.targetId, callback);
    }
    catch (ex) {
        OSF.DDA.SafeArray.Delegate._onException(ex, args);
    }
};
OSF.ClientMode = {
    ReadWrite: 0,
    ReadOnly: 1
};
OSF.DDA.RichInitializationReason = {
    1: Microsoft.Office.WebExtension.InitializationReason.Inserted,
    2: Microsoft.Office.WebExtension.InitializationReason.DocumentOpened
};
OSF.InitializationHelper = function OSF_InitializationHelper(hostInfo, webAppState, context, settings, hostFacade) {
    this._hostInfo = hostInfo;
    this._webAppState = webAppState;
    this._context = context;
    this._settings = settings;
    this._hostFacade = hostFacade;
    this._initializeSettings = this.initializeSettings;
};
OSF.InitializationHelper.prototype.deserializeSettings = function OSF_InitializationHelper$deserializeSettings(serializedSettings, refreshSupported) {
    var settings;
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
OSF.InitializationHelper.prototype.saveAndSetDialogInfo = function OSF_InitializationHelper$saveAndSetDialogInfo(hostInfoValue) {
};
OSF.InitializationHelper.prototype.setAgaveHostCommunication = function OSF_InitializationHelper$setAgaveHostCommunication() {
};
OSF.InitializationHelper.prototype.prepareRightBeforeWebExtensionInitialize = function OSF_InitializationHelper$prepareRightBeforeWebExtensionInitialize(appContext) {
    this.prepareApiSurface(appContext);
    Microsoft.Office.WebExtension.initialize(this.getInitializationReason(appContext));
};
OSF.InitializationHelper.prototype.prepareApiSurface = function OSF_InitializationHelper$prepareApiSurfaceAndInitialize(appContext) {
    var license = new OSF.DDA.License(appContext.get_eToken());
    var getOfficeThemeHandler = (OSF.DDA.OfficeTheme && OSF.DDA.OfficeTheme.getOfficeTheme) ? OSF.DDA.OfficeTheme.getOfficeTheme : null;
    if (appContext.get_isDialog()) {
        if (OSF.DDA.UI.ChildUI) {
            appContext.ui = new OSF.DDA.UI.ChildUI();
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
    OSF._OfficeAppFactory.setContext(new OSF.DDA.Context(appContext, appContext.doc, license, null, getOfficeThemeHandler));
    var getDelegateMethods, parameterMap;
    getDelegateMethods = OSF.DDA.DispIdHost.getClientDelegateMethods;
    parameterMap = OSF.DDA.SafeArray.Delegate.ParameterMap;
    OSF._OfficeAppFactory.setHostFacade(new OSF.DDA.DispIdHost.Facade(getDelegateMethods, parameterMap));
};
OSF.InitializationHelper.prototype.getInitializationReason = function (appContext) { return OSF.DDA.RichInitializationReason[appContext.get_reason()]; };
OSF.DDA.DispIdHost.getClientDelegateMethods = function (actionId) {
    var delegateMethods = {};
    delegateMethods[OSF.DDA.DispIdHost.Delegates.ExecuteAsync] = OSF.DDA.SafeArray.Delegate.executeAsync;
    delegateMethods[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync] = OSF.DDA.SafeArray.Delegate.registerEventAsync;
    delegateMethods[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync] = OSF.DDA.SafeArray.Delegate.unregisterEventAsync;
    delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog] = OSF.DDA.SafeArray.Delegate.openDialog;
    delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog] = OSF.DDA.SafeArray.Delegate.closeDialog;
    delegateMethods[OSF.DDA.DispIdHost.Delegates.MessageParent] = OSF.DDA.SafeArray.Delegate.messageParent;
    if (OSF.DDA.AsyncMethodNames.RefreshAsync && actionId == OSF.DDA.AsyncMethodNames.RefreshAsync.id) {
        var readSerializedSettings = function (hostCallArgs, onCalling, onReceiving) {
            return OSF.DDA.ClientSettingsManager.read(onCalling, onReceiving);
        };
        delegateMethods[OSF.DDA.DispIdHost.Delegates.ExecuteAsync] = OSF.DDA.ClientSettingsManager.getSettingsExecuteMethod(readSerializedSettings);
    }
    if (OSF.DDA.AsyncMethodNames.SaveAsync && actionId == OSF.DDA.AsyncMethodNames.SaveAsync.id) {
        var writeSerializedSettings = function (hostCallArgs, onCalling, onReceiving) {
            return OSF.DDA.ClientSettingsManager.write(hostCallArgs[OSF.DDA.SettingsManager.SerializedSettings], hostCallArgs[Microsoft.Office.WebExtension.Parameters.OverwriteIfStale], onCalling, onReceiving);
        };
        delegateMethods[OSF.DDA.DispIdHost.Delegates.ExecuteAsync] = OSF.DDA.ClientSettingsManager.getSettingsExecuteMethod(writeSerializedSettings);
    }
    return delegateMethods;
};
var OfficeExt;
(function (OfficeExt) {
    var MacRichClientHostController = (function () {
        function MacRichClientHostController() {
        }
        MacRichClientHostController.prototype.execute = function (id, params, callback) {
            setTimeout(function () {
                window.external.Execute(id, params, callback);
            }, 0);
        };
        MacRichClientHostController.prototype.registerEvent = function (id, targetId, handler, callback) {
            setTimeout(function () {
                window.external.RegisterEvent(id, targetId, handler, callback);
            }, 0);
        };
        MacRichClientHostController.prototype.unregisterEvent = function (id, targetId, callback) {
            setTimeout(function () {
                window.external.UnregisterEvent(id, targetId, callback);
            }, 0);
        };
        MacRichClientHostController.prototype.openDialog = function (id, targetId, handler, callback) {
            var magicWord = "action=displayDialog";
            var fragmentSeparator = '#';
            var callArgs = JSON.parse(targetId);
            var callUrl = callArgs.url;
            if (!callUrl) {
                return;
            }
            var urlParts = callUrl.split(fragmentSeparator);
            var seperator = "?";
            if (urlParts[0].indexOf("?") > -1) {
                seperator = "&";
            }
            var width = screen.width * callArgs.width / 100;
            var height = screen.height * callArgs.height / 100;
            var params = "width=" + width + ", height=" + height;
            urlParts[0] = urlParts[0].concat(seperator).concat(magicWord);
            var openUrl = urlParts.join(fragmentSeparator);
            MacRichClientHostController.popup = window.open(openUrl, "", params);
            function receiveMessage(event) {
                if (event.source == MacRichClientHostController.popup) {
                    try {
                        var messageObj = JSON.parse(event.data);
                        if (messageObj.dialogMessage) {
                            handler(id, [OSF.DialogMessageType.DialogMessageReceived, messageObj.dialogMessage.messageContent]);
                        }
                    }
                    catch (e) {
                        OsfMsAjaxFactory.msAjaxDebug.trace("messages received cannot be handlered. Message:" + event.data);
                    }
                }
            }
            window.addEventListener("message", receiveMessage);
            var interval;
            function checkWindowClose() {
                try {
                    if (MacRichClientHostController.popup == null || MacRichClientHostController.popup.closed) {
                        window.clearInterval(interval);
                        window.removeEventListener("message", receiveMessage);
                        handler(id, [OSF.DialogMessageType.DialogClosed]);
                    }
                }
                catch (e) {
                    OsfMsAjaxFactory.msAjaxDebug.trace("Error happened when popup window closed.");
                }
            }
            interval = window.setInterval(checkWindowClose, 1000);
            callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
        };
        MacRichClientHostController.prototype.messageParent = function (params) {
            var message = params[Microsoft.Office.WebExtension.Parameters.MessageToParent];
            var messageObj = { dialogMessage: { messageType: OSF.DialogMessageType.DialogMessageReceived, messageContent: message } };
            window.opener.postMessage(JSON.stringify(messageObj), window.location.origin);
        };
        MacRichClientHostController.prototype.closeDialog = function (id, targetId, callback) {
            if (MacRichClientHostController.popup) {
                MacRichClientHostController.popup.close();
                callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
            }
            else {
                callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
            }
        };
        return MacRichClientHostController;
    })();
    OfficeExt.MacRichClientHostController = MacRichClientHostController;
})(OfficeExt || (OfficeExt = {}));
OSF.ClientHostController = new OfficeExt.MacRichClientHostController();
var OfficeExt;
(function (OfficeExt) {
    var OfficeTheme;
    (function (OfficeTheme) {
        var OfficeThemeManager = (function () {
            function OfficeThemeManager() {
                this._osfOfficeTheme = null;
                this._osfOfficeThemeTimeStamp = null;
            }
            OfficeThemeManager.prototype.getOfficeTheme = function () {
                if (OSF.DDA._OsfControlContext) {
                    if (this._osfOfficeTheme && this._osfOfficeThemeTimeStamp && ((new Date()).getTime() - this._osfOfficeThemeTimeStamp < OfficeThemeManager._osfOfficeThemeCacheValidPeriod)) {
                        if (OSF.AppTelemetry) {
                            OSF.AppTelemetry.onPropertyDone("GetOfficeThemeInfo", 0);
                        }
                    }
                    else {
                        var startTime = (new Date()).getTime();
                        var osfOfficeTheme = OSF.DDA._OsfControlContext.GetOfficeThemeInfo();
                        var endTime = (new Date()).getTime();
                        if (OSF.AppTelemetry) {
                            OSF.AppTelemetry.onPropertyDone("GetOfficeThemeInfo", Math.abs(endTime - startTime));
                        }
                        this._osfOfficeTheme = JSON.parse(osfOfficeTheme);
                        for (var color in this._osfOfficeTheme) {
                            this._osfOfficeTheme[color] = OSF.OUtil.convertIntToCssHexColor(this._osfOfficeTheme[color]);
                        }
                        this._osfOfficeThemeTimeStamp = endTime;
                    }
                    return this._osfOfficeTheme;
                }
            };
            OfficeThemeManager.instance = function () {
                if (OfficeThemeManager._instance == null) {
                    OfficeThemeManager._instance = new OfficeThemeManager();
                }
                return OfficeThemeManager._instance;
            };
            OfficeThemeManager._osfOfficeThemeCacheValidPeriod = 5000;
            OfficeThemeManager._instance = null;
            return OfficeThemeManager;
        })();
        OfficeTheme.OfficeThemeManager = OfficeThemeManager;
        OSF.OUtil.setNamespace("OfficeTheme", OSF.DDA);
        OSF.DDA.OfficeTheme.getOfficeTheme = OfficeExt.OfficeTheme.OfficeThemeManager.instance().getOfficeTheme;
    })(OfficeTheme = OfficeExt.OfficeTheme || (OfficeExt.OfficeTheme = {}));
})(OfficeExt || (OfficeExt = {}));
OSF.DDA.ClientSettingsManager = {
    getSettingsExecuteMethod: function OSF_DDA_ClientSettingsManager$getSettingsExecuteMethod(hostDelegateMethod) {
        return function (args) {
            var status, response;
            try {
                response = hostDelegateMethod(args.hostCallArgs, args.onCalling, args.onReceiving);
                status = OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess;
            }
            catch (ex) {
                status = OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
                response = { name: Strings.OfficeOM.L_InternalError, message: ex };
            }
            if (args.onComplete) {
                args.onComplete(status, response);
            }
        };
    },
    read: function OSF_DDA_ClientSettingsManager$read(onCalling, onReceiving) {
        var keys = [];
        var values = [];
        if (onCalling) {
            onCalling();
        }
        OSF.DDA._OsfControlContext.GetSettings().Read(keys, values);
        if (onReceiving) {
            onReceiving();
        }
        var serializedSettings = {};
        for (var index = 0; index < keys.length; index++) {
            serializedSettings[keys[index]] = values[index];
        }
        return serializedSettings;
    },
    write: function OSF_DDA_ClientSettingsManager$write(serializedSettings, overwriteIfStale, onCalling, onReceiving) {
        var keys = [];
        var values = [];
        for (var key in serializedSettings) {
            keys.push(key);
            values.push(serializedSettings[key]);
        }
        if (onCalling) {
            onCalling();
        }
        OSF.DDA._OsfControlContext.GetSettings().Write(keys, values);
        if (onReceiving) {
            onReceiving();
        }
    }
};
OSF.InitializationHelper.prototype.initializeSettings = function OSF_InitializationHelper$initializeSettings(refreshSupported) {
    var serializedSettings = OSF.DDA.ClientSettingsManager.read();
    var settings = this.deserializeSettings(serializedSettings, refreshSupported);
    return settings;
};
OSF.InitializationHelper.prototype.getAppContext = function OSF_InitializationHelper$getAppContext(wnd, gotAppContext) {
    var returnedContext;
    var context;
    var warningText = "Warning: Office.js is loaded outside of Office client";
    try {
        if (window.external && typeof window.external.GetContext !== 'undefined') {
            context = OSF.DDA._OsfControlContext = window.external.GetContext();
        }
        else {
            OsfMsAjaxFactory.msAjaxDebug.trace(warningText);
            return;
        }
    }
    catch (e) {
        OsfMsAjaxFactory.msAjaxDebug.trace(warningText);
        return;
    }
    var appType = context.GetAppType();
    var id = context.GetSolutionRef();
    var version = context.GetAppVersionMajor();
    var minorVersion = context.GetAppVersionMinor();
    var UILocale = context.GetAppUILocale();
    var dataLocale = context.GetAppDataLocale();
    var docUrl = context.GetDocUrl();
    var clientMode = context.GetAppCapabilities();
    var reason = context.GetActivationMode();
    var osfControlType = context.GetControlIntegrationLevel();
    var settings = [];
    var eToken;
    try {
        eToken = context.GetSolutionToken();
    }
    catch (ex) {
    }
    var correlationId;
    if (typeof context.GetCorrelationId !== "undefined") {
        correlationId = context.GetCorrelationId();
    }
    var appInstanceId;
    if (typeof context.GetInstanceId !== "undefined") {
        appInstanceId = context.GetInstanceId();
    }
    var touchEnabled;
    if (typeof context.GetTouchEnabled !== "undefined") {
        touchEnabled = context.GetTouchEnabled();
    }
    var commerceAllowed;
    if (typeof context.GetCommerceAllowed !== "undefined") {
        commerceAllowed = context.GetCommerceAllowed();
    }
    var requirementMatrix;
    if (typeof context.GetSupportedMatrix !== "undefined") {
        requirementMatrix = context.GetSupportedMatrix();
    }
    var hostCustomMessage;
    if (typeof context.GetHostCustomMessage !== "undefined") {
        hostCustomMessage = context.GetHostCustomMessage();
    }
    var hostFullVersion;
    if (typeof context.GetHostFullVersion !== "undefined") {
        hostFullVersion = context.GetHostFullVersion();
    }
    var dialogRequirementMatrix;
    if (typeof context.GetDialogRequirementMatrix != "undefined") {
        dialogRequirementMatrix = context.GetDialogRequirementMatrix();
    }
    eToken = eToken ? eToken.toString() : "";
    returnedContext = new OSF.OfficeAppContext(id, appType, version, UILocale, dataLocale, docUrl, clientMode, settings, reason, osfControlType, eToken, correlationId, appInstanceId, touchEnabled, commerceAllowed, minorVersion, requirementMatrix, hostCustomMessage, hostFullVersion, undefined, undefined, undefined, dialogRequirementMatrix);
    if (OSF.AppTelemetry) {
        OSF.AppTelemetry.initialize(returnedContext);
    }
    gotAppContext(returnedContext);
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
        appInfo.hostJSVersion = "16.0.7618.1000";
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
OSF.DDA.SafeArray.Delegate.openDialog = function OSF_DDA_SafeArray_Delegate$OpenDialog(args) {
    try {
        if (args.onCalling) {
            args.onCalling();
        }
        var callback = OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent(true, args);
        OSF.ClientHostController.openDialog(args.dispId, args.targetId, function OSF_DDA_SafeArrayDelegate$RegisterEventAsync_OnEvent(eventDispId, payload) {
            if (args.onEvent) {
                args.onEvent(payload);
            }
            if (OSF.AppTelemetry) {
                OSF.AppTelemetry.onEventDone(args.dispId);
            }
        }, callback);
    }
    catch (ex) {
        OSF.DDA.SafeArray.Delegate._onException(ex, args);
    }
};
OSF.DDA.SafeArray.Delegate.closeDialog = function OSF_DDA_SafeArray_Delegate$CloseDialog(args) {
    if (args.onCalling) {
        args.onCalling();
    }
    var callback = OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent(false, args);
    try {
        OSF.ClientHostController.closeDialog(args.dispId, args.targetId, callback);
    }
    catch (ex) {
        OSF.DDA.SafeArray.Delegate._onException(ex, args);
    }
};
OSF.DDA.SafeArray.Delegate.messageParent = function OSF_DDA_SafeArray_Delegate$MessageParent(args) {
    try {
        if (args.onCalling) {
            args.onCalling();
        }
        var startTime = (new Date()).getTime();
        var result = OSF.ClientHostController.messageParent(args.hostCallArgs);
        if (args.onReceiving) {
            args.onReceiving();
        }
        if (OSF.AppTelemetry) {
            OSF.AppTelemetry.onMethodDone(args.dispId, args.hostCallArgs, Math.abs((new Date()).getTime() - startTime), result);
        }
        return result;
    }
    catch (ex) {
        return OSF.DDA.SafeArray.Delegate._onExceptionSyncMethod(ex);
    }
};
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.EventDispId.dispidDialogMessageReceivedEvent,
    fromHost: [
        { name: OSF.DDA.EventDescriptors.DialogMessageReceivedEvent, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
    ],
    isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.EventDescriptors.DialogMessageReceivedEvent,
    fromHost: [
        { name: OSF.DDA.PropertyDescriptors.MessageType, value: 0 },
        { name: OSF.DDA.PropertyDescriptors.MessageContent, value: 1 }
    ],
    isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.EventDispId.dispidDialogParentMessageReceivedEvent,
    fromHost: [
        { name: OSF.DDA.EventDescriptors.DialogParentMessageReceivedEvent, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
    ],
    isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.EventDescriptors.DialogParentMessageReceivedEvent,
    fromHost: [
        { name: OSF.DDA.PropertyDescriptors.MessageType, value: 0 },
        { name: OSF.DDA.PropertyDescriptors.MessageContent, value: 1 }
    ],
    isComplexType: true
});
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
OSF.OUtil.redefineList(Microsoft.Office.WebExtension.CoercionType, {
    Text: "text"
});
OSF.OUtil.redefineList(Microsoft.Office.WebExtension.ValueFormat, {
    Unformatted: "unformatted"
});
OSF.OUtil.redefineList(Microsoft.Office.WebExtension.FilterType, {
    All: "all"
});
OSF.OUtil.redefineList(Microsoft.Office.WebExtension.GoToType, {
    Slide: "slide",
    Index: "index"
});
delete Microsoft.Office.WebExtension.BindingType;
delete Microsoft.Office.WebExtension.select;
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.CoercionType,
    toHost: [
        { name: Microsoft.Office.WebExtension.CoercionType.Text, value: 0 },
        { name: Microsoft.Office.WebExtension.CoercionType.Matrix, value: 1 },
        { name: Microsoft.Office.WebExtension.CoercionType.Table, value: 2 }
    ]
});
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
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.CoercionType,
    toHost: [
        { name: Microsoft.Office.WebExtension.CoercionType.SlideRange, value: 7 }
    ]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.CoercionType, { Html: "html" });
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.CoercionType,
    toHost: [
        { name: Microsoft.Office.WebExtension.CoercionType.Html, value: 3 }
    ]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.CoercionType, { Ooxml: "ooxml" });
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.CoercionType,
    toHost: [
        { name: Microsoft.Office.WebExtension.CoercionType.Ooxml, value: 4 }
    ]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.CoercionType, { OoxmlPackage: "ooxmlPackage" });
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.CoercionType,
    toHost: [
        { name: Microsoft.Office.WebExtension.CoercionType.OoxmlPackage, value: 5 }
    ]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.CoercionType, { PdfFile: "pdf" });
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.CoercionType,
    toHost: [
        { name: Microsoft.Office.WebExtension.CoercionType.PdfFile, value: 6 }
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
                value: OSF.OUtil.shallowCopy(sliceDescriptor[Microsoft.Office.WebExtension.Parameters.Data])
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
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.PropertyDescriptors.FileProperties,
    fromHost: [
        { name: OSF.DDA.FileProperties.Handle, value: 0 },
        { name: OSF.DDA.FileProperties.FileSize, value: 1 }
    ],
    isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.PropertyDescriptors.FileSliceProperties,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.Data, value: 0 },
        { name: OSF.DDA.FileProperties.SliceSize, value: 1 }
    ],
    isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.FileType,
    toHost: [
        { name: Microsoft.Office.WebExtension.FileType.Text, value: 0 },
        { name: Microsoft.Office.WebExtension.FileType.Compressed, value: 5 },
        { name: Microsoft.Office.WebExtension.FileType.Pdf, value: 6 }
    ]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetDocumentCopyMethod,
    toHost: [{ name: Microsoft.Office.WebExtension.Parameters.FileType, value: 0 }],
    fromHost: [
        { name: OSF.DDA.PropertyDescriptors.FileProperties, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetDocumentCopyChunkMethod,
    toHost: [
        { name: OSF.DDA.FileProperties.Handle, value: 0 },
        { name: OSF.DDA.FileSliceOffset, value: 1 },
        { name: OSF.DDA.FileProperties.SliceSize, value: 2 }
    ],
    fromHost: [
        { name: OSF.DDA.PropertyDescriptors.FileSliceProperties, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidReleaseDocumentCopyMethod,
    toHost: [{ name: OSF.DDA.FileProperties.Handle, value: 0 }]
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
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetSelectedDataMethod,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.Data, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
    ],
    toHost: [
        { name: Microsoft.Office.WebExtension.Parameters.CoercionType, value: 0 },
        { name: Microsoft.Office.WebExtension.Parameters.ValueFormat, value: 1 },
        { name: Microsoft.Office.WebExtension.Parameters.FilterType, value: 2 }
    ]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidSetSelectedDataMethod,
    toHost: [
        { name: Microsoft.Office.WebExtension.Parameters.CoercionType, value: 0 },
        { name: Microsoft.Office.WebExtension.Parameters.Data, value: 1 },
        { name: Microsoft.Office.WebExtension.Parameters.ImageLeft, value: 2 },
        { name: Microsoft.Office.WebExtension.Parameters.ImageTop, value: 3 },
        { name: Microsoft.Office.WebExtension.Parameters.ImageWidth, value: 4 },
        { name: Microsoft.Office.WebExtension.Parameters.ImageHeight, value: 5 },
    ]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.GoToType,
    toHost: [
        { name: Microsoft.Office.WebExtension.GoToType.Binding, value: 0 },
        { name: Microsoft.Office.WebExtension.GoToType.NamedItem, value: 1 },
        { name: Microsoft.Office.WebExtension.GoToType.Slide, value: 2 },
        { name: Microsoft.Office.WebExtension.GoToType.Index, value: 3 }
    ]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.SelectionMode,
    toHost: [
        { name: Microsoft.Office.WebExtension.SelectionMode.Default, value: 0 },
        { name: Microsoft.Office.WebExtension.SelectionMode.Selected, value: 1 },
        { name: Microsoft.Office.WebExtension.SelectionMode.None, value: 2 }
    ]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidNavigateToMethod,
    toHost: [
        { name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 },
        { name: Microsoft.Office.WebExtension.Parameters.GoToType, value: 1 },
        { name: Microsoft.Office.WebExtension.Parameters.SelectionMode, value: 2 }
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
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidLoadSettingsMethod,
    fromHost: [
        { name: OSF.DDA.SettingsManager.SerializedSettings, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidSaveSettingsMethod,
    toHost: [
        { name: OSF.DDA.SettingsManager.SerializedSettings, value: OSF.DDA.SettingsManager.SerializedSettings },
        { name: Microsoft.Office.WebExtension.Parameters.OverwriteIfStale, value: Microsoft.Office.WebExtension.Parameters.OverwriteIfStale }
    ]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({ type: OSF.DDA.EventDispId.dispidSettingsChangedEvent });
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
var parameterMap = OSF.DDA.SafeArray.Delegate.ParameterMap;
parameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetDocumentThemeMethod,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.DocumentTheme, value: parameterMap.self }
    ]
});
parameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetOfficeThemeMethod,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.OfficeTheme, value: parameterMap.self }
    ]
});
parameterMap.define({
    type: OSF.DDA.EventDispId.dispidDocumentThemeChangedEvent,
    fromHost: [
        { name: OSF.DDA.EventDescriptors.DocumentThemeChangedEvent, value: parameterMap.self }
    ],
    isComplexType: true
});
parameterMap.define({
    type: OSF.DDA.EventDispId.dispidOfficeThemeChangedEvent,
    fromHost: [
        { name: OSF.DDA.EventDescriptors.OfficeThemeChangedEvent, value: parameterMap.self }
    ],
    isComplexType: true
});
var destKeys = OSF.DDA.Theming.DocumentThemeEnum;
parameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.DocumentTheme,
    fromHost: [
        { name: destKeys.PrimaryBackgroundColor, value: 0 },
        { name: destKeys.PrimaryFontColor, value: 1 },
        { name: destKeys.SecondaryBackgroundColor, value: 2 },
        { name: destKeys.SecondaryFontColor, value: 3 },
        { name: destKeys.Accent1, value: 4 },
        { name: destKeys.Accent2, value: 5 },
        { name: destKeys.Accent3, value: 6 },
        { name: destKeys.Accent4, value: 7 },
        { name: destKeys.Accent5, value: 8 },
        { name: destKeys.Accent6, value: 9 },
        { name: destKeys.Hyperlink, value: 10 },
        { name: destKeys.FollowedHyperlink, value: 11 },
        { name: destKeys.HeaderLatinFont, value: 12 },
        { name: destKeys.HeaderEastAsianFont, value: 13 },
        { name: destKeys.HeaderScriptFont, value: 14 },
        { name: destKeys.HeaderLocalizedFont, value: 15 },
        { name: destKeys.BodyLatinFont, value: 16 },
        { name: destKeys.BodyEastAsianFont, value: 17 },
        { name: destKeys.BodyScriptFont, value: 18 },
        { name: destKeys.BodyLocalizedFont, value: 19 }
    ],
    isComplexType: true
});
destKeys = OSF.DDA.Theming.OfficeThemeEnum;
parameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.OfficeTheme,
    fromHost: [
        { name: destKeys.PrimaryFontColor, value: 0 },
        { name: destKeys.PrimaryBackgroundColor, value: 1 },
        { name: destKeys.SecondaryFontColor, value: 2 },
        { name: destKeys.SecondaryBackgroundColor, value: 3 }
    ],
    isComplexType: true
});
parameterMap.define({
    type: OSF.DDA.EventDescriptors.DocumentThemeChangedEvent,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.DocumentTheme, value: parameterMap.self }
    ],
    isComplexType: true
});
parameterMap.define({
    type: OSF.DDA.EventDescriptors.OfficeThemeChangedEvent,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.OfficeTheme, value: parameterMap.self }
    ],
    isComplexType: true
});
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
OSF.DDA.SafeArray.Delegate.ParameterMap.define({ type: OSF.DDA.EventDispId.dispidDocumentSelectionChangedEvent });
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor,
    fromHost: [
        { name: OSF.DDA.FilePropertiesDescriptor.Url, value: 0 }
    ],
    isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetFilePropertiesMethod,
    fromHost: [
        { name: OSF.DDA.PropertyDescriptors.FilePropertiesDescriptor, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
    ]
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
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.ActiveView,
    fromHost: [
        { name: 0, value: Microsoft.Office.WebExtension.ActiveView.Read },
        { name: 1, value: Microsoft.Office.WebExtension.ActiveView.Edit }
    ]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.MethodDispId.dispidGetActiveViewMethod,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.ActiveView, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
    ]
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.EventDescriptors.ActiveViewChangedEvent,
    fromHost: [
        { name: Microsoft.Office.WebExtension.Parameters.ActiveView, value: 0 }
    ],
    isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: OSF.DDA.EventDispId.dispidActiveViewChangedEvent,
    fromHost: [
        { name: OSF.DDA.EventDescriptors.ActiveViewChangedEvent, value: OSF.DDA.SafeArray.Delegate.ParameterMap.self }
    ]
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.CoercionType, { Image: "image" });
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
    type: Microsoft.Office.WebExtension.Parameters.CoercionType,
    toHost: [
        { name: Microsoft.Office.WebExtension.CoercionType.Image, value: 8 }
    ]
});
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
var OfficeExt;
(function (OfficeExt) {
    var AppCommand;
    (function (AppCommand) {
        function registerDdaFacade() {
            if (OSF.DDA.SafeArray) {
                var parameterMap = OSF.DDA.SafeArray.Delegate.ParameterMap;
                parameterMap.define({
                    type: OSF.DDA.MethodDispId.dispidAppCommandInvocationCompletedMethod,
                    toHost: [
                        { name: Microsoft.Office.WebExtension.Parameters.Id, value: 0 },
                        { name: Microsoft.Office.WebExtension.Parameters.Status, value: 1 },
                        { name: Microsoft.Office.WebExtension.Parameters.Data, value: 2 }
                    ]
                });
                parameterMap.define({
                    type: OSF.DDA.EventDispId.dispidAppCommandInvokedEvent,
                    fromHost: [
                        { name: OSF.DDA.EventDescriptors.AppCommandInvokedEvent, value: parameterMap.self }
                    ],
                    isComplexType: true
                });
                parameterMap.define({
                    type: OSF.DDA.EventDescriptors.AppCommandInvokedEvent,
                    fromHost: [
                        { name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.AppCommandId, value: 0 },
                        { name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.CallbackName, value: 1 },
                        { name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.EventObjStr, value: 2 },
                    ],
                    isComplexType: true
                });
            }
        }
        AppCommand.registerDdaFacade = registerDdaFacade;
    })(AppCommand = OfficeExt.AppCommand || (OfficeExt.AppCommand = {}));
})(OfficeExt || (OfficeExt = {}));
OSF.DDA.PowerPointDocument = function OSF_DDA_PowerPointDocument(officeAppContext, settings) {
    OSF.DDA.PowerPointDocument.uber.constructor.call(this, officeAppContext, settings);
    OSF.DDA.DispIdHost.addAsyncMethods(this, [
        OSF.DDA.AsyncMethodNames.GetSelectedDataAsync,
        OSF.DDA.AsyncMethodNames.SetSelectedDataAsync,
        OSF.DDA.AsyncMethodNames.GetDocumentCopyAsync,
        OSF.DDA.AsyncMethodNames.GetActiveViewAsync,
        OSF.DDA.AsyncMethodNames.GetFilePropertiesAsync,
        OSF.DDA.AsyncMethodNames.GoToByIdAsync
    ]);
    OSF.DDA.DispIdHost.addEventSupport(this, new OSF.EventDispatch([
        Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged,
        Microsoft.Office.WebExtension.EventType.ActiveViewChanged
    ]));
    OSF.OUtil.finalizeProperties(this);
};
OSF.OUtil.extend(OSF.DDA.PowerPointDocument, OSF.DDA.Document);
OSF.InitializationHelper.prototype.prepareRightAfterWebExtensionInitialize = function OSF_InitializationHelper$prepareRightAfterWebExtensionInitialize() {
    var appCommandHandler = OfficeExt.AppCommand.AppCommandManager.instance();
    appCommandHandler.initializeAndChangeOnce();
};
OSF.InitializationHelper.prototype.loadAppSpecificScriptAndCreateOM = function OSF_InitializationHelper$loadAppSpecificScriptAndCreateOM(appContext, appReady, basePath) {
    OSF.DDA.ErrorCodeManager.initializeErrorMessages(Strings.OfficeOM);
    appContext.doc = new OSF.DDA.PowerPointDocument(appContext, this._initializeSettings(true));
    appReady();
};
OSF.InitializationHelper.prototype.prepareApiSurface = function OSF_InitializationHelper$PowerPointMac_prepareApiSurface(appContext) {
    var license = new OSF.DDA.License(appContext.get_eToken());
    if (appContext.get_isDialog()) {
        appContext.ui = new OSF.DDA.UI.ChildUI();
    }
    else {
        appContext.ui = new OSF.DDA.UI.ParentUI();
    }
    OSF._OfficeAppFactory.setContext(new OSF.DDA.Context(appContext, appContext.doc, license));
    OSF._OfficeAppFactory.setHostFacade(new OSF.DDA.DispIdHost.Facade(OSF.DDA.DispIdHost.getClientDelegateMethods, OSF.DDA.SafeArray.Delegate.ParameterMap));
    var themeHandler = new OSF.DDA.Theming.InternalThemeHandler();
    themeHandler.InitializeAndChangeOnce();
};
