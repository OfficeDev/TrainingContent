/* Excel specific API library */
/* Version: 15.0.4879.1000 */
/*
	Copyright (c) Microsoft Corporation.  All rights reserved.
*/

/*
	Your use of this file is governed by the Microsoft Services Agreement http://go.microsoft.com/fwlink/?LinkId=266419.
*/

var OSF=OSF || {};
OSF.OUtil=(function () {
	var _uniqueId=-1;
	var _xdmInfoKey='&_xdm_Info=';
	var _xdmSessionKeyPrefix='_xdm_';
	var _fragmentSeparator='#';
	var _loadedScripts={};
	var _defaultScriptLoadingTimeout=30000;
	var _localStorageNotWorking=false;
	function _random() {
		return Math.floor(100000001 * Math.random()).toString();
	};
	return {
		extend: function OSF_OUtil$extend(child, parent) {
			var F=function () { };
			F.prototype=parent.prototype;
			child.prototype=new F();
			child.prototype.constructor=child;
			child.uber=parent.prototype;
			if (parent.prototype.constructor===Object.prototype.constructor) {
				parent.prototype.constructor=parent;
			}
		},
		setNamespace: function OSF_OUtil$setNamespace(name, parent) {
			if (parent && name && !parent[name]) {
				parent[name]={};
			}
		},
		unsetNamespace: function OSF_OUtil$unsetNamespace(name, parent) {
			if (parent && name && parent[name]) {
				delete parent[name];
			}
		},
		loadScript: function OSF_OUtil$loadScript(url, callback, timeoutInMs) {
			if (url && callback) {
				var doc=window.document;
				var _loadedScriptEntry=_loadedScripts[url];
				if (!_loadedScriptEntry) {
					var script=doc.createElement("script");
					script.type="text/javascript";
					_loadedScriptEntry={ loaded: false, pendingCallbacks: [callback], timer: null };
					_loadedScripts[url]=_loadedScriptEntry;
					var onLoadCallback=function OSF_OUtil_loadScript$onLoadCallback() {
						if(_loadedScriptEntry.timer !=null) {
							clearTimeout(_loadedScriptEntry.timer);
							delete _loadedScriptEntry.timer;
						}
						_loadedScriptEntry.loaded=true;
						var pendingCallbackCount=_loadedScriptEntry.pendingCallbacks.length;
						for (var i=0; i < pendingCallbackCount; i++) {
							var currentCallback=_loadedScriptEntry.pendingCallbacks.shift();
							currentCallback();
						}
					};
					var onLoadError=function OSF_OUtil_loadScript$onLoadError() {
						delete _loadedScripts[url];
						if(_loadedScriptEntry.timer !=null) {
							clearTimeout(_loadedScriptEntry.timer);
							delete _loadedScriptEntry.timer;
						}
						var pendingCallbackCount=_loadedScriptEntry.pendingCallbacks.length;
						for (var i=0; i < pendingCallbackCount; i++) {
							var currentCallback=_loadedScriptEntry.pendingCallbacks.shift();
							currentCallback();
						}
					};
					if (script.readyState) {
						script.onreadystatechange=function () {
							if (script.readyState=="loaded" || script.readyState=="complete") {
								script.onreadystatechange=null;
								onLoadCallback();
							}
						};
					} else {
						script.onload=onLoadCallback;
					}
					script.onerror=onLoadError;
					timeoutInMs=timeoutInMs || _defaultScriptLoadingTimeout;
					_loadedScriptEntry.timer=setTimeout(onLoadError, timeoutInMs);
					script.src=url;
					doc.getElementsByTagName("head")[0].appendChild(script);
				} else if (_loadedScriptEntry.loaded) {
					callback();
				} else {
					_loadedScriptEntry.pendingCallbacks.push(callback);
				}
			}
		},
		loadCSS: function OSF_OUtil$loadCSS(url) {
			if (url) {
				var doc=window.document;
				var link=doc.createElement("link");
				link.type="text/css";
				link.rel="stylesheet";
				link.href=url;
				doc.getElementsByTagName("head")[0].appendChild(link);
			}
		},
		parseEnum: function OSF_OUtil$parseEnum(str, enumObject) {
			var parsed=enumObject[str.trim()];
			if (typeof (parsed)=='undefined') {
				OsfMsAjaxFactory.msAjaxDebug.trace("invalid enumeration string:"+str);
				throw OsfMsAjaxFactory.msAjaxError.argument("str");
			}
			return parsed;
		},
		delayExecutionAndCache: function OSF_OUtil$delayExecutionAndCache() {
			var obj={ calc: arguments[0] };
			return function() {
				if(obj.calc) {
					obj.val=obj.calc.apply(this, arguments);
					delete obj.calc;
				}
				return obj.val;
			};
		},
		getUniqueId: function OSF_OUtil$getUniqueId() {
			_uniqueId=_uniqueId+1;
			return _uniqueId.toString();
		},
		formatString: function OSF_OUtil$formatString() {
			var args=arguments;
			var source=args[0];
			return source.replace(/{(\d+)}/gm, function (match, number) {
				var index=parseInt(number, 10)+1;
				return args[index]===undefined ? '{'+number+'}' : args[index];
			});
		},
		generateConversationId: function OSF_OUtil$generateConversationId() {
			return [_random(), _random(), (new Date()).getTime().toString()].join('_');
		},
		getFrameNameAndConversationId: function OSF_OUtil$getFrameNameAndConversationId(cacheKey, frame) {
			var frameName=_xdmSessionKeyPrefix+cacheKey+this.generateConversationId();
			frame.setAttribute("name", frameName);
			return this.generateConversationId();
		},
		addXdmInfoAsHash: function OSF_OUtil$addXdmInfoAsHash(url, xdmInfoValue) {
			url=url.trim() || '';
			var urlParts=url.split(_fragmentSeparator);
			var urlWithoutFragment=urlParts.shift();
			var fragment=urlParts.join(_fragmentSeparator);
			return [urlWithoutFragment, _fragmentSeparator, fragment, _xdmInfoKey, xdmInfoValue].join('');
		},
		parseXdmInfo: function OSF_OUtil$parseXdmInfo() {
			var fragment=window.location.hash;
			var fragmentParts=fragment.split(_xdmInfoKey);
			var xdmInfoValue=fragmentParts.length > 1 ? fragmentParts[fragmentParts.length - 1] : null;
			if (window.sessionStorage) {
				var sessionKeyStart=window.name.indexOf(_xdmSessionKeyPrefix);
				if (sessionKeyStart > -1) {
					var sessionKeyEnd=window.name.indexOf(";", sessionKeyStart);
					if (sessionKeyEnd==-1) {
						sessionKeyEnd=window.name.length;
					}
					var sessionKey=window.name.substring(sessionKeyStart, sessionKeyEnd);
					if (xdmInfoValue) {
						window.sessionStorage.setItem(sessionKey, xdmInfoValue);
					} else {
						xdmInfoValue=window.sessionStorage.getItem(sessionKey);
					}
				}
			}
			return xdmInfoValue;
		},
		getConversationId: function OSF_OUtil$getConversationId() {
			var searchString=window.location.search;
			var conversationId=null;
			if (searchString) {
				var index=searchString.indexOf("&");
				conversationId=index > 0 ? searchString.substring(1, index) : searchString.substr(1);
				if(conversationId && conversationId.charAt(conversationId.length-1)==='='){
					conversationId=conversationId.substring(0, conversationId.length-1);
					if(conversationId) {
						conversationId=decodeURIComponent(conversationId);
					}
				}
			}
			return conversationId;
		},
		validateParamObject: function OSF_OUtil$validateParamObject(params, expectedProperties, callback) {
			var e=Function._validateParams(arguments, [
				{ name: "params", type: Object, mayBeNull: false },
				{ name: "expectedProperties", type: Object, mayBeNull: false },
				{ name: "callback", type: Function, mayBeNull: true }
			]);
			if (e) throw e;
			for (var p in expectedProperties) {
				e=Function._validateParameter(params[p], expectedProperties[p], p);
				if (e) throw e;
			}
		},
		writeProfilerMark: function OSF_OUtil$writeProfilerMark(text) {
			if (window.msWriteProfilerMark) {
				window.msWriteProfilerMark(text);
				OsfMsAjaxFactory.msAjaxDebug.trace(text);
			}
		},
		defineNondefaultProperty: function OSF_OUtil$defineNondefaultProperty(obj, prop, descriptor, attributes) {
			descriptor=descriptor || {};
			for (var nd in attributes) {
				var attribute=attributes[nd];
				if (descriptor[attribute]==undefined) {
					descriptor[attribute]=true;
				}
			}
			Object.defineProperty(obj, prop, descriptor);
			return obj;
		},
		defineNondefaultProperties: function OSF_OUtil$defineNondefaultProperties(obj, descriptors, attributes) {
			descriptors=descriptors || {};
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
			descriptor=descriptor || {};
			var props=Object.getOwnPropertyNames(obj);
			var propsLength=props.length;
			for (var i=0; i < propsLength; i++) {
				var prop=props[i];
				var desc=Object.getOwnPropertyDescriptor(obj, prop);
				if (!desc.get && !desc.set) {
					desc.writable=descriptor.writable || false;
				}
				desc.configurable=descriptor.configurable || false;
				desc.enumerable=descriptor.enumerable || true;
				Object.defineProperty(obj, prop, desc);
			}
			return obj;
		},
		mapList: function OSF_OUtil$MapList(list, mapFunction) {
			var ret=[];
			if (list) {
				for (var item in list) {
					ret.push(mapFunction(list[item]));
				}
			}
			return ret;
		},
		listContainsKey: function OSF_OUtil$listContainsKey(list, key) {
			for (var item in list) {
				if (key==item) {
					return true;
				}
			}
			return false;
		},
		listContainsValue: function OSF_OUtil$listContainsElement(list, value) {
			for (var item in list) {
				if (value==list[item]) {
					return true;
				}
			}
			return false;
		},
		augmentList: function OSF_OUtil$augmentList(list, addenda) {
			var add=list.push ? function (key, value) { list.push(value); } : function (key, value) { list[key]=value; };
			for (var key in addenda) {
				add(key, addenda[key]);
			}
		},
		redefineList: function OSF_Outil$redefineList(oldList, newList) {
			for (var key1 in oldList) {
				delete oldList[key1];
			}
			for (var key2 in newList) {
				oldList[key2]=newList[key2];
			}
		},
		isArray: function OSF_OUtil$isArray(obj) {
			return Object.prototype.toString.apply(obj)==="[object Array]";
		},
		isFunction: function OSF_OUtil$isFunction(obj) {
			return Object.prototype.toString.apply(obj)==="[object Function]";
		},
		isDate: function OSF_OUtil$isDate(obj) {
			return Object.prototype.toString.apply(obj)==="[object Date]";
		},
		addEventListener: function OSF_OUtil$addEventListener(element, eventName, listener) {
			if (element.attachEvent) {
				element.attachEvent("on"+eventName, listener);
			} else if (element.addEventListener) {
				element.addEventListener(eventName, listener, false);
			} else {
				element["on"+eventName]=listener;
			}
		},
		removeEventListener: function OSF_OUtil$removeEventListener(element, eventName, listener) {
			if (element.detachEvent) {
				element.detachEvent("on"+eventName, listener);
			} else if (element.removeEventListener) {
				element.removeEventListener(eventName, listener, false);
			} else {
				element["on"+eventName]=null;
			}
		},
		encodeBase64: function OSF_Outil$encodeBase64(input) {
			var codex="ABCDEFGHIJKLMNOP"+						"QRSTUVWXYZabcdef"+						"ghijklmnopqrstuv"+						"wxyz0123456789+/"+						"=";
			var output=[];
			var temp=[];
			var index=0;
			var a, b, c;
			var length=input.length;
			do {
				a=input[index++];
				b=input[index++];
				c=input[index++];
				temp[0]=a >> 2;
				temp[1]=((a & 3) << 4) | (b >> 4);
				temp[2]=((b & 15) << 2) | (c >> 6);
				temp[3]=c & 63;
				if (isNaN(b)) {
					temp[2]=temp[3]=64;
				} else if (isNaN(c)) {
					temp[3]=64;
				}
				for (var t=0; t < 4; t++) {
					output.push(codex.charAt(temp[t]));
				}
			} while (index < length);
			return output.join("");
		},
		getLocalStorage: function OSF_Outil$getLocalStorage() {
			var osfLocalStorage=null;
			if (!_localStorageNotWorking) {
				try {
					if (window.localStorage) {
						osfLocalStorage=window.localStorage;
					}
				}
				catch (ex) {
					_localStorageNotWorking=true;
				}
			}
			return osfLocalStorage;
		},
		splitStringToList: function OSF_Outil$splitStringToList(input, spliter) {
			var backslash=false;
			var index=-1;
			var res=[];
			var insideStr=false;
			var s=spliter+input;
			for (var i=0; i < s.length; i++) {
				if (s[i]=="\\" && !backslash) {
					backslash=true;
				} else {
					if (s[i]==spliter && !insideStr) {
						res.push("");
						index++;
					} else if (s[i]=="\"" && !backslash) {
						insideStr=!insideStr;
					} else {
						res[index]+=s[i];
					}
					backslash=false;
				}
			}
			return res;
		},
		convertIntToHex: function OSF_Outil$convertIntToHex(val) {
				var hex="#"+(Number(val)+0x1000000).toString(16).slice(-6);
				return hex;
		}
	};
})();
OSF.OUtil.Guid=(function() {
	var hexCode=["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
	return {
		generateNewGuid: function OSF_Outil_Guid$generateNewGuid() {
			var result="";
			var tick=(new Date()).getTime();
			var index=0;
			for (; index < 32 && tick > 0; index++) {
				if (index==8 || index==12 || index==16 || index==20) {
					result+="-";
				}
				result+=hexCode[tick % 16];
				tick=Math.floor(tick / 16);
			}
			for (; index < 32; index++) {
				if (index==8 || index==12 || index==16 || index==20) {
					result+="-";
				}
				result+=hexCode[Math.floor(Math.random() * 16)];
			}
			return result;
		}
	}
})();
window.OSF=OSF;
OSF.OUtil.setNamespace("OSF", window);
OSF.InternalPerfMarker={
	DataCoercionBegin: "Agave.HostCall.CoerceDataStart",
	DataCoercionEnd: "Agave.HostCall.CoerceDataEnd"
};
OSF.HostCallPerfMarker={
	IssueCall: "Agave.HostCall.IssueCall",
	ReceiveResponse: "Agave.HostCall.ReceiveResponse",
	RuntimeExceptionRaised: "Agave.HostCall.RuntimeExecptionRaised"
};
OSF.AgaveHostAction={
	"Select" : 0,
	"UnSelect": 1
};
OSF.SharedConstants={
	"NotificationConversationIdSuffix": '_ntf'
};
OSF.OfficeAppContext=function OSF_OfficeAppContext(id, appName, appVersion, appUILocale, dataLocale, docUrl, clientMode, settings, reason, osfControlType, eToken, correlationId, appInstanceId, touchEnabled, commerceAllowed, appMinorVersion, requirementMatrix) {
	this._id=id;
	this._appName=appName;
	this._appVersion=appVersion;
	this._appUILocale=appUILocale;
	this._dataLocale=dataLocale;
	this._docUrl=docUrl;
	this._clientMode=clientMode;
	this._settings=settings;
	this._reason=reason;
	this._osfControlType=osfControlType;
	this._eToken=eToken;
	this._correlationId=correlationId;
	this._appMinorVersion=appMinorVersion;
	this._requirementMatrix=requirementMatrix;
	this._appInstanceId=appInstanceId;
	this._isDialog=false;
	this.get_id=function get_id() { return this._id; };
	this.get_appName=function get_appName() { return this._appName; };
	this.get_appVersion=function get_appVersion() { return this._appVersion; };
	this.get_appUILocale=function get_appUILocale() { return this._appUILocale; };
	this.get_dataLocale=function get_dataLocale() { return this._dataLocale; };
	this.get_docUrl=function get_docUrl() { return this._docUrl; };
	this.get_clientMode=function get_clientMode() { return this._clientMode; };
	this.get_bindings=function get_bindings() { return this._bindings; };
	this.get_settings=function get_settings() { return this._settings; };
	this.get_reason=function get_reason() { return this._reason; };
	this.get_osfControlType=function get_osfControlType() { return this._osfControlType; };
	this.get_eToken=function get_eToken() { return this._eToken; };
	this.get_correlationId=function get_correlationId() { return this._correlationId; };
	this.get_appInstanceId=function get_appInstanceId() { return this._appInstanceId; };
	this.get_appMinorVersion=function get_appMinorVersion() { return this._appMinorVersion; };
	this.get_requirementMatrix=function get_requirementMatrix() { return this._requirementMatrix; };
	this.get_isDialog=function get_isDialog() { return this._isDialog; };
};
OSF.AppName={
	Unsupported: 0,
	Excel: 1,
	Word: 2,
	PowerPoint: 4,
	Outlook: 8,
	ExcelWebApp: 16,
	WordWebApp: 32,
	OutlookWebApp: 64,
	Project: 128
};
OSF.OsfControlType={
	DocumentLevel: 0,
	ContainerLevel: 1
};
OSF.ClientMode={
	ReadOnly: 0,
	ReadWrite: 1
};
OSF.OUtil.setNamespace("Microsoft", window);
OSF.OUtil.setNamespace("Office", Microsoft);
OSF.OUtil.setNamespace("Client", Microsoft.Office);
OSF.OUtil.setNamespace("WebExtension", Microsoft.Office);
OSF.OUtil.setNamespace("Internal", Microsoft.Office);
OSF.NamespaceManager=(function OSF_NamespaceManager() {
	var _userOffice;
	var _useShortcut=false;
	return {
		enableShortcut: function OSF_NamespaceManager$enableShortcut() {
			if (!_useShortcut) {
				if (window.Office) {
					_userOffice=window.Office;
				} else {
					OSF.OUtil.setNamespace("Office", window);
				}
				window.Office=Microsoft.Office.WebExtension;
				_useShortcut=true;
			}
		},
		disableShortcut: function OSF_NamespaceManager$disableShortcut() {
			if (_useShortcut) {
				if (_userOffice) {
					window.Office=_userOffice;
				} else {
					OSF.OUtil.unsetNamespace("Office", window);
				}
				_useShortcut=false;
			}
		}
	};
})();
OSF.NamespaceManager.enableShortcut();
Microsoft.Office.WebExtension.InitializationReason={
	Inserted: "inserted",
	DocumentOpened: "documentOpened"
};
Microsoft.Office.WebExtension.ActiveView={
	Read: "read",
	Edit: "edit"
};
Microsoft.Office.WebExtension.ApplicationMode={
	WebEditor: "webEditor",
	WebViewer: "webViewer",
	Client: "client"
};
Microsoft.Office.WebExtension.DocumentMode={
	ReadOnly: "readOnly",
	ReadWrite: "readWrite"
};
Microsoft.Office.WebExtension.CoercionType={
	Text: "text",
	Matrix: "matrix",
	Table: "table",
	Image: "image"
};
Microsoft.Office.WebExtension.ValueFormat={
	Unformatted: "unformatted",
	Formatted: "formatted"
};
Microsoft.Office.WebExtension.FilterType={
	All: "all"
};
Microsoft.Office.WebExtension.BindingType={
	Text: "text",
	Matrix: "matrix",
	Table: "table"
};
Microsoft.Office.WebExtension.GoToType={
	Binding: "binding",
	NamedItem: "namedItem",
	Slide: "slide",
	Index: "index"
};
Microsoft.Office.WebExtension.SelectionMode={
	Default: "default",
	Selected: "selected",
	None: "none"
};
Microsoft.Office.WebExtension.EventType={
	DocumentSelectionChanged: "documentSelectionChanged",
	BindingSelectionChanged: "bindingSelectionChanged",
	BindingDataChanged: "bindingDataChanged",
	DialogMessageReceived: "dialogMessageReceived",
	DialogEventReceived: "dialogEventReceived"
};
Microsoft.Office.Internal.EventType={
	OfficeThemeChanged: "officeThemeChanged",
	DocumentThemeChanged: "documentThemeChanged"
};
Microsoft.Office.WebExtension.AsyncResultStatus={
	Succeeded: "succeeded",
	Failed: "failed"
};
Microsoft.Office.WebExtension.Parameters={
	BindingType: "bindingType",
	CoercionType: "coercionType",
	ValueFormat: "valueFormat",
	FilterType: "filterType",
	Id: "id",
	GoToType: "goToType",
	SelectionMode: "selectionMode",
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
	Url: "url",
	MessageHandler: "messageHandler",
	Width: "width",
	Height: "height",
	RequireHTTPs: "requireHTTPS",
	MessageToParent: "messageToParent",
	XFrameDenySafe: "xFrameDenySafe"
};
Microsoft.Office.Internal.Parameters={
	DocumentTheme: "documentTheme",
	OfficeTheme: "officeTheme"
};
Microsoft.Office.WebExtension.DefaultParameterValues={
};
OSF.OUtil.setNamespace("DDA", OSF);
OSF.DDA.DocumentMode={
	ReadOnly: 1,
	ReadWrite: 0
};
OSF.OUtil.setNamespace("DispIdHost", OSF.DDA);
OSF.DDA.DispIdHost.Methods={
	InvokeMethod: "invokeMethod",
	AddEventHandler: "addEventHandler",
	RemoveEventHandler: "removeEventHandler",
	OpenDialog: "openDialog",
	CloseDialog: "closeDialog",
	MessageParent: "messageParent"
};
OSF.DDA.DispIdHost.Delegates={
	ExecuteAsync: "executeAsync",
	RegisterEventAsync: "registerEventAsync",
	UnregisterEventAsync: "unregisterEventAsync",
	ParameterMap: "parameterMap",
	MessageParent: "messageParent"
};
OSF.OUtil.setNamespace("AsyncResultEnum", OSF.DDA);
OSF.DDA.AsyncResultEnum.Properties={
	Context: "Context",
	Value: "Value",
	Status: "Status",
	Error: "Error"
};
OSF.DDA.AsyncResultEnum.ErrorProperties={
	Name: "Name",
	Message: "Message",
	Code: "Code"
};
OSF.DDA.PropertyDescriptors={
	AsyncResultStatus: "AsyncResultStatus",
	FileProperties: "FileProperties",
	FilePropertiesDescriptor: "FilePropertiesDescriptor",
	FileSliceProperties: "FileSliceProperties",
	Subset: "subset",
	BindingProperties: "BindingProperties",
	TableDataProperties: "TableDataProperties",
	DataPartProperties: "DataPartProperties",
	DataNodeProperties: "DataNodeProperties",
	MessageType: "messageType",
	MessageContent: "messageContent"
};
OSF.DDA.EventDescriptors={
	BindingSelectionChangedEvent: "BindingSelectionChangedEvent",
	DataNodeInsertedEvent: "DataNodeInsertedEvent",
	DataNodeReplacedEvent: "DataNodeReplacedEvent",
	DataNodeDeletedEvent: "DataNodeDeletedEvent",
	OfficeThemeChangedEvent: "OfficeThemeChangedEvent",
	DocumentThemeChangedEvent: "DocumentThemeChangedEvent",
	ActiveViewChangedEvent: "ActiveViewChangedEvent",
	AppCommandInvokedEvent: "AppCommandInvokedEvent",
	DialogMessageReceivedEvent: "DialogMessageReceivedEvent"
};
OSF.DDA.ListDescriptors={
	BindingList: "BindingList",
	DataPartList: "DataPartList",
	DataNodeList: "DataNodeList"
};
OSF.DDA.FileProperties={
	Handle: "FileHandle",
	FileSize: "FileSize",
	SliceSize: Microsoft.Office.WebExtension.Parameters.SliceSize
};
OSF.DDA.FilePropertiesDescriptor={
	Url: "Url"
};
OSF.DDA.BindingProperties={
	Id: "BindingId",
	Type: Microsoft.Office.WebExtension.Parameters.BindingType,
	RowCount: "BindingRowCount",
	ColumnCount: "BindingColumnCount",
	HasHeaders: "HasHeaders"
};
OSF.DDA.TableDataProperties={
	TableRows: "TableRows",
	TableHeaders: "TableHeaders"
};
OSF.DDA.DataPartProperties={
	Id: Microsoft.Office.WebExtension.Parameters.Id,
	BuiltIn: "DataPartBuiltIn"
};
OSF.DDA.DataNodeProperties={
	Handle: "DataNodeHandle",
	BaseName: "DataNodeBaseName",
	NamespaceUri: "DataNodeNamespaceUri",
	NodeType: "DataNodeType"
};
OSF.DDA.DataNodeEventProperties={
	OldNode: "OldNode",
	NewNode: "NewNode",
	NextSiblingNode: "NextSiblingNode",
	InUndoRedo: "InUndoRedo"
};
OSF.DDA.AsyncResultEnum.ErrorCode={
	Success: 0,
	Failed: 1
};
OSF.DialogMessageType={
	DialogMessageReceived: 0,
	DialogClosed: 12006
}
OSF.DDA.getXdmEventName=function OSF_DDA$GetXdmEventName(bindingId, eventType) {
	if (eventType==Microsoft.Office.WebExtension.EventType.BindingSelectionChanged || eventType==Microsoft.Office.WebExtension.EventType.BindingDataChanged) {
		return bindingId+"_"+eventType;
	} else {
		return eventType;
	}
};
var __extends=this.__extends || function (d, b) {
	for (var p in b) if (b.hasOwnProperty(p)) d[p]=b[p];
	function __() { this.constructor=d; }
	__.prototype=b.prototype;
	d.prototype=new __();
};
var OfficeExt;
(function (OfficeExt) {
	var Requirement;
	(function (Requirement) {
		var RequirementMatrix=(function () {
			function RequirementMatrix(_setMap) {
				this.isSetSupported=function _isSetSupported(name, minVersion) {
					if (name==undefined) {
						return false;
					}
					if (minVersion==undefined) {
						minVersion=0;
					}
					var setSupportArray=this._setMap;
					var sets=setSupportArray._sets;
					if (sets.hasOwnProperty(name.toLowerCase())) {
						var setMaxVersion=sets[name.toLowerCase()];
						return setMaxVersion > 0 && setMaxVersion >=minVersion;
					}
					else {
						return false;
					}
				};
				this._setMap=_setMap;
			}
			return RequirementMatrix;
		})();
		Requirement.RequirementMatrix=RequirementMatrix;
		var DefaultSetRequirement=(function () {
			function DefaultSetRequirement(setMap) {
				this._addSetMap=function DefaultSetRequirement_addSetMap(addedSet) {
					for (var name in addedSet) {
						this._sets[name]=addedSet[name];
					}
				};
				this._sets=setMap;
			}
			return DefaultSetRequirement;
		})();
		Requirement.DefaultSetRequirement=DefaultSetRequirement;
		var ExcelClientDefaultSetRequirement=(function (_super) {
			__extends(ExcelClientDefaultSetRequirement, _super);
			function ExcelClientDefaultSetRequirement() {
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
			return ExcelClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.ExcelClientDefaultSetRequirement=ExcelClientDefaultSetRequirement;	
		var ExcelClientV2DefaultSetRequirement=(function (_super) {
			__extends(ExcelClientV2DefaultSetRequirement, _super);
			function ExcelClientV2DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"imagecoercion": 1.1
				});
			}
			return ExcelClientV2DefaultSetRequirement;
		})(ExcelClientDefaultSetRequirement);
		Requirement.ExcelClientV2DefaultSetRequirement=ExcelClientV2DefaultSetRequirement;
		var OutlookClientDefaultSetRequirement=(function (_super) {
			__extends(OutlookClientDefaultSetRequirement, _super);
			function OutlookClientDefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.1
				});
			}
			return OutlookClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookClientDefaultSetRequirement=OutlookClientDefaultSetRequirement;
		var OutlookClientV1DefaultSetRequirement=(function (_super) {
			__extends(OutlookClientV1DefaultSetRequirement, _super);
			function OutlookClientV1DefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.1
				});
			}
			return OutlookClientV1DefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookClientV1DefaultSetRequirement=OutlookClientV1DefaultSetRequirement;
		var OutlookClientV2DefaultSetRequirement=(function (_super) {
			__extends(OutlookClientV2DefaultSetRequirement, _super);
			function OutlookClientV2DefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.2
				});
			}
			return OutlookClientV2DefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookClientV2DefaultSetRequirement=OutlookClientV2DefaultSetRequirement;
		var OutlookClientV3DefaultSetRequirement=(function (_super) {
			__extends(OutlookClientV3DefaultSetRequirement, _super);
			function OutlookClientV3DefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.3
				});
			}
			return OutlookClientV3DefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookClientV3DefaultSetRequirement=OutlookClientV3DefaultSetRequirement;
		var WordClientDefaultSetRequirement=(function (_super) {
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
					"selection": 1.1,
					"settings": 1.1,
					"tablebindings": 1.1,
					"tablecoercion": 1.1,
					"textbindings": 1.1,
					"textcoercion": 1.1,
					"textfile": 1.1
				});
			}
			return WordClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.WordClientDefaultSetRequirement=WordClientDefaultSetRequirement;
		var WordClientV2DefaultSetRequirement=(function (_super) {
			__extends(WordClientV2DefaultSetRequirement, _super);
			function WordClientV2DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"imagecoercion": 1.1,
					"pdffile": 1.1
				});
			}
			return WordClientV2DefaultSetRequirement;
		})(WordClientDefaultSetRequirement);
		Requirement.WordClientV2DefaultSetRequirement=WordClientV2DefaultSetRequirement;
		var PowerpointClientDefaultSetRequirement=(function (_super) {
			__extends(PowerpointClientDefaultSetRequirement, _super);
			function PowerpointClientDefaultSetRequirement() {
				_super.call(this, {
					"compressedfile": 1.1,
					"documentevents": 1.1,
					"file": 1.1,
					"selection": 1.1,
					"settings": 1.1,
					"textcoercion": 1.1
				});
			}
			return PowerpointClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.PowerpointClientDefaultSetRequirement=PowerpointClientDefaultSetRequirement;
		var PowerpointClientV2DefaultSetRequirement=(function (_super) {
			__extends(PowerpointClientV2DefaultSetRequirement, _super);
			function PowerpointClientV2DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"activeview": 1.1,
					"imagecoercion": 1.1,
					"pdffile": 1.1
				});
			}
			return PowerpointClientV2DefaultSetRequirement;
		})(PowerpointClientDefaultSetRequirement);
		Requirement.PowerpointClientV2DefaultSetRequirement=PowerpointClientV2DefaultSetRequirement;
		var ProjectClientDefaultSetRequirement=(function (_super) {
			__extends(ProjectClientDefaultSetRequirement, _super);
			function ProjectClientDefaultSetRequirement() {
				_super.call(this, {
					"selection": 1.1,
					"textcoercion": 1.1
				});
			}
			return ProjectClientDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.ProjectClientDefaultSetRequirement=ProjectClientDefaultSetRequirement;
		var ExcelWebDefaultSetRequirement=(function (_super) {
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
		Requirement.ExcelWebDefaultSetRequirement=ExcelWebDefaultSetRequirement;
		var ExcelWebV2DefaultSetRequirement=(function (_super) {
			__extends(ExcelWebV2DefaultSetRequirement, _super);
			function ExcelWebV2DefaultSetRequirement() {
				_super.call(this);
				this._addSetMap({
					"activeview":1.1
				});
			}
			return ExcelWebV2DefaultSetRequirement;
		})(ExcelWebDefaultSetRequirement);
		Requirement.ExcelWebV2DefaultSetRequirement=ExcelWebV2DefaultSetRequirement;
		var OutlookWebDefaultSetRequirement=(function (_super) {
			__extends(OutlookWebDefaultSetRequirement, _super);
			function OutlookWebDefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.1
				});
			}
			return OutlookWebDefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookWebDefaultSetRequirement=OutlookWebDefaultSetRequirement;
		var OutlookWebV1DefaultSetRequirement=(function (_super) {
			__extends(OutlookWebV1DefaultSetRequirement, _super);
			function OutlookWebV1DefaultSetRequirement() {
				_super.call(this, {
					"mailbox": 1.3
				});
			}
			return OutlookWebV1DefaultSetRequirement;
		})(DefaultSetRequirement);
		Requirement.OutlookWebV1DefaultSetRequirement=OutlookWebV1DefaultSetRequirement;
		var RequirementsMatrixFactory=(function () {
			function RequirementsMatrixFactory() {
			}
			RequirementsMatrixFactory.initializeOsfDda=function () {
				OSF.OUtil.setNamespace("Requirement", OSF.DDA);
			};
			RequirementsMatrixFactory.getDefaultRequirementMatrix=function (appContext) {
				this.initializeDefaultSetMatrix();
				var defaultRequirementMatrix=undefined;
				var clientRequirement=appContext.get_requirementMatrix();
				if (clientRequirement !=undefined && clientRequirement.length > 0 && typeof (JSON) !=="undefined") {
					var matrixItem=JSON.parse(appContext.get_requirementMatrix().toLowerCase());
					defaultRequirementMatrix=new RequirementMatrix(new DefaultSetRequirement(matrixItem));
				} else {
					var appFullVersion=appContext.get_appVersion();
					var appLocator=appContext.get_appName()+"-"+appFullVersion;
					if (RequirementsMatrixFactory.DefaultSetArrayMatrix !=undefined && RequirementsMatrixFactory.DefaultSetArrayMatrix[appLocator] !=undefined) {
						defaultRequirementMatrix=new RequirementMatrix(RequirementsMatrixFactory.DefaultSetArrayMatrix[appLocator]);
					} else {
						defaultRequirementMatrix=new RequirementMatrix(new DefaultSetRequirement({}));
					}
				}
				return defaultRequirementMatrix;
			};
			RequirementsMatrixFactory.initializeDefaultSetMatrix=function () {
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_RCLIENT_1500]=new ExcelClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_RCLIENT_1501]=new ExcelClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_RCLIENT_1502]=new ExcelClientV2DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_RCLIENT_1500]=new WordClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_RCLIENT_1501]=new WordClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_RCLIENT_1502]=new WordClientV2DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_RCLIENT_1500]=new PowerpointClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_RCLIENT_1501]=new PowerpointClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_RCLIENT_1502]=new PowerpointClientV2DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_RCLIENT_1500]=new OutlookClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_RCLIENT_1501]=new OutlookClientV1DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_RCLIENT_1502]=new OutlookClientV2DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_RCLIENT_1503]=new OutlookClientV3DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_WAC_1500]=new ExcelWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_WAC_1501]=new ExcelWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_WAC_1502]=new ExcelWebV2DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_WAC_1500]=new OutlookWebDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_WAC_1501]=new OutlookWebV1DefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Project_RCLIENT_1500]=new ProjectClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Project_RCLIENT_1501]=new ProjectClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Project_RCLIENT_1502]=new ProjectClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_IOS_1500]=new ExcelClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_IOS_1500]=new WordClientDefaultSetRequirement();
				RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_IOS_1500]=new PowerpointClientDefaultSetRequirement();
			};
			RequirementsMatrixFactory.Excel_RCLIENT_1500="1-15.00";
			RequirementsMatrixFactory.Excel_RCLIENT_1501="1-15.01";
			RequirementsMatrixFactory.Excel_RCLIENT_1502="1-15.02";
			RequirementsMatrixFactory.Word_RCLIENT_1500="2-15.00";
			RequirementsMatrixFactory.Word_RCLIENT_1501="2-15.01";
			RequirementsMatrixFactory.Word_RCLIENT_1502="2-15.02";
			RequirementsMatrixFactory.PowerPoint_RCLIENT_1500="4-15.00";
			RequirementsMatrixFactory.PowerPoint_RCLIENT_1501="4-15.01";
			RequirementsMatrixFactory.PowerPoint_RCLIENT_1502="4-15.02";
			RequirementsMatrixFactory.Outlook_RCLIENT_1500="8-15.00";
			RequirementsMatrixFactory.Outlook_RCLIENT_1501="8-15.01";
			RequirementsMatrixFactory.Outlook_RCLIENT_1502="8-15.02";
			RequirementsMatrixFactory.Outlook_RCLIENT_1503="8-15.03";
			RequirementsMatrixFactory.Excel_WAC_1500="16-15.00";
			RequirementsMatrixFactory.Excel_WAC_1501="16-15.01";
			RequirementsMatrixFactory.Excel_WAC_1502="16-15.02";
			RequirementsMatrixFactory.Outlook_WAC_1500="64-15.00";
			RequirementsMatrixFactory.Outlook_WAC_1501="64-15.01";
			RequirementsMatrixFactory.Project_RCLIENT_1500="128-15.00";
			RequirementsMatrixFactory.Project_RCLIENT_1501="128-15.01";
			RequirementsMatrixFactory.Project_RCLIENT_1502="128-15.02";
			RequirementsMatrixFactory.Excel_IOS_1500="1024-15.00";
			RequirementsMatrixFactory.Word_IOS_1500="4096-15.00";
			RequirementsMatrixFactory.PowerPoint_IOS_1500="8192-15.00";
			RequirementsMatrixFactory.DefaultSetArrayMatrix={};
			return RequirementsMatrixFactory;
		})();
		Requirement.RequirementsMatrixFactory=RequirementsMatrixFactory;
	})(Requirement=OfficeExt.Requirement || (OfficeExt.Requirement={}));
})(OfficeExt || (OfficeExt={}));
OfficeExt.Requirement.RequirementsMatrixFactory.initializeOsfDda();
OSF.DDA.ErrorCodeManager=(function () {
	var _errorMappings={};
	return {
		getErrorArgs: function OSF_DDA_ErrorCodeManager$getErrorArgs(errorCode) {
			return _errorMappings[errorCode] || _errorMappings[this.errorCodes.ooeInternalError];
		},
		addErrorMessage: function OSF_DDA_ErrorCodeManager$addErrorMessage(errorCode, errorNameMessage) {
				_errorMappings[errorCode]=errorNameMessage;
		},
		errorCodes : {
			ooeSuccess : 0,
			ooeCoercionTypeNotSupported : 1000,
			ooeGetSelectionNotMatchDataType : 1001,
			ooeCoercionTypeNotMatchBinding : 1002,
			ooeInvalidGetRowColumnCounts : 1003,
			ooeSelectionNotSupportCoercionType : 1004,
			ooeInvalidGetStartRowColumn : 1005,
			ooeNonUniformPartialGetNotSupported : 1006,
			ooeGetDataIsTooLarge : 1008,
			ooeFileTypeNotSupported : 1009,
			ooeUnsupportedDataObject : 2000,
			ooeCannotWriteToSelection : 2001,
			ooeDataNotMatchSelection : 2002,
			ooeOverwriteWorksheetData : 2003,
			ooeDataNotMatchBindingSize : 2004,
			ooeInvalidSetStartRowColumn : 2005,
			ooeInvalidDataFormat : 2006,
			ooeDataNotMatchCoercionType : 2007,
			ooeDataNotMatchBindingType : 2008,
			ooeSetDataIsTooLarge : 2009,
			ooeNonUniformPartialSetNotSupported : 2010,
			ooeSelectionCannotBound : 3000,
			ooeBindingNotExist : 3002,
			ooeBindingToMultipleSelection : 3003,
			ooeInvalidSelectionForBindingType : 3004,
			ooeOperationNotSupportedOnThisBindingType : 3005,
			ooeNamedItemNotFound : 3006,
			ooeMultipleNamedItemFound : 3007,
			ooeInvalidNamedItemForBindingType : 3008,
			ooeUnknownBindingType : 3009,
			ooeOperationNotSupportedOnMatrixData : 3010,
			ooeSettingNameNotExist : 4000,
			ooeSettingsCannotSave : 4001,
			ooeSettingsAreStale : 4002,
			ooeOperationNotSupported : 5000,
			ooeInternalError : 5001,
			ooeDocumentReadOnly : 5002,
			ooeEventHandlerNotExist : 5003,
			ooeInvalidApiCallInContext : 5004,
			ooeShuttingDown: 5005,
			ooeUnsupportedEnumeration: 5007,
			ooeIndexOutOfRange: 5008,
			ooeCustomXmlNodeNotFound : 6000,
			ooeCustomXmlError : 6100,
			ooeNoCapability : 7000,
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
			ooeFormatValueOutOfRange: 8022
		},
	 initializeErrorMessages: function OSF_DDA_ErrorCodeManager$initializeErrorMessages(stringNS) {
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotSupported]={ name: stringNS.L_InvalidCoercion, message: stringNS.L_CoercionTypeNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetSelectionNotMatchDataType]={ name: stringNS.L_DataReadError, message: stringNS.L_GetSelectionNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding]={ name: stringNS.L_InvalidCoercion, message: stringNS.L_CoercionTypeNotMatchBinding };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetRowColumnCounts]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetRowColumnCounts };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSelectionNotSupportCoercionType]={ name: stringNS.L_DataReadError, message: stringNS.L_SelectionNotSupportCoercionType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetStartRowColumn]={ name: stringNS.L_DataReadError, message: stringNS.L_InvalidGetStartRowColumn };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNonUniformPartialGetNotSupported]={ name: stringNS.L_DataReadError, message: stringNS.L_NonUniformPartialGetNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetDataIsTooLarge]={ name: stringNS.L_DataReadError, message: stringNS.L_GetDataIsTooLarge };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeFileTypeNotSupported]={ name: stringNS.L_DataReadError, message: stringNS.L_FileTypeNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedDataObject]={ name: stringNS.L_DataWriteError, message: stringNS.L_UnsupportedDataObject };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCannotWriteToSelection]={ name: stringNS.L_DataWriteError, message: stringNS.L_CannotWriteToSelection };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchSelection]={ name: stringNS.L_DataWriteError, message: stringNS.L_DataNotMatchSelection };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOverwriteWorksheetData]={ name: stringNS.L_DataWriteError, message: stringNS.L_OverwriteWorksheetData };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchBindingSize]={ name: stringNS.L_DataWriteError, message: stringNS.L_DataNotMatchBindingSize };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetStartRowColumn]={ name: stringNS.L_DataWriteError, message: stringNS.L_InvalidSetStartRowColumn };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidDataFormat]={ name: stringNS.L_InvalidFormat, message: stringNS.L_InvalidDataFormat };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchCoercionType]={ name: stringNS.L_InvalidDataObject, message: stringNS.L_DataNotMatchCoercionType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchBindingType]={ name: stringNS.L_InvalidDataObject, message: stringNS.L_DataNotMatchBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSetDataIsTooLarge]={ name: stringNS.L_DataWriteError, message: stringNS.L_SetDataIsTooLarge };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNonUniformPartialSetNotSupported]={ name: stringNS.L_DataWriteError, message: stringNS.L_NonUniformPartialSetNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSelectionCannotBound]={ name: stringNS.L_BindingCreationError, message: stringNS.L_SelectionCannotBound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBindingNotExist]={ name: stringNS.L_InvalidBindingError, message: stringNS.L_BindingNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBindingToMultipleSelection]={ name: stringNS.L_BindingCreationError, message: stringNS.L_BindingToMultipleSelection };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSelectionForBindingType]={ name: stringNS.L_BindingCreationError, message: stringNS.L_InvalidSelectionForBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupportedOnThisBindingType]={ name: stringNS.L_InvalidBindingOperation, message: stringNS.L_OperationNotSupportedOnThisBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNamedItemNotFound]={ name: stringNS.L_BindingCreationError, message: stringNS.L_NamedItemNotFound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeMultipleNamedItemFound]={ name: stringNS.L_BindingCreationError, message: stringNS.L_MultipleNamedItemFound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidNamedItemForBindingType]={ name: stringNS.L_BindingCreationError, message: stringNS.L_InvalidNamedItemForBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnknownBindingType]={ name: stringNS.L_InvalidBinding, message: stringNS.L_UnknownBindingType };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupportedOnMatrixData]={ name: stringNS.L_InvalidBindingOperation , message: stringNS.L_OperationNotSupportedOnMatrixData };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingNameNotExist]={ name: stringNS.L_ReadSettingsError, message: stringNS.L_SettingNameNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingsCannotSave]={ name: stringNS.L_SaveSettingsError, message: stringNS.L_SettingsCannotSave };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingsAreStale]={ name: stringNS.L_SettingsStaleError, message: stringNS.L_SettingsAreStale };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupported]={ name: stringNS.L_HostError, message: stringNS.L_OperationNotSupported };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError]={ name: stringNS.L_InternalError, message: stringNS.L_InternalErrorDescription };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDocumentReadOnly]={ name: stringNS.L_PermissionDenied, message: stringNS.L_DocumentReadOnly };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerNotExist]={ name: stringNS.L_EventRegistrationError, message: stringNS.L_EventHandlerNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext]={ name: stringNS.L_InvalidAPICall, message: stringNS.L_InvalidApiCallInContext };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeShuttingDown]={ name: stringNS.L_ShuttingDown, message: stringNS.L_ShuttingDown };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedEnumeration]={ name: stringNS.L_UnsupportedEnumeration, message: stringNS.L_UnsupportedEnumerationMessage };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeIndexOutOfRange]={ name: stringNS.L_IndexOutOfRange, message: stringNS.L_IndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlNodeNotFound]={ name: stringNS.L_InvalidNode, message: stringNS.L_CustomXmlNodeNotFound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlError]={ name: stringNS.L_CustomXmlError, message: stringNS.L_CustomXmlError };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability]={ name: stringNS.L_PermissionDenied, message: stringNS.L_NoCapability };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCannotNavTo]={ name: stringNS.L_CannotNavigateTo, message: stringNS.L_CannotNavigateTo };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSpecifiedIdNotExist]={ name: stringNS.L_SpecifiedIdNotExist, message: stringNS.L_SpecifiedIdNotExist };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNavOutOfBound]={ name: stringNS.L_NavOutOfBound, message: stringNS.L_NavOutOfBound };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeElementMissing]={ name: stringNS.L_MissingParameter, message: stringNS.L_ElementMissing };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeProtectedError]={ name: stringNS.L_PermissionDenied, message: stringNS.L_NoCapability };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidCellsValue]={ name: stringNS.L_InvalidValue, message: stringNS.L_InvalidCellsValue };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidTableOptionValue]={ name: stringNS.L_InvalidValue, message: stringNS.L_InvalidTableOptionValue };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidFormatValue]={ name: stringNS.L_InvalidValue, message: stringNS.L_InvalidFormatValue };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRowIndexOutOfRange]={ name: stringNS.L_OutOfRange, message: stringNS.L_RowIndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeColIndexOutOfRange]={ name: stringNS.L_OutOfRange, message: stringNS.L_ColIndexOutOfRange };
			_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeFormatValueOutOfRange]={ name: stringNS.L_OutOfRange, message: stringNS.L_FormatValueOutOfRange };
		}
	}
})();
OSF.DDA.MethodDispId={
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
	dispidGetFilePropertiesMethod:86,
	dispidClearFormatsMethod: 87,
	dispidSetTableOptionsMethod: 88,
	dispidSetFormatsMethod:89,
	dispidExecuteRichApiRequestMethod:93,
	dispidAppCommandInvocationCompletedMethod:94,
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
	dispidMethodMax: 143,
	dispidGetSelectedTaskMethod: 110,
	dispidGetSelectedResourceMethod: 111,
	dispidGetTaskMethod: 112,
	dispidGetResourceFieldMethod: 113,
	dispidGetWSSUrlMethod: 114,
	dispidGetTaskFieldMethod: 115,
	dispidGetProjectFieldMethod: 116,
	dispidGetSelectedViewMethod: 117
};
OSF.DDA.EventDispId={
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
	dispidAppCommandInvokedEvent: 39,
	dispidDataNodeAddedEvent: 60,
	dispidDataNodeReplacedEvent: 61,
	dispidDataNodeDeletedEvent: 62,
	dispidEventMax: 63,
	dispidTaskSelectionChangedEvent: 56,
	dispidResourceSelectionChangedEvent: 57,
	dispidViewSelectionChangedEvent: 58
};
OSF.OUtil.setNamespace("Microsoft", window);
OSF.OUtil.setNamespace("Office", Microsoft);
OSF.OUtil.setNamespace("Common", Microsoft.Office);
Microsoft.Office.Common.InvokeType={ "async": 0,
									   "sync": 1,
									   "asyncRegisterEvent": 2,
									   "asyncUnregisterEvent": 3,
									   "syncRegisterEvent": 4,
									   "syncUnregisterEvent": 5
									   };
Microsoft.Office.Common.InvokeResultCode={
											 "noError": 0,
											 "errorInRequest": -1,
											 "errorHandlingRequest": -2,
											 "errorInResponse": -3,
											 "errorHandlingResponse": -4,
											 "errorHandlingRequestAccessDenied": -5,
											 "errorHandlingMethodCallTimedout": -6
											};
Microsoft.Office.Common.MessageType={ "request": 0,
										"response": 1
									  };
Microsoft.Office.Common.ActionType={ "invoke": 0,
									   "registerEvent": 1,
									   "unregisterEvent": 2 };
Microsoft.Office.Common.ResponseType={ "forCalling": 0,
										 "forEventing": 1
									  };
Microsoft.Office.Common.MethodObject=function Microsoft_Office_Common_MethodObject(method, invokeType, blockingOthers) {
	this._method=method;
	this._invokeType=invokeType;
	this._blockingOthers=blockingOthers;
};
Microsoft.Office.Common.MethodObject.prototype={
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
Microsoft.Office.Common.EventMethodObject=function Microsoft_Office_Common_EventMethodObject(registerMethodObject, unregisterMethodObject) {
	this._registerMethodObject=registerMethodObject;
	this._unregisterMethodObject=unregisterMethodObject;
};
Microsoft.Office.Common.EventMethodObject.prototype={
	getRegisterMethodObject: function Microsoft_Office_Common_EventMethodObject$getRegisterMethodObject() {
		return this._registerMethodObject;
	},
	getUnregisterMethodObject: function Microsoft_Office_Common_EventMethodObject$getUnregisterMethodObject() {
		return this._unregisterMethodObject;
	}
};
Microsoft.Office.Common.ServiceEndPoint=function Microsoft_Office_Common_ServiceEndPoint(serviceEndPointId) {
	var e=Function._validateParams(arguments, [
		  { name: "serviceEndPointId", type: String, mayBeNull: false }
	]);
	if (e) throw e;
	this._methodObjectList={};
	this._eventHandlerProxyList={};
	this._Id=serviceEndPointId;
	this._conversations={};
	this._policyManager=null;
};
Microsoft.Office.Common.ServiceEndPoint.prototype={
	registerMethod: function Microsoft_Office_Common_ServiceEndPoint$registerMethod(methodName, method, invokeType, blockingOthers) {
		var e=Function._validateParams(arguments, [
			{ name: "methodName", type: String, mayBeNull: false },
			{ name: "method", type: Function, mayBeNull: false },
			{ name: "invokeType", type: Number, mayBeNull: false },
			{ name: "blockingOthers", type: Boolean, mayBeNull: false }
		]);
		if (e) throw e;
		if (invokeType !==Microsoft.Office.Common.InvokeType.async
			&& invokeType !==Microsoft.Office.Common.InvokeType.sync){
			throw OsfMsAjaxFactory.msAjaxError.argument("invokeType");
		}
		var methodObject=new Microsoft.Office.Common.MethodObject(method,
																	invokeType,
																	blockingOthers);
		this._methodObjectList[methodName]=methodObject;
	},
	unregisterMethod: function Microsoft_Office_Common_ServiceEndPoint$unregisterMethod(methodName) {
		var e=Function._validateParams(arguments, [
			{ name: "methodName", type: String, mayBeNull: false }
		]);
		if (e) throw e;
		delete this._methodObjectList[methodName];
	},
	registerEvent: function Microsoft_Office_Common_ServiceEndPoint$registerEvent(eventName, registerMethod, unregisterMethod) {
		var e=Function._validateParams(arguments, [
			{ name: "eventName", type: String, mayBeNull: false },
			{ name: "registerMethod", type: Function, mayBeNull: false },
			{ name: "unregisterMethod", type: Function, mayBeNull: false }
		]);
		if (e) throw e;
		var methodObject=new Microsoft.Office.Common.EventMethodObject (
																		  new Microsoft.Office.Common.MethodObject(registerMethod,
																												   Microsoft.Office.Common.InvokeType.syncRegisterEvent,
																												   false),
																		  new Microsoft.Office.Common.MethodObject(unregisterMethod,
																												   Microsoft.Office.Common.InvokeType.syncUnregisterEvent,
																												   false)
																												   );
		this._methodObjectList[eventName]=methodObject;
	},
	registerEventEx: function Microsoft_Office_Common_ServiceEndPoint$registerEventEx(eventName, registerMethod, registerMethodInvokeType, unregisterMethod, unregisterMethodInvokeType) {
		var e=Function._validateParams(arguments, [
			{ name: "eventName", type: String, mayBeNull: false },
			{ name: "registerMethod", type: Function, mayBeNull: false },
			{ name: "registerMethodInvokeType", type: Number, mayBeNull: false },
			{ name: "unregisterMethod", type: Function, mayBeNull: false },
			{ name: "unregisterMethodInvokeType", type: Number, mayBeNull: false }
		]);
		if (e) throw e;
		var methodObject=new Microsoft.Office.Common.EventMethodObject (
																		  new Microsoft.Office.Common.MethodObject(registerMethod,
																												   registerMethodInvokeType,
																												   false),
																		  new Microsoft.Office.Common.MethodObject(unregisterMethod,
																												   unregisterMethodInvokeType,
																												   false)
																												   );
		this._methodObjectList[eventName]=methodObject;
	},
	unregisterEvent: function (eventName) {
		var e=Function._validateParams(arguments, [
			{ name: "eventName", type: String, mayBeNull: false }
		]);
		if (e) throw e;
		this.unregisterMethod(eventName);
	},
	registerConversation: function Microsoft_Office_Common_ServiceEndPoint$registerConversation(conversationId) {
		var e=Function._validateParams(arguments, [
			{ name: "conversationId", type: String, mayBeNull: false }
			]);
		if (e) throw e;
		this._conversations[conversationId]=true;
	},
	unregisterConversation: function Microsoft_Office_Common_ServiceEndPoint$unregisterConversation(conversationId) {
		var e=Function._validateParams(arguments, [
			{ name: "conversationId", type: String, mayBeNull: false }
			]);
		if (e) throw e;
		delete this._conversations[conversationId];
	},
	setPolicyManager: function Microsoft_Office_Common_ServiceEndPoint$setPolicyManager(policyManager) {
		var e=Function._validateParams(arguments, [
			{ name: "policyManager", type: Object, mayBeNull: false }
			]);
		if (e) throw e;
		if (!policyManager.checkPermission) {
			throw OsfMsAjaxFactory.msAjaxError.argument("policyManager");
		}
		this._policyManager=policyManager;
	},
	getPolicyManager: function Microsoft_Office_Common_ServiceEndPoint$getPolicyManager() {
		return this._policyManager;
	}
};
Microsoft.Office.Common.ClientEndPoint=function Microsoft_Office_Common_ClientEndPoint(conversationId, targetWindow, targetUrl) {
	var e=Function._validateParams(arguments, [
		  { name: "conversationId", type: String, mayBeNull: false },
		  { name: "targetWindow", mayBeNull: false },
		  { name: "targetUrl", type: String, mayBeNull: false }
	]);
	if (e) throw e;
	if (!targetWindow.postMessage) {
		throw OsfMsAjaxFactory.msAjaxError.argument("targetWindow");
	}
	this._conversationId=conversationId;
	this._targetWindow=targetWindow;
	this._targetUrl=targetUrl;
	this._callingIndex=0;
	this._callbackList={};
	this._eventHandlerList={};
};
Microsoft.Office.Common.ClientEndPoint.prototype={
	invoke: function Microsoft_Office_Common_ClientEndPoint$invoke(targetMethodName, callback, param) {
		var e=Function._validateParams(arguments, [
			{ name: "targetMethodName", type: String, mayBeNull: false },
			{ name: "callback", type: Function, mayBeNull: true },
			{ name: "param", mayBeNull: true }
		]);
		if (e) throw e;
		var correlationId=this._callingIndex++;
		var now=new Date();
		var callbackEntry={"callback" : callback, "createdOn": now.getTime() };
		if(param && typeof param==="object" && typeof param.__timeout__==="number") {
			callbackEntry.timeout=param.__timeout__;
			delete param.__timeout__;
		}
		this._callbackList[correlationId]=callbackEntry;
		try {
			var callRequest=new Microsoft.Office.Common.Request(targetMethodName,
																  Microsoft.Office.Common.ActionType.invoke,
																  this._conversationId,
																  correlationId,
																  param);
			var msg=Microsoft.Office.Common.MessagePackager.envelope(callRequest);
			this._targetWindow.postMessage(msg, this._targetUrl);
			Microsoft.Office.Common.XdmCommunicationManager._startMethodTimeoutTimer();
		}
		catch (ex) {
			try {
				if (callback !==null)
					callback(Microsoft.Office.Common.InvokeResultCode.errorInRequest, ex);
			}
			finally {
				delete this._callbackList[correlationId];
			}
		}
	},
	registerForEvent: function Microsoft_Office_Common_ClientEndPoint$registerForEvent(targetEventName, eventHandler, callback, data) {
		var e=Function._validateParams(arguments, [
			{ name: "targetEventName", type: String, mayBeNull: false },
			{ name: "eventHandler", type: Function, mayBeNull: false },
			{ name: "callback", type: Function, mayBeNull: true },
			{ name: "data", mayBeNull: true, optional: true }
		]);
		if (e) throw e;
		var correlationId=this._callingIndex++;
		var now=new Date();
		this._callbackList[correlationId]={"callback" : callback, "createdOn": now.getTime() };
		try {
			var callRequest=new Microsoft.Office.Common.Request(targetEventName,
																  Microsoft.Office.Common.ActionType.registerEvent,
																  this._conversationId,
																  correlationId,
																  data);
			var msg=Microsoft.Office.Common.MessagePackager.envelope(callRequest);
			this._targetWindow.postMessage(msg, this._targetUrl);
			Microsoft.Office.Common.XdmCommunicationManager._startMethodTimeoutTimer();
			this._eventHandlerList[targetEventName]=eventHandler;
		}
		catch (ex) {
			try {
				if (callback !==null) {
					callback(Microsoft.Office.Common.InvokeResultCode.errorInRequest, ex);
				}
			}
			finally {
				delete this._callbackList[correlationId];
			}
		}
	},
	unregisterForEvent: function Microsoft_Office_Common_ClientEndPoint$unregisterForEvent(targetEventName, callback, data) {
		var e=Function._validateParams(arguments, [
			{ name: "targetEventName", type: String, mayBeNull: false },
			{ name: "callback", type: Function, mayBeNull: true },
			{ name: "data", mayBeNull: true, optional: true }
		]);
		if (e) throw e;
		var correlationId=this._callingIndex++;
		var now=new Date();
		this._callbackList[correlationId]={"callback" : callback, "createdOn": now.getTime() };
		try {
			var callRequest=new Microsoft.Office.Common.Request(targetEventName,
																  Microsoft.Office.Common.ActionType.unregisterEvent,
																  this._conversationId,
																  correlationId,
																  data);
			var msg=Microsoft.Office.Common.MessagePackager.envelope(callRequest);
			this._targetWindow.postMessage(msg, this._targetUrl);
			Microsoft.Office.Common.XdmCommunicationManager._startMethodTimeoutTimer();
		}
		catch (ex) {
			try {
				if (callback !==null) {
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
Microsoft.Office.Common.XdmCommunicationManager=(function () {
	var _invokerQueue=[];
	var _messageProcessingTimer=null;
	var _processInterval=10;
	var _blockingFlag=false;
	var _methodTimeoutTimer=null;
	var _methodTimeoutProcessInterval=2000;
	var _methodTimeout=60000;
	var _serviceEndPoints={};
	var _clientEndPoints={};
	var _initialized=false;
	function _lookupServiceEndPoint(conversationId) {
		for(var id in _serviceEndPoints) {
			 if(_serviceEndPoints[id]._conversations[conversationId]) {
				 return _serviceEndPoints[id];
			 }
		}
		OsfMsAjaxFactory.msAjaxDebug.trace("Unknown conversation Id.");
		throw OsfMsAjaxFactory.msAjaxError.argument("conversationId");
	};
	function _lookupClientEndPoint(conversationId) {
		var clientEndPoint=_clientEndPoints[conversationId];
		if(!clientEndPoint) {
			OsfMsAjaxFactory.msAjaxDebug.trace("Unknown conversation Id.");
			throw OsfMsAjaxFactory.msAjaxError.argument("conversationId");
		}
		return clientEndPoint;
	};
	function _lookupMethodObject(serviceEndPoint, messageObject) {
		var methodOrEventMethodObject=serviceEndPoint._methodObjectList[messageObject._actionName];
		if (!methodOrEventMethodObject) {
			OsfMsAjaxFactory.msAjaxDebug.trace("The specified method is not registered on service endpoint:"+messageObject._actionName);
			throw OsfMsAjaxFactory.msAjaxError.argument("messageObject");
		}
		var methodObject=null;
		if (messageObject._actionType===Microsoft.Office.Common.ActionType.invoke) {
			methodObject=methodOrEventMethodObject;
		} else if (messageObject._actionType===Microsoft.Office.Common.ActionType.registerEvent) {
			methodObject=methodOrEventMethodObject.getRegisterMethodObject();
		} else {
			methodObject=methodOrEventMethodObject.getUnregisterMethodObject();
		}
		return methodObject;
	};
	function _enqueInvoker (invoker) {
		_invokerQueue.push(invoker);
	};
	function _dequeInvoker() {
		if (_messageProcessingTimer !==null) {
			if (!_blockingFlag) {
				if (_invokerQueue.length > 0) {
					var invoker=_invokerQueue.shift();
					_blockingFlag=invoker.getInvokeBlockingFlag();
					invoker.invoke();
				} else {
					clearInterval(_messageProcessingTimer);
					_messageProcessingTimer=null;
				}
			}
		} else {
			OsfMsAjaxFactory.msAjaxDebug.trace("channel is not ready.");
		}
	};
	function _checkMethodTimeout() {
		if (_methodTimeoutTimer) {
			var clientEndPoint;
			var methodCallsNotTimedout=0;
			var now=new Date();
			var timeoutValue;
			for(var conversationId in _clientEndPoints) {
				clientEndPoint=_clientEndPoints[conversationId];
				for(var correlationId in clientEndPoint._callbackList) {
					var callbackEntry=clientEndPoint._callbackList[correlationId];
					timeoutValue=callbackEntry.timeout ? callbackEntry.timeout : _methodTimeout;
					if(Math.abs(now.getTime() - callbackEntry.createdOn) >=timeoutValue) {
						try{
							if(callbackEntry.callback) {
								callbackEntry.callback(Microsoft.Office.Common.InvokeResultCode.errorHandlingMethodCallTimedout, null);
							}
						}
						finally {
							delete clientEndPoint._callbackList[correlationId];
						}
					} else {
						methodCallsNotTimedout++;
					};
				}
			}
			if (methodCallsNotTimedout===0) {
				clearInterval(_methodTimeoutTimer);
				_methodTimeoutTimer=null;
			}
		} else {
			OsfMsAjaxFactory.msAjaxDebug.trace("channel is not ready.");
		}
	};
	function _postCallbackHandler() {
		_blockingFlag=false;
	};
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
	};
	function _receive(e) {
		if (e.data !='') {
			var messageObject;
			try {
				messageObject=Microsoft.Office.Common.MessagePackager.unenvelope(e.data);
			}catch(ex) {
				return;
			}
			if ( typeof (messageObject._messageType)=='undefined' ) {
				return;
			}
			if (messageObject._messageType===Microsoft.Office.Common.MessageType.request) {
				var requesterUrl=(e.origin==null || e.origin=="null") ? messageObject._origin : e.origin;
				try {
					var serviceEndPoint=_lookupServiceEndPoint(messageObject._conversationId);
					var policyManager=serviceEndPoint.getPolicyManager();
					if(policyManager && !policyManager.checkPermission(messageObject._conversationId, messageObject._actionName, messageObject._data)) {
						throw "Access Denied";
					}
					var methodObject=_lookupMethodObject(serviceEndPoint, messageObject);
					var invokeCompleteCallback=new Microsoft.Office.Common.InvokeCompleteCallback(e.source,
																										requesterUrl,
																										messageObject._actionName,
																										messageObject._conversationId,
																										messageObject._correlationId,
																										_postCallbackHandler);
					var invoker=new Microsoft.Office.Common.Invoker(methodObject,
																			messageObject._data,
																			invokeCompleteCallback,
																			serviceEndPoint._eventHandlerProxyList,
																			messageObject._conversationId,
																			messageObject._actionName);
					if (_messageProcessingTimer==null) {
						_messageProcessingTimer=setInterval(_dequeInvoker, _processInterval);
					}
					_enqueInvoker(invoker);
				}
				catch (ex) {
					var errorCode=Microsoft.Office.Common.InvokeResultCode.errorHandlingRequest;
					if (ex=="Access Denied") {
						errorCode=Microsoft.Office.Common.InvokeResultCode.errorHandlingRequestAccessDenied;
					}
					var callResponse=new Microsoft.Office.Common.Response(messageObject._actionName,
																				messageObject._conversationId,
																				messageObject._correlationId,
																				errorCode,
																				Microsoft.Office.Common.ResponseType.forCalling,
																				ex);
					var envelopedResult=Microsoft.Office.Common.MessagePackager.envelope(callResponse);
					if (e.source && e.source.postMessage) {
						e.source.postMessage(envelopedResult, requesterUrl);
					}
				}
			} else if (messageObject._messageType===Microsoft.Office.Common.MessageType.response){
				var clientEndPoint=_lookupClientEndPoint(messageObject._conversationId);
				if (messageObject._responseType===Microsoft.Office.Common.ResponseType.forCalling) {
					var callbackEntry=clientEndPoint._callbackList[messageObject._correlationId];
					if (callbackEntry) {
						try {
							if (callbackEntry.callback)
								callbackEntry.callback(messageObject._errorCode, messageObject._data);
						}
						finally {
							delete clientEndPoint._callbackList[messageObject._correlationId];
						}
					}
				} else {
					var eventhandler=clientEndPoint._eventHandlerList[messageObject._actionName];
					if (eventhandler !==undefined && eventhandler !==null) {
						eventhandler(messageObject._data);
					}
				}
			} else {
				return;
			}
		}
	};
	function _initialize () {
		if(!_initialized) {
			_registerListener(_receive);
			_initialized=true;
		}
	};
	return {
		connect : function Microsoft_Office_Common_XdmCommunicationManager$connect(conversationId, targetWindow, targetUrl) {
			var clientEndPoint=_clientEndPoints[conversationId];
			if (!clientEndPoint) {
				_initialize();
				clientEndPoint=new Microsoft.Office.Common.ClientEndPoint(conversationId, targetWindow, targetUrl);
				_clientEndPoints[conversationId]=clientEndPoint;
			}
			return clientEndPoint;
		},
		getClientEndPoint : function Microsoft_Office_Common_XdmCommunicationManager$getClientEndPoint(conversationId) {
			var e=Function._validateParams(arguments, [
				{name: "conversationId", type: String, mayBeNull: false}
			]);
			if (e) throw e;
			return _clientEndPoints[conversationId];
		},
		createServiceEndPoint : function Microsoft_Office_Common_XdmCommunicationManager$createServiceEndPoint(serviceEndPointId) {
			_initialize();
			var serviceEndPoint=new Microsoft.Office.Common.ServiceEndPoint(serviceEndPointId);
			_serviceEndPoints[serviceEndPointId]=serviceEndPoint;
			return serviceEndPoint;
		},
		getServiceEndPoint : function Microsoft_Office_Common_XdmCommunicationManager$getServiceEndPoint(serviceEndPointId) {
			var e=Function._validateParams(arguments, [
				 {name: "serviceEndPointId", type: String, mayBeNull: false}
			]);
			if (e) throw e;
			return _serviceEndPoints[serviceEndPointId];
		},
		deleteClientEndPoint : function Microsoft_Office_Common_XdmCommunicationManager$deleteClientEndPoint(conversationId) {
			var e=Function._validateParams(arguments, [
				{name: "conversationId", type: String, mayBeNull: false}
			]);
			if (e) throw e;
			delete _clientEndPoints[conversationId];
		},
		_setMethodTimeout : function Microsoft_Office_Common_XdmCommunicationManager$_setMethodTimeout(methodTimeout) {
			var e=Function._validateParams(arguments, [
				{name: "methodTimeout", type: Number, mayBeNull: false}
			]);
			if (e) throw e;
			_methodTimeout=(methodTimeout <=0) ?  60000 : methodTimeout;
		},
		_startMethodTimeoutTimer : function Microsoft_Office_Common_XdmCommunicationManager$_startMethodTimeoutTimer() {
			if (!_methodTimeoutTimer) {
				_methodTimeoutTimer=setInterval(_checkMethodTimeout, _methodTimeoutProcessInterval);
			}
		}
	};
})();
Microsoft.Office.Common.Message=function Microsoft_Office_Common_Message(messageType, actionName, conversationId, correlationId, data) {
	var e=Function._validateParams(arguments, [
		{name: "messageType", type: Number, mayBeNull: false},
		{name: "actionName", type: String, mayBeNull: false},
		{name: "conversationId", type: String, mayBeNull: false},
		{name: "correlationId", mayBeNull: false},
		{name: "data", mayBeNull: true, optional: true }
	]);
	if (e) throw e;
	this._messageType=messageType;
	this._actionName=actionName;
	this._conversationId=conversationId;
	this._correlationId=correlationId;
	this._origin=window.location.href;
	if (typeof data=="undefined") {
		this._data=null;
	} else {
		this._data=data;
	}
};
Microsoft.Office.Common.Message.prototype={
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
Microsoft.Office.Common.Request=function Microsoft_Office_Common_Request(actionName, actionType, conversationId, correlationId, data) {
	Microsoft.Office.Common.Request.uber.constructor.call(this,
														  Microsoft.Office.Common.MessageType.request,
														  actionName,
														  conversationId,
														  correlationId,
														  data);
	this._actionType=actionType;
};
OSF.OUtil.extend(Microsoft.Office.Common.Request, Microsoft.Office.Common.Message);
Microsoft.Office.Common.Request.prototype.getActionType=function Microsoft_Office_Common_Request$getActionType() {
	return this._actionType;
};
Microsoft.Office.Common.Response=function Microsoft_Office_Common_Response(actionName, conversationId, correlationId, errorCode, responseType, data) {
	Microsoft.Office.Common.Response.uber.constructor.call(this,
														   Microsoft.Office.Common.MessageType.response,
														   actionName,
														   conversationId,
														   correlationId,
														   data);
	this._errorCode=errorCode;
	this._responseType=responseType;
};
OSF.OUtil.extend(Microsoft.Office.Common.Response, Microsoft.Office.Common.Message);
Microsoft.Office.Common.Response.prototype.getErrorCode=function Microsoft_Office_Common_Response$getErrorCode() {
	return this._errorCode;
};
Microsoft.Office.Common.Response.prototype.getResponseType=function Microsoft_Office_Common_Response$getResponseType() {
	return this._responseType;
};
Microsoft.Office.Common.MessagePackager={
	envelope: function Microsoft_Office_Common_MessagePackager$envelope(messageObject) {
		return OsfMsAjaxFactory.msAjaxSerializer.serialize(messageObject);
	},
	unenvelope: function Microsoft_Office_Common_MessagePackager$unenvelope(messageObject) {
		return OsfMsAjaxFactory.msAjaxSerializer.deserialize(messageObject, true);
	}
};
Microsoft.Office.Common.ResponseSender=function Microsoft_Office_Common_ResponseSender(requesterWindow, requesterUrl, actionName, conversationId, correlationId, responseType) {
	var e=Function._validateParams(arguments, [
		{name: "requesterWindow", mayBeNull: false},
		{name: "requesterUrl", type: String, mayBeNull: false},
		{name: "actionName", type: String, mayBeNull: false},
		{name: "conversationId", type: String, mayBeNull: false},
		{name: "correlationId", mayBeNull: false},
		{name: "responsetype", type: Number, maybeNull: false }
		]);
	if (e) throw e;
	this._requesterWindow=requesterWindow;
	this._requesterUrl=requesterUrl;
	this._actionName=actionName;
	this._conversationId=conversationId;
	this._correlationId=correlationId;
	this._invokeResultCode=Microsoft.Office.Common.InvokeResultCode.noError;
	this._responseType=responseType;
	var me=this;
	this._send=function (result) {
		 var response=new Microsoft.Office.Common.Response( me._actionName,
															  me._conversationId,
															  me._correlationId,
															  me._invokeResultCode,
															  me._responseType,
															  result);
		var envelopedResult=Microsoft.Office.Common.MessagePackager.envelope(response);
		me._requesterWindow.postMessage(envelopedResult, me._requesterUrl);
	};
};
Microsoft.Office.Common.ResponseSender.prototype={
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
		this._invokeResultCode=resultCode;
	}
};
Microsoft.Office.Common.InvokeCompleteCallback=function Microsoft_Office_Common_InvokeCompleteCallback(requesterWindow, requesterUrl, actionName, conversationId, correlationId, postCallbackHandler) {
	Microsoft.Office.Common.InvokeCompleteCallback.uber.constructor.call(this,
																 requesterWindow,
																 requesterUrl,
																 actionName,
																 conversationId,
																 correlationId,
																 Microsoft.Office.Common.ResponseType.forCalling);
	this._postCallbackHandler=postCallbackHandler;
	var me=this;
	this._send=function (result) {
		var response=new Microsoft.Office.Common.Response(me._actionName,
															  me._conversationId,
															  me._correlationId,
															  me._invokeResultCode,
															  me._responseType,
															  result);
		var envelopedResult=Microsoft.Office.Common.MessagePackager.envelope(response);
		me._requesterWindow.postMessage(envelopedResult, me._requesterUrl);
		 me._postCallbackHandler();
	};
};
OSF.OUtil.extend(Microsoft.Office.Common.InvokeCompleteCallback, Microsoft.Office.Common.ResponseSender);
Microsoft.Office.Common.Invoker=function Microsoft_Office_Common_Invoker(methodObject, paramValue, invokeCompleteCallback, eventHandlerProxyList, conversationId, eventName) {
	var e=Function._validateParams(arguments, [
		{name: "methodObject", mayBeNull: false},
		{name: "paramValue", mayBeNull: true},
		{name: "invokeCompleteCallback", mayBeNull: false},
		{name: "eventHandlerProxyList", mayBeNull: true},
		{name: "conversationId", type: String, mayBeNull: false},
		{name: "eventName", type: String, mayBeNull: false}
	]);
	if (e) throw e;
	this._methodObject=methodObject;
	this._param=paramValue;
	this._invokeCompleteCallback=invokeCompleteCallback;
	this._eventHandlerProxyList=eventHandlerProxyList;
	this._conversationId=conversationId;
	this._eventName=eventName;
};
Microsoft.Office.Common.Invoker.prototype={
	invoke: function Microsoft_Office_Common_Invoker$invoke() {
		try {
			var result;
			switch (this._methodObject.getInvokeType()) {
				case Microsoft.Office.Common.InvokeType.async:
					this._methodObject.getMethod()(this._param, this._invokeCompleteCallback.getSend());
					break;
				case Microsoft.Office.Common.InvokeType.sync:
					result=this._methodObject.getMethod()(this._param);
					this._invokeCompleteCallback.getSend()(result);
					break;
				case Microsoft.Office.Common.InvokeType.syncRegisterEvent:
					var eventHandlerProxy=this._createEventHandlerProxyObject(this._invokeCompleteCallback);
					result=this._methodObject.getMethod()(eventHandlerProxy.getSend(), this._param);
					this._eventHandlerProxyList[this._conversationId+this._eventName]=eventHandlerProxy.getSend();
					this._invokeCompleteCallback.getSend()(result);
					break;
				case Microsoft.Office.Common.InvokeType.syncUnregisterEvent:
					var eventHandler=this._eventHandlerProxyList[this._conversationId+this._eventName];
					result=this._methodObject.getMethod()(eventHandler, this._param);
					delete this._eventHandlerProxyList[this._conversationId+this._eventName];
					this._invokeCompleteCallback.getSend()(result);
					break;
				case Microsoft.Office.Common.InvokeType.asyncRegisterEvent:
					var eventHandlerProxyAsync=this._createEventHandlerProxyObject(this._invokeCompleteCallback);
					this._methodObject.getMethod()(eventHandlerProxyAsync.getSend(),
												   this._invokeCompleteCallback.getSend(),
												   this._param
												   );
					this._eventHandlerProxyList[this._callerId+this._eventName]=eventHandlerProxyAsync.getSend();
					break;
				case Microsoft.Office.Common.InvokeType.asyncUnregisterEvent:
					var eventHandlerAsync=this._eventHandlerProxyList[this._callerId+this._eventName];
					this._methodObject.getMethod()(eventHandlerAsync,
												   this._invokeCompleteCallback.getSend(),
												   this._param
												   );
					delete this._eventHandlerProxyList[this._callerId+this._eventName];
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
		return new Microsoft.Office.Common.ResponseSender(invokeCompleteObject.getRequesterWindow(),
														  invokeCompleteObject.getRequesterUrl(),
														  invokeCompleteObject.getActionName(),
														  invokeCompleteObject.getConversationId(),
														  invokeCompleteObject.getCorrelationId(),
														  Microsoft.Office.Common.ResponseType.forEventing
														  );
	}
};
		OSF.EventDispatch=function OSF_EventDispatch(eventTypes) {
			this._eventHandlers={};
			this._queuedEventsArgs={};
			for(var entry in eventTypes) {
				var eventType=eventTypes[entry];
				this._eventHandlers[eventType]=[];
				this._queuedEventsArgs[eventType]=[];
			}
		};
		OSF.EventDispatch.prototype={
			getSupportedEvents: function OSF_EventDispatch$getSupportedEvents() {
				var events=[];
				for(var eventName in this._eventHandlers)
					events.push(eventName);
				return events;
			},
			supportsEvent: function OSF_EventDispatch$supportsEvent(event) {
				var isSupported=false;
				for(var eventName in this._eventHandlers) {
					if(event==eventName) {
						isSupported=true;
						break;
					}
				}
				return isSupported;
			},
			hasEventHandler: function OSF_EventDispatch$hasEventHandler(eventType, handler) {
				var handlers=this._eventHandlers[eventType];
				if(handlers && handlers.length > 0) {
					for(var h in handlers) {
						if(handlers[h]===handler)
							return true;
					}
				}
				return false;
			},
			addEventHandler: function OSF_EventDispatch$addEventHandler(eventType, handler) {
				if(typeof handler !="function") {
					return false;
				}
				var handlers=this._eventHandlers[eventType];
				if( handlers && !this.hasEventHandler(eventType, handler) ) {
					handlers.push(handler);
					return true;
				} else {
					return false;
				}
			},
			addEventHandlerAndFireQueuedEvent: function OSF_EventDispatch$addEventHandlerAndFireQueuedEvent(eventType, handler){
				var handlers=this._eventHandlers[eventType];
				var isFirstHandler=handlers.length==0;
				var succeed=this.addEventHandler(eventType, handler)
				if (isFirstHandler && succeed) {
					this.fireQueuedEvent(eventType);
				}
				return succeed;
			},
			removeEventHandler: function OSF_EventDispatch$removeEventHandler(eventType, handler) {
				var handlers=this._eventHandlers[eventType];
				if(handlers && handlers.length > 0) {
					for(var index=0; index < handlers.length; index++) {
						if(handlers[index]===handler) {
							handlers.splice(index, 1);
							return true;
						}
					}
				}
				return false;
			},
			clearEventHandlers: function OSF_EventDispatch$clearEventHandlers(eventType) {
				this._eventHandlers[eventType]=[];
			},
			getEventHandlerCount: function OSF_EventDispatch$getEventHandlerCount(eventType) {
				return this._eventHandlers[eventType] !=undefined ? this._eventHandlers[eventType].length : -1;
			},
			fireEvent: function OSF_EventDispatch$fireEvent(eventArgs) {
				if( eventArgs.type==undefined )
					return false;
				var eventType=eventArgs.type;
				if( eventType && this._eventHandlers[eventType] ) {
					var eventHandlers=this._eventHandlers[eventType];
					for(var handler in eventHandlers)
						eventHandlers[handler](eventArgs);
					return true;
				} else {
					return false;
				}
			},
			fireOrQueueEvent: function OSF_EventDispatch$fireOrQueueEvent(eventArgs) {
				var eventType=eventArgs.type;
				if (eventType && this._eventHandlers[eventType]) {
					var eventHandlers=this._eventHandlers[eventType];
					var queuedEvents=this._queuedEventsArgs[eventType];
					if (eventHandlers.length==0) {
						queuedEvents.push(eventArgs);
					} else {
						this.fireEvent(eventArgs)
					}
					return true;
				} else {
					return false;
				}
			},
			fireQueuedEvent: function OSF_EventDispatch$queueEvent(eventType) {
				if (eventType && this._eventHandlers[eventType]) {
					var eventHandlers=this._eventHandlers[eventType];
					var queuedEvents=this._queuedEventsArgs[eventType];
					if (eventHandlers.length > 0) {
						var eventHandler=eventHandlers[0];
						while (queuedEvents.length > 0) {
							var eventArgs=queuedEvents.shift();
							eventHandler(eventArgs);
						}
						return true;
					}
				}
				return false;
			}
		};
		OSF.DDA.DataCoercion=(function OSF_DDA_DataCoercion() {
			return {
				findArrayDimensionality: function OSF_DDA_DataCoercion$findArrayDimensionality(obj) {
					if(OSF.OUtil.isArray(obj)) {
						var dim=0;
						for(var index=0; index < obj.length; index++) {
							dim=Math.max(dim, OSF.DDA.DataCoercion.findArrayDimensionality(obj[index]));
						}
						return dim+1;
					}
					else {
						return 0;
					}
				},
				getCoercionDefaultForBinding: function OSF_DDA_DataCoercion$getCoercionDefaultForBinding(bindingType) {
					switch(bindingType) {
						case Microsoft.Office.WebExtension.BindingType.Matrix: return Microsoft.Office.WebExtension.CoercionType.Matrix;
						case Microsoft.Office.WebExtension.BindingType.Table: return Microsoft.Office.WebExtension.CoercionType.Table;
						case Microsoft.Office.WebExtension.BindingType.Text:
						default:
							return Microsoft.Office.WebExtension.CoercionType.Text;
					}
				},
				getBindingDefaultForCoercion: function OSF_DDA_DataCoercion$getBindingDefaultForCoercion(coercionType) {
					switch(coercionType) {
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
					if(data==null || data==undefined)
						return null;
					var sourceType=null;
					var runtimeType=typeof data;
					if(data.rows !==undefined) {
						sourceType=Microsoft.Office.WebExtension.CoercionType.Table;
					} else if(OSF.OUtil.isArray(data)) {
						sourceType=Microsoft.Office.WebExtension.CoercionType.Matrix;
					} else if(runtimeType=="string" || runtimeType=="number" || runtimeType=="boolean" || OSF.OUtil.isDate(data)) {
						sourceType=Microsoft.Office.WebExtension.CoercionType.Text;
					} else {
						throw OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedDataObject;
					}
					return sourceType;
				},
				coerceData: function OSF_DDA_DataCoercion$coerceData(data, destinationType, sourceType) {
					sourceType=sourceType || OSF.DDA.DataCoercion.determineCoercionType(data);
					if( sourceType && sourceType !=destinationType ) {
						OSF.OUtil.writeProfilerMark(OSF.InternalPerfMarker.DataCoercionBegin);
						data=OSF.DDA.DataCoercion._coerceDataFromTable(
							destinationType,
							OSF.DDA.DataCoercion._coerceDataToTable(data, sourceType)
						);
						OSF.OUtil.writeProfilerMark(OSF.InternalPerfMarker.DataCoercionEnd);
					}
					return data;
				},
				_matrixToText: function OSF_DDA_DataCoercion$_matrixToText(matrix) {
					if (matrix.length==1 && matrix[0].length==1)
						return ""+matrix[0][0];
					var val="";
					for (var i=0; i < matrix.length; i++) {
						val+=matrix[i].join("\t")+"\n";
					}
					return val.substring(0, val.length - 1);
				},
				_textToMatrix: function OSF_DDA_DataCoercion$_textToMatrix(text) {
					var ret=text.split("\n");
					for (var i=0; i < ret.length; i++)
						ret[i]=ret[i].split("\t");
					return ret;
				},
				_tableToText: function OSF_DDA_DataCoercion$_tableToText(table) {
					var headers="";
					if(table.headers !=null) {
						headers=OSF.DDA.DataCoercion._matrixToText([table.headers])+"\n";
					}
					var rows=OSF.DDA.DataCoercion._matrixToText(table.rows);
					if(rows=="") {
						headers=headers.substring(0, headers.length - 1);
					}
					return headers+rows;
				},
				_tableToMatrix: function OSF_DDA_DataCoercion$_tableToMatrix(table) {
					var matrix=table.rows;
					if(table.headers !=null) {
						matrix.unshift(table.headers);
					}
					return matrix;
				},
				_coerceDataFromTable: function OSF_DDA_DataCoercion$_coerceDataFromTable(coercionType, table) {
					var value;
					switch(coercionType) {
						case Microsoft.Office.WebExtension.CoercionType.Table:
							value=table;
							break;
						case Microsoft.Office.WebExtension.CoercionType.Matrix:
							value=OSF.DDA.DataCoercion._tableToMatrix(table);
							break;
						case Microsoft.Office.WebExtension.CoercionType.SlideRange:
							try {
								var items=OSF.DDA.DataCoercion._tableToText(table);
								value=new OSF.DDA.SlideRange(items);
							}
							catch (e) {
								value=OSF.DDA.DataCoercion._tableToText(table);
							}
							break;
						case Microsoft.Office.WebExtension.CoercionType.Text:
						case Microsoft.Office.WebExtension.CoercionType.Html:
						case Microsoft.Office.WebExtension.CoercionType.Ooxml:
						default:
							value=OSF.DDA.DataCoercion._tableToText(table);
							break;
					}
					return value;
				},
				_coerceDataToTable: function OSF_DDA_DataCoercion$_coerceDataToTable(data, sourceType) {
					if( sourceType==undefined ) {
						sourceType=OSF.DDA.DataCoercion.determineCoercionType(data);
					}
					var value;
					switch(sourceType) {
						case Microsoft.Office.WebExtension.CoercionType.Table:
							value=data;
							break;
						case Microsoft.Office.WebExtension.CoercionType.Matrix:
							value=new Microsoft.Office.WebExtension.TableData(data);
							break;
						case Microsoft.Office.WebExtension.CoercionType.Text:
						case Microsoft.Office.WebExtension.CoercionType.Html:
						case Microsoft.Office.WebExtension.CoercionType.Ooxml:
						default:
							value=new Microsoft.Office.WebExtension.TableData(OSF.DDA.DataCoercion._textToMatrix(data));
							break;
					}
					return value;
				}
			};
		})();
		OSF.DDA.issueAsyncResult=function OSF_DDA$IssueAsyncResult(callArgs, status, payload) {
			var callback=callArgs[Microsoft.Office.WebExtension.Parameters.Callback];
			if(callback) {
				var asyncInitArgs={};
				asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Context]=callArgs[Microsoft.Office.WebExtension.Parameters.AsyncContext];
				var errorArgs;
				if(status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
					asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Value]=payload;
				}
				else {
					errorArgs={};
					payload=payload || OSF.DDA.ErrorCodeManager.getErrorArgs(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
					errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]=status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
					errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=payload.name||payload;
					errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=payload.message||payload;
				}
				callback(new OSF.DDA.AsyncResult(asyncInitArgs, errorArgs));
			}
		};
		OSF.DDA.generateBindingId=function OSF_DDA$GenerateBindingId() {
			return "UnnamedBinding_"+OSF.OUtil.getUniqueId()+"_"+new Date().getTime();
		};
		OSF.DDA.SettingsManager={
			SerializedSettings: "serializedSettings",
			DateJSONPrefix : "Date(",
			DataJSONSuffix : ")",
			serializeSettings: function OSF_DDA_SettingsManager$serializeSettings(settingsCollection) {
				var ret={};
				for(var key in settingsCollection) {
					var value=settingsCollection[key];
					try {
						if(JSON) {
							value=JSON.stringify(value, function dateReplacer(k, v) {
								return OSF.OUtil.isDate(this[k]) ? OSF.DDA.SettingsManager.DateJSONPrefix+this[k].getTime()+OSF.DDA.SettingsManager.DataJSONSuffix : v;
							});
						}
						else {
							value=Sys.Serialization.JavaScriptSerializer.serialize(value);
						}
						ret[key]=value;
					}
					catch(ex) {
					}
				}
				return ret;
			},
			deserializeSettings: function OSF_DDA_SettingsManager$deserializeSettings(serializedSettings) {
				var ret={};
				serializedSettings=serializedSettings || {};
				for(var key in serializedSettings) {
					var value=serializedSettings[key];
					try {
						if(JSON) {
							value=JSON.parse(value, function dateReviver(k, v) {
								var d;
								if (typeof v==='string' && v && v.length > 6 && v.slice(0, 5)===OSF.DDA.SettingsManager.DateJSONPrefix && v.slice(-1)===OSF.DDA.SettingsManager.DataJSONSuffix) {
									d=new Date(parseInt(v.slice(5, -1)));
									if (d) {
										return d;
									}
								}
								return v;
							});
						}
						else {
							value=Sys.Serialization.JavaScriptSerializer.deserialize(value, true);
						}
						ret[key]=value;
					}
					catch(ex) {
					}
				}
				return ret;
			}
		};
		OSF.DDA.OMFactory={
			manufactureBinding: function OSF_DDA_OMFactory$manufactureBinding(bindingProperties, containingDocument) {
				var id=bindingProperties[OSF.DDA.BindingProperties.Id];
				var rows=bindingProperties[OSF.DDA.BindingProperties.RowCount];
				var cols=bindingProperties[OSF.DDA.BindingProperties.ColumnCount];
				var hasHeaders=bindingProperties[OSF.DDA.BindingProperties.HasHeaders];
				var binding;
				switch(bindingProperties[OSF.DDA.BindingProperties.Type]) {
					case Microsoft.Office.WebExtension.BindingType.Text:
						binding=new OSF.DDA.TextBinding(
							id,
							containingDocument
						);
						break;
					case Microsoft.Office.WebExtension.BindingType.Matrix:
						binding=new OSF.DDA.MatrixBinding(
							id,
							containingDocument,
							rows,
							cols
						);
						break;
					case Microsoft.Office.WebExtension.BindingType.Table:
						var isExcelApp=function () {
							return (OSF.DDA.ExcelDocument)
								&& (Microsoft.Office.WebExtension.context.document)
								&& (Microsoft.Office.WebExtension.context.document instanceof OSF.DDA.ExcelDocument);
						};
						var tableBindingObject;
						if (isExcelApp() && OSF.DDA.ExcelTableBinding) {
							tableBindingObject=OSF.DDA.ExcelTableBinding;
						}
						else {
							tableBindingObject=OSF.DDA.TableBinding;
						}
						binding=new tableBindingObject(
							id,
							containingDocument,
							rows,
							cols,
							hasHeaders
						);
						break;
					default:
						binding=new OSF.DDA.UnknownBinding(id, containingDocument);
				}
				return binding;
			},
			manufactureTableData: function OSF_DDA_OMFactory$manufactureTableData(tableDataProperties) {
				return new Microsoft.Office.WebExtension.TableData(
					tableDataProperties[OSF.DDA.TableDataProperties.TableRows],
					tableDataProperties[OSF.DDA.TableDataProperties.TableHeaders]
				);
			},
			manufactureDataNode: function OSF_DDA_OMFactory$manufactureDataNode(nodeProperties) {
				if(nodeProperties) {
					return new OSF.DDA.CustomXmlNode(
						nodeProperties[OSF.DDA.DataNodeProperties.Handle],
						nodeProperties[OSF.DDA.DataNodeProperties.NodeType],
						nodeProperties[OSF.DDA.DataNodeProperties.NamespaceUri],
						nodeProperties[OSF.DDA.DataNodeProperties.BaseName]
					);
				}
			},
			manufactureDataPart: function OSF_DDA_OMFactory$manufactureDataPart(partProperties, containingCustomXmlParts) {
				return new OSF.DDA.CustomXmlPart(
					containingCustomXmlParts,
					partProperties[OSF.DDA.DataPartProperties.Id],
					partProperties[OSF.DDA.DataPartProperties.BuiltIn]
				);
			},
			manufactureEventArgs: function OSF_DDA_OMFactory$manufactureEventArgs(eventType, target, eventProperties) {
				var args;
				switch (eventType) {
					case Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged:
						args=new OSF.DDA.DocumentSelectionChangedEventArgs(target);
						break;
					case Microsoft.Office.WebExtension.EventType.BindingSelectionChanged:
						args=new OSF.DDA.BindingSelectionChangedEventArgs(
							this.manufactureBinding(eventProperties, target.document),
							eventProperties[OSF.DDA.PropertyDescriptors.Subset]
						);
						break;
					case Microsoft.Office.WebExtension.EventType.BindingDataChanged:
						args=new OSF.DDA.BindingDataChangedEventArgs(this.manufactureBinding(eventProperties, target.document));
						break;
					case Microsoft.Office.WebExtension.EventType.SettingsChanged:
						args=new OSF.DDA.SettingsChangedEventArgs(target);
						break;
					case Microsoft.Office.Internal.EventType.OfficeThemeChanged:
						args=new OSF.DDA.OfficeThemeChangedEventArgs(eventProperties);
						break;
					case Microsoft.Office.Internal.EventType.DocumentThemeChanged:
						args=new OSF.DDA.DocumentThemeChangedEventArgs(eventProperties);
						break;
					case Microsoft.Office.WebExtension.EventType.ActiveViewChanged:
						args=new OSF.DDA.ActiveViewChangedEventArgs(eventProperties);
						break;
					case Microsoft.Office.WebExtension.EventType.AppCommandInvoked:
						args=OSF.DDA.AppCommand.AppCommandInvokedEventArgs.create(eventProperties);
						break;
					case Microsoft.Office.WebExtension.EventType.DataNodeInserted:
						args=new OSF.DDA.NodeInsertedEventArgs(
							this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NewNode]),
							eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]
						);
						break;
					case Microsoft.Office.WebExtension.EventType.DataNodeReplaced:
						args=new OSF.DDA.NodeReplacedEventArgs(
							this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.OldNode]),
							this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NewNode]),
							eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]
						);
						break;
					case Microsoft.Office.WebExtension.EventType.DataNodeDeleted:
						args=new OSF.DDA.NodeDeletedEventArgs(
							this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.OldNode]),
							this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NextSiblingNode]),
							eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]
						);
						break;
					case Microsoft.Office.WebExtension.EventType.TaskSelectionChanged:
						args=new OSF.DDA.TaskSelectionChangedEventArgs(target);
						break;
					case Microsoft.Office.WebExtension.EventType.ResourceSelectionChanged:
						args=new OSF.DDA.ResourceSelectionChangedEventArgs(target);
						break;
					case Microsoft.Office.WebExtension.EventType.ViewSelectionChanged:
						args=new OSF.DDA.ViewSelectionChangedEventArgs(target);
						break;
					case Microsoft.Office.WebExtension.EventType.DialogMessageReceived:
						args=new OSF.DDA.DialogEventArgs(eventProperties);
						break;
					default:
						throw OsfMsAjaxFactory.msAjaxError.argument(Microsoft.Office.WebExtension.Parameters.EventType, OSF.OUtil.formatString(Strings.OfficeOM.L_NotSupportedEventType, eventType));
				}
				return args;
			}
		};
		OSF.DDA.UI={};
		OSF.DDA.UI.ParentUI=function OSF_DDA_ParentUI() {
			var eventDispatch=new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.DialogMessageReceived, Microsoft.Office.WebExtension.EventType.DialogEventReceived]);
			var openDialogName=OSF.DDA.AsyncMethodNames.DisplayDialogAsync.displayName;
			var target=this;
			if (!target[openDialogName]) {
				OSF.OUtil.defineEnumerableProperty(target, openDialogName, {
					value: function () {
						var openDialog=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.OpenDialog];
						openDialog(arguments, eventDispatch, target);
					}
				});
			}
			OSF.OUtil.finalizeProperties(this);
		};
		OSF.DDA.UI.ChildUI=function OSF_DDA_ChildUI() {
			var messageParentName=OSF.DDA.SyncMethodNames.MessageParent.displayName;
			var target=this;
			if (!target[messageParentName]) {
				OSF.OUtil.defineEnumerableProperty(target, messageParentName, {
					value: function () {
						var messageParent=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.MessageParent];
						return messageParent(arguments, target);
					}
				});
			}
			OSF.OUtil.finalizeProperties(this);
		};
		OSF.DialogHandler=function OSF_DialogHandler() {};
		OSF.DDA.DialogEventArgs=function OSF_DDA_DialogEventArgs(message) {
			if (message[OSF.DDA.PropertyDescriptors.MessageType]==OSF.DialogMessageType.DialogMessageReceived) {
				OSF.OUtil.defineEnumerableProperties(this, {
					"type": {
						value: Microsoft.Office.WebExtension.EventType.DialogMessageReceived
					},
					"message": {
						value: message[OSF.DDA.PropertyDescriptors.MessageContent]
					}
				});
			} else {
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
		OSF.DDA.ListType=(function () {
			var listTypes={};
			listTypes[OSF.DDA.ListDescriptors.BindingList]=OSF.DDA.PropertyDescriptors.BindingProperties;
			listTypes[OSF.DDA.ListDescriptors.DataPartList]=OSF.DDA.PropertyDescriptors.DataPartProperties;
			listTypes[OSF.DDA.ListDescriptors.DataNodeList]=OSF.DDA.PropertyDescriptors.DataNodeProperties;
			return {
				isListType: function OSF_DDA_ListType$IsListType(t) { return OSF.OUtil.listContainsKey(listTypes, t); },
				getDescriptor: function OSF_DDA_ListType$getDescriptor(t) { return listTypes[t]; }
			};
		})();
		OSF.DDA.ApiMethodCall=function OSF_DDA_ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName) {
			var requiredCount=requiredParameters.length;
			var getInvalidParameterString=OSF.OUtil.delayExecutionAndCache(function () {
				return OSF.OUtil.formatString(Strings.OfficeOM.L_InvalidParameters, displayName);
			});
			this.verifyArguments=function OSF_DDA_ApiMethodCall$VerifyArguments(params, args) {
				for (var name in params) {
					var param=params[name];
					var arg=args[name];
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
			this.extractRequiredArguments=function OSF_DDA_ApiMethodCall$ExtractRequiredArguments(userArgs, caller, stateInfo) {
				if (userArgs.length < requiredCount) {
					throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_MissingRequiredArguments);
				}
				var requiredArgs=[];
				var index;
				for (index=0; index < requiredCount; index++) {
					requiredArgs.push(userArgs[index]);
				}
				this.verifyArguments(requiredParameters, requiredArgs);
				var ret={};
				for (index=0; index < requiredCount; index++) {
					var param=requiredParameters[index];
					var arg=requiredArgs[index];
					if (param.verify) {
						var isValid=param.verify(arg, caller, stateInfo);
						if (!isValid) {
							throw getInvalidParameterString();
						}
					}
					ret[param.name]=arg;
				}
				return ret;
			};
			this.fillOptions=function OSF_DDA_ApiMethodCall$FillOptions(options, requiredArgs, caller, stateInfo) {
				options=options || {};
				for (var optionName in supportedOptions) {
					if (!OSF.OUtil.listContainsKey(options, optionName)) {
						var value=undefined;
						var option=supportedOptions[optionName];
						if (option.calculate && requiredArgs) {
							value=option.calculate(requiredArgs, caller, stateInfo);
						}
						if (!value && option.defaultValue !==undefined) {
							value=option.defaultValue;
						}
						options[optionName]=value;
					}
				}
				return options;
			};
			this.constructCallArgs=function OSF_DAA_ApiMethodCall$ConstructCallArgs(required, options, caller, stateInfo) {
				var callArgs={};
				for (var r in required) {
					callArgs[r]=required[r];
				}
				for (var o in options) {
					callArgs[o]=options[o];
				}
				for (var s in privateStateCallbacks) {
					callArgs[s]=privateStateCallbacks[s](caller, stateInfo);
				}
				if (checkCallArgs) {
					callArgs=checkCallArgs(callArgs, caller, stateInfo);
				}
				return callArgs;
			};
		};
		OSF.DDA.AsyncMethodCall=function OSF_DDA_AsyncMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, onSucceeded, onFailed, checkCallArgs, displayName) {
			var requiredCount=requiredParameters.length;
			var apiMethods=new OSF.DDA.ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName);
			function OSF_DAA_AsyncMethodCall$ExtractOptions(userArgs, requiredArgs, theCaller, stateInfo) {
				if(userArgs.length > requiredCount+2) {
					throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyArguments);
				}
				var options, parameterCallback;
				for(var i=userArgs.length - 1; i >=requiredCount; i--) {
					var argument=userArgs[i];
					switch(typeof argument) {
						case "object":
							if(options) {
								throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalObjects);
							}
							else {
								options=argument;
							}
							break;
						case "function":
							if(parameterCallback) {
								throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalFunction);
							}
							else {
								parameterCallback=argument;
							}
							break;
						default:
							throw OsfMsAjaxFactory.msAjaxError.argument(Strings.OfficeOM.L_InValidOptionalArgument);
							break;
					}
				}
				options=apiMethods.fillOptions(options, requiredArgs, theCaller, stateInfo);
				if(parameterCallback) {
					if (options[Microsoft.Office.WebExtension.Parameters.Callback]) {
						throw Strings.OfficeOM.L_RedundantCallbackSpecification;
					}
					else {
						options[Microsoft.Office.WebExtension.Parameters.Callback]=parameterCallback;
					}
				}
				apiMethods.verifyArguments(supportedOptions, options);
				return options;
			};
			this.verifyAndExtractCall=function OSF_DAA_AsyncMethodCall$VerifyAndExtractCall(userArgs, theCaller, stateInfo) {
				var required=apiMethods.extractRequiredArguments(userArgs, theCaller, stateInfo);
				var options=OSF_DAA_AsyncMethodCall$ExtractOptions(userArgs, required, theCaller, stateInfo);
				var callArgs=apiMethods.constructCallArgs(required, options, theCaller, stateInfo);
				return callArgs;
			};
			this.processResponse=function OSF_DAA_AsyncMethodCall$ProcessResponse(status, response, theCaller, callArgs) {
				var payload;
				if(status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
					if(onSucceeded) {
						payload=onSucceeded(response, theCaller, callArgs);
					}
					else {
						payload=response;
					}
				}
				else {
					if(onFailed) {
						payload=onFailed(status, response);
					} else {
						payload=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
					}
				}
				return payload;
			};
			this.getCallArgs=function(suppliedArgs) {
				var options, parameterCallback;
				for(var i=suppliedArgs.length - 1; i >=requiredCount; i--) {
					var argument=suppliedArgs[i];
					switch(typeof argument) {
						case "object":
								options=argument;
							break;
						case "function":
								parameterCallback=argument;
							break;
					}
				}
				options=options || {};
				if(parameterCallback) {
					options[Microsoft.Office.WebExtension.Parameters.Callback]=parameterCallback;
				}
				return options;
			};
		};
		OSF.DDA.SyncMethodCall=function OSF_DDA_SyncMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName) {
			var requiredCount=requiredParameters.length;
			var apiMethods=new OSF.DDA.ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName);
			function OSF_DAA_SyncMethodCall$ExtractOptions(userArgs, requiredArgs, caller, stateInfo) {
				if (userArgs.length > requiredCount+1) {
					throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyArguments);
				}
				var options, parameterCallback;
				for (var i=userArgs.length - 1; i >=requiredCount; i--) {
					var argument=userArgs[i];
					switch (typeof argument) {
						case "object":
							if (options) {
								throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalObjects);
							}
							else {
								options=argument;
							}
							break;
						default:
							throw OsfMsAjaxFactory.msAjaxError.argument(Strings.OfficeOM.L_InValidOptionalArgument);
							break;
					}
				}
				options=apiMethods.fillOptions(options, requiredArgs, caller, stateInfo);
				apiMethods.verifyArguments(supportedOptions, options);
				return options;
			};
			this.verifyAndExtractCall=function OSF_DAA_AsyncMethodCall$VerifyAndExtractCall(userArgs, caller, stateInfo) {
				var required=apiMethods.extractRequiredArguments(userArgs, caller, stateInfo);
				var options=OSF_DAA_SyncMethodCall$ExtractOptions(userArgs, required, caller, stateInfo);
				var callArgs=apiMethods.constructCallArgs(required, options, caller, stateInfo);
				return callArgs;
			};
		};
		OSF.DDA.ConvertToDocumentTheme=function OSF_DDA_ConvertToDocumentTheme(response) {
			var mappingDocumentTheme=[
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
			var result={};
			for (var i=0; i < mappingDocumentTheme.length; i++) {
				if (mappingDocumentTheme[i].needToConvertToHex) {
					result[mappingDocumentTheme[i].name]=OSF.OUtil.convertIntToHex(response[mappingDocumentTheme[i].name]);
				}
				else
				{
					result[mappingDocumentTheme[i].name]=response[mappingDocumentTheme[i].name]
				}
			}
			return result;
		}
		OSF.DDA.ConvertToOfficeTheme=function OSF_DDA_ConvertToOfficeTheme(response) {
			var result={};
			for (var key in response) {
				result[key]=OSF.OUtil.convertIntToHex(response[key]);
			}
			return result;
		}
		OSF.DDA.AsyncMethodNames={}
		OSF.DDA.AsyncMethodNames.addNames=function(methodNames) {
			for(var entry in methodNames) {
				var am={};
				OSF.OUtil.defineEnumerableProperties(am, {
					"id": {
						value: entry
					},
					"displayName": {
						value: methodNames[entry]
					}
				});
				OSF.DDA.AsyncMethodNames[entry]=am;
			}
		};
		OSF.DDA.AsyncMethodNames.addNames({
				GoToByIdAsync: "goToByIdAsync",
				GetSelectedDataAsync: "getSelectedDataAsync",
				SetSelectedDataAsync: "setSelectedDataAsync",
				GetDocumentCopyAsync: "getFileAsync",
				GetDocumentCopyChunkAsync: "getSliceAsync",
				ReleaseDocumentCopyAsync: "closeAsync",
				GetFilePropertiesAsync: "getFilePropertiesAsync",
				AddFromSelectionAsync: "addFromSelectionAsync",
				AddFromPromptAsync: "addFromPromptAsync",
				AddFromNamedItemAsync: "addFromNamedItemAsync",
				GetAllAsync: "getAllAsync",
				GetByIdAsync: "getByIdAsync",
				ReleaseByIdAsync: "releaseByIdAsync",
				GetDataAsync: "getDataAsync",
				SetDataAsync: "setDataAsync",
				AddRowsAsync: "addRowsAsync",
				AddColumnsAsync: "addColumnsAsync",
				DeleteAllDataValuesAsync: "deleteAllDataValuesAsync",
				ClearFormatsAsync: "clearFormatsAsync",
				SetTableOptionsAsync: "setTableOptionsAsync",
				SetFormatsAsync:"setFormatsAsync",
				RefreshAsync: "refreshAsync",
				SaveAsync: "saveAsync",
				AddHandlerAsync: "addHandlerAsync",
				RemoveHandlerAsync: "removeHandlerAsync",
				GetActiveViewAsync: "getActiveViewAsync",
				AppCommandInvocationCompletedAsync: "appCommandInvocationCompletedAsync",
				AddDataPartAsync: "addAsync",
				GetDataPartByIdAsync: "getByIdAsync",
				GetDataPartsByNameSpaceAsync: "getByNamespaceAsync",
				DeleteDataPartAsync: "deleteAsync",
				GetPartNodesAsync: "getNodesAsync",
				GetPartXmlAsync: "getXmlAsync",
				AddDataPartNamespaceAsync: "addNamespaceAsync",
				GetDataPartNamespaceAsync: "getNamespaceAsync",
				GetDataPartPrefixAsync: "getPrefixAsync",
				GetRelativeNodesAsync: "getNodesAsync",
				GetNodeValueAsync: "getNodeValueAsync",
				GetNodeXmlAsync: "getXmlAsync",
				SetNodeValueAsync: "setNodeValueAsync",
				SetNodeXmlAsync: "setXmlAsync",
				GetNodeTextAsync: "getTextAsync",
				SetNodeTextAsync: "setTextAsync",
				GetOfficeThemeAsync: "getOfficeThemeAsync",
				GetDocumentThemeAsync: "getDocumentThemeAsync",
				GetSelectedTask:        "getSelectedTaskAsync",
				GetTask:                "getTaskAsync",
				GetWSSUrl:              "getWSSUrlAsync",
				GetTaskField:           "getTaskFieldAsync",
				GetSelectedResource:    "getSelectedResourceAsync",
				GetResourceField:       "getResourceFieldAsync",
				GetProjectField:        "getProjectFieldAsync",
				GetSelectedView:        "getSelectedViewAsync",
				DisplayDialogAsync:		"displayDialogAsync",
				CloseAsync:				"close"
		});
		OSF.DDA.SyncMethodNames={};
		OSF.DDA.SyncMethodNames.addNames=function(methodNames) {
			for (var entry in methodNames) {
				var am={};
				OSF.OUtil.defineEnumerableProperties(am, {
					"id": {
						value: entry
					},
					"displayName": {
						value: methodNames[entry]
					}
				});
				OSF.DDA.SyncMethodNames[entry]=am;
			}
		};
		OSF.DDA.SyncMethodNames.addNames({
			MessageParent: "messageParent",
			AddMessageHandler: "addEventHandler"
		});
		OSF.DDA.AsyncMethodCallFactory=(function() {
			function createObject(properties) {
				var obj=null;
				if(properties) {
					obj={};
					var len=properties.length;
					for(var i=0 ; i < len; i++) {
						obj[properties[i].name]=properties[i].value;
					}
				}
				return obj;
			}
			return {
				manufacture: function(params) {
					var supportedOptions=params.supportedOptions ? createObject(params.supportedOptions) : [];
					var privateStateCallbacks=params.privateStateCallbacks ? createObject(params.privateStateCallbacks) : [];
					return new OSF.DDA.AsyncMethodCall(
						params.requiredArguments || [],
						supportedOptions,
						privateStateCallbacks,
						params.onSucceeded,
						params.onFailed,
						params.checkCallArgs,
						params.method.displayName
					);
				}
			};
		})();
		OSF.DDA.SyncMethodCallFactory=(function() {
			function createObject(properties) {
				var obj=null;
				if(properties) {
					obj={};
					var len=properties.length;
					for(var i=0 ; i < len; i++) {
						obj[properties[i].name]=properties[i].value;
					}
				}
				return obj;
			}
			return {
				manufacture: function(params) {
					var supportedOptions=params.supportedOptions ? createObject(params.supportedOptions) : [];
					return new OSF.DDA.SyncMethodCall(
						params.requiredArguments || [],
						supportedOptions,
						params.privateStateCallbacks,
						params.checkCallArgs,
						params.method.displayName
					);
				}
			};
		})();
		OSF.DDA.AsyncMethodCalls={};
		OSF.DDA.AsyncMethodCalls.define=function (callDefinition) {
			OSF.DDA.AsyncMethodCalls[callDefinition.method.id]=OSF.DDA.AsyncMethodCallFactory.manufacture(callDefinition);
		};
		(function() {
			function define(params) {
				OSF.DDA.AsyncMethodCalls.define(params);
			}
			function processData(dataDescriptor, theCaller, callArgs) {
				var data=dataDescriptor[Microsoft.Office.WebExtension.Parameters.Data];
				if(data && (data[OSF.DDA.TableDataProperties.TableRows] !=undefined || data[OSF.DDA.TableDataProperties.TableHeaders] !=undefined)) {
					data=OSF.DDA.OMFactory.manufactureTableData(data);
				}
				data=OSF.DDA.DataCoercion.coerceData(data, callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType]);
				return data==undefined ? null : data;
			}
			function processBinding(bindingDescriptor) {
				return OSF.DDA.OMFactory.manufactureBinding(bindingDescriptor, Microsoft.Office.WebExtension.context.document);
			}
			function processDataPart(dataPartDescriptor) {
				return OSF.DDA.OMFactory.manufactureDataPart(dataPartDescriptor, Microsoft.Office.WebExtension.context.document.customXmlParts);
			}
			function processDataNode(dataNodeDescriptor) {
				return OSF.DDA.OMFactory.manufactureDataNode(dataNodeDescriptor);
			}
			function getObjectId(obj) { return obj.id; }
			function getPartId(part, partId) { return partId; };
			function getNodeHandle(node, nodeHandle) { return nodeHandle; };
			define({
				method: OSF.DDA.AsyncMethodNames.GoToByIdAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Id,
						"types": ["string", "number"]
					},
					{
						"name": Microsoft.Office.WebExtension.Parameters.GoToType,
						"enum": Microsoft.Office.WebExtension.GoToType
					}
				],
				supportedOptions : [
					{
						name : Microsoft.Office.WebExtension.Parameters.SelectionMode,
						value : {
							"enum": Microsoft.Office.WebExtension.SelectionMode,
							"defaultValue": Microsoft.Office.WebExtension.SelectionMode.Default
						}
					}
				]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetSelectedDataAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.CoercionType,
						"enum": Microsoft.Office.WebExtension.CoercionType
					}
				],
				supportedOptions : [
					{
						name : Microsoft.Office.WebExtension.Parameters.ValueFormat,
						value : {
							"enum": Microsoft.Office.WebExtension.ValueFormat,
							"defaultValue": Microsoft.Office.WebExtension.ValueFormat.Unformatted
						}
					},
					{
						name : Microsoft.Office.WebExtension.Parameters.FilterType,
						value : {
							"enum": Microsoft.Office.WebExtension.FilterType,
							"defaultValue": Microsoft.Office.WebExtension.FilterType.All
						}
					}
				],
				privateStateCallbacks : [],
				onSucceeded : processData
			});
			define({
				method : OSF.DDA.AsyncMethodNames.SetSelectedDataAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Data,
						"types": ["string", "object", "number", "boolean"]
					}
				],
				supportedOptions : [
					{
						name : Microsoft.Office.WebExtension.Parameters.CoercionType,
						value : {
							"enum": Microsoft.Office.WebExtension.CoercionType,
							"calculate": function(requiredArgs) { return OSF.DDA.DataCoercion.determineCoercionType(requiredArgs[Microsoft.Office.WebExtension.Parameters.Data]); }
						}
					},
					{
						 name: Microsoft.Office.WebExtension.Parameters.CellFormat,
						 value: {
							 "types": ["object"],
							 "defaultValue": []
						 }
					 },
					 {
						 name: Microsoft.Office.WebExtension.Parameters.TableOptions,
						 value: {
							 "types": ["object"],
							 "defaultValue": []
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
				privateStateCallbacks : []
			});
			define({
				method: OSF.DDA.AsyncMethodNames.GetFilePropertiesAsync,
				onSucceeded: function (filePropertiesDescriptor, caller, callArgs) {
					return new Microsoft.Office.WebExtension.FileProperties(
						filePropertiesDescriptor
					);
				}
			});
			define({
				method: OSF.DDA.AsyncMethodNames.GetDocumentCopyAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.FileType,
						"enum": Microsoft.Office.WebExtension.FileType
					}
				],
				supportedOptions : [
					{
						name : Microsoft.Office.WebExtension.Parameters.SliceSize,
						value : {
							"types": ["number"],
							"defaultValue": 4 * 1024 * 1024
						}
					}
				],
				onSucceeded: function(fileDescriptor, theCaller, callArgs) {
					return new OSF.DDA.File(
						fileDescriptor[OSF.DDA.FileProperties.Handle],
						fileDescriptor[OSF.DDA.FileProperties.FileSize],
						callArgs[Microsoft.Office.WebExtension.Parameters.SliceSize]
					);
				}
			});
			define({
				method: OSF.DDA.AsyncMethodNames.GetDocumentCopyChunkAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.SliceIndex,
						"types": ["number"]
					}
				],
				privateStateCallbacks: [
					{
						name: OSF.DDA.FileProperties.Handle,
						value : function(theCaller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.Handle]; }
					},
					{
						name: OSF.DDA.FileProperties.SliceSize,
						value : function(theCaller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.SliceSize]; }
					}
				],
				checkCallArgs: function(callArgs, theCaller, stateInfo) {
					var index=callArgs[Microsoft.Office.WebExtension.Parameters.SliceIndex];
					if(index < 0 || index >=theCaller.sliceCount) {
						throw OSF.DDA.ErrorCodeManager.errorCodes.ooeIndexOutOfRange;
					}
					callArgs[OSF.DDA.FileSliceOffset]=parseInt(index * stateInfo[OSF.DDA.FileProperties.SliceSize]);
					return callArgs;
				},
				onSucceeded: function(sliceDescriptor, theCaller, callArgs) {
					var slice={};
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
			define({
				method: OSF.DDA.AsyncMethodNames.ReleaseDocumentCopyAsync,
				privateStateCallbacks: [
					{
						name: OSF.DDA.FileProperties.Handle,
						value : function(theCaller, stateInfo) { return stateInfo[OSF.DDA.FileProperties.Handle]; }
					}
				]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.AddFromSelectionAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.BindingType,
						"enum": Microsoft.Office.WebExtension.BindingType
					}
				],
				supportedOptions : [
					{
						name : Microsoft.Office.WebExtension.Parameters.Id,
						value : {
							"types": ["string"],
							"calculate": OSF.DDA.generateBindingId
						}
					}
				],
				privateStateCallbacks : [],
				onSucceeded : processBinding
			});
			define({
				method : OSF.DDA.AsyncMethodNames.AddFromPromptAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.BindingType,
						"enum": Microsoft.Office.WebExtension.BindingType
					}
				],
				supportedOptions : [
					{
						name : Microsoft.Office.WebExtension.Parameters.Id,
						value : {
							"types": ["string"],
							"calculate": OSF.DDA.generateBindingId
						}
					},
					{
						name : Microsoft.Office.WebExtension.Parameters.PromptText,
						value : {
							"types": ["string"],
							"calculate": function() { return Strings.OfficeOM.L_AddBindingFromPromptDefaultText; }
						}
					}
				],
				privateStateCallbacks : [],
				onSucceeded : processBinding
			});
			define({
				method: OSF.DDA.AsyncMethodNames.AddFromNamedItemAsync,
				requiredArguments: [
					{
						"name": Microsoft.Office.WebExtension.Parameters.ItemName,
						"types": ["string"]
					},
					{
						"name": Microsoft.Office.WebExtension.Parameters.BindingType,
						"enum": Microsoft.Office.WebExtension.BindingType
					}
				],
				supportedOptions : [
					{
						name : Microsoft.Office.WebExtension.Parameters.Id,
						value : {
							"types": ["string"],
							"calculate": OSF.DDA.generateBindingId
						}
					}
				],
				privateStateCallbacks : [
					{
						name: Microsoft.Office.WebExtension.Parameters.FailOnCollision,
						value : function() { return true; }
					}
				],
				onSucceeded: processBinding
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetAllAsync,
				requiredArguments : [],
				supportedOptions : [],
				privateStateCallbacks : [],
				onSucceeded : function(response) { return OSF.OUtil.mapList(response[OSF.DDA.ListDescriptors.BindingList], processBinding); }
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetByIdAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Id,
						"types": ["string"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [],
				onSucceeded : processBinding
			});
			define({
				method : OSF.DDA.AsyncMethodNames.ReleaseByIdAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Id,
						"types": ["string"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [],
				onSucceeded : function(response, theCaller, callArgs) {
					var id=callArgs[Microsoft.Office.WebExtension.Parameters.Id];
					delete theCaller._eventDispatches[id];
				}
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetDataAsync,
				requiredArguments : [],
				supportedOptions : [
					{
						name : Microsoft.Office.WebExtension.Parameters.CoercionType,
						value : {
							"enum": Microsoft.Office.WebExtension.CoercionType,
							"calculate": function(requiredArgs, binding) { return OSF.DDA.DataCoercion.getCoercionDefaultForBinding(binding.type); }
						}
					},
					{
						name : Microsoft.Office.WebExtension.Parameters.ValueFormat,
						value : {
							"enum": Microsoft.Office.WebExtension.ValueFormat,
							"defaultValue": Microsoft.Office.WebExtension.ValueFormat.Unformatted
						}
					},
					{
						name : Microsoft.Office.WebExtension.Parameters.FilterType,
						value : {
							"enum": Microsoft.Office.WebExtension.FilterType,
							"defaultValue": Microsoft.Office.WebExtension.FilterType.All
						}
					},
					{
						name : Microsoft.Office.WebExtension.Parameters.StartRow,
						value : {
							"types": ["number"],
							"defaultValue": 0
						}
					},
					{
						name : Microsoft.Office.WebExtension.Parameters.StartColumn,
						value : {
							"types": ["number"],
							"defaultValue": 0
						}
					},
					{
						name : Microsoft.Office.WebExtension.Parameters.RowCount,
						value : {
							"types": ["number"],
							"defaultValue": 0
						}
					},
					{
						name : Microsoft.Office.WebExtension.Parameters.ColumnCount,
						value : {
							"types": ["number"],
							"defaultValue": 0
						}
					}
				],
				checkCallArgs : function(callArgs, theCaller, stateInfo) {
					if(callArgs[Microsoft.Office.WebExtension.Parameters.StartRow]==0 &&
						callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn]==0 &&
						callArgs[Microsoft.Office.WebExtension.Parameters.RowCount]==0 &&
						callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount]==0) {
							delete callArgs[Microsoft.Office.WebExtension.Parameters.StartRow];
							delete callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn];
							delete callArgs[Microsoft.Office.WebExtension.Parameters.RowCount];
							delete callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount];
					}
					if(callArgs[Microsoft.Office.WebExtension.Parameters.CoercionType] !=OSF.DDA.DataCoercion.getCoercionDefaultForBinding(theCaller.type) &&
						(callArgs[Microsoft.Office.WebExtension.Parameters.StartRow] ||
						callArgs[Microsoft.Office.WebExtension.Parameters.StartColumn] ||
						callArgs[Microsoft.Office.WebExtension.Parameters.RowCount] ||
						callArgs[Microsoft.Office.WebExtension.Parameters.ColumnCount]) ) {
						throw OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding;
					}
					return callArgs;
				},
				privateStateCallbacks : [
					{
						name : Microsoft.Office.WebExtension.Parameters.Id,
						value : getObjectId
					}
				],
				onSucceeded : processData
			});
			define({
				method : OSF.DDA.AsyncMethodNames.SetDataAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Data,
						"types": ["string", "object", "number", "boolean"]
					}
				],
				supportedOptions : [
					{
						name : Microsoft.Office.WebExtension.Parameters.CoercionType,
						value : {
							"enum": Microsoft.Office.WebExtension.CoercionType,
							"calculate": function(requiredArgs) { return OSF.DDA.DataCoercion.determineCoercionType(requiredArgs[Microsoft.Office.WebExtension.Parameters.Data]); }
						}
					},
					{
						name : Microsoft.Office.WebExtension.Parameters.StartRow,
						value : {
							"types": ["number"],
							"defaultValue": 0
						}
					},
					{
						name : Microsoft.Office.WebExtension.Parameters.StartColumn,
						value : {
							"types": ["number"],
							"defaultValue": 0
						}
					},
					{
						 name: Microsoft.Office.WebExtension.Parameters.CellFormat,
						 value: {
							 "types": ["object"],
							 "defaultValue": []
						 }
					 },
					 {
						 name: Microsoft.Office.WebExtension.Parameters.TableOptions,
						 value: {
							 "types": ["object"],
							 "defaultValue": []
						 }
					 }
				],
				checkCallArgs : function(callArgs, theCaller, stateInfo) {
					var Parameters=Microsoft.Office.WebExtension.Parameters;
					if (callArgs[Parameters.StartRow]==0 &&
						callArgs[Parameters.StartColumn]==0 &&
						OSF.OUtil.isArray(callArgs[Parameters.CellFormat]) && callArgs[Parameters.CellFormat].length===0 &&
						OSF.OUtil.isArray(callArgs[Parameters.TableOptions]) && callArgs[Parameters.TableOptions].length===0) {
							delete callArgs[Parameters.StartRow];
							delete callArgs[Parameters.StartColumn];
							delete callArgs[Parameters.CellFormat];
							delete callArgs[Parameters.TableOptions];
					}
					if (callArgs[Parameters.CoercionType] !=OSF.DDA.DataCoercion.getCoercionDefaultForBinding(theCaller.type) &&
						((callArgs[Parameters.StartRow] && callArgs[Parameters.StartRow] !=0) ||
						(callArgs[Parameters.StartColumn] && callArgs[Parameters.StartColumn] !=0) ||
						callArgs[Parameters.CellFormat] ||
						callArgs[Parameters.TableOptions])) {
						throw OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding;
					}
					return callArgs;
				},
				privateStateCallbacks : [
					{
						name : Microsoft.Office.WebExtension.Parameters.Id,
						value : getObjectId
					}
				]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.AddRowsAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Data,
						"types": ["object"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : Microsoft.Office.WebExtension.Parameters.Id,
						value : getObjectId
					}
				]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.AddColumnsAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Data,
						"types": ["object"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : Microsoft.Office.WebExtension.Parameters.Id,
						value : getObjectId
					}
				]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.DeleteAllDataValuesAsync,
				requiredArguments : [],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : Microsoft.Office.WebExtension.Parameters.Id,
						value : getObjectId
					}
				]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.ClearFormatsAsync,
				requiredArguments : [],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : Microsoft.Office.WebExtension.Parameters.Id,
						value : getObjectId
					}
				]
			});
			define({
				method: OSF.DDA.AsyncMethodNames.SetTableOptionsAsync,
				requiredArguments: [
					{
						"name": Microsoft.Office.WebExtension.Parameters.TableOptions,
						"defaultValue" : []
					}
				],
				privateStateCallbacks : [
					{
						name : Microsoft.Office.WebExtension.Parameters.Id,
						value : getObjectId
					}
				]
			});
			define({
				method: OSF.DDA.AsyncMethodNames.SetFormatsAsync,
				requiredArguments: [
					{
						"name": Microsoft.Office.WebExtension.Parameters.CellFormat,
						"defaultValue": []
					}
				],
				privateStateCallbacks : [
					{
						name : Microsoft.Office.WebExtension.Parameters.Id,
						value : getObjectId
					}
				]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.RefreshAsync,
				requiredArguments : [],
				supportedOptions : [],
				privateStateCallbacks : [],
				onSucceeded : function deserializeSettings(serializedSettingsDescriptor, refreshingSettings) {
					var serializedSettings=serializedSettingsDescriptor[OSF.DDA.SettingsManager.SerializedSettings];
					var newSettings=OSF.DDA.SettingsManager.deserializeSettings(serializedSettings);
					return newSettings;
				}
			});
			define({
				method : OSF.DDA.AsyncMethodNames.SaveAsync,
				requiredArguments : [],
				supportedOptions : [
					{
						name : Microsoft.Office.WebExtension.Parameters.OverwriteIfStale,
						value : {
							"types": ["boolean"],
							"defaultValue": true
						}
					}
				],
				privateStateCallbacks : [
					{
						name : OSF.DDA.SettingsManager.SerializedSettings,
						value : function serializeSettings(settingsInstance, settingsCollection) {
							return OSF.DDA.SettingsManager.serializeSettings(settingsCollection);
						}
					}
				]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.AddHandlerAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.EventType,
						"enum": Microsoft.Office.WebExtension.EventType,
						"verify": function(eventType, theCaller, eventDispatch) { return eventDispatch.supportsEvent(eventType); }
					},
					{
						"name": Microsoft.Office.WebExtension.Parameters.Handler,
						"types": ["function"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : []
			});
			define({
				method : OSF.DDA.AsyncMethodNames.RemoveHandlerAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.EventType,
						"enum": Microsoft.Office.WebExtension.EventType,
						"verify": function(eventType, theCaller, eventDispatch) { return eventDispatch.supportsEvent(eventType); }
					}
				],
				supportedOptions : [
					{
						name: Microsoft.Office.WebExtension.Parameters.Handler,
						value: {
							"types": ["function"],
							"defaultValue": null
						}
					}
				],
				privateStateCallbacks : []
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetDocumentThemeAsync,
				requiredArguments : [],
				supportedOptions : [],
				privateStateCallbacks : [],
				onSucceeded : OSF.DDA.ConvertToDocumentTheme
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetOfficeThemeAsync,
				requiredArguments : [],
				supportedOptions : [],
				privateStateCallbacks : [],
				onSucceeded : OSF.DDA.ConvertToOfficeTheme
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetActiveViewAsync,
				requiredArguments : [],
				supportedOptions : [],
				privateStateCallbacks : [],
				onSucceeded : function (response) {
					var data=response[Microsoft.Office.WebExtension.Parameters.ActiveView];
					return data==undefined ? null : data;
				}
			});
			define({
				method : OSF.DDA.AsyncMethodNames.AddDataPartAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Xml,
						"types": ["string"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [],
				onSucceeded : processDataPart
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetDataPartByIdAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Id,
						"types": ["string"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [],
				onSucceeded : processDataPart
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetDataPartsByNameSpaceAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Namespace,
						"types": ["string"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [],
				onSucceeded : function(response) { return OSF.OUtil.mapList(response[OSF.DDA.ListDescriptors.DataPartList], processDataPart); }
			});
			define({
				method : OSF.DDA.AsyncMethodNames.DeleteDataPartAsync,
				requiredArguments : [],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : OSF.DDA.DataPartProperties.Id,
						value : getObjectId
					}
				]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetPartNodesAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.XPath,
						"types": ["string"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : OSF.DDA.DataPartProperties.Id,
						value : getObjectId
					}
				],
				onSucceeded : function(response) { return OSF.OUtil.mapList(response[OSF.DDA.ListDescriptors.DataNodeList], processDataNode); }
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetPartXmlAsync,
				requiredArguments : [],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : OSF.DDA.DataPartProperties.Id,
						value : getObjectId
					}
				],
				onSucceeded : processData
			});
			define({
				method : OSF.DDA.AsyncMethodNames.AddDataPartNamespaceAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Prefix,
						"types": ["string"]
					},
					{
						"name": Microsoft.Office.WebExtension.Parameters.Namespace,
						"types": ["string"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : OSF.DDA.DataPartProperties.Id,
						value : getPartId
					}
				]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetDataPartNamespaceAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Prefix,
						"types": ["string"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : OSF.DDA.DataPartProperties.Id,
						value : getPartId
					}
				],
				onSucceeded : processData
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetDataPartPrefixAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Namespace,
						"types": ["string"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : OSF.DDA.DataPartProperties.Id,
						value : getPartId
					}
				],
				onSucceeded : processData
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetRelativeNodesAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.XPath,
						"types": ["string"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : OSF.DDA.DataNodeProperties.Handle,
						value : getNodeHandle
					}
				],
				onSucceeded : function(response) { return OSF.OUtil.mapList(response[OSF.DDA.ListDescriptors.DataNodeList], processDataNode); }
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetNodeValueAsync,
				requiredArguments : [],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : OSF.DDA.DataNodeProperties.Handle,
						value : getNodeHandle
					}
				],
				onSucceeded : processData
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetNodeXmlAsync,
				requiredArguments : [],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : OSF.DDA.DataNodeProperties.Handle,
						value : getNodeHandle
					}
				],
				onSucceeded : processData
			});
			define({
				method : OSF.DDA.AsyncMethodNames.SetNodeValueAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Data,
						"types": ["string"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : OSF.DDA.DataNodeProperties.Handle,
						value : getNodeHandle
					}
				]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.SetNodeXmlAsync,
				requiredArguments : [
					{
						"name": Microsoft.Office.WebExtension.Parameters.Xml,
						"types": ["string"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : OSF.DDA.DataNodeProperties.Handle,
						value : getNodeHandle
					}
				]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetNodeTextAsync,
				requiredArguments : [],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : OSF.DDA.DataNodeProperties.Handle,
						value : getNodeHandle
					}
				],
				onSucceeded : processData
			});
			define({
				method : OSF.DDA.AsyncMethodNames.SetNodeTextAsync,
				requiredArguments : [
					{
						"name" : Microsoft.Office.WebExtension.Parameters.Text,
						"types" : ["string"]
					}
				],
				supportedOptions : [],
				privateStateCallbacks : [
					{
						name : OSF.DDA.DataNodeProperties.Handle,
						value : getNodeHandle
					}
				]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetSelectedTask,
				onSucceeded: function(taskIdDescriptor) { return taskIdDescriptor[Microsoft.Office.WebExtension.Parameters.TaskId]; }
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetTask,
				requiredArguments : [
					{
						name: Microsoft.Office.WebExtension.Parameters.TaskId,
						types: ["string"]
					}
				]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetTaskField,
				requiredArguments : [
					{
						name: Microsoft.Office.WebExtension.Parameters.TaskId,
						types: ["string"]
					},
					{   name: Microsoft.Office.WebExtension.Parameters.FieldId,
						types: ["number"]
					}],
				supportedOptions : [
					{
						name : Microsoft.Office.WebExtension.Parameters.GetRawValue,
						value : {
							"types": ["boolean"],
							"defaultValue": false
						}
					}]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetResourceField,
				requiredArguments : [
					{
						name: Microsoft.Office.WebExtension.Parameters.ResourceId,
						types: ["string"]
					},
					{   name: Microsoft.Office.WebExtension.Parameters.FieldId,
						types: ["number"]
					}],
				supportedOptions : [
					{
						name : Microsoft.Office.WebExtension.Parameters.GetRawValue,
						value : {
							"types": ["boolean"],
							"defaultValue": false
						}
					}]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetProjectField,
				requiredArguments : [
					{   name: Microsoft.Office.WebExtension.Parameters.FieldId,
						types: ["number"]
					}
				],
				supportedOptions : [
					{
						name : Microsoft.Office.WebExtension.Parameters.GetRawValue,
						value : {
							"types": ["boolean"],
							"defaultValue": false
						}
					}]
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetSelectedResource,
				onSucceeded: function(resIdDescriptor) { return resIdDescriptor[Microsoft.Office.WebExtension.Parameters.ResourceId]; }
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetWSSUrl
			});
			define({
				method : OSF.DDA.AsyncMethodNames.GetSelectedView
			});
			define({
				method: OSF.DDA.AsyncMethodNames.DisplayDialogAsync,
				requiredArguments : [
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
						name: Microsoft.Office.WebExtension.Parameters.XFrameDenySafe,
						value: {
							"types": ["boolean"],
							"defaultValue": true
						}
					}
				],
				privateStateCallbacks: [],
				onSucceeded: function (args, caller, callArgs) {
					var targetId=args[Microsoft.Office.WebExtension.Parameters.Id];
					var eventDispatch=args[Microsoft.Office.WebExtension.Parameters.Data];
					var dialog=new OSF.DialogHandler();
					var closeDialog=OSF.DDA.AsyncMethodNames.CloseAsync.displayName;
					OSF.OUtil.defineEnumerableProperty(dialog, closeDialog, {
						value: function () {
							var closeDialogfunction=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.CloseDialog];
							closeDialogfunction(arguments, targetId, eventDispatch, dialog);
						}
					});
					var addHandler=OSF.DDA.SyncMethodNames.AddMessageHandler.displayName;
					OSF.OUtil.defineEnumerableProperty(dialog, addHandler, {
						value: function () {
							var syncMethodCall=OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.AddMessageHandler.id];
							var callArgs=syncMethodCall.verifyAndExtractCall(arguments, dialog, eventDispatch);
							var eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
							var handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
							return eventDispatch.addEventHandlerAndFireQueuedEvent(eventType, handler);
						}
					});
					return dialog;
				},
				checkCallArgs: function (callArgs, caller, stateInfo) {
					if (callArgs[Microsoft.Office.WebExtension.Parameters.Width] <=0) {
						callArgs[Microsoft.Office.WebExtension.Parameters.Width]=1;
					}
					if (callArgs[Microsoft.Office.WebExtension.Parameters.Width] > 100) {
						callArgs[Microsoft.Office.WebExtension.Parameters.Width]=99;
					}
					if (callArgs[Microsoft.Office.WebExtension.Parameters.Height] <=0) {
						callArgs[Microsoft.Office.WebExtension.Parameters.Height]=1;
					}
					if (callArgs[Microsoft.Office.WebExtension.Parameters.Height] > 100) {
						callArgs[Microsoft.Office.WebExtension.Parameters.Height]=99;
					}
					return callArgs;
				}
			});
			define({
				method: OSF.DDA.AsyncMethodNames.CloseAsync,
				requiredArguments: [],
				supportedOptions: [],
				privateStateCallbacks: []
			});
		})();
		OSF.DDA.SyncMethodCalls={};
		OSF.DDA.SyncMethodCalls.define=function(callDefinition) {
			OSF.DDA.SyncMethodCalls[callDefinition.method.id]=OSF.DDA.SyncMethodCallFactory.manufacture(callDefinition);
		};
		(function() {
			OSF.DDA.SyncMethodCalls.define({
				method: OSF.DDA.SyncMethodNames.MessageParent,
				requiredArguments: [
					{
						"name": Microsoft.Office.WebExtension.Parameters.MessageToParent,
						"types": ["string","number","boolean"]
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
		})();
		OSF.DDA.HostParameterMap=function (specialProcessor, mappings) {
			var toHostMap="toHost";
			var fromHostMap="fromHost";
			var self="self";
			var dynamicTypes={};
			dynamicTypes[Microsoft.Office.WebExtension.Parameters.Data]={
				toHost: function(data) {
					if(data.rows !==undefined) {
						var tableData={};
						tableData[OSF.DDA.TableDataProperties.TableRows]=data.rows;
						tableData[OSF.DDA.TableDataProperties.TableHeaders]=data.headers;
						data=tableData;
					}
					return data;
				},
				fromHost: function(args) {
					return args;
				}
			};
			function mapValues(preimageSet, mapping) {
				var ret=preimageSet ? {} : undefined;
				for (var entry in preimageSet) {
					var preimage=preimageSet[entry];
					var image;
					if(OSF.DDA.ListType.isListType(entry)) {
						image=[];
						for(var subEntry in preimage) {
							image.push(mapValues(preimage[subEntry], mapping));
						}
					}
					else if(OSF.OUtil.listContainsKey(dynamicTypes, entry)) {
						image=dynamicTypes[entry][mapping](preimage);
					}
					else if(mapping==fromHostMap && specialProcessor.preserveNesting(entry)) {
						image=mapValues(preimage, mapping);
					}
					else {
						var maps=mappings[entry];
						if (maps) {
							var map=maps[mapping];
							if(map) {
								image=map[preimage];
								if(image===undefined) {
									image=preimage;
								}
							}
						}
						else {
							image=preimage;
						}
					}
					ret[entry]=image;
				}
				return ret;
			};
			function generateArguments(imageSet, parameters) {
				var ret;
				for (var param in parameters) {
					var arg;
					if (specialProcessor.isComplexType(param)) {
						arg=generateArguments(imageSet, mappings[param][toHostMap]);
					}
					else {
						arg=imageSet[param];
					}
					if(arg !=undefined) {
						if(!ret) {
							ret={};
						}
						var index=parameters[param];
						if(index==self) {
							index=param;
						}
						ret[index]=specialProcessor.pack(param, arg);
					}
				}
				return ret;
			};
			function extractArguments(source, parameters, extracted) {
				if(!extracted) {
					extracted={};
				}
				for(var param in parameters) {
					var index=parameters[param];
					var value;
					if(index==self) {
						value=source;
					}
					else {
						value=source[index];
					}
					if(value===null || value===undefined) {
						extracted[param]=undefined;
					}
					else {
						value=specialProcessor.unpack(param, value);
						var map;
						if(specialProcessor.isComplexType(param)) {
							map=mappings[param][fromHostMap];
							if(specialProcessor.preserveNesting(param)) {
								extracted[param]=extractArguments(value, map);
							}
							else {
								extractArguments(value, map, extracted);
							}
						}
						else {
							if(OSF.DDA.ListType.isListType(param)) {
								map={};
								var entryDescriptor=OSF.DDA.ListType.getDescriptor(param);
								map[entryDescriptor]=self;
								for(var item in value) {
									value[item]=extractArguments(value[item], map);
								}
							}
							extracted[param]=value;
						}
					}
				}
				return extracted;
			};
			function applyMap(mapName, preimage, mapping) {
				var parameters=mappings[mapName][mapping];
				var image;
				if(mapping=="toHost") {
					var imageSet=mapValues(preimage, mapping);
					image=generateArguments(imageSet, parameters);
				}
				else if(mapping=="fromHost") {
					var argumentSet=extractArguments(preimage, parameters);
					image=mapValues(argumentSet, mapping);
				}
				return image;
			};
			if (!mappings) {
				mappings={};
			}
			this.setMapping=function (mapName, description) {
				var toHost, fromHost;
				if(description.map) {
					toHost=description.map;
					fromHost={};
					for (var preimage in toHost) {
						var image=toHost[preimage];
						if(image==self) {
							image=preimage;
						}
						fromHost[image]=preimage;
					}
				}
				else {
					toHost=description.toHost;
					fromHost=description.fromHost;
				}
				var pair=mappings[mapName]={};
				pair[toHostMap]=toHost;
				pair[fromHostMap]=fromHost;
			};
			this.toHost=function (mapName, preimage) { return applyMap(mapName, preimage, toHostMap); };
			this.fromHost=function (mapName, image) { return applyMap(mapName, image, fromHostMap); };
			this.self=self;
			this.dynamicTypes=dynamicTypes;
			this.mapValues=mapValues;
			this.specialProcessorDynamicTypes=specialProcessor.dynamicTypes;
		};
		OSF.DDA.SpecialProcessor=function (complexTypes, dynamicTypes) {
			this.sharedComplexType=[
				OSF.DDA.EventDispId.dispidDialogMessageReceivedEvent,
				OSF.DDA.EventDescriptors.DialogMessageReceivedEvent
			];
			this.isComplexType=function OSF_DDA_SpecialProcessor$isComplexType(t) {
				return OSF.OUtil.listContainsValue(this.sharedComplexType, t)
					||OSF.OUtil.listContainsValue(complexTypes, t);
			};
			this.isDynamicType=function OSF_DDA_SpecialProcessor$isDynamicType(p) {
				return OSF.OUtil.listContainsKey(dynamicTypes, p);
			};
			this.preserveNesting=function OSF_DDA_SpecialProcessor$preserveNesting(p) {
				var pn=[
					OSF.DDA.PropertyDescriptors.Subset,
					OSF.DDA.DataNodeEventProperties.OldNode,
					OSF.DDA.DataNodeEventProperties.NewNode,
					OSF.DDA.DataNodeEventProperties.NextSiblingNode
				];
				return OSF.OUtil.listContainsValue(pn, p);
			};
			this.pack=function OSF_DDA_SpecialProcessor$pack(param, arg) {
				var value;
				if (this.isDynamicType(param)) {
					value=dynamicTypes[param].toHost(arg);
				}
				else {
					value=arg;
				}
				return value;
			};
			this.unpack=function OSF_DDA_SpecialProcessor$unpack(param, arg) {
				var value;
				if (this.isDynamicType(param)) {
					value=dynamicTypes[param].fromHost(arg);
				}
				else {
					value=arg;
				}
				return value;
			};
		};
		OSF.DDA.DispIdHost.Facade=function OSF_DDA_DispIdHost_Facade(getDelegateMethods, parameterMap) {
			var dispIdMap={};
			var jsom=OSF.DDA.AsyncMethodNames;
			var did=OSF.DDA.MethodDispId;
			dispIdMap[jsom.GoToByIdAsync.id]=did.dispidNavigateToMethod;
			dispIdMap[jsom.GetSelectedDataAsync.id]=did.dispidGetSelectedDataMethod;
			dispIdMap[jsom.SetSelectedDataAsync.id]=did.dispidSetSelectedDataMethod;
			dispIdMap[jsom.GetDocumentCopyChunkAsync.id]=did.dispidGetDocumentCopyChunkMethod;
			dispIdMap[jsom.ReleaseDocumentCopyAsync.id]=did.dispidReleaseDocumentCopyMethod;
			dispIdMap[jsom.GetDocumentCopyAsync.id]=did.dispidGetDocumentCopyMethod;
			dispIdMap[jsom.AddFromSelectionAsync.id]=did.dispidAddBindingFromSelectionMethod;
			dispIdMap[jsom.AddFromPromptAsync.id]=did.dispidAddBindingFromPromptMethod;
			dispIdMap[jsom.AddFromNamedItemAsync.id]=did.dispidAddBindingFromNamedItemMethod;
			dispIdMap[jsom.GetAllAsync.id]=did.dispidGetAllBindingsMethod;
			dispIdMap[jsom.GetByIdAsync.id]=did.dispidGetBindingMethod;
			dispIdMap[jsom.ReleaseByIdAsync.id]=did.dispidReleaseBindingMethod;
			dispIdMap[jsom.GetDataAsync.id]=did.dispidGetBindingDataMethod;
			dispIdMap[jsom.SetDataAsync.id]=did.dispidSetBindingDataMethod;
			dispIdMap[jsom.GetFilePropertiesAsync.id]=did.dispidGetFilePropertiesMethod;
			dispIdMap[jsom.AddRowsAsync.id]=did.dispidAddRowsMethod;
			dispIdMap[jsom.AddColumnsAsync.id]=did.dispidAddColumnsMethod;
			dispIdMap[jsom.DeleteAllDataValuesAsync.id]=did.dispidClearAllRowsMethod;
			dispIdMap[jsom.ClearFormatsAsync.id]=did.dispidClearFormatsMethod;
			dispIdMap[jsom.RefreshAsync.id]=did.dispidLoadSettingsMethod;
			dispIdMap[jsom.SaveAsync.id]=did.dispidSaveSettingsMethod;
			dispIdMap[jsom.SetTableOptionsAsync.id]=did.dispidSetTableOptionsMethod;
			dispIdMap[jsom.SetFormatsAsync.id]=did.dispidSetFormatsMethod;
			dispIdMap[jsom.GetActiveViewAsync.id]=did.dispidGetActiveViewMethod;
			dispIdMap[jsom.AppCommandInvocationCompletedAsync.id]=did.dispidAppCommandInvocationCompletedMethod;
			dispIdMap[jsom.AddDataPartAsync.id]=did.dispidAddDataPartMethod;
			dispIdMap[jsom.GetDataPartByIdAsync.id]=did.dispidGetDataPartByIdMethod;
			dispIdMap[jsom.GetDataPartsByNameSpaceAsync.id]=did.dispidGetDataPartsByNamespaceMethod;
			dispIdMap[jsom.GetPartXmlAsync.id]=did.dispidGetDataPartXmlMethod;
			dispIdMap[jsom.GetPartNodesAsync.id]=did.dispidGetDataPartNodesMethod;
			dispIdMap[jsom.DeleteDataPartAsync.id]=did.dispidDeleteDataPartMethod;
			dispIdMap[jsom.GetNodeValueAsync.id]=did.dispidGetDataNodeValueMethod;
			dispIdMap[jsom.GetNodeXmlAsync.id]=did.dispidGetDataNodeXmlMethod;
			dispIdMap[jsom.GetRelativeNodesAsync.id]=did.dispidGetDataNodesMethod;
			dispIdMap[jsom.SetNodeValueAsync.id]=did.dispidSetDataNodeValueMethod;
			dispIdMap[jsom.SetNodeXmlAsync.id]=did.dispidSetDataNodeXmlMethod;
			dispIdMap[jsom.AddDataPartNamespaceAsync.id]=did.dispidAddDataNamespaceMethod;
			dispIdMap[jsom.GetDataPartNamespaceAsync.id]=did.dispidGetDataUriByPrefixMethod;
			dispIdMap[jsom.GetDataPartPrefixAsync.id]=did.dispidGetDataPrefixByUriMethod;
			dispIdMap[jsom.GetNodeTextAsync.id]=did.dispidGetDataNodeTextMethod;
			dispIdMap[jsom.SetNodeTextAsync.id]=did.dispidSetDataNodeTextMethod;
			dispIdMap[jsom.GetDocumentThemeAsync.id]=did.dispidGetDocumentThemeMethod;
			dispIdMap[jsom.GetOfficeThemeAsync.id]=did.dispidGetOfficeThemeMethod;
			dispIdMap[jsom.GetSelectedTask.id]=did.dispidGetSelectedTaskMethod;
			dispIdMap[jsom.GetTask.id]=did.dispidGetTaskMethod;
			dispIdMap[jsom.GetWSSUrl.id]=did.dispidGetWSSUrlMethod;
			dispIdMap[jsom.GetTaskField.id]=did.dispidGetTaskFieldMethod;
			dispIdMap[jsom.GetSelectedResource.id]=did.dispidGetSelectedResourceMethod;
			dispIdMap[jsom.GetResourceField.id]=did.dispidGetResourceFieldMethod;
			dispIdMap[jsom.GetProjectField.id]=did.dispidGetProjectFieldMethod;
			dispIdMap[jsom.GetSelectedView.id]=did.dispidGetSelectedViewMethod;
			jsom=Microsoft.Office.WebExtension.EventType;
			did=OSF.DDA.EventDispId;
			dispIdMap[jsom.SettingsChanged]=did.dispidSettingsChangedEvent;
			dispIdMap[jsom.DocumentSelectionChanged]=did.dispidDocumentSelectionChangedEvent;
			dispIdMap[jsom.BindingSelectionChanged]=did.dispidBindingSelectionChangedEvent;
			dispIdMap[jsom.BindingDataChanged]=did.dispidBindingDataChangedEvent;
			dispIdMap[jsom.ActiveViewChanged]=did.dispidActiveViewChangedEvent;
			dispIdMap[jsom.DocumentThemeChanged]=did.dispidDocumentThemeChangedEvent;
			dispIdMap[jsom.OfficeThemeChanged]=did.dispidOfficeThemeChangedEvent;
			dispIdMap[jsom.DialogMessageReceived]=did.dispidDialogMessageReceivedEvent,
			dispIdMap[jsom.AppCommandInvoked]=did.dispidAppCommandInvokedEvent;
			dispIdMap[jsom.TaskSelectionChanged]=did.dispidTaskSelectionChangedEvent;
			dispIdMap[jsom.ResourceSelectionChanged]=did.dispidResourceSelectionChangedEvent;
			dispIdMap[jsom.ViewSelectionChanged]=did.dispidViewSelectionChangedEvent;
			dispIdMap[jsom.DataNodeInserted]=did.dispidDataNodeAddedEvent;
			dispIdMap[jsom.DataNodeReplaced]=did.dispidDataNodeReplacedEvent;
			dispIdMap[jsom.DataNodeDeleted]=did.dispidDataNodeDeletedEvent;
			function onException(ex, asyncMethodCall, suppliedArgs, callArgs) {
				if(typeof ex=="number") {
					if(!callArgs) {
						callArgs=asyncMethodCall.getCallArgs(suppliedArgs);
					}
					OSF.DDA.issueAsyncResult(callArgs, ex, OSF.DDA.ErrorCodeManager.getErrorArgs(ex));
				} else {
					throw ex;
				}
			};
			this[OSF.DDA.DispIdHost.Methods.InvokeMethod]=function OSF_DDA_DispIdHost_Facade$InvokeMethod(method, suppliedArguments, theCaller, privateState) {
				var callArgs;
				try {
					var methodName=method.id;
					var asyncMethodCall=OSF.DDA.AsyncMethodCalls[methodName];
					callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, theCaller, privateState);
					var dispId=dispIdMap[methodName];
					var delegate=getDelegateMethods(methodName);
					var hostCallArgs;
					if(parameterMap.toHost) {
						hostCallArgs=parameterMap.toHost(dispId, callArgs);
					}
					else {
						hostCallArgs=callArgs;
					}
					delegate[OSF.DDA.DispIdHost.Delegates.ExecuteAsync]({
						"dispId": dispId,
						"hostCallArgs": hostCallArgs,
						"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
						"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
						"onComplete": function(status, hostResponseArgs) {
							var responseArgs;
							if(status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
								if(parameterMap.fromHost) {
									responseArgs=parameterMap.fromHost(dispId, hostResponseArgs);
								}
								else {
									responseArgs=hostResponseArgs;
								}
							}
							else {
								responseArgs=hostResponseArgs;
							}
							var payload=asyncMethodCall.processResponse(status, responseArgs, theCaller, callArgs);
							OSF.DDA.issueAsyncResult(callArgs, status, payload);
						}
					});
				}
				catch(ex) {
					onException(ex, asyncMethodCall, suppliedArguments, callArgs);
				}
			};
			this[OSF.DDA.DispIdHost.Methods.AddEventHandler]=function OSF_DDA_DispIdHost_Facade$AddEventHandler(suppliedArguments, eventDispatch, theCaller) {
				var callArgs;
				var eventType, handler;
				function onEnsureRegistration(status) {
					if(status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
						var added=eventDispatch.addEventHandler(eventType, handler);
						if(!added) {
							status=OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerAdditionFailed;
						}
					}
					var error;
					if(status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
						error=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
					}
					OSF.DDA.issueAsyncResult(callArgs, status, error);
				}
				try {
					var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.AddHandlerAsync.id];
					callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, theCaller, eventDispatch);
					eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
					handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
					if(eventDispatch.getEventHandlerCount(eventType)==0) {
						var dispId=dispIdMap[eventType];
						var invoker=getDelegateMethods(eventType)[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync];
						invoker({
							"eventType": eventType,
							"dispId": dispId,
							"targetId": theCaller.id || "",
							"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
							"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
							"onComplete": onEnsureRegistration,
							"onEvent": function handleEvent(hostArgs) {
								var args=parameterMap.fromHost(dispId, hostArgs);
								eventDispatch.fireEvent(OSF.DDA.OMFactory.manufactureEventArgs(eventType, theCaller, args));
							}
						});
					}
					else {
						onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
					}
				}
				catch(ex) {
					onException(ex, asyncMethodCall, suppliedArguments, callArgs);
				}
			};
			this[OSF.DDA.DispIdHost.Methods.RemoveEventHandler]=function OSF_DDA_DispIdHost_Facade$RemoveEventHandler(suppliedArguments, eventDispatch, theCaller) {
				var callArgs;
				var eventType, handler;
				function onEnsureRegistration(status) {
					var error;
					if(status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
						error=OSF.DDA.ErrorCodeManager.getErrorArgs(OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerNotExist);
					}
					OSF.DDA.issueAsyncResult(callArgs, status, error);
				}
				try {
					var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.RemoveHandlerAsync.id];
					callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, theCaller, eventDispatch);
					eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
					handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
					var status;
					if(handler==null) {
						eventDispatch.clearEventHandlers(eventType);
						status=true;
					}
					else {
						if(!eventDispatch.hasEventHandler(eventType, handler)) {
							status=false;
						}
						else {
							status=eventDispatch.removeEventHandler(eventType, handler);
						}
					}
					if(eventDispatch.getEventHandlerCount(eventType)==0) {
						var dispId=dispIdMap[eventType];
						var invoker=getDelegateMethods(eventType)[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync];
						invoker({
							"eventType": eventType,
							"dispId": dispId,
							"targetId": theCaller.id || "",
							"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
							"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
							"onComplete": onEnsureRegistration
						});
					}
					else {
						onEnsureRegistration(status ? OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess : Strings.OfficeOM.L_EventRegistrationError);
					}
				}
				catch(ex) {
					onException(ex, asyncMethodCall, suppliedArguments, callArgs);
				}
			};
			this[OSF.DDA.DispIdHost.Methods.OpenDialog]=function OSF_DDA_DispIdHost_Facade$OpenDialog(suppliedArguments, eventDispatch, caller) {
				var callArgs;
				var dialogMessageEvent, dialogOtherEvent;
				var targetId;
				function onEnsureRegistration(status) {
					var payload;
					if (status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
						payload=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
					} else {
						var onSucceedArgs={};
						onSucceedArgs[Microsoft.Office.WebExtension.Parameters.Id]=targetId;
						onSucceedArgs[Microsoft.Office.WebExtension.Parameters.Data]=eventDispatch;
						var payload=asyncMethodCall.processResponse(status, onSucceedArgs, caller, callArgs);
					}
					OSF.DDA.issueAsyncResult(callArgs, status, payload);
				}
				try {
					dialogMessageEvent=Microsoft.Office.WebExtension.EventType.DialogMessageReceived;
					dialogOtherEvent=Microsoft.Office.WebExtension.EventType.DialogEventReceived;
					if (dialogMessageEvent==undefined || dialogOtherEvent==undefined) {
						onEnsureRegistration(OSF.DDA.ErrorCodeManager.ooeOperationNotSupported)
					}
					if (OSF.DDA.AsyncMethodNames.DisplayDialogAsync==null) {
						onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError)
						return;
					}
					var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.DisplayDialogAsync.id];
					callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
					eventDispatch.clearEventHandlers(dialogMessageEvent);
					eventDispatch.clearEventHandlers(dialogOtherEvent);
					var dispId=dispIdMap[dialogMessageEvent];
					var invoker=getDelegateMethods(dialogMessageEvent)[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync];
					targetId=callArgs[Microsoft.Office.WebExtension.Parameters.Url]
+">"+callArgs[Microsoft.Office.WebExtension.Parameters.Width]
+">"+callArgs[Microsoft.Office.WebExtension.Parameters.Height];
					invoker({
						"eventType": dialogMessageEvent,
						"dispId": dispId,
						"targetId": targetId,
						"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
						"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); },
						"onComplete": onEnsureRegistration,
						"onEvent": function handleEvent(hostArgs) {
							var args=parameterMap.fromHost(dispId, hostArgs);
							var event=OSF.DDA.OMFactory.manufactureEventArgs(dialogMessageEvent, caller, args);
							if (event.type==dialogOtherEvent) {
								var payload=OSF.DDA.ErrorCodeManager.getErrorArgs(event.error);
								var errorArgs={};
								errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]=status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
								errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=payload.name || payload;
								errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=payload.message || payload;
								event.error=new OSF.DDA.Error(errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message], errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]);
							}
							eventDispatch.fireOrQueueEvent(event);
							if (args[OSF.DDA.PropertyDescriptors.MessageType]==OSF.DialogMessageType.DialogClosed) {
								eventDispatch.clearEventHandlers(dialogMessageEvent);
								eventDispatch.clearEventHandlers(dialogOtherEvent);
							}
						}
					});
				}
				catch (ex) {
					onException(ex, asyncMethodCall, suppliedArguments, callArgs);
				}
			};
			this[OSF.DDA.DispIdHost.Methods.CloseDialog]=function OSF_DDA_DispIdHost_Facade$CloseDialog(suppliedArguments, targetId, eventDispatch, caller) {
				var callArgs;
				var dialogMessageEvent, dialogOtherEvent;
				var closeStatus=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess;
				function closeCallback(status) {
					closeStatus=status;
				}
				try {
					var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.CloseAsync.id];
					callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments, caller, eventDispatch);
					dialogMessageEvent=Microsoft.Office.WebExtension.EventType.DialogMessageReceived;
					dialogOtherEvent=Microsoft.Office.WebExtension.EventType.DialogEventReceived;
					eventDispatch.clearEventHandlers(dialogMessageEvent);
					eventDispatch.clearEventHandlers(dialogOtherEvent);
					var dispId=dispIdMap[dialogMessageEvent];
					var invoker=getDelegateMethods(dialogMessageEvent)[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync];
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
				if (closeStatus !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess) {
					throw OSF.OUtil.formatString(Strings.OfficeOM.L_FunctionCallFailed, OSF.DDA.AsyncMethodNames.CloseAsync.displayName, closeStatus);
				}
			};
			this[OSF.DDA.DispIdHost.Methods.MessageParent]=function OSF_DDA_DispIdHost_Facade$MessageParent(suppliedArguments, caller) {
				var stateInfo={};
				var syncMethodCall=OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.MessageParent.id];
				var callArgs=syncMethodCall.verifyAndExtractCall(suppliedArguments, caller, stateInfo);
				var delegate=getDelegateMethods(OSF.DDA.SyncMethodNames.MessageParent.id);
				var invoker=delegate[OSF.DDA.DispIdHost.Delegates.MessageParent];
				var dispId=dispIdMap[OSF.DDA.SyncMethodNames.MessageParent.id];
				return invoker({
					"dispId": dispId,
					"hostCallArgs": callArgs,
					"onCalling": function OSF_DDA_DispIdFacade$Execute_onCalling() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall); },
					"onReceiving": function OSF_DDA_DispIdFacade$Execute_onReceiving() { OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse); }
				});
			};
		};
		OSF.DDA.DispIdHost.addAsyncMethods=function OSF_DDA_DispIdHost$AddAsyncMethods(target, asyncMethodNames, privateState) {
			for(var entry in asyncMethodNames) {
				var method=asyncMethodNames[entry];
				var name=method.displayName;
				if(!target[name]) {
					OSF.OUtil.defineEnumerableProperty(target, name, {
						value:
							(function(asyncMethod) {
								return function() {
									var invokeMethod=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.InvokeMethod];
									invokeMethod(asyncMethod, arguments, target, privateState);
								};
							})(method)
					});
				}
			}
		};
		OSF.DDA.DispIdHost.addEventSupport=function OSF_DDA_DispIdHost$AddEventSupport(target, eventDispatch) {
			var add=OSF.DDA.AsyncMethodNames.AddHandlerAsync.displayName;
			var remove=OSF.DDA.AsyncMethodNames.RemoveHandlerAsync.displayName;
			if(!target[add]) {
				OSF.OUtil.defineEnumerableProperty(target, add, {
					value: function() {
						var addEventHandler=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.AddEventHandler];
						addEventHandler(arguments, eventDispatch, target);
					}
				});
			}
			if(!target[remove]) {
				OSF.OUtil.defineEnumerableProperty(target, remove, {
					value: function() {
						var removeEventHandler=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.RemoveEventHandler];
						removeEventHandler(arguments, eventDispatch, target);
					}
				});
			}
		};
		OSF.DDA.Context=function OSF_DDA_Context(officeAppContext, document, license, appOM) {
			OSF.OUtil.defineEnumerableProperties(this, {
				"contentLanguage": {
					value: officeAppContext.get_dataLocale()
				},
				"displayLanguage": {
					value: officeAppContext.get_appUILocale()
				}
			});
			if(license) {
				OSF.OUtil.defineEnumerableProperty(this, "license", {
					value: license
				});
			}
			if (officeAppContext.ui) {
				OSF.OUtil.defineEnumerableProperty(this, "ui", {
					value: officeAppContext.ui
				});
			}
			if (!officeAppContext.get_isDialog()) {
				if (document) {
					OSF.OUtil.defineEnumerableProperty(this, "document", {
						value: document
					});
				}
				if(appOM) {
					var displayName=appOM.displayName || "appOM";
					delete appOM.displayName;
					OSF.OUtil.defineEnumerableProperty(this, displayName, {
						value: appOM
					});
				}
				var requirements=OfficeExt.Requirement.RequirementsMatrixFactory.getDefaultRequirementMatrix(officeAppContext);
				OSF.OUtil.defineEnumerableProperty(this, "requirements", {
					value: requirements
				});
			}
		};
		OSF.DDA.OutlookContext=function OSF_DDA_OutlookContext(appContext, settings, license, appOM) {
			OSF.DDA.OutlookContext.uber.constructor.call(this, appContext, null, license, appOM);
			if(settings) {
				OSF.OUtil.defineEnumerableProperty(this, "roamingSettings", {
					value: settings
				});
			}
		};
		OSF.OUtil.extend(OSF.DDA.OutlookContext, OSF.DDA.Context);
		OSF.OUtil.defineEnumerableProperty(Microsoft.Office.WebExtension, "context", {
			get: function Microsoft_Office_WebExtension$GetContext() {
				var context;
				if (OSF && OSF._OfficeAppFactory) {
					context=OSF._OfficeAppFactory.getContext();
				}
				return context;
			}
		});
		Microsoft.Office.WebExtension.useShortNamespace=function Microsoft_Office_WebExtension_useShortNamespace(useShortcut) {
			if(useShortcut) {
				OSF.NamespaceManager.enableShortcut();
			} else {
				OSF.NamespaceManager.disableShortcut();
			}
		};
		Microsoft.Office.WebExtension.select=function Microsoft_Office_WebExtension_select(str, errorCallback) {
			var promise;
			if(str && typeof str=="string") {
				var index=str.indexOf("#");
				if(index !=-1) {
					var op=str.substring(0, index);
					var target=str.substring(index+1);
					switch(op) {
						case "binding":
						case "bindings":
							if(target) {
								promise=new OSF.DDA.BindingPromise(target);
							}
							break;
					}
				}
			}
			if(!promise) {
				if(errorCallback) {
					var callbackType=typeof errorCallback;
					if(callbackType=="function") {
						var callArgs={};
						callArgs[Microsoft.Office.WebExtension.Parameters.Callback]=errorCallback;
						OSF.DDA.issueAsyncResult(
							callArgs,
							OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext,
							OSF.DDA.ErrorCodeManager.getErrorArgs(OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext)
						);
					} else {
						throw OSF.OUtil.formatString(Strings.OfficeOM.L_CallbackNotAFunction, callbackType);
					}
				}
			} else {
				promise.onFail=errorCallback;
				return promise;
			}
		};
		OSF.DDA.BindingPromise=function OSF_DDA_BindingPromise(bindingId, errorCallback) {
			this._id=bindingId;
			OSF.OUtil.defineEnumerableProperty(this, "onFail", {
				get: function() {
					return errorCallback;
				},
				set: function(onError) {
					var t=typeof onError;
					if(t !="undefined" && t !="function") {
						throw OSF.OUtil.formatString(Strings.OfficeOM.L_CallbackNotAFunction, t);
					}
					errorCallback=onError;
				}
			});
		};
		OSF.DDA.BindingPromise.prototype={
			_fetch: function OSF_DDA_BindingPromise$_fetch(onComplete) {
				if(this.binding) {
					if(onComplete)
						onComplete(this.binding);
				} else {
					if(!this._binding) {
						var me=this;
						Microsoft.Office.WebExtension.context.document.bindings.getByIdAsync(this._id, function(asyncResult) {
							if(asyncResult.status==Microsoft.Office.WebExtension.AsyncResultStatus.Succeeded) {
								OSF.OUtil.defineEnumerableProperty(me, "binding", {
									value: asyncResult.value
								});
								if(onComplete)
									onComplete(me.binding);
							} else {
								if(me.onFail)
									me.onFail(asyncResult);
							}
						});
					}
				}
				return this;
			},
			getDataAsync: function OSF_DDA_BindingPromise$getDataAsync() {
				var args=arguments;
				this._fetch(function onComplete(binding) { binding.getDataAsync.apply(binding, args); });
				return this;
			},
			setDataAsync: function OSF_DDA_BindingPromise$setDataAsync() {
				var args=arguments;
				this._fetch(function onComplete(binding) { binding.setDataAsync.apply(binding, args); });
				return this;
			},
			addHandlerAsync: function OSF_DDA_BindingPromise$addHandlerAsync() {
				var args=arguments;
				this._fetch(function onComplete(binding) { binding.addHandlerAsync.apply(binding, args); });
				return this;
			},
			removeHandlerAsync: function OSF_DDA_BindingPromise$removeHandlerAsync() {
				var args=arguments;
				this._fetch(function onComplete(binding) { binding.removeHandlerAsync.apply(binding, args); });
				return this;
			},
			setTableOptionsAsync: function OSF_DDA_BindingPromise$setTableOptionsAsync() {
				var args=arguments;
				this._fetch(function onComplete(binding) { binding.setTableOptionsAsync.apply(binding, args); });
				return this;
			},
			setFormatsAsync: function OSF_DDA_BindingPromise$setFormatsAsync() {
				var args=arguments;
				this._fetch(function onComplete(binding) { binding.setFormatsAsync.apply(binding, args); });
				return this;
			},
			clearFormatsAsync: function OSF_DDA_BindingPromise$clearFormatsAsync() {
				var args=arguments;
				this._fetch(function onComplete(binding) { binding.clearFormatsAsync.apply(binding, args); });
				return this;
			}
		};
		OSF.DDA.License=function OSF_DDA_License(eToken) {
			OSF.OUtil.defineEnumerableProperty(this, "value", {
				value: eToken
			});
		};
		OSF.DDA.Settings=function OSF_DDA_Settings(settings) {
			settings=settings || {};
			OSF.OUtil.defineEnumerableProperties(this, {
				"get": {
					value: function OSF_DDA_Settings$get(name) {
						var e=Function._validateParams(arguments, [
							{ name: "name", type: String, mayBeNull: false }
						]);
						if (e) throw e;
						var setting=settings[name];
						return typeof(setting)==='undefined' ? null : setting;
					}
				},
				"set": {
					value: function OSF_DDA_Settings$set(name, value) {
						var e=Function._validateParams(arguments, [
							{ name: "name", type: String, mayBeNull: false },
							{ name: "value", mayBeNull: true }
						]);
						if (e) throw e;
						settings[name]=value;
					}
				},
				"remove": {
					value: function OSF_DDA_Settings$remove(name) {
						var e=Function._validateParams(arguments, [
							{ name: "name", type: String, mayBeNull: false }
						]);
						if (e) throw e;
						delete settings[name];
					}
				}
			});
			OSF.DDA.DispIdHost.addAsyncMethods(
				this,
				[OSF.DDA.AsyncMethodNames.SaveAsync],
				settings
			);
		};
		OSF.DDA.RefreshableSettings=function OSF_DDA_RefreshableSettings(settings) {
			OSF.DDA.RefreshableSettings.uber.constructor.call(this, settings);
			OSF.DDA.DispIdHost.addAsyncMethods(this,
				[OSF.DDA.AsyncMethodNames.RefreshAsync],
				settings
			);
			OSF.DDA.DispIdHost.addEventSupport(this, new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.SettingsChanged]));
		};
		OSF.OUtil.extend(OSF.DDA.RefreshableSettings, OSF.DDA.Settings);
		OSF.DDA.OutlookAppOm=function OSF_DDA_OutlookAppOm(appContext, window, appReady) {};
		OSF.DDA.Document=function OSF_DDA_Document(officeAppContext, settings) {
			var mode;
			switch(officeAppContext.get_clientMode()) {
				case OSF.ClientMode.ReadOnly: mode=Microsoft.Office.WebExtension.DocumentMode.ReadOnly; break;
				case OSF.ClientMode.ReadWrite: mode=Microsoft.Office.WebExtension.DocumentMode.ReadWrite; break;
			};
			if(settings) {
				OSF.OUtil.defineEnumerableProperty(this, "settings", {
					value: settings
				});
			};
			OSF.OUtil.defineMutableProperties(this, {
				"mode": {
					value: mode
				},
				"url": {
					value: officeAppContext.get_docUrl()
				}
			});
		};
		OSF.DDA.JsomDocument=function OSF_DDA_JsomDocument(officeAppContext, bindingFacade, settings) {
			OSF.DDA.JsomDocument.uber.constructor.call(this, officeAppContext, settings);
			OSF.OUtil.defineEnumerableProperty(this, "bindings", {
				get: function OSF_DDA_Document$GetBindings() { return bindingFacade; }
			});
			var am=OSF.DDA.AsyncMethodNames;
			OSF.DDA.DispIdHost.addAsyncMethods(this, [
				am.GetSelectedDataAsync,
				am.SetSelectedDataAsync
			]);
			OSF.DDA.DispIdHost.addEventSupport(this, new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged]));
		};
		OSF.OUtil.extend(OSF.DDA.JsomDocument, OSF.DDA.Document);
		OSF.DDA.BindingFacade=function OSF_DDA_BindingFacade(docInstance) {
			this._eventDispatches=[];
			OSF.OUtil.defineEnumerableProperty(this, "document", {
				value: docInstance
			});
			var am=OSF.DDA.AsyncMethodNames;
			OSF.DDA.DispIdHost.addAsyncMethods(this, [
				am.AddFromSelectionAsync,
				am.AddFromNamedItemAsync,
				am.GetAllAsync,
				am.GetByIdAsync,
				am.ReleaseByIdAsync
			]);
		};
		OSF.DDA.UnknownBinding=function OSF_DDA_UknonwnBinding(id, docInstance) {
			OSF.OUtil.defineEnumerableProperties(this, {
				"document": { value: docInstance },
				"id": { value: id }
			});
		};
		OSF.DDA.Binding=function OSF_DDA_Binding(id, docInstance) {
			OSF.OUtil.defineEnumerableProperties(this, {
				"document": {
					value: docInstance
				},
				"id": {
					value: id
				}
			});
			var am=OSF.DDA.AsyncMethodNames;
			OSF.DDA.DispIdHost.addAsyncMethods(this, [
				am.GetDataAsync,
				am.SetDataAsync
			]);
			var et=Microsoft.Office.WebExtension.EventType;
			var bindingEventDispatches=docInstance.bindings._eventDispatches;
			if(!bindingEventDispatches[id]) {
				bindingEventDispatches[id]=new OSF.EventDispatch([
					et.BindingSelectionChanged,
					et.BindingDataChanged
				]);
			}
			var eventDispatch=bindingEventDispatches[id];
			OSF.DDA.DispIdHost.addEventSupport(this, eventDispatch);
		};
		OSF.DDA.TextBinding=function OSF_DDA_TextBinding(id, docInstance) {
			OSF.DDA.TextBinding.uber.constructor.call(
				this,
				id,
				docInstance
			);
			OSF.OUtil.defineEnumerableProperty(this, "type", {
				value: Microsoft.Office.WebExtension.BindingType.Text
			});
		};
		OSF.OUtil.extend(OSF.DDA.TextBinding, OSF.DDA.Binding);
		OSF.DDA.MatrixBinding=function OSF_DDA_MatrixBinding(id, docInstance, rows, cols) {
			OSF.DDA.MatrixBinding.uber.constructor.call(
				this,
				id,
				docInstance
			);
			OSF.OUtil.defineEnumerableProperties(this, {
				"type": {
					value: Microsoft.Office.WebExtension.BindingType.Matrix
				},
				"rowCount": {
					value: rows ? rows : 0
				},
				"columnCount": {
					value: cols ? cols: 0
				}
			});
		};
		OSF.OUtil.extend(OSF.DDA.MatrixBinding, OSF.DDA.Binding);
		OSF.DDA.TableBinding=function OSF_DDA_TableBinding(id, docInstance, rows, cols, hasHeaders) {
			OSF.DDA.TableBinding.uber.constructor.call(
				this,
				id,
				docInstance
			);
			OSF.OUtil.defineEnumerableProperties(this, {
				"type": {
					value: Microsoft.Office.WebExtension.BindingType.Table
				},
				"rowCount": {
					value: rows ? rows : 0
				},
				"columnCount": {
					value: cols ? cols: 0
				},
				"hasHeaders": {
					value: hasHeaders ? hasHeaders : false
				}
			});
			var am=OSF.DDA.AsyncMethodNames;
			OSF.DDA.DispIdHost.addAsyncMethods(this, [
				am.AddRowsAsync,
				am.AddColumnsAsync,
				am.DeleteAllDataValuesAsync
			]);
		};
		OSF.OUtil.extend(OSF.DDA.TableBinding, OSF.DDA.Binding);
		Microsoft.Office.WebExtension.TableData=function Microsoft_Office_WebExtension_TableData(rows, headers) {
			function fixData(data) {
				if(data==null || data==undefined) {
					return null;
				}
				try {
					for(var dim=OSF.DDA.DataCoercion.findArrayDimensionality(data, 2); dim < 2; dim++) {
						data=[data];
					}
					return data;
				}
				catch(ex) {
				}
			};
			OSF.OUtil.defineEnumerableProperties(this, {
				"headers": {
					get: function() { return headers; },
					set: function(value) {
						headers=fixData(value);
					}
				},
				"rows": {
					get: function() { return rows; },
					set: function(value) {
						rows=(   value==null || ( OSF.OUtil.isArray(value) && ( value.length==0 ) ) ) ?
								[] :
								fixData(value);
					}
				}
			});
			this.headers=headers;
			this.rows=rows;
		};
		Microsoft.Office.WebExtension.FileProperties=function Microsoft_Office_WebExtension_FileProperties(filePropertiesDescriptor) {
			OSF.OUtil.defineEnumerableProperties(this, {
				"url": {
					value: filePropertiesDescriptor[OSF.DDA.FilePropertiesDescriptor.Url]
				}
			});
		};
		OSF.DDA.Error=function OSF_DDA_Error(name, message, code) {
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
		OSF.DDA.AsyncResult=function OSF_DDA_AsyncResult(initArgs, errorArgs) {
			OSF.OUtil.defineEnumerableProperties(this, {
				"value": {
					value: initArgs[OSF.DDA.AsyncResultEnum.Properties.Value]
				},
				"status": {
					value: errorArgs ? Microsoft.Office.WebExtension.AsyncResultStatus.Failed : Microsoft.Office.WebExtension.AsyncResultStatus.Succeeded
				}
			});
			if(initArgs[OSF.DDA.AsyncResultEnum.Properties.Context]) {
				OSF.OUtil.defineEnumerableProperty(this, "asyncContext", {
					value: initArgs[OSF.DDA.AsyncResultEnum.Properties.Context]
				});
			}
			if(errorArgs) {
				OSF.OUtil.defineEnumerableProperty(this, "error", {
					value: new OSF.DDA.Error(
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name],
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message],
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]
					)
				});
			}
		};
		OSF.DDA.DocumentSelectionChangedEventArgs=function OSF_DDA_DocumentSelectionChangedEventArgs(docInstance) {
			OSF.OUtil.defineEnumerableProperties(this, {
				"type": {
					value: Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged
				},
				"document": {
					value: docInstance
				}
			});
		};
		OSF.DDA.BindingSelectionChangedEventArgs=function OSF_DDA_BindingSelectionChangedEventArgs(bindingInstance, subset) {
			OSF.OUtil.defineEnumerableProperties(this, {
				"type": {
					value: Microsoft.Office.WebExtension.EventType.BindingSelectionChanged
				},
				"binding": {
					value: bindingInstance
				}
			});
			for(var prop in subset) {
				OSF.OUtil.defineEnumerableProperty(this, prop, {
					value: subset[prop]
				});
			}
		};
		OSF.DDA.BindingDataChangedEventArgs=function OSF_DDA_BindingDataChangedEventArgs(bindingInstance) {
			OSF.OUtil.defineEnumerableProperties(this, {
				"type": {
					value: Microsoft.Office.WebExtension.EventType.BindingDataChanged
				},
				"binding": {
					value: bindingInstance
				}
			});
		};
		OSF.DDA.SettingsChangedEventArgs=function OSF_DDA_SettingsChangedEventArgs(settingsInstance) {
			OSF.OUtil.defineEnumerableProperties(this, {
				"type": {
					value: Microsoft.Office.WebExtension.EventType.SettingsChanged
				},
				"settings": {
					value: settingsInstance
				}
			});
		};
		OSF.DDA.OfficeThemeChangedEventArgs=function OSF_DDA_OfficeThemeChangedEventArgs(officeTheme) {
			var ret=OSF.DDA.ConvertToOfficeTheme(officeTheme);
			OSF.OUtil.defineEnumerableProperties(this, {
				"type": {
					value: Microsoft.Office.Internal.EventType.OfficeThemeChanged
				},
				"officeTheme": {
					value: ret
				}
			});
		};
		OSF.DDA.DocumentThemeChangedEventArgs=function OSF_DDA_DocumentThemeChangedEventArgs(documentTheme) {
			var ret=OSF.DDA.ConvertToDocumentTheme(documentTheme);
			OSF.OUtil.defineEnumerableProperties(this, {
				"type": {
					value: Microsoft.Office.Internal.EventType.DocumentThemeChanged
				},
				"documentTheme": {
					value: ret
				}
			});
		};
		OSF.DDA.ActiveViewChangedEventArgs=function OSF_DDA_ActiveViewChangedEventArgs(activeView) {
			OSF.OUtil.defineEnumerableProperties(this, {
				"type": {
					value: Microsoft.Office.WebExtension.EventType.ActiveViewChanged
				},
				"activeView": {
					value: activeView.activeView
				}
			});
		};
OSF.O15HostSpecificFileVersion={
	GetFallbackVersion : function(appName){
	    var fallback="15.01";
		var appFallbackTable={
			"1"   : "15.02",
			"2"  : "15.02",
			"4"   : "15.02",
			"8"  : "15.04",
			"16"   : "15.02",
			"128"  : "15.02"
		};
		var appFallback=appFallbackTable[appName];
		if(appFallback) {
			return appFallback;
		} else {
			return fallback;
		}
	},
	GenerateVersion	: function(majorVersion, apiSetVersion) {
		var partWidth=2;
		return zeroPad(majorVersion, partWidth)+"."+zeroPad(apiSetVersion, partWidth);
		function zeroPad(number, width) {
			number=number || 0;
			width=width || 0;
			var paddedString=number.toString();
			var numberOfZeroes=width - paddedString.length;
			for (var i=0; i < numberOfZeroes; i++) {
				paddedString="0"+paddedString;
			}
			return paddedString;
		};
	}
};
var OfficeExt;
(function (OfficeExt) {
	var MicrosoftAjaxFactory=(function () {
		function MicrosoftAjaxFactory() {
		}
		MicrosoftAjaxFactory.prototype.isMsAjaxLoaded=function () {
			if (typeof (Sys) !=='undefined' && typeof (Type) !=='undefined' &&
				Sys.StringBuilder && typeof (Sys.StringBuilder)==="function" &&
				Type.registerNamespace && typeof (Type.registerNamespace)==="function" &&
				Type.registerClass && typeof (Type.registerClass)==="function" &&
				typeof (Function._validateParams)==="function" &&
				Sys.Serialization && Sys.Serialization.JavaScriptSerializer && typeof (Sys.Serialization.JavaScriptSerializer.serialize)==="function") {
				return true;
			}
			else {
				return false;
			}
		};
		MicrosoftAjaxFactory.prototype.loadMsAjaxFull=function (callback) {
			var msAjaxCDNPath=(window.location.protocol.toLowerCase()==='https:' ? 'https:' : 'http:')+'//ajax.aspnetcdn.com/ajax/3.5/MicrosoftAjax.js';
			OSF.OUtil.loadScript(msAjaxCDNPath, callback);
		};
		Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxError", {
			get: function () {
				if (this._msAjaxError==null && this.isMsAjaxLoaded()) {
					this._msAjaxError=Error;
				}
				return this._msAjaxError;
			},
			set: function (errorClass) {
				this._msAjaxError=errorClass;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxSerializer", {
			get: function () {
				if (this._msAjaxSerializer==null && this.isMsAjaxLoaded()) {
					this._msAjaxSerializer=Sys.Serialization.JavaScriptSerializer;
				}
				return this._msAjaxSerializer;
			},
			set: function (serializerClass) {
				this._msAjaxSerializer=serializerClass;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxString", {
			get: function () {
				if (this._msAjaxString==null && this.isMsAjaxLoaded()) {
					this._msAjaxSerializer=String;
				}
				return this._msAjaxString;
			},
			set: function (stringClass) {
				this._msAjaxString=stringClass;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(MicrosoftAjaxFactory.prototype, "msAjaxDebug", {
			get: function () {
				if (this._msAjaxDebug==null && this.isMsAjaxLoaded()) {
					this._msAjaxDebug=Sys.Debug;
				}
				return this._msAjaxDebug;
			},
			set: function (debugClass) {
				this._msAjaxDebug=debugClass;
			},
			enumerable: true,
			configurable: true
		});
		return MicrosoftAjaxFactory;
	})();
	OfficeExt.MicrosoftAjaxFactory=MicrosoftAjaxFactory;
})(OfficeExt || (OfficeExt={}));
var OsfMsAjaxFactory=new OfficeExt.MicrosoftAjaxFactory();
(function (OfficeExt) {
	var MsAjaxTypeHelper=(function () {
		function MsAjaxTypeHelper() {
		}
		MsAjaxTypeHelper.isInstanceOfType=function (type, instance) {
			if (typeof (instance)==="undefined" || instance===null)
				return false;
			if (instance instanceof type)
				return true;
			var instanceType=instance.constructor;
			if (!instanceType || (typeof (instanceType) !=="function") || !instanceType.__typeName || instanceType.__typeName==='Object') {
				instanceType=Object;
			}
			return !!(instanceType===type) ||
				(instanceType.__typeName && type.__typeName && instanceType.__typeName===type.__typeName);
		};
		return MsAjaxTypeHelper;
	})();
	OfficeExt.MsAjaxTypeHelper=MsAjaxTypeHelper;
	var MsAjaxError=(function () {
		function MsAjaxError() {
		}
		MsAjaxError.create=function (message, errorInfo) {
			var err=new Error(message);
			err.message=message;
			if (errorInfo) {
				for (var v in errorInfo) {
					err[v]=errorInfo[v];
				}
			}
			err.popStackFrame();
			return err;
		};
		MsAjaxError.parameterCount=function (message) {
			var displayMessage="Sys.ParameterCountException: "+(message ? message : "Parameter count mismatch.");
			var err=MsAjaxError.create(displayMessage, { name: 'Sys.ParameterCountException' });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argument=function (paramName, message) {
			var displayMessage="Sys.ArgumentException: "+(message ? message : "Value does not fall within the expected range.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, { name: "Sys.ArgumentException", paramName: paramName });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentNull=function (paramName, message) {
			var displayMessage="Sys.ArgumentNullException: "+(message ? message : "Value cannot be null.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, { name: "Sys.ArgumentNullException", paramName: paramName });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentOutOfRange=function (paramName, actualValue, message) {
			var displayMessage="Sys.ArgumentOutOfRangeException: "+(message ? message : "Specified argument was out of the range of valid values.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			if (typeof (actualValue) !=="undefined" && actualValue !==null) {
				displayMessage+="\n"+MsAjaxString.format("Actual value was {0}.", actualValue);
			}
			var err=MsAjaxError.create(displayMessage, {
				name: "Sys.ArgumentOutOfRangeException",
				paramName: paramName,
				actualValue: actualValue
			});
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentType=function (paramName, actualType, expectedType, message) {
			var displayMessage="Sys.ArgumentTypeException: ";
			if (message) {
				displayMessage+=message;
			}
			else if (actualType && expectedType) {
				displayMessage+=MsAjaxString.format("Object of type '{0}' cannot be converted to type '{1}'.", actualType.getName ? actualType.getName() : actualType, expectedType.getName ? expectedType.getName() : expectedType);
			}
			else {
				displayMessage+="Object cannot be converted to the required type.";
			}
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, {
				name: "Sys.ArgumentTypeException",
				paramName: paramName,
				actualType: actualType,
				expectedType: expectedType
			});
			err.popStackFrame();
			return err;
		};
		MsAjaxError.argumentUndefined=function (paramName, message) {
			var displayMessage="Sys.ArgumentUndefinedException: "+(message ? message : "Value cannot be undefined.");
			if (paramName) {
				displayMessage+="\n"+MsAjaxString.format("Parameter name: {0}", paramName);
			}
			var err=MsAjaxError.create(displayMessage, { name: "Sys.ArgumentUndefinedException", paramName: paramName });
			err.popStackFrame();
			return err;
		};
		MsAjaxError.invalidOperation=function (message) {
			var displayMessage="Sys.InvalidOperationException: "+(message ? message : "Operation is not valid due to the current state of the object.");
			var err=MsAjaxError.create(displayMessage, { name: 'Sys.InvalidOperationException' });
			err.popStackFrame();
			return err;
		};
		return MsAjaxError;
	})();
	OfficeExt.MsAjaxError=MsAjaxError;
	var MsAjaxString=(function () {
		function MsAjaxString() {
		}
		MsAjaxString.format=function (format) {
			var args=[];
			for (var _i=1; _i < arguments.length; _i++) {
				args[_i - 1]=arguments[_i];
			}
			var source=format;
			return source.replace(/{(\d+)}/gm, function (match, number) {
				var index=parseInt(number, 10);
				return args[index]===undefined ? '{'+number+'}' : args[index];
			});
		};
		MsAjaxString.startsWith=function (str, prefix) {
			return (str.substr(0, prefix.length)===prefix);
		};
		return MsAjaxString;
	})();
	OfficeExt.MsAjaxString=MsAjaxString;
	var MsAjaxDebug=(function () {
		function MsAjaxDebug() {
		}
		MsAjaxDebug.trace=function (text) {
			if (typeof Debug !=="undefined" && Debug.writeln)
				Debug.writeln(text);
			if (window.console && window.console.log)
				window.console.log(text);
			if (window.opera && window.opera.postError)
				window.opera.postError(text);
			if (window.debugService && window.debugService.trace)
				window.debugService.trace(text);
			var a=document.getElementById("TraceConsole");
			if (a && a.tagName.toUpperCase()==="TEXTAREA") {
				a.innerHTML+=text+"\n";
			}
		};
		return MsAjaxDebug;
	})();
	OfficeExt.MsAjaxDebug=MsAjaxDebug;
	if (!OsfMsAjaxFactory.isMsAjaxLoaded()) {
		var registerTypeInternal=function registerTypeInternal(type, name, isClass) {
			if (type.__typeName===undefined) {
				type.__typeName=name;
			}
			if (type.__class===undefined) {
				type.__class=isClass;
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
			Function.createCallback=function Function$createCallback(method, context) {
				var e=Function._validateParams(arguments, [
					{ name: "method", type: Function },
					{ name: "context", mayBeNull: true }
				]);
				if (e)
					throw e;
				return function () {
					var l=arguments.length;
					if (l > 0) {
						var args=[];
						for (var i=0; i < l; i++) {
							args[i]=arguments[i];
						}
						args[l]=context;
						return method.apply(this, args);
					}
					return method.call(this, context);
				};
			};
		}
		if (!Function.createDelegate) {
			Function.createDelegate=function Function$createDelegate(instance, method) {
				var e=Function._validateParams(arguments, [
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
			Function._validateParams=function (params, expectedParams, validateParameterCount) {
				var e, expectedLength=expectedParams.length;
				validateParameterCount=validateParameterCount || (typeof (validateParameterCount)==="undefined");
				e=Function._validateParameterCount(params, expectedParams, validateParameterCount);
				if (e) {
					e.popStackFrame();
					return e;
				}
				for (var i=0, l=params.length; i < l; i++) {
					var expectedParam=expectedParams[Math.min(i, expectedLength - 1)], paramName=expectedParam.name;
					if (expectedParam.parameterArray) {
						paramName+="["+(i - expectedLength+1)+"]";
					}
					else if (!validateParameterCount && (i >=expectedLength)) {
						break;
					}
					e=Function._validateParameter(params[i], expectedParam, paramName);
					if (e) {
						e.popStackFrame();
						return e;
					}
				}
				return null;
			};
		}
		if (!Function._validateParameterCount) {
			Function._validateParameterCount=function (params, expectedParams, validateParameterCount) {
				var i, error, expectedLen=expectedParams.length, actualLen=params.length;
				if (actualLen < expectedLen) {
					var minParams=expectedLen;
					for (i=0; i < expectedLen; i++) {
						var param=expectedParams[i];
						if (param.optional || param.parameterArray) {
							minParams--;
						}
					}
					if (actualLen < minParams) {
						error=true;
					}
				}
				else if (validateParameterCount && (actualLen > expectedLen)) {
					error=true;
					for (i=0; i < expectedLen; i++) {
						if (expectedParams[i].parameterArray) {
							error=false;
							break;
						}
					}
				}
				if (error) {
					var e=MsAjaxError.parameterCount();
					e.popStackFrame();
					return e;
				}
				return null;
			};
		}
		if (!Function._validateParameter) {
			Function._validateParameter=function (param, expectedParam, paramName) {
				var e, expectedType=expectedParam.type, expectedInteger=!!expectedParam.integer, expectedDomElement=!!expectedParam.domElement, mayBeNull=!!expectedParam.mayBeNull;
				e=Function._validateParameterType(param, expectedType, expectedInteger, expectedDomElement, mayBeNull, paramName);
				if (e) {
					e.popStackFrame();
					return e;
				}
				var expectedElementType=expectedParam.elementType, elementMayBeNull=!!expectedParam.elementMayBeNull;
				if (expectedType===Array && typeof (param) !=="undefined" && param !==null &&
					(expectedElementType || !elementMayBeNull)) {
					var expectedElementInteger=!!expectedParam.elementInteger, expectedElementDomElement=!!expectedParam.elementDomElement;
					for (var i=0; i < param.length; i++) {
						var elem=param[i];
						e=Function._validateParameterType(elem, expectedElementType, expectedElementInteger, expectedElementDomElement, elementMayBeNull, paramName+"["+i+"]");
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
			Function._validateParameterType=function (param, expectedType, expectedInteger, expectedDomElement, mayBeNull, paramName) {
				var e, i;
				if (typeof (param)==="undefined") {
					if (mayBeNull) {
						return null;
					}
					else {
						e=OfficeExt.MsAjaxError.argumentUndefined(paramName);
						e.popStackFrame();
						return e;
					}
				}
				if (param===null) {
					if (mayBeNull) {
						return null;
					}
					else {
						e=OfficeExt.MsAjaxError.argumentNull(paramName);
						e.popStackFrame();
						return e;
					}
				}
				if (expectedType && !OfficeExt.MsAjaxTypeHelper.isInstanceOfType(expectedType, param)) {
					e=OfficeExt.MsAjaxError.argumentType(paramName, typeof (param), expectedType);
					e.popStackFrame();
					return e;
				}
				return null;
			};
		}
		if (!window.Type) {
			window.Type=Function;
		}
		if (!Type.registerNamespace) {
			Type.registerNamespace=function (ns) {
				var namespaceParts=ns.split('.');
				var currentNamespace=window;
				for (var i=0; i < namespaceParts.length; i++) {
					currentNamespace[namespaceParts[i]]=currentNamespace[namespaceParts[i]] || {};
					currentNamespace=currentNamespace[namespaceParts[i]];
				}
			};
		}
		if (!Type.prototype.registerClass) {
			Type.prototype.registerClass=function (cls) { cls={}; };
		}
		if (typeof (Sys)==="undefined") {
			Type.registerNamespace('Sys');
		}
		if (!Error.prototype.popStackFrame) {
			Error.prototype.popStackFrame=function () {
				if (arguments.length !==0)
					throw MsAjaxError.parameterCount();
				if (typeof (this.stack)==="undefined" || this.stack===null ||
					typeof (this.fileName)==="undefined" || this.fileName===null ||
					typeof (this.lineNumber)==="undefined" || this.lineNumber===null) {
					return;
				}
				var stackFrames=this.stack.split("\n");
				var currentFrame=stackFrames[0];
				var pattern=this.fileName+":"+this.lineNumber;
				while (typeof (currentFrame) !=="undefined" &&
					currentFrame !==null &&
					currentFrame.indexOf(pattern)===-1) {
					stackFrames.shift();
					currentFrame=stackFrames[0];
				}
				var nextFrame=stackFrames[1];
				if (typeof (nextFrame)==="undefined" || nextFrame===null) {
					return;
				}
				var nextFrameParts=nextFrame.match(/@(.*):(\d+)$/);
				if (typeof (nextFrameParts)==="undefined" || nextFrameParts===null) {
					return;
				}
				this.fileName=nextFrameParts[1];
				this.lineNumber=parseInt(nextFrameParts[2]);
				stackFrames.shift();
				this.stack=stackFrames.join("\n");
			};
		}
		OsfMsAjaxFactory.msAjaxError=MsAjaxError;
		OsfMsAjaxFactory.msAjaxString=MsAjaxString;
		OsfMsAjaxFactory.msAjaxDebug=MsAjaxDebug;
	}
})(OfficeExt || (OfficeExt={}));
var OfficeExt;
(function (OfficeExt) {
	var MsAjaxJavaScriptSerializer=(function () {
		function MsAjaxJavaScriptSerializer() {
		}
		MsAjaxJavaScriptSerializer._init=function () {
			var replaceChars=['\\u0000', '\\u0001', '\\u0002', '\\u0003', '\\u0004', '\\u0005', '\\u0006', '\\u0007',
				'\\b', '\\t', '\\n', '\\u000b', '\\f', '\\r', '\\u000e', '\\u000f', '\\u0010', '\\u0011',
				'\\u0012', '\\u0013', '\\u0014', '\\u0015', '\\u0016', '\\u0017', '\\u0018', '\\u0019',
				'\\u001a', '\\u001b', '\\u001c', '\\u001d', '\\u001e', '\\u001f'];
			MsAjaxJavaScriptSerializer._charsToEscape[0]='\\';
			MsAjaxJavaScriptSerializer._charsToEscapeRegExs['\\']=new RegExp('\\\\', 'g');
			MsAjaxJavaScriptSerializer._escapeChars['\\']='\\\\';
			MsAjaxJavaScriptSerializer._charsToEscape[1]='"';
			MsAjaxJavaScriptSerializer._charsToEscapeRegExs['"']=new RegExp('"', 'g');
			MsAjaxJavaScriptSerializer._escapeChars['"']='\\"';
			for (var i=0; i < 32; i++) {
				var c=String.fromCharCode(i);
				MsAjaxJavaScriptSerializer._charsToEscape[i+2]=c;
				MsAjaxJavaScriptSerializer._charsToEscapeRegExs[c]=new RegExp(c, 'g');
				MsAjaxJavaScriptSerializer._escapeChars[c]=replaceChars[i];
			}
		};
		MsAjaxJavaScriptSerializer.serialize=function (object) {
			var stringBuilder=new MsAjaxStringBuilder();
			MsAjaxJavaScriptSerializer.serializeWithBuilder(object, stringBuilder, false);
			return stringBuilder.toString();
		};
		MsAjaxJavaScriptSerializer.deserialize=function (data, secure) {
			if (data.length===0)
				throw OfficeExt.MsAjaxError.argument('data', "Cannot deserialize empty string.");
			try {
				var exp=data.replace(MsAjaxJavaScriptSerializer._dateRegEx, "$1new Date($2)");
				if (secure && MsAjaxJavaScriptSerializer._jsonRegEx.test(exp.replace(MsAjaxJavaScriptSerializer._jsonStringRegEx, '')))
					throw null;
				return eval('('+exp+')');
			}
			catch (e) {
				throw OfficeExt.MsAjaxError.argument('data', "Cannot deserialize. The data does not correspond to valid JSON.");
			}
		};
		MsAjaxJavaScriptSerializer.serializeBooleanWithBuilder=function (object, stringBuilder) {
			stringBuilder.append(object.toString());
		};
		MsAjaxJavaScriptSerializer.serializeNumberWithBuilder=function (object, stringBuilder) {
			if (isFinite(object)) {
				stringBuilder.append(String(object));
			}
			else {
				throw OfficeExt.MsAjaxError.invalidOperation("Cannot serialize non finite numbers.");
			}
		};
		MsAjaxJavaScriptSerializer.serializeStringWithBuilder=function (str, stringBuilder) {
			stringBuilder.append('"');
			if (MsAjaxJavaScriptSerializer._escapeRegEx.test(str)) {
				if (MsAjaxJavaScriptSerializer._charsToEscape.length===0) {
					MsAjaxJavaScriptSerializer._init();
				}
				if (str.length < 128) {
					str=str.replace(MsAjaxJavaScriptSerializer._escapeRegExGlobal, function (x) { return MsAjaxJavaScriptSerializer._escapeChars[x]; });
				}
				else {
					for (var i=0; i < 34; i++) {
						var c=MsAjaxJavaScriptSerializer._charsToEscape[i];
						if (str.indexOf(c) !==-1) {
							if ((navigator.userAgent.indexOf("OPR/") > -1) || (navigator.userAgent.indexOf("Firefox") > -1)) {
								str=str.split(c).join(MsAjaxJavaScriptSerializer._escapeChars[c]);
							}
							else {
								str=str.replace(MsAjaxJavaScriptSerializer._charsToEscapeRegExs[c], MsAjaxJavaScriptSerializer._escapeChars[c]);
							}
						}
					}
				}
			}
			stringBuilder.append(str);
			stringBuilder.append('"');
		};
		MsAjaxJavaScriptSerializer.serializeWithBuilder=function (object, stringBuilder, sort, prevObjects) {
			var i;
			switch (typeof object) {
				case 'object':
					if (object) {
						if (prevObjects) {
							for (var j=0; j < prevObjects.length; j++) {
								if (prevObjects[j]===object) {
									throw OfficeExt.MsAjaxError.invalidOperation("Cannot serialize object with cyclic reference within child properties.");
								}
							}
						}
						else {
							prevObjects=new Array();
						}
						try {
							OfficeExt.MsAjaxArray.add(prevObjects, object);
							if (OfficeExt.MsAjaxTypeHelper.isInstanceOfType(Number, object)) {
								MsAjaxJavaScriptSerializer.serializeNumberWithBuilder(object, stringBuilder);
							}
							else if (OfficeExt.MsAjaxTypeHelper.isInstanceOfType(Boolean, object)) {
								MsAjaxJavaScriptSerializer.serializeBooleanWithBuilder(object, stringBuilder);
							}
							else if (OfficeExt.MsAjaxTypeHelper.isInstanceOfType(String, object)) {
								MsAjaxJavaScriptSerializer.serializeStringWithBuilder(object, stringBuilder);
							}
							else if (OfficeExt.MsAjaxTypeHelper.isInstanceOfType(Array, object)) {
								stringBuilder.append('[');
								for (i=0; i < object.length;++i) {
									if (i > 0) {
										stringBuilder.append(',');
									}
									MsAjaxJavaScriptSerializer.serializeWithBuilder(object[i], stringBuilder, false, prevObjects);
								}
								stringBuilder.append(']');
							}
							else {
								if (OfficeExt.MsAjaxTypeHelper.isInstanceOfType(Date, object)) {
									stringBuilder.append('"\\/Date(');
									stringBuilder.append(object.getTime());
									stringBuilder.append(')\\/"');
									break;
								}
								var properties=[];
								var propertyCount=0;
								for (var name in object) {
									if (OfficeExt.MsAjaxString.startsWith(name, '$')) {
										continue;
									}
									if (name===MsAjaxJavaScriptSerializer._serverTypeFieldName && propertyCount !==0) {
										properties[propertyCount++]=properties[0];
										properties[0]=name;
									}
									else {
										properties[propertyCount++]=name;
									}
								}
								if (sort)
									properties.sort();
								stringBuilder.append('{');
								var needComma=false;
								for (i=0; i < propertyCount; i++) {
									var value=object[properties[i]];
									if (typeof value !=='undefined' && typeof value !=='function') {
										if (needComma) {
											stringBuilder.append(',');
										}
										else {
											needComma=true;
										}
										MsAjaxJavaScriptSerializer.serializeWithBuilder(properties[i], stringBuilder, sort, prevObjects);
										stringBuilder.append(':');
										MsAjaxJavaScriptSerializer.serializeWithBuilder(value, stringBuilder, sort, prevObjects);
									}
								}
								stringBuilder.append('}');
							}
						}
						finally {
							OfficeExt.MsAjaxArray.removeAt(prevObjects, prevObjects.length - 1);
						}
					}
					else {
						stringBuilder.append('null');
					}
					break;
				case 'number':
					MsAjaxJavaScriptSerializer.serializeNumberWithBuilder(object, stringBuilder);
					break;
				case 'string':
					MsAjaxJavaScriptSerializer.serializeStringWithBuilder(object, stringBuilder);
					break;
				case 'boolean':
					MsAjaxJavaScriptSerializer.serializeBooleanWithBuilder(object, stringBuilder);
					break;
				default:
					stringBuilder.append('null');
					break;
			}
		};
		MsAjaxJavaScriptSerializer.__patchVersion=0;
		MsAjaxJavaScriptSerializer._charsToEscapeRegExs=[];
		MsAjaxJavaScriptSerializer._charsToEscape=[];
		MsAjaxJavaScriptSerializer._dateRegEx=new RegExp('(^|[^\\\\])\\"\\\\/Date\\((-?[0-9]+)(?:[a-zA-Z]|(?:\\+|-)[0-9]{4})?\\)\\\\/\\"', 'g');
		MsAjaxJavaScriptSerializer._escapeChars={};
		MsAjaxJavaScriptSerializer._escapeRegEx=new RegExp('["\\\\\\x00-\\x1F]', 'i');
		MsAjaxJavaScriptSerializer._escapeRegExGlobal=new RegExp('["\\\\\\x00-\\x1F]', 'g');
		MsAjaxJavaScriptSerializer._jsonRegEx=new RegExp('[^,:{}\\[\\]0-9.\\-+Eaeflnr-u \\n\\r\\t]', 'g');
		MsAjaxJavaScriptSerializer._jsonStringRegEx=new RegExp('"(\\\\.|[^"\\\\])*"', 'g');
		MsAjaxJavaScriptSerializer._serverTypeFieldName='__type';
		return MsAjaxJavaScriptSerializer;
	})();
	OfficeExt.MsAjaxJavaScriptSerializer=MsAjaxJavaScriptSerializer;
	var MsAjaxArray=(function () {
		function MsAjaxArray() {
		}
		MsAjaxArray.add=function (array, item) {
			array[array.length]=item;
		};
		MsAjaxArray.removeAt=function (array, index) {
			array.splice(index, 1);
		};
		MsAjaxArray.clone=function (array) {
			if (array.length===1) {
				return [array[0]];
			}
			else {
				return Array.apply(null, array);
			}
		};
		MsAjaxArray.remove=function (array, item) {
			var index=MsAjaxArray.indexOf(array, item);
			if (index >=0) {
				array.splice(index, 1);
			}
			return (index >=0);
		};
		MsAjaxArray.indexOf=function (array, item, start) {
			if (typeof (item)==="undefined")
				return -1;
			var length=array.length;
			if (length !==0) {
				start=start - 0;
				if (isNaN(start)) {
					start=0;
				}
				else {
					if (isFinite(start)) {
						start=start - (start % 1);
					}
					if (start < 0) {
						start=Math.max(0, length+start);
					}
				}
				for (var i=start; i < length; i++) {
					if ((typeof (array[i]) !=="undefined") && (array[i]===item)) {
						return i;
					}
				}
			}
			return -1;
		};
		return MsAjaxArray;
	})();
	OfficeExt.MsAjaxArray=MsAjaxArray;
	var MsAjaxStringBuilder=(function () {
		function MsAjaxStringBuilder(initialText) {
			this._parts=(typeof (initialText) !=='undefined' && initialText !==null && initialText !=='') ?
				[initialText.toString()] : [];
			this._value={};
			this._len=0;
		}
		MsAjaxStringBuilder.prototype.append=function (text) {
			this._parts[this._parts.length]=text;
		};
		MsAjaxStringBuilder.prototype.toString=function (separator) {
			separator=separator || '';
			var parts=this._parts;
			if (this._len !==parts.length) {
				this._value={};
				this._len=parts.length;
			}
			var val=this._value;
			if (typeof (val[separator])==='undefined') {
				if (separator !=='') {
					for (var i=0; i < parts.length;) {
						if ((typeof (parts[i])==='undefined') || (parts[i]==='') || (parts[i]===null)) {
							parts.splice(i, 1);
						}
						else {
							i++;
						}
					}
				}
				val[separator]=this._parts.join(separator);
			}
			return val[separator];
		};
		return MsAjaxStringBuilder;
	})();
	OfficeExt.MsAjaxStringBuilder=MsAjaxStringBuilder;
	if (!OsfMsAjaxFactory.isMsAjaxLoaded()) {
		OsfMsAjaxFactory.msAjaxSerializer=MsAjaxJavaScriptSerializer;
	}
})(OfficeExt || (OfficeExt={}));
var __extends=this.__extends || function (d, b) {
	function __() { this.constructor=d; }
	__.prototype=b.prototype;
	d.prototype=new __();
};
var OSFLog;
(function (OSFLog) {
	var BaseUsageData=(function () {
		function BaseUsageData(table) {
			this._table=table;
			this._fields={};
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
		BaseUsageData.prototype.SerializeFields=function () {
		};
		BaseUsageData.prototype.SetSerializedField=function (key, value) {
			if (typeof (value) !=="undefined" && value !==null) {
				this._serializedFields[key]=value.toString();
			}
		};
		BaseUsageData.prototype.SerializeRow=function () {
			this._serializedFields={};
			this.SetSerializedField("Table", this._table);
			this.SerializeFields();
			return JSON.stringify(this._serializedFields);
		};
		return BaseUsageData;
	})();
	OSFLog.BaseUsageData=BaseUsageData;
	var AppActivatedUsageData=(function (_super) {
		__extends(AppActivatedUsageData, _super);
		function AppActivatedUsageData() {
			_super.call(this, "AppActivated");
		}
		Object.defineProperty(AppActivatedUsageData.prototype, "CorrelationId", {
			get: function () {
				return this.Fields["CorrelationId"];
			},
			set: function (value) {
				this.Fields["CorrelationId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "SessionId", {
			get: function () {
				return this.Fields["SessionId"];
			},
			set: function (value) {
				this.Fields["SessionId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppId", {
			get: function () {
				return this.Fields["AppId"];
			},
			set: function (value) {
				this.Fields["AppId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppInstanceId", {
			get: function () {
				return this.Fields["AppInstanceId"];
			},
			set: function (value) {
				this.Fields["AppInstanceId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppURL", {
			get: function () {
				return this.Fields["AppURL"];
			},
			set: function (value) {
				this.Fields["AppURL"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AssetId", {
			get: function () {
				return this.Fields["AssetId"];
			},
			set: function (value) {
				this.Fields["AssetId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "Browser", {
			get: function () {
				return this.Fields["Browser"];
			},
			set: function (value) {
				this.Fields["Browser"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "UserId", {
			get: function () {
				return this.Fields["UserId"];
			},
			set: function (value) {
				this.Fields["UserId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "Host", {
			get: function () {
				return this.Fields["Host"];
			},
			set: function (value) {
				this.Fields["Host"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "HostVersion", {
			get: function () {
				return this.Fields["HostVersion"];
			},
			set: function (value) {
				this.Fields["HostVersion"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "ClientId", {
			get: function () {
				return this.Fields["ClientId"];
			},
			set: function (value) {
				this.Fields["ClientId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppSizeWidth", {
			get: function () {
				return this.Fields["AppSizeWidth"];
			},
			set: function (value) {
				this.Fields["AppSizeWidth"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "AppSizeHeight", {
			get: function () {
				return this.Fields["AppSizeHeight"];
			},
			set: function (value) {
				this.Fields["AppSizeHeight"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppActivatedUsageData.prototype, "DocUrl", {
			get: function () {
				return this.Fields["DocUrl"];
			},
			set: function (value) {
				this.Fields["DocUrl"]=value;
			},
			enumerable: true,
			configurable: true
		});
		AppActivatedUsageData.prototype.SerializeFields=function () {
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
			this.SetSerializedField("DocUrl", this.DocUrl);
		};
		return AppActivatedUsageData;
	})(BaseUsageData);
	OSFLog.AppActivatedUsageData=AppActivatedUsageData;
	var ScriptLoadUsageData=(function (_super) {
		__extends(ScriptLoadUsageData, _super);
		function ScriptLoadUsageData() {
			_super.call(this, "ScriptLoad");
		}
		Object.defineProperty(ScriptLoadUsageData.prototype, "CorrelationId", {
			get: function () {
				return this.Fields["CorrelationId"];
			},
			set: function (value) {
				this.Fields["CorrelationId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "SessionId", {
			get: function () {
				return this.Fields["SessionId"];
			},
			set: function (value) {
				this.Fields["SessionId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "ScriptId", {
			get: function () {
				return this.Fields["ScriptId"];
			},
			set: function (value) {
				this.Fields["ScriptId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "StartTime", {
			get: function () {
				return this.Fields["StartTime"];
			},
			set: function (value) {
				this.Fields["StartTime"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(ScriptLoadUsageData.prototype, "ResponseTime", {
			get: function () {
				return this.Fields["ResponseTime"];
			},
			set: function (value) {
				this.Fields["ResponseTime"]=value;
			},
			enumerable: true,
			configurable: true
		});
		ScriptLoadUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("ScriptId", this.ScriptId);
			this.SetSerializedField("StartTime", this.StartTime);
			this.SetSerializedField("ResponseTime", this.ResponseTime);
		};
		return ScriptLoadUsageData;
	})(BaseUsageData);
	OSFLog.ScriptLoadUsageData=ScriptLoadUsageData;
	var AppClosedUsageData=(function (_super) {
		__extends(AppClosedUsageData, _super);
		function AppClosedUsageData() {
			_super.call(this, "AppClosed");
		}
		Object.defineProperty(AppClosedUsageData.prototype, "CorrelationId", {
			get: function () {
				return this.Fields["CorrelationId"];
			},
			set: function (value) {
				this.Fields["CorrelationId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "SessionId", {
			get: function () {
				return this.Fields["SessionId"];
			},
			set: function (value) {
				this.Fields["SessionId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "FocusTime", {
			get: function () {
				return this.Fields["FocusTime"];
			},
			set: function (value) {
				this.Fields["FocusTime"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "AppSizeFinalWidth", {
			get: function () {
				return this.Fields["AppSizeFinalWidth"];
			},
			set: function (value) {
				this.Fields["AppSizeFinalWidth"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "AppSizeFinalHeight", {
			get: function () {
				return this.Fields["AppSizeFinalHeight"];
			},
			set: function (value) {
				this.Fields["AppSizeFinalHeight"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "OpenTime", {
			get: function () {
				return this.Fields["OpenTime"];
			},
			set: function (value) {
				this.Fields["OpenTime"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppClosedUsageData.prototype, "CloseMethod", {
			get: function () {
				return this.Fields["CloseMethod"];
			},
			set: function (value) {
				this.Fields["CloseMethod"]=value;
			},
			enumerable: true,
			configurable: true
		});
		AppClosedUsageData.prototype.SerializeFields=function () {
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
	OSFLog.AppClosedUsageData=AppClosedUsageData;
	var APIUsageUsageData=(function (_super) {
		__extends(APIUsageUsageData, _super);
		function APIUsageUsageData() {
			_super.call(this, "APIUsage");
		}
		Object.defineProperty(APIUsageUsageData.prototype, "CorrelationId", {
			get: function () {
				return this.Fields["CorrelationId"];
			},
			set: function (value) {
				this.Fields["CorrelationId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "SessionId", {
			get: function () {
				return this.Fields["SessionId"];
			},
			set: function (value) {
				this.Fields["SessionId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "APIType", {
			get: function () {
				return this.Fields["APIType"];
			},
			set: function (value) {
				this.Fields["APIType"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "APIID", {
			get: function () {
				return this.Fields["APIID"];
			},
			set: function (value) {
				this.Fields["APIID"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "Parameters", {
			get: function () {
				return this.Fields["Parameters"];
			},
			set: function (value) {
				this.Fields["Parameters"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "ResponseTime", {
			get: function () {
				return this.Fields["ResponseTime"];
			},
			set: function (value) {
				this.Fields["ResponseTime"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(APIUsageUsageData.prototype, "ErrorType", {
			get: function () {
				return this.Fields["ErrorType"];
			},
			set: function (value) {
				this.Fields["ErrorType"]=value;
			},
			enumerable: true,
			configurable: true
		});
		APIUsageUsageData.prototype.SerializeFields=function () {
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
	OSFLog.APIUsageUsageData=APIUsageUsageData;
	var AppInitializationUsageData=(function (_super) {
		__extends(AppInitializationUsageData, _super);
		function AppInitializationUsageData() {
			_super.call(this, "AppInitialization");
		}
		Object.defineProperty(AppInitializationUsageData.prototype, "CorrelationId", {
			get: function () {
				return this.Fields["CorrelationId"];
			},
			set: function (value) {
				this.Fields["CorrelationId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppInitializationUsageData.prototype, "SessionId", {
			get: function () {
				return this.Fields["SessionId"];
			},
			set: function (value) {
				this.Fields["SessionId"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppInitializationUsageData.prototype, "SuccessCode", {
			get: function () {
				return this.Fields["SuccessCode"];
			},
			set: function (value) {
				this.Fields["SuccessCode"]=value;
			},
			enumerable: true,
			configurable: true
		});
		Object.defineProperty(AppInitializationUsageData.prototype, "Message", {
			get: function () {
				return this.Fields["Message"];
			},
			set: function (value) {
				this.Fields["Message"]=value;
			},
			enumerable: true,
			configurable: true
		});
		AppInitializationUsageData.prototype.SerializeFields=function () {
			this.SetSerializedField("CorrelationId", this.CorrelationId);
			this.SetSerializedField("SessionId", this.SessionId);
			this.SetSerializedField("SuccessCode", this.SuccessCode);
			this.SetSerializedField("Message", this.Message);
		};
		return AppInitializationUsageData;
	})(BaseUsageData);
	OSFLog.AppInitializationUsageData=AppInitializationUsageData;
})(OSFLog || (OSFLog={}));
var Logger;
(function (Logger) {
	"use strict";
	(function (TraceLevel) {
		TraceLevel[TraceLevel["info"]=0]="info";
		TraceLevel[TraceLevel["warning"]=1]="warning";
		TraceLevel[TraceLevel["error"]=2]="error";
	})(Logger.TraceLevel || (Logger.TraceLevel={}));
	var TraceLevel=Logger.TraceLevel;
	(function (SendFlag) {
		SendFlag[SendFlag["none"]=0]="none";
		SendFlag[SendFlag["flush"]=1]="flush";
	})(Logger.SendFlag || (Logger.SendFlag={}));
	var SendFlag=Logger.SendFlag;
	function allowUploadingData() {
		if (OSF.Logger && OSF.Logger.ulsEndpoint) {
			OSF.Logger.ulsEndpoint.loadProxyFrame();
		}
	}
	Logger.allowUploadingData=allowUploadingData;
	function sendLog(traceLevel, message, flag) {
		if (OSF.Logger && OSF.Logger.ulsEndpoint) {
			var jsonObj={ traceLevel: traceLevel, message: message, flag: flag, internalLog: true };
			var logs=JSON.stringify(jsonObj);
			OSF.Logger.ulsEndpoint.writeLog(logs);
		}
	}
	Logger.sendLog=sendLog;
	function creatULSEndpoint() {
		try  {
			return new ULSEndpointProxy();
		} catch (e) {
			return null;
		}
	}
	var ULSEndpointProxy=(function () {
		function ULSEndpointProxy() {
			var _this=this;
			this.proxyFrame=null;
			this.telemetryEndPoint="https://telemetryservice.firstpartyapps.oaspapps.com/telemetryservice/telemetryproxy.html";
			this.buffer=[];
			this.proxyFrameReady=false;
			OSF.OUtil.addEventListener(window, "message", function (e) {
				return _this.tellProxyFrameReady(e);
			});
			setTimeout(function () {
				_this.loadProxyFrame();
			}, 3000);
		}
		ULSEndpointProxy.prototype.writeLog=function (log) {
			if (this.proxyFrameReady===true) {
				this.proxyFrame.contentWindow.postMessage(log, "*");
			} else {
				if (this.buffer.length < 128) {
					this.buffer.push(log);
				}
			}
		};
		ULSEndpointProxy.prototype.loadProxyFrame=function () {
			if (this.proxyFrame==null) {
				this.proxyFrame=document.createElement("iframe");
				this.proxyFrame.setAttribute("style", "display:none");
				this.proxyFrame.setAttribute("src", this.telemetryEndPoint);
				document.head.appendChild(this.proxyFrame);
			}
		};
		ULSEndpointProxy.prototype.tellProxyFrameReady=function (e) {
			var _this=this;
			if (e.data==="ProxyFrameReadyToLog") {
				this.proxyFrameReady=true;
				for (var i=0; i < this.buffer.length; i++) {
					this.writeLog(this.buffer[i]);
				}
				this.buffer.length=0;
				OSF.OUtil.removeEventListener(window, "message", function (e) {
					return _this.tellProxyFrameReady(e);
				});
			} else if (e.data==="ProxyFrameReadyToInit") {
				var initJson={ appName: "Office APPs", sessionId: OSF.OUtil.Guid.generateNewGuid() };
				var initStr=JSON.stringify(initJson);
				this.proxyFrame.contentWindow.postMessage(initStr, "*");
			}
		};
		return ULSEndpointProxy;
	})();
	if (!OSF.Logger) {
		OSF.Logger=Logger;
	}
	Logger.ulsEndpoint=creatULSEndpoint();
})(Logger || (Logger={}));
var OSFAppTelemetry;
(function (OSFAppTelemetry) {
	"use strict";
	var appInfo;
	var sessionId=OSF.OUtil.Guid.generateNewGuid();
	var osfControlAppCorrelationId="";
	;
	var AppInfo=(function () {
		function AppInfo() {
		}
		return AppInfo;
	})();
	var Event=(function () {
		function Event(name, handler) {
			this.name=name;
			this.handler=handler;
		}
		return Event;
	})();
	var AppStorage=(function () {
		function AppStorage() {
			this.clientIDKey="Office API client";
			this.logIdSetKey="Office App Log Id Set";
		}
		AppStorage.prototype.getClientId=function () {
			var clientId=this.getValue(this.clientIDKey);
			if (!clientId || clientId.length <=0 || clientId.length > 40) {
				clientId=OSF.OUtil.Guid.generateNewGuid();
				this.setValue(this.clientIDKey, clientId);
			}
			return clientId;
		};
		AppStorage.prototype.saveLog=function (logId, log) {
			var logIdSet=this.getValue(this.logIdSetKey);
			logIdSet=((logIdSet && logIdSet.length > 0) ? (logIdSet+";") : "")+logId;
			this.setValue(this.logIdSetKey, logIdSet);
			this.setValue(logId, log);
		};
		AppStorage.prototype.enumerateLog=function (callback, clean) {
			var logIdSet=this.getValue(this.logIdSetKey);
			if (logIdSet) {
				var ids=logIdSet.split(";");
				for (var id in ids) {
					var logId=ids[id];
					var log=this.getValue(logId);
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
		AppStorage.prototype.getValue=function (key) {
			var osfLocalStorage=OSF.OUtil.getLocalStorage();
			var value="";
			if (osfLocalStorage) {
				value=osfLocalStorage.getItem(key);
			}
			return value;
		};
		AppStorage.prototype.setValue=function (key, value) {
			var osfLocalStorage=OSF.OUtil.getLocalStorage();
			if (osfLocalStorage) {
				osfLocalStorage.setItem(key, value);
			}
		};
		AppStorage.prototype.remove=function (key) {
			var osfLocalStorage=OSF.OUtil.getLocalStorage();
			if (osfLocalStorage) {
				try  {
					osfLocalStorage.removeItem(key);
				} catch (ex) {
				}
			}
		};
		return AppStorage;
	})();
	var AppLogger=(function () {
		function AppLogger() {
		}
		AppLogger.prototype.LogData=function (data) {
			if (!OSF.Logger) {
				return;
			}
			OSF.Logger.sendLog(OSF.Logger.TraceLevel.info, data.SerializeRow(), OSF.Logger.SendFlag.none);
		};
		AppLogger.prototype.LogRawData=function (log) {
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
		appInfo=new AppInfo();
		appInfo.hostVersion=context.get_appVersion();
		appInfo.appId=context.get_id();
		appInfo.host=context.get_appName();
		appInfo.browser=window.navigator.userAgent;
		appInfo.correlationId=context.get_correlationId();
		appInfo.clientId=(new AppStorage()).getClientId();
		appInfo.appInstanceId=context.get_appInstanceId();
		if (appInfo.appInstanceId) {
			appInfo.appInstanceId=appInfo.appInstanceId.replace(/[{}]/g, "").toLowerCase();
		}
		var omexDomainRegex=new RegExp("^https?://store\\.office(ppe|-int)?\\.com/", "i");
		var docUrl=context.get_docUrl();
		appInfo.docUrl=omexDomainRegex.test(docUrl) ? docUrl : "";
		var url=location.href;
		if (url) {
			url=url.split("?")[0].split("#")[0];
		}
		appInfo.appURL=url;
		(function getUserIdAndAssetIdFromToken(token, appInfo) {
			var xmlContent;
			var parser;
			var xmlDoc;
			appInfo.assetId="";
			appInfo.userId="";
			try  {
				xmlContent=decodeURIComponent(token);
				parser=new DOMParser();
				xmlDoc=parser.parseFromString(xmlContent, "text/xml");
				appInfo.userId=xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("cid").nodeValue;
				appInfo.assetId=xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("aid").nodeValue;
			} catch (e) {
			} finally {
				xmlContent=null;
				xmlDoc=null;
				parser=null;
			}
		})(context.get_eToken(), appInfo);
		(function handleLifecycle() {
			var startTime=new Date();
			var lastFocus=null;
			var focusTime=0;
			var finished=false;
			var adjustFocusTime=function () {
				if (document.hasFocus()) {
					if (lastFocus==null) {
						lastFocus=new Date();
					}
				} else if (lastFocus) {
					focusTime+=Math.abs((new Date()).getTime() - lastFocus.getTime());
					lastFocus=null;
				}
			};
			var eventList=[];
			eventList.push(new Event("focus", adjustFocusTime));
			eventList.push(new Event("blur", adjustFocusTime));
			eventList.push(new Event("focusout", adjustFocusTime));
			eventList.push(new Event("focusin", adjustFocusTime));
			var exitFunction=function () {
				for (var i=0; i < eventList.length; i++) {
					OSF.OUtil.removeEventListener(window, eventList[i].name, eventList[i].handler);
				}
				eventList.length=0;
				if (!finished) {
					if (document.hasFocus() && lastFocus) {
						focusTime+=Math.abs((new Date()).getTime() - lastFocus.getTime());
						lastFocus=null;
					}
					OSFAppTelemetry.onAppClosed(Math.abs((new Date()).getTime() - startTime.getTime()), focusTime);
					finished=true;
				}
			};
			eventList.push(new Event("beforeunload", exitFunction));
			eventList.push(new Event("unload", exitFunction));
			for (var i=0; i < eventList.length; i++) {
				OSF.OUtil.addEventListener(window, eventList[i].name, eventList[i].handler);
			}
			adjustFocusTime();
		})();
		OSFAppTelemetry.onAppActivated();
	}
	OSFAppTelemetry.initialize=initialize;
	function onAppActivated() {
		if (!appInfo) {
			return;
		}
		(new AppStorage()).enumerateLog(function (id, log) {
			return (new AppLogger()).LogRawData(log);
		}, true);
		var data=new OSFLog.AppActivatedUsageData();
		data.SessionId=sessionId;
		data.AppId=appInfo.appId;
		data.AssetId=appInfo.assetId;
		data.AppURL=appInfo.appURL;
		data.UserId=appInfo.userId;
		data.ClientId=appInfo.clientId;
		data.Browser=appInfo.browser;
		data.Host=appInfo.host;
		data.HostVersion=appInfo.hostVersion;
		data.CorrelationId=appInfo.correlationId;
		data.AppSizeWidth=window.innerWidth;
		data.AppSizeHeight=window.innerHeight;
		data.AppInstanceId=appInfo.appInstanceId;
		data.DocUrl=appInfo.docUrl;
		(new AppLogger()).LogData(data);
		setTimeout(function () {
			if (!OSF.Logger) {
				return;
			}
			OSF.Logger.allowUploadingData();
		}, 100);
	}
	OSFAppTelemetry.onAppActivated=onAppActivated;
	function onScriptDone(scriptId, msStartTime, msResponseTime, appCorrelationId) {
		var data=new OSFLog.ScriptLoadUsageData();
		data.CorrelationId=appCorrelationId;
		data.SessionId=sessionId;
		data.ScriptId=scriptId;
		data.StartTime=msStartTime;
		data.ResponseTime=msResponseTime;
		(new AppLogger()).LogData(data);
	}
	OSFAppTelemetry.onScriptDone=onScriptDone;
	function onCallDone(apiType, id, parameters, msResponseTime, errorType) {
		if (!appInfo) {
			return;
		}
		var data=new OSFLog.APIUsageUsageData();
		data.CorrelationId=osfControlAppCorrelationId;
		data.SessionId=sessionId;
		data.APIType=apiType;
		data.APIID=id;
		data.Parameters=parameters;
		data.ResponseTime=msResponseTime;
		data.ErrorType=errorType;
		(new AppLogger()).LogData(data);
	}
	OSFAppTelemetry.onCallDone=onCallDone;
	;
	function onMethodDone(id, args, msResponseTime, errorType) {
		var parameters=null;
		if (args) {
			if (typeof args=="number") {
				parameters=String(args);
			} else if (typeof args==="object") {
				for (var index in args) {
					if (parameters !==null) {
						parameters+=",";
					} else {
						parameters="";
					}
					if (typeof args[index]=="number") {
						parameters+=String(args[index]);
					}
				}
			} else {
				parameters="";
			}
		}
		OSF.AppTelemetry.onCallDone("method", id, parameters, msResponseTime, errorType);
	}
	OSFAppTelemetry.onMethodDone=onMethodDone;
	function onPropertyDone(propertyName, msResponseTime) {
		OSF.AppTelemetry.onCallDone("property", -1, propertyName, msResponseTime);
	}
	OSFAppTelemetry.onPropertyDone=onPropertyDone;
	function onEventDone(id, errorType) {
		OSF.AppTelemetry.onCallDone("event", id, null, 0, errorType);
	}
	OSFAppTelemetry.onEventDone=onEventDone;
	function onRegisterDone(register, id, msResponseTime, errorType) {
		OSF.AppTelemetry.onCallDone(register ? "registerevent" : "unregisterevent", id, null, msResponseTime, errorType);
	}
	OSFAppTelemetry.onRegisterDone=onRegisterDone;
	function onAppClosed(openTime, focusTime) {
		if (!appInfo) {
			return;
		}
		var data=new OSFLog.AppClosedUsageData();
		data.CorrelationId=osfControlAppCorrelationId;
		data.SessionId=sessionId;
		data.FocusTime=focusTime;
		data.OpenTime=openTime;
		data.AppSizeFinalWidth=window.innerWidth;
		data.AppSizeFinalHeight=window.innerHeight;
		(new AppStorage()).saveLog(sessionId, data.SerializeRow());
	}
	OSFAppTelemetry.onAppClosed=onAppClosed;
	function setOsfControlAppCorrelationId(correlationId) {
		osfControlAppCorrelationId=correlationId;
	}
	OSFAppTelemetry.setOsfControlAppCorrelationId=setOsfControlAppCorrelationId;
	function doAppInitializationLogging(isException, message) {
		var data=new OSFLog.AppInitializationUsageData();
		data.CorrelationId=osfControlAppCorrelationId;
		data.SessionId=sessionId;
		data.SuccessCode=isException ? 1 : 0;
		data.Message=message;
		(new AppLogger()).LogData(data);
	}
	OSFAppTelemetry.doAppInitializationLogging=doAppInitializationLogging;
	function logAppCommonMessage(message) {
		doAppInitializationLogging(false, message);
	}
	OSFAppTelemetry.logAppCommonMessage=logAppCommonMessage;
	function logAppException(errorMessage) {
		doAppInitializationLogging(true, errorMessage);
	}
	OSFAppTelemetry.logAppException=logAppException;
	OSF.AppTelemetry=OSFAppTelemetry;
})(OSFAppTelemetry || (OSFAppTelemetry={}));
OSF.InitializationHelper=function OSF_InitializationHelper(hostInfo, webAppState, context, settings, hostFacade) {
	this._hostInfo=hostInfo;
	this._webAppState=webAppState;
	this._context=context;
	this._settings=settings;
	this._hostFacade=hostFacade;
};
OSF.InitializationHelper.prototype.getAppContext=function OSF_InitializationHelper$getAppContext(wnd, gotAppContext) {
	if (this._hostInfo.isRichClient) {
		var returnedContext;
		var context;
		var warningText="Warning: Office.js is loaded outside of Office client";
		try {
			if (window.external && typeof window.external.GetContext !=='undefined') {
				context=OSF.DDA._OsfControlContext=window.external.GetContext();
			} else {
				OsfMsAjaxFactory.msAjaxDebug.trace(warningText);
				return;
			}
		} catch (e) {
			OsfMsAjaxFactory.msAjaxDebug.trace(warningText);
			return;
		}
		var context=window.external.GetContext();
		var appType=context.GetAppType();
		var appTypeSupported=false;
		for (var appEntry in OSF.AppName) {
			if (OSF.AppName[appEntry]==appType) {
				appTypeSupported=true;
				break;
			}
		}
		if (!appTypeSupported) {
			throw "Unsupported client type "+appType;
		}
		var id=context.GetSolutionRef();
		var apiSetVersion;
		if (typeof context.GetApiSetVersion !=="undefined") {
			apiSetVersion=context.GetApiSetVersion();
		}
		var version=OSF.O15HostSpecificFileVersion.GenerateVersion(
			context.GetAppVersionMajor(),
			apiSetVersion
		);
		var minorVersion=context.GetAppVersionMinor();
		var UILocale=context.GetAppUILocale();
		var dataLocale=context.GetAppDataLocale();
		var docUrl=context.GetDocUrl();
		var clientMode=context.GetAppCapabilities();
		var reason=context.GetActivationMode();
		var osfControlType=context.GetControlIntegrationLevel();
		var settings=[];
		var eToken;
		try {
			eToken=context.GetSolutionToken();
		} catch (ex) {
		}
		var correlationId;
		if (typeof context.GetCorrelationId !=="undefined") {
			correlationId=context.GetCorrelationId();
		}
		var requirementMatrix;
		if (typeof context.GetSupportedMatrix !=="undefined") {
			requirementMatrix=context.GetSupportedMatrix();
		}
		eToken=eToken ? eToken.toString() : "";
		var appInstanceId;
		if (typeof context.GetInstanceId !=="undefined") {
			appInstanceId=context.GetInstanceId();
		}
		returnedContext=new OSF.OfficeAppContext(id, appType, version, UILocale, dataLocale, docUrl, clientMode, settings, reason, osfControlType, eToken, correlationId, appInstanceId, 0, 0, minorVersion, requirementMatrix);
		try
		{
			var o15HostInfo=window.external.GetHostInfo();
			var o15IsDialog=o15HostInfo.indexOf("isDialog") !=-1;
			this._hostInfo.isDialog=o15IsDialog;
		}
		catch(e){}
		gotAppContext(returnedContext);
		if (OSF.AppTelemetry) {
			OSF.AppTelemetry.initialize(returnedContext);
		}
	} else {
		var getInvocationCallbackWebApp=function OSF__OfficeAppFactory_getAppContextAsync$getInvocationCallbackWebApp(errorCode, appContext) {
			var settings;
			if (appContext._appName===OSF.AppName.ExcelWebApp) {
				var serializedSettings=appContext._settings;
				settings={};
				for (var index in serializedSettings) {
					var setting=serializedSettings[index];
					settings[setting[0]]=setting[1];
				}
			}
			else {
				settings=appContext._settings;
			}
			if (errorCode===0 && appContext._id !=undefined && appContext._appName !=undefined && appContext._appVersion !=undefined && appContext._appUILocale !=undefined && appContext._dataLocale !=undefined &&
				appContext._docUrl !=undefined && appContext._clientMode !=undefined && appContext._settings !=undefined && appContext._reason !=undefined) {
				var minorVersion=0;
				if (appContext._appMinorVersion !=undefined) {
					minorVersion=appContext._appMinorVersion;
				}
				var requirementMatrix=undefined;
				if (appContext._requirementMatrix !=undefined) {
					requirementMatrix=appContext._requirementMatrix;
				}
				var returnedContext=new OSF.OfficeAppContext(appContext._id, appContext._appName, appContext._appVersion, appContext._appUILocale, appContext._dataLocale, appContext._docUrl, appContext._clientMode, settings, appContext._reason, appContext._osfControlType, appContext._eToken, appContext._correlationId, 0, 0, 0, minorVersion, requirementMatrix);
				gotAppContext(returnedContext);
				if (OSF.AppTelemetry) {
					OSF.AppTelemetry.initialize(returnedContext);
				}
			} else {
				throw "Function ContextActivationManager_getAppContextAsync call failed. ErrorCode is "+errorCode;
			}
		};
			this._webAppState.clientEndPoint.invoke("ContextActivationManager_getAppContextAsync", getInvocationCallbackWebApp, this._webAppState.id);
	}
};
OSF.InitializationHelper.prototype.setAgaveHostCommunication=function OSF_InitializationHelper$setAgaveHostCommunication() {
	var me=this;
	var xdmInfoValue=OSF.OUtil.parseXdmInfo();
	if (xdmInfoValue) {
		me._hostInfo.isRichClient=false;
		var xdmItems=xdmInfoValue.split('|');
		if (xdmItems==undefined || typeof xdmItems[1]=="undefined") {
			xdmItems=xdmInfoValue.split('%7C');
		}
		if (xdmItems !=undefined && xdmItems.length >=3) {
			me._webAppState.conversationID=xdmItems[0];
			me._webAppState.id=xdmItems[1];
			me._webAppState.webAppUrl=xdmItems[2];
		}
	} else {
		me._hostInfo.isRichClient=true;
	}
	if (!me._hostInfo.isRichClient) {
		me._webAppState.clientEndPoint=Microsoft.Office.Common.XdmCommunicationManager.connect(me._webAppState.conversationID, me._webAppState.wnd, me._webAppState.webAppUrl);
		me._webAppState.serviceEndPoint=Microsoft.Office.Common.XdmCommunicationManager.createServiceEndPoint(me._webAppState.id);
		var notificationConversationId=me._webAppState.conversationID+OSF.SharedConstants.NotificationConversationIdSuffix;
		me._webAppState.serviceEndPoint.registerConversation(notificationConversationId);
		var notifyAgave=function OSF_InitializationHelper_setAgaveHostCommunication$notifyAgave(actionId) {
			switch (actionId) {
				case OSF.AgaveHostAction.Select:
					me._webAppState.focused=true;
					window.focus();
					break;
				case OSF.AgaveHostAction.UnSelect:
					me._webAppState.focused=false;
					break;
				default:
					OsfMsAjaxFactory.msAjaxDebug.trace("actionId "+actionId+" notifyAgave is wrong.");
					break;
			}
		}
		me._webAppState.serviceEndPoint.registerMethod("Office_notifyAgave",
														notifyAgave,
														Microsoft.Office.Common.InvokeType.async,
														false);
		window.onfocus=function () {
			if (!me._webAppState.focused) {
				me._webAppState.focused=true;
				me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.Select]);
			}
		}
		window.onblur=function () {
			if (me._webAppState.focused) {
				me._webAppState.focused=false;
				me._webAppState.clientEndPoint.invoke("ContextActivationManager_notifyHost", null, [me._webAppState.id, OSF.AgaveHostAction.UnSelect]);
			}
		}
	}
};
OSF.InitializationHelper.prototype.prepareRightBeforeWebExtensionInitialize=function OSF_InitializationHelper$prepareRightBeforeWebExtensionInitialize(appContext) {
	var license=new OSF.DDA.License(appContext.get_eToken());
	var proxy=window.open;
	window.open=function (strUrl, strWindowName, strWindowFeatures) {
		var windowObject=null;
		try {
			windowObject=proxy(strUrl, strWindowName, strWindowFeatures);
		}
		catch (ex) {
		}
		if (!windowObject && OSF._OfficeAppFactory.getClientEndPoint() && OSF._OfficeAppFactory.getClientEndPoint().invoke) {
			var params={
				"strUrl": strUrl,
				"strWindowName": strWindowName,
				"strWindowFeatures": strWindowFeatures
			};
			OSF._OfficeAppFactory.getClientEndPoint().invoke("ContextActivationManager_openWindowInHost", null, params);
		}
		return windowObject;
	};
	if (this._hostInfo.isRichClient) {
		var isOldOutlook=true;
		try {
			isOldOutlook=appContext.get_appName()==OSF.AppName.Outlook
							&& (parseFloat(appContext.get_appVersion()) < 15.04);
		}
		catch (ex){}
		if(!isOldOutlook) {
			if (appContext.get_isDialog()) {
				if (OSF.DDA.UI.ChildUI) {
					appContext.ui=new OSF.DDA.UI.ChildUI();
				}
			} else {
				if (OSF.DDA.UI.ParentUI) {
					appContext.ui=new OSF.DDA.UI.ParentUI();
				}
			}
		}
		if(OSF.DDA.SafeArray !=undefined){
	        var parameterMap=OSF.DDA.SafeArray.Delegate.ParameterMap;
			var args={};
			args[OSF.DDA.EventDescriptors.DialogMessageReceivedEvent]=OSF.DDA.SafeArray.Delegate.ParameterMap.self;
			parameterMap.setMapping(OSF.DDA.EventDispId.dispidDialogMessageReceivedEvent, {fromHost: args});
			args={};
			args[OSF.DDA.PropertyDescriptors.MessageType]=0;
			args[OSF.DDA.PropertyDescriptors.MessageContent]=1;
			parameterMap.setMapping(OSF.DDA.EventDescriptors.DialogMessageReceivedEvent, {fromHost: args});
			OSF.DDA.SafeArray.Delegate.ParameterMap=parameterMap;
			}
	}
	if (appContext.get_appName()==OSF.AppName.OutlookWebApp) {
		OSF._OfficeAppFactory.setContext(new OSF.DDA.OutlookContext(appContext, this._settings, license, appContext.appOM));
		Microsoft.Office.WebExtension.initialize();
	}
	else if (appContext.get_appName()==OSF.AppName.Outlook) {
		OSF._OfficeAppFactory.setContext(new OSF.DDA.OutlookContext(appContext, this._settings, license, appContext.appOM));
		Microsoft.Office.WebExtension.initialize();
		if (typeof OfficeJsClient_OutlookWin32 !=='undefined')
		{
			OfficeJsClient_OutlookWin32.prepareRightBeforeWebExtensionInitialize();
		}
	}
	else if (appContext.get_osfControlType()===OSF.OsfControlType.DocumentLevel || appContext.get_osfControlType()===OSF.OsfControlType.ContainerLevel) {
		OSF._OfficeAppFactory.setContext(new OSF.DDA.Context(appContext, appContext.doc, license));
		var getDelegateMethods, parameterMap;
		var reason=appContext.get_reason();
		if (this._hostInfo.isRichClient) {
			function OSF_DDA_SafeArray_Delegate_Shared$MessageParent(args){
				try {
					if (args.onCalling) {
						args.onCalling();
					}
					var startTime=(new Date()).getTime();
					var message=args.hostCallArgs[Microsoft.Office.WebExtension.Parameters.MessageToParent];
					window.external.MessageParent(message);
					if (args.onReceiving) {
						args.onReceiving();
					}
					if (OSF.AppTelemetry) {
						OSF.AppTelemetry.onMethodDone(args.dispId, args.hostCallArgs, Math.abs((new Date()).getTime() - startTime), result);
					}
					return result;
				}
				catch (ex) {
					var status;
					var number=ex.number;
					if (number) {
					switch (number) {
						case -2146828218:
							status=OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability;
							break;
						case -2146827850:
						default:
							status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
							break;
						}
					}
					return status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
				}
			}
			function getRichClientDelegateMethodsWrapper(actionId){
				var result=OSF.DDA.DispIdHost.getRichClientDelegateMethods(actionId);
				if(result[OSF.DDA.DispIdHost.Delegates.MessageParent]==undefined){
					result[OSF.DDA.DispIdHost.Delegates.MessageParent]=OSF_DDA_SafeArray_Delegate_Shared$MessageParent;
				}
				return result;
			}
			getDelegateMethods=getRichClientDelegateMethodsWrapper;
			reason=OSF.DDA.RichInitializationReason[reason];
			parameterMap=OSF.DDA.SafeArray.Delegate.ParameterMap;
		} else {
			getDelegateMethods=OSF.DDA.DispIdHost.getXLSDelegateMethods;
			parameterMap=OSF.DDA.XLS.Delegate.ParameterMap;
		}
		OSF._OfficeAppFactory.setHostFacade(new OSF.DDA.DispIdHost.Facade(getDelegateMethods, parameterMap));
		Microsoft.Office.WebExtension.initialize(reason);
	}
	else {
		throw OSF.OUtil.formatString(Strings.OfficeOM.L_OsfControlTypeNotSupported);
	}
};
OSF.InitializationHelper.prototype.loadAppSpecificScriptAndCreateOM=function OSF_InitializationHelper$loadAppSpecificScriptAndCreateOM(appContext, appReady, basePath) {
			var suffix;
			suffix=".debug.js";
			var _appToScriptTable={
				"1-15.00"   : "excel-15"+suffix,
				"1-15.01"   : "excel-15.01"+suffix,
				"1-15.02"   : "excel-15.02"+suffix,
				"2-15.00"   : "word-15"+suffix,
				"2-15.01"   : "word-15.01"+suffix,
				"2-15.02"   : "word-15.02"+suffix,
				"4-15.00"   : "powerpoint-15"+suffix,
				"4-15.01"   : "powerpoint-15.01"+suffix,
				"4-15.02"   : "powerpoint-15.02"+suffix,
				"8-15.00"   : "outlook-15"+suffix,
				"8-15.01"   : "outlook-15.01"+suffix,
				"8-15.02"   : "outlook-15.02"+suffix,
				"8-15.03"   : "outlook-15.03"+suffix,
				"8-15.04"   : "outlook-15.04"+suffix,
				"16-15"     : "excelwebapp-15"+suffix,
				"16-15.01"  : "excelwebapp-15.01"+suffix,
				"16-15.02"  : "excelwebapp-15.02"+suffix,
				"64-15"     : "outlookwebapp-15"+suffix,
				"64-15.01"  : "outlookwebapp-15.01"+suffix,
				"128-15.00" : "project-15"+suffix,
				"128-15.01" : "project-15.01"+suffix,
				"128-15.02" : "project-15.02"+suffix
			};
	var checkScriptOverride=function OSF$checkScriptOverride() {
		var postScriptOverrideCheckAction=function OSF$postScriptOverrideCheckAction(customizedScriptPath) {
			if(customizedScriptPath) {
				OSF.OUtil.loadScript(customizedScriptPath, function() {
					OsfMsAjaxFactory.msAjaxDebug.trace("loaded customized script:"+customizedScriptPath);
				});
			}
		};
		var clientEndPoint=OSF._OfficeAppFactory.getClientEndPoint();
		var customizedScriptPath=null;
		if(!clientEndPoint) {
			try{
				if (typeof window.external.getCustomizedScriptPath !=='undefined') {
					customizedScriptPath=window.external.getCustomizedScriptPath();
				}
			} catch(ex) {
				OsfMsAjaxFactory.msAjaxDebug.trace("no script override through window.external.");
			}
			postScriptOverrideCheckAction(customizedScriptPath);
		} else {
			try{
				clientEndPoint.invoke("getCustomizedScriptPathAsync",
					function OSF$getCustomizedScriptPathAsyncCallback(errorCode, scriptPath) {
						postScriptOverrideCheckAction( errorCode===0  ? scriptPath : null);
					},
					{__timeout__ : 1000});
			} catch(ex) {
				OsfMsAjaxFactory.msAjaxDebug.trace("no script override through cross frame communication.");
			}
		}
	};
	OSF.DDA.ErrorCodeManager.initializeErrorMessages(Strings.OfficeOM);
	var me=this;
	function initializeSettings(refreshSupported) {
		var settings;
		var serializedSettings;
		if (me._hostInfo.isRichClient) {
			serializedSettings=OSF.DDA.RichClientSettingsManager.read();
		} else {
			serializedSettings=appContext.get_settings();
		}
		var deserializedSettings=OSF.DDA.SettingsManager.deserializeSettings(serializedSettings);
		if (refreshSupported) {
			settings=new OSF.DDA.RefreshableSettings(deserializedSettings);
		} else {
			settings=new OSF.DDA.Settings(deserializedSettings);
		}
		return settings;
	}
	var versionToBeLoaded=appContext.get_appVersion();
	var fallbackversion=OSF.O15HostSpecificFileVersion.GetFallbackVersion(appContext.get_appName());
	if (versionToBeLoaded > fallbackversion) {
		versionToBeLoaded=fallbackversion;
	}
	var scriptPath=basePath+_appToScriptTable[appContext.get_appName()+"-"+versionToBeLoaded];
	var loadScriptSafe=function(scriptPath, fileId, callback) {
		if (OSF._OfficeAppFactory.getLoadScriptHelper) {
			OSF._OfficeAppFactory.getLoadScriptHelper().loadScript(scriptPath, fileId, callback);
		} else {
			OSF.OUtil.loadScript(scriptPath, callback);
		}
	};
	if (appContext.get_appName()==OSF.AppName.Excel) {
		var excelScriptLoaded=function () {
			appContext.doc=new OSF.DDA.ExcelDocument(appContext, initializeSettings(false));
			appReady();
		};
		loadScriptSafe(scriptPath, OSF.ConstantNames.HostFileId, excelScriptLoaded);
	} else if (appContext.get_appName()==OSF.AppName.ExcelWebApp) {
		var excelWebAppScriptLoaded=function () {
			appContext.doc=new OSF.DDA.ExcelWebAppDocument(appContext, initializeSettings(true));
			appReady();
		};
		loadScriptSafe(scriptPath, OSF.ConstantNames.HostFileId, excelWebAppScriptLoaded);
	} else if (appContext.get_appName()==OSF.AppName.Word) {
		var wordScriptLoaded=function () {
			appContext.doc=new OSF.DDA.WordDocument(appContext, initializeSettings(false));
			appReady();
		};
		loadScriptSafe(scriptPath, OSF.ConstantNames.HostFileId, wordScriptLoaded);
	} else if (appContext.get_appName()==OSF.AppName.PowerPoint) {
		var powerPointScriptLoaded=function () {
			appContext.doc=new OSF.DDA.PowerPointDocument(appContext, initializeSettings(false));
			appReady();
		};
		loadScriptSafe(scriptPath, OSF.ConstantNames.HostFileId, powerPointScriptLoaded);
	} else if (appContext.get_appName()==OSF.AppName.OutlookWebApp || appContext.get_appName()==OSF.AppName.Outlook) {
		var outlookScriptLoaded=function () {
			me._settings=initializeSettings(false);
			appContext.appOM=new OSF.DDA.OutlookAppOm(appContext, me._webAppState.wnd, appReady);
		};
		var loadOutlookScript=function() {
			loadScriptSafe(scriptPath, OSF.ConstantNames.HostFileId, outlookScriptLoaded);
		};
		if (!OsfMsAjaxFactory.isMsAjaxLoaded()) {
			OsfMsAjaxFactory.loadMsAjaxFull(loadOutlookScript);
		} else {
			 loadOutlookScript();
		}
		checkScriptOverride();
	} else if (appContext.get_appName()==OSF.AppName.Project) {
		var projScriptLoaded=function () {
			appContext.doc=new OSF.DDA.ProjectDocument(appContext);
			appReady();
		};
		loadScriptSafe(scriptPath, OSF.ConstantNames.HostFileId, projScriptLoaded);
	} else {
		throw OSF.OUtil.formatString(stringNS.L_AppNotExistInitializeNotCalled, appContext.get_appName());
	}
};

