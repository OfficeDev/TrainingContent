/* Outlook iOS specific API library */
/* Version: 16.0.7526.1000 */
/*
	Copyright (c) Microsoft Corporation.  All rights reserved.
*/


/*
	Your use of this file is governed by the Microsoft Services Agreement http://go.microsoft.com/fwlink/?LinkId=266419.
*/

var __extends=this && this.__extends || function(d, b)
	{
		for(var p in b)
			if(b.hasOwnProperty(p))
				d[p]=b[p];
		function __()
		{
			this.constructor=d
		}
		d.prototype=b===null ? Object.create(b) : (__.prototype=b.prototype,new __)
	};
var OfficeExt;
(function(OfficeExt)
{
	var MicrosoftAjaxFactory=function()
		{
			function MicrosoftAjaxFactory(){}
			MicrosoftAjaxFactory.prototype.isMsAjaxLoaded=function()
			{
				if(typeof Sys !=="undefined" && typeof Type !=="undefined" && Sys.StringBuilder && typeof Sys.StringBuilder==="function" && Type.registerNamespace && typeof Type.registerNamespace==="function" && Type.registerClass && typeof Type.registerClass==="function" && typeof Function._validateParams==="function" && Sys.Serialization && Sys.Serialization.JavaScriptSerializer && typeof Sys.Serialization.JavaScriptSerializer.serialize==="function")
					return true;
				else
					return false
			};
			MicrosoftAjaxFactory.prototype.loadMsAjaxFull=function(callback)
			{
				var msAjaxCDNPath=(window.location.protocol.toLowerCase()==="https:" ? "https:" : "http:")+"//ajax.aspnetcdn.com/ajax/3.5/MicrosoftAjax.js";
				OSF.OUtil.loadScript(msAjaxCDNPath,callback)
			};
			Object.defineProperty(MicrosoftAjaxFactory.prototype,"msAjaxError",{
				get: function()
				{
					if(this._msAjaxError==null && this.isMsAjaxLoaded())
						this._msAjaxError=Error;
					return this._msAjaxError
				},
				set: function(errorClass)
				{
					this._msAjaxError=errorClass
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MicrosoftAjaxFactory.prototype,"msAjaxSerializer",{
				get: function()
				{
					if(this._msAjaxSerializer==null && this.isMsAjaxLoaded())
						this._msAjaxSerializer=Sys.Serialization.JavaScriptSerializer;
					return this._msAjaxSerializer
				},
				set: function(serializerClass)
				{
					this._msAjaxSerializer=serializerClass
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MicrosoftAjaxFactory.prototype,"msAjaxString",{
				get: function()
				{
					if(this._msAjaxString==null && this.isMsAjaxLoaded())
						this._msAjaxSerializer=String;
					return this._msAjaxString
				},
				set: function(stringClass)
				{
					this._msAjaxString=stringClass
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(MicrosoftAjaxFactory.prototype,"msAjaxDebug",{
				get: function()
				{
					if(this._msAjaxDebug==null && this.isMsAjaxLoaded())
						this._msAjaxDebug=Sys.Debug;
					return this._msAjaxDebug
				},
				set: function(debugClass)
				{
					this._msAjaxDebug=debugClass
				},
				enumerable: true,
				configurable: true
			});
			return MicrosoftAjaxFactory
		}();
	OfficeExt.MicrosoftAjaxFactory=MicrosoftAjaxFactory
})(OfficeExt || (OfficeExt={}));
var OsfMsAjaxFactory=new OfficeExt.MicrosoftAjaxFactory;
var OSF=OSF || {};
var OfficeExt;
(function(OfficeExt)
{
	var SafeStorage=function()
		{
			function SafeStorage(_internalStorage)
			{
				this._internalStorage=_internalStorage
			}
			SafeStorage.prototype.getItem=function(key)
			{
				try
				{
					return this._internalStorage && this._internalStorage.getItem(key)
				}
				catch(e)
				{
					return null
				}
			};
			SafeStorage.prototype.setItem=function(key, data)
			{
				try
				{
					this._internalStorage && this._internalStorage.setItem(key,data)
				}
				catch(e){}
			};
			SafeStorage.prototype.clear=function()
			{
				try
				{
					this._internalStorage && this._internalStorage.clear()
				}
				catch(e){}
			};
			SafeStorage.prototype.removeItem=function(key)
			{
				try
				{
					this._internalStorage && this._internalStorage.removeItem(key)
				}
				catch(e){}
			};
			SafeStorage.prototype.getKeysWithPrefix=function(keyPrefix)
			{
				var keyList=[];
				try
				{
					var len=this._internalStorage && this._internalStorage.length || 0;
					for(var i=0; i < len; i++)
					{
						var key=this._internalStorage.key(i);
						if(key.indexOf(keyPrefix)===0)
							keyList.push(key)
					}
				}
				catch(e){}
				return keyList
			};
			return SafeStorage
		}();
	OfficeExt.SafeStorage=SafeStorage
})(OfficeExt || (OfficeExt={}));
OSF.XdmFieldName={
	ConversationUrl: "ConversationUrl",
	AppId: "AppId"
};
OSF.WindowNameItemKeys={
	BaseFrameName: "baseFrameName",
	HostInfo: "hostInfo",
	XdmInfo: "xdmInfo",
	SerializerVersion: "serializerVersion",
	AppContext: "appContext"
};
OSF.OUtil=function()
{
	var _uniqueId=-1;
	var _xdmInfoKey="&_xdm_Info=";
	var _serializerVersionKey="&_serializer_version=";
	var _xdmSessionKeyPrefix="_xdm_";
	var _serializerVersionKeyPrefix="_serializer_version=";
	var _fragmentSeparator="#";
	var _fragmentInfoDelimiter="&";
	var _classN="class";
	var _loadedScripts={};
	var _defaultScriptLoadingTimeout=3e4;
	var _safeSessionStorage=null;
	var _safeLocalStorage=null;
	var _rndentropy=(new Date).getTime();
	function _random()
	{
		var nextrand=2147483647 * Math.random();
		nextrand ^=_rndentropy ^ (new Date).getMilliseconds() << Math.floor(Math.random() * (31 - 10));
		return nextrand.toString(16)
	}
	function _getSessionStorage()
	{
		if(!_safeSessionStorage)
		{
			try
			{
				var sessionStorage=window.sessionStorage
			}
			catch(ex)
			{
				sessionStorage=null
			}
			_safeSessionStorage=new OfficeExt.SafeStorage(sessionStorage)
		}
		return _safeSessionStorage
	}
	function _reOrderTabbableElements(elements)
	{
		var bucket0=[];
		var bucketPositive=[];
		var i;
		var len=elements.length;
		var ele;
		for(i=0; i < len; i++)
		{
			ele=elements[i];
			if(ele.tabIndex)
			{
				if(ele.tabIndex > 0)
					bucketPositive.push(ele);
				else if(ele.tabIndex===0)
					bucket0.push(ele)
			}
			else
				bucket0.push(ele)
		}
		bucketPositive=bucketPositive.sort(function(left, right)
		{
			var diff=left.tabIndex - right.tabIndex;
			if(diff===0)
				diff=bucketPositive.indexOf(left) - bucketPositive.indexOf(right);
			return diff
		});
		return[].concat(bucketPositive,bucket0)
	}
	return{
			set_entropy: function OSF_OUtil$set_entropy(entropy)
			{
				if(typeof entropy=="string")
					for(var i=0; i < entropy.length; i+=4)
					{
						var temp=0;
						for(var j=0; j < 4 && i+j < entropy.length; j++)
							temp=(temp << 8)+entropy.charCodeAt(i+j);
						_rndentropy ^=temp
					}
				else if(typeof entropy=="number")
					_rndentropy ^=entropy;
				else
					_rndentropy ^=2147483647 * Math.random();
				_rndentropy &=2147483647
			},
			extend: function OSF_OUtil$extend(child, parent)
			{
				var F=function(){};
				F.prototype=parent.prototype;
				child.prototype=new F;
				child.prototype.constructor=child;
				child.uber=parent.prototype;
				if(parent.prototype.constructor===Object.prototype.constructor)
					parent.prototype.constructor=parent
			},
			setNamespace: function OSF_OUtil$setNamespace(name, parent)
			{
				if(parent && name && !parent[name])
					parent[name]={}
			},
			unsetNamespace: function OSF_OUtil$unsetNamespace(name, parent)
			{
				if(parent && name && parent[name])
					delete parent[name]
			},
			loadScript: function OSF_OUtil$loadScript(url, callback, timeoutInMs)
			{
				if(url && callback)
				{
					var doc=window.document;
					var _loadedScriptEntry=_loadedScripts[url];
					if(!_loadedScriptEntry)
					{
						var script=doc.createElement("script");
						script.type="text/javascript";
						_loadedScriptEntry={
							loaded: false,
							pendingCallbacks: [callback],
							timer: null
						};
						_loadedScripts[url]=_loadedScriptEntry;
						var onLoadCallback=function OSF_OUtil_loadScript$onLoadCallback()
							{
								if(_loadedScriptEntry.timer !=null)
								{
									clearTimeout(_loadedScriptEntry.timer);
									delete _loadedScriptEntry.timer
								}
								_loadedScriptEntry.loaded=true;
								var pendingCallbackCount=_loadedScriptEntry.pendingCallbacks.length;
								for(var i=0; i < pendingCallbackCount; i++)
								{
									var currentCallback=_loadedScriptEntry.pendingCallbacks.shift();
									currentCallback()
								}
							};
						var onLoadError=function OSF_OUtil_loadScript$onLoadError()
							{
								delete _loadedScripts[url];
								if(_loadedScriptEntry.timer !=null)
								{
									clearTimeout(_loadedScriptEntry.timer);
									delete _loadedScriptEntry.timer
								}
								var pendingCallbackCount=_loadedScriptEntry.pendingCallbacks.length;
								for(var i=0; i < pendingCallbackCount; i++)
								{
									var currentCallback=_loadedScriptEntry.pendingCallbacks.shift();
									currentCallback()
								}
							};
						if(script.readyState)
							script.onreadystatechange=function()
							{
								if(script.readyState=="loaded" || script.readyState=="complete")
								{
									script.onreadystatechange=null;
									onLoadCallback()
								}
							};
						else
							script.onload=onLoadCallback;
						script.onerror=onLoadError;
						timeoutInMs=timeoutInMs || _defaultScriptLoadingTimeout;
						_loadedScriptEntry.timer=setTimeout(onLoadError,timeoutInMs);
						script.src=url;
						doc.getElementsByTagName("head")[0].appendChild(script)
					}
					else if(_loadedScriptEntry.loaded)
						callback();
					else
						_loadedScriptEntry.pendingCallbacks.push(callback)
				}
			},
			loadCSS: function OSF_OUtil$loadCSS(url)
			{
				if(url)
				{
					var doc=window.document;
					var link=doc.createElement("link");
					link.type="text/css";
					link.rel="stylesheet";
					link.href=url;
					doc.getElementsByTagName("head")[0].appendChild(link)
				}
			},
			parseEnum: function OSF_OUtil$parseEnum(str, enumObject)
			{
				var parsed=enumObject[str.trim()];
				if(typeof parsed=="undefined")
				{
					OsfMsAjaxFactory.msAjaxDebug.trace("invalid enumeration string:"+str);
					throw OsfMsAjaxFactory.msAjaxError.argument("str");
				}
				return parsed
			},
			delayExecutionAndCache: function OSF_OUtil$delayExecutionAndCache()
			{
				var obj={calc: arguments[0]};
				return function()
					{
						if(obj.calc)
						{
							obj.val=obj.calc.apply(this,arguments);
							delete obj.calc
						}
						return obj.val
					}
			},
			getUniqueId: function OSF_OUtil$getUniqueId()
			{
				_uniqueId=_uniqueId+1;
				return _uniqueId.toString()
			},
			formatString: function OSF_OUtil$formatString()
			{
				var args=arguments;
				var source=args[0];
				return source.replace(/{(\d+)}/gm,function(match, number)
					{
						var index=parseInt(number,10)+1;
						return args[index]===undefined ? "{"+number+"}" : args[index]
					})
			},
			generateConversationId: function OSF_OUtil$generateConversationId()
			{
				return[_random(),_random(),(new Date).getTime().toString()].join("_")
			},
			getFrameName: function OSF_OUtil$getFrameName(cacheKey)
			{
				return _xdmSessionKeyPrefix+cacheKey+this.generateConversationId()
			},
			addXdmInfoAsHash: function OSF_OUtil$addXdmInfoAsHash(url, xdmInfoValue)
			{
				return OSF.OUtil.addInfoAsHash(url,_xdmInfoKey,xdmInfoValue,false)
			},
			addSerializerVersionAsHash: function OSF_OUtil$addSerializerVersionAsHash(url, serializerVersion)
			{
				return OSF.OUtil.addInfoAsHash(url,_serializerVersionKey,serializerVersion,true)
			},
			addInfoAsHash: function OSF_OUtil$addInfoAsHash(url, keyName, infoValue, encodeInfo)
			{
				url=url.trim() || "";
				var urlParts=url.split(_fragmentSeparator);
				var urlWithoutFragment=urlParts.shift();
				var fragment=urlParts.join(_fragmentSeparator);
				var newFragment;
				if(encodeInfo)
					newFragment=[keyName,encodeURIComponent(infoValue),fragment].join("");
				else
					newFragment=[fragment,keyName,infoValue].join("");
				return[urlWithoutFragment,_fragmentSeparator,newFragment].join("")
			},
			parseHostInfoFromWindowName: function OSF_OUtil$parseHostInfoFromWindowName(skipSessionStorage, windowName)
			{
				return OSF.OUtil.parseInfoFromWindowName(skipSessionStorage,windowName,OSF.WindowNameItemKeys.HostInfo)
			},
			parseXdmInfo: function OSF_OUtil$parseXdmInfo(skipSessionStorage)
			{
				var xdmInfoValue=OSF.OUtil.parseXdmInfoWithGivenFragment(skipSessionStorage,window.location.hash);
				if(!xdmInfoValue)
					xdmInfoValue=OSF.OUtil.parseXdmInfoFromWindowName(skipSessionStorage,window.name);
				return xdmInfoValue
			},
			parseXdmInfoFromWindowName: function OSF_OUtil$parseXdmInfoFromWindowName(skipSessionStorage, windowName)
			{
				return OSF.OUtil.parseInfoFromWindowName(skipSessionStorage,windowName,OSF.WindowNameItemKeys.XdmInfo)
			},
			parseXdmInfoWithGivenFragment: function OSF_OUtil$parseXdmInfoWithGivenFragment(skipSessionStorage, fragment)
			{
				return OSF.OUtil.parseInfoWithGivenFragment(_xdmInfoKey,_xdmSessionKeyPrefix,false,skipSessionStorage,fragment)
			},
			parseSerializerVersion: function OSF_OUtil$parseSerializerVersion(skipSessionStorage)
			{
				var serializerVersion=OSF.OUtil.parseSerializerVersionWithGivenFragment(skipSessionStorage,window.location.hash);
				if(isNaN(serializerVersion))
					serializerVersion=OSF.OUtil.parseSerializerVersionFromWindowName(skipSessionStorage,window.name);
				return serializerVersion
			},
			parseSerializerVersionFromWindowName: function OSF_OUtil$parseSerializerVersionFromWindowName(skipSessionStorage, windowName)
			{
				return parseInt(OSF.OUtil.parseInfoFromWindowName(skipSessionStorage,windowName,OSF.WindowNameItemKeys.SerializerVersion))
			},
			parseSerializerVersionWithGivenFragment: function OSF_OUtil$parseSerializerVersionWithGivenFragment(skipSessionStorage, fragment)
			{
				return parseInt(OSF.OUtil.parseInfoWithGivenFragment(_serializerVersionKey,_serializerVersionKeyPrefix,true,skipSessionStorage,fragment))
			},
			parseInfoFromWindowName: function OSF_OUtil$parseInfoFromWindowName(skipSessionStorage, windowName, infoKey)
			{
				try
				{
					var windowNameObj=JSON.parse(windowName);
					var infoValue=windowNameObj !=null ? windowNameObj[infoKey] : null;
					var osfSessionStorage=_getSessionStorage();
					if(!skipSessionStorage && osfSessionStorage && windowNameObj !=null)
					{
						var sessionKey=windowNameObj[OSF.WindowNameItemKeys.BaseFrameName]+infoKey;
						if(infoValue)
							osfSessionStorage.setItem(sessionKey,infoValue);
						else
							infoValue=osfSessionStorage.getItem(sessionKey)
					}
					return infoValue
				}
				catch(Exception)
				{
					return null
				}
			},
			parseInfoWithGivenFragment: function OSF_OUtil$parseInfoWithGivenFragment(infoKey, infoKeyPrefix, decodeInfo, skipSessionStorage, fragment)
			{
				var fragmentParts=fragment.split(infoKey);
				var infoValue=fragmentParts.length > 1 ? fragmentParts[fragmentParts.length - 1] : null;
				if(decodeInfo && infoValue !=null)
				{
					if(infoValue.indexOf(_fragmentInfoDelimiter) >=0)
						infoValue=infoValue.split(_fragmentInfoDelimiter)[0];
					infoValue=decodeURIComponent(infoValue)
				}
				var osfSessionStorage=_getSessionStorage();
				if(!skipSessionStorage && osfSessionStorage)
				{
					var sessionKeyStart=window.name.indexOf(infoKeyPrefix);
					if(sessionKeyStart > -1)
					{
						var sessionKeyEnd=window.name.indexOf(";",sessionKeyStart);
						if(sessionKeyEnd==-1)
							sessionKeyEnd=window.name.length;
						var sessionKey=window.name.substring(sessionKeyStart,sessionKeyEnd);
						if(infoValue)
							osfSessionStorage.setItem(sessionKey,infoValue);
						else
							infoValue=osfSessionStorage.getItem(sessionKey)
					}
				}
				return infoValue
			},
			getConversationId: function OSF_OUtil$getConversationId()
			{
				var searchString=window.location.search;
				var conversationId=null;
				if(searchString)
				{
					var index=searchString.indexOf("&");
					conversationId=index > 0 ? searchString.substring(1,index) : searchString.substr(1);
					if(conversationId && conversationId.charAt(conversationId.length - 1)==="=")
					{
						conversationId=conversationId.substring(0,conversationId.length - 1);
						if(conversationId)
							conversationId=decodeURIComponent(conversationId)
					}
				}
				return conversationId
			},
			getInfoItems: function OSF_OUtil$getInfoItems(strInfo)
			{
				var items=strInfo.split("$");
				if(typeof items[1]=="undefined")
					items=strInfo.split("|");
				if(typeof items[1]=="undefined")
					items=strInfo.split("%7C");
				return items
			},
			getXdmFieldValue: function OSF_OUtil$getXdmFieldValue(xdmFieldName, skipSessionStorage)
			{
				var fieldValue="";
				var xdmInfoValue=OSF.OUtil.parseXdmInfo(skipSessionStorage);
				if(xdmInfoValue)
				{
					var items=OSF.OUtil.getInfoItems(xdmInfoValue);
					if(items !=undefined && items.length >=3)
						switch(xdmFieldName)
						{
							case OSF.XdmFieldName.ConversationUrl:
								fieldValue=items[2];
							case OSF.XdmFieldName.AppId:
								fieldValue=items[1]
						}
				}
				return fieldValue
			},
			validateParamObject: function OSF_OUtil$validateParamObject(params, expectedProperties, callback)
			{
				var e=Function._validateParams(arguments,[{
							name: "params",
							type: Object,
							mayBeNull: false
						},{
							name: "expectedProperties",
							type: Object,
							mayBeNull: false
						},{
							name: "callback",
							type: Function,
							mayBeNull: true
						}]);
				if(e)
					throw e;
				for(var p in expectedProperties)
				{
					e=Function._validateParameter(params[p],expectedProperties[p],p);
					if(e)
						throw e;
				}
			},
			writeProfilerMark: function OSF_OUtil$writeProfilerMark(text)
			{
				if(window.msWriteProfilerMark)
				{
					window.msWriteProfilerMark(text);
					OsfMsAjaxFactory.msAjaxDebug.trace(text)
				}
			},
			outputDebug: function OSF_OUtil$outputDebug(text)
			{
				if(typeof OsfMsAjaxFactory !=="undefined" && OsfMsAjaxFactory.msAjaxDebug && OsfMsAjaxFactory.msAjaxDebug.trace)
					OsfMsAjaxFactory.msAjaxDebug.trace(text)
			},
			defineNondefaultProperty: function OSF_OUtil$defineNondefaultProperty(obj, prop, descriptor, attributes)
			{
				descriptor=descriptor || {};
				for(var nd in attributes)
				{
					var attribute=attributes[nd];
					if(descriptor[attribute]==undefined)
						descriptor[attribute]=true
				}
				Object.defineProperty(obj,prop,descriptor);
				return obj
			},
			defineNondefaultProperties: function OSF_OUtil$defineNondefaultProperties(obj, descriptors, attributes)
			{
				descriptors=descriptors || {};
				for(var prop in descriptors)
					OSF.OUtil.defineNondefaultProperty(obj,prop,descriptors[prop],attributes);
				return obj
			},
			defineEnumerableProperty: function OSF_OUtil$defineEnumerableProperty(obj, prop, descriptor)
			{
				return OSF.OUtil.defineNondefaultProperty(obj,prop,descriptor,["enumerable"])
			},
			defineEnumerableProperties: function OSF_OUtil$defineEnumerableProperties(obj, descriptors)
			{
				return OSF.OUtil.defineNondefaultProperties(obj,descriptors,["enumerable"])
			},
			defineMutableProperty: function OSF_OUtil$defineMutableProperty(obj, prop, descriptor)
			{
				return OSF.OUtil.defineNondefaultProperty(obj,prop,descriptor,["writable","enumerable","configurable"])
			},
			defineMutableProperties: function OSF_OUtil$defineMutableProperties(obj, descriptors)
			{
				return OSF.OUtil.defineNondefaultProperties(obj,descriptors,["writable","enumerable","configurable"])
			},
			finalizeProperties: function OSF_OUtil$finalizeProperties(obj, descriptor)
			{
				descriptor=descriptor || {};
				var props=Object.getOwnPropertyNames(obj);
				var propsLength=props.length;
				for(var i=0; i < propsLength; i++)
				{
					var prop=props[i];
					var desc=Object.getOwnPropertyDescriptor(obj,prop);
					if(!desc.get && !desc.set)
						desc.writable=descriptor.writable || false;
					desc.configurable=descriptor.configurable || false;
					desc.enumerable=descriptor.enumerable || true;
					Object.defineProperty(obj,prop,desc)
				}
				return obj
			},
			mapList: function OSF_OUtil$MapList(list, mapFunction)
			{
				var ret=[];
				if(list)
					for(var item in list)
						ret.push(mapFunction(list[item]));
				return ret
			},
			listContainsKey: function OSF_OUtil$listContainsKey(list, key)
			{
				for(var item in list)
					if(key==item)
						return true;
				return false
			},
			listContainsValue: function OSF_OUtil$listContainsElement(list, value)
			{
				for(var item in list)
					if(value==list[item])
						return true;
				return false
			},
			augmentList: function OSF_OUtil$augmentList(list, addenda)
			{
				var add=list.push ? function(key, value)
					{
						list.push(value)
					} : function(key, value)
					{
						list[key]=value
					};
				for(var key in addenda)
					add(key,addenda[key])
			},
			redefineList: function OSF_Outil$redefineList(oldList, newList)
			{
				for(var key1 in oldList)
					delete oldList[key1];
				for(var key2 in newList)
					oldList[key2]=newList[key2]
			},
			isArray: function OSF_OUtil$isArray(obj)
			{
				return Object.prototype.toString.apply(obj)==="[object Array]"
			},
			isFunction: function OSF_OUtil$isFunction(obj)
			{
				return Object.prototype.toString.apply(obj)==="[object Function]"
			},
			isDate: function OSF_OUtil$isDate(obj)
			{
				return Object.prototype.toString.apply(obj)==="[object Date]"
			},
			addEventListener: function OSF_OUtil$addEventListener(element, eventName, listener)
			{
				if(element.addEventListener)
					element.addEventListener(eventName,listener,false);
				else if(Sys.Browser.agent===Sys.Browser.InternetExplorer && element.attachEvent)
					element.attachEvent("on"+eventName,listener);
				else
					element["on"+eventName]=listener
			},
			removeEventListener: function OSF_OUtil$removeEventListener(element, eventName, listener)
			{
				if(element.removeEventListener)
					element.removeEventListener(eventName,listener,false);
				else if(Sys.Browser.agent===Sys.Browser.InternetExplorer && element.detachEvent)
					element.detachEvent("on"+eventName,listener);
				else
					element["on"+eventName]=null
			},
			getCookieValue: function OSF_OUtil$getCookieValue(cookieName)
			{
				var tmpCookieString=RegExp(cookieName+"[^;]+").exec(document.cookie);
				return tmpCookieString.toString().replace(/^[^=]+./,"")
			},
			xhrGet: function OSF_OUtil$xhrGet(url, onSuccess, onError)
			{
				var xmlhttp;
				try
				{
					xmlhttp=new XMLHttpRequest;
					xmlhttp.onreadystatechange=function()
					{
						if(xmlhttp.readyState==4)
							if(xmlhttp.status==200)
								onSuccess(xmlhttp.responseText);
							else
								onError(xmlhttp.status)
					};
					xmlhttp.open("GET",url,true);
					xmlhttp.send()
				}
				catch(ex)
				{
					onError(ex)
				}
			},
			xhrGetFull: function OSF_OUtil$xhrGetFull(url, oneDriveFileName, onSuccess, onError)
			{
				var xmlhttp;
				var requestedFileName=oneDriveFileName;
				try
				{
					xmlhttp=new XMLHttpRequest;
					xmlhttp.onreadystatechange=function()
					{
						if(xmlhttp.readyState==4)
							if(xmlhttp.status==200)
								onSuccess(xmlhttp,requestedFileName);
							else
								onError(xmlhttp.status)
					};
					xmlhttp.open("GET",url,true);
					xmlhttp.send()
				}
				catch(ex)
				{
					onError(ex)
				}
			},
			encodeBase64: function OSF_Outil$encodeBase64(input)
			{
				if(!input)
					return input;
				var codex="ABCDEFGHIJKLMNOP"+"QRSTUVWXYZabcdef"+"ghijklmnopqrstuv"+"wxyz0123456789+/=";
				var output=[];
				var temp=[];
				var index=0;
				var c1,
					c2,
					c3,
					a,
					b,
					c;
				var i;
				var length=input.length;
				do
				{
					c1=input.charCodeAt(index++);
					c2=input.charCodeAt(index++);
					c3=input.charCodeAt(index++);
					i=0;
					a=c1 & 255;
					b=c1 >> 8;
					c=c2 & 255;
					temp[i++]=a >> 2;
					temp[i++]=(a & 3) << 4 | b >> 4;
					temp[i++]=(b & 15) << 2 | c >> 6;
					temp[i++]=c & 63;
					if(!isNaN(c2))
					{
						a=c2 >> 8;
						b=c3 & 255;
						c=c3 >> 8;
						temp[i++]=a >> 2;
						temp[i++]=(a & 3) << 4 | b >> 4;
						temp[i++]=(b & 15) << 2 | c >> 6;
						temp[i++]=c & 63
					}
					if(isNaN(c2))
						temp[i - 1]=64;
					else if(isNaN(c3))
					{
						temp[i - 2]=64;
						temp[i - 1]=64
					}
					for(var t=0; t < i; t++)
						output.push(codex.charAt(temp[t]))
				} while(index < length);
				return output.join("")
			},
			getSessionStorage: function OSF_Outil$getSessionStorage()
			{
				return _getSessionStorage()
			},
			getLocalStorage: function OSF_Outil$getLocalStorage()
			{
				if(!_safeLocalStorage)
				{
					try
					{
						var localStorage=window.localStorage
					}
					catch(ex)
					{
						localStorage=null
					}
					_safeLocalStorage=new OfficeExt.SafeStorage(localStorage)
				}
				return _safeLocalStorage
			},
			convertIntToCssHexColor: function OSF_Outil$convertIntToCssHexColor(val)
			{
				var hex="#"+(Number(val)+16777216).toString(16).slice(-6);
				return hex
			},
			attachClickHandler: function OSF_Outil$attachClickHandler(element, handler)
			{
				element.onclick=function(e)
				{
					handler()
				};
				element.ontouchend=function(e)
				{
					handler();
					e.preventDefault()
				}
			},
			getQueryStringParamValue: function OSF_Outil$getQueryStringParamValue(queryString, paramName)
			{
				var e=Function._validateParams(arguments,[{
							name: "queryString",
							type: String,
							mayBeNull: false
						},{
							name: "paramName",
							type: String,
							mayBeNull: false
						}]);
				if(e)
				{
					OsfMsAjaxFactory.msAjaxDebug.trace("OSF_Outil_getQueryStringParamValue: Parameters cannot be null.");
					return""
				}
				var queryExp=new RegExp("[\\?&]"+paramName+"=([^&#]*)","i");
				if(!queryExp.test(queryString))
				{
					OsfMsAjaxFactory.msAjaxDebug.trace("OSF_Outil_getQueryStringParamValue: The parameter is not found.");
					return""
				}
				return queryExp.exec(queryString)[1]
			},
			isiOS: function OSF_Outil$isiOS()
			{
				return window.navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false
			},
			isChrome: function OSF_Outil$isChrome()
			{
				return window.navigator.userAgent.indexOf("Chrome") > 0 && !OSF.OUtil.isEdge()
			},
			isEdge: function OSF_Outil$isEdge()
			{
				return window.navigator.userAgent.indexOf("Edge") > 0
			},
			isIE: function OSF_Outil$isIE()
			{
				return window.navigator.userAgent.indexOf("Trident") > 0
			},
			isFirefox: function OSF_Outil$isFirefox()
			{
				return window.navigator.userAgent.indexOf("Firefox") > 0
			},
			shallowCopy: function OSF_Outil$shallowCopy(sourceObj)
			{
				var copyObj=sourceObj.constructor();
				for(var property in sourceObj)
					if(sourceObj.hasOwnProperty(property))
						copyObj[property]=sourceObj[property];
				return copyObj
			},
			createObject: function OSF_Outil$createObject(properties)
			{
				var obj=null;
				if(properties)
				{
					obj={};
					var len=properties.length;
					for(var i=0; i < len; i++)
						obj[properties[i].name]=properties[i].value
				}
				return obj
			},
			addClass: function OSF_OUtil$addClass(elmt, val)
			{
				if(!OSF.OUtil.hasClass(elmt,val))
				{
					var className=elmt.getAttribute(_classN);
					if(className)
						elmt.setAttribute(_classN,className+" "+val);
					else
						elmt.setAttribute(_classN,val)
				}
			},
			hasClass: function OSF_OUtil$hasClass(elmt, clsName)
			{
				var className=elmt.getAttribute(_classN);
				return className && className.match(new RegExp("(\\s|^)"+clsName+"(\\s|$)"))
			},
			focusToFirstTabbable: function OSF_OUtil$focusToFirstTabbable(all, backward)
			{
				var next;
				var focused=false;
				var candidate;
				var setFlag=function(e)
					{
						focused=true
					};
				var findNextPos=function(allLen, currPos, backward)
					{
						if(currPos < 0 || currPos > allLen)
							return-1;
						else if(currPos===0 && backward)
							return-1;
						else if(currPos===allLen - 1 && !backward)
							return-1;
						if(backward)
							return currPos - 1;
						else
							return currPos+1
					};
				all=_reOrderTabbableElements(all);
				next=backward ? all.length - 1 : 0;
				if(all.length===0)
					return null;
				while(!focused && next >=0 && next < all.length)
				{
					candidate=all[next];
					window.focus();
					candidate.addEventListener("focus",setFlag);
					candidate.focus();
					candidate.removeEventListener("focus",setFlag);
					next=findNextPos(all.length,next,backward);
					if(!focused && candidate===document.activeElement)
						focused=true
				}
				if(focused)
					return candidate;
				else
					return null
			},
			focusToNextTabbable: function OSF_OUtil$focusToNextTabbable(all, curr, shift)
			{
				var currPos;
				var next;
				var focused=false;
				var candidate;
				var setFlag=function(e)
					{
						focused=true
					};
				var findCurrPos=function(all, curr)
					{
						var i=0;
						for(; i < all.length; i++)
							if(all[i]===curr)
								return i;
						return-1
					};
				var findNextPos=function(allLen, currPos, shift)
					{
						if(currPos < 0 || currPos > allLen)
							return-1;
						else if(currPos===0 && shift)
							return-1;
						else if(currPos===allLen - 1 && !shift)
							return-1;
						if(shift)
							return currPos - 1;
						else
							return currPos+1
					};
				all=_reOrderTabbableElements(all);
				currPos=findCurrPos(all,curr);
				next=findNextPos(all.length,currPos,shift);
				if(next < 0)
					return null;
				while(!focused && next >=0 && next < all.length)
				{
					candidate=all[next];
					candidate.addEventListener("focus",setFlag);
					candidate.focus();
					candidate.removeEventListener("focus",setFlag);
					next=findNextPos(all.length,next,shift);
					if(!focused && candidate===document.activeElement)
						focused=true
				}
				if(focused)
					return candidate;
				else
					return null
			}
		}
}();
OSF.OUtil.Guid=function()
{
	var hexCode=["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
	return{generateNewGuid: function OSF_Outil_Guid$generateNewGuid()
			{
				var result="";
				var tick=(new Date).getTime();
				var index=0;
				for(; index < 32 && tick > 0; index++)
				{
					if(index==8 || index==12 || index==16 || index==20)
						result+="-";
					result+=hexCode[tick % 16];
					tick=Math.floor(tick / 16)
				}
				for(; index < 32; index++)
				{
					if(index==8 || index==12 || index==16 || index==20)
						result+="-";
					result+=hexCode[Math.floor(Math.random() * 16)]
				}
				return result
			}}
}();
window.OSF=OSF;
OSF.OUtil.setNamespace("OSF",window);
OSF.AppName={
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
	OneNoteWinRT: 8388608
};
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
	Select: 0,
	UnSelect: 1,
	CancelDialog: 2,
	InsertAgave: 3,
	CtrlF6In: 4,
	CtrlF6Exit: 5,
	CtrlF6ExitShift: 6,
	SelectWithError: 7,
	NotifyHostError: 8,
	RefreshAddinCommands: 9,
	PageIsReady: 10,
	TabIn: 11,
	TabInShift: 12,
	TabExit: 13,
	TabExitShift: 14,
	EscExit: 15,
	F2Exit: 16,
	ExitNoFocusable: 17,
	ExitNoFocusableShift: 18
};
OSF.SharedConstants={NotificationConversationIdSuffix: "_ntf"};
OSF.DialogMessageType={
	DialogMessageReceived: 0,
	DialogClosed: 12006
};
OSF.OfficeAppContext=function OSF_OfficeAppContext(id, appName, appVersion, appUILocale, dataLocale, docUrl, clientMode, settings, reason, osfControlType, eToken, correlationId, appInstanceId, touchEnabled, commerceAllowed, appMinorVersion, requirementMatrix, hostCustomMessage, clientWindowHeight, clientWindowWidth, addinName)
{
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
	this._appInstanceId=appInstanceId;
	this._touchEnabled=touchEnabled;
	this._commerceAllowed=commerceAllowed;
	this._appMinorVersion=appMinorVersion;
	this._requirementMatrix=requirementMatrix;
	this._hostCustomMessage=hostCustomMessage;
	this._isDialog=false;
	this._clientWindowHeight=clientWindowHeight;
	this._clientWindowWidth=clientWindowWidth;
	this._addinName=addinName;
	this.get_id=function get_id()
	{
		return this._id
	};
	this.get_appName=function get_appName()
	{
		return this._appName
	};
	this.get_appVersion=function get_appVersion()
	{
		return this._appVersion
	};
	this.get_appUILocale=function get_appUILocale()
	{
		return this._appUILocale
	};
	this.get_dataLocale=function get_dataLocale()
	{
		return this._dataLocale
	};
	this.get_docUrl=function get_docUrl()
	{
		return this._docUrl
	};
	this.get_clientMode=function get_clientMode()
	{
		return this._clientMode
	};
	this.get_bindings=function get_bindings()
	{
		return this._bindings
	};
	this.get_settings=function get_settings()
	{
		return this._settings
	};
	this.get_reason=function get_reason()
	{
		return this._reason
	};
	this.get_osfControlType=function get_osfControlType()
	{
		return this._osfControlType
	};
	this.get_eToken=function get_eToken()
	{
		return this._eToken
	};
	this.get_correlationId=function get_correlationId()
	{
		return this._correlationId
	};
	this.get_appInstanceId=function get_appInstanceId()
	{
		return this._appInstanceId
	};
	this.get_touchEnabled=function get_touchEnabled()
	{
		return this._touchEnabled
	};
	this.get_commerceAllowed=function get_commerceAllowed()
	{
		return this._commerceAllowed
	};
	this.get_appMinorVersion=function get_appMinorVersion()
	{
		return this._appMinorVersion
	};
	this.get_requirementMatrix=function get_requirementMatrix()
	{
		return this._requirementMatrix
	};
	this.get_hostCustomMessage=function get_hostCustomMessage()
	{
		return this._hostCustomMessage
	};
	this.get_isDialog=function get_isDialog()
	{
		return this._isDialog
	};
	this.get_clientWindowHeight=function get_clientWindowHeight()
	{
		return this._clientWindowHeight
	};
	this.get_clientWindowWidth=function get_clientWindowWidth()
	{
		return this._clientWindowWidth
	};
	this.get_addinName=function get_addinName()
	{
		return this._addinName
	}
};
OSF.OsfControlType={
	DocumentLevel: 0,
	ContainerLevel: 1
};
OSF.ClientMode={
	ReadOnly: 0,
	ReadWrite: 1
};
OSF.OUtil.setNamespace("Microsoft",window);
OSF.OUtil.setNamespace("Office",Microsoft);
OSF.OUtil.setNamespace("Client",Microsoft.Office);
OSF.OUtil.setNamespace("WebExtension",Microsoft.Office);
Microsoft.Office.WebExtension.InitializationReason={
	Inserted: "inserted",
	DocumentOpened: "documentOpened"
};
Microsoft.Office.WebExtension.ValueFormat={
	Unformatted: "unformatted",
	Formatted: "formatted"
};
Microsoft.Office.WebExtension.FilterType={All: "all"};
Microsoft.Office.WebExtension.Parameters={
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
	DisplayInIframe: "displayInIframe"
};
OSF.OUtil.setNamespace("DDA",OSF);
OSF.DDA.DocumentMode={
	ReadOnly: 1,
	ReadWrite: 0
};
OSF.DDA.PropertyDescriptors={AsyncResultStatus: "AsyncResultStatus"};
OSF.DDA.EventDescriptors={};
OSF.DDA.ListDescriptors={};
OSF.DDA.UI={};
OSF.DDA.getXdmEventName=function OSF_DDA$GetXdmEventName(id, eventType)
{
	if(eventType==Microsoft.Office.WebExtension.EventType.BindingSelectionChanged || eventType==Microsoft.Office.WebExtension.EventType.BindingDataChanged || eventType==Microsoft.Office.WebExtension.EventType.DataNodeDeleted || eventType==Microsoft.Office.WebExtension.EventType.DataNodeInserted || eventType==Microsoft.Office.WebExtension.EventType.DataNodeReplaced)
		return id+"_"+eventType;
	else
		return eventType
};
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
	dispidGetFilePropertiesMethod: 86,
	dispidClearFormatsMethod: 87,
	dispidSetTableOptionsMethod: 88,
	dispidSetFormatsMethod: 89,
	dispidExecuteRichApiRequestMethod: 93,
	dispidAppCommandInvocationCompletedMethod: 94,
	dispidCloseContainerMethod: 97,
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
	dispidMethodMax: 144,
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
	dispidCreateTaskMethod: 124
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
	dispidDialogNotificationShownInAddinEvent: 11,
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
OSF.DDA.ErrorCodeManager=function()
{
	var _errorMappings={};
	return{
			getErrorArgs: function OSF_DDA_ErrorCodeManager$getErrorArgs(errorCode)
			{
				var errorArgs=_errorMappings[errorCode];
				if(!errorArgs)
					errorArgs=_errorMappings[this.errorCodes.ooeInternalError];
				else
				{
					if(!errorArgs.name)
						errorArgs.name=_errorMappings[this.errorCodes.ooeInternalError].name;
					if(!errorArgs.message)
						errorArgs.message=_errorMappings[this.errorCodes.ooeInternalError].message
				}
				return errorArgs
			},
			addErrorMessage: function OSF_DDA_ErrorCodeManager$addErrorMessage(errorCode, errorNameMessage)
			{
				_errorMappings[errorCode]=errorNameMessage
			},
			errorCodes: {
				ooeSuccess: 0,
				ooeChunkResult: 1,
				ooeCoercionTypeNotSupported: 1e3,
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
				ooeUnsupportedDataObject: 2e3,
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
				ooeSelectionCannotBound: 3e3,
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
				ooeSettingNameNotExist: 4e3,
				ooeSettingsCannotSave: 4001,
				ooeSettingsAreStale: 4002,
				ooeOperationNotSupported: 5e3,
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
				ooeCustomXmlNodeNotFound: 6e3,
				ooeCustomXmlError: 6100,
				ooeCustomXmlExceedQuota: 6101,
				ooeCustomXmlOutOfDate: 6102,
				ooeNoCapability: 7e3,
				ooeCannotNavTo: 7001,
				ooeSpecifiedIdNotExist: 7002,
				ooeNavOutOfBound: 7004,
				ooeElementMissing: 8e3,
				ooeProtectedError: 8001,
				ooeInvalidCellsValue: 8010,
				ooeInvalidTableOptionValue: 8011,
				ooeInvalidFormatValue: 8012,
				ooeRowIndexOutOfRange: 8020,
				ooeColIndexOutOfRange: 8021,
				ooeFormatValueOutOfRange: 8022,
				ooeCellFormatAmountBeyondLimits: 8023,
				ooeMemoryFileLimit: 11e3,
				ooeNetworkProblemRetrieveFile: 11001,
				ooeInvalidSliceSize: 11002,
				ooeInvalidCallback: 11101,
				ooeInvalidWidth: 12e3,
				ooeInvalidHeight: 12001,
				ooeNavigationError: 12002,
				ooeInvalidScheme: 12003,
				ooeAppDomains: 12004,
				ooeRequireHTTPS: 12005,
				ooeWebDialogClosed: 12006,
				ooeDialogAlreadyOpened: 12007,
				ooeEndUserAllow: 12008,
				ooeEndUserIgnore: 12009
			},
			initializeErrorMessages: function OSF_DDA_ErrorCodeManager$initializeErrorMessages(stringNS)
			{
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotSupported]={
					name: stringNS.L_InvalidCoercion,
					message: stringNS.L_CoercionTypeNotSupported
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetSelectionNotMatchDataType]={
					name: stringNS.L_DataReadError,
					message: stringNS.L_GetSelectionNotSupported
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCoercionTypeNotMatchBinding]={
					name: stringNS.L_InvalidCoercion,
					message: stringNS.L_CoercionTypeNotMatchBinding
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetRowColumnCounts]={
					name: stringNS.L_DataReadError,
					message: stringNS.L_InvalidGetRowColumnCounts
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSelectionNotSupportCoercionType]={
					name: stringNS.L_DataReadError,
					message: stringNS.L_SelectionNotSupportCoercionType
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetStartRowColumn]={
					name: stringNS.L_DataReadError,
					message: stringNS.L_InvalidGetStartRowColumn
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNonUniformPartialGetNotSupported]={
					name: stringNS.L_DataReadError,
					message: stringNS.L_NonUniformPartialGetNotSupported
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetDataIsTooLarge]={
					name: stringNS.L_DataReadError,
					message: stringNS.L_GetDataIsTooLarge
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeFileTypeNotSupported]={
					name: stringNS.L_DataReadError,
					message: stringNS.L_FileTypeNotSupported
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeGetDataParametersConflict]={
					name: stringNS.L_DataReadError,
					message: stringNS.L_GetDataParametersConflict
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetColumns]={
					name: stringNS.L_DataReadError,
					message: stringNS.L_InvalidGetColumns
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidGetRows]={
					name: stringNS.L_DataReadError,
					message: stringNS.L_InvalidGetRows
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidReadForBlankRow]={
					name: stringNS.L_DataReadError,
					message: stringNS.L_InvalidReadForBlankRow
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedDataObject]={
					name: stringNS.L_DataWriteError,
					message: stringNS.L_UnsupportedDataObject
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCannotWriteToSelection]={
					name: stringNS.L_DataWriteError,
					message: stringNS.L_CannotWriteToSelection
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchSelection]={
					name: stringNS.L_DataWriteError,
					message: stringNS.L_DataNotMatchSelection
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOverwriteWorksheetData]={
					name: stringNS.L_DataWriteError,
					message: stringNS.L_OverwriteWorksheetData
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchBindingSize]={
					name: stringNS.L_DataWriteError,
					message: stringNS.L_DataNotMatchBindingSize
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetStartRowColumn]={
					name: stringNS.L_DataWriteError,
					message: stringNS.L_InvalidSetStartRowColumn
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidDataFormat]={
					name: stringNS.L_InvalidFormat,
					message: stringNS.L_InvalidDataFormat
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchCoercionType]={
					name: stringNS.L_InvalidDataObject,
					message: stringNS.L_DataNotMatchCoercionType
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDataNotMatchBindingType]={
					name: stringNS.L_InvalidDataObject,
					message: stringNS.L_DataNotMatchBindingType
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSetDataIsTooLarge]={
					name: stringNS.L_DataWriteError,
					message: stringNS.L_SetDataIsTooLarge
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNonUniformPartialSetNotSupported]={
					name: stringNS.L_DataWriteError,
					message: stringNS.L_NonUniformPartialSetNotSupported
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetColumns]={
					name: stringNS.L_DataWriteError,
					message: stringNS.L_InvalidSetColumns
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSetRows]={
					name: stringNS.L_DataWriteError,
					message: stringNS.L_InvalidSetRows
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSetDataParametersConflict]={
					name: stringNS.L_DataWriteError,
					message: stringNS.L_SetDataParametersConflict
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSelectionCannotBound]={
					name: stringNS.L_BindingCreationError,
					message: stringNS.L_SelectionCannotBound
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBindingNotExist]={
					name: stringNS.L_InvalidBindingError,
					message: stringNS.L_BindingNotExist
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBindingToMultipleSelection]={
					name: stringNS.L_BindingCreationError,
					message: stringNS.L_BindingToMultipleSelection
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSelectionForBindingType]={
					name: stringNS.L_BindingCreationError,
					message: stringNS.L_InvalidSelectionForBindingType
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupportedOnThisBindingType]={
					name: stringNS.L_InvalidBindingOperation,
					message: stringNS.L_OperationNotSupportedOnThisBindingType
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNamedItemNotFound]={
					name: stringNS.L_BindingCreationError,
					message: stringNS.L_NamedItemNotFound
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeMultipleNamedItemFound]={
					name: stringNS.L_BindingCreationError,
					message: stringNS.L_MultipleNamedItemFound
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidNamedItemForBindingType]={
					name: stringNS.L_BindingCreationError,
					message: stringNS.L_InvalidNamedItemForBindingType
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnknownBindingType]={
					name: stringNS.L_InvalidBinding,
					message: stringNS.L_UnknownBindingType
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupportedOnMatrixData]={
					name: stringNS.L_InvalidBindingOperation,
					message: stringNS.L_OperationNotSupportedOnMatrixData
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidColumnsForBinding]={
					name: stringNS.L_InvalidBinding,
					message: stringNS.L_InvalidColumnsForBinding
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingNameNotExist]={
					name: stringNS.L_ReadSettingsError,
					message: stringNS.L_SettingNameNotExist
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingsCannotSave]={
					name: stringNS.L_SaveSettingsError,
					message: stringNS.L_SettingsCannotSave
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSettingsAreStale]={
					name: stringNS.L_SettingsStaleError,
					message: stringNS.L_SettingsAreStale
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeOperationNotSupported]={
					name: stringNS.L_HostError,
					message: stringNS.L_OperationNotSupported
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError]={
					name: stringNS.L_InternalError,
					message: stringNS.L_InternalErrorDescription
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDocumentReadOnly]={
					name: stringNS.L_PermissionDenied,
					message: stringNS.L_DocumentReadOnly
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerNotExist]={
					name: stringNS.L_EventRegistrationError,
					message: stringNS.L_EventHandlerNotExist
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext]={
					name: stringNS.L_InvalidAPICall,
					message: stringNS.L_InvalidApiCallInContext
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeShuttingDown]={
					name: stringNS.L_ShuttingDown,
					message: stringNS.L_ShuttingDown
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedEnumeration]={
					name: stringNS.L_UnsupportedEnumeration,
					message: stringNS.L_UnsupportedEnumerationMessage
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeIndexOutOfRange]={
					name: stringNS.L_IndexOutOfRange,
					message: stringNS.L_IndexOutOfRange
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeBrowserAPINotSupported]={
					name: stringNS.L_APINotSupported,
					message: stringNS.L_BrowserAPINotSupported
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequestTimeout]={
					name: stringNS.L_APICallFailed,
					message: stringNS.L_RequestTimeout
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeTooManyIncompleteRequests]={
					name: stringNS.L_APICallFailed,
					message: stringNS.L_TooManyIncompleteRequests
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequestTokenUnavailable]={
					name: stringNS.L_APICallFailed,
					message: stringNS.L_RequestTokenUnavailable
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeActivityLimitReached]={
					name: stringNS.L_APICallFailed,
					message: stringNS.L_ActivityLimitReached
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlNodeNotFound]={
					name: stringNS.L_InvalidNode,
					message: stringNS.L_CustomXmlNodeNotFound
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlError]={
					name: stringNS.L_CustomXmlError,
					message: stringNS.L_CustomXmlError
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlExceedQuota]={
					name: stringNS.L_CustomXmlError,
					message: stringNS.L_CustomXmlError
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCustomXmlOutOfDate]={
					name: stringNS.L_CustomXmlError,
					message: stringNS.L_CustomXmlError
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability]={
					name: stringNS.L_PermissionDenied,
					message: stringNS.L_NoCapability
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCannotNavTo]={
					name: stringNS.L_CannotNavigateTo,
					message: stringNS.L_CannotNavigateTo
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeSpecifiedIdNotExist]={
					name: stringNS.L_SpecifiedIdNotExist,
					message: stringNS.L_SpecifiedIdNotExist
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNavOutOfBound]={
					name: stringNS.L_NavOutOfBound,
					message: stringNS.L_NavOutOfBound
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCellDataAmountBeyondLimits]={
					name: stringNS.L_DataWriteReminder,
					message: stringNS.L_CellDataAmountBeyondLimits
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeElementMissing]={
					name: stringNS.L_MissingParameter,
					message: stringNS.L_ElementMissing
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeProtectedError]={
					name: stringNS.L_PermissionDenied,
					message: stringNS.L_NoCapability
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidCellsValue]={
					name: stringNS.L_InvalidValue,
					message: stringNS.L_InvalidCellsValue
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidTableOptionValue]={
					name: stringNS.L_InvalidValue,
					message: stringNS.L_InvalidTableOptionValue
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidFormatValue]={
					name: stringNS.L_InvalidValue,
					message: stringNS.L_InvalidFormatValue
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRowIndexOutOfRange]={
					name: stringNS.L_OutOfRange,
					message: stringNS.L_RowIndexOutOfRange
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeColIndexOutOfRange]={
					name: stringNS.L_OutOfRange,
					message: stringNS.L_ColIndexOutOfRange
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeFormatValueOutOfRange]={
					name: stringNS.L_OutOfRange,
					message: stringNS.L_FormatValueOutOfRange
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeCellFormatAmountBeyondLimits]={
					name: stringNS.L_FormattingReminder,
					message: stringNS.L_CellFormatAmountBeyondLimits
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeMemoryFileLimit]={
					name: stringNS.L_MemoryLimit,
					message: stringNS.L_CloseFileBeforeRetrieve
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNetworkProblemRetrieveFile]={
					name: stringNS.L_NetworkProblem,
					message: stringNS.L_NetworkProblemRetrieveFile
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidSliceSize]={
					name: stringNS.L_InvalidValue,
					message: stringNS.L_SliceSizeNotSupported
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeDialogAlreadyOpened]={
					name: stringNS.L_DisplayDialogError,
					message: stringNS.L_DialogAlreadyOpened
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidWidth]={
					name: stringNS.L_IndexOutOfRange,
					message: stringNS.L_IndexOutOfRange
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidHeight]={
					name: stringNS.L_IndexOutOfRange,
					message: stringNS.L_IndexOutOfRange
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeNavigationError]={
					name: stringNS.L_DisplayDialogError,
					message: stringNS.L_NetworkProblem
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidScheme]={
					name: stringNS.L_DialogNavigateError,
					message: stringNS.L_DialogAddressNotTrusted
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeAppDomains]={
					name: stringNS.L_DisplayDialogError,
					message: stringNS.L_DialogAddressNotTrusted
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeRequireHTTPS]={
					name: stringNS.L_DisplayDialogError,
					message: stringNS.L_DialogAddressNotTrusted
				};
				_errorMappings[OSF.DDA.ErrorCodeManager.errorCodes.ooeEndUserIgnore]={
					name: stringNS.L_DisplayDialogError,
					message: stringNS.L_UserClickIgnore
				}
			}
		}
}();
var OfficeExt;
(function(OfficeExt)
{
	var Requirement;
	(function(Requirement)
	{
		var RequirementMatrix=function()
			{
				function RequirementMatrix(_setMap)
				{
					this.isSetSupported=function _isSetSupported(name, minVersion)
					{
						if(name==undefined)
							return false;
						if(minVersion==undefined)
							minVersion=0;
						var setSupportArray=this._setMap;
						var sets=setSupportArray._sets;
						if(sets.hasOwnProperty(name.toLowerCase()))
						{
							var setMaxVersion=sets[name.toLowerCase()];
							return setMaxVersion > 0 && setMaxVersion >=minVersion
						}
						else
							return false
					};
					this._setMap=_setMap
				}
				return RequirementMatrix
			}();
		Requirement.RequirementMatrix=RequirementMatrix;
		var DefaultSetRequirement=function()
			{
				function DefaultSetRequirement(setMap)
				{
					this._addSetMap=function DefaultSetRequirement_addSetMap(addedSet)
					{
						for(var name in addedSet)
							this._sets[name]=addedSet[name]
					};
					this._sets=setMap
				}
				return DefaultSetRequirement
			}();
		Requirement.DefaultSetRequirement=DefaultSetRequirement;
		var ExcelClientDefaultSetRequirement=function(_super)
			{
				__extends(ExcelClientDefaultSetRequirement,_super);
				function ExcelClientDefaultSetRequirement()
				{
					_super.call(this,{
						bindingevents: 1.1,
						documentevents: 1.1,
						excelapi: 1.1,
						matrixbindings: 1.1,
						matrixcoercion: 1.1,
						selection: 1.1,
						settings: 1.1,
						tablebindings: 1.1,
						tablecoercion: 1.1,
						textbindings: 1.1,
						textcoercion: 1.1
					})
				}
				return ExcelClientDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.ExcelClientDefaultSetRequirement=ExcelClientDefaultSetRequirement;
		var ExcelClientV1DefaultSetRequirement=function(_super)
			{
				__extends(ExcelClientV1DefaultSetRequirement,_super);
				function ExcelClientV1DefaultSetRequirement()
				{
					_super.call(this);
					this._addSetMap({imagecoercion: 1.1})
				}
				return ExcelClientV1DefaultSetRequirement
			}(ExcelClientDefaultSetRequirement);
		Requirement.ExcelClientV1DefaultSetRequirement=ExcelClientV1DefaultSetRequirement;
		var OutlookClientDefaultSetRequirement=function(_super)
			{
				__extends(OutlookClientDefaultSetRequirement,_super);
				function OutlookClientDefaultSetRequirement()
				{
					_super.call(this,{mailbox: 1.3})
				}
				return OutlookClientDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.OutlookClientDefaultSetRequirement=OutlookClientDefaultSetRequirement;
		var WordClientDefaultSetRequirement=function(_super)
			{
				__extends(WordClientDefaultSetRequirement,_super);
				function WordClientDefaultSetRequirement()
				{
					_super.call(this,{
						bindingevents: 1.1,
						compressedfile: 1.1,
						customxmlparts: 1.1,
						documentevents: 1.1,
						file: 1.1,
						htmlcoercion: 1.1,
						matrixbindings: 1.1,
						matrixcoercion: 1.1,
						ooxmlcoercion: 1.1,
						pdffile: 1.1,
						selection: 1.1,
						settings: 1.1,
						tablebindings: 1.1,
						tablecoercion: 1.1,
						textbindings: 1.1,
						textcoercion: 1.1,
						textfile: 1.1,
						wordapi: 1.1
					})
				}
				return WordClientDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.WordClientDefaultSetRequirement=WordClientDefaultSetRequirement;
		var WordClientV1DefaultSetRequirement=function(_super)
			{
				__extends(WordClientV1DefaultSetRequirement,_super);
				function WordClientV1DefaultSetRequirement()
				{
					_super.call(this);
					this._addSetMap({
						customxmlparts: 1.2,
						wordapi: 1.2,
						imagecoercion: 1.1
					})
				}
				return WordClientV1DefaultSetRequirement
			}(WordClientDefaultSetRequirement);
		Requirement.WordClientV1DefaultSetRequirement=WordClientV1DefaultSetRequirement;
		var PowerpointClientDefaultSetRequirement=function(_super)
			{
				__extends(PowerpointClientDefaultSetRequirement,_super);
				function PowerpointClientDefaultSetRequirement()
				{
					_super.call(this,{
						activeview: 1.1,
						compressedfile: 1.1,
						documentevents: 1.1,
						file: 1.1,
						pdffile: 1.1,
						selection: 1.1,
						settings: 1.1,
						textcoercion: 1.1
					})
				}
				return PowerpointClientDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.PowerpointClientDefaultSetRequirement=PowerpointClientDefaultSetRequirement;
		var PowerpointClientV1DefaultSetRequirement=function(_super)
			{
				__extends(PowerpointClientV1DefaultSetRequirement,_super);
				function PowerpointClientV1DefaultSetRequirement()
				{
					_super.call(this);
					this._addSetMap({imagecoercion: 1.1})
				}
				return PowerpointClientV1DefaultSetRequirement
			}(PowerpointClientDefaultSetRequirement);
		Requirement.PowerpointClientV1DefaultSetRequirement=PowerpointClientV1DefaultSetRequirement;
		var ProjectClientDefaultSetRequirement=function(_super)
			{
				__extends(ProjectClientDefaultSetRequirement,_super);
				function ProjectClientDefaultSetRequirement()
				{
					_super.call(this,{
						selection: 1.1,
						textcoercion: 1.1
					})
				}
				return ProjectClientDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.ProjectClientDefaultSetRequirement=ProjectClientDefaultSetRequirement;
		var ExcelWebDefaultSetRequirement=function(_super)
			{
				__extends(ExcelWebDefaultSetRequirement,_super);
				function ExcelWebDefaultSetRequirement()
				{
					_super.call(this,{
						bindingevents: 1.1,
						documentevents: 1.1,
						matrixbindings: 1.1,
						matrixcoercion: 1.1,
						selection: 1.1,
						settings: 1.1,
						tablebindings: 1.1,
						tablecoercion: 1.1,
						textbindings: 1.1,
						textcoercion: 1.1,
						file: 1.1
					})
				}
				return ExcelWebDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.ExcelWebDefaultSetRequirement=ExcelWebDefaultSetRequirement;
		var WordWebDefaultSetRequirement=function(_super)
			{
				__extends(WordWebDefaultSetRequirement,_super);
				function WordWebDefaultSetRequirement()
				{
					_super.call(this,{
						customxmlparts: 1.1,
						documentevents: 1.1,
						file: 1.1,
						ooxmlcoercion: 1.1,
						selection: 1.1,
						settings: 1.1,
						textcoercion: 1.1
					})
				}
				return WordWebDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.WordWebDefaultSetRequirement=WordWebDefaultSetRequirement;
		var PowerpointWebDefaultSetRequirement=function(_super)
			{
				__extends(PowerpointWebDefaultSetRequirement,_super);
				function PowerpointWebDefaultSetRequirement()
				{
					_super.call(this,{
						activeview: 1.1,
						settings: 1.1
					})
				}
				return PowerpointWebDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.PowerpointWebDefaultSetRequirement=PowerpointWebDefaultSetRequirement;
		var OutlookWebDefaultSetRequirement=function(_super)
			{
				__extends(OutlookWebDefaultSetRequirement,_super);
				function OutlookWebDefaultSetRequirement()
				{
					_super.call(this,{mailbox: 1.3})
				}
				return OutlookWebDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.OutlookWebDefaultSetRequirement=OutlookWebDefaultSetRequirement;
		var SwayWebDefaultSetRequirement=function(_super)
			{
				__extends(SwayWebDefaultSetRequirement,_super);
				function SwayWebDefaultSetRequirement()
				{
					_super.call(this,{
						activeview: 1.1,
						documentevents: 1.1,
						selection: 1.1,
						settings: 1.1,
						textcoercion: 1.1
					})
				}
				return SwayWebDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.SwayWebDefaultSetRequirement=SwayWebDefaultSetRequirement;
		var AccessWebDefaultSetRequirement=function(_super)
			{
				__extends(AccessWebDefaultSetRequirement,_super);
				function AccessWebDefaultSetRequirement()
				{
					_super.call(this,{
						bindingevents: 1.1,
						partialtablebindings: 1.1,
						settings: 1.1,
						tablebindings: 1.1,
						tablecoercion: 1.1
					})
				}
				return AccessWebDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.AccessWebDefaultSetRequirement=AccessWebDefaultSetRequirement;
		var ExcelIOSDefaultSetRequirement=function(_super)
			{
				__extends(ExcelIOSDefaultSetRequirement,_super);
				function ExcelIOSDefaultSetRequirement()
				{
					_super.call(this,{
						bindingevents: 1.1,
						documentevents: 1.1,
						matrixbindings: 1.1,
						matrixcoercion: 1.1,
						selection: 1.1,
						settings: 1.1,
						tablebindings: 1.1,
						tablecoercion: 1.1,
						textbindings: 1.1,
						textcoercion: 1.1
					})
				}
				return ExcelIOSDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.ExcelIOSDefaultSetRequirement=ExcelIOSDefaultSetRequirement;
		var WordIOSDefaultSetRequirement=function(_super)
			{
				__extends(WordIOSDefaultSetRequirement,_super);
				function WordIOSDefaultSetRequirement()
				{
					_super.call(this,{
						bindingevents: 1.1,
						compressedfile: 1.1,
						customxmlparts: 1.1,
						documentevents: 1.1,
						file: 1.1,
						htmlcoercion: 1.1,
						matrixbindings: 1.1,
						matrixcoercion: 1.1,
						ooxmlcoercion: 1.1,
						pdffile: 1.1,
						selection: 1.1,
						settings: 1.1,
						tablebindings: 1.1,
						tablecoercion: 1.1,
						textbindings: 1.1,
						textcoercion: 1.1,
						textfile: 1.1
					})
				}
				return WordIOSDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.WordIOSDefaultSetRequirement=WordIOSDefaultSetRequirement;
		var WordIOSV1DefaultSetRequirement=function(_super)
			{
				__extends(WordIOSV1DefaultSetRequirement,_super);
				function WordIOSV1DefaultSetRequirement()
				{
					_super.call(this);
					this._addSetMap({
						customxmlparts: 1.2,
						wordapi: 1.2
					})
				}
				return WordIOSV1DefaultSetRequirement
			}(WordIOSDefaultSetRequirement);
		Requirement.WordIOSV1DefaultSetRequirement=WordIOSV1DefaultSetRequirement;
		var PowerpointIOSDefaultSetRequirement=function(_super)
			{
				__extends(PowerpointIOSDefaultSetRequirement,_super);
				function PowerpointIOSDefaultSetRequirement()
				{
					_super.call(this,{
						activeview: 1.1,
						compressedfile: 1.1,
						documentevents: 1.1,
						file: 1.1,
						pdffile: 1.1,
						selection: 1.1,
						settings: 1.1,
						textcoercion: 1.1
					})
				}
				return PowerpointIOSDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.PowerpointIOSDefaultSetRequirement=PowerpointIOSDefaultSetRequirement;
		var OutlookIOSDefaultSetRequirement=function(_super)
			{
				__extends(OutlookIOSDefaultSetRequirement,_super);
				function OutlookIOSDefaultSetRequirement()
				{
					_super.call(this,{mailbox: 1.1})
				}
				return OutlookIOSDefaultSetRequirement
			}(DefaultSetRequirement);
		Requirement.OutlookIOSDefaultSetRequirement=OutlookIOSDefaultSetRequirement;
		var RequirementsMatrixFactory=function()
			{
				function RequirementsMatrixFactory(){}
				RequirementsMatrixFactory.initializeOsfDda=function()
				{
					OSF.OUtil.setNamespace("Requirement",OSF.DDA)
				};
				RequirementsMatrixFactory.getDefaultRequirementMatrix=function(appContext)
				{
					this.initializeDefaultSetMatrix();
					var defaultRequirementMatrix=undefined;
					var clientRequirement=appContext.get_requirementMatrix();
					if(clientRequirement !=undefined && clientRequirement.length > 0 && typeof JSON !=="undefined")
					{
						var matrixItem=JSON.parse(appContext.get_requirementMatrix().toLowerCase());
						defaultRequirementMatrix=new RequirementMatrix(new DefaultSetRequirement(matrixItem))
					}
					else
					{
						var appLocator=RequirementsMatrixFactory.getClientFullVersionString(appContext);
						if(RequirementsMatrixFactory.DefaultSetArrayMatrix !=undefined && RequirementsMatrixFactory.DefaultSetArrayMatrix[appLocator] !=undefined)
							defaultRequirementMatrix=new RequirementMatrix(RequirementsMatrixFactory.DefaultSetArrayMatrix[appLocator]);
						else
							defaultRequirementMatrix=new RequirementMatrix(new DefaultSetRequirement({}))
					}
					return defaultRequirementMatrix
				};
				RequirementsMatrixFactory.getClientFullVersionString=function(appContext)
				{
					var appMinorVersion=appContext.get_appMinorVersion();
					var appMinorVersionString="";
					var appFullVersion="";
					var appName=appContext.get_appName();
					var isIOSClient=appName==1024 || appName==4096 || appName==8192 || appName==65536;
					if(isIOSClient && appContext.get_appVersion()==1)
						if(appName==4096 && appMinorVersion >=15)
							appFullVersion="16.00.01";
						else
							appFullVersion="16.00";
					else if(appContext.get_appName()==64)
						appFullVersion=appContext.get_appVersion();
					else
					{
						if(appMinorVersion < 10)
							appMinorVersionString="0"+appMinorVersion;
						else
							appMinorVersionString=""+appMinorVersion;
						appFullVersion=appContext.get_appVersion()+"."+appMinorVersionString
					}
					return appContext.get_appName()+"-"+appFullVersion
				};
				RequirementsMatrixFactory.initializeDefaultSetMatrix=function()
				{
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_RCLIENT_1600]=new ExcelClientDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_RCLIENT_1600]=new WordClientDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_RCLIENT_1600]=new PowerpointClientDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_RCLIENT_1601]=new ExcelClientV1DefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_RCLIENT_1601]=new WordClientV1DefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_RCLIENT_1601]=new PowerpointClientV1DefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_RCLIENT_1600]=new OutlookClientDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_WAC_1600]=new ExcelWebDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_WAC_1600]=new WordWebDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_WAC_1600]=new OutlookWebDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_WAC_1601]=new OutlookWebDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Project_RCLIENT_1600]=new ProjectClientDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Access_WAC_1600]=new AccessWebDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_WAC_1600]=new PowerpointWebDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Excel_IOS_1600]=new ExcelIOSDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.SWAY_WAC_1600]=new SwayWebDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_IOS_1600]=new WordIOSDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Word_IOS_16001]=new WordIOSV1DefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.PowerPoint_IOS_1600]=new PowerpointIOSDefaultSetRequirement;
					RequirementsMatrixFactory.DefaultSetArrayMatrix[RequirementsMatrixFactory.Outlook_IOS_1600]=new OutlookIOSDefaultSetRequirement
				};
				RequirementsMatrixFactory.Excel_RCLIENT_1600="1-16.00";
				RequirementsMatrixFactory.Excel_RCLIENT_1601="1-16.01";
				RequirementsMatrixFactory.Word_RCLIENT_1600="2-16.00";
				RequirementsMatrixFactory.Word_RCLIENT_1601="2-16.01";
				RequirementsMatrixFactory.PowerPoint_RCLIENT_1600="4-16.00";
				RequirementsMatrixFactory.PowerPoint_RCLIENT_1601="4-16.01";
				RequirementsMatrixFactory.Outlook_RCLIENT_1600="8-16.00";
				RequirementsMatrixFactory.Excel_WAC_1600="16-16.00";
				RequirementsMatrixFactory.Word_WAC_1600="32-16.00";
				RequirementsMatrixFactory.Outlook_WAC_1600="64-16.00";
				RequirementsMatrixFactory.Outlook_WAC_1601="64-16.01";
				RequirementsMatrixFactory.Project_RCLIENT_1600="128-16.00";
				RequirementsMatrixFactory.Access_WAC_1600="256-16.00";
				RequirementsMatrixFactory.PowerPoint_WAC_1600="512-16.00";
				RequirementsMatrixFactory.Excel_IOS_1600="1024-16.00";
				RequirementsMatrixFactory.SWAY_WAC_1600="2048-16.00";
				RequirementsMatrixFactory.Word_IOS_1600="4096-16.00";
				RequirementsMatrixFactory.Word_IOS_16001="4096-16.00.01";
				RequirementsMatrixFactory.PowerPoint_IOS_1600="8192-16.00";
				RequirementsMatrixFactory.Outlook_IOS_1600="65536-16.00";
				RequirementsMatrixFactory.DefaultSetArrayMatrix={};
				return RequirementsMatrixFactory
			}();
		Requirement.RequirementsMatrixFactory=RequirementsMatrixFactory
	})(Requirement=OfficeExt.Requirement || (OfficeExt.Requirement={}))
})(OfficeExt || (OfficeExt={}));
OfficeExt.Requirement.RequirementsMatrixFactory.initializeOsfDda();
Microsoft.Office.WebExtension.ApplicationMode={
	WebEditor: "webEditor",
	WebViewer: "webViewer",
	Client: "client"
};
Microsoft.Office.WebExtension.DocumentMode={
	ReadOnly: "readOnly",
	ReadWrite: "readWrite"
};
OSF.NamespaceManager=function OSF_NamespaceManager()
{
	var _userOffice;
	var _useShortcut=false;
	return{
			enableShortcut: function OSF_NamespaceManager$enableShortcut()
			{
				if(!_useShortcut)
				{
					if(window.Office)
						_userOffice=window.Office;
					else
						OSF.OUtil.setNamespace("Office",window);
					window.Office=Microsoft.Office.WebExtension;
					_useShortcut=true
				}
			},
			disableShortcut: function OSF_NamespaceManager$disableShortcut()
			{
				if(_useShortcut)
				{
					if(_userOffice)
						window.Office=_userOffice;
					else
						OSF.OUtil.unsetNamespace("Office",window);
					_useShortcut=false
				}
			}
		}
}();
OSF.NamespaceManager.enableShortcut();
Microsoft.Office.WebExtension.useShortNamespace=function Microsoft_Office_WebExtension_useShortNamespace(useShortcut)
{
	if(useShortcut)
		OSF.NamespaceManager.enableShortcut();
	else
		OSF.NamespaceManager.disableShortcut()
};
Microsoft.Office.WebExtension.select=function Microsoft_Office_WebExtension_select(str, errorCallback)
{
	var promise;
	if(str && typeof str=="string")
	{
		var index=str.indexOf("#");
		if(index !=-1)
		{
			var op=str.substring(0,index);
			var target=str.substring(index+1);
			switch(op)
			{
				case"binding":
				case"bindings":
					if(target)
						promise=new OSF.DDA.BindingPromise(target);
					break
			}
		}
	}
	if(!promise)
	{
		if(errorCallback)
		{
			var callbackType=typeof errorCallback;
			if(callbackType=="function")
			{
				var callArgs={};
				callArgs[Microsoft.Office.WebExtension.Parameters.Callback]=errorCallback;
				OSF.DDA.issueAsyncResult(callArgs,OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext,OSF.DDA.ErrorCodeManager.getErrorArgs(OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidApiCallInContext))
			}
			else
				throw OSF.OUtil.formatString(Strings.OfficeOM.L_CallbackNotAFunction,callbackType);
		}
	}
	else
	{
		promise.onFail=errorCallback;
		return promise
	}
};
OSF.DDA.Context=function OSF_DDA_Context(officeAppContext, document, license, appOM, getOfficeTheme)
{
	OSF.OUtil.defineEnumerableProperties(this,{
		contentLanguage: {value: officeAppContext.get_dataLocale()},
		displayLanguage: {value: officeAppContext.get_appUILocale()},
		touchEnabled: {value: officeAppContext.get_touchEnabled()},
		commerceAllowed: {value: officeAppContext.get_commerceAllowed()}
	});
	if(license)
		OSF.OUtil.defineEnumerableProperty(this,"license",{value: license});
	if(officeAppContext.ui)
		OSF.OUtil.defineEnumerableProperty(this,"ui",{value: officeAppContext.ui});
	if(!officeAppContext.get_isDialog())
	{
		if(document)
			OSF.OUtil.defineEnumerableProperty(this,"document",{value: document});
		if(appOM)
		{
			var displayName=appOM.displayName || "appOM";
			delete appOM.displayName;
			OSF.OUtil.defineEnumerableProperty(this,displayName,{value: appOM})
		}
		if(getOfficeTheme)
			OSF.OUtil.defineEnumerableProperty(this,"officeTheme",{get: function()
				{
					return getOfficeTheme()
				}});
		var requirements=OfficeExt.Requirement.RequirementsMatrixFactory.getDefaultRequirementMatrix(officeAppContext);
		OSF.OUtil.defineEnumerableProperty(this,"requirements",{value: requirements})
	}
};
OSF.DDA.OutlookContext=function OSF_DDA_OutlookContext(appContext, settings, license, appOM, getOfficeTheme)
{
	OSF.DDA.OutlookContext.uber.constructor.call(this,appContext,null,license,appOM,getOfficeTheme);
	if(settings)
		OSF.OUtil.defineEnumerableProperty(this,"roamingSettings",{value: settings})
};
OSF.OUtil.extend(OSF.DDA.OutlookContext,OSF.DDA.Context);
OSF.DDA.OutlookAppOm=function OSF_DDA_OutlookAppOm(appContext, window, appReady){};
OSF.DDA.Document=function OSF_DDA_Document(officeAppContext, settings)
{
	var mode;
	switch(officeAppContext.get_clientMode())
	{
		case OSF.ClientMode.ReadOnly:
			mode=Microsoft.Office.WebExtension.DocumentMode.ReadOnly;
			break;
		case OSF.ClientMode.ReadWrite:
			mode=Microsoft.Office.WebExtension.DocumentMode.ReadWrite;
			break
	}
	if(settings)
		OSF.OUtil.defineEnumerableProperty(this,"settings",{value: settings});
	OSF.OUtil.defineMutableProperties(this,{
		mode: {value: mode},
		url: {value: officeAppContext.get_docUrl()}
	})
};
OSF.DDA.JsomDocument=function OSF_DDA_JsomDocument(officeAppContext, bindingFacade, settings)
{
	OSF.DDA.JsomDocument.uber.constructor.call(this,officeAppContext,settings);
	if(bindingFacade)
		OSF.OUtil.defineEnumerableProperty(this,"bindings",{get: function OSF_DDA_Document$GetBindings()
			{
				return bindingFacade
			}});
	var am=OSF.DDA.AsyncMethodNames;
	OSF.DDA.DispIdHost.addAsyncMethods(this,[am.GetSelectedDataAsync,am.SetSelectedDataAsync]);
	OSF.DDA.DispIdHost.addEventSupport(this,new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged]))
};
OSF.OUtil.extend(OSF.DDA.JsomDocument,OSF.DDA.Document);
OSF.OUtil.defineEnumerableProperty(Microsoft.Office.WebExtension,"context",{get: function Microsoft_Office_WebExtension$GetContext()
	{
		var context;
		if(OSF && OSF._OfficeAppFactory)
			context=OSF._OfficeAppFactory.getContext();
		return context
	}});
OSF.DDA.License=function OSF_DDA_License(eToken)
{
	OSF.OUtil.defineEnumerableProperty(this,"value",{value: eToken})
};
OSF.DDA.ApiMethodCall=function OSF_DDA_ApiMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName)
{
	var requiredCount=requiredParameters.length;
	var getInvalidParameterString=OSF.OUtil.delayExecutionAndCache(function()
		{
			return OSF.OUtil.formatString(Strings.OfficeOM.L_InvalidParameters,displayName)
		});
	this.verifyArguments=function OSF_DDA_ApiMethodCall$VerifyArguments(params, args)
	{
		for(var name in params)
		{
			var param=params[name];
			var arg=args[name];
			if(param["enum"])
				switch(typeof arg)
				{
					case"string":
						if(OSF.OUtil.listContainsValue(param["enum"],arg))
							break;
					case"undefined":
						throw OSF.DDA.ErrorCodeManager.errorCodes.ooeUnsupportedEnumeration;
					default:
						throw getInvalidParameterString();
				}
			if(param["types"])
				if(!OSF.OUtil.listContainsValue(param["types"],typeof arg))
					throw getInvalidParameterString();
		}
	};
	this.extractRequiredArguments=function OSF_DDA_ApiMethodCall$ExtractRequiredArguments(userArgs, caller, stateInfo)
	{
		if(userArgs.length < requiredCount)
			throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_MissingRequiredArguments);
		var requiredArgs=[];
		var index;
		for(index=0; index < requiredCount; index++)
			requiredArgs.push(userArgs[index]);
		this.verifyArguments(requiredParameters,requiredArgs);
		var ret={};
		for(index=0; index < requiredCount; index++)
		{
			var param=requiredParameters[index];
			var arg=requiredArgs[index];
			if(param.verify)
			{
				var isValid=param.verify(arg,caller,stateInfo);
				if(!isValid)
					throw getInvalidParameterString();
			}
			ret[param.name]=arg
		}
		return ret
	},this.fillOptions=function OSF_DDA_ApiMethodCall$FillOptions(options, requiredArgs, caller, stateInfo)
	{
		options=options || {};
		for(var optionName in supportedOptions)
			if(!OSF.OUtil.listContainsKey(options,optionName))
			{
				var value=undefined;
				var option=supportedOptions[optionName];
				if(option.calculate && requiredArgs)
					value=option.calculate(requiredArgs,caller,stateInfo);
				if(!value && option.defaultValue !==undefined)
					value=option.defaultValue;
				options[optionName]=value
			}
		return options
	};
	this.constructCallArgs=function OSF_DAA_ApiMethodCall$ConstructCallArgs(required, options, caller, stateInfo)
	{
		var callArgs={};
		for(var r in required)
			callArgs[r]=required[r];
		for(var o in options)
			callArgs[o]=options[o];
		for(var s in privateStateCallbacks)
			callArgs[s]=privateStateCallbacks[s](caller,stateInfo);
		if(checkCallArgs)
			callArgs=checkCallArgs(callArgs,caller,stateInfo);
		return callArgs
	}
};
OSF.OUtil.setNamespace("AsyncResultEnum",OSF.DDA);
OSF.DDA.AsyncResultEnum.Properties={
	Context: "Context",
	Value: "Value",
	Status: "Status",
	Error: "Error"
};
Microsoft.Office.WebExtension.AsyncResultStatus={
	Succeeded: "succeeded",
	Failed: "failed"
};
OSF.DDA.AsyncResultEnum.ErrorCode={
	Success: 0,
	Failed: 1
};
OSF.DDA.AsyncResultEnum.ErrorProperties={
	Name: "Name",
	Message: "Message",
	Code: "Code"
};
OSF.DDA.AsyncMethodNames={};
OSF.DDA.AsyncMethodNames.addNames=function(methodNames)
{
	for(var entry in methodNames)
	{
		var am={};
		OSF.OUtil.defineEnumerableProperties(am,{
			id: {value: entry},
			displayName: {value: methodNames[entry]}
		});
		OSF.DDA.AsyncMethodNames[entry]=am
	}
};
OSF.DDA.AsyncMethodCall=function OSF_DDA_AsyncMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, onSucceeded, onFailed, checkCallArgs, displayName)
{
	var requiredCount=requiredParameters.length;
	var apiMethods=new OSF.DDA.ApiMethodCall(requiredParameters,supportedOptions,privateStateCallbacks,checkCallArgs,displayName);
	function OSF_DAA_AsyncMethodCall$ExtractOptions(userArgs, requiredArgs, caller, stateInfo)
	{
		if(userArgs.length > requiredCount+2)
			throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyArguments);
		var options,
			parameterCallback;
		for(var i=userArgs.length - 1; i >=requiredCount; i--)
		{
			var argument=userArgs[i];
			switch(typeof argument)
			{
				case"object":
					if(options)
						throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalObjects);
					else
						options=argument;
					break;
				case"function":
					if(parameterCallback)
						throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalFunction);
					else
						parameterCallback=argument;
					break;
				default:
					throw OsfMsAjaxFactory.msAjaxError.argument(Strings.OfficeOM.L_InValidOptionalArgument);
					break
			}
		}
		options=apiMethods.fillOptions(options,requiredArgs,caller,stateInfo);
		if(parameterCallback)
			if(options[Microsoft.Office.WebExtension.Parameters.Callback])
				throw Strings.OfficeOM.L_RedundantCallbackSpecification;
			else
				options[Microsoft.Office.WebExtension.Parameters.Callback]=parameterCallback;
		apiMethods.verifyArguments(supportedOptions,options);
		return options
	}
	this.verifyAndExtractCall=function OSF_DAA_AsyncMethodCall$VerifyAndExtractCall(userArgs, caller, stateInfo)
	{
		var required=apiMethods.extractRequiredArguments(userArgs,caller,stateInfo);
		var options=OSF_DAA_AsyncMethodCall$ExtractOptions(userArgs,required,caller,stateInfo);
		var callArgs=apiMethods.constructCallArgs(required,options,caller,stateInfo);
		return callArgs
	};
	this.processResponse=function OSF_DAA_AsyncMethodCall$ProcessResponse(status, response, caller, callArgs)
	{
		var payload;
		if(status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess)
			if(onSucceeded)
				payload=onSucceeded(response,caller,callArgs);
			else
				payload=response;
		else if(onFailed)
			payload=onFailed(status,response);
		else
			payload=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
		return payload
	};
	this.getCallArgs=function(suppliedArgs)
	{
		var options,
			parameterCallback;
		for(var i=suppliedArgs.length - 1; i >=requiredCount; i--)
		{
			var argument=suppliedArgs[i];
			switch(typeof argument)
			{
				case"object":
					options=argument;
					break;
				case"function":
					parameterCallback=argument;
					break
			}
		}
		options=options || {};
		if(parameterCallback)
			options[Microsoft.Office.WebExtension.Parameters.Callback]=parameterCallback;
		return options
	}
};
OSF.DDA.AsyncMethodCallFactory=function()
{
	return{manufacture: function(params)
			{
				var supportedOptions=params.supportedOptions ? OSF.OUtil.createObject(params.supportedOptions) : [];
				var privateStateCallbacks=params.privateStateCallbacks ? OSF.OUtil.createObject(params.privateStateCallbacks) : [];
				return new OSF.DDA.AsyncMethodCall(params.requiredArguments || [],supportedOptions,privateStateCallbacks,params.onSucceeded,params.onFailed,params.checkCallArgs,params.method.displayName)
			}}
}();
OSF.DDA.AsyncMethodCalls={};
OSF.DDA.AsyncMethodCalls.define=function(callDefinition)
{
	OSF.DDA.AsyncMethodCalls[callDefinition.method.id]=OSF.DDA.AsyncMethodCallFactory.manufacture(callDefinition)
};
OSF.DDA.Error=function OSF_DDA_Error(name, message, code)
{
	OSF.OUtil.defineEnumerableProperties(this,{
		name: {value: name},
		message: {value: message},
		code: {value: code}
	})
};
OSF.DDA.AsyncResult=function OSF_DDA_AsyncResult(initArgs, errorArgs)
{
	OSF.OUtil.defineEnumerableProperties(this,{
		value: {value: initArgs[OSF.DDA.AsyncResultEnum.Properties.Value]},
		status: {value: errorArgs ? Microsoft.Office.WebExtension.AsyncResultStatus.Failed : Microsoft.Office.WebExtension.AsyncResultStatus.Succeeded}
	});
	if(initArgs[OSF.DDA.AsyncResultEnum.Properties.Context])
		OSF.OUtil.defineEnumerableProperty(this,"asyncContext",{value: initArgs[OSF.DDA.AsyncResultEnum.Properties.Context]});
	if(errorArgs)
		OSF.OUtil.defineEnumerableProperty(this,"error",{value: new OSF.DDA.Error(errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name],errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message],errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code])})
};
OSF.DDA.issueAsyncResult=function OSF_DDA$IssueAsyncResult(callArgs, status, payload)
{
	var callback=callArgs[Microsoft.Office.WebExtension.Parameters.Callback];
	if(callback)
	{
		var asyncInitArgs={};
		asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Context]=callArgs[Microsoft.Office.WebExtension.Parameters.AsyncContext];
		var errorArgs;
		if(status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess)
			asyncInitArgs[OSF.DDA.AsyncResultEnum.Properties.Value]=payload;
		else
		{
			errorArgs={};
			payload=payload || OSF.DDA.ErrorCodeManager.getErrorArgs(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]=status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=payload.name || payload;
			errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=payload.message || payload
		}
		callback(new OSF.DDA.AsyncResult(asyncInitArgs,errorArgs))
	}
};
OSF.DDA.SyncMethodNames={};
OSF.DDA.SyncMethodNames.addNames=function(methodNames)
{
	for(var entry in methodNames)
	{
		var am={};
		OSF.OUtil.defineEnumerableProperties(am,{
			id: {value: entry},
			displayName: {value: methodNames[entry]}
		});
		OSF.DDA.SyncMethodNames[entry]=am
	}
};
OSF.DDA.SyncMethodCall=function OSF_DDA_SyncMethodCall(requiredParameters, supportedOptions, privateStateCallbacks, checkCallArgs, displayName)
{
	var requiredCount=requiredParameters.length;
	var apiMethods=new OSF.DDA.ApiMethodCall(requiredParameters,supportedOptions,privateStateCallbacks,checkCallArgs,displayName);
	function OSF_DAA_SyncMethodCall$ExtractOptions(userArgs, requiredArgs, caller, stateInfo)
	{
		if(userArgs.length > requiredCount+1)
			throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyArguments);
		var options,
			parameterCallback;
		for(var i=userArgs.length - 1; i >=requiredCount; i--)
		{
			var argument=userArgs[i];
			switch(typeof argument)
			{
				case"object":
					if(options)
						throw OsfMsAjaxFactory.msAjaxError.parameterCount(Strings.OfficeOM.L_TooManyOptionalObjects);
					else
						options=argument;
					break;
				default:
					throw OsfMsAjaxFactory.msAjaxError.argument(Strings.OfficeOM.L_InValidOptionalArgument);
					break
			}
		}
		options=apiMethods.fillOptions(options,requiredArgs,caller,stateInfo);
		apiMethods.verifyArguments(supportedOptions,options);
		return options
	}
	this.verifyAndExtractCall=function OSF_DAA_AsyncMethodCall$VerifyAndExtractCall(userArgs, caller, stateInfo)
	{
		var required=apiMethods.extractRequiredArguments(userArgs,caller,stateInfo);
		var options=OSF_DAA_SyncMethodCall$ExtractOptions(userArgs,required,caller,stateInfo);
		var callArgs=apiMethods.constructCallArgs(required,options,caller,stateInfo);
		return callArgs
	}
};
OSF.DDA.SyncMethodCallFactory=function()
{
	return{manufacture: function(params)
			{
				var supportedOptions=params.supportedOptions ? OSF.OUtil.createObject(params.supportedOptions) : [];
				return new OSF.DDA.SyncMethodCall(params.requiredArguments || [],supportedOptions,params.privateStateCallbacks,params.checkCallArgs,params.method.displayName)
			}}
}();
OSF.DDA.SyncMethodCalls={};
OSF.DDA.SyncMethodCalls.define=function(callDefinition)
{
	OSF.DDA.SyncMethodCalls[callDefinition.method.id]=OSF.DDA.SyncMethodCallFactory.manufacture(callDefinition)
};
OSF.DDA.ListType=function()
{
	var listTypes={};
	return{
			setListType: function OSF_DDA_ListType$AddListType(t, prop)
			{
				listTypes[t]=prop
			},
			isListType: function OSF_DDA_ListType$IsListType(t)
			{
				return OSF.OUtil.listContainsKey(listTypes,t)
			},
			getDescriptor: function OSF_DDA_ListType$getDescriptor(t)
			{
				return listTypes[t]
			}
		}
}();
OSF.DDA.HostParameterMap=function(specialProcessor, mappings)
{
	var toHostMap="toHost";
	var fromHostMap="fromHost";
	var self="self";
	var dynamicTypes={};
	dynamicTypes[Microsoft.Office.WebExtension.Parameters.Data]={
		toHost: function(data)
		{
			if(data !=null && data.rows !==undefined)
			{
				var tableData={};
				tableData[OSF.DDA.TableDataProperties.TableRows]=data.rows;
				tableData[OSF.DDA.TableDataProperties.TableHeaders]=data.headers;
				data=tableData
			}
			return data
		},
		fromHost: function(args)
		{
			return args
		}
	};
	dynamicTypes[Microsoft.Office.WebExtension.Parameters.SampleData]=dynamicTypes[Microsoft.Office.WebExtension.Parameters.Data];
	function mapValues(preimageSet, mapping)
	{
		var ret=preimageSet ? {} : undefined;
		for(var entry in preimageSet)
		{
			var preimage=preimageSet[entry];
			var image;
			if(OSF.DDA.ListType.isListType(entry))
			{
				image=[];
				for(var subEntry in preimage)
					image.push(mapValues(preimage[subEntry],mapping))
			}
			else if(OSF.OUtil.listContainsKey(dynamicTypes,entry))
				image=dynamicTypes[entry][mapping](preimage);
			else if(mapping==fromHostMap && specialProcessor.preserveNesting(entry))
				image=mapValues(preimage,mapping);
			else
			{
				var maps=mappings[entry];
				if(maps)
				{
					var map=maps[mapping];
					if(map)
					{
						image=map[preimage];
						if(image===undefined)
							image=preimage
					}
				}
				else
					image=preimage
			}
			ret[entry]=image
		}
		return ret
	}
	function generateArguments(imageSet, parameters)
	{
		var ret;
		for(var param in parameters)
		{
			var arg;
			if(specialProcessor.isComplexType(param))
				arg=generateArguments(imageSet,mappings[param][toHostMap]);
			else
				arg=imageSet[param];
			if(arg !=undefined)
			{
				if(!ret)
					ret={};
				var index=parameters[param];
				if(index==self)
					index=param;
				ret[index]=specialProcessor.pack(param,arg)
			}
		}
		return ret
	}
	function extractArguments(source, parameters, extracted)
	{
		if(!extracted)
			extracted={};
		for(var param in parameters)
		{
			var index=parameters[param];
			var value;
			if(index==self)
				value=source;
			else
				value=source[index];
			if(value===null || value===undefined)
				extracted[param]=undefined;
			else
			{
				value=specialProcessor.unpack(param,value);
				var map;
				if(specialProcessor.isComplexType(param))
				{
					map=mappings[param][fromHostMap];
					if(specialProcessor.preserveNesting(param))
						extracted[param]=extractArguments(value,map);
					else
						extractArguments(value,map,extracted)
				}
				else if(OSF.DDA.ListType.isListType(param))
				{
					map={};
					var entryDescriptor=OSF.DDA.ListType.getDescriptor(param);
					map[entryDescriptor]=self;
					var extractedValues=new Array(value.length);
					for(var item in value)
						extractedValues[item]=extractArguments(value[item],map);
					extracted[param]=extractedValues
				}
				else
					extracted[param]=value
			}
		}
		return extracted
	}
	function applyMap(mapName, preimage, mapping)
	{
		var parameters=mappings[mapName][mapping];
		var image;
		if(mapping=="toHost")
		{
			var imageSet=mapValues(preimage,mapping);
			image=generateArguments(imageSet,parameters)
		}
		else if(mapping=="fromHost")
		{
			var argumentSet=extractArguments(preimage,parameters);
			image=mapValues(argumentSet,mapping)
		}
		return image
	}
	if(!mappings)
		mappings={};
	this.addMapping=function(mapName, description)
	{
		var toHost,
			fromHost;
		if(description.map)
		{
			toHost=description.map;
			fromHost={};
			for(var preimage in toHost)
			{
				var image=toHost[preimage];
				if(image==self)
					image=preimage;
				fromHost[image]=preimage
			}
		}
		else
		{
			toHost=description.toHost;
			fromHost=description.fromHost
		}
		var pair=mappings[mapName];
		if(pair)
		{
			var currMap=pair[toHostMap];
			for(var th in currMap)
				toHost[th]=currMap[th];
			currMap=pair[fromHostMap];
			for(var fh in currMap)
				fromHost[fh]=currMap[fh]
		}
		else
			pair=mappings[mapName]={};
		pair[toHostMap]=toHost;
		pair[fromHostMap]=fromHost
	};
	this.toHost=function(mapName, preimage)
	{
		return applyMap(mapName,preimage,toHostMap)
	};
	this.fromHost=function(mapName, image)
	{
		return applyMap(mapName,image,fromHostMap)
	};
	this.self=self;
	this.addComplexType=function(ct)
	{
		specialProcessor.addComplexType(ct)
	};
	this.getDynamicType=function(dt)
	{
		return specialProcessor.getDynamicType(dt)
	};
	this.setDynamicType=function(dt, handler)
	{
		specialProcessor.setDynamicType(dt,handler)
	};
	this.dynamicTypes=dynamicTypes;
	this.doMapValues=function(preimageSet, mapping)
	{
		return mapValues(preimageSet,mapping)
	}
};
OSF.DDA.SpecialProcessor=function(complexTypes, dynamicTypes)
{
	this.addComplexType=function OSF_DDA_SpecialProcessor$addComplexType(ct)
	{
		complexTypes.push(ct)
	};
	this.getDynamicType=function OSF_DDA_SpecialProcessor$getDynamicType(dt)
	{
		return dynamicTypes[dt]
	};
	this.setDynamicType=function OSF_DDA_SpecialProcessor$setDynamicType(dt, handler)
	{
		dynamicTypes[dt]=handler
	};
	this.isComplexType=function OSF_DDA_SpecialProcessor$isComplexType(t)
	{
		return OSF.OUtil.listContainsValue(complexTypes,t)
	};
	this.isDynamicType=function OSF_DDA_SpecialProcessor$isDynamicType(p)
	{
		return OSF.OUtil.listContainsKey(dynamicTypes,p)
	};
	this.preserveNesting=function OSF_DDA_SpecialProcessor$preserveNesting(p)
	{
		var pn=[];
		if(OSF.DDA.PropertyDescriptors)
			pn.push(OSF.DDA.PropertyDescriptors.Subset);
		if(OSF.DDA.DataNodeEventProperties)
			pn=pn.concat([OSF.DDA.DataNodeEventProperties.OldNode,OSF.DDA.DataNodeEventProperties.NewNode,OSF.DDA.DataNodeEventProperties.NextSiblingNode]);
		return OSF.OUtil.listContainsValue(pn,p)
	};
	this.pack=function OSF_DDA_SpecialProcessor$pack(param, arg)
	{
		var value;
		if(this.isDynamicType(param))
			value=dynamicTypes[param].toHost(arg);
		else
			value=arg;
		return value
	};
	this.unpack=function OSF_DDA_SpecialProcessor$unpack(param, arg)
	{
		var value;
		if(this.isDynamicType(param))
			value=dynamicTypes[param].fromHost(arg);
		else
			value=arg;
		return value
	}
};
OSF.DDA.getDecoratedParameterMap=function(specialProcessor, initialDefs)
{
	var parameterMap=new OSF.DDA.HostParameterMap(specialProcessor);
	var self=parameterMap.self;
	function createObject(properties)
	{
		var obj=null;
		if(properties)
		{
			obj={};
			var len=properties.length;
			for(var i=0; i < len; i++)
				obj[properties[i].name]=properties[i].value
		}
		return obj
	}
	parameterMap.define=function define(definition)
	{
		var args={};
		var toHost=createObject(definition.toHost);
		if(definition.invertible)
			args.map=toHost;
		else if(definition.canonical)
			args.toHost=args.fromHost=toHost;
		else
		{
			args.toHost=toHost;
			args.fromHost=createObject(definition.fromHost)
		}
		parameterMap.addMapping(definition.type,args);
		if(definition.isComplexType)
			parameterMap.addComplexType(definition.type)
	};
	for(var id in initialDefs)
		parameterMap.define(initialDefs[id]);
	return parameterMap
};
OSF.OUtil.setNamespace("DispIdHost",OSF.DDA);
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
	OpenDialog: "openDialog",
	CloseDialog: "closeDialog",
	MessageParent: "messageParent"
};
OSF.DDA.DispIdHost.Facade=function OSF_DDA_DispIdHost_Facade(getDelegateMethods, parameterMap)
{
	var dispIdMap={};
	var jsom=OSF.DDA.AsyncMethodNames;
	var did=OSF.DDA.MethodDispId;
	var methodMap={
			GoToByIdAsync: did.dispidNavigateToMethod,
			GetSelectedDataAsync: did.dispidGetSelectedDataMethod,
			SetSelectedDataAsync: did.dispidSetSelectedDataMethod,
			GetDocumentCopyChunkAsync: did.dispidGetDocumentCopyChunkMethod,
			ReleaseDocumentCopyAsync: did.dispidReleaseDocumentCopyMethod,
			GetDocumentCopyAsync: did.dispidGetDocumentCopyMethod,
			AddFromSelectionAsync: did.dispidAddBindingFromSelectionMethod,
			AddFromPromptAsync: did.dispidAddBindingFromPromptMethod,
			AddFromNamedItemAsync: did.dispidAddBindingFromNamedItemMethod,
			GetAllAsync: did.dispidGetAllBindingsMethod,
			GetByIdAsync: did.dispidGetBindingMethod,
			ReleaseByIdAsync: did.dispidReleaseBindingMethod,
			GetDataAsync: did.dispidGetBindingDataMethod,
			SetDataAsync: did.dispidSetBindingDataMethod,
			AddRowsAsync: did.dispidAddRowsMethod,
			AddColumnsAsync: did.dispidAddColumnsMethod,
			DeleteAllDataValuesAsync: did.dispidClearAllRowsMethod,
			RefreshAsync: did.dispidLoadSettingsMethod,
			SaveAsync: did.dispidSaveSettingsMethod,
			GetActiveViewAsync: did.dispidGetActiveViewMethod,
			GetFilePropertiesAsync: did.dispidGetFilePropertiesMethod,
			GetOfficeThemeAsync: did.dispidGetOfficeThemeMethod,
			GetDocumentThemeAsync: did.dispidGetDocumentThemeMethod,
			ClearFormatsAsync: did.dispidClearFormatsMethod,
			SetTableOptionsAsync: did.dispidSetTableOptionsMethod,
			SetFormatsAsync: did.dispidSetFormatsMethod,
			ExecuteRichApiRequestAsync: did.dispidExecuteRichApiRequestMethod,
			AppCommandInvocationCompletedAsync: did.dispidAppCommandInvocationCompletedMethod,
			CloseContainerAsync: did.dispidCloseContainerMethod,
			AddDataPartAsync: did.dispidAddDataPartMethod,
			GetDataPartByIdAsync: did.dispidGetDataPartByIdMethod,
			GetDataPartsByNameSpaceAsync: did.dispidGetDataPartsByNamespaceMethod,
			GetPartXmlAsync: did.dispidGetDataPartXmlMethod,
			GetPartNodesAsync: did.dispidGetDataPartNodesMethod,
			DeleteDataPartAsync: did.dispidDeleteDataPartMethod,
			GetNodeValueAsync: did.dispidGetDataNodeValueMethod,
			GetNodeXmlAsync: did.dispidGetDataNodeXmlMethod,
			GetRelativeNodesAsync: did.dispidGetDataNodesMethod,
			SetNodeValueAsync: did.dispidSetDataNodeValueMethod,
			SetNodeXmlAsync: did.dispidSetDataNodeXmlMethod,
			AddDataPartNamespaceAsync: did.dispidAddDataNamespaceMethod,
			GetDataPartNamespaceAsync: did.dispidGetDataUriByPrefixMethod,
			GetDataPartPrefixAsync: did.dispidGetDataPrefixByUriMethod,
			GetNodeTextAsync: did.dispidGetDataNodeTextMethod,
			SetNodeTextAsync: did.dispidSetDataNodeTextMethod,
			GetSelectedTask: did.dispidGetSelectedTaskMethod,
			GetTask: did.dispidGetTaskMethod,
			GetWSSUrl: did.dispidGetWSSUrlMethod,
			GetTaskField: did.dispidGetTaskFieldMethod,
			GetSelectedResource: did.dispidGetSelectedResourceMethod,
			GetResourceField: did.dispidGetResourceFieldMethod,
			GetProjectField: did.dispidGetProjectFieldMethod,
			GetSelectedView: did.dispidGetSelectedViewMethod,
			GetTaskByIndex: did.dispidGetTaskByIndexMethod,
			GetResourceByIndex: did.dispidGetResourceByIndexMethod,
			SetTaskField: did.dispidSetTaskFieldMethod,
			SetResourceField: did.dispidSetResourceFieldMethod,
			GetMaxTaskIndex: did.dispidGetMaxTaskIndexMethod,
			GetMaxResourceIndex: did.dispidGetMaxResourceIndexMethod,
			CreateTask: did.dispidCreateTaskMethod
		};
	for(var method in methodMap)
		if(jsom[method])
			dispIdMap[jsom[method].id]=methodMap[method];
	jsom=OSF.DDA.SyncMethodNames;
	did=OSF.DDA.MethodDispId;
	var asyncMethodMap={MessageParent: did.dispidMessageParentMethod};
	for(var method in asyncMethodMap)
		if(jsom[method])
			dispIdMap[jsom[method].id]=asyncMethodMap[method];
	jsom=Microsoft.Office.WebExtension.EventType;
	did=OSF.DDA.EventDispId;
	var eventMap={
			SettingsChanged: did.dispidSettingsChangedEvent,
			DocumentSelectionChanged: did.dispidDocumentSelectionChangedEvent,
			BindingSelectionChanged: did.dispidBindingSelectionChangedEvent,
			BindingDataChanged: did.dispidBindingDataChangedEvent,
			ActiveViewChanged: did.dispidActiveViewChangedEvent,
			OfficeThemeChanged: did.dispidOfficeThemeChangedEvent,
			DocumentThemeChanged: did.dispidDocumentThemeChangedEvent,
			AppCommandInvoked: did.dispidAppCommandInvokedEvent,
			DialogMessageReceived: did.dispidDialogMessageReceivedEvent,
			OlkItemSelectedChanged: did.dispidOlkItemSelectedChangedEvent,
			TaskSelectionChanged: did.dispidTaskSelectionChangedEvent,
			ResourceSelectionChanged: did.dispidResourceSelectionChangedEvent,
			ViewSelectionChanged: did.dispidViewSelectionChangedEvent,
			DataNodeInserted: did.dispidDataNodeAddedEvent,
			DataNodeReplaced: did.dispidDataNodeReplacedEvent,
			DataNodeDeleted: did.dispidDataNodeDeletedEvent
		};
	for(var event in eventMap)
		if(jsom[event])
			dispIdMap[jsom[event]]=eventMap[event];
	function onException(ex, asyncMethodCall, suppliedArgs, callArgs)
	{
		if(typeof ex=="number")
		{
			if(!callArgs)
				callArgs=asyncMethodCall.getCallArgs(suppliedArgs);
			OSF.DDA.issueAsyncResult(callArgs,ex,OSF.DDA.ErrorCodeManager.getErrorArgs(ex))
		}
		else
			throw ex;
	}
	this[OSF.DDA.DispIdHost.Methods.InvokeMethod]=function OSF_DDA_DispIdHost_Facade$InvokeMethod(method, suppliedArguments, caller, privateState)
	{
		var callArgs;
		try
		{
			var methodName=method.id;
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[methodName];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments,caller,privateState);
			var dispId=dispIdMap[methodName];
			var delegate=getDelegateMethods(methodName);
			var richApiInExcelMethodSubstitution=null;
			if(window.Excel && window.Office.context.requirements.isSetSupported("RedirectV1Api"))
				window.Excel._RedirectV1APIs=true;
			if(window.Excel && window.Excel._RedirectV1APIs && (richApiInExcelMethodSubstitution=window.Excel._V1APIMap[methodName]))
			{
				if(richApiInExcelMethodSubstitution.preprocess)
					callArgs=richApiInExcelMethodSubstitution.preprocess(callArgs);
				var ctx=new window.Excel.RequestContext;
				var result=richApiInExcelMethodSubstitution.call(ctx,callArgs);
				ctx.sync().then(function()
				{
					var response=result.value;
					var status=response.status;
					delete response["status"];
					delete response["@odata.type"];
					if(richApiInExcelMethodSubstitution.postprocess)
						response=richApiInExcelMethodSubstitution.postprocess(response,callArgs);
					if(status !=0)
						response=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
					OSF.DDA.issueAsyncResult(callArgs,status,response)
				})["catch"](function(error)
				{
					OSF.DDA.issueAsyncResult(callArgs,OSF.DDA.ErrorCodeManager.errorCodes.ooeFailure,null)
				})
			}
			else
			{
				var hostCallArgs;
				if(parameterMap.toHost)
					hostCallArgs=parameterMap.toHost(dispId,callArgs);
				else
					hostCallArgs=callArgs;
				delegate[OSF.DDA.DispIdHost.Delegates.ExecuteAsync]({
					dispId: dispId,
					hostCallArgs: hostCallArgs,
					onCalling: function OSF_DDA_DispIdFacade$Execute_onCalling(){},
					onReceiving: function OSF_DDA_DispIdFacade$Execute_onReceiving(){},
					onComplete: function(status, hostResponseArgs)
					{
						var responseArgs;
						if(status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess)
							if(parameterMap.fromHost)
								responseArgs=parameterMap.fromHost(dispId,hostResponseArgs);
							else
								responseArgs=hostResponseArgs;
						else
							responseArgs=hostResponseArgs;
						var payload=asyncMethodCall.processResponse(status,responseArgs,caller,callArgs);
						OSF.DDA.issueAsyncResult(callArgs,status,payload)
					}
				})
			}
		}
		catch(ex)
		{
			onException(ex,asyncMethodCall,suppliedArguments,callArgs)
		}
	};
	this[OSF.DDA.DispIdHost.Methods.AddEventHandler]=function OSF_DDA_DispIdHost_Facade$AddEventHandler(suppliedArguments, eventDispatch, caller)
	{
		var callArgs;
		var eventType,
			handler;
		function onEnsureRegistration(status)
		{
			if(status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess)
			{
				var added=eventDispatch.addEventHandler(eventType,handler);
				if(!added)
					status=OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerAdditionFailed
			}
			var error;
			if(status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess)
				error=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			OSF.DDA.issueAsyncResult(callArgs,status,error)
		}
		try
		{
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.AddHandlerAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments,caller,eventDispatch);
			eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
			handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
			if(eventDispatch.getEventHandlerCount(eventType)==0)
			{
				var dispId=dispIdMap[eventType];
				var invoker=getDelegateMethods(eventType)[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync];
				invoker({
					eventType: eventType,
					dispId: dispId,
					targetId: caller.id || "",
					onCalling: function OSF_DDA_DispIdFacade$Execute_onCalling()
					{
						OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall)
					},
					onReceiving: function OSF_DDA_DispIdFacade$Execute_onReceiving()
					{
						OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse)
					},
					onComplete: onEnsureRegistration,
					onEvent: function handleEvent(hostArgs)
					{
						var args=parameterMap.fromHost(dispId,hostArgs);
						eventDispatch.fireEvent(OSF.DDA.OMFactory.manufactureEventArgs(eventType,caller,args))
					}
				})
			}
			else
				onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess)
		}
		catch(ex)
		{
			onException(ex,asyncMethodCall,suppliedArguments,callArgs)
		}
	};
	this[OSF.DDA.DispIdHost.Methods.RemoveEventHandler]=function OSF_DDA_DispIdHost_Facade$RemoveEventHandler(suppliedArguments, eventDispatch, caller)
	{
		var callArgs;
		var eventType,
			handler;
		function onEnsureRegistration(status)
		{
			var error;
			if(status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess)
				error=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			OSF.DDA.issueAsyncResult(callArgs,status,error)
		}
		try
		{
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.RemoveHandlerAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments,caller,eventDispatch);
			eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
			handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
			var status,
				removeSuccess;
			if(handler===null)
			{
				removeSuccess=eventDispatch.clearEventHandlers(eventType);
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess
			}
			else
			{
				removeSuccess=eventDispatch.removeEventHandler(eventType,handler);
				status=removeSuccess ? OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess : OSF.DDA.ErrorCodeManager.errorCodes.ooeEventHandlerNotExist
			}
			if(removeSuccess && eventDispatch.getEventHandlerCount(eventType)==0)
			{
				var dispId=dispIdMap[eventType];
				var invoker=getDelegateMethods(eventType)[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync];
				invoker({
					eventType: eventType,
					dispId: dispId,
					targetId: caller.id || "",
					onCalling: function OSF_DDA_DispIdFacade$Execute_onCalling()
					{
						OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall)
					},
					onReceiving: function OSF_DDA_DispIdFacade$Execute_onReceiving()
					{
						OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse)
					},
					onComplete: onEnsureRegistration
				})
			}
			else
				onEnsureRegistration(status)
		}
		catch(ex)
		{
			onException(ex,asyncMethodCall,suppliedArguments,callArgs)
		}
	};
	this[OSF.DDA.DispIdHost.Methods.OpenDialog]=function OSF_DDA_DispIdHost_Facade$OpenDialog(suppliedArguments, eventDispatch, caller)
	{
		var callArgs;
		var targetId;
		var dialogMessageEvent=Microsoft.Office.WebExtension.EventType.DialogMessageReceived;
		var dialogOtherEvent=Microsoft.Office.WebExtension.EventType.DialogEventReceived;
		function onEnsureRegistration(status)
		{
			var payload;
			if(status !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess)
				payload=OSF.DDA.ErrorCodeManager.getErrorArgs(status);
			else
			{
				var onSucceedArgs={};
				onSucceedArgs[Microsoft.Office.WebExtension.Parameters.Id]=targetId;
				onSucceedArgs[Microsoft.Office.WebExtension.Parameters.Data]=eventDispatch;
				var payload=asyncMethodCall.processResponse(status,onSucceedArgs,caller,callArgs);
				OSF.DialogShownStatus.hasDialogShown=true;
				eventDispatch.clearEventHandlers(dialogMessageEvent);
				eventDispatch.clearEventHandlers(dialogOtherEvent)
			}
			OSF.DDA.issueAsyncResult(callArgs,status,payload)
		}
		try
		{
			if(dialogMessageEvent==undefined || dialogOtherEvent==undefined)
				onEnsureRegistration(OSF.DDA.ErrorCodeManager.ooeOperationNotSupported);
			if(OSF.DDA.AsyncMethodNames.DisplayDialogAsync==null)
			{
				onEnsureRegistration(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError);
				return
			}
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.DisplayDialogAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments,caller,eventDispatch);
			var dispId=dispIdMap[dialogMessageEvent];
			var delegateMethods=getDelegateMethods(dialogMessageEvent);
			var invoker=delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog] !=undefined ? delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog] : delegateMethods[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync];
			targetId=JSON.stringify(callArgs);
			invoker({
				eventType: dialogMessageEvent,
				dispId: dispId,
				targetId: targetId,
				onCalling: function OSF_DDA_DispIdFacade$Execute_onCalling()
				{
					OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall)
				},
				onReceiving: function OSF_DDA_DispIdFacade$Execute_onReceiving()
				{
					OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse)
				},
				onComplete: onEnsureRegistration,
				onEvent: function handleEvent(hostArgs)
				{
					var args=parameterMap.fromHost(dispId,hostArgs);
					var event=OSF.DDA.OMFactory.manufactureEventArgs(dialogMessageEvent,caller,args);
					if(event.type==dialogOtherEvent)
					{
						var payload=OSF.DDA.ErrorCodeManager.getErrorArgs(event.error);
						var errorArgs={};
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code]=status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name]=payload.name || payload;
						errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message]=payload.message || payload;
						event.error=new OSF.DDA.Error(errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Name],errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Message],errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties.Code])
					}
					eventDispatch.fireOrQueueEvent(event);
					if(args[OSF.DDA.PropertyDescriptors.MessageType]==OSF.DialogMessageType.DialogClosed)
					{
						eventDispatch.clearEventHandlers(dialogMessageEvent);
						eventDispatch.clearEventHandlers(dialogOtherEvent);
						OSF.DialogShownStatus.hasDialogShown=false
					}
				}
			})
		}
		catch(ex)
		{
			onException(ex,asyncMethodCall,suppliedArguments,callArgs)
		}
	};
	this[OSF.DDA.DispIdHost.Methods.CloseDialog]=function OSF_DDA_DispIdHost_Facade$CloseDialog(suppliedArguments, targetId, eventDispatch, caller)
	{
		var callArgs;
		var dialogMessageEvent,
			dialogOtherEvent;
		var closeStatus=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess;
		function closeCallback(status)
		{
			closeStatus=status;
			OSF.DialogShownStatus.hasDialogShown=false
		}
		try
		{
			var asyncMethodCall=OSF.DDA.AsyncMethodCalls[OSF.DDA.AsyncMethodNames.CloseAsync.id];
			callArgs=asyncMethodCall.verifyAndExtractCall(suppliedArguments,caller,eventDispatch);
			dialogMessageEvent=Microsoft.Office.WebExtension.EventType.DialogMessageReceived;
			dialogOtherEvent=Microsoft.Office.WebExtension.EventType.DialogEventReceived;
			eventDispatch.clearEventHandlers(dialogMessageEvent);
			eventDispatch.clearEventHandlers(dialogOtherEvent);
			var dispId=dispIdMap[dialogMessageEvent];
			var delegateMethods=getDelegateMethods(dialogMessageEvent);
			var invoker=delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog] !=undefined ? delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog] : delegateMethods[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync];
			invoker({
				eventType: dialogMessageEvent,
				dispId: dispId,
				targetId: targetId,
				onCalling: function OSF_DDA_DispIdFacade$Execute_onCalling()
				{
					OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall)
				},
				onReceiving: function OSF_DDA_DispIdFacade$Execute_onReceiving()
				{
					OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse)
				},
				onComplete: closeCallback
			})
		}
		catch(ex)
		{
			onException(ex,asyncMethodCall,suppliedArguments,callArgs)
		}
		if(closeStatus !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess)
			throw OSF.OUtil.formatString(Strings.OfficeOM.L_FunctionCallFailed,OSF.DDA.AsyncMethodNames.CloseAsync.displayName,closeStatus);
	};
	this[OSF.DDA.DispIdHost.Methods.MessageParent]=function OSF_DDA_DispIdHost_Facade$MessageParent(suppliedArguments, caller)
	{
		var stateInfo={};
		var syncMethodCall=OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.MessageParent.id];
		var callArgs=syncMethodCall.verifyAndExtractCall(suppliedArguments,caller,stateInfo);
		var delegate=getDelegateMethods(OSF.DDA.SyncMethodNames.MessageParent.id);
		var invoker=delegate[OSF.DDA.DispIdHost.Delegates.MessageParent];
		var dispId=dispIdMap[OSF.DDA.SyncMethodNames.MessageParent.id];
		return invoker({
				dispId: dispId,
				hostCallArgs: callArgs,
				onCalling: function OSF_DDA_DispIdFacade$Execute_onCalling()
				{
					OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.IssueCall)
				},
				onReceiving: function OSF_DDA_DispIdFacade$Execute_onReceiving()
				{
					OSF.OUtil.writeProfilerMark(OSF.HostCallPerfMarker.ReceiveResponse)
				}
			})
	}
};
OSF.DDA.DispIdHost.addAsyncMethods=function OSF_DDA_DispIdHost$AddAsyncMethods(target, asyncMethodNames, privateState)
{
	for(var entry in asyncMethodNames)
	{
		var method=asyncMethodNames[entry];
		var name=method.displayName;
		if(!target[name])
			OSF.OUtil.defineEnumerableProperty(target,name,{value: function(asyncMethod)
				{
					return function()
						{
							var invokeMethod=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.InvokeMethod];
							invokeMethod(asyncMethod,arguments,target,privateState)
						}
				}(method)})
	}
};
OSF.DDA.DispIdHost.addEventSupport=function OSF_DDA_DispIdHost$AddEventSupport(target, eventDispatch)
{
	var add=OSF.DDA.AsyncMethodNames.AddHandlerAsync.displayName;
	var remove=OSF.DDA.AsyncMethodNames.RemoveHandlerAsync.displayName;
	if(!target[add])
		OSF.OUtil.defineEnumerableProperty(target,add,{value: function()
			{
				var addEventHandler=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.AddEventHandler];
				addEventHandler(arguments,eventDispatch,target)
			}});
	if(!target[remove])
		OSF.OUtil.defineEnumerableProperty(target,remove,{value: function()
			{
				var removeEventHandler=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.RemoveEventHandler];
				removeEventHandler(arguments,eventDispatch,target)
			}})
};
OSF.OUtil.setNamespace("SafeArray",OSF.DDA);
OSF.DDA.SafeArray.Response={
	Status: 0,
	Payload: 1
};
OSF.DDA.SafeArray.UniqueArguments={
	Offset: "offset",
	Run: "run",
	BindingSpecificData: "bindingSpecificData",
	MergedCellGuid: "{66e7831f-81b2-42e2-823c-89e872d541b3}"
};
OSF.OUtil.setNamespace("Delegate",OSF.DDA.SafeArray);
OSF.DDA.SafeArray.Delegate._onException=function OSF_DDA_SafeArray_Delegate$OnException(ex, args)
{
	var status;
	var statusNumber=ex.number;
	if(statusNumber)
		switch(statusNumber)
		{
			case-2146828218:
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability;
				break;
			case-2147467259:
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeDialogAlreadyOpened;
				break;
			case-2146828283:
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidParam;
				break;
			case-2146827850:
			default:
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
				break
		}
	if(args.onComplete)
		args.onComplete(status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError)
};
OSF.DDA.SafeArray.Delegate._onExceptionSyncMethod=function OSF_DDA_SafeArray_Delegate$OnExceptionSyncMethod(ex, args)
{
	var status;
	var number=ex.number;
	if(number)
		switch(number)
		{
			case-2146828218:
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeNoCapability;
				break;
			case-2146827850:
			default:
				status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
				break
		}
	return status || OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError
};
OSF.DDA.SafeArray.Delegate.SpecialProcessor=function OSF_DDA_SafeArray_Delegate_SpecialProcessor()
{
	function _2DVBArrayToJaggedArray(vbArr)
	{
		var ret;
		try
		{
			var rows=vbArr.ubound(1);
			var cols=vbArr.ubound(2);
			vbArr=vbArr.toArray();
			if(rows==1 && cols==1)
				ret=[vbArr];
			else
			{
				ret=[];
				for(var row=0; row < rows; row++)
				{
					var rowArr=[];
					for(var col=0; col < cols; col++)
					{
						var datum=vbArr[row * cols+col];
						if(datum !=OSF.DDA.SafeArray.UniqueArguments.MergedCellGuid)
							rowArr.push(datum)
					}
					if(rowArr.length > 0)
						ret.push(rowArr)
				}
			}
		}
		catch(ex){}
		return ret
	}
	var complexTypes=[];
	var dynamicTypes={};
	dynamicTypes[Microsoft.Office.WebExtension.Parameters.Data]=function()
	{
		var tableRows=0;
		var tableHeaders=1;
		return{
				toHost: function OSF_DDA_SafeArray_Delegate_SpecialProcessor_Data$toHost(data)
				{
					if(OSF.DDA.TableDataProperties && typeof data !="string" && data[OSF.DDA.TableDataProperties.TableRows] !==undefined)
					{
						var tableData=[];
						tableData[tableRows]=data[OSF.DDA.TableDataProperties.TableRows];
						tableData[tableHeaders]=data[OSF.DDA.TableDataProperties.TableHeaders];
						data=tableData
					}
					return data
				},
				fromHost: function OSF_DDA_SafeArray_Delegate_SpecialProcessor_Data$fromHost(hostArgs)
				{
					var ret;
					if(hostArgs.toArray)
					{
						var dimensions=hostArgs.dimensions();
						if(dimensions===2)
							ret=_2DVBArrayToJaggedArray(hostArgs);
						else
						{
							var array=hostArgs.toArray();
							if(array.length===2 && (array[0] !=null && array[0].toArray || array[1] !=null && array[1].toArray))
							{
								ret={};
								ret[OSF.DDA.TableDataProperties.TableRows]=_2DVBArrayToJaggedArray(array[tableRows]);
								ret[OSF.DDA.TableDataProperties.TableHeaders]=_2DVBArrayToJaggedArray(array[tableHeaders])
							}
							else
								ret=array
						}
					}
					else
						ret=hostArgs;
					return ret
				}
			}
	}();
	OSF.DDA.SafeArray.Delegate.SpecialProcessor.uber.constructor.call(this,complexTypes,dynamicTypes);
	this.unpack=function OSF_DDA_SafeArray_Delegate_SpecialProcessor$unpack(param, arg)
	{
		var value;
		if(this.isComplexType(param) || OSF.DDA.ListType.isListType(param))
		{
			var toArraySupported=(arg || typeof arg==="unknown") && arg.toArray;
			value=toArraySupported ? arg.toArray() : arg || {}
		}
		else if(this.isDynamicType(param))
			value=dynamicTypes[param].fromHost(arg);
		else
			value=arg;
		return value
	}
};
OSF.OUtil.extend(OSF.DDA.SafeArray.Delegate.SpecialProcessor,OSF.DDA.SpecialProcessor);
OSF.DDA.SafeArray.Delegate.ParameterMap=OSF.DDA.getDecoratedParameterMap(new OSF.DDA.SafeArray.Delegate.SpecialProcessor,[{
		type: Microsoft.Office.WebExtension.Parameters.ValueFormat,
		toHost: [{
				name: Microsoft.Office.WebExtension.ValueFormat.Unformatted,
				value: 0
			},{
				name: Microsoft.Office.WebExtension.ValueFormat.Formatted,
				value: 1
			}]
	},{
		type: Microsoft.Office.WebExtension.Parameters.FilterType,
		toHost: [{
				name: Microsoft.Office.WebExtension.FilterType.All,
				value: 0
			}]
	}]);
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.PropertyDescriptors.AsyncResultStatus,
	fromHost: [{
			name: Microsoft.Office.WebExtension.AsyncResultStatus.Succeeded,
			value: 0
		},{
			name: Microsoft.Office.WebExtension.AsyncResultStatus.Failed,
			value: 1
		}]
});
OSF.DDA.SafeArray.Delegate.executeAsync=function OSF_DDA_SafeArray_Delegate$ExecuteAsync(args)
{
	function toArray(args)
	{
		var arrArgs=args;
		if(OSF.OUtil.isArray(args))
		{
			var len=arrArgs.length;
			for(var i=0; i < len; i++)
				arrArgs[i]=toArray(arrArgs[i])
		}
		else if(OSF.OUtil.isDate(args))
			arrArgs=args.getVarDate();
		else if(typeof args==="object" && !OSF.OUtil.isArray(args))
		{
			arrArgs=[];
			for(var index in args)
				if(!OSF.OUtil.isFunction(args[index]))
					arrArgs[index]=toArray(args[index])
		}
		return arrArgs
	}
	function fromSafeArray(value)
	{
		var ret=value;
		if(value !=null && value.toArray)
		{
			var arrayResult=value.toArray();
			ret=new Array(arrayResult.length);
			for(var i=0; i < arrayResult.length; i++)
				ret[i]=fromSafeArray(arrayResult[i])
		}
		return ret
	}
	try
	{
		if(args.onCalling)
			args.onCalling();
		var startTime=(new Date).getTime();
		OSF.ClientHostController.execute(args.dispId,toArray(args.hostCallArgs),function OSF_DDA_SafeArrayFacade$Execute_OnResponse(hostResponseArgs, resultCode)
		{
			var result=hostResponseArgs.toArray();
			var status=result[OSF.DDA.SafeArray.Response.Status];
			if(status==OSF.DDA.ErrorCodeManager.errorCodes.ooeChunkResult)
			{
				var payload=result[OSF.DDA.SafeArray.Response.Payload];
				payload=fromSafeArray(payload);
				if(payload !=null)
				{
					if(!args._chunkResultData)
						args._chunkResultData=new Array;
					args._chunkResultData[payload[0]]=payload[1]
				}
				return false
			}
			if(args.onReceiving)
				args.onReceiving();
			if(args.onComplete)
			{
				var payload;
				if(status==OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess)
				{
					if(result.length > 2)
					{
						payload=[];
						for(var i=1; i < result.length; i++)
							payload[i - 1]=result[i]
					}
					else
						payload=result[OSF.DDA.SafeArray.Response.Payload];
					if(args._chunkResultData)
					{
						payload=fromSafeArray(payload);
						if(payload !=null)
						{
							var expectedChunkCount=payload[payload.length - 1];
							if(args._chunkResultData.length==expectedChunkCount)
								payload[payload.length - 1]=args._chunkResultData;
							else
								status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError
						}
					}
				}
				else
					payload=result[OSF.DDA.SafeArray.Response.Payload];
				args.onComplete(status,payload)
			}
			if(OSF.AppTelemetry)
				OSF.AppTelemetry.onMethodDone(args.dispId,args.hostCallArgs,Math.abs((new Date).getTime() - startTime),status);
			return true
		})
	}
	catch(ex)
	{
		OSF.DDA.SafeArray.Delegate._onException(ex,args)
	}
};
OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent=function OSF_DDA_SafeArrayDelegate$GetOnAfterRegisterEvent(register, args)
{
	var startTime=(new Date).getTime();
	return function OSF_DDA_SafeArrayDelegate$OnAfterRegisterEvent(hostResponseArgs)
		{
			if(args.onReceiving)
				args.onReceiving();
			var status=hostResponseArgs.toArray ? hostResponseArgs.toArray()[OSF.DDA.SafeArray.Response.Status] : hostResponseArgs;
			if(args.onComplete)
				args.onComplete(status);
			if(OSF.AppTelemetry)
				OSF.AppTelemetry.onRegisterDone(register,args.dispId,Math.abs((new Date).getTime() - startTime),status)
		}
};
OSF.DDA.SafeArray.Delegate.registerEventAsync=function OSF_DDA_SafeArray_Delegate$RegisterEventAsync(args)
{
	if(args.onCalling)
		args.onCalling();
	var callback=OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent(true,args);
	try
	{
		OSF.ClientHostController.registerEvent(args.dispId,args.targetId,function OSF_DDA_SafeArrayDelegate$RegisterEventAsync_OnEvent(eventDispId, payload)
		{
			if(args.onEvent)
				args.onEvent(payload);
			if(OSF.AppTelemetry)
				OSF.AppTelemetry.onEventDone(args.dispId)
		},callback)
	}
	catch(ex)
	{
		OSF.DDA.SafeArray.Delegate._onException(ex,args)
	}
};
OSF.DDA.SafeArray.Delegate.unregisterEventAsync=function OSF_DDA_SafeArray_Delegate$UnregisterEventAsync(args)
{
	if(args.onCalling)
		args.onCalling();
	var callback=OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent(false,args);
	try
	{
		OSF.ClientHostController.unregisterEvent(args.dispId,args.targetId,callback)
	}
	catch(ex)
	{
		OSF.DDA.SafeArray.Delegate._onException(ex,args)
	}
};
OSF.ClientMode={
	ReadWrite: 0,
	ReadOnly: 1
};
OSF.DDA.RichInitializationReason={
	1: Microsoft.Office.WebExtension.InitializationReason.Inserted,
	2: Microsoft.Office.WebExtension.InitializationReason.DocumentOpened
};
OSF.InitializationHelper=function OSF_InitializationHelper(hostInfo, webAppState, context, settings, hostFacade)
{
	this._hostInfo=hostInfo;
	this._webAppState=webAppState;
	this._context=context;
	this._settings=settings;
	this._hostFacade=hostFacade;
	this._initializeSettings=this.initializeSettings
};
OSF.InitializationHelper.prototype.deserializeSettings=function OSF_InitializationHelper$deserializeSettings(serializedSettings, refreshSupported)
{
	var settings;
	var osfSessionStorage=OSF.OUtil.getSessionStorage();
	if(osfSessionStorage)
	{
		var storageSettings=osfSessionStorage.getItem(OSF._OfficeAppFactory.getCachedSessionSettingsKey());
		if(storageSettings)
			serializedSettings=typeof JSON !=="undefined" ? JSON.parse(storageSettings) : OsfMsAjaxFactory.msAjaxSerializer.deserialize(storageSettings,true);
		else
		{
			storageSettings=typeof JSON !=="undefined" ? JSON.stringify(serializedSettings) : OsfMsAjaxFactory.msAjaxSerializer.serialize(serializedSettings);
			osfSessionStorage.setItem(OSF._OfficeAppFactory.getCachedSessionSettingsKey(),storageSettings)
		}
	}
	var deserializedSettings=OSF.DDA.SettingsManager.deserializeSettings(serializedSettings);
	if(refreshSupported)
		settings=new OSF.DDA.RefreshableSettings(deserializedSettings);
	else
		settings=new OSF.DDA.Settings(deserializedSettings);
	return settings
};
OSF.InitializationHelper.prototype.saveAndSetDialogInfo=function OSF_InitializationHelper$saveAndSetDialogInfo(hostInfoValue){};
OSF.InitializationHelper.prototype.setAgaveHostCommunication=function OSF_InitializationHelper$setAgaveHostCommunication(){};
OSF.InitializationHelper.prototype.prepareRightBeforeWebExtensionInitialize=function OSF_InitializationHelper$prepareRightBeforeWebExtensionInitialize(appContext)
{
	this.prepareApiSurface(appContext);
	Microsoft.Office.WebExtension.initialize(this.getInitializationReason(appContext))
};
OSF.InitializationHelper.prototype.prepareApiSurface=function OSF_InitializationHelper$prepareApiSurfaceAndInitialize(appContext)
{
	var license=new OSF.DDA.License(appContext.get_eToken());
	var getOfficeThemeHandler=OSF.DDA.OfficeTheme && OSF.DDA.OfficeTheme.getOfficeTheme ? OSF.DDA.OfficeTheme.getOfficeTheme : null;
	if(appContext.get_isDialog())
	{
		if(OSF.DDA.UI.ChildUI)
			appContext.ui=new OSF.DDA.UI.ChildUI
	}
	else if(OSF.DDA.UI.ParentUI)
	{
		appContext.ui=new OSF.DDA.UI.ParentUI;
		if(OfficeExt.Container)
			OSF.DDA.DispIdHost.addAsyncMethods(appContext.ui,[OSF.DDA.AsyncMethodNames.CloseContainerAsync])
	}
	OSF._OfficeAppFactory.setContext(new OSF.DDA.Context(appContext,appContext.doc,license,null,getOfficeThemeHandler));
	var getDelegateMethods,
		parameterMap;
	getDelegateMethods=OSF.DDA.DispIdHost.getClientDelegateMethods;
	parameterMap=OSF.DDA.SafeArray.Delegate.ParameterMap;
	OSF._OfficeAppFactory.setHostFacade(new OSF.DDA.DispIdHost.Facade(getDelegateMethods,parameterMap))
};
OSF.InitializationHelper.prototype.getInitializationReason=function(appContext)
{
	return OSF.DDA.RichInitializationReason[appContext.get_reason()]
};
OSF.DDA.DispIdHost.getClientDelegateMethods=function(actionId)
{
	var delegateMethods={};
	delegateMethods[OSF.DDA.DispIdHost.Delegates.ExecuteAsync]=OSF.DDA.SafeArray.Delegate.executeAsync;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.RegisterEventAsync]=OSF.DDA.SafeArray.Delegate.registerEventAsync;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.UnregisterEventAsync]=OSF.DDA.SafeArray.Delegate.unregisterEventAsync;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.OpenDialog]=OSF.DDA.SafeArray.Delegate.openDialog;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.CloseDialog]=OSF.DDA.SafeArray.Delegate.closeDialog;
	delegateMethods[OSF.DDA.DispIdHost.Delegates.MessageParent]=OSF.DDA.SafeArray.Delegate.messageParent;
	if(OSF.DDA.AsyncMethodNames.RefreshAsync && actionId==OSF.DDA.AsyncMethodNames.RefreshAsync.id)
	{
		var readSerializedSettings=function(hostCallArgs, onCalling, onReceiving)
			{
				return OSF.DDA.ClientSettingsManager.read(onCalling,onReceiving)
			};
		delegateMethods[OSF.DDA.DispIdHost.Delegates.ExecuteAsync]=OSF.DDA.ClientSettingsManager.getSettingsExecuteMethod(readSerializedSettings)
	}
	if(OSF.DDA.AsyncMethodNames.SaveAsync && actionId==OSF.DDA.AsyncMethodNames.SaveAsync.id)
	{
		var writeSerializedSettings=function(hostCallArgs, onCalling, onReceiving)
			{
				return OSF.DDA.ClientSettingsManager.write(hostCallArgs[OSF.DDA.SettingsManager.SerializedSettings],hostCallArgs[Microsoft.Office.WebExtension.Parameters.OverwriteIfStale],onCalling,onReceiving)
			};
		delegateMethods[OSF.DDA.DispIdHost.Delegates.ExecuteAsync]=OSF.DDA.ClientSettingsManager.getSettingsExecuteMethod(writeSerializedSettings)
	}
	return delegateMethods
};
var OSF=OSF || {};
var OSFWebkit;
(function(OSFWebkit)
{
	var WebkitSafeArray=function()
		{
			function WebkitSafeArray(data)
			{
				this.data=data;
				this.safeArrayFlag=this.isSafeArray(data)
			}
			WebkitSafeArray.prototype.dimensions=function()
			{
				var dimensions=0;
				if(this.safeArrayFlag)
					dimensions=this.data[0][0];
				else if(this.isArray())
					dimensions=2;
				return dimensions
			};
			WebkitSafeArray.prototype.getItem=function()
			{
				var array=[];
				var element=null;
				if(this.safeArrayFlag)
					array=this.toArray();
				else
					array=this.data;
				element=array;
				for(var i=0; i < arguments.length; i++)
					element=element[arguments[i]];
				return element
			};
			WebkitSafeArray.prototype.lbound=function(dimension)
			{
				return 0
			};
			WebkitSafeArray.prototype.ubound=function(dimension)
			{
				var ubound=0;
				if(this.safeArrayFlag)
					ubound=this.data[0][dimension];
				else if(this.isArray())
					if(dimension==1)
						return this.data.length;
					else if(dimension==2)
						if(OSF.OUtil.isArray(this.data[0]))
							return this.data[0].length;
						else if(this.data[0] !=null)
							return 1;
				return ubound
			};
			WebkitSafeArray.prototype.toArray=function()
			{
				if(this.isArray()==false)
					return this.data;
				var arr=[];
				var startingIndex=this.safeArrayFlag ? 1 : 0;
				for(var i=startingIndex; i < this.data.length; i++)
				{
					var element=this.data[i];
					if(this.isSafeArray(element))
						arr.push(new WebkitSafeArray(element));
					else
						arr.push(element)
				}
				return arr
			};
			WebkitSafeArray.prototype.isArray=function()
			{
				return OSF.OUtil.isArray(this.data)
			};
			WebkitSafeArray.prototype.isSafeArray=function(obj)
			{
				var isSafeArray=false;
				if(OSF.OUtil.isArray(obj) && OSF.OUtil.isArray(obj[0]))
				{
					var bounds=obj[0];
					var dimensions=bounds[0];
					if(bounds.length !=dimensions+1)
						return false;
					var expectedArraySize=1;
					for(var i=1; i < bounds.length; i++)
					{
						var dimension=bounds[i];
						if(isFinite(dimension)==false)
							return false;
						expectedArraySize=expectedArraySize * dimension
					}
					expectedArraySize++;
					isSafeArray=expectedArraySize==obj.length
				}
				return isSafeArray
			};
			return WebkitSafeArray
		}();
	OSFWebkit.WebkitSafeArray=WebkitSafeArray
})(OSFWebkit || (OSFWebkit={}));
var OSFWebkit;
(function(OSFWebkit)
{
	var ScriptMessaging;
	(function(ScriptMessaging)
	{
		var scriptMessenger=null;
		function agaveHostCallback(callbackId, params)
		{
			scriptMessenger.agaveHostCallback(callbackId,params)
		}
		ScriptMessaging.agaveHostCallback=agaveHostCallback;
		function agaveHostEventCallback(callbackId, params)
		{
			scriptMessenger.agaveHostEventCallback(callbackId,params)
		}
		ScriptMessaging.agaveHostEventCallback=agaveHostEventCallback;
		function GetScriptMessenger()
		{
			if(scriptMessenger==null)
				scriptMessenger=new WebkitScriptMessaging("OSF.ScriptMessaging.agaveHostCallback","OSF.ScriptMessaging.agaveHostEventCallback");
			return scriptMessenger
		}
		ScriptMessaging.GetScriptMessenger=GetScriptMessenger;
		var EventHandlerCallback=function()
			{
				function EventHandlerCallback(id, targetId, handler)
				{
					this.id=id;
					this.targetId=targetId;
					this.handler=handler
				}
				return EventHandlerCallback
			}();
		var WebkitScriptMessaging=function()
			{
				function WebkitScriptMessaging(methodCallbackName, eventCallbackName)
				{
					this.callingIndex=0;
					this.callbackList={};
					this.eventHandlerList={};
					this.asyncMethodCallbackFunctionName=methodCallbackName;
					this.eventCallbackFunctionName=eventCallbackName;
					this.conversationId=WebkitScriptMessaging.getCurrentTimeMS().toString()
				}
				WebkitScriptMessaging.prototype.invokeMethod=function(handlerName, methodId, params, callback)
				{
					var messagingArgs={};
					this.postWebkitMessage(messagingArgs,handlerName,methodId,params,callback)
				};
				WebkitScriptMessaging.prototype.registerEvent=function(handlerName, methodId, dispId, targetId, handler, callback)
				{
					var messagingArgs={eventCallbackFunction: this.eventCallbackFunctionName};
					var hostArgs={
							id: dispId,
							targetId: targetId
						};
					var correlationId=this.postWebkitMessage(messagingArgs,handlerName,methodId,hostArgs,callback);
					this.eventHandlerList[correlationId]=new EventHandlerCallback(dispId,targetId,handler)
				};
				WebkitScriptMessaging.prototype.unregisterEvent=function(handlerName, methodId, dispId, targetId, callback)
				{
					var hostArgs={
							id: dispId,
							targetId: targetId
						};
					for(var key in this.eventHandlerList)
						if(this.eventHandlerList.hasOwnProperty(key))
						{
							var eventCallback=this.eventHandlerList[key];
							if(eventCallback.id==dispId && eventCallback.targetId==targetId)
								delete this.eventHandlerList[key]
						}
					this.invokeMethod(handlerName,methodId,hostArgs,callback)
				};
				WebkitScriptMessaging.prototype.agaveHostCallback=function(callbackId, params)
				{
					var callbackFunction=this.callbackList[callbackId];
					if(callbackFunction)
					{
						var callbacksDone=callbackFunction(params);
						if(callbacksDone===undefined || callbacksDone===true)
							delete this.callbackList[callbackId]
					}
				};
				WebkitScriptMessaging.prototype.agaveHostEventCallback=function(callbackId, params)
				{
					var eventCallback=this.eventHandlerList[callbackId];
					if(eventCallback)
						eventCallback.handler(params)
				};
				WebkitScriptMessaging.prototype.postWebkitMessage=function(messagingArgs, handlerName, methodId, params, callback)
				{
					var correlationId=this.generateCorrelationId();
					this.callbackList[correlationId]=callback;
					messagingArgs.methodId=methodId;
					messagingArgs.params=params;
					messagingArgs.callbackId=correlationId;
					messagingArgs.callbackFunction=this.asyncMethodCallbackFunctionName;
					var invokePostMessage=function()
						{
							window.webkit.messageHandlers[handlerName].postMessage(JSON.stringify(messagingArgs))
						};
					var currentTimestamp=WebkitScriptMessaging.getCurrentTimeMS();
					if(this.lastMessageTimestamp==null || currentTimestamp - this.lastMessageTimestamp >=WebkitScriptMessaging.MESSAGE_TIME_DELTA)
					{
						invokePostMessage();
						this.lastMessageTimestamp=currentTimestamp
					}
					else
					{
						this.lastMessageTimestamp+=WebkitScriptMessaging.MESSAGE_TIME_DELTA;
						setTimeout(function()
						{
							invokePostMessage()
						},this.lastMessageTimestamp - currentTimestamp)
					}
					return correlationId
				};
				WebkitScriptMessaging.prototype.generateCorrelationId=function()
				{
++this.callingIndex;
					return this.conversationId+this.callingIndex
				};
				WebkitScriptMessaging.getCurrentTimeMS=function()
				{
					return(new Date).getTime()
				};
				WebkitScriptMessaging.MESSAGE_TIME_DELTA=10;
				return WebkitScriptMessaging
			}();
		ScriptMessaging.WebkitScriptMessaging=WebkitScriptMessaging
	})(ScriptMessaging=OSFWebkit.ScriptMessaging || (OSFWebkit.ScriptMessaging={}))
})(OSFWebkit || (OSFWebkit={}));
OSF.ScriptMessaging=OSFWebkit.ScriptMessaging;
var OSFWebkit;
(function(OSFWebkit)
{
	OSFWebkit.MessageHandlerName="Agave";
	OSFWebkit.PopupMessageHandlerName="WefPopupHandler";
	(function(AppContextProperties)
	{
		AppContextProperties[AppContextProperties["Settings"]=0]="Settings";
		AppContextProperties[AppContextProperties["SolutionReferenceId"]=1]="SolutionReferenceId";
		AppContextProperties[AppContextProperties["AppType"]=2]="AppType";
		AppContextProperties[AppContextProperties["MajorVersion"]=3]="MajorVersion";
		AppContextProperties[AppContextProperties["MinorVersion"]=4]="MinorVersion";
		AppContextProperties[AppContextProperties["RevisionVersion"]=5]="RevisionVersion";
		AppContextProperties[AppContextProperties["APIVersionSequence"]=6]="APIVersionSequence";
		AppContextProperties[AppContextProperties["AppCapabilities"]=7]="AppCapabilities";
		AppContextProperties[AppContextProperties["APPUILocale"]=8]="APPUILocale";
		AppContextProperties[AppContextProperties["AppDataLocale"]=9]="AppDataLocale";
		AppContextProperties[AppContextProperties["BindingCount"]=10]="BindingCount";
		AppContextProperties[AppContextProperties["DocumentUrl"]=11]="DocumentUrl";
		AppContextProperties[AppContextProperties["ActivationMode"]=12]="ActivationMode";
		AppContextProperties[AppContextProperties["ControlIntegrationLevel"]=13]="ControlIntegrationLevel";
		AppContextProperties[AppContextProperties["SolutionToken"]=14]="SolutionToken";
		AppContextProperties[AppContextProperties["APISetVersion"]=15]="APISetVersion";
		AppContextProperties[AppContextProperties["CorrelationId"]=16]="CorrelationId";
		AppContextProperties[AppContextProperties["InstanceId"]=17]="InstanceId";
		AppContextProperties[AppContextProperties["TouchEnabled"]=18]="TouchEnabled";
		AppContextProperties[AppContextProperties["CommerceAllowed"]=19]="CommerceAllowed";
		AppContextProperties[AppContextProperties["RequirementMatrix"]=20]="RequirementMatrix"
	})(OSFWebkit.AppContextProperties || (OSFWebkit.AppContextProperties={}));
	var AppContextProperties=OSFWebkit.AppContextProperties;
	(function(MethodId)
	{
		MethodId[MethodId["Execute"]=1]="Execute";
		MethodId[MethodId["RegisterEvent"]=2]="RegisterEvent";
		MethodId[MethodId["UnregisterEvent"]=3]="UnregisterEvent";
		MethodId[MethodId["WriteSettings"]=4]="WriteSettings";
		MethodId[MethodId["GetContext"]=5]="GetContext"
	})(OSFWebkit.MethodId || (OSFWebkit.MethodId={}));
	var MethodId=OSFWebkit.MethodId;
	var WebkitHostController=function()
		{
			function WebkitHostController(hostScriptProxy)
			{
				this.hostScriptProxy=hostScriptProxy
			}
			WebkitHostController.prototype.execute=function(id, params, callback)
			{
				var args=params;
				if(args==null)
					args=[];
				var hostParams={
						id: id,
						apiArgs: args
					};
				var agaveResponseCallback=function(payload)
					{
						if(callback)
						{
							var invokeArguments=[];
							if(OSF.OUtil.isArray(payload))
								for(var i=0; i < payload.length; i++)
								{
									var element=payload[i];
									if(OSF.OUtil.isArray(element))
										element=new OSFWebkit.WebkitSafeArray(element);
									invokeArguments.unshift(element)
								}
							return callback.apply(null,invokeArguments)
						}
					};
				this.hostScriptProxy.invokeMethod(OSF.Webkit.MessageHandlerName,OSF.Webkit.MethodId.Execute,hostParams,agaveResponseCallback)
			};
			WebkitHostController.prototype.registerEvent=function(id, targetId, handler, callback)
			{
				var agaveEventHandlerCallback=function(payload)
					{
						var safeArraySource=payload;
						var eventId=0;
						if(OSF.OUtil.isArray(payload) && payload.length >=2)
						{
							safeArraySource=payload[0];
							eventId=payload[1]
						}
						if(handler)
							handler(eventId,new OSFWebkit.WebkitSafeArray(safeArraySource))
					};
				var agaveResponseCallback=function(payload)
					{
						if(callback)
							return callback(new OSFWebkit.WebkitSafeArray(payload))
					};
				this.hostScriptProxy.registerEvent(OSF.Webkit.MessageHandlerName,OSF.Webkit.MethodId.RegisterEvent,id,targetId,agaveEventHandlerCallback,agaveResponseCallback)
			};
			WebkitHostController.prototype.unregisterEvent=function(id, targetId, callback)
			{
				var agaveResponseCallback=function(response)
					{
						return callback(new OSFWebkit.WebkitSafeArray(response))
					};
				this.hostScriptProxy.unregisterEvent(OSF.Webkit.MessageHandlerName,OSF.Webkit.MethodId.UnregisterEvent,id,targetId,agaveResponseCallback)
			};
			WebkitHostController.prototype.messageParent=function(params)
			{
				var message=params[Microsoft.Office.WebExtension.Parameters.MessageToParent];
				var messageObj={dialogMessage: {
							messageType: OSF.DialogMessageType.DialogMessageReceived,
							messageContent: message
						}};
				window.opener.postMessage(JSON.stringify(messageObj),window.location.origin)
			};
			WebkitHostController.prototype.openDialog=function(id, targetId, handler, callback)
			{
				var magicWord="action=displayDialog";
				var fragmentSeparator="#";
				var callArgs=JSON.parse(targetId);
				var callUrl=callArgs.url;
				if(!callUrl)
					return;
				var urlParts=callUrl.split(fragmentSeparator);
				var seperator="?";
				if(urlParts[0].indexOf("?") > -1)
					seperator="&";
				var width=screen.width * callArgs.width / 100;
				var height=screen.height * callArgs.height / 100;
				var params="width="+width+", height="+height;
				urlParts[0]=urlParts[0].concat(seperator).concat(magicWord);
				var openUrl=urlParts.join(fragmentSeparator);
				WebkitHostController.popup=window.open(openUrl,"",params);
				function receiveMessage(event)
				{
					if(event.origin==window.location.origin)
						try
						{
							var messageObj=JSON.parse(event.data);
							if(messageObj.dialogMessage)
								handler(id,[OSF.DialogMessageType.DialogMessageReceived,messageObj.dialogMessage.messageContent])
						}
						catch(e)
						{
							OsfMsAjaxFactory.msAjaxDebug.trace("messages received cannot be handlered. Message:"+event.data)
						}
				}
				window.addEventListener("message",receiveMessage);
				var interval;
				function checkWindowClose()
				{
					try
					{
						if(WebkitHostController.popup==null || WebkitHostController.popup.closed)
						{
							window.clearInterval(interval);
							window.removeEventListener("message",receiveMessage);
							handler(id,[OSF.DialogMessageType.DialogClosed])
						}
					}
					catch(e)
					{
						OsfMsAjaxFactory.msAjaxDebug.trace("Error happened when popup window closed.")
					}
				}
				interval=window.setInterval(checkWindowClose,1e3);
				callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess)
			};
			WebkitHostController.prototype.closeDialog=function(id, targetId, callback)
			{
				if(WebkitHostController.popup)
				{
					WebkitHostController.popup.close();
					WebkitHostController.popup=null;
					callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess)
				}
				else
					callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError)
			};
			return WebkitHostController
		}();
	OSFWebkit.WebkitHostController=WebkitHostController
})(OSFWebkit || (OSFWebkit={}));
OSF.Webkit=OSFWebkit;
OSF.ClientHostController=new OSFWebkit.WebkitHostController(OSF.ScriptMessaging.GetScriptMessenger());
OSF.DDA.ClientSettingsManager={
	getSettingsExecuteMethod: function OSF_DDA_ClientSettingsManager$getSettingsExecuteMethod(hostDelegateMethod)
	{
		return function(args)
			{
				var status,
					response;
				var onComplete=function onComplete(status, response)
					{
						if(args.onReceiving)
							args.onReceiving();
						if(args.onComplete)
							args.onComplete(status,response)
					};
				try
				{
					hostDelegateMethod(args.hostCallArgs,args.onCalling,onComplete)
				}
				catch(ex)
				{
					status=OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError;
					response={
						name: Strings.OfficeOM.L_InternalError,
						message: ex
					};
					onComplete(status,response)
				}
			}
	},
	read: function OSF_DDA_ClientSettingsManager$read(onCalling, onComplete)
	{
		var keys=[];
		var values=[];
		if(onCalling)
			onCalling();
		var initializationHelper=OSF._OfficeAppFactory.getInitializationHelper();
		var onReceivedContext=function onReceivedContext(appContext)
			{
				if(onComplete)
					onComplete(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess,appContext.get_settings())
			};
		initializationHelper.getAppContext(null,onReceivedContext)
	},
	write: function OSF_DDA_ClientSettingsManager$write(serializedSettings, overwriteIfStale, onCalling, onComplete)
	{
		var hostParams={};
		var keys=[];
		var values=[];
		for(var key in serializedSettings)
		{
			keys.push(key);
			values.push(serializedSettings[key])
		}
		hostParams["keys"]=keys;
		hostParams["values"]=values;
		if(onCalling)
			onCalling();
		var onWriteCompleted=function onWriteCompleted(status)
			{
				if(onComplete)
					onComplete(status[0],null)
			};
		OSF.ScriptMessaging.GetScriptMessenger().invokeMethod(OSF.Webkit.MessageHandlerName,OSF.Webkit.MethodId.WriteSettings,hostParams,onWriteCompleted)
	}
};
OSF.InitializationHelper.prototype.initializeSettings=function OSF_InitializationHelper$initializeSettings(appContext, refreshSupported)
{
	var serializedSettings=appContext.get_settings();
	var settings=this.deserializeSettings(serializedSettings,refreshSupported);
	return settings
};
OSF.InitializationHelper.prototype.getAppContext=function OSF_InitializationHelper$getAppContext(wnd, gotAppContext)
{
	var getInvocationCallback=function OSF_InitializationHelper_getAppContextAsync$getInvocationCallbackWebApp(appContext)
		{
			var returnedContext;
			var appContextProperties=OSF.Webkit.AppContextProperties;
			var appType=appContext[appContextProperties.AppType];
			var hostSettings=appContext[appContextProperties.Settings];
			var serializedSettings={};
			var keys=hostSettings[0];
			var values=hostSettings[1];
			for(var index=0; index < keys.length; index++)
				serializedSettings[keys[index]]=values[index];
			var id=appContext[appContextProperties.SolutionReferenceId];
			var version=appContext[appContextProperties.MajorVersion];
			var clientMode=appContext[appContextProperties.AppCapabilities];
			var UILocale=appContext[appContextProperties.APPUILocale];
			var dataLocale=appContext[appContextProperties.AppDataLocale];
			var docUrl=appContext[appContextProperties.DocumentUrl];
			var reason=appContext[appContextProperties.ActivationMode];
			var osfControlType=appContext[appContextProperties.ControlIntegrationLevel];
			var eToken=appContext[appContextProperties.SolutionToken];
			eToken=eToken ? eToken.toString() : "";
			var correlationId=appContext[appContextProperties.CorrelationId];
			var appInstanceId=appContext[appContextProperties.InstanceId];
			var touchEnabled=appContext[appContextProperties.TouchEnabled];
			var commerceAllowed=appContext[appContextProperties.CommerceAllowed];
			var minorVersion=appContext[appContextProperties.MinorVersion];
			var requirementMatrix=appContext[appContextProperties.RequirementMatrix];
			returnedContext=new OSF.OfficeAppContext(id,appType,version,UILocale,dataLocale,docUrl,clientMode,serializedSettings,reason,osfControlType,eToken,correlationId,appInstanceId,touchEnabled,commerceAllowed,minorVersion,requirementMatrix);
			if(OSF.AppTelemetry)
				OSF.AppTelemetry.initialize(returnedContext);
			gotAppContext(returnedContext)
		};
	var handler;
	if(this._hostInfo.isDialog)
		handler=OSF.Webkit.PopupMessageHandlerName;
	else
		handler=OSF.Webkit.MessageHandlerName;
	OSF.ScriptMessaging.GetScriptMessenger().invokeMethod(handler,OSF.Webkit.MethodId.GetContext,[],getInvocationCallback)
};
(function()
{
	var checkScriptOverride=function OSF$checkScriptOverride()
		{
			var postScriptOverrideCheckAction=function OSF$postScriptOverrideCheckAction(customizedScriptPath)
				{
					if(customizedScriptPath)
						OSF.OUtil.loadScript(customizedScriptPath,function()
						{
							OsfMsAjaxFactory.msAjaxDebug.trace("loaded customized script:"+customizedScriptPath)
						})
				};
			var conversationID,
				webAppUrl,
				items;
			var clientEndPoint=null;
			var xdmInfoValue=OSF.OUtil.parseXdmInfo();
			if(xdmInfoValue)
			{
				items=OSF.OUtil.getInfoItems(xdmInfoValue);
				if(items && items.length >=3)
				{
					conversationID=items[0];
					webAppUrl=items[2];
					var serializerVersion=OSF.OUtil.parseSerializerVersionWithGivenFragment(false,OSF._OfficeAppFactory.getWindowLocationHash());
					if(isNaN(serializerVersion) && OSF._OfficeAppFactory.getWindowName)
						serializerVersion=OSF.OUtil.parseSerializerVersionFromWindowName(false,OSF._OfficeAppFactory.getWindowName());
					clientEndPoint=Microsoft.Office.Common.XdmCommunicationManager.connect(conversationID,window.parent,webAppUrl,serializerVersion)
				}
			}
			var customizedScriptPath=null;
			if(!clientEndPoint)
			{
				try
				{
					if(window.external && typeof window.external.getCustomizedScriptPath !=="undefined")
						customizedScriptPath=window.external.getCustomizedScriptPath()
				}
				catch(ex)
				{
					OsfMsAjaxFactory.msAjaxDebug.trace("no script override through window.external.")
				}
				postScriptOverrideCheckAction(customizedScriptPath)
			}
			else
				try
				{
					clientEndPoint.invoke("getCustomizedScriptPathAsync",function OSF$getCustomizedScriptPathAsyncCallback(errorCode, scriptPath)
					{
						postScriptOverrideCheckAction(errorCode===0 ? scriptPath : null)
					},{__timeout__: 1e3})
				}
				catch(ex)
				{
					OsfMsAjaxFactory.msAjaxDebug.trace("no script override through cross frame communication.")
				}
		};
	var requiresMsAjax=true;
	if(requiresMsAjax && !OsfMsAjaxFactory.isMsAjaxLoaded())
		if(!(OSF._OfficeAppFactory && OSF._OfficeAppFactory && OSF._OfficeAppFactory.getLoadScriptHelper && OSF._OfficeAppFactory.getLoadScriptHelper().isScriptLoading(OSF.ConstantNames.MicrosoftAjaxId)))
			OsfMsAjaxFactory.loadMsAjaxFull(function OSF$loadMSAjaxCallback()
			{
				if(OsfMsAjaxFactory.isMsAjaxLoaded())
					checkScriptOverride();
				else
					throw"Not able to load MicrosoftAjax.js.";
			});
		else
			OSF._OfficeAppFactory.getLoadScriptHelper().waitForScripts([OSF.ConstantNames.MicrosoftAjaxId],checkScriptOverride);
	else
		checkScriptOverride()
})();
Microsoft.Office.WebExtension.EventType={};
OSF.EventDispatch=function OSF_EventDispatch(eventTypes)
{
	this._eventHandlers={};
	this._queuedEventsArgs={};
	for(var entry in eventTypes)
	{
		var eventType=eventTypes[entry];
		this._eventHandlers[eventType]=[];
		this._queuedEventsArgs[eventType]=[]
	}
};
OSF.EventDispatch.prototype={
	getSupportedEvents: function OSF_EventDispatch$getSupportedEvents()
	{
		var events=[];
		for(var eventName in this._eventHandlers)
			events.push(eventName);
		return events
	},
	supportsEvent: function OSF_EventDispatch$supportsEvent(event)
	{
		var isSupported=false;
		for(var eventName in this._eventHandlers)
			if(event==eventName)
			{
				isSupported=true;
				break
			}
		return isSupported
	},
	hasEventHandler: function OSF_EventDispatch$hasEventHandler(eventType, handler)
	{
		var handlers=this._eventHandlers[eventType];
		if(handlers && handlers.length > 0)
			for(var h in handlers)
				if(handlers[h]===handler)
					return true;
		return false
	},
	addEventHandler: function OSF_EventDispatch$addEventHandler(eventType, handler)
	{
		if(typeof handler !="function")
			return false;
		var handlers=this._eventHandlers[eventType];
		if(handlers && !this.hasEventHandler(eventType,handler))
		{
			handlers.push(handler);
			return true
		}
		else
			return false
	},
	addEventHandlerAndFireQueuedEvent: function OSF_EventDispatch$addEventHandlerAndFireQueuedEvent(eventType, handler)
	{
		var handlers=this._eventHandlers[eventType];
		var isFirstHandler=handlers.length==0;
		var succeed=this.addEventHandler(eventType,handler);
		if(isFirstHandler && succeed)
			this.fireQueuedEvent(eventType);
		return succeed
	},
	removeEventHandler: function OSF_EventDispatch$removeEventHandler(eventType, handler)
	{
		var handlers=this._eventHandlers[eventType];
		if(handlers && handlers.length > 0)
			for(var index=0; index < handlers.length; index++)
				if(handlers[index]===handler)
				{
					handlers.splice(index,1);
					return true
				}
		return false
	},
	clearEventHandlers: function OSF_EventDispatch$clearEventHandlers(eventType)
	{
		if(typeof this._eventHandlers[eventType] !="undefined" && this._eventHandlers[eventType].length > 0)
		{
			this._eventHandlers[eventType]=[];
			return true
		}
		return false
	},
	getEventHandlerCount: function OSF_EventDispatch$getEventHandlerCount(eventType)
	{
		return this._eventHandlers[eventType] !=undefined ? this._eventHandlers[eventType].length : -1
	},
	fireEvent: function OSF_EventDispatch$fireEvent(eventArgs)
	{
		if(eventArgs.type==undefined)
			return false;
		var eventType=eventArgs.type;
		if(eventType && this._eventHandlers[eventType])
		{
			var eventHandlers=this._eventHandlers[eventType];
			for(var handler in eventHandlers)
				eventHandlers[handler](eventArgs);
			return true
		}
		else
			return false
	},
	fireOrQueueEvent: function OSF_EventDispatch$fireOrQueueEvent(eventArgs)
	{
		var eventType=eventArgs.type;
		if(eventType && this._eventHandlers[eventType])
		{
			var eventHandlers=this._eventHandlers[eventType];
			var queuedEvents=this._queuedEventsArgs[eventType];
			if(eventHandlers.length==0)
				queuedEvents.push(eventArgs);
			else
				this.fireEvent(eventArgs);
			return true
		}
		else
			return false
	},
	fireQueuedEvent: function OSF_EventDispatch$queueEvent(eventType)
	{
		if(eventType && this._eventHandlers[eventType])
		{
			var eventHandlers=this._eventHandlers[eventType];
			var queuedEvents=this._queuedEventsArgs[eventType];
			if(eventHandlers.length > 0)
			{
				var eventHandler=eventHandlers[0];
				while(queuedEvents.length > 0)
				{
					var eventArgs=queuedEvents.shift();
					eventHandler(eventArgs)
				}
				return true
			}
		}
		return false
	}
};
OSF.DDA.OMFactory=OSF.DDA.OMFactory || {};
OSF.DDA.OMFactory.manufactureEventArgs=function OSF_DDA_OMFactory$manufactureEventArgs(eventType, target, eventProperties)
{
	var args;
	switch(eventType)
	{
		case Microsoft.Office.WebExtension.EventType.DocumentSelectionChanged:
			args=new OSF.DDA.DocumentSelectionChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.BindingSelectionChanged:
			args=new OSF.DDA.BindingSelectionChangedEventArgs(this.manufactureBinding(eventProperties,target.document),eventProperties[OSF.DDA.PropertyDescriptors.Subset]);
			break;
		case Microsoft.Office.WebExtension.EventType.BindingDataChanged:
			args=new OSF.DDA.BindingDataChangedEventArgs(this.manufactureBinding(eventProperties,target.document));
			break;
		case Microsoft.Office.WebExtension.EventType.SettingsChanged:
			args=new OSF.DDA.SettingsChangedEventArgs(target);
			break;
		case Microsoft.Office.WebExtension.EventType.ActiveViewChanged:
			args=new OSF.DDA.ActiveViewChangedEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.OfficeThemeChanged:
			args=new OSF.DDA.Theming.OfficeThemeChangedEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.DocumentThemeChanged:
			args=new OSF.DDA.Theming.DocumentThemeChangedEventArgs(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.AppCommandInvoked:
			args=OSF.DDA.AppCommand.AppCommandInvokedEventArgs.create(eventProperties);
			break;
		case Microsoft.Office.WebExtension.EventType.DataNodeInserted:
			args=new OSF.DDA.NodeInsertedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NewNode]),eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
			break;
		case Microsoft.Office.WebExtension.EventType.DataNodeReplaced:
			args=new OSF.DDA.NodeReplacedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.OldNode]),this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NewNode]),eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
			break;
		case Microsoft.Office.WebExtension.EventType.DataNodeDeleted:
			args=new OSF.DDA.NodeDeletedEventArgs(this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.OldNode]),this.manufactureDataNode(eventProperties[OSF.DDA.DataNodeEventProperties.NextSiblingNode]),eventProperties[OSF.DDA.DataNodeEventProperties.InUndoRedo]);
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
		case Microsoft.Office.WebExtension.EventType.OlkItemSelectedChanged:
			args=new OSF.DDA.OlkItemSelectedChangedEventArgs(target);
			break;
		default:
			throw OsfMsAjaxFactory.msAjaxError.argument(Microsoft.Office.WebExtension.Parameters.EventType,OSF.OUtil.formatString(Strings.OfficeOM.L_NotSupportedEventType,eventType));
	}
	return args
};
OSF.DDA.AsyncMethodNames.addNames({
	AddHandlerAsync: "addHandlerAsync",
	RemoveHandlerAsync: "removeHandlerAsync"
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.AddHandlerAsync,
	requiredArguments: [{
			name: Microsoft.Office.WebExtension.Parameters.EventType,
			"enum": Microsoft.Office.WebExtension.EventType,
			verify: function(eventType, caller, eventDispatch)
			{
				return eventDispatch.supportsEvent(eventType)
			}
		},{
			name: Microsoft.Office.WebExtension.Parameters.Handler,
			types: ["function"]
		}],
	supportedOptions: [],
	privateStateCallbacks: []
});
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.RemoveHandlerAsync,
	requiredArguments: [{
			name: Microsoft.Office.WebExtension.Parameters.EventType,
			"enum": Microsoft.Office.WebExtension.EventType,
			verify: function(eventType, caller, eventDispatch)
			{
				return eventDispatch.supportsEvent(eventType)
			}
		}],
	supportedOptions: [{
			name: Microsoft.Office.WebExtension.Parameters.Handler,
			value: {
				types: ["function","object"],
				defaultValue: null
			}
		}],
	privateStateCallbacks: []
});
OSF.DialogShownStatus={
	hasDialogShown: false,
	isWindowDialog: false
};
OSF.OUtil.augmentList(OSF.DDA.EventDescriptors,{DialogMessageReceivedEvent: "DialogMessageReceivedEvent"});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType,{
	DialogMessageReceived: "dialogMessageReceived",
	DialogEventReceived: "dialogEventReceived"
});
OSF.OUtil.augmentList(OSF.DDA.PropertyDescriptors,{
	MessageType: "messageType",
	MessageContent: "messageContent"
});
OSF.DDA.DialogEventType={};
OSF.OUtil.augmentList(OSF.DDA.DialogEventType,{
	DialogClosed: "dialogClosed",
	NavigationFailed: "naviationFailed"
});
OSF.DDA.AsyncMethodNames.addNames({
	DisplayDialogAsync: "displayDialogAsync",
	CloseAsync: "close"
});
OSF.DDA.SyncMethodNames.addNames({
	MessageParent: "messageParent",
	AddMessageHandler: "addEventHandler"
});
OSF.DDA.UI.ParentUI=function OSF_DDA_ParentUI()
{
	var eventDispatch=new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.DialogMessageReceived,Microsoft.Office.WebExtension.EventType.DialogEventReceived]);
	var openDialogName=OSF.DDA.AsyncMethodNames.DisplayDialogAsync.displayName;
	var target=this;
	if(!target[openDialogName])
		OSF.OUtil.defineEnumerableProperty(target,openDialogName,{value: function()
			{
				var openDialog=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.OpenDialog];
				openDialog(arguments,eventDispatch,target)
			}});
	OSF.OUtil.finalizeProperties(this)
};
OSF.DDA.UI.ChildUI=function OSF_DDA_ChildUI()
{
	var messageParentName=OSF.DDA.SyncMethodNames.MessageParent.displayName;
	var target=this;
	if(!target[messageParentName])
		OSF.OUtil.defineEnumerableProperty(target,messageParentName,{value: function()
			{
				var messageParent=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.MessageParent];
				return messageParent(arguments,target)
			}});
	OSF.OUtil.finalizeProperties(this)
};
OSF.DialogHandler=function OSF_DialogHandler(){};
OSF.DDA.DialogEventArgs=function OSF_DDA_DialogEventArgs(message)
{
	if(message[OSF.DDA.PropertyDescriptors.MessageType]==OSF.DialogMessageType.DialogMessageReceived)
		OSF.OUtil.defineEnumerableProperties(this,{
			type: {value: Microsoft.Office.WebExtension.EventType.DialogMessageReceived},
			message: {value: message[OSF.DDA.PropertyDescriptors.MessageContent]}
		});
	else
		OSF.OUtil.defineEnumerableProperties(this,{
			type: {value: Microsoft.Office.WebExtension.EventType.DialogEventReceived},
			error: {value: message[OSF.DDA.PropertyDescriptors.MessageType]}
		})
};
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.DisplayDialogAsync,
	requiredArguments: [{
			name: Microsoft.Office.WebExtension.Parameters.Url,
			types: ["string"]
		}],
	supportedOptions: [{
			name: Microsoft.Office.WebExtension.Parameters.Width,
			value: {
				types: ["number"],
				defaultValue: 99
			}
		},{
			name: Microsoft.Office.WebExtension.Parameters.Height,
			value: {
				types: ["number"],
				defaultValue: 99
			}
		},{
			name: Microsoft.Office.WebExtension.Parameters.RequireHTTPs,
			value: {
				types: ["boolean"],
				defaultValue: true
			}
		},{
			name: Microsoft.Office.WebExtension.Parameters.DisplayInIframe,
			value: {
				types: ["boolean"],
				defaultValue: true
			}
		}],
	privateStateCallbacks: [],
	onSucceeded: function(args, caller, callArgs)
	{
		var targetId=args[Microsoft.Office.WebExtension.Parameters.Id];
		var eventDispatch=args[Microsoft.Office.WebExtension.Parameters.Data];
		var dialog=new OSF.DialogHandler;
		var closeDialog=OSF.DDA.AsyncMethodNames.CloseAsync.displayName;
		OSF.OUtil.defineEnumerableProperty(dialog,closeDialog,{value: function()
			{
				var closeDialogfunction=OSF._OfficeAppFactory.getHostFacade()[OSF.DDA.DispIdHost.Methods.CloseDialog];
				closeDialogfunction(arguments,targetId,eventDispatch,dialog)
			}});
		var addHandler=OSF.DDA.SyncMethodNames.AddMessageHandler.displayName;
		OSF.OUtil.defineEnumerableProperty(dialog,addHandler,{value: function()
			{
				var syncMethodCall=OSF.DDA.SyncMethodCalls[OSF.DDA.SyncMethodNames.AddMessageHandler.id];
				var callArgs=syncMethodCall.verifyAndExtractCall(arguments,dialog,eventDispatch);
				var eventType=callArgs[Microsoft.Office.WebExtension.Parameters.EventType];
				var handler=callArgs[Microsoft.Office.WebExtension.Parameters.Handler];
				return eventDispatch.addEventHandlerAndFireQueuedEvent(eventType,handler)
			}});
		return dialog
	},
	checkCallArgs: function(callArgs, caller, stateInfo)
	{
		if(callArgs[Microsoft.Office.WebExtension.Parameters.Width] <=0)
			callArgs[Microsoft.Office.WebExtension.Parameters.Width]=1;
		if(callArgs[Microsoft.Office.WebExtension.Parameters.Width] > 100)
			callArgs[Microsoft.Office.WebExtension.Parameters.Width]=99;
		if(callArgs[Microsoft.Office.WebExtension.Parameters.Height] <=0)
			callArgs[Microsoft.Office.WebExtension.Parameters.Height]=1;
		if(callArgs[Microsoft.Office.WebExtension.Parameters.Height] > 100)
			callArgs[Microsoft.Office.WebExtension.Parameters.Height]=99;
		return callArgs
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
	requiredArguments: [{
			name: Microsoft.Office.WebExtension.Parameters.MessageToParent,
			types: ["string","number","boolean"]
		}],
	supportedOptions: []
});
OSF.DDA.SyncMethodCalls.define({
	method: OSF.DDA.SyncMethodNames.AddMessageHandler,
	requiredArguments: [{
			name: Microsoft.Office.WebExtension.Parameters.EventType,
			"enum": Microsoft.Office.WebExtension.EventType,
			verify: function(eventType, caller, eventDispatch)
			{
				return eventDispatch.supportsEvent(eventType)
			}
		},{
			name: Microsoft.Office.WebExtension.Parameters.Handler,
			types: ["function"]
		}],
	supportedOptions: []
});
OSF.DDA.SafeArray.Delegate.openDialog=function OSF_DDA_SafeArray_Delegate$OpenDialog(args)
{
	try
	{
		if(args.onCalling)
			args.onCalling();
		var callback=OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent(true,args);
		OSF.ClientHostController.openDialog(args.dispId,args.targetId,function OSF_DDA_SafeArrayDelegate$RegisterEventAsync_OnEvent(eventDispId, payload)
		{
			if(args.onEvent)
				args.onEvent(payload);
			if(OSF.AppTelemetry)
				OSF.AppTelemetry.onEventDone(args.dispId)
		},callback)
	}
	catch(ex)
	{
		OSF.DDA.SafeArray.Delegate._onException(ex,args)
	}
};
OSF.DDA.SafeArray.Delegate.closeDialog=function OSF_DDA_SafeArray_Delegate$CloseDialog(args)
{
	if(args.onCalling)
		args.onCalling();
	var callback=OSF.DDA.SafeArray.Delegate._getOnAfterRegisterEvent(false,args);
	try
	{
		OSF.ClientHostController.closeDialog(args.dispId,args.targetId,callback)
	}
	catch(ex)
	{
		OSF.DDA.SafeArray.Delegate._onException(ex,args)
	}
};
OSF.DDA.SafeArray.Delegate.messageParent=function OSF_DDA_SafeArray_Delegate$MessageParent(args)
{
	try
	{
		if(args.onCalling)
			args.onCalling();
		var startTime=(new Date).getTime();
		var result=OSF.ClientHostController.messageParent(args.hostCallArgs);
		if(args.onReceiving)
			args.onReceiving();
		if(OSF.AppTelemetry)
			OSF.AppTelemetry.onMethodDone(args.dispId,args.hostCallArgs,Math.abs((new Date).getTime() - startTime),result);
		return result
	}
	catch(ex)
	{
		return OSF.DDA.SafeArray.Delegate._onExceptionSyncMethod(ex)
	}
};
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDispId.dispidDialogMessageReceivedEvent,
	fromHost: [{
			name: OSF.DDA.EventDescriptors.DialogMessageReceivedEvent,
			value: OSF.DDA.SafeArray.Delegate.ParameterMap.self
		}],
	isComplexType: true
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.EventDescriptors.DialogMessageReceivedEvent,
	fromHost: [{
			name: OSF.DDA.PropertyDescriptors.MessageType,
			value: 0
		},{
			name: OSF.DDA.PropertyDescriptors.MessageContent,
			value: 1
		}],
	isComplexType: true
});
OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType,{OlkItemSelectedChanged: "olkItemSelectedChanged"});
OSF.DDA.OlkItemSelectedChangedEventArgs=function OSF_DDA_OlkItemSelectedChangedEventArgs(mailboxInstance)
{
	OSF.OUtil.defineEnumerableProperties(this,{
		type: {value: Microsoft.Office.WebExtension.EventType.OlkItemSelectedChanged},
		mailbox: {value: mailboxInstance}
	})
};
OSF.DDA.SafeArray.Delegate.ParameterMap.define({type: OSF.DDA.EventDispId.dispidOlkItemSelectedChangedEvent});
var OSFLog;
(function(OSFLog)
{
	var BaseUsageData=function()
		{
			function BaseUsageData(table)
			{
				this._table=table;
				this._fields={}
			}
			Object.defineProperty(BaseUsageData.prototype,"Fields",{
				get: function()
				{
					return this._fields
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(BaseUsageData.prototype,"Table",{
				get: function()
				{
					return this._table
				},
				enumerable: true,
				configurable: true
			});
			BaseUsageData.prototype.SerializeFields=function(){};
			BaseUsageData.prototype.SetSerializedField=function(key, value)
			{
				if(typeof value !=="undefined" && value !==null)
					this._serializedFields[key]=value.toString()
			};
			BaseUsageData.prototype.SerializeRow=function()
			{
				this._serializedFields={};
				this.SetSerializedField("Table",this._table);
				this.SerializeFields();
				return JSON.stringify(this._serializedFields)
			};
			return BaseUsageData
		}();
	OSFLog.BaseUsageData=BaseUsageData;
	var AppActivatedUsageData=function(_super)
		{
			__extends(AppActivatedUsageData,_super);
			function AppActivatedUsageData()
			{
				_super.call(this,"AppActivated")
			}
			Object.defineProperty(AppActivatedUsageData.prototype,"CorrelationId",{
				get: function()
				{
					return this.Fields["CorrelationId"]
				},
				set: function(value)
				{
					this.Fields["CorrelationId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppActivatedUsageData.prototype,"SessionId",{
				get: function()
				{
					return this.Fields["SessionId"]
				},
				set: function(value)
				{
					this.Fields["SessionId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppActivatedUsageData.prototype,"AppId",{
				get: function()
				{
					return this.Fields["AppId"]
				},
				set: function(value)
				{
					this.Fields["AppId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppActivatedUsageData.prototype,"AppInstanceId",{
				get: function()
				{
					return this.Fields["AppInstanceId"]
				},
				set: function(value)
				{
					this.Fields["AppInstanceId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppActivatedUsageData.prototype,"AppURL",{
				get: function()
				{
					return this.Fields["AppURL"]
				},
				set: function(value)
				{
					this.Fields["AppURL"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppActivatedUsageData.prototype,"AssetId",{
				get: function()
				{
					return this.Fields["AssetId"]
				},
				set: function(value)
				{
					this.Fields["AssetId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppActivatedUsageData.prototype,"Browser",{
				get: function()
				{
					return this.Fields["Browser"]
				},
				set: function(value)
				{
					this.Fields["Browser"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppActivatedUsageData.prototype,"UserId",{
				get: function()
				{
					return this.Fields["UserId"]
				},
				set: function(value)
				{
					this.Fields["UserId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppActivatedUsageData.prototype,"Host",{
				get: function()
				{
					return this.Fields["Host"]
				},
				set: function(value)
				{
					this.Fields["Host"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppActivatedUsageData.prototype,"HostVersion",{
				get: function()
				{
					return this.Fields["HostVersion"]
				},
				set: function(value)
				{
					this.Fields["HostVersion"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppActivatedUsageData.prototype,"ClientId",{
				get: function()
				{
					return this.Fields["ClientId"]
				},
				set: function(value)
				{
					this.Fields["ClientId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppActivatedUsageData.prototype,"AppSizeWidth",{
				get: function()
				{
					return this.Fields["AppSizeWidth"]
				},
				set: function(value)
				{
					this.Fields["AppSizeWidth"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppActivatedUsageData.prototype,"AppSizeHeight",{
				get: function()
				{
					return this.Fields["AppSizeHeight"]
				},
				set: function(value)
				{
					this.Fields["AppSizeHeight"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppActivatedUsageData.prototype,"Message",{
				get: function()
				{
					return this.Fields["Message"]
				},
				set: function(value)
				{
					this.Fields["Message"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppActivatedUsageData.prototype,"DocUrl",{
				get: function()
				{
					return this.Fields["DocUrl"]
				},
				set: function(value)
				{
					this.Fields["DocUrl"]=value
				},
				enumerable: true,
				configurable: true
			});
			AppActivatedUsageData.prototype.SerializeFields=function()
			{
				this.SetSerializedField("CorrelationId",this.CorrelationId);
				this.SetSerializedField("SessionId",this.SessionId);
				this.SetSerializedField("AppId",this.AppId);
				this.SetSerializedField("AppInstanceId",this.AppInstanceId);
				this.SetSerializedField("AppURL",this.AppURL);
				this.SetSerializedField("AssetId",this.AssetId);
				this.SetSerializedField("Browser",this.Browser);
				this.SetSerializedField("UserId",this.UserId);
				this.SetSerializedField("Host",this.Host);
				this.SetSerializedField("HostVersion",this.HostVersion);
				this.SetSerializedField("ClientId",this.ClientId);
				this.SetSerializedField("AppSizeWidth",this.AppSizeWidth);
				this.SetSerializedField("AppSizeHeight",this.AppSizeHeight);
				this.SetSerializedField("Message",this.Message);
				this.SetSerializedField("DocUrl",this.DocUrl)
			};
			return AppActivatedUsageData
		}(BaseUsageData);
	OSFLog.AppActivatedUsageData=AppActivatedUsageData;
	var ScriptLoadUsageData=function(_super)
		{
			__extends(ScriptLoadUsageData,_super);
			function ScriptLoadUsageData()
			{
				_super.call(this,"ScriptLoad")
			}
			Object.defineProperty(ScriptLoadUsageData.prototype,"CorrelationId",{
				get: function()
				{
					return this.Fields["CorrelationId"]
				},
				set: function(value)
				{
					this.Fields["CorrelationId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(ScriptLoadUsageData.prototype,"SessionId",{
				get: function()
				{
					return this.Fields["SessionId"]
				},
				set: function(value)
				{
					this.Fields["SessionId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(ScriptLoadUsageData.prototype,"ScriptId",{
				get: function()
				{
					return this.Fields["ScriptId"]
				},
				set: function(value)
				{
					this.Fields["ScriptId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(ScriptLoadUsageData.prototype,"StartTime",{
				get: function()
				{
					return this.Fields["StartTime"]
				},
				set: function(value)
				{
					this.Fields["StartTime"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(ScriptLoadUsageData.prototype,"ResponseTime",{
				get: function()
				{
					return this.Fields["ResponseTime"]
				},
				set: function(value)
				{
					this.Fields["ResponseTime"]=value
				},
				enumerable: true,
				configurable: true
			});
			ScriptLoadUsageData.prototype.SerializeFields=function()
			{
				this.SetSerializedField("CorrelationId",this.CorrelationId);
				this.SetSerializedField("SessionId",this.SessionId);
				this.SetSerializedField("ScriptId",this.ScriptId);
				this.SetSerializedField("StartTime",this.StartTime);
				this.SetSerializedField("ResponseTime",this.ResponseTime)
			};
			return ScriptLoadUsageData
		}(BaseUsageData);
	OSFLog.ScriptLoadUsageData=ScriptLoadUsageData;
	var AppClosedUsageData=function(_super)
		{
			__extends(AppClosedUsageData,_super);
			function AppClosedUsageData()
			{
				_super.call(this,"AppClosed")
			}
			Object.defineProperty(AppClosedUsageData.prototype,"CorrelationId",{
				get: function()
				{
					return this.Fields["CorrelationId"]
				},
				set: function(value)
				{
					this.Fields["CorrelationId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppClosedUsageData.prototype,"SessionId",{
				get: function()
				{
					return this.Fields["SessionId"]
				},
				set: function(value)
				{
					this.Fields["SessionId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppClosedUsageData.prototype,"FocusTime",{
				get: function()
				{
					return this.Fields["FocusTime"]
				},
				set: function(value)
				{
					this.Fields["FocusTime"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppClosedUsageData.prototype,"AppSizeFinalWidth",{
				get: function()
				{
					return this.Fields["AppSizeFinalWidth"]
				},
				set: function(value)
				{
					this.Fields["AppSizeFinalWidth"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppClosedUsageData.prototype,"AppSizeFinalHeight",{
				get: function()
				{
					return this.Fields["AppSizeFinalHeight"]
				},
				set: function(value)
				{
					this.Fields["AppSizeFinalHeight"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppClosedUsageData.prototype,"OpenTime",{
				get: function()
				{
					return this.Fields["OpenTime"]
				},
				set: function(value)
				{
					this.Fields["OpenTime"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppClosedUsageData.prototype,"CloseMethod",{
				get: function()
				{
					return this.Fields["CloseMethod"]
				},
				set: function(value)
				{
					this.Fields["CloseMethod"]=value
				},
				enumerable: true,
				configurable: true
			});
			AppClosedUsageData.prototype.SerializeFields=function()
			{
				this.SetSerializedField("CorrelationId",this.CorrelationId);
				this.SetSerializedField("SessionId",this.SessionId);
				this.SetSerializedField("FocusTime",this.FocusTime);
				this.SetSerializedField("AppSizeFinalWidth",this.AppSizeFinalWidth);
				this.SetSerializedField("AppSizeFinalHeight",this.AppSizeFinalHeight);
				this.SetSerializedField("OpenTime",this.OpenTime);
				this.SetSerializedField("CloseMethod",this.CloseMethod)
			};
			return AppClosedUsageData
		}(BaseUsageData);
	OSFLog.AppClosedUsageData=AppClosedUsageData;
	var APIUsageUsageData=function(_super)
		{
			__extends(APIUsageUsageData,_super);
			function APIUsageUsageData()
			{
				_super.call(this,"APIUsage")
			}
			Object.defineProperty(APIUsageUsageData.prototype,"CorrelationId",{
				get: function()
				{
					return this.Fields["CorrelationId"]
				},
				set: function(value)
				{
					this.Fields["CorrelationId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(APIUsageUsageData.prototype,"SessionId",{
				get: function()
				{
					return this.Fields["SessionId"]
				},
				set: function(value)
				{
					this.Fields["SessionId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(APIUsageUsageData.prototype,"APIType",{
				get: function()
				{
					return this.Fields["APIType"]
				},
				set: function(value)
				{
					this.Fields["APIType"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(APIUsageUsageData.prototype,"APIID",{
				get: function()
				{
					return this.Fields["APIID"]
				},
				set: function(value)
				{
					this.Fields["APIID"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(APIUsageUsageData.prototype,"Parameters",{
				get: function()
				{
					return this.Fields["Parameters"]
				},
				set: function(value)
				{
					this.Fields["Parameters"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(APIUsageUsageData.prototype,"ResponseTime",{
				get: function()
				{
					return this.Fields["ResponseTime"]
				},
				set: function(value)
				{
					this.Fields["ResponseTime"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(APIUsageUsageData.prototype,"ErrorType",{
				get: function()
				{
					return this.Fields["ErrorType"]
				},
				set: function(value)
				{
					this.Fields["ErrorType"]=value
				},
				enumerable: true,
				configurable: true
			});
			APIUsageUsageData.prototype.SerializeFields=function()
			{
				this.SetSerializedField("CorrelationId",this.CorrelationId);
				this.SetSerializedField("SessionId",this.SessionId);
				this.SetSerializedField("APIType",this.APIType);
				this.SetSerializedField("APIID",this.APIID);
				this.SetSerializedField("Parameters",this.Parameters);
				this.SetSerializedField("ResponseTime",this.ResponseTime);
				this.SetSerializedField("ErrorType",this.ErrorType)
			};
			return APIUsageUsageData
		}(BaseUsageData);
	OSFLog.APIUsageUsageData=APIUsageUsageData;
	var AppInitializationUsageData=function(_super)
		{
			__extends(AppInitializationUsageData,_super);
			function AppInitializationUsageData()
			{
				_super.call(this,"AppInitialization")
			}
			Object.defineProperty(AppInitializationUsageData.prototype,"CorrelationId",{
				get: function()
				{
					return this.Fields["CorrelationId"]
				},
				set: function(value)
				{
					this.Fields["CorrelationId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppInitializationUsageData.prototype,"SessionId",{
				get: function()
				{
					return this.Fields["SessionId"]
				},
				set: function(value)
				{
					this.Fields["SessionId"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppInitializationUsageData.prototype,"SuccessCode",{
				get: function()
				{
					return this.Fields["SuccessCode"]
				},
				set: function(value)
				{
					this.Fields["SuccessCode"]=value
				},
				enumerable: true,
				configurable: true
			});
			Object.defineProperty(AppInitializationUsageData.prototype,"Message",{
				get: function()
				{
					return this.Fields["Message"]
				},
				set: function(value)
				{
					this.Fields["Message"]=value
				},
				enumerable: true,
				configurable: true
			});
			AppInitializationUsageData.prototype.SerializeFields=function()
			{
				this.SetSerializedField("CorrelationId",this.CorrelationId);
				this.SetSerializedField("SessionId",this.SessionId);
				this.SetSerializedField("SuccessCode",this.SuccessCode);
				this.SetSerializedField("Message",this.Message)
			};
			return AppInitializationUsageData
		}(BaseUsageData);
	OSFLog.AppInitializationUsageData=AppInitializationUsageData
})(OSFLog || (OSFLog={}));
var Logger;
(function(Logger)
{
	"use strict";
	(function(TraceLevel)
	{
		TraceLevel[TraceLevel["info"]=0]="info";
		TraceLevel[TraceLevel["warning"]=1]="warning";
		TraceLevel[TraceLevel["error"]=2]="error"
	})(Logger.TraceLevel || (Logger.TraceLevel={}));
	var TraceLevel=Logger.TraceLevel;
	(function(SendFlag)
	{
		SendFlag[SendFlag["none"]=0]="none";
		SendFlag[SendFlag["flush"]=1]="flush"
	})(Logger.SendFlag || (Logger.SendFlag={}));
	var SendFlag=Logger.SendFlag;
	function allowUploadingData()
	{
		if(OSF.Logger && OSF.Logger.ulsEndpoint)
			OSF.Logger.ulsEndpoint.loadProxyFrame()
	}
	Logger.allowUploadingData=allowUploadingData;
	function sendLog(traceLevel, message, flag)
	{
		if(OSF.Logger && OSF.Logger.ulsEndpoint)
		{
			var jsonObj={
					traceLevel: traceLevel,
					message: message,
					flag: flag,
					internalLog: true
				};
			var logs=JSON.stringify(jsonObj);
			OSF.Logger.ulsEndpoint.writeLog(logs)
		}
	}
	Logger.sendLog=sendLog;
	function creatULSEndpoint()
	{
		try
		{
			return new ULSEndpointProxy
		}
		catch(e)
		{
			return null
		}
	}
	var ULSEndpointProxy=function()
		{
			function ULSEndpointProxy()
			{
				var _this=this;
				this.proxyFrame=null;
				this.telemetryEndPoint="https://telemetryservice.firstpartyapps.oaspapps.com/telemetryservice/telemetryproxy.html";
				this.buffer=[];
				this.proxyFrameReady=false;
				OSF.OUtil.addEventListener(window,"message",function(e)
				{
					return _this.tellProxyFrameReady(e)
				});
				setTimeout(function()
				{
					_this.loadProxyFrame()
				},3e3)
			}
			ULSEndpointProxy.prototype.writeLog=function(log)
			{
				if(this.proxyFrameReady===true)
					this.proxyFrame.contentWindow.postMessage(log,ULSEndpointProxy.telemetryOrigin);
				else if(this.buffer.length < 128)
					this.buffer.push(log)
			};
			ULSEndpointProxy.prototype.loadProxyFrame=function()
			{
				if(this.proxyFrame==null)
				{
					this.proxyFrame=document.createElement("iframe");
					this.proxyFrame.setAttribute("style","display:none");
					this.proxyFrame.setAttribute("src",this.telemetryEndPoint);
					document.head.appendChild(this.proxyFrame)
				}
			};
			ULSEndpointProxy.prototype.tellProxyFrameReady=function(e)
			{
				var _this=this;
				if(e.data==="ProxyFrameReadyToLog")
				{
					this.proxyFrameReady=true;
					for(var i=0; i < this.buffer.length; i++)
						this.writeLog(this.buffer[i]);
					this.buffer.length=0;
					OSF.OUtil.removeEventListener(window,"message",function(e)
					{
						return _this.tellProxyFrameReady(e)
					})
				}
				else if(e.data==="ProxyFrameReadyToInit")
				{
					var initJson={
							appName: "Office APPs",
							sessionId: OSF.OUtil.Guid.generateNewGuid()
						};
					var initStr=JSON.stringify(initJson);
					this.proxyFrame.contentWindow.postMessage(initStr,ULSEndpointProxy.telemetryOrigin)
				}
			};
			ULSEndpointProxy.telemetryOrigin="https://telemetryservice.firstpartyapps.oaspapps.com";
			return ULSEndpointProxy
		}();
	if(!OSF.Logger)
		OSF.Logger=Logger;
	Logger.ulsEndpoint=creatULSEndpoint()
})(Logger || (Logger={}));
var OSFAppTelemetry;
(function(OSFAppTelemetry)
{
	"use strict";
	var appInfo;
	var sessionId=OSF.OUtil.Guid.generateNewGuid();
	var osfControlAppCorrelationId="";
	var omexDomainRegex=new RegExp("^https?://store\\.office(ppe|-int)?\\.com/","i");
	var AppInfo=function()
		{
			function AppInfo(){}
			return AppInfo
		}();
	var Event=function()
		{
			function Event(name, handler)
			{
				this.name=name;
				this.handler=handler
			}
			return Event
		}();
	var AppStorage=function()
		{
			function AppStorage()
			{
				this.clientIDKey="Office API client";
				this.logIdSetKey="Office App Log Id Set"
			}
			AppStorage.prototype.getClientId=function()
			{
				var clientId=this.getValue(this.clientIDKey);
				if(!clientId || clientId.length <=0 || clientId.length > 40)
				{
					clientId=OSF.OUtil.Guid.generateNewGuid();
					this.setValue(this.clientIDKey,clientId)
				}
				return clientId
			};
			AppStorage.prototype.saveLog=function(logId, log)
			{
				var logIdSet=this.getValue(this.logIdSetKey);
				logIdSet=(logIdSet && logIdSet.length > 0 ? logIdSet+";" : "")+logId;
				this.setValue(this.logIdSetKey,logIdSet);
				this.setValue(logId,log)
			};
			AppStorage.prototype.enumerateLog=function(callback, clean)
			{
				var logIdSet=this.getValue(this.logIdSetKey);
				if(logIdSet)
				{
					var ids=logIdSet.split(";");
					for(var id in ids)
					{
						var logId=ids[id];
						var log=this.getValue(logId);
						if(log)
						{
							if(callback)
								callback(logId,log);
							if(clean)
								this.remove(logId)
						}
					}
					if(clean)
						this.remove(this.logIdSetKey)
				}
			};
			AppStorage.prototype.getValue=function(key)
			{
				var osfLocalStorage=OSF.OUtil.getLocalStorage();
				var value="";
				if(osfLocalStorage)
					value=osfLocalStorage.getItem(key);
				return value
			};
			AppStorage.prototype.setValue=function(key, value)
			{
				var osfLocalStorage=OSF.OUtil.getLocalStorage();
				if(osfLocalStorage)
					osfLocalStorage.setItem(key,value)
			};
			AppStorage.prototype.remove=function(key)
			{
				var osfLocalStorage=OSF.OUtil.getLocalStorage();
				if(osfLocalStorage)
					try
					{
						osfLocalStorage.removeItem(key)
					}
					catch(ex){}
			};
			return AppStorage
		}();
	var AppLogger=function()
		{
			function AppLogger(){}
			AppLogger.prototype.LogData=function(data)
			{
				if(!OSF.Logger)
					return;
				OSF.Logger.sendLog(OSF.Logger.TraceLevel.info,data.SerializeRow(),OSF.Logger.SendFlag.none)
			};
			AppLogger.prototype.LogRawData=function(log)
			{
				if(!OSF.Logger)
					return;
				OSF.Logger.sendLog(OSF.Logger.TraceLevel.info,log,OSF.Logger.SendFlag.none)
			};
			return AppLogger
		}();
	function initialize(context)
	{
		if(!OSF.Logger)
			return;
		if(appInfo)
			return;
		appInfo=new AppInfo;
		appInfo.hostVersion=context.get_appVersion();
		appInfo.appId=context.get_id();
		appInfo.host=context.get_appName();
		appInfo.browser=window.navigator.userAgent;
		appInfo.correlationId=context.get_correlationId();
		appInfo.clientId=(new AppStorage).getClientId();
		appInfo.appInstanceId=context.get_appInstanceId();
		if(appInfo.appInstanceId)
			appInfo.appInstanceId=appInfo.appInstanceId.replace(/[{}]/g,"").toLowerCase();
		appInfo.message=context.get_hostCustomMessage();
		var docUrl=context.get_docUrl();
		appInfo.docUrl=omexDomainRegex.test(docUrl) ? docUrl : "";
		var index=location.href.indexOf("?");
		appInfo.appURL=index==-1 ? location.href : location.href.substring(0,index);
		(function getUserIdAndAssetIdFromToken(token, appInfo)
		{
			var xmlContent;
			var parser;
			var xmlDoc;
			appInfo.assetId="";
			appInfo.userId="";
			try
			{
				xmlContent=decodeURIComponent(token);
				parser=new DOMParser;
				xmlDoc=parser.parseFromString(xmlContent,"text/xml");
				appInfo.userId=xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("cid").nodeValue;
				appInfo.assetId=xmlDoc.getElementsByTagName("t")[0].attributes.getNamedItem("aid").nodeValue
			}
			catch(e){}
			finally
			{
				xmlContent=null;
				xmlDoc=null;
				parser=null
			}
		})(context.get_eToken(),appInfo);
		(function handleLifecycle()
		{
			var startTime=new Date;
			var lastFocus=null;
			var focusTime=0;
			var finished=false;
			var adjustFocusTime=function()
				{
					if(document.hasFocus())
					{
						if(lastFocus==null)
							lastFocus=new Date
					}
					else if(lastFocus)
					{
						focusTime+=Math.abs((new Date).getTime() - lastFocus.getTime());
						lastFocus=null
					}
				};
			var eventList=[];
			eventList.push(new Event("focus",adjustFocusTime));
			eventList.push(new Event("blur",adjustFocusTime));
			eventList.push(new Event("focusout",adjustFocusTime));
			eventList.push(new Event("focusin",adjustFocusTime));
			var exitFunction=function()
				{
					for(var i=0; i < eventList.length; i++)
						OSF.OUtil.removeEventListener(window,eventList[i].name,eventList[i].handler);
					eventList.length=0;
					if(!finished)
					{
						if(document.hasFocus() && lastFocus)
						{
							focusTime+=Math.abs((new Date).getTime() - lastFocus.getTime());
							lastFocus=null
						}
						OSFAppTelemetry.onAppClosed(Math.abs((new Date).getTime() - startTime.getTime()),focusTime);
						finished=true
					}
				};
			eventList.push(new Event("beforeunload",exitFunction));
			eventList.push(new Event("unload",exitFunction));
			for(var i=0; i < eventList.length; i++)
				OSF.OUtil.addEventListener(window,eventList[i].name,eventList[i].handler);
			adjustFocusTime()
		})();
		OSFAppTelemetry.onAppActivated()
	}
	OSFAppTelemetry.initialize=initialize;
	function onAppActivated()
	{
		if(!appInfo)
			return;
		(new AppStorage).enumerateLog(function(id, log)
		{
			return(new AppLogger).LogRawData(log)
		},true);
		var data=new OSFLog.AppActivatedUsageData;
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
		data.Message=appInfo.message;
		data.DocUrl=appInfo.docUrl;
		(new AppLogger).LogData(data);
		setTimeout(function()
		{
			if(!OSF.Logger)
				return;
			OSF.Logger.allowUploadingData()
		},100)
	}
	OSFAppTelemetry.onAppActivated=onAppActivated;
	function onScriptDone(scriptId, msStartTime, msResponseTime, appCorrelationId)
	{
		var data=new OSFLog.ScriptLoadUsageData;
		data.CorrelationId=appCorrelationId;
		data.SessionId=sessionId;
		data.ScriptId=scriptId;
		data.StartTime=msStartTime;
		data.ResponseTime=msResponseTime;
		(new AppLogger).LogData(data)
	}
	OSFAppTelemetry.onScriptDone=onScriptDone;
	function onCallDone(apiType, id, parameters, msResponseTime, errorType)
	{
		if(!appInfo)
			return;
		var data=new OSFLog.APIUsageUsageData;
		data.CorrelationId=osfControlAppCorrelationId;
		data.SessionId=sessionId;
		data.APIType=apiType;
		data.APIID=id;
		data.Parameters=parameters;
		data.ResponseTime=msResponseTime;
		data.ErrorType=errorType;
		(new AppLogger).LogData(data)
	}
	OSFAppTelemetry.onCallDone=onCallDone;
	function onMethodDone(id, args, msResponseTime, errorType)
	{
		var parameters=null;
		if(args)
			if(typeof args=="number")
				parameters=String(args);
			else if(typeof args==="object")
				for(var index in args)
				{
					if(parameters !==null)
						parameters+=",";
					else
						parameters="";
					if(typeof args[index]=="number")
						parameters+=String(args[index])
				}
			else
				parameters="";
		OSF.AppTelemetry.onCallDone("method",id,parameters,msResponseTime,errorType)
	}
	OSFAppTelemetry.onMethodDone=onMethodDone;
	function onPropertyDone(propertyName, msResponseTime)
	{
		OSF.AppTelemetry.onCallDone("property",-1,propertyName,msResponseTime)
	}
	OSFAppTelemetry.onPropertyDone=onPropertyDone;
	function onEventDone(id, errorType)
	{
		OSF.AppTelemetry.onCallDone("event",id,null,0,errorType)
	}
	OSFAppTelemetry.onEventDone=onEventDone;
	function onRegisterDone(register, id, msResponseTime, errorType)
	{
		OSF.AppTelemetry.onCallDone(register ? "registerevent" : "unregisterevent",id,null,msResponseTime,errorType)
	}
	OSFAppTelemetry.onRegisterDone=onRegisterDone;
	function onAppClosed(openTime, focusTime)
	{
		if(!appInfo)
			return;
		var data=new OSFLog.AppClosedUsageData;
		data.CorrelationId=osfControlAppCorrelationId;
		data.SessionId=sessionId;
		data.FocusTime=focusTime;
		data.OpenTime=openTime;
		data.AppSizeFinalWidth=window.innerWidth;
		data.AppSizeFinalHeight=window.innerHeight;
		(new AppStorage).saveLog(sessionId,data.SerializeRow())
	}
	OSFAppTelemetry.onAppClosed=onAppClosed;
	function setOsfControlAppCorrelationId(correlationId)
	{
		osfControlAppCorrelationId=correlationId
	}
	OSFAppTelemetry.setOsfControlAppCorrelationId=setOsfControlAppCorrelationId;
	function doAppInitializationLogging(isException, message)
	{
		var data=new OSFLog.AppInitializationUsageData;
		data.CorrelationId=osfControlAppCorrelationId;
		data.SessionId=sessionId;
		data.SuccessCode=isException ? 1 : 0;
		data.Message=message;
		(new AppLogger).LogData(data)
	}
	OSFAppTelemetry.doAppInitializationLogging=doAppInitializationLogging;
	function logAppCommonMessage(message)
	{
		doAppInitializationLogging(false,message)
	}
	OSFAppTelemetry.logAppCommonMessage=logAppCommonMessage;
	function logAppException(errorMessage)
	{
		doAppInitializationLogging(true,errorMessage)
	}
	OSFAppTelemetry.logAppException=logAppException;
	OSF.AppTelemetry=OSFAppTelemetry
})(OSFAppTelemetry || (OSFAppTelemetry={}));
var OfficeExt;
(function(OfficeExt)
{
	var AppCommand;
	(function(AppCommand)
	{
		var AppCommandManager=function()
			{
				function AppCommandManager()
				{
					var _this=this;
					this._pseudoDocument=null;
					this._eventDispatch=null;
					this._processAppCommandInvocation=function(args)
					{
						var verifyResult=_this._verifyManifestCallback(args.callbackName);
						if(verifyResult.errorCode !=OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess)
						{
							_this._invokeAppCommandCompletedMethod(args.appCommandId,verifyResult.errorCode,"");
							return
						}
						var eventObj=_this._constructEventObjectForCallback(args);
						if(eventObj)
							window.setTimeout(function()
							{
								verifyResult.callback(eventObj)
							},0);
						else
							_this._invokeAppCommandCompletedMethod(args.appCommandId,OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError,"")
					}
				}
				AppCommandManager.initializeOsfDda=function()
				{
					OSF.DDA.AsyncMethodNames.addNames({AppCommandInvocationCompletedAsync: "appCommandInvocationCompletedAsync"});
					OSF.DDA.AsyncMethodCalls.define({
						method: OSF.DDA.AsyncMethodNames.AppCommandInvocationCompletedAsync,
						requiredArguments: [{
								name: Microsoft.Office.WebExtension.Parameters.Id,
								types: ["string"]
							},{
								name: Microsoft.Office.WebExtension.Parameters.Status,
								types: ["number"]
							},{
								name: Microsoft.Office.WebExtension.Parameters.Data,
								types: ["string"]
							}]
					});
					OSF.OUtil.augmentList(OSF.DDA.EventDescriptors,{AppCommandInvokedEvent: "AppCommandInvokedEvent"});
					OSF.OUtil.augmentList(Microsoft.Office.WebExtension.EventType,{AppCommandInvoked: "appCommandInvoked"});
					OSF.OUtil.setNamespace("AppCommand",OSF.DDA);
					OSF.DDA.AppCommand.AppCommandInvokedEventArgs=OfficeExt.AppCommand.AppCommandInvokedEventArgs
				};
				AppCommandManager.prototype.initializeAndChangeOnce=function(callback)
				{
					AppCommand.registerDdaFacade();
					this._pseudoDocument={};
					OSF.DDA.DispIdHost.addAsyncMethods(this._pseudoDocument,[OSF.DDA.AsyncMethodNames.AppCommandInvocationCompletedAsync,]);
					this._eventDispatch=new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.AppCommandInvoked,]);
					var onRegisterCompleted=function(result)
						{
							if(callback)
								if(result.status=="succeeded")
									callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess);
								else
									callback(OSF.DDA.ErrorCodeManager.errorCodes.ooeInternalError)
						};
					OSF.DDA.DispIdHost.addEventSupport(this._pseudoDocument,this._eventDispatch);
					this._pseudoDocument.addHandlerAsync(Microsoft.Office.WebExtension.EventType.AppCommandInvoked,this._processAppCommandInvocation,onRegisterCompleted)
				};
				AppCommandManager.prototype._verifyManifestCallback=function(callbackName)
				{
					var defaultResult={
							callback: null,
							errorCode: OSF.DDA.ErrorCodeManager.errorCodes.ooeInvalidCallback
						};
					callbackName=callbackName.trim();
					try
					{
						var callList=callbackName.split(".");
						var parentObject=window;
						for(var i=0; i < callList.length - 1; i++)
							if(parentObject[callList[i]] && (typeof parentObject[callList[i]]=="object" || typeof parentObject[callList[i]]=="function"))
								parentObject=parentObject[callList[i]];
							else
								return defaultResult;
						var callbackFunc=parentObject[callList[callList.length - 1]];
						if(typeof callbackFunc !="function")
							return defaultResult
					}
					catch(e)
					{
						return defaultResult
					}
					return{
							callback: callbackFunc,
							errorCode: OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess
						}
				};
				AppCommandManager.prototype._invokeAppCommandCompletedMethod=function(appCommandId, resultCode, data)
				{
					this._pseudoDocument.appCommandInvocationCompletedAsync(appCommandId,resultCode,data)
				};
				AppCommandManager.prototype._constructEventObjectForCallback=function(args)
				{
					var _this=this;
					var eventObj=new AppCommandCallbackEventArgs;
					try
					{
						var jsonData=JSON.parse(args.eventObjStr);
						this._translateEventObjectInternal(jsonData,eventObj);
						Object.defineProperty(eventObj,"completed",{
							value: function()
							{
								var jsonString=JSON.stringify(eventObj);
								_this._invokeAppCommandCompletedMethod(args.appCommandId,OSF.DDA.ErrorCodeManager.errorCodes.ooeSuccess,jsonString)
							},
							enumerable: true
						})
					}
					catch(e)
					{
						eventObj=null
					}
					return eventObj
				};
				AppCommandManager.prototype._translateEventObjectInternal=function(input, output)
				{
					for(var key in input)
					{
						if(!input.hasOwnProperty(key))
							continue;
						var inputChild=input[key];
						if(typeof inputChild=="object" && inputChild !=null)
						{
							OSF.OUtil.defineEnumerableProperty(output,key,{value: {}});
							this._translateEventObjectInternal(inputChild,output[key])
						}
						else
							Object.defineProperty(output,key,{
								value: inputChild,
								enumerable: true,
								writable: true
							})
					}
				};
				AppCommandManager.prototype._constructObjectByTemplate=function(template, input)
				{
					var output={};
					if(!template || !input)
						return output;
					for(var key in template)
						if(template.hasOwnProperty(key))
						{
							output[key]=null;
							if(input[key] !=null)
							{
								var templateChild=template[key];
								var inputChild=input[key];
								var inputChildType=typeof inputChild;
								if(typeof templateChild=="object" && templateChild !=null)
									output[key]=this._constructObjectByTemplate(templateChild,inputChild);
								else if(inputChildType=="number" || inputChildType=="string" || inputChildType=="boolean")
									output[key]=inputChild
							}
						}
					return output
				};
				AppCommandManager.instance=function()
				{
					if(AppCommandManager._instance==null)
						AppCommandManager._instance=new AppCommandManager;
					return AppCommandManager._instance
				};
				AppCommandManager._instance=null;
				return AppCommandManager
			}();
		AppCommand.AppCommandManager=AppCommandManager;
		var AppCommandInvokedEventArgs=function()
			{
				function AppCommandInvokedEventArgs(appCommandId, callbackName, eventObjStr)
				{
					this.type=Microsoft.Office.WebExtension.EventType.AppCommandInvoked;
					this.appCommandId=appCommandId;
					this.callbackName=callbackName;
					this.eventObjStr=eventObjStr
				}
				AppCommandInvokedEventArgs.create=function(eventProperties)
				{
					return new AppCommandInvokedEventArgs(eventProperties[AppCommand.AppCommandInvokedEventEnums.AppCommandId],eventProperties[AppCommand.AppCommandInvokedEventEnums.CallbackName],eventProperties[AppCommand.AppCommandInvokedEventEnums.EventObjStr])
				};
				return AppCommandInvokedEventArgs
			}();
		AppCommand.AppCommandInvokedEventArgs=AppCommandInvokedEventArgs;
		var AppCommandCallbackEventArgs=function()
			{
				function AppCommandCallbackEventArgs(){}
				return AppCommandCallbackEventArgs
			}();
		AppCommand.AppCommandCallbackEventArgs=AppCommandCallbackEventArgs;
		AppCommand.AppCommandInvokedEventEnums={
			AppCommandId: "appCommandId",
			CallbackName: "callbackName",
			EventObjStr: "eventObjStr"
		}
	})(AppCommand=OfficeExt.AppCommand || (OfficeExt.AppCommand={}))
})(OfficeExt || (OfficeExt={}));
OfficeExt.AppCommand.AppCommandManager.initializeOsfDda();
var OfficeExt;
(function(OfficeExt)
{
	var AppCommand;
	(function(AppCommand)
	{
		function registerDdaFacade()
		{
			if(OSF.DDA.SafeArray)
			{
				var parameterMap=OSF.DDA.SafeArray.Delegate.ParameterMap;
				parameterMap.define({
					type: OSF.DDA.MethodDispId.dispidAppCommandInvocationCompletedMethod,
					toHost: [{
							name: Microsoft.Office.WebExtension.Parameters.Id,
							value: 0
						},{
							name: Microsoft.Office.WebExtension.Parameters.Status,
							value: 1
						},{
							name: Microsoft.Office.WebExtension.Parameters.Data,
							value: 2
						}]
				});
				parameterMap.define({
					type: OSF.DDA.EventDispId.dispidAppCommandInvokedEvent,
					fromHost: [{
							name: OSF.DDA.EventDescriptors.AppCommandInvokedEvent,
							value: parameterMap.self
						}],
					isComplexType: true
				});
				parameterMap.define({
					type: OSF.DDA.EventDescriptors.AppCommandInvokedEvent,
					fromHost: [{
							name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.AppCommandId,
							value: 0
						},{
							name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.CallbackName,
							value: 1
						},{
							name: OfficeExt.AppCommand.AppCommandInvokedEventEnums.EventObjStr,
							value: 2
						},],
					isComplexType: true
				})
			}
		}
		AppCommand.registerDdaFacade=registerDdaFacade
	})(AppCommand=OfficeExt.AppCommand || (OfficeExt.AppCommand={}))
})(OfficeExt || (OfficeExt={}));
OSF.DDA.AsyncMethodNames.addNames({CloseContainerAsync: "closeContainer"});
var OfficeExt;
(function(OfficeExt)
{
	var Container=function()
		{
			function Container(parameters){}
			return Container
		}();
	OfficeExt.Container=Container
})(OfficeExt || (OfficeExt={}));
OSF.DDA.AsyncMethodCalls.define({
	method: OSF.DDA.AsyncMethodNames.CloseContainerAsync,
	requiredArguments: [],
	supportedOptions: [],
	privateStateCallbacks: []
});
OSF.DDA.SafeArray.Delegate.ParameterMap.define({
	type: OSF.DDA.MethodDispId.dispidCloseContainerMethod,
	fromHost: [],
	toHost: []
});
var OfficeJsClient_OutlookWin32;
(function(OfficeJsClient_OutlookWin32)
{
	function prepareApiSurface(appContext)
	{
		if(appContext.get_isDialog())
			appContext.ui=new OSF.DDA.UI.ChildUI;
		else
		{
			appContext.ui=new OSF.DDA.UI.ParentUI;
			OSF.DDA.DispIdHost.addAsyncMethods(appContext.ui,[OSF.DDA.AsyncMethodNames.CloseContainerAsync])
		}
	}
	OfficeJsClient_OutlookWin32.prepareApiSurface=prepareApiSurface;
	function prepareRightAfterWebExtensionInitialize()
	{
		var appCommandHandler=OfficeExt.AppCommand.AppCommandManager.instance();
		appCommandHandler.initializeAndChangeOnce()
	}
	OfficeJsClient_OutlookWin32.prepareRightAfterWebExtensionInitialize=prepareRightAfterWebExtensionInitialize
})(OfficeJsClient_OutlookWin32 || (OfficeJsClient_OutlookWin32={}));
OSF.InitializationHelper.prototype.prepareRightAfterWebExtensionInitialize=function OSF_InitializationHelper$prepareRightAfterWebExtensionInitialize()
{
	OfficeJsClient_OutlookWin32.prepareRightAfterWebExtensionInitialize()
};
OSF.InitializationHelper.prototype.prepareApiSurface=function OSF_InitializationHelper$prepareApiSurface(appContext)
{
	var license=new OSF.DDA.License(appContext.get_eToken());
	if(appContext.get_appName()==OSF.AppName.OutlookWebApp)
	{
		OSF.WebApp._UpdateLinksForHostAndXdmInfo();
		this.initWebDialog(appContext);
		OSF._OfficeAppFactory.setContext(new OSF.DDA.OutlookContext(appContext,this._settings,license,appContext.appOM));
		OSF._OfficeAppFactory.setHostFacade(new OSF.DDA.DispIdHost.Facade(OSF.DDA.WAC.getDelegateMethods,OSF.DDA.WAC.Delegate.ParameterMap))
	}
	else
	{
		OfficeJsClient_OutlookWin32.prepareApiSurface(appContext);
		OSF._OfficeAppFactory.setContext(new OSF.DDA.OutlookContext(appContext,this._settings,license,appContext.appOM,OSF.DDA.Theming ? OSF.DDA.Theming.getOfficeTheme : null,appContext.ui));
		OSF._OfficeAppFactory.setHostFacade(new OSF.DDA.DispIdHost.Facade(OSF.DDA.DispIdHost.getClientDelegateMethods,OSF.DDA.SafeArray.Delegate.ParameterMap))
	}
};
OSF.DDA.SettingsManager={
	SerializedSettings: "serializedSettings",
	DateJSONPrefix: "Date(",
	DataJSONSuffix: ")",
	serializeSettings: function OSF_DDA_SettingsManager$serializeSettings(settingsCollection)
	{
		var ret={};
		for(var key in settingsCollection)
		{
			var value=settingsCollection[key];
			try
			{
				if(JSON)
					value=JSON.stringify(value,function dateReplacer(k, v)
					{
						return OSF.OUtil.isDate(this[k]) ? OSF.DDA.SettingsManager.DateJSONPrefix+this[k].getTime()+OSF.DDA.SettingsManager.DataJSONSuffix : v
					});
				else
					value=Sys.Serialization.JavaScriptSerializer.serialize(value);
				ret[key]=value
			}
			catch(ex){}
		}
		return ret
	},
	deserializeSettings: function OSF_DDA_SettingsManager$deserializeSettings(serializedSettings)
	{
		var ret={};
		serializedSettings=serializedSettings || {};
		for(var key in serializedSettings)
		{
			var value=serializedSettings[key];
			try
			{
				if(JSON)
					value=JSON.parse(value,function dateReviver(k, v)
					{
						var d;
						if(typeof v==="string" && v && v.length > 6 && v.slice(0,5)===OSF.DDA.SettingsManager.DateJSONPrefix && v.slice(-1)===OSF.DDA.SettingsManager.DataJSONSuffix)
						{
							d=new Date(parseInt(v.slice(5,-1)));
							if(d)
								return d
						}
						return v
					});
				else
					value=Sys.Serialization.JavaScriptSerializer.deserialize(value,true);
				ret[key]=value
			}
			catch(ex){}
		}
		return ret
	}
};
OSF.InitializationHelper.prototype.loadAppSpecificScriptAndCreateOM=function OSF_InitializationHelper$loadAppSpecificScriptAndCreateOM(appContext, appReady, basePath)
{
	Type.registerNamespace("Microsoft.Office.WebExtension.MailboxEnums");
	Microsoft.Office.WebExtension.MailboxEnums.EntityType={
		MeetingSuggestion: "meetingSuggestion",
		TaskSuggestion: "taskSuggestion",
		Address: "address",
		EmailAddress: "emailAddress",
		Url: "url",
		PhoneNumber: "phoneNumber",
		Contact: "contact",
		FlightReservations: "flightReservations",
		ParcelDeliveries: "parcelDeliveries"
	};
	Microsoft.Office.WebExtension.MailboxEnums.ItemType={
		Message: "message",
		Appointment: "appointment"
	};
	Microsoft.Office.WebExtension.MailboxEnums.ResponseType={
		None: "none",
		Organizer: "organizer",
		Tentative: "tentative",
		Accepted: "accepted",
		Declined: "declined"
	};
	Microsoft.Office.WebExtension.MailboxEnums.RecipientType={
		Other: "other",
		DistributionList: "distributionList",
		User: "user",
		ExternalUser: "externalUser"
	};
	Microsoft.Office.WebExtension.MailboxEnums.AttachmentType={
		File: "file",
		Item: "item",
		Cloud: "cloud"
	};
	Microsoft.Office.WebExtension.MailboxEnums.BodyType={
		Text: "text",
		Html: "html"
	};
	Microsoft.Office.WebExtension.MailboxEnums.ItemNotificationMessageType={
		ProgressIndicator: "progressIndicator",
		InformationalMessage: "informationalMessage",
		ErrorMessage: "errorMessage"
	};
	Microsoft.Office.WebExtension.CoercionType={
		Text: "text",
		Html: "html"
	};
	Microsoft.Office.WebExtension.MailboxEnums.UserProfileType={
		Office365: "office365",
		OutlookCom: "outlookCom",
		Enterprise: "enterprise"
	};
	Microsoft.Office.WebExtension.MailboxEnums.RestVersion={
		v1_0: "v1.0",
		v2_0: "v2.0",
		Beta: "beta"
	};
	Microsoft.Office.WebExtension.MailboxEnums.ModuleType={Addins: "addins"};
	Type.registerNamespace("OSF.DDA");
	var OSF=window["OSF"] || {};
	OSF.DDA=OSF.DDA || {};
	window["OSF"]["DDA"]["OutlookAppOm"]=OSF.DDA.OutlookAppOm=function(officeAppContext, targetWindow, appReadyCallback)
	{
		this.$$d_navigateToModuleAsync=Function.createDelegate(this,this.navigateToModuleAsync);
		this.$$d_displayPersonaCardAsync=Function.createDelegate(this,this.displayPersonaCardAsync);
		this.$$d_displayNewMessageFormApi=Function.createDelegate(this,this.displayNewMessageFormApi);
		this.$$d__displayNewAppointmentFormApi$p$0=Function.createDelegate(this,this._displayNewAppointmentFormApi$p$0);
		this.$$d_windowOpenOverrideHandler=Function.createDelegate(this,this.windowOpenOverrideHandler);
		this.$$d__getRestUrl$p$0=Function.createDelegate(this,this._getRestUrl$p$0);
		this.$$d__getEwsUrl$p$0=Function.createDelegate(this,this._getEwsUrl$p$0);
		this.$$d__getDiagnostics$p$0=Function.createDelegate(this,this._getDiagnostics$p$0);
		this.$$d__getUserProfile$p$0=Function.createDelegate(this,this._getUserProfile$p$0);
		this.$$d__getItem$p$0=Function.createDelegate(this,this._getItem$p$0);
		this.$$d__callAppReadyCallback$p$0=Function.createDelegate(this,this._callAppReadyCallback$p$0);
		this.$$d__getInitialDataResponseHandler$p$0=Function.createDelegate(this,this._getInitialDataResponseHandler$p$0);
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p=this;
		this._officeAppContext$p$0=officeAppContext;
		this._appReadyCallback$p$0=appReadyCallback;
		var $$t_4=this;
		var stringLoadedCallback=function()
			{
				if(appReadyCallback)
					if(!officeAppContext["get_isDialog"]())
						$$t_4.invokeHostMethod(1,null,$$t_4.$$d__getInitialDataResponseHandler$p$0);
					else
						window.setTimeout($$t_4.$$d__callAppReadyCallback$p$0,0)
			};
		if(this._areStringsLoaded$p$0())
			stringLoadedCallback();
		else
			this._loadLocalizedScript$p$0(stringLoadedCallback)
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._throwOnPropertyAccessForRestrictedPermission$i=function(currentPermissionLevel)
	{
		if(!currentPermissionLevel)
			throw Error.create(window["_u"]["ExtensibilityStrings"]["l_ElevatedPermissionNeeded_Text"]);
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i=function(value, minValue, maxValue, argumentName)
	{
		if(value < minValue || value > maxValue)
			throw Error.argumentOutOfRange(argumentName);
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidModule$p=function(module)
	{
		if($h.ScriptHelpers.isNullOrUndefined(module))
			throw Error.argumentNull("module");
		else if(module==="")
			throw Error.argument("module","module cannot be empty.");
		if(module !==window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ModuleType"]["Addins"])
			throw Error.notImplemented(String.format("API not supported for module '{0}'",module));
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._getHtmlBody$p=function(data)
	{
		var htmlBody="";
		if("htmlBody" in data)
		{
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidHtmlBody$p(data["htmlBody"]);
			htmlBody=data["htmlBody"]
		}
		return htmlBody
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._getAttachments$p=function(data)
	{
		var attachments=[];
		if("attachments" in data)
		{
			attachments=data["attachments"];
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidAttachmentsArray$p(attachments)
		}
		return attachments
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._getOptionsAndCallback$p=function(data)
	{
		var args=[];
		if("options" in data)
			args[0]=data["options"];
		if("callback" in data)
			args[args["length"]]=data["callback"];
		return args
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._createAttachmentsDataForHost$p=function(attachments)
	{
		var attachmentsData=new Array(0);
		if(Array["isInstanceOfType"](attachments))
			for(var i=0; i < attachments["length"]; i++)
				if(Object["isInstanceOfType"](attachments[i]))
				{
					var attachment=attachments[i];
					window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidAttachment$p(attachment);
					attachmentsData[i]=window["OSF"]["DDA"]["OutlookAppOm"]._createAttachmentData$p(attachment)
				}
				else
					throw Error.argument("attachments");
		return attachmentsData
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidHtmlBody$p=function(htmlBody)
	{
		if(!String["isInstanceOfType"](htmlBody))
			throw Error.argument("htmlBody");
		if($h.ScriptHelpers.isNullOrUndefined(htmlBody))
			throw Error.argument("htmlBody");
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(htmlBody.length,0,window["OSF"]["DDA"]["OutlookAppOm"].maxBodyLength,"htmlBody")
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidAttachmentsArray$p=function(attachments)
	{
		if(!Array["isInstanceOfType"](attachments))
			throw Error.argument("attachments");
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidAttachment$p=function(attachment)
	{
		if(!Object["isInstanceOfType"](attachment))
			throw Error.argument("attachments");
		if(!("type" in attachment) || !("name" in attachment))
			throw Error.argument("attachments");
		if(!("url" in attachment || "itemId" in attachment))
			throw Error.argument("attachments");
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._createAttachmentData$p=function(attachment)
	{
		var attachmentData=null;
		if(attachment["type"]==="file")
		{
			var url=attachment["url"];
			var name=attachment["name"];
			var isInline=$h.ScriptHelpers.isValueTrue(attachment["isInline"]);
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidAttachmentUrlOrName$p(url,name);
			attachmentData=window["OSF"]["DDA"]["OutlookAppOm"]._createFileAttachmentData$p(url,name,isInline)
		}
		else if(attachment["type"]==="item")
		{
			var itemId=window["OSF"]["DDA"]["OutlookAppOm"].getItemIdBasedOnHost(attachment["itemId"]);
			var name=attachment["name"];
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidAttachmentItemIdOrName$p(itemId,name);
			attachmentData=window["OSF"]["DDA"]["OutlookAppOm"]._createItemAttachmentData$p(itemId,name)
		}
		else
			throw Error.argument("attachments");
		return attachmentData
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._createFileAttachmentData$p=function(url, name, isInline)
	{
		return["file",name,url,isInline]
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._createItemAttachmentData$p=function(itemId, name)
	{
		return["item",name,itemId]
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidAttachmentUrlOrName$p=function(url, name)
	{
		if(!String["isInstanceOfType"](url) || !String["isInstanceOfType"](name))
			throw Error.argument("attachments");
		if(url.length > 2048)
			throw Error.argumentOutOfRange("attachments",url.length,window["_u"]["ExtensibilityStrings"]["l_AttachmentUrlTooLong_Text"]);
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidAttachmentName$p(name)
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidAttachmentItemIdOrName$p=function(itemId, name)
	{
		if(!String["isInstanceOfType"](itemId) || !String["isInstanceOfType"](name))
			throw Error.argument("attachments");
		if(itemId.length > 200)
			throw Error.argumentOutOfRange("attachments",itemId.length,window["_u"]["ExtensibilityStrings"]["l_AttachmentItemIdTooLong_Text"]);
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidAttachmentName$p(name)
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidAttachmentName$p=function(name)
	{
		if(name.length > 255)
			throw Error.argumentOutOfRange("attachments",name.length,window["_u"]["ExtensibilityStrings"]["l_AttachmentNameTooLong_Text"]);
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidRestVersion$p=function(restVersion)
	{
		if(!restVersion)
			throw Error.argumentNull("restVersion");
		if(restVersion !==window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["RestVersion"]["v1_0"] && restVersion !==window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["RestVersion"]["v2_0"] && restVersion !==window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["RestVersion"]["Beta"])
			throw Error.argument("restVersion");
	};
	window["OSF"]["DDA"]["OutlookAppOm"].getItemIdBasedOnHost=function(itemId)
	{
		if(window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._initialData$p$0 && window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._initialData$p$0.get__isRestIdSupported$i$0())
			return window["OSF"]["DDA"]["OutlookAppOm"]._instance$p["convertToRestId"](itemId,window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["RestVersion"]["v1_0"]);
		return window["OSF"]["DDA"]["OutlookAppOm"]._instance$p["convertToEwsId"](itemId,window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["RestVersion"]["v1_0"])
	};
	window["OSF"]["DDA"]["OutlookAppOm"]["addAdditionalArgs"]=function(dispid, data)
	{
		return data
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._throwOnArgumentType$p=function(value, expectedType, argumentName)
	{
		if(Object["getType"](value) !==expectedType)
			throw Error.argumentType(argumentName);
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._validateOptionalStringParameter$p=function(value, minLength, maxLength, name)
	{
		if($h.ScriptHelpers.isNullOrUndefined(value))
			return;
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnArgumentType$p(value,String,name);
		var stringValue=value;
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(stringValue.length,minLength,maxLength,name)
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._convertRecipientArrayParameterForOutlookForDisplayApi$p=function(array)
	{
		return array ? array["join"](";") : null
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._convertComposeEmailDictionaryParameterForSetApi$p=function(recipients)
	{
		if(!recipients)
			return null;
		var results=new Array(recipients["length"]);
		for(var i=0; i < recipients["length"]; i++)
			results[i]=[recipients[i]["address"],recipients[i]["name"]];
		return results
	};
	window["OSF"]["DDA"]["OutlookAppOm"]._validateAndNormalizeRecipientEmails$p=function(emailset, name)
	{
		if($h.ScriptHelpers.isNullOrUndefined(emailset))
			return null;
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnArgumentType$p(emailset,Array,name);
		var originalAttendees=emailset;
		var updatedAttendees=null;
		var normalizationNeeded=false;
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(originalAttendees["length"],0,window["OSF"]["DDA"]["OutlookAppOm"]._maxRecipients$p,String.format("{0}.length",name));
		for(var i=0; i < originalAttendees["length"]; i++)
			if($h.EmailAddressDetails["isInstanceOfType"](originalAttendees[i]))
			{
				normalizationNeeded=true;
				break
			}
		if(normalizationNeeded)
			updatedAttendees=[];
		for(var i=0; i < originalAttendees["length"]; i++)
			if(normalizationNeeded)
			{
				updatedAttendees[i]=$h.EmailAddressDetails["isInstanceOfType"](originalAttendees[i]) ? originalAttendees[i]["emailAddress"] : originalAttendees[i];
				window["OSF"]["DDA"]["OutlookAppOm"]._throwOnArgumentType$p(updatedAttendees[i],String,String.format("{0}[{1}]",name,i))
			}
			else
				window["OSF"]["DDA"]["OutlookAppOm"]._throwOnArgumentType$p(originalAttendees[i],String,String.format("{0}[{1}]",name,i));
		return updatedAttendees
	};
	OSF.DDA.OutlookAppOm.prototype={
		_initialData$p$0: null,
		_item$p$0: null,
		_userProfile$p$0: null,
		_diagnostics$p$0: null,
		_officeAppContext$p$0: null,
		_appReadyCallback$p$0: null,
		_clientEndPoint$p$0: null,
		_hostItemType$p$0: 0,
		_additionalOutlookParams$p$0: null,
		get_clientEndPoint: function()
		{
			if(!this._clientEndPoint$p$0)
				this._clientEndPoint$p$0=OSF._OfficeAppFactory["getClientEndPoint"]();
			return this._clientEndPoint$p$0
		},
		set_clientEndPoint: function(value)
		{
			this._clientEndPoint$p$0=value;
			return value
		},
		get_initialData: function()
		{
			return this._initialData$p$0
		},
		get__appName$i$0: function()
		{
			return this._officeAppContext$p$0["get_appName"]()
		},
		get_additionalOutlookParams: function()
		{
			return this._additionalOutlookParams$p$0
		},
		windowOpenOverrideHandler: function(url, targetName, features, replace)
		{
			this.invokeHostMethod(403,{launchUrl: url},null)
		},
		createAsyncResult: function(value, errorCode, detailedErrorCode, userContext, errorMessage)
		{
			var initArgs={};
			var errorArgs=null;
			initArgs[OSF.DDA.AsyncResultEnum.Properties["Value"]]=value;
			initArgs[OSF.DDA.AsyncResultEnum.Properties["Context"]]=userContext;
			if(0 !==errorCode)
			{
				errorArgs={};
				var errorProperties=$h.OutlookErrorManager.getErrorArgs(detailedErrorCode);
				errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties["Name"]]=errorProperties["name"];
				errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties["Message"]]=!errorMessage ? errorProperties["message"] : errorMessage;
				errorArgs[OSF.DDA.AsyncResultEnum.ErrorProperties["Code"]]=detailedErrorCode
			}
			return new OSF.DDA.AsyncResult(initArgs,errorArgs)
		},
		_throwOnMethodCallForInsufficientPermission$i$0: function(requiredPermissionLevel, methodName)
		{
			if(this._initialData$p$0._permissionLevel$p$0 < requiredPermissionLevel)
				throw Error.create(String.format(window["_u"]["ExtensibilityStrings"]["l_ElevatedPermissionNeededForMethod_Text"],methodName));
		},
		_displayReplyForm$i$0: function(obj)
		{
			this._displayReplyFormHelper$p$0(obj,false)
		},
		_displayReplyAllForm$i$0: function(obj)
		{
			this._displayReplyFormHelper$p$0(obj,true)
		},
		_displayReplyFormHelper$p$0: function(obj, isReplyAll)
		{
			if(String["isInstanceOfType"](obj))
				this._doDisplayReplyForm$p$0(obj,isReplyAll);
			else if(Object["isInstanceOfType"](obj) && Object.getTypeName(obj)==="Object")
				this._doDisplayReplyFormWithAttachments$p$0(obj,isReplyAll);
			else
				throw Error.argumentType();
		},
		_doDisplayReplyForm$p$0: function(htmlBody, isReplyAll)
		{
			if(!$h.ScriptHelpers.isNullOrUndefined(htmlBody))
				window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(htmlBody.length,0,window["OSF"]["DDA"]["OutlookAppOm"].maxBodyLength,"htmlBody");
			this.invokeHostMethod(isReplyAll ? 11 : 10,{htmlBody: htmlBody},null)
		},
		_doDisplayReplyFormWithAttachments$p$0: function(data, isReplyAll)
		{
			var htmlBody=window["OSF"]["DDA"]["OutlookAppOm"]._getHtmlBody$p(data);
			var attachments=window["OSF"]["DDA"]["OutlookAppOm"]._getAttachments$p(data);
			var parameters=$h.CommonParameters.parse(window["OSF"]["DDA"]["OutlookAppOm"]._getOptionsAndCallback$p(data),false);
			var $$t_6=this;
			this._standardInvokeHostMethod$i$0(isReplyAll ? 31 : 30,{
				htmlBody: htmlBody,
				attachments: window["OSF"]["DDA"]["OutlookAppOm"]._createAttachmentsDataForHost$p(attachments)
			},function(rawInput)
			{
				return rawInput
			},parameters._asyncContext$p$0,parameters._callback$p$0)
		},
		_standardInvokeHostMethod$i$0: function(dispid, data, format, userContext, callback)
		{
			var $$t_B=this;
			this.invokeHostMethod(dispid,data,function(resultCode, response)
			{
				if(callback)
				{
					var asyncResult=null;
					if(Object["isInstanceOfType"](response))
					{
						var responseDictionary=response;
						if("error" in responseDictionary || "data" in responseDictionary || "errorCode" in responseDictionary)
							if(!responseDictionary["error"])
							{
								var formattedData=format ? format(responseDictionary["data"]) : responseDictionary["data"];
								asyncResult=$$t_B.createAsyncResult(formattedData,0,0,userContext,null)
							}
							else
							{
								var errorCode=responseDictionary["errorCode"];
								asyncResult=$$t_B.createAsyncResult(null,1,errorCode,userContext,null)
							}
					}
					if(!asyncResult && resultCode)
						asyncResult=$$t_B.createAsyncResult(null,1,9002,userContext,null);
					callback(asyncResult)
				}
			})
		},
		invokeHostMethod: function(dispid, data, responseCallback)
		{
			if(64===this._officeAppContext$p$0["get_appName"]())
			{
				var args={ApiParams: data};
				args["MethodData"]={
					ControlId: OSF._OfficeAppFactory["getId"](),
					DispatchId: dispid
				};
				args=window["OSF"]["DDA"]["OutlookAppOm"]["addAdditionalArgs"](dispid,args);
				if(dispid===1)
					this.get_clientEndPoint()["invoke"]("GetInitialData",responseCallback,args);
				else
					this.get_clientEndPoint()["invoke"]("ExecuteMethod",responseCallback,args)
			}
			else if(!this._isOwaOnlyMethod$p$0(dispid))
			{
				var executeParameters=this.convertToOutlookParameters(dispid,data);
				var $$t_B=this;
				OSF.ClientHostController["execute"](dispid,executeParameters,function(nativeData, resultCode)
				{
					if(responseCallback)
					{
						var responseData=nativeData.toArray();
						var rawData=window["JSON"]["parse"](responseData[0]);
						if(Object["isInstanceOfType"](rawData))
						{
							var deserializedData=rawData;
							if(responseData["length"] > 1 && responseData[1])
							{
								deserializedData["error"]=true;
								deserializedData["errorCode"]=responseData[1]
							}
							else
								deserializedData["error"]=false;
							responseCallback(resultCode,deserializedData)
						}
						else if(Number["isInstanceOfType"](rawData))
						{
							var returnDict={};
							returnDict["error"]=true;
							returnDict["errorCode"]=rawData;
							responseCallback(resultCode,returnDict)
						}
						else
							throw Error.notImplemented("Return data type from host must be Dictionary or int");
					}
				})
			}
			else if(responseCallback)
				responseCallback(-2,null)
		},
		_dictionaryToDate$i$0: function(input)
		{
			var retValue=new Date(input["year"],input["month"],input["date"],input["hours"],input["minutes"],input["seconds"],!input["milliseconds"] ? 0 : input["milliseconds"]);
			if(window["isNaN"](retValue["getTime"]()))
				throw Error.format(window["_u"]["ExtensibilityStrings"]["l_InvalidDate_Text"]);
			return retValue
		},
		_dateToDictionary$i$0: function(input)
		{
			var retValue={};
			retValue["month"]=input["getMonth"]();
			retValue["date"]=input["getDate"]();
			retValue["year"]=input["getFullYear"]();
			retValue["hours"]=input["getHours"]();
			retValue["minutes"]=input["getMinutes"]();
			retValue["seconds"]=input["getSeconds"]();
			retValue["milliseconds"]=input["getMilliseconds"]();
			return retValue
		},
		_isOwaOnlyMethod$p$0: function(dispId)
		{
			switch(dispId)
			{
				case 402:
				case 401:
				case 400:
				case 403:
					return true;
				default:
					return false
			}
		},
		isOutlook16OrGreater: function()
		{
			var hostVersion=this._initialData$p$0.get__hostVersion$i$0();
			var endIndex=0;
			var majorVersionNumber=0;
			if(hostVersion)
			{
				endIndex=hostVersion.indexOf(".");
				majorVersionNumber=window["parseInt"](hostVersion.substring(0,endIndex))
			}
			return majorVersionNumber >=16
		},
		convertToOutlookParameters: function(dispid, data)
		{
			var executeParameters=null;
			var optionalParameters={};
			switch(dispid)
			{
				case 1:
				case 2:
				case 3:
				case 14:
				case 18:
				case 26:
				case 32:
				case 41:
				case 34:
					break;
				case 12:
					optionalParameters["isRest"]=data["isRest"];
					break;
				case 4:
					var jsonProperty=window["JSON"]["stringify"](data["customProperties"]);
					executeParameters=[jsonProperty];
					break;
				case 5:
					executeParameters=[data["body"]];
					break;
				case 8:
				case 9:
					executeParameters=[data["itemId"]];
					break;
				case 7:
					executeParameters=[window["OSF"]["DDA"]["OutlookAppOm"]._convertRecipientArrayParameterForOutlookForDisplayApi$p(data["requiredAttendees"]),window["OSF"]["DDA"]["OutlookAppOm"]._convertRecipientArrayParameterForOutlookForDisplayApi$p(data["optionalAttendees"]),data["start"],data["end"],data["location"],window["OSF"]["DDA"]["OutlookAppOm"]._convertRecipientArrayParameterForOutlookForDisplayApi$p(data["resources"]),data["subject"],data["body"]];
					break;
				case 44:
					executeParameters=[window["OSF"]["DDA"]["OutlookAppOm"]._convertRecipientArrayParameterForOutlookForDisplayApi$p(data["toRecipients"]),window["OSF"]["DDA"]["OutlookAppOm"]._convertRecipientArrayParameterForOutlookForDisplayApi$p(data["ccRecipients"]),window["OSF"]["DDA"]["OutlookAppOm"]._convertRecipientArrayParameterForOutlookForDisplayApi$p(data["bccRecipients"]),data["subject"],data["htmlBody"],data["attachments"]];
					break;
				case 43:
					executeParameters=[data["ewsIdOrEmail"]];
					break;
				case 45:
					executeParameters=[data["module"],data["queryString"]];
					break;
				case 40:
					executeParameters=[data["extensionId"],data["consentState"]];
					break;
				case 11:
				case 10:
					executeParameters=[data["htmlBody"]];
					break;
				case 31:
				case 30:
					executeParameters=[data["htmlBody"],data["attachments"]];
					break;
				case 23:
				case 13:
				case 38:
				case 29:
					executeParameters=[data["data"],data["coercionType"]];
					break;
				case 37:
				case 28:
					executeParameters=[data["coercionType"]];
					break;
				case 17:
					executeParameters=[data["subject"]];
					break;
				case 15:
					executeParameters=[data["recipientField"]];
					break;
				case 22:
				case 21:
					executeParameters=[data["recipientField"],window["OSF"]["DDA"]["OutlookAppOm"]._convertComposeEmailDictionaryParameterForSetApi$p(data["recipientArray"])];
					break;
				case 19:
					executeParameters=[data["itemId"],data["name"]];
					break;
				case 16:
					executeParameters=[data["uri"],data["name"],data["isInline"]];
					break;
				case 20:
					executeParameters=[data["attachmentIndex"]];
					break;
				case 25:
					executeParameters=[data["TimeProperty"],data["time"]];
					break;
				case 24:
					executeParameters=[data["TimeProperty"]];
					break;
				case 27:
					executeParameters=[data["location"]];
					break;
				case 33:
				case 35:
					executeParameters=[data["key"],data["type"],data["persistent"],data["message"],data["icon"]];
					break;
				case 36:
					executeParameters=[data["key"]];
					break;
				default:
					Sys.Debug.fail("Unexpected method dispid");
					break
			}
			if(dispid !==1)
			{
				var $$t_5;
				this._additionalOutlookParams$p$0.updateOutlookExecuteParameters($$t_5={val: executeParameters},optionalParameters),executeParameters=$$t_5["val"]
			}
			return executeParameters
		},
		_displayNewAppointmentFormApi$p$0: function(parameters)
		{
			var normalizedRequiredAttendees=window["OSF"]["DDA"]["OutlookAppOm"]._validateAndNormalizeRecipientEmails$p(parameters["requiredAttendees"],"requiredAttendees");
			var normalizedOptionalAttendees=window["OSF"]["DDA"]["OutlookAppOm"]._validateAndNormalizeRecipientEmails$p(parameters["optionalAttendees"],"optionalAttendees");
			window["OSF"]["DDA"]["OutlookAppOm"]._validateOptionalStringParameter$p(parameters["location"],0,window["OSF"]["DDA"]["OutlookAppOm"]._maxLocationLength$p,"location");
			window["OSF"]["DDA"]["OutlookAppOm"]._validateOptionalStringParameter$p(parameters["body"],0,window["OSF"]["DDA"]["OutlookAppOm"].maxBodyLength,"body");
			window["OSF"]["DDA"]["OutlookAppOm"]._validateOptionalStringParameter$p(parameters["subject"],0,window["OSF"]["DDA"]["OutlookAppOm"]._maxSubjectLength$p,"subject");
			if(!$h.ScriptHelpers.isNullOrUndefined(parameters["start"]))
			{
				window["OSF"]["DDA"]["OutlookAppOm"]._throwOnArgumentType$p(parameters["start"],Date,"start");
				var startDateTime=parameters["start"];
				parameters["start"]=startDateTime["getTime"]();
				if(!$h.ScriptHelpers.isNullOrUndefined(parameters["end"]))
				{
					window["OSF"]["DDA"]["OutlookAppOm"]._throwOnArgumentType$p(parameters["end"],Date,"end");
					var endDateTime=parameters["end"];
					if(endDateTime < startDateTime)
						throw Error.argumentOutOfRange("end",endDateTime,window["_u"]["ExtensibilityStrings"]["l_InvalidEventDates_Text"]);
					parameters["end"]=endDateTime["getTime"]()
				}
			}
			var updatedParameters=null;
			if(normalizedRequiredAttendees || normalizedOptionalAttendees)
			{
				updatedParameters={};
				var $$dict_7=parameters;
				for(var $$key_8 in $$dict_7)
				{
					var entry={
							key: $$key_8,
							value: $$dict_7[$$key_8]
						};
					updatedParameters[entry["key"]]=entry["value"]
				}
				if(normalizedRequiredAttendees)
					updatedParameters["requiredAttendees"]=normalizedRequiredAttendees;
				if(normalizedOptionalAttendees)
					updatedParameters["optionalAttendees"]=normalizedOptionalAttendees
			}
			this.invokeHostMethod(7,updatedParameters || parameters,null)
		},
		displayNewMessageFormApi: function(parameters)
		{
			var updatedParameters={};
			if(parameters)
			{
				var normalizedToRecipients=window["OSF"]["DDA"]["OutlookAppOm"]._validateAndNormalizeRecipientEmails$p(parameters["toRecipients"],"toRecipients");
				var normalizedCcRecipients=window["OSF"]["DDA"]["OutlookAppOm"]._validateAndNormalizeRecipientEmails$p(parameters["ccRecipients"],"ccRecipients");
				var normalizedBccRecipients=window["OSF"]["DDA"]["OutlookAppOm"]._validateAndNormalizeRecipientEmails$p(parameters["bccRecipients"],"bccRecipients");
				window["OSF"]["DDA"]["OutlookAppOm"]._validateOptionalStringParameter$p(parameters["htmlBody"],0,window["OSF"]["DDA"]["OutlookAppOm"].maxBodyLength,"htmlBody");
				window["OSF"]["DDA"]["OutlookAppOm"]._validateOptionalStringParameter$p(parameters["subject"],0,window["OSF"]["DDA"]["OutlookAppOm"]._maxSubjectLength$p,"subject");
				var attachments=window["OSF"]["DDA"]["OutlookAppOm"]._getAttachments$p(parameters);
				var $$dict_7=parameters;
				for(var $$key_8 in $$dict_7)
				{
					var entry={
							key: $$key_8,
							value: $$dict_7[$$key_8]
						};
					updatedParameters[entry["key"]]=entry["value"]
				}
				if(normalizedToRecipients)
					updatedParameters["toRecipients"]=normalizedToRecipients;
				if(normalizedCcRecipients)
					updatedParameters["ccRecipients"]=normalizedCcRecipients;
				if(normalizedBccRecipients)
					updatedParameters["bccRecipients"]=normalizedBccRecipients;
				if(attachments)
					updatedParameters["attachments"]=window["OSF"]["DDA"]["OutlookAppOm"]._createAttachmentsDataForHost$p(attachments)
			}
			this.invokeHostMethod(44,updatedParameters || parameters,null)
		},
		displayPersonaCardAsync: function(ewsIdOrEmail)
		{
			var args=[];
			for(var $$pai_3=1; $$pai_3 < arguments["length"];++$$pai_3)
				args[$$pai_3 - 1]=arguments[$$pai_3];
			if($h.ScriptHelpers.isNullOrUndefined(ewsIdOrEmail))
				throw Error.argumentNull("ewsIdOrEmail");
			else if(ewsIdOrEmail==="")
				throw Error.argument("ewsIdOrEmail","ewsIdOrEmail cannot be empty.");
			var parameters=$h.CommonParameters.parse(args,false);
			this._standardInvokeHostMethod$i$0(43,{ewsIdOrEmail: ewsIdOrEmail.trim()},null,parameters._asyncContext$p$0,parameters._callback$p$0)
		},
		navigateToModuleAsync: function(module)
		{
			var args=[];
			for(var $$pai_5=1; $$pai_5 < arguments["length"];++$$pai_5)
				args[$$pai_5 - 1]=arguments[$$pai_5];
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidModule$p(module);
			var parameters=$h.CommonParameters.parse(args,false);
			var updatedParameters={};
			if(module===window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ModuleType"]["Addins"])
			{
				var queryString="";
				if(parameters._options$p$0 && parameters._options$p$0["queryString"])
					queryString=parameters._options$p$0["queryString"];
				updatedParameters["queryString"]=queryString
			}
			updatedParameters["module"]=module;
			this._standardInvokeHostMethod$i$0(45,updatedParameters,null,parameters._asyncContext$p$0,parameters._callback$p$0)
		},
		_initializeMethods$p$0: function()
		{
			var currentInstance=this;
			if($h.Item["isInstanceOfType"](this._item$p$0) || this._hostItemType$p$0===6)
			{
				currentInstance["displayNewAppointmentForm"]=this.$$d__displayNewAppointmentFormApi$p$0;
				currentInstance["displayNewMessageForm"]=this.$$d_displayNewMessageFormApi;
				currentInstance["displayPersonaCardAsync"]=this.$$d_displayPersonaCardAsync;
				currentInstance["navigateToModuleAsync"]=this.$$d_navigateToModuleAsync
			}
		},
		_getInitialDataResponseHandler$p$0: function(resultCode, data)
		{
			if(resultCode)
				return;
			this["initialize"](data);
			this["displayName"]="mailbox";
			window.setTimeout(this.$$d__callAppReadyCallback$p$0,0)
		},
		_callAppReadyCallback$p$0: function()
		{
			this._appReadyCallback$p$0()
		},
		_invokeGetTokenMethodAsync$p$0: function(outlookDispid, data, methodName, callback, userContext)
		{
			if($h.ScriptHelpers.isNullOrUndefined(callback))
				throw Error.argumentNull("callback");
			var $$t_9=this;
			this.invokeHostMethod(outlookDispid,data,function(resultCode, response)
			{
				var asyncResult;
				if(resultCode)
					asyncResult=$$t_9.createAsyncResult(null,1,9017,userContext,String.format(window["_u"]["ExtensibilityStrings"]["l_InternalProtocolError_Text"],resultCode));
				else
				{
					var responseDictionary=response;
					if(responseDictionary["wasSuccessful"])
						asyncResult=$$t_9.createAsyncResult(responseDictionary["token"],0,0,userContext,null);
					else
						asyncResult=$$t_9.createAsyncResult(null,1,responseDictionary["errorCode"],userContext,responseDictionary["errorMessage"])
				}
				callback(asyncResult)
			})
		},
		_getItem$p$0: function()
		{
			return this._item$p$0
		},
		_getUserProfile$p$0: function()
		{
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnPropertyAccessForRestrictedPermission$i(this._initialData$p$0._permissionLevel$p$0);
			return this._userProfile$p$0
		},
		_getDiagnostics$p$0: function()
		{
			return this._diagnostics$p$0
		},
		_getEwsUrl$p$0: function()
		{
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnPropertyAccessForRestrictedPermission$i(this._initialData$p$0._permissionLevel$p$0);
			return this._initialData$p$0.get__ewsUrl$i$0()
		},
		_getRestUrl$p$0: function()
		{
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnPropertyAccessForRestrictedPermission$i(this._initialData$p$0._permissionLevel$p$0);
			if(!this._initialData$p$0.get__restUrl$i$0())
				return null;
			return this._initialData$p$0.get__restUrl$i$0()
		},
		_findOffset$p$0: function(value)
		{
			var ranges=this._initialData$p$0.get__timeZoneOffsets$i$0();
			for(var r=0; r < ranges["length"]; r++)
			{
				var range=ranges[r];
				var start=window["parseInt"](range["start"]);
				var end=window["parseInt"](range["end"]);
				if(value["getTime"]() - start >=0 && value["getTime"]() - end < 0)
					return window["parseInt"](range["offset"])
			}
			throw Error.format(window["_u"]["ExtensibilityStrings"]["l_InvalidDate_Text"]);
		},
		_areStringsLoaded$p$0: function()
		{
			var stringsLoaded=false;
			try
			{
				stringsLoaded=!$h.ScriptHelpers.isNullOrUndefined(window["_u"]["ExtensibilityStrings"]["l_EwsRequestOversized_Text"])
			}
			catch($$e_1){}
			return stringsLoaded
		},
		_loadLocalizedScript$p$0: function(stringLoadedCallback)
		{
			var url=null;
			var baseUrl="";
			var scripts=document.getElementsByTagName("script");
			for(var i=scripts.length - 1; i >=0; i--)
			{
				var filename=null;
				var attributes=scripts[i].attributes;
				if(attributes)
				{
					var attribute=attributes.getNamedItem("src");
					if(attribute)
						filename=attribute.value;
					if(filename)
					{
						var debug=false;
						filename=filename.toLowerCase();
						var officeIndex=filename.indexOf("office_strings.js");
						if(officeIndex < 0)
						{
							officeIndex=filename.indexOf("office_strings.debug.js");
							debug=true
						}
						if(officeIndex > 0 && officeIndex < filename.length)
						{
							url=filename.replace(debug ? "office_strings.debug.js" : "office_strings.js","outlook_strings.js");
							var languageUrl=filename.substring(0,officeIndex);
							var lastIndexOfSlash=languageUrl.lastIndexOf("/",languageUrl.length - 2);
							if(lastIndexOfSlash===-1)
								lastIndexOfSlash=languageUrl.lastIndexOf("\\",languageUrl.length - 2);
							if(lastIndexOfSlash !==-1 && languageUrl.length > lastIndexOfSlash+1)
								baseUrl=languageUrl.substring(0,lastIndexOfSlash+1);
							break
						}
					}
				}
			}
			if(url)
			{
				var head=document.getElementsByTagName("head")[0];
				var scriptElement=null;
				var $$t_H=this;
				var scriptElementCallback=function()
					{
						if(stringLoadedCallback && (!scriptElement.readyState || scriptElement.readyState && (scriptElement.readyState==="loaded" || scriptElement.readyState==="complete")))
						{
							scriptElement.onload=null;
							scriptElement.onreadystatechange=null;
							stringLoadedCallback()
						}
					};
				var $$t_I=this;
				var failureCallback=function()
					{
						if(!$$t_I._areStringsLoaded$p$0())
						{
							var fallbackUrl=baseUrl+"en-us/"+"outlook_strings.js";
							scriptElement.onload=null;
							scriptElement.onreadystatechange=null;
							scriptElement=$$t_I._createScriptElement$p$0(fallbackUrl);
							scriptElement.onload=scriptElementCallback;
							scriptElement.onreadystatechange=scriptElementCallback;
							head.appendChild(scriptElement)
						}
					};
				scriptElement=this._createScriptElement$p$0(url);
				scriptElement.onload=scriptElementCallback;
				scriptElement.onreadystatechange=scriptElementCallback;
				window.setTimeout(failureCallback,2e3);
				head.appendChild(scriptElement)
			}
		},
		_createScriptElement$p$0: function(url)
		{
			var scriptElement=document.createElement("script");
			scriptElement.type="text/javascript";
			scriptElement.src=url;
			return scriptElement
		}
	};
	OSF.DDA.OutlookAppOm.prototype.initialize=function(initialData)
	{
		var ItemTypeKey="itemType";
		this._initialData$p$0=new $h.InitialData(initialData);
		this._hostItemType$p$0=initialData[ItemTypeKey];
		if(1===initialData[ItemTypeKey])
			this._item$p$0=new $h.Message(this._initialData$p$0);
		else if(3===initialData[ItemTypeKey])
			this._item$p$0=new $h.MeetingRequest(this._initialData$p$0);
		else if(2===initialData[ItemTypeKey])
			this._item$p$0=new $h.Appointment(this._initialData$p$0);
		else if(4===initialData[ItemTypeKey])
			this._item$p$0=new $h.MessageCompose(this._initialData$p$0);
		else if(5===initialData[ItemTypeKey])
			this._item$p$0=new $h.AppointmentCompose(this._initialData$p$0);
		else if(6===initialData[ItemTypeKey]);
		else
			Sys.Debug.trace("Unexpected item type was received from the host.");
		this._userProfile$p$0=new $h.UserProfile(this._initialData$p$0);
		this._diagnostics$p$0=new $h.Diagnostics(this._initialData$p$0,this._officeAppContext$p$0["get_appName"]());
		var supportsAdditionalParameters=window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.get__appName$i$0() !==8 || this.isOutlook16OrGreater();
		this._additionalOutlookParams$p$0=new $h.AdditionalGlobalParameters(supportsAdditionalParameters);
		this._initializeMethods$p$0();
		$h.InitialData._defineReadOnlyProperty$i(this,"item",this.$$d__getItem$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"userProfile",this.$$d__getUserProfile$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"diagnostics",this.$$d__getDiagnostics$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"ewsUrl",this.$$d__getEwsUrl$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"restUrl",this.$$d__getRestUrl$p$0);
		if(window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.get__appName$i$0()===64)
			if(this._initialData$p$0.get__overrideWindowOpen$i$0())
				window.open=this.$$d_windowOpenOverrideHandler
	};
	OSF.DDA.OutlookAppOm.prototype.makeEwsRequestAsync=function(data)
	{
		var args=[];
		for(var $$pai_5=1; $$pai_5 < arguments["length"];++$$pai_5)
			args[$$pai_5 - 1]=arguments[$$pai_5];
		if($h.ScriptHelpers.isNullOrUndefined(data))
			throw Error.argumentNull("data");
		if(data.length > window["OSF"]["DDA"]["OutlookAppOm"]._maxEwsRequestSize$p)
			throw Error.argument("data",window["_u"]["ExtensibilityStrings"]["l_EwsRequestOversized_Text"]);
		this._throwOnMethodCallForInsufficientPermission$i$0(3,"makeEwsRequestAsync");
		var parameters=$h.CommonParameters.parse(args,true,true);
		var ewsRequest=new $h.EwsRequest(parameters._asyncContext$p$0);
		var $$t_4=this;
		ewsRequest.onreadystatechange=function()
		{
			if(4===ewsRequest.get__requestState$i$1())
				parameters._callback$p$0(ewsRequest._asyncResult$p$0)
		};
		ewsRequest.send(data)
	};
	OSF.DDA.OutlookAppOm.prototype.recordDataPoint=function(data)
	{
		if($h.ScriptHelpers.isNullOrUndefined(data))
			throw Error.argumentNull("data");
		this.invokeHostMethod(402,data,null)
	};
	OSF.DDA.OutlookAppOm.prototype.recordTrace=function(data)
	{
		if($h.ScriptHelpers.isNullOrUndefined(data))
			throw Error.argumentNull("data");
		this.invokeHostMethod(401,data,null)
	};
	OSF.DDA.OutlookAppOm.prototype.trackCtq=function(data)
	{
		if($h.ScriptHelpers.isNullOrUndefined(data))
			throw Error.argumentNull("data");
		this.invokeHostMethod(400,data,null)
	};
	OSF.DDA.OutlookAppOm.prototype.convertToLocalClientTime=function(timeValue)
	{
		var date=new Date(timeValue["getTime"]());
		var offset=date["getTimezoneOffset"]() * -1;
		if(this._initialData$p$0 && this._initialData$p$0.get__timeZoneOffsets$i$0())
		{
			date["setUTCMinutes"](date["getUTCMinutes"]() - offset);
			offset=this._findOffset$p$0(date);
			date["setUTCMinutes"](date["getUTCMinutes"]()+offset)
		}
		var retValue=this._dateToDictionary$i$0(date);
		retValue["timezoneOffset"]=offset;
		return retValue
	};
	OSF.DDA.OutlookAppOm.prototype.convertToUtcClientTime=function(input)
	{
		var retValue=this._dictionaryToDate$i$0(input);
		if(this._initialData$p$0 && this._initialData$p$0.get__timeZoneOffsets$i$0())
		{
			var offset=this._findOffset$p$0(retValue);
			retValue["setUTCMinutes"](retValue["getUTCMinutes"]() - offset);
			offset=!input["timezoneOffset"] ? retValue["getTimezoneOffset"]() * -1 : input["timezoneOffset"];
			retValue["setUTCMinutes"](retValue["getUTCMinutes"]()+offset)
		}
		return retValue
	};
	OSF.DDA.OutlookAppOm.prototype.convertToRestId=function(itemId, restVersion)
	{
		if(!itemId)
			throw Error.argumentNull("itemId");
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidRestVersion$p(restVersion);
		return itemId.replace(new RegExp("[/]","g"),"-").replace(new RegExp("[+]","g"),"_")
	};
	OSF.DDA.OutlookAppOm.prototype.convertToEwsId=function(itemId, restVersion)
	{
		if(!itemId)
			throw Error.argumentNull("itemId");
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnInvalidRestVersion$p(restVersion);
		return itemId.replace(new RegExp("[-]","g"),"/").replace(new RegExp("[_]","g"),"+")
	};
	OSF.DDA.OutlookAppOm.prototype.getUserIdentityTokenAsync=function()
	{
		var args=[];
		for(var $$pai_2=0; $$pai_2 < arguments["length"];++$$pai_2)
			args[$$pai_2]=arguments[$$pai_2];
		this._throwOnMethodCallForInsufficientPermission$i$0(1,"getUserIdentityTokenAsync");
		var parameters=$h.CommonParameters.parse(args,true,true);
		this._invokeGetTokenMethodAsync$p$0(2,null,"GetUserIdentityToken",parameters._callback$p$0,parameters._asyncContext$p$0)
	};
	OSF.DDA.OutlookAppOm.prototype.getCallbackTokenAsync=function()
	{
		var args=[];
		for(var $$pai_7=0; $$pai_7 < arguments["length"];++$$pai_7)
			args[$$pai_7]=arguments[$$pai_7];
		this._throwOnMethodCallForInsufficientPermission$i$0(1,"getCallbackTokenAsync");
		var parameters=$h.CommonParameters.parse(args,true,true);
		var options={};
		if(parameters._options$p$0)
			for(var $$arr_3=Object["keys"](parameters._options$p$0), $$len_4=$$arr_3.length, $$idx_5=0; $$idx_5 < $$len_4;++$$idx_5)
			{
				var key=$$arr_3[$$idx_5];
				options[key]=parameters._options$p$0[key]
			}
		if(!("isRest" in options))
			options["isRest"]=false;
		this._invokeGetTokenMethodAsync$p$0(12,options,"GetCallbackToken",parameters._callback$p$0,parameters._asyncContext$p$0)
	};
	OSF.DDA.OutlookAppOm.prototype.displayMessageForm=function(itemId)
	{
		if($h.ScriptHelpers.isNullOrUndefined(itemId))
			throw Error.argumentNull("itemId");
		this.invokeHostMethod(8,{itemId: window["OSF"]["DDA"]["OutlookAppOm"].getItemIdBasedOnHost(itemId)},null)
	};
	OSF.DDA.OutlookAppOm.prototype.displayAppointmentForm=function(itemId)
	{
		if($h.ScriptHelpers.isNullOrUndefined(itemId))
			throw Error.argumentNull("itemId");
		this.invokeHostMethod(9,{itemId: window["OSF"]["DDA"]["OutlookAppOm"].getItemIdBasedOnHost(itemId)},null)
	};
	OSF.DDA.OutlookAppOm.prototype.RegisterConsentAsync=function(consentState)
	{
		if(consentState !==2 && consentState !==1 && consentState)
			throw Error.argumentOutOfRange("consentState");
		var parameters={};
		parameters["consentState"]=consentState["toString"]();
		parameters["extensionId"]=this["GetExtensionId"]();
		this.invokeHostMethod(40,parameters,null)
	};
	OSF.DDA.OutlookAppOm.prototype.CloseApp=function()
	{
		this.invokeHostMethod(42,null,null)
	};
	OSF.DDA.OutlookAppOm.prototype.GetIsRead=function()
	{
		return this._initialData$p$0.get__isRead$i$0()
	};
	OSF.DDA.OutlookAppOm.prototype.GetEndNodeUrl=function()
	{
		return this._initialData$p$0.get__endNodeUrl$i$0()
	};
	OSF.DDA.OutlookAppOm.prototype.GetConsentMetadata=function()
	{
		return this._initialData$p$0.get__consentMetadata$i$0()
	};
	OSF.DDA.OutlookAppOm.prototype.GetEntryPointUrl=function()
	{
		return this._initialData$p$0.get__entryPointUrl$i$0()
	};
	OSF.DDA.OutlookAppOm.prototype.GetMarketplaceContentMarket=function()
	{
		return this._initialData$p$0.get__marketplaceContentMarket$i$0()
	};
	OSF.DDA.OutlookAppOm.prototype.GetMarketplaceAssetId=function()
	{
		return this._initialData$p$0.get__marketplaceAssetId$i$0()
	};
	OSF.DDA.OutlookAppOm.prototype.GetExtensionId=function()
	{
		return this._initialData$p$0.get__extensionId$i$0()
	};
	OSF.DDA.OutlookAppOm.prototype.setCurrentItemNumber=function(itemNumber)
	{
		this._additionalOutlookParams$p$0.setCurrentItemNumber(itemNumber)
	};
	window["OSF"]["DDA"]["Settings"]=OSF.DDA.Settings=function(data)
	{
		this._rawData$p$0=data
	};
	window["OSF"]["DDA"]["Settings"]._convertFromRawSettings$p=function(rawSettings)
	{
		if(!rawSettings)
			return{};
		if(window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.get__appName$i$0()===8 || window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.get__appName$i$0()===65536 || window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.get__appName$i$0()===4194304)
		{
			var outlookSettings=rawSettings["SettingsKey"];
			if(outlookSettings)
				return OSF.DDA.SettingsManager["deserializeSettings"](outlookSettings)
		}
		return rawSettings
	};
	OSF.DDA.Settings.prototype={
		_rawData$p$0: null,
		_settingsData$p$0: null,
		get__data$p$0: function()
		{
			if(!this._settingsData$p$0)
			{
				this._settingsData$p$0=window["OSF"]["DDA"]["Settings"]._convertFromRawSettings$p(this._rawData$p$0);
				this._rawData$p$0=null
			}
			return this._settingsData$p$0
		},
		_saveSettingsForOutlook$p$0: function(callback, userContext)
		{
			var storedException=null;
			try
			{
				var serializedSettings=OSF.DDA.SettingsManager["serializeSettings"](this.get__data$p$0());
				var jsonSettings=window["JSON"]["stringify"](serializedSettings);
				var settingsObjectToSave={SettingsKey: jsonSettings};
				OSF.DDA.ClientSettingsManager["write"](settingsObjectToSave)
			}
			catch(ex)
			{
				storedException=ex
			}
			if(callback)
			{
				var asyncResult;
				if(storedException)
					asyncResult=window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.createAsyncResult(null,1,9019,userContext,storedException["message"]);
				else
					asyncResult=window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.createAsyncResult(null,0,0,userContext,null);
				callback(asyncResult)
			}
		},
		_saveSettingsForOwa$p$0: function(callback, userContext)
		{
			var serializedSettings=OSF.DDA.SettingsManager["serializeSettings"](this.get__data$p$0());
			var $$t_7=this;
			window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.invokeHostMethod(404,[serializedSettings],function(resultCode, response)
			{
				if(callback)
				{
					var asyncResult;
					if(resultCode)
						asyncResult=window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.createAsyncResult(null,1,9017,userContext,String.format(window["_u"]["ExtensibilityStrings"]["l_InternalProtocolError_Text"],resultCode));
					else
					{
						var responseDictionary=response;
						if(!responseDictionary["error"])
							asyncResult=window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.createAsyncResult(null,0,0,userContext,null);
						else
							asyncResult=window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.createAsyncResult(null,1,9019,userContext,responseDictionary["errorMessage"])
					}
					callback(asyncResult)
				}
			})
		}
	};
	OSF.DDA.Settings.prototype.get=function(name)
	{
		return this.get__data$p$0()[name]
	};
	OSF.DDA.Settings.prototype.set=function(name, value)
	{
		this.get__data$p$0()[name]=value
	};
	OSF.DDA.Settings.prototype.remove=function(name)
	{
		delete this.get__data$p$0()[name]
	};
	OSF.DDA.Settings.prototype.saveAsync=function()
	{
		var args=[];
		for(var $$pai_4=0; $$pai_4 < arguments["length"];++$$pai_4)
			args[$$pai_4]=arguments[$$pai_4];
		var commonParameters=$h.CommonParameters.parse(args,false);
		if(window["JSON"]["stringify"](OSF.DDA.SettingsManager["serializeSettings"](this.get__data$p$0())).length > 32768)
		{
			var asyncResult=window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.createAsyncResult(null,1,9019,commonParameters._asyncContext$p$0,"");
			var $$t_3=this;
			window.setTimeout(function()
			{
				commonParameters._callback$p$0(asyncResult)
			},0);
			return
		}
		if(window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.get__appName$i$0()===64)
			this._saveSettingsForOwa$p$0(commonParameters._callback$p$0,commonParameters._asyncContext$p$0);
		else
			this._saveSettingsForOutlook$p$0(commonParameters._callback$p$0,commonParameters._asyncContext$p$0)
	};
	Type.registerNamespace("$h");
	var $h=window["$h"] || {};
	Type.registerNamespace("Office.cast");
	var Office=window["Office"] || {};
	Office.cast=Office.cast || {};
	$h.AdditionalGlobalParameters=function(supported)
	{
		this._parameterBlobSupported$p$0=supported;
		this._itemNumber$p$0=0
	};
	$h.AdditionalGlobalParameters.prototype={
		_parameterBlobSupported$p$0: false,
		_itemNumber$p$0: 0,
		setCurrentItemNumber: function(itemNumber)
		{
			if(itemNumber > 0)
				this._itemNumber$p$0=itemNumber
		},
		updateOutlookExecuteParameters: function(executeParameters, additionalApiParameters)
		{
			if(this._parameterBlobSupported$p$0)
			{
				if(this._itemNumber$p$0 > 0)
					additionalApiParameters["itemNumber"]=this._itemNumber$p$0["toString"]();
				if(!Object["keys"](additionalApiParameters)["length"])
					return;
				if(!executeParameters["val"])
					executeParameters["val"]=[];
				executeParameters["val"]["push"](window["JSON"]["stringify"](additionalApiParameters))
			}
		}
	};
	$h.Appointment=function(dataDictionary)
	{
		this.$$d__getOrganizer$p$2=Function.createDelegate(this,this._getOrganizer$p$2);
		this.$$d__getNormalizedSubject$p$2=Function.createDelegate(this,this._getNormalizedSubject$p$2);
		this.$$d__getSubject$p$2=Function.createDelegate(this,this._getSubject$p$2);
		this.$$d__getResources$p$2=Function.createDelegate(this,this._getResources$p$2);
		this.$$d__getRequiredAttendees$p$2=Function.createDelegate(this,this._getRequiredAttendees$p$2);
		this.$$d__getOptionalAttendees$p$2=Function.createDelegate(this,this._getOptionalAttendees$p$2);
		this.$$d__getLocation$p$2=Function.createDelegate(this,this._getLocation$p$2);
		this.$$d__getEnd$p$2=Function.createDelegate(this,this._getEnd$p$2);
		this.$$d__getStart$p$2=Function.createDelegate(this,this._getStart$p$2);
		$h.Appointment["initializeBase"](this,[dataDictionary]);
		$h.InitialData._defineReadOnlyProperty$i(this,"start",this.$$d__getStart$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"end",this.$$d__getEnd$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"location",this.$$d__getLocation$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"optionalAttendees",this.$$d__getOptionalAttendees$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"requiredAttendees",this.$$d__getRequiredAttendees$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"resources",this.$$d__getResources$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"subject",this.$$d__getSubject$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"normalizedSubject",this.$$d__getNormalizedSubject$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"organizer",this.$$d__getOrganizer$p$2)
	};
	$h.Appointment.prototype={
		getItemType: function()
		{
			return window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ItemType"]["Appointment"]
		},
		_getStart$p$2: function()
		{
			return this._data$p$0.get__start$i$0()
		},
		_getEnd$p$2: function()
		{
			return this._data$p$0.get__end$i$0()
		},
		_getLocation$p$2: function()
		{
			return this._data$p$0.get__location$i$0()
		},
		_getOptionalAttendees$p$2: function()
		{
			return this._data$p$0.get__cc$i$0()
		},
		_getRequiredAttendees$p$2: function()
		{
			return this._data$p$0.get__to$i$0()
		},
		_getResources$p$2: function()
		{
			return this._data$p$0.get__resources$i$0()
		},
		_getSubject$p$2: function()
		{
			return this._data$p$0.get__subject$i$0()
		},
		_getNormalizedSubject$p$2: function()
		{
			return this._data$p$0.get__normalizedSubject$i$0()
		},
		_getOrganizer$p$2: function()
		{
			return this._data$p$0.get__organizer$i$0()
		}
	};
	$h.Appointment.prototype.getEntities=function()
	{
		return this._data$p$0._getEntities$i$0()
	};
	$h.Appointment.prototype.getEntitiesByType=function(entityType)
	{
		return this._data$p$0._getEntitiesByType$i$0(entityType)
	};
	$h.Appointment.prototype.getSelectedEntities=function()
	{
		return this._data$p$0._getSelectedEntities$i$0()
	};
	$h.Appointment.prototype.getRegExMatches=function()
	{
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(1,"getRegExMatches");
		return this._data$p$0._getRegExMatches$i$0()
	};
	$h.Appointment.prototype.getFilteredEntitiesByName=function(name)
	{
		return this._data$p$0._getFilteredEntitiesByName$i$0(name)
	};
	$h.Appointment.prototype.getRegExMatchesByName=function(name)
	{
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(1,"getRegExMatchesByName");
		return this._data$p$0._getRegExMatchesByName$i$0(name)
	};
	$h.Appointment.prototype.getSelectedRegExMatches=function()
	{
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(1,"getSelectedRegExMatches");
		return this._data$p$0._getSelectedRegExMatches$i$0()
	};
	$h.Appointment.prototype.displayReplyForm=function(obj)
	{
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._displayReplyForm$i$0(obj)
	};
	$h.Appointment.prototype.displayReplyAllForm=function(obj)
	{
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._displayReplyAllForm$i$0(obj)
	};
	$h.AppointmentCompose=function(data)
	{
		this.$$d__getLocation$p$2=Function.createDelegate(this,this._getLocation$p$2);
		this.$$d__getEnd$p$2=Function.createDelegate(this,this._getEnd$p$2);
		this.$$d__getStart$p$2=Function.createDelegate(this,this._getStart$p$2);
		this.$$d__getOptionalAttendees$p$2=Function.createDelegate(this,this._getOptionalAttendees$p$2);
		this.$$d__getRequiredAttendees$p$2=Function.createDelegate(this,this._getRequiredAttendees$p$2);
		$h.AppointmentCompose["initializeBase"](this,[data]);
		$h.InitialData._defineReadOnlyProperty$i(this,"requiredAttendees",this.$$d__getRequiredAttendees$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"optionalAttendees",this.$$d__getOptionalAttendees$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"start",this.$$d__getStart$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"end",this.$$d__getEnd$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"location",this.$$d__getLocation$p$2)
	};
	$h.AppointmentCompose.prototype={
		_requiredAttendees$p$2: null,
		_optionalAttendees$p$2: null,
		_start$p$2: null,
		_end$p$2: null,
		_location$p$2: null,
		getItemType: function()
		{
			return window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ItemType"]["Appointment"]
		},
		_getRequiredAttendees$p$2: function()
		{
			this._data$p$0._throwOnRestrictedPermissionLevel$i$0();
			if(!this._requiredAttendees$p$2)
				this._requiredAttendees$p$2=new $h.ComposeRecipient(0,"requiredAttendees");
			return this._requiredAttendees$p$2
		},
		_getOptionalAttendees$p$2: function()
		{
			this._data$p$0._throwOnRestrictedPermissionLevel$i$0();
			if(!this._optionalAttendees$p$2)
				this._optionalAttendees$p$2=new $h.ComposeRecipient(1,"optionalAttendees");
			return this._optionalAttendees$p$2
		},
		_getStart$p$2: function()
		{
			this._data$p$0._throwOnRestrictedPermissionLevel$i$0();
			if(!this._start$p$2)
				this._start$p$2=new $h.ComposeTime(1);
			return this._start$p$2
		},
		_getEnd$p$2: function()
		{
			this._data$p$0._throwOnRestrictedPermissionLevel$i$0();
			if(!this._end$p$2)
				this._end$p$2=new $h.ComposeTime(2);
			return this._end$p$2
		},
		_getLocation$p$2: function()
		{
			this._data$p$0._throwOnRestrictedPermissionLevel$i$0();
			if(!this._location$p$2)
				this._location$p$2=new $h.ComposeLocation;
			return this._location$p$2
		}
	};
	$h.AttachmentConstants=function(){};
	$h.AttachmentDetails=function(data)
	{
		this.$$d__getIsInline$p$0=Function.createDelegate(this,this._getIsInline$p$0);
		this.$$d__getAttachmentType$p$0=Function.createDelegate(this,this._getAttachmentType$p$0);
		this.$$d__getSize$p$0=Function.createDelegate(this,this._getSize$p$0);
		this.$$d__getContentType$p$0=Function.createDelegate(this,this._getContentType$p$0);
		this.$$d__getName$p$0=Function.createDelegate(this,this._getName$p$0);
		this.$$d__getId$p$0=Function.createDelegate(this,this._getId$p$0);
		this._data$p$0=data;
		$h.InitialData._defineReadOnlyProperty$i(this,"id",this.$$d__getId$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"name",this.$$d__getName$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"contentType",this.$$d__getContentType$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"size",this.$$d__getSize$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"attachmentType",this.$$d__getAttachmentType$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"isInline",this.$$d__getIsInline$p$0)
	};
	$h.AttachmentDetails.prototype={
		_data$p$0: null,
		_getId$p$0: function()
		{
			return this._data$p$0["id"]
		},
		_getName$p$0: function()
		{
			return this._data$p$0["name"]
		},
		_getContentType$p$0: function()
		{
			return this._data$p$0["contentType"]
		},
		_getSize$p$0: function()
		{
			return this._data$p$0["size"]
		},
		_getAttachmentType$p$0: function()
		{
			var response=this._data$p$0["attachmentType"];
			return response < $h.AttachmentDetails._attachmentTypeMap$p["length"] ? $h.AttachmentDetails._attachmentTypeMap$p[response] : window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["AttachmentType"]["File"]
		},
		_getIsInline$p$0: function()
		{
			return this._data$p$0["isInline"]
		}
	};
	$h.Body=function(){};
	$h.Body._tryMapToHostCoercionType$i=function(coercionType, hostCoercionType)
	{
		hostCoercionType["val"]=undefined;
		if(coercionType===window["Microsoft"]["Office"]["WebExtension"]["CoercionType"]["Html"])
			hostCoercionType["val"]=3;
		else if(coercionType===window["Microsoft"]["Office"]["WebExtension"]["CoercionType"]["Text"])
			hostCoercionType["val"]=0;
		else
			return false;
		return true
	};
	$h.Body.prototype.getAsync=function(coercionType)
	{
		var args=[];
		for(var $$pai_7=1; $$pai_7 < arguments["length"];++$$pai_7)
			args[$$pai_7 - 1]=arguments[$$pai_7];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(1,"body.getAsync");
		var commonParameters=$h.CommonParameters.parse(args,true);
		var hostCoercionType;
		var $$t_5,
			$$t_6;
		if(!($$t_6=$h.Body._tryMapToHostCoercionType$i(coercionType,$$t_5={val: hostCoercionType}),hostCoercionType=$$t_5["val"],$$t_6))
			throw Error.argument("coercionType");
		var dataToHost={coercionType: hostCoercionType};
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(37,dataToHost,null,commonParameters._asyncContext$p$0,commonParameters._callback$p$0)
	};
	$h.ComposeBody=function()
	{
		$h.ComposeBody["initializeBase"](this)
	};
	$h.ComposeBody._createParameterDictionaryToHost$i=function(data, parameters)
	{
		var dataToHost={data: data};
		if(parameters._options$p$0 && parameters._options$p$0["hasOwnProperty"]("coercionType") && !$h.ScriptHelpers.isNull(parameters._options$p$0["coercionType"]))
		{
			var hostCoercionType;
			var $$t_4,
				$$t_5;
			if(!($$t_5=$h.Body._tryMapToHostCoercionType$i(parameters._options$p$0["coercionType"],$$t_4={val: hostCoercionType}),hostCoercionType=$$t_4["val"],$$t_5))
			{
				if(parameters._callback$p$0)
					parameters._callback$p$0(window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.createAsyncResult(null,1,1e3,parameters._asyncContext$p$0,null));
				return null
			}
			dataToHost["coercionType"]=hostCoercionType
		}
		else
			dataToHost["coercionType"]=0;
		return dataToHost
	};
	$h.ComposeBody.prototype.getTypeAsync=function()
	{
		var args=[];
		for(var $$pai_2=0; $$pai_2 < arguments["length"];++$$pai_2)
			args[$$pai_2]=arguments[$$pai_2];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(1,"body.getTypeAsync");
		var parameters=$h.CommonParameters.parse(args,true);
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(14,null,null,parameters._asyncContext$p$0,parameters._callback$p$0)
	};
	$h.ComposeBody.prototype.setSelectedDataAsync=function(data)
	{
		var args=[];
		for(var $$pai_4=1; $$pai_4 < arguments["length"];++$$pai_4)
			args[$$pai_4 - 1]=arguments[$$pai_4];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(2,"body.setSelectedDataAsync");
		var parameters=$h.CommonParameters.parse(args,false);
		if(!String["isInstanceOfType"](data))
			throw Error.argumentType("data",Object["getType"](data),String);
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(data.length,0,1e6,"data");
		var dataToHost=$h.ComposeBody._createParameterDictionaryToHost$i(data,parameters);
		if(!dataToHost)
			return;
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(13,dataToHost,null,parameters._asyncContext$p$0,parameters._callback$p$0)
	};
	$h.ComposeBody.prototype.prependAsync=function(data)
	{
		var args=[];
		for(var $$pai_4=1; $$pai_4 < arguments["length"];++$$pai_4)
			args[$$pai_4 - 1]=arguments[$$pai_4];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(2,"body.prependAsync");
		var parameters=$h.CommonParameters.parse(args,false);
		if(!String["isInstanceOfType"](data))
			throw Error.argumentType("data",Object["getType"](data),String);
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(data.length,0,1e6,"data");
		var dataToHost=$h.ComposeBody._createParameterDictionaryToHost$i(data,parameters);
		if(!dataToHost)
			return;
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(23,dataToHost,null,parameters._asyncContext$p$0,parameters._callback$p$0)
	};
	$h.ComposeBody.prototype.setAsync=function(data)
	{
		var args=[];
		for(var $$pai_4=1; $$pai_4 < arguments["length"];++$$pai_4)
			args[$$pai_4 - 1]=arguments[$$pai_4];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(2,"body.setAsync");
		var parameters=$h.CommonParameters.parse(args,false);
		if(!String["isInstanceOfType"](data))
			throw Error.argumentType("data",Object["getType"](data),String);
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(data.length,0,1e6,"data");
		var dataToHost=$h.ComposeBody._createParameterDictionaryToHost$i(data,parameters);
		if(!dataToHost)
			return;
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(38,dataToHost,null,parameters._asyncContext$p$0,parameters._callback$p$0)
	};
	$h.ComposeItem=function(data)
	{
		this.$$d__getBody$p$1=Function.createDelegate(this,this._getBody$p$1);
		this.$$d__getSubject$p$1=Function.createDelegate(this,this._getSubject$p$1);
		$h.ComposeItem["initializeBase"](this,[data]);
		$h.InitialData._defineReadOnlyProperty$i(this,"subject",this.$$d__getSubject$p$1);
		$h.InitialData._defineReadOnlyProperty$i(this,"body",this.$$d__getBody$p$1)
	};
	$h.ComposeItem.prototype={
		_subject$p$1: null,
		_body$p$1: null,
		_getBody$p$1: function()
		{
			this._data$p$0._throwOnRestrictedPermissionLevel$i$0();
			if(!this._body$p$1)
				this._body$p$1=new $h.ComposeBody;
			return this._body$p$1
		},
		_getSubject$p$1: function()
		{
			this._data$p$0._throwOnRestrictedPermissionLevel$i$0();
			if(!this._subject$p$1)
				this._subject$p$1=new $h.ComposeSubject;
			return this._subject$p$1
		}
	};
	$h.ComposeItem.prototype.addFileAttachmentAsync=function(uri, attachmentName)
	{
		var args=[];
		for(var $$pai_6=2; $$pai_6 < arguments["length"];++$$pai_6)
			args[$$pai_6 - 2]=arguments[$$pai_6];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(2,"addFileAttachmentAsync");
		if(!$h.ScriptHelpers.isNonEmptyString(uri))
			throw Error.argument("uri");
		if(!$h.ScriptHelpers.isNonEmptyString(attachmentName))
			throw Error.argument("attachmentName");
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(uri.length,0,2048,"uri");
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(attachmentName.length,0,255,"attachmentName");
		var commonParameters=$h.CommonParameters.parse(args,false);
		var isInline=false;
		if(!$h.ScriptHelpers.isNull(commonParameters._options$p$0))
			isInline=$h.ScriptHelpers.isValueTrue(commonParameters._options$p$0["isInline"]);
		var parameters={
				uri: uri,
				name: attachmentName,
				isInline: isInline,
				__timeout__: 6e5
			};
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(16,parameters,null,commonParameters._asyncContext$p$0,commonParameters._callback$p$0)
	};
	$h.ComposeItem.prototype.addItemAttachmentAsync=function(itemId, attachmentName)
	{
		var args=[];
		for(var $$pai_5=2; $$pai_5 < arguments["length"];++$$pai_5)
			args[$$pai_5 - 2]=arguments[$$pai_5];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(2,"addItemAttachmentAsync");
		if(!$h.ScriptHelpers.isNonEmptyString(itemId))
			throw Error.argument("itemId");
		if(!$h.ScriptHelpers.isNonEmptyString(attachmentName))
			throw Error.argument("attachmentName");
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(itemId.length,0,200,"itemId");
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(attachmentName.length,0,255,"attachmentName");
		var commonParameters=$h.CommonParameters.parse(args,false);
		var parameters={
				itemId: window["OSF"]["DDA"]["OutlookAppOm"].getItemIdBasedOnHost(itemId),
				name: attachmentName,
				__timeout__: 6e5
			};
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(19,parameters,null,commonParameters._asyncContext$p$0,commonParameters._callback$p$0)
	};
	$h.ComposeItem.prototype.removeAttachmentAsync=function(attachmentId)
	{
		var args=[];
		for(var $$pai_3=1; $$pai_3 < arguments["length"];++$$pai_3)
			args[$$pai_3 - 1]=arguments[$$pai_3];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(2,"removeAttachmentAsync");
		if(!$h.ScriptHelpers.isNonEmptyString(attachmentId))
			throw Error.argument("attachmentId");
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(attachmentId.length,0,200,"attachmentId");
		var commonParameters=$h.CommonParameters.parse(args,false);
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(20,{attachmentIndex: attachmentId},null,commonParameters._asyncContext$p$0,commonParameters._callback$p$0)
	};
	$h.ComposeItem.prototype.getSelectedDataAsync=function(coercionType)
	{
		var args=[];
		for(var $$pai_7=1; $$pai_7 < arguments["length"];++$$pai_7)
			args[$$pai_7 - 1]=arguments[$$pai_7];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(1,"getSelectedDataAsync");
		var commonParameters=$h.CommonParameters.parse(args,true);
		var hostCoercionType;
		var $$t_5,
			$$t_6;
		if(coercionType !==window["Microsoft"]["Office"]["WebExtension"]["CoercionType"]["Html"] && coercionType !==window["Microsoft"]["Office"]["WebExtension"]["CoercionType"]["Text"] || !($$t_6=$h.Body._tryMapToHostCoercionType$i(coercionType,$$t_5={val: hostCoercionType}),hostCoercionType=$$t_5["val"],$$t_6))
			throw Error.argument("coercionType");
		var dataToHost={coercionType: hostCoercionType};
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(28,dataToHost,null,commonParameters._asyncContext$p$0,commonParameters._callback$p$0)
	};
	$h.ComposeItem.prototype.setSelectedDataAsync=function(data)
	{
		var args=[];
		for(var $$pai_4=1; $$pai_4 < arguments["length"];++$$pai_4)
			args[$$pai_4 - 1]=arguments[$$pai_4];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(2,"setSelectedDataAsync");
		var parameters=$h.CommonParameters.parse(args,false);
		if(!String["isInstanceOfType"](data))
			throw Error.argumentType("data",Object["getType"](data),String);
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(data.length,0,1e6,"data");
		var dataToHost=$h.ComposeBody._createParameterDictionaryToHost$i(data,parameters);
		if(!dataToHost)
			return;
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(29,dataToHost,null,parameters._asyncContext$p$0,parameters._callback$p$0)
	};
	$h.ComposeItem.prototype.close=function()
	{
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(41,null,null,null,null)
	};
	$h.ComposeItem.prototype.saveAsync=function()
	{
		var args=[];
		for(var $$pai_2=0; $$pai_2 < arguments["length"];++$$pai_2)
			args[$$pai_2]=arguments[$$pai_2];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(2,"saveAsync");
		var parameters=$h.CommonParameters.parse(args,false);
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(32,null,null,parameters._asyncContext$p$0,parameters._callback$p$0)
	};
	$h.ComposeRecipient=function(type, propertyName)
	{
		this._type$p$0=type;
		this._propertyName$p$0=propertyName
	};
	$h.ComposeRecipient._throwOnInvalidDisplayNameOrEmail$p=function(displayName, emailAddress)
	{
		if(!displayName && !emailAddress)
			throw Error.argument("recipients");
		if(displayName && displayName.length > 255)
			throw Error.argumentOutOfRange("recipients",displayName.length,window["_u"]["ExtensibilityStrings"]["l_DisplayNameTooLong_Text"]);
		if(emailAddress && emailAddress.length > 571)
			throw Error.argumentOutOfRange("recipients",emailAddress.length,window["_u"]["ExtensibilityStrings"]["l_EmailAddressTooLong_Text"]);
	};
	$h.ComposeRecipient._getAsyncFormatter$p=function(rawInput)
	{
		var input=rawInput;
		var output=[];
		for(var i=0; i < input["length"]; i++)
		{
			var email=new $h.EmailAddressDetails(input[i]);
			output[i]=email
		}
		return output
	};
	$h.ComposeRecipient._createEmailDictionaryForHost$p=function(address, name)
	{
		return{
				address: address,
				name: name
			}
	};
	$h.ComposeRecipient.prototype={
		_propertyName$p$0: null,
		_type$p$0: 0,
		setAddHelper: function(recipients, args, isSet)
		{
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(recipients["length"],0,100,"recipients");
			var parameters=$h.CommonParameters.parse(args,false);
			var recipientData=[];
			if(Array["isInstanceOfType"](recipients))
				for(var i=0; i < recipients["length"]; i++)
					if(String["isInstanceOfType"](recipients[i]))
					{
						$h.ComposeRecipient._throwOnInvalidDisplayNameOrEmail$p(recipients[i],recipients[i]);
						recipientData[i]=$h.ComposeRecipient._createEmailDictionaryForHost$p(recipients[i],recipients[i])
					}
					else if($h.EmailAddressDetails["isInstanceOfType"](recipients[i]))
					{
						var address=recipients[i];
						$h.ComposeRecipient._throwOnInvalidDisplayNameOrEmail$p(address["displayName"],address["emailAddress"]);
						recipientData[i]=$h.ComposeRecipient._createEmailDictionaryForHost$p(address["emailAddress"],address["displayName"])
					}
					else if(Object["isInstanceOfType"](recipients[i]))
					{
						var input=recipients[i];
						var emailAddress=input["emailAddress"];
						var displayName=input["displayName"];
						$h.ComposeRecipient._throwOnInvalidDisplayNameOrEmail$p(displayName,emailAddress);
						recipientData[i]=$h.ComposeRecipient._createEmailDictionaryForHost$p(emailAddress,displayName)
					}
					else
						throw Error.argument("recipients");
			else
				throw Error.argument("recipients");
			var $$t_B=this;
			window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(isSet ? 21 : 22,{
				recipientField: this._type$p$0,
				recipientArray: recipientData
			},function(rawInput)
			{
				return rawInput
			},parameters._asyncContext$p$0,parameters._callback$p$0)
		}
	};
	$h.ComposeRecipient.prototype.getAsync=function()
	{
		var args=[];
		for(var $$pai_2=0; $$pai_2 < arguments["length"];++$$pai_2)
			args[$$pai_2]=arguments[$$pai_2];
		var parameters=$h.CommonParameters.parse(args,true);
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(1,this._propertyName$p$0+".getAsync");
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(15,{recipientField: this._type$p$0},$h.ComposeRecipient._getAsyncFormatter$p,parameters._asyncContext$p$0,parameters._callback$p$0)
	};
	$h.ComposeRecipient.prototype.setAsync=function(recipients)
	{
		var args=[];
		for(var $$pai_2=1; $$pai_2 < arguments["length"];++$$pai_2)
			args[$$pai_2 - 1]=arguments[$$pai_2];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(2,this._propertyName$p$0+".setAsync");
		this.setAddHelper(recipients,args,true)
	};
	$h.ComposeRecipient.prototype.addAsync=function(recipients)
	{
		var args=[];
		for(var $$pai_2=1; $$pai_2 < arguments["length"];++$$pai_2)
			args[$$pai_2 - 1]=arguments[$$pai_2];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(2,this._propertyName$p$0+".addAsync");
		this.setAddHelper(recipients,args,false)
	};
	$h.ComposeRecipient.RecipientField=function(){};
	$h.ComposeRecipient.RecipientField.prototype={
		to: 0,
		cc: 1,
		bcc: 2,
		requiredAttendees: 0,
		optionalAttendees: 1
	};
	$h.ComposeRecipient.RecipientField["registerEnum"]("$h.0",false);
	$h.ComposeLocation=function(){};
	$h.ComposeLocation.prototype.getAsync=function()
	{
		var args=[];
		for(var $$pai_2=0; $$pai_2 < arguments["length"];++$$pai_2)
			args[$$pai_2]=arguments[$$pai_2];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(1,"location.getAsync");
		var parameters=$h.CommonParameters.parse(args,true);
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(26,null,null,parameters._asyncContext$p$0,parameters._callback$p$0)
	};
	$h.ComposeLocation.prototype.setAsync=function(location)
	{
		var args=[];
		for(var $$pai_3=1; $$pai_3 < arguments["length"];++$$pai_3)
			args[$$pai_3 - 1]=arguments[$$pai_3];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(2,"location.setAsync");
		var parameters=$h.CommonParameters.parse(args,false);
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(location.length,0,255,"location");
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(27,{location: location},null,parameters._asyncContext$p$0,parameters._callback$p$0)
	};
	$h.ComposeSubject=function(){};
	$h.ComposeSubject.prototype.getAsync=function()
	{
		var args=[];
		for(var $$pai_2=0; $$pai_2 < arguments["length"];++$$pai_2)
			args[$$pai_2]=arguments[$$pai_2];
		var parameters=$h.CommonParameters.parse(args,true);
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(1,"subject.getAsync");
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(18,null,null,parameters._asyncContext$p$0,parameters._callback$p$0)
	};
	$h.ComposeSubject.prototype.setAsync=function(data)
	{
		var args=[];
		for(var $$pai_3=1; $$pai_3 < arguments["length"];++$$pai_3)
			args[$$pai_3 - 1]=arguments[$$pai_3];
		var parameters=$h.CommonParameters.parse(args,false);
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(2,"subject.setAsync");
		if(!String["isInstanceOfType"](data))
			throw Error.argument("data");
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(data.length,0,255,"data");
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(17,{subject: data},null,parameters._asyncContext$p$0,parameters._callback$p$0)
	};
	$h.ComposeTime=function(type)
	{
		this.$$d__ticksToDateFormatter$p$0=Function.createDelegate(this,this._ticksToDateFormatter$p$0);
		this._timeType$p$0=type
	};
	$h.ComposeTime.prototype={
		_timeType$p$0: 0,
		_ticksToDateFormatter$p$0: function(rawInput)
		{
			var ticks=rawInput;
			return new Date(ticks)
		},
		_getPropertyName$p$0: function()
		{
			return this._timeType$p$0===1 ? "start" : "end"
		}
	};
	$h.ComposeTime.prototype.getAsync=function()
	{
		var args=[];
		for(var $$pai_2=0; $$pai_2 < arguments["length"];++$$pai_2)
			args[$$pai_2]=arguments[$$pai_2];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(1,this._getPropertyName$p$0()+".getAsync");
		var parameters=$h.CommonParameters.parse(args,true);
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(24,{TimeProperty: this._timeType$p$0},this.$$d__ticksToDateFormatter$p$0,parameters._asyncContext$p$0,parameters._callback$p$0)
	};
	$h.ComposeTime.prototype.setAsync=function(dateTime)
	{
		var args=[];
		for(var $$pai_3=1; $$pai_3 < arguments["length"];++$$pai_3)
			args[$$pai_3 - 1]=arguments[$$pai_3];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(2,this._getPropertyName$p$0()+".setAsync");
		if(!Date["isInstanceOfType"](dateTime))
			throw Error.argumentType("dateTime",Object["getType"](dateTime),Date);
		if(window["isNaN"](dateTime["getTime"]()))
			throw Error.argument("dateTime");
		if(dateTime["getTime"]() < -864e13 || dateTime["getTime"]() > 864e13)
			throw Error.argumentOutOfRange("dateTime");
		var parameters=$h.CommonParameters.parse(args,false);
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(25,{
			TimeProperty: this._timeType$p$0,
			time: dateTime["getTime"]()
		},null,parameters._asyncContext$p$0,parameters._callback$p$0)
	};
	$h.ComposeTime.TimeType=function(){};
	$h.ComposeTime.TimeType.prototype={
		start: 1,
		end: 2
	};
	$h.ComposeTime.TimeType["registerEnum"]("$h.1",false);
	$h.Contact=function(data)
	{
		this.$$d__getContactString$p$0=Function.createDelegate(this,this._getContactString$p$0);
		this.$$d__getAddresses$p$0=Function.createDelegate(this,this._getAddresses$p$0);
		this.$$d__getUrls$p$0=Function.createDelegate(this,this._getUrls$p$0);
		this.$$d__getEmailAddresses$p$0=Function.createDelegate(this,this._getEmailAddresses$p$0);
		this.$$d__getPhoneNumbers$p$0=Function.createDelegate(this,this._getPhoneNumbers$p$0);
		this.$$d__getBusinessName$p$0=Function.createDelegate(this,this._getBusinessName$p$0);
		this.$$d__getPersonName$p$0=Function.createDelegate(this,this._getPersonName$p$0);
		this._data$p$0=data;
		$h.InitialData._defineReadOnlyProperty$i(this,"personName",this.$$d__getPersonName$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"businessName",this.$$d__getBusinessName$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"phoneNumbers",this.$$d__getPhoneNumbers$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"emailAddresses",this.$$d__getEmailAddresses$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"urls",this.$$d__getUrls$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"addresses",this.$$d__getAddresses$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"contactString",this.$$d__getContactString$p$0)
	};
	$h.Contact.prototype={
		_data$p$0: null,
		_phoneNumbers$p$0: null,
		_getPersonName$p$0: function()
		{
			return this._data$p$0["PersonName"]
		},
		_getBusinessName$p$0: function()
		{
			return this._data$p$0["BusinessName"]
		},
		_getAddresses$p$0: function()
		{
			return $h.Entities._getExtractedStringProperty$i(this._data$p$0,"Addresses")
		},
		_getEmailAddresses$p$0: function()
		{
			return $h.Entities._getExtractedStringProperty$i(this._data$p$0,"EmailAddresses")
		},
		_getUrls$p$0: function()
		{
			return $h.Entities._getExtractedStringProperty$i(this._data$p$0,"Urls")
		},
		_getPhoneNumbers$p$0: function()
		{
			if(!this._phoneNumbers$p$0)
			{
				var $$t_1=this;
				this._phoneNumbers$p$0=$h.Entities._getExtractedObjects$i($h.PhoneNumber,this._data$p$0,"PhoneNumbers",function(data)
				{
					return new $h.PhoneNumber(data)
				})
			}
			return this._phoneNumbers$p$0
		},
		_getContactString$p$0: function()
		{
			return this._data$p$0["ContactString"]
		}
	};
	$h.CustomProperties=function(data)
	{
		if($h.ScriptHelpers.isNullOrUndefined(data))
			throw Error.argumentNull("data");
		if(Array["isInstanceOfType"](data))
		{
			var customPropertiesArray=data;
			if(customPropertiesArray["length"] > 0)
				this._data$p$0=customPropertiesArray[0];
			else
				throw Error.argument("data");
		}
		else
			this._data$p$0=data
	};
	$h.CustomProperties.prototype={_data$p$0: null};
	$h.CustomProperties.prototype.get=function(name)
	{
		var value=this._data$p$0[name];
		if(typeof value==="string")
		{
			var valueString=value;
			if(valueString.length > 6 && valueString.startsWith("Date(") && valueString.endsWith(")"))
			{
				var ticksString=valueString.substring(5,valueString.length - 1);
				var ticks=window["parseInt"](ticksString);
				if(!window["isNaN"](ticks))
				{
					var dateTimeValue=new Date(ticks);
					if(dateTimeValue)
						value=dateTimeValue
				}
			}
		}
		return value
	};
	$h.CustomProperties.prototype.set=function(name, value)
	{
		if(window["OSF"]["OUtil"]["isDate"](value))
			value="Date("+value["getTime"]()+")";
		this._data$p$0[name]=value
	};
	$h.CustomProperties.prototype.remove=function(name)
	{
		delete this._data$p$0[name]
	};
	$h.CustomProperties.prototype.saveAsync=function()
	{
		var args=[];
		for(var $$pai_4=0; $$pai_4 < arguments["length"];++$$pai_4)
			args[$$pai_4]=arguments[$$pai_4];
		var MaxCustomPropertiesLength=2500;
		if(window["JSON"]["stringify"](this._data$p$0).length > MaxCustomPropertiesLength)
			throw Error.argument();
		var parameters=$h.CommonParameters.parse(args,false,true);
		var saveCustomProperties=new $h.SaveDictionaryRequest(parameters._callback$p$0,parameters._asyncContext$p$0);
		saveCustomProperties._sendRequest$i$0(4,"SaveCustomProperties",{customProperties: this._data$p$0})
	};
	$h.Diagnostics=function(data, appName)
	{
		this.$$d__getOwaView$p$0=Function.createDelegate(this,this._getOwaView$p$0);
		this.$$d__getHostVersion$p$0=Function.createDelegate(this,this._getHostVersion$p$0);
		this.$$d__getHostName$p$0=Function.createDelegate(this,this._getHostName$p$0);
		this._data$p$0=data;
		this._appName$p$0=appName;
		$h.InitialData._defineReadOnlyProperty$i(this,"hostName",this.$$d__getHostName$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"hostVersion",this.$$d__getHostVersion$p$0);
		if(64===this._appName$p$0)
			$h.InitialData._defineReadOnlyProperty$i(this,"OWAView",this.$$d__getOwaView$p$0)
	};
	$h.Diagnostics.prototype={
		_data$p$0: null,
		_appName$p$0: 0,
		_getHostName$p$0: function()
		{
			switch(this._appName$p$0)
			{
				case 8:
					return"Outlook";
				case 64:
					return"OutlookWebApp";
				case 65536:
					return"OutlookIOS";
				case 4194304:
					return"OutlookAndroid";
				default:
					return null
			}
		},
		_getHostVersion$p$0: function()
		{
			return this._data$p$0.get__hostVersion$i$0()
		},
		_getOwaView$p$0: function()
		{
			return this._data$p$0.get__owaView$i$0()
		}
	};
	$h.EmailAddressDetails=function(data)
	{
		this.$$d__getRecipientType$p$0=Function.createDelegate(this,this._getRecipientType$p$0);
		this.$$d__getAppointmentResponse$p$0=Function.createDelegate(this,this._getAppointmentResponse$p$0);
		this.$$d__getDisplayName$p$0=Function.createDelegate(this,this._getDisplayName$p$0);
		this.$$d__getEmailAddress$p$0=Function.createDelegate(this,this._getEmailAddress$p$0);
		this._data$p$0=data;
		$h.InitialData._defineReadOnlyProperty$i(this,"emailAddress",this.$$d__getEmailAddress$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"displayName",this.$$d__getDisplayName$p$0);
		if($h.ScriptHelpers.dictionaryContainsKey(data,"appointmentResponse"))
			$h.InitialData._defineReadOnlyProperty$i(this,"appointmentResponse",this.$$d__getAppointmentResponse$p$0);
		if($h.ScriptHelpers.dictionaryContainsKey(data,"recipientType"))
			$h.InitialData._defineReadOnlyProperty$i(this,"recipientType",this.$$d__getRecipientType$p$0)
	};
	$h.EmailAddressDetails._createFromEmailUserDictionary$i=function(data)
	{
		var emailAddressDetailsDictionary={};
		var displayName=data["Name"];
		var emailAddress=data["UserId"];
		emailAddressDetailsDictionary["name"]=displayName || $h.EmailAddressDetails._emptyString$p;
		emailAddressDetailsDictionary["address"]=emailAddress || $h.EmailAddressDetails._emptyString$p;
		return new $h.EmailAddressDetails(emailAddressDetailsDictionary)
	};
	$h.EmailAddressDetails.prototype={
		_data$p$0: null,
		_getEmailAddress$p$0: function()
		{
			return this._data$p$0["address"]
		},
		_getDisplayName$p$0: function()
		{
			return this._data$p$0["name"]
		},
		_getAppointmentResponse$p$0: function()
		{
			var response=this._data$p$0["appointmentResponse"];
			return response < $h.EmailAddressDetails._responseTypeMap$p["length"] ? $h.EmailAddressDetails._responseTypeMap$p[response] : window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ResponseType"]["None"]
		},
		_getRecipientType$p$0: function()
		{
			var response=this._data$p$0["recipientType"];
			return response < $h.EmailAddressDetails._recipientTypeMap$p["length"] ? $h.EmailAddressDetails._recipientTypeMap$p[response] : window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["RecipientType"]["Other"]
		}
	};
	$h.EmailAddressDetails.prototype.toJSON=function()
	{
		var result={};
		result["emailAddress"]=this._getEmailAddress$p$0();
		result["displayName"]=this._getDisplayName$p$0();
		if($h.ScriptHelpers.dictionaryContainsKey(this._data$p$0,"appointmentResponse"))
			result["appointmentResponse"]=this._getAppointmentResponse$p$0();
		if($h.ScriptHelpers.dictionaryContainsKey(this._data$p$0,"recipientType"))
			result["recipientType"]=this._getRecipientType$p$0();
		return result
	};
	$h.Entities=function(data, filteredEntitiesData, timeSent, permissionLevel)
	{
		this.$$d__createMeetingSuggestion$p$0=Function.createDelegate(this,this._createMeetingSuggestion$p$0);
		this.$$d__getParcelDeliveries$p$0=Function.createDelegate(this,this._getParcelDeliveries$p$0);
		this.$$d__getFlightReservations$p$0=Function.createDelegate(this,this._getFlightReservations$p$0);
		this.$$d__getContacts$p$0=Function.createDelegate(this,this._getContacts$p$0);
		this.$$d__getPhoneNumbers$p$0=Function.createDelegate(this,this._getPhoneNumbers$p$0);
		this.$$d__getUrls$p$0=Function.createDelegate(this,this._getUrls$p$0);
		this.$$d__getEmailAddresses$p$0=Function.createDelegate(this,this._getEmailAddresses$p$0);
		this.$$d__getMeetingSuggestions$p$0=Function.createDelegate(this,this._getMeetingSuggestions$p$0);
		this.$$d__getTaskSuggestions$p$0=Function.createDelegate(this,this._getTaskSuggestions$p$0);
		this.$$d__getAddresses$p$0=Function.createDelegate(this,this._getAddresses$p$0);
		this._data$p$0=data || {};
		this._filteredData$p$0=filteredEntitiesData || {};
		this._dateTimeSent$p$0=timeSent;
		$h.InitialData._defineReadOnlyProperty$i(this,"addresses",this.$$d__getAddresses$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"taskSuggestions",this.$$d__getTaskSuggestions$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"meetingSuggestions",this.$$d__getMeetingSuggestions$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"emailAddresses",this.$$d__getEmailAddresses$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"urls",this.$$d__getUrls$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"phoneNumbers",this.$$d__getPhoneNumbers$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"contacts",this.$$d__getContacts$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"flightReservations",this.$$d__getFlightReservations$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"parcelDeliveries",this.$$d__getParcelDeliveries$p$0);
		this._permissionLevel$p$0=permissionLevel
	};
	$h.Entities._getExtractedObjects$i=function(T, data, name, creator, removeDuplicates, stringPropertyName)
	{
		var results=null;
		var extractedObjects=data[name];
		if(!extractedObjects)
			return new Array(0);
		if(removeDuplicates)
			extractedObjects=$h.Entities._removeDuplicate$p(Object,extractedObjects,$h.Entities._entityDictionaryEquals$p,stringPropertyName);
		results=new Array(extractedObjects["length"]);
		var count=0;
		for(var $$arr_9=extractedObjects, $$len_A=$$arr_9.length, $$idx_B=0; $$idx_B < $$len_A;++$$idx_B)
		{
			var extractedObject=$$arr_9[$$idx_B];
			if(creator)
				results[count++]=creator(extractedObject);
			else
				results[count++]=extractedObject
		}
		return results
	};
	$h.Entities._getExtractedStringProperty$i=function(data, name, removeDuplicate)
	{
		var extractedProperties=data[name];
		if(!extractedProperties)
			return new Array(0);
		if(removeDuplicate)
			extractedProperties=$h.Entities._removeDuplicate$p(String,extractedProperties,$h.Entities._stringEquals$p,null);
		return extractedProperties
	};
	$h.Entities._createContact$p=function(data)
	{
		return new $h.Contact(data)
	};
	$h.Entities._createTaskSuggestion$p=function(data)
	{
		return new $h.TaskSuggestion(data)
	};
	$h.Entities._createPhoneNumber$p=function(data)
	{
		return new $h.PhoneNumber(data)
	};
	$h.Entities._entityDictionaryEquals$p=function(dictionary1, dictionary2, entityPropertyIdentifier)
	{
		if(dictionary1===dictionary2)
			return true;
		if(!dictionary1 || !dictionary2)
			return false;
		if(dictionary1[entityPropertyIdentifier]===dictionary2[entityPropertyIdentifier])
			return true;
		return false
	};
	$h.Entities._stringEquals$p=function(string1, string2, entityProperty)
	{
		return string1===string2
	};
	$h.Entities._removeDuplicate$p=function(T, array, entityEquals, entityPropertyIdentifier)
	{
		for(var matchIndex1=array["length"] - 1; matchIndex1 >=0; matchIndex1--)
		{
			var removeMatch=false;
			for(var matchIndex2=matchIndex1 - 1; matchIndex2 >=0; matchIndex2--)
				if(entityEquals(array[matchIndex1],array[matchIndex2],entityPropertyIdentifier))
				{
					removeMatch=true;
					break
				}
			if(removeMatch)
				Array.removeAt(array,matchIndex1)
		}
		return array
	};
	$h.Entities.prototype={
		_dateTimeSent$p$0: null,
		_data$p$0: null,
		_filteredData$p$0: null,
		_filteredEntitiesCache$p$0: null,
		_permissionLevel$p$0: 0,
		_taskSuggestions$p$0: null,
		_meetingSuggestions$p$0: null,
		_phoneNumbers$p$0: null,
		_contacts$p$0: null,
		_addresses$p$0: null,
		_emailAddresses$p$0: null,
		_urls$p$0: null,
		_flightReservations$p$0: null,
		_parcelDeliveries$p$0: null,
		_getByType$i$0: function(entityType)
		{
			if(entityType===window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["EntityType"]["MeetingSuggestion"])
				return this._getMeetingSuggestions$p$0();
			else if(entityType===window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["EntityType"]["TaskSuggestion"])
				return this._getTaskSuggestions$p$0();
			else if(entityType===window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["EntityType"]["Address"])
				return this._getAddresses$p$0();
			else if(entityType===window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["EntityType"]["PhoneNumber"])
				return this._getPhoneNumbers$p$0();
			else if(entityType===window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["EntityType"]["EmailAddress"])
				return this._getEmailAddresses$p$0();
			else if(entityType===window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["EntityType"]["Url"])
				return this._getUrls$p$0();
			else if(entityType===window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["EntityType"]["Contact"])
				return this._getContacts$p$0();
			else if(entityType===window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["EntityType"]["FlightReservations"])
				return this._getFlightReservations$p$0();
			else if(entityType===window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["EntityType"]["ParcelDeliveries"])
				return this._getParcelDeliveries$p$0();
			return null
		},
		_getFilteredEntitiesByName$i$0: function(name)
		{
			if(!this._filteredEntitiesCache$p$0)
				this._filteredEntitiesCache$p$0={};
			if(!$h.ScriptHelpers.dictionaryContainsKey(this._filteredEntitiesCache$p$0,name))
			{
				var found=false;
				for(var i=0; i < $h.Entities._allEntityKeys$p["length"]; i++)
				{
					var entityTypeKey=$h.Entities._allEntityKeys$p[i];
					var perEntityTypeDictionary=this._filteredData$p$0[entityTypeKey];
					if(!perEntityTypeDictionary)
						continue;
					if($h.ScriptHelpers.dictionaryContainsKey(perEntityTypeDictionary,name))
					{
						switch(entityTypeKey)
						{
							case"EmailAddresses":
							case"Urls":
								this._filteredEntitiesCache$p$0[name]=$h.Entities._getExtractedStringProperty$i(perEntityTypeDictionary,name);
								break;
							case"Addresses":
								this._filteredEntitiesCache$p$0[name]=$h.Entities._getExtractedStringProperty$i(perEntityTypeDictionary,name,true);
								break;
							case"PhoneNumbers":
								this._filteredEntitiesCache$p$0[name]=$h.Entities._getExtractedObjects$i($h.PhoneNumber,perEntityTypeDictionary,name,$h.Entities._createPhoneNumber$p,false,null);
								break;
							case"TaskSuggestions":
								this._filteredEntitiesCache$p$0[name]=$h.Entities._getExtractedObjects$i($h.TaskSuggestion,perEntityTypeDictionary,name,$h.Entities._createTaskSuggestion$p,true,"TaskString");
								break;
							case"MeetingSuggestions":
								this._filteredEntitiesCache$p$0[name]=$h.Entities._getExtractedObjects$i($h.MeetingSuggestion,perEntityTypeDictionary,name,this.$$d__createMeetingSuggestion$p$0,true,"MeetingString");
								break;
							case"Contacts":
								this._filteredEntitiesCache$p$0[name]=$h.Entities._getExtractedObjects$i($h.Contact,perEntityTypeDictionary,name,$h.Entities._createContact$p,true,"ContactString");
								break
						}
						found=true;
						break
					}
				}
				if(!found)
					this._filteredEntitiesCache$p$0[name]=null
			}
			return this._filteredEntitiesCache$p$0[name]
		},
		_createMeetingSuggestion$p$0: function(data)
		{
			return new $h.MeetingSuggestion(data,this._dateTimeSent$p$0)
		},
		_getAddresses$p$0: function()
		{
			if(!this._addresses$p$0)
				this._addresses$p$0=$h.Entities._getExtractedStringProperty$i(this._data$p$0,"Addresses",true);
			return this._addresses$p$0
		},
		_getEmailAddresses$p$0: function()
		{
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnPropertyAccessForRestrictedPermission$i(this._permissionLevel$p$0);
			if(!this._emailAddresses$p$0)
				this._emailAddresses$p$0=$h.Entities._getExtractedStringProperty$i(this._data$p$0,"EmailAddresses",false);
			return this._emailAddresses$p$0
		},
		_getUrls$p$0: function()
		{
			if(!this._urls$p$0)
				this._urls$p$0=$h.Entities._getExtractedStringProperty$i(this._data$p$0,"Urls",false);
			return this._urls$p$0
		},
		_getPhoneNumbers$p$0: function()
		{
			if(!this._phoneNumbers$p$0)
				this._phoneNumbers$p$0=$h.Entities._getExtractedObjects$i($h.PhoneNumber,this._data$p$0,"PhoneNumbers",$h.Entities._createPhoneNumber$p);
			return this._phoneNumbers$p$0
		},
		_getTaskSuggestions$p$0: function()
		{
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnPropertyAccessForRestrictedPermission$i(this._permissionLevel$p$0);
			if(!this._taskSuggestions$p$0)
				this._taskSuggestions$p$0=$h.Entities._getExtractedObjects$i($h.TaskSuggestion,this._data$p$0,"TaskSuggestions",$h.Entities._createTaskSuggestion$p,true,"TaskString");
			return this._taskSuggestions$p$0
		},
		_getMeetingSuggestions$p$0: function()
		{
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnPropertyAccessForRestrictedPermission$i(this._permissionLevel$p$0);
			if(!this._meetingSuggestions$p$0)
				this._meetingSuggestions$p$0=$h.Entities._getExtractedObjects$i($h.MeetingSuggestion,this._data$p$0,"MeetingSuggestions",this.$$d__createMeetingSuggestion$p$0,true,"MeetingString");
			return this._meetingSuggestions$p$0
		},
		_getContacts$p$0: function()
		{
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnPropertyAccessForRestrictedPermission$i(this._permissionLevel$p$0);
			if(!this._contacts$p$0)
				this._contacts$p$0=$h.Entities._getExtractedObjects$i($h.Contact,this._data$p$0,"Contacts",$h.Entities._createContact$p,true,"ContactString");
			return this._contacts$p$0
		},
		_getParcelDeliveries$p$0: function()
		{
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnPropertyAccessForRestrictedPermission$i(this._permissionLevel$p$0);
			if(!this._parcelDeliveries$p$0)
				this._parcelDeliveries$p$0=$h.Entities._getExtractedObjects$i(Object,this._data$p$0,"ParcelDeliveries",null);
			return this._parcelDeliveries$p$0
		},
		_getFlightReservations$p$0: function()
		{
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnPropertyAccessForRestrictedPermission$i(this._permissionLevel$p$0);
			if(!this._flightReservations$p$0)
				this._flightReservations$p$0=$h.Entities._getExtractedObjects$i(Object,this._data$p$0,"FlightReservations",null);
			return this._flightReservations$p$0
		}
	};
	$h.ReplyConstants=function(){};
	$h.AsyncConstants=function(){};
	window["Office"]["cast"]["item"]=Office.cast.item=function(){};
	window["Office"]["cast"]["item"]["toItemRead"]=function(item)
	{
		if($h.Item["isInstanceOfType"](item))
			return item;
		throw Error.argumentType();
	};
	window["Office"]["cast"]["item"]["toItemCompose"]=function(item)
	{
		if($h.ComposeItem["isInstanceOfType"](item))
			return item;
		throw Error.argumentType();
	};
	window["Office"]["cast"]["item"]["toMessage"]=function(item)
	{
		return window["Office"]["cast"]["item"]["toMessageRead"](item)
	};
	window["Office"]["cast"]["item"]["toMessageRead"]=function(item)
	{
		if($h.Message["isInstanceOfType"](item))
			return item;
		throw Error.argumentType();
	};
	window["Office"]["cast"]["item"]["toMessageCompose"]=function(item)
	{
		if($h.MessageCompose["isInstanceOfType"](item))
			return item;
		throw Error.argumentType();
	};
	window["Office"]["cast"]["item"]["toMeetingRequest"]=function(item)
	{
		if($h.MeetingRequest["isInstanceOfType"](item))
			return item;
		throw Error.argumentType();
	};
	window["Office"]["cast"]["item"]["toAppointment"]=function(item)
	{
		return window["Office"]["cast"]["item"]["toAppointmentRead"](item)
	};
	window["Office"]["cast"]["item"]["toAppointmentRead"]=function(item)
	{
		if($h.Appointment["isInstanceOfType"](item))
			return item;
		throw Error.argumentType();
	};
	window["Office"]["cast"]["item"]["toAppointmentCompose"]=function(item)
	{
		if($h.AppointmentCompose["isInstanceOfType"](item))
			return item;
		throw Error.argumentType();
	};
	$h.Item=function(data)
	{
		this.$$d__getBody$p$1=Function.createDelegate(this,this._getBody$p$1);
		this.$$d__getAttachments$p$1=Function.createDelegate(this,this._getAttachments$p$1);
		this.$$d__getItemClass$p$1=Function.createDelegate(this,this._getItemClass$p$1);
		this.$$d__getItemId$p$1=Function.createDelegate(this,this._getItemId$p$1);
		this.$$d__getDateTimeModified$p$1=Function.createDelegate(this,this._getDateTimeModified$p$1);
		this.$$d__getDateTimeCreated$p$1=Function.createDelegate(this,this._getDateTimeCreated$p$1);
		$h.Item["initializeBase"](this,[data]);
		$h.InitialData._defineReadOnlyProperty$i(this,"dateTimeCreated",this.$$d__getDateTimeCreated$p$1);
		$h.InitialData._defineReadOnlyProperty$i(this,"dateTimeModified",this.$$d__getDateTimeModified$p$1);
		$h.InitialData._defineReadOnlyProperty$i(this,"itemId",this.$$d__getItemId$p$1);
		$h.InitialData._defineReadOnlyProperty$i(this,"itemClass",this.$$d__getItemClass$p$1);
		$h.InitialData._defineReadOnlyProperty$i(this,"attachments",this.$$d__getAttachments$p$1);
		$h.InitialData._defineReadOnlyProperty$i(this,"body",this.$$d__getBody$p$1)
	};
	$h.Item.prototype={
		_body$p$1: null,
		_getItemId$p$1: function()
		{
			return this._data$p$0.get__itemId$i$0()
		},
		_getItemClass$p$1: function()
		{
			return this._data$p$0.get__itemClass$i$0()
		},
		_getDateTimeCreated$p$1: function()
		{
			return this._data$p$0.get__dateTimeCreated$i$0()
		},
		_getDateTimeModified$p$1: function()
		{
			return this._data$p$0.get__dateTimeModified$i$0()
		},
		_getAttachments$p$1: function()
		{
			return this._data$p$0.get__attachments$i$0()
		},
		_getBody$p$1: function()
		{
			if(!this._body$p$1)
				this._body$p$1=new $h.Body;
			return this._body$p$1
		}
	};
	$h.ItemBase=function(data)
	{
		this.$$d__createCustomProperties$i$0=Function.createDelegate(this,this._createCustomProperties$i$0);
		this.$$d__getNotificationMessages$p$0=Function.createDelegate(this,this._getNotificationMessages$p$0);
		this.$$d_getItemType=Function.createDelegate(this,this.getItemType);
		this._data$p$0=data;
		$h.InitialData._defineReadOnlyProperty$i(this,"itemType",this.$$d_getItemType);
		$h.InitialData._defineReadOnlyProperty$i(this,"notificationMessages",this.$$d__getNotificationMessages$p$0)
	};
	$h.ItemBase.prototype={
		_data$p$0: null,
		_notificationMessages$p$0: null,
		get_data: function()
		{
			return this._data$p$0
		},
		_createCustomProperties$i$0: function(data)
		{
			return new $h.CustomProperties(data)
		},
		_getNotificationMessages$p$0: function()
		{
			if(!this._notificationMessages$p$0)
				this._notificationMessages$p$0=new $h.NotificationMessages;
			return this._notificationMessages$p$0
		}
	};
	$h.ItemBase.prototype.loadCustomPropertiesAsync=function()
	{
		var args=[];
		for(var $$pai_3=0; $$pai_3 < arguments["length"];++$$pai_3)
			args[$$pai_3]=arguments[$$pai_3];
		var parameters=$h.CommonParameters.parse(args,true,true);
		var loadCustomProperties=new $h._loadDictionaryRequest(this.$$d__createCustomProperties$i$0,"customProperties",parameters._callback$p$0,parameters._asyncContext$p$0);
		loadCustomProperties._sendRequest$i$0(3,"LoadCustomProperties",{})
	};
	$h.MeetingRequest=function(data)
	{
		this.$$d__getRequiredAttendees$p$3=Function.createDelegate(this,this._getRequiredAttendees$p$3);
		this.$$d__getOptionalAttendees$p$3=Function.createDelegate(this,this._getOptionalAttendees$p$3);
		this.$$d__getLocation$p$3=Function.createDelegate(this,this._getLocation$p$3);
		this.$$d__getEnd$p$3=Function.createDelegate(this,this._getEnd$p$3);
		this.$$d__getStart$p$3=Function.createDelegate(this,this._getStart$p$3);
		$h.MeetingRequest["initializeBase"](this,[data]);
		$h.InitialData._defineReadOnlyProperty$i(this,"start",this.$$d__getStart$p$3);
		$h.InitialData._defineReadOnlyProperty$i(this,"end",this.$$d__getEnd$p$3);
		$h.InitialData._defineReadOnlyProperty$i(this,"location",this.$$d__getLocation$p$3);
		$h.InitialData._defineReadOnlyProperty$i(this,"optionalAttendees",this.$$d__getOptionalAttendees$p$3);
		$h.InitialData._defineReadOnlyProperty$i(this,"requiredAttendees",this.$$d__getRequiredAttendees$p$3)
	};
	$h.MeetingRequest.prototype={
		_getStart$p$3: function()
		{
			return this._data$p$0.get__start$i$0()
		},
		_getEnd$p$3: function()
		{
			return this._data$p$0.get__end$i$0()
		},
		_getLocation$p$3: function()
		{
			return this._data$p$0.get__location$i$0()
		},
		_getOptionalAttendees$p$3: function()
		{
			return this._data$p$0.get__cc$i$0()
		},
		_getRequiredAttendees$p$3: function()
		{
			return this._data$p$0.get__to$i$0()
		}
	};
	$h.MeetingSuggestion=function(data, dateTimeSent)
	{
		this.$$d__getEndTime$p$0=Function.createDelegate(this,this._getEndTime$p$0);
		this.$$d__getStartTime$p$0=Function.createDelegate(this,this._getStartTime$p$0);
		this.$$d__getSubject$p$0=Function.createDelegate(this,this._getSubject$p$0);
		this.$$d__getLocation$p$0=Function.createDelegate(this,this._getLocation$p$0);
		this.$$d__getAttendees$p$0=Function.createDelegate(this,this._getAttendees$p$0);
		this.$$d__getMeetingString$p$0=Function.createDelegate(this,this._getMeetingString$p$0);
		this._data$p$0=data;
		this._dateTimeSent$p$0=dateTimeSent;
		$h.InitialData._defineReadOnlyProperty$i(this,"meetingString",this.$$d__getMeetingString$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"attendees",this.$$d__getAttendees$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"location",this.$$d__getLocation$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"subject",this.$$d__getSubject$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"start",this.$$d__getStartTime$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"end",this.$$d__getEndTime$p$0)
	};
	$h.MeetingSuggestion.prototype={
		_dateTimeSent$p$0: null,
		_data$p$0: null,
		_attendees$p$0: null,
		_getMeetingString$p$0: function()
		{
			return this._data$p$0["MeetingString"]
		},
		_getLocation$p$0: function()
		{
			return this._data$p$0["Location"]
		},
		_getSubject$p$0: function()
		{
			return this._data$p$0["Subject"]
		},
		_getStartTime$p$0: function()
		{
			var time=this._createDateTimeFromParameter$p$0("StartTime");
			var resolvedTime=$h.MeetingSuggestionTimeDecoder.resolve(time,this._dateTimeSent$p$0);
			if(resolvedTime["getTime"]() !==time["getTime"]())
				return window["OSF"]["DDA"]["OutlookAppOm"]._instance$p["convertToUtcClientTime"](window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._dateToDictionary$i$0(resolvedTime));
			return time
		},
		_getEndTime$p$0: function()
		{
			var time=this._createDateTimeFromParameter$p$0("EndTime");
			var resolvedTime=$h.MeetingSuggestionTimeDecoder.resolve(time,this._dateTimeSent$p$0);
			if(resolvedTime["getTime"]() !==time["getTime"]())
				return window["OSF"]["DDA"]["OutlookAppOm"]._instance$p["convertToUtcClientTime"](window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._dateToDictionary$i$0(resolvedTime));
			return time
		},
		_createDateTimeFromParameter$p$0: function(keyName)
		{
			var dateTimeString=this._data$p$0[keyName];
			if(!dateTimeString)
				return null;
			return new Date(dateTimeString)
		},
		_getAttendees$p$0: function()
		{
			if(!this._attendees$p$0)
			{
				var $$t_1=this;
				this._attendees$p$0=$h.Entities._getExtractedObjects$i($h.EmailAddressDetails,this._data$p$0,"Attendees",function(data)
				{
					return $h.EmailAddressDetails._createFromEmailUserDictionary$i(data)
				})
			}
			return this._attendees$p$0
		}
	};
	$h.MeetingSuggestionTimeDecoder=function(){};
	$h.MeetingSuggestionTimeDecoder.resolve=function(inTime, sentTime)
	{
		if(!sentTime)
			return inTime;
		try
		{
			var tod;
			var outDate;
			var extractedDate;
			var sentDate=new Date(sentTime["getFullYear"](),sentTime["getMonth"](),sentTime["getDate"](),0,0,0,0);
			var $$t_7,
				$$t_8,
				$$t_9;
			if(!($$t_9=$h.MeetingSuggestionTimeDecoder._decode$p(inTime,$$t_7={val: extractedDate},$$t_8={val: tod}),extractedDate=$$t_7["val"],tod=$$t_8["val"],$$t_9))
				return inTime;
			else
			{
				if($h._preciseDate["isInstanceOfType"](extractedDate))
					outDate=$h.MeetingSuggestionTimeDecoder._resolvePreciseDate$p(sentDate,extractedDate);
				else if($h._relativeDate["isInstanceOfType"](extractedDate))
					outDate=$h.MeetingSuggestionTimeDecoder._resolveRelativeDate$p(sentDate,extractedDate);
				else
					outDate=sentDate;
				if(window["isNaN"](outDate["getTime"]()))
					return sentTime;
				outDate["setMilliseconds"](outDate["getMilliseconds"]()+tod);
				return outDate
			}
		}
		catch($$e_6)
		{
			return sentTime
		}
	};
	$h.MeetingSuggestionTimeDecoder._isNullOrUndefined$i=function(value)
	{
		return null===value || value===undefined
	};
	$h.MeetingSuggestionTimeDecoder._resolvePreciseDate$p=function(sentDate, precise)
	{
		var year=precise._year$i$1;
		var month=!precise._month$i$1 ? sentDate["getMonth"]() : precise._month$i$1 - 1;
		var day=precise._day$i$1;
		if(!day)
			return sentDate;
		var candidate;
		if($h.MeetingSuggestionTimeDecoder._isNullOrUndefined$i(year))
		{
			candidate=new Date(sentDate["getFullYear"](),month,day);
			if(candidate["getTime"]() < sentDate["getTime"]())
				candidate=new Date(sentDate["getFullYear"]()+1,month,day)
		}
		else
			candidate=new Date(year < 50 ? 2e3+year : 1900+year,month,day);
		if(candidate["getMonth"]() !==month)
			return sentDate;
		return candidate
	};
	$h.MeetingSuggestionTimeDecoder._resolveRelativeDate$p=function(sentDate, relative)
	{
		var date;
		switch(relative._unit$i$1)
		{
			case 0:
				date=new Date(sentDate["getFullYear"](),sentDate["getMonth"](),sentDate["getDate"]());
				date["setDate"](date["getDate"]()+relative._offset$i$1);
				return date;
			case 5:
				return $h.MeetingSuggestionTimeDecoder._findBestDateForWeekDate$p(sentDate,relative._offset$i$1,relative._tag$i$1);
			case 2:
				var days=1;
				switch(relative._modifier$i$1)
				{
					case 1:
						break;
					case 2:
						days=16;
						break;
					default:
						if(!relative._offset$i$1)
							days=sentDate["getDate"]();
						break
				}
				date=new Date(sentDate["getFullYear"](),sentDate["getMonth"](),days);
				date["setMonth"](date["getMonth"]()+relative._offset$i$1);
				if(date["getTime"]() < sentDate["getTime"]())
					date["setDate"](date["getDate"]()+sentDate["getDate"]() - 1);
				return date;
			case 1:
				date=new Date(sentDate["getFullYear"](),sentDate["getMonth"](),sentDate["getDate"]());
				date["setDate"](sentDate["getDate"]()+7 * relative._offset$i$1);
				if(relative._modifier$i$1===1 || !relative._modifier$i$1)
				{
					date["setDate"](date["getDate"]()+1 - date["getDay"]());
					if(date["getTime"]() < sentDate["getTime"]())
						return sentDate;
					return date
				}
				else if(relative._modifier$i$1===2)
				{
					date["setDate"](date["getDate"]()+5 - date["getDay"]());
					return date
				}
				break;
			case 4:
				return $h.MeetingSuggestionTimeDecoder._findBestDateForWeekOfMonthDate$p(sentDate,relative);
			case 3:
				if(relative._offset$i$1 > 0)
					return new Date(sentDate["getFullYear"]()+relative._offset$i$1,0,1);
				break;
			default:
				break
		}
		return sentDate
	};
	$h.MeetingSuggestionTimeDecoder._findBestDateForWeekDate$p=function(sentDate, offset, tag)
	{
		if(offset > -5 && offset < 5)
		{
			var dayOfWeek=(tag+6) % 7+1;
			var days=7 * offset+(dayOfWeek - sentDate["getDay"]());
			sentDate["setDate"](sentDate["getDate"]()+days);
			return sentDate
		}
		else
		{
			var days=(tag - sentDate["getDay"]()) % 7;
			if(days < 0)
				days+=7;
			sentDate["setDate"](sentDate["getDate"]()+days);
			return sentDate
		}
	};
	$h.MeetingSuggestionTimeDecoder._findBestDateForWeekOfMonthDate$p=function(sentDate, relative)
	{
		var date;
		var firstDay;
		var newDate;
		date=sentDate;
		if(relative._tag$i$1 <=0 || relative._tag$i$1 > 12 || relative._offset$i$1 <=0 || relative._offset$i$1 > 5)
			return sentDate;
		var monthOffset=(12+relative._tag$i$1 - date["getMonth"]() - 1) % 12;
		firstDay=new Date(date["getFullYear"](),date["getMonth"]()+monthOffset,1);
		if(relative._modifier$i$1===1)
			if(relative._offset$i$1===1 && firstDay["getDay"]() !==6 && firstDay["getDay"]())
				return firstDay;
			else
			{
				newDate=new Date(firstDay["getFullYear"](),firstDay["getMonth"](),firstDay["getDate"]());
				newDate["setDate"](newDate["getDate"]()+(7+(1 - firstDay["getDay"]())) % 7);
				if(firstDay["getDay"]() !==6 && firstDay["getDay"]() && firstDay["getDay"]() !==1)
					newDate["setDate"](newDate["getDate"]() - 7);
				newDate["setDate"](newDate["getDate"]()+7 * (relative._offset$i$1 - 1));
				if(newDate["getMonth"]()+1 !==relative._tag$i$1)
					return sentDate;
				return newDate
			}
		else
		{
			newDate=new Date(firstDay["getFullYear"](),firstDay["getMonth"](),$h.MeetingSuggestionTimeDecoder._daysInMonth$p(firstDay["getMonth"](),firstDay["getFullYear"]()));
			var offset=1 - newDate["getDay"]();
			if(offset > 0)
				offset=offset - 7;
			newDate["setDate"](newDate["getDate"]()+offset);
			newDate["setDate"](newDate["getDate"]()+7 * (1 - relative._offset$i$1));
			if(newDate["getMonth"]()+1 !==relative._tag$i$1)
				if(firstDay["getDay"]() !==6 && firstDay["getDay"]())
					return firstDay;
				else
					return sentDate;
			else
				return newDate
		}
	};
	$h.MeetingSuggestionTimeDecoder._decode$p=function(inDate, date, time)
	{
		var DateValueMask=32767;
		date["val"]=null;
		time["val"]=0;
		if(!inDate)
			return false;
		time["val"]=$h.MeetingSuggestionTimeDecoder._getTimeOfDayInMillisecondsUTC$p(inDate);
		var inDateAtMidnight=inDate["getTime"]() - time["val"];
		var value=(inDateAtMidnight - $h.MeetingSuggestionTimeDecoder._baseDate$p["getTime"]()) / 864e5;
		if(value < 0)
			return false;
		else if(value >=262144)
			return false;
		else
		{
			var type=value >> 15;
			value=value & DateValueMask;
			switch(type)
			{
				case 0:
					return $h.MeetingSuggestionTimeDecoder._decodePreciseDate$p(value,date);
				case 1:
					return $h.MeetingSuggestionTimeDecoder._decodeRelativeDate$p(value,date);
				default:
					return false
			}
		}
	};
	$h.MeetingSuggestionTimeDecoder._decodePreciseDate$p=function(value, date)
	{
		var c_SubTypeMask=7;
		var c_MonthMask=15;
		var c_DayMask=31;
		var c_YearMask=127;
		var year=null;
		var month=0;
		var day=0;
		date["val"]=null;
		var subType=value >> 12 & c_SubTypeMask;
		if((subType & 4)===4)
		{
			year=value >> 5 & c_YearMask;
			if((subType & 2)===2)
			{
				if((subType & 1)===1)
					return false;
				month=value >> 1 & c_MonthMask
			}
		}
		else
		{
			if((subType & 2)===2)
				month=value >> 8 & c_MonthMask;
			if((subType & 1)===1)
				day=value >> 3 & c_DayMask
		}
		date["val"]=new $h._preciseDate(day,month,year);
		return true
	};
	$h.MeetingSuggestionTimeDecoder._decodeRelativeDate$p=function(value, date)
	{
		var TagMask=15;
		var OffsetMask=63;
		var UnitMask=7;
		var ModifierMask=3;
		var tag=value & TagMask;
		value >>=4;
		var offset=$h.MeetingSuggestionTimeDecoder._fromComplement$p(value & OffsetMask,6);
		value >>=6;
		var unit=value & UnitMask;
		value >>=3;
		var modifier=value & ModifierMask;
		try
		{
			date["val"]=new $h._relativeDate(modifier,offset,unit,tag);
			return true
		}
		catch($$e_A)
		{
			date["val"]=null;
			return false
		}
	};
	$h.MeetingSuggestionTimeDecoder._fromComplement$p=function(value, n)
	{
		var signed=1 << n - 1;
		var mask=(1 << n) - 1;
		if((value & signed)===signed)
			return-((value ^ mask)+1);
		else
			return value
	};
	$h.MeetingSuggestionTimeDecoder._daysInMonth$p=function(month, year)
	{
		return 32 - new Date(year,month,32)["getDate"]()
	};
	$h.MeetingSuggestionTimeDecoder._getTimeOfDayInMillisecondsUTC$p=function(inputTime)
	{
		var timeOfDay=0;
		timeOfDay+=inputTime["getUTCHours"]() * 3600;
		timeOfDay+=inputTime["getUTCMinutes"]() * 60;
		timeOfDay+=inputTime["getUTCSeconds"]();
		timeOfDay *=1e3;
		timeOfDay+=inputTime["getUTCMilliseconds"]();
		return timeOfDay
	};
	$h._extractedDate=function(){};
	$h._preciseDate=function(day, month, year)
	{
		$h._preciseDate["initializeBase"](this);
		if(day < 0 || day > 31)
			throw Error.argumentOutOfRange("day");
		if(month < 0 || month > 12)
			throw Error.argumentOutOfRange("month");
		this._day$i$1=day;
		this._month$i$1=month;
		if(!$h.MeetingSuggestionTimeDecoder._isNullOrUndefined$i(year))
		{
			if(!month && day)
				throw Error.argument("Invalid arguments");
			if(year < 0 || year > 2099)
				throw Error.argumentOutOfRange("year");
			this._year$i$1=year % 100
		}
		else if(!this._month$i$1 && !this._day$i$1)
			throw Error.argument("Invalid datetime");
	};
	$h._preciseDate.prototype={
		_day$i$1: 0,
		_month$i$1: 0,
		_year$i$1: null
	};
	$h._relativeDate=function(modifier, offset, unit, tag)
	{
		$h._relativeDate["initializeBase"](this);
		if(offset < -32 || offset > 31)
			throw Error.argumentOutOfRange("offset");
		if(tag < 0 || tag > 15)
			throw Error.argumentOutOfRange("tag");
		if(!unit && offset < 0)
			throw Error.argument("unit & offset do not form a valid date");
		this._modifier$i$1=modifier;
		this._offset$i$1=offset;
		this._unit$i$1=unit;
		this._tag$i$1=tag
	};
	$h._relativeDate.prototype={
		_modifier$i$1: 0,
		_offset$i$1: 0,
		_unit$i$1: 0,
		_tag$i$1: 0
	};
	$h.Message=function(dataDictionary)
	{
		this.$$d__getConversationId$p$2=Function.createDelegate(this,this._getConversationId$p$2);
		this.$$d__getInternetMessageId$p$2=Function.createDelegate(this,this._getInternetMessageId$p$2);
		this.$$d__getCc$p$2=Function.createDelegate(this,this._getCc$p$2);
		this.$$d__getTo$p$2=Function.createDelegate(this,this._getTo$p$2);
		this.$$d__getFrom$p$2=Function.createDelegate(this,this._getFrom$p$2);
		this.$$d__getSender$p$2=Function.createDelegate(this,this._getSender$p$2);
		this.$$d__getNormalizedSubject$p$2=Function.createDelegate(this,this._getNormalizedSubject$p$2);
		this.$$d__getSubject$p$2=Function.createDelegate(this,this._getSubject$p$2);
		$h.Message["initializeBase"](this,[dataDictionary]);
		$h.InitialData._defineReadOnlyProperty$i(this,"subject",this.$$d__getSubject$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"normalizedSubject",this.$$d__getNormalizedSubject$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"sender",this.$$d__getSender$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"from",this.$$d__getFrom$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"to",this.$$d__getTo$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"cc",this.$$d__getCc$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"internetMessageId",this.$$d__getInternetMessageId$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"conversationId",this.$$d__getConversationId$p$2)
	};
	$h.Message.prototype={
		getItemType: function()
		{
			return window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ItemType"]["Message"]
		},
		_getSubject$p$2: function()
		{
			return this._data$p$0.get__subject$i$0()
		},
		_getNormalizedSubject$p$2: function()
		{
			return this._data$p$0.get__normalizedSubject$i$0()
		},
		_getSender$p$2: function()
		{
			return this._data$p$0.get__sender$i$0()
		},
		_getFrom$p$2: function()
		{
			return this._data$p$0.get__from$i$0()
		},
		_getTo$p$2: function()
		{
			return this._data$p$0.get__to$i$0()
		},
		_getCc$p$2: function()
		{
			return this._data$p$0.get__cc$i$0()
		},
		_getInternetMessageId$p$2: function()
		{
			return this._data$p$0.get__internetMessageId$i$0()
		},
		_getConversationId$p$2: function()
		{
			return this._data$p$0.get__conversationId$i$0()
		}
	};
	$h.Message.prototype.getEntities=function()
	{
		return this._data$p$0._getEntities$i$0()
	};
	$h.Message.prototype.getEntitiesByType=function(entityType)
	{
		return this._data$p$0._getEntitiesByType$i$0(entityType)
	};
	$h.Message.prototype.getFilteredEntitiesByName=function(name)
	{
		return this._data$p$0._getFilteredEntitiesByName$i$0(name)
	};
	$h.Message.prototype.getSelectedEntities=function()
	{
		return this._data$p$0._getSelectedEntities$i$0()
	};
	$h.Message.prototype.getRegExMatches=function()
	{
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(1,"getRegExMatches");
		return this._data$p$0._getRegExMatches$i$0()
	};
	$h.Message.prototype.getRegExMatchesByName=function(name)
	{
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(1,"getRegExMatchesByName");
		return this._data$p$0._getRegExMatchesByName$i$0(name)
	};
	$h.Message.prototype.getSelectedRegExMatches=function()
	{
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(1,"getSelectedRegExMatches");
		return this._data$p$0._getSelectedRegExMatches$i$0()
	};
	$h.Message.prototype.displayReplyForm=function(obj)
	{
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._displayReplyForm$i$0(obj)
	};
	$h.Message.prototype.displayReplyAllForm=function(obj)
	{
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._displayReplyAllForm$i$0(obj)
	};
	$h.MessageCompose=function(data)
	{
		this.$$d__getConversationId$p$2=Function.createDelegate(this,this._getConversationId$p$2);
		this.$$d__getBcc$p$2=Function.createDelegate(this,this._getBcc$p$2);
		this.$$d__getCc$p$2=Function.createDelegate(this,this._getCc$p$2);
		this.$$d__getTo$p$2=Function.createDelegate(this,this._getTo$p$2);
		$h.MessageCompose["initializeBase"](this,[data]);
		$h.InitialData._defineReadOnlyProperty$i(this,"to",this.$$d__getTo$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"cc",this.$$d__getCc$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"bcc",this.$$d__getBcc$p$2);
		$h.InitialData._defineReadOnlyProperty$i(this,"conversationId",this.$$d__getConversationId$p$2)
	};
	$h.MessageCompose.prototype={
		_to$p$2: null,
		_cc$p$2: null,
		_bcc$p$2: null,
		getItemType: function()
		{
			return window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ItemType"]["Message"]
		},
		_getTo$p$2: function()
		{
			this._data$p$0._throwOnRestrictedPermissionLevel$i$0();
			if(!this._to$p$2)
				this._to$p$2=new $h.ComposeRecipient(0,"to");
			return this._to$p$2
		},
		_getCc$p$2: function()
		{
			this._data$p$0._throwOnRestrictedPermissionLevel$i$0();
			if(!this._cc$p$2)
				this._cc$p$2=new $h.ComposeRecipient(1,"cc");
			return this._cc$p$2
		},
		_getBcc$p$2: function()
		{
			this._data$p$0._throwOnRestrictedPermissionLevel$i$0();
			if(!this._bcc$p$2)
				this._bcc$p$2=new $h.ComposeRecipient(2,"bcc");
			return this._bcc$p$2
		},
		_getConversationId$p$2: function()
		{
			return this._data$p$0.get__conversationId$i$0()
		}
	};
	$h.NotificationMessages=function(){};
	$h.NotificationMessages._mapToHostItemNotificationMessageType$p=function(dataToHost)
	{
		var notificationType;
		var hostItemNotificationMessageType;
		notificationType=dataToHost["type"];
		if(notificationType===window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ItemNotificationMessageType"]["ProgressIndicator"])
			hostItemNotificationMessageType=1;
		else if(notificationType===window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ItemNotificationMessageType"]["InformationalMessage"])
			hostItemNotificationMessageType=0;
		else if(notificationType===window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ItemNotificationMessageType"]["ErrorMessage"])
			hostItemNotificationMessageType=2;
		else
			throw Error.argument("type");
		dataToHost["type"]=hostItemNotificationMessageType
	};
	$h.NotificationMessages._validateKey$p=function(key)
	{
		if(!$h.ScriptHelpers.isNonEmptyString(key))
			throw Error.argument("key");
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(key.length,0,32,"key")
	};
	$h.NotificationMessages._validateDictionary$p=function(dictionary)
	{
		if(!$h.ScriptHelpers.isNonEmptyString(dictionary["type"]))
			throw Error.argument("type");
		if(dictionary["type"]===window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ItemNotificationMessageType"]["InformationalMessage"])
		{
			if(!$h.ScriptHelpers.isNonEmptyString(dictionary["icon"]))
				throw Error.argument("icon");
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(dictionary["icon"].length,0,32,"icon");
			if($h.ScriptHelpers.isUndefined(dictionary["persistent"]))
				throw Error.argument("persistent");
			if(!Boolean["isInstanceOfType"](dictionary["persistent"]))
				throw Error.argumentType("persistent",Object["getType"](dictionary["persistent"]),Boolean);
		}
		else
		{
			if(!$h.ScriptHelpers.isUndefined(dictionary["icon"]))
				throw Error.argument("icon");
			if(!$h.ScriptHelpers.isUndefined(dictionary["persistent"]))
				throw Error.argument("persistent");
		}
		if(!$h.ScriptHelpers.isNonEmptyString(dictionary["message"]))
			throw Error.argument("message");
		window["OSF"]["DDA"]["OutlookAppOm"]._throwOnOutOfRange$i(dictionary["message"].length,0,150,"message")
	};
	$h.NotificationMessages.prototype.addAsync=function(key, dictionary)
	{
		var args=[];
		for(var $$pai_5=2; $$pai_5 < arguments["length"];++$$pai_5)
			args[$$pai_5 - 2]=arguments[$$pai_5];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(0,"NotificationMessages.addAsync");
		var commonParameters=$h.CommonParameters.parse(args,false);
		$h.NotificationMessages._validateKey$p(key);
		$h.NotificationMessages._validateDictionary$p(dictionary);
		var dataToHost={};
		dataToHost=$h.ScriptHelpers.deepClone(dictionary);
		dataToHost["key"]=key;
		$h.NotificationMessages._mapToHostItemNotificationMessageType$p(dataToHost);
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(33,dataToHost,null,commonParameters._asyncContext$p$0,commonParameters._callback$p$0)
	};
	$h.NotificationMessages.prototype.getAllAsync=function()
	{
		var args=[];
		for(var $$pai_2=0; $$pai_2 < arguments["length"];++$$pai_2)
			args[$$pai_2]=arguments[$$pai_2];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(0,"NotificationMessages.getAllAsync");
		var commonParameters=$h.CommonParameters.parse(args,true);
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(34,null,null,commonParameters._asyncContext$p$0,commonParameters._callback$p$0)
	};
	$h.NotificationMessages.prototype.replaceAsync=function(key, dictionary)
	{
		var args=[];
		for(var $$pai_5=2; $$pai_5 < arguments["length"];++$$pai_5)
			args[$$pai_5 - 2]=arguments[$$pai_5];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(0,"NotificationMessages.replaceAsync");
		var commonParameters=$h.CommonParameters.parse(args,false);
		$h.NotificationMessages._validateKey$p(key);
		$h.NotificationMessages._validateDictionary$p(dictionary);
		var dataToHost={};
		dataToHost=$h.ScriptHelpers.deepClone(dictionary);
		dataToHost["key"]=key;
		$h.NotificationMessages._mapToHostItemNotificationMessageType$p(dataToHost);
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(35,dataToHost,null,commonParameters._asyncContext$p$0,commonParameters._callback$p$0)
	};
	$h.NotificationMessages.prototype.removeAsync=function(key)
	{
		var args=[];
		for(var $$pai_4=1; $$pai_4 < arguments["length"];++$$pai_4)
			args[$$pai_4 - 1]=arguments[$$pai_4];
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._throwOnMethodCallForInsufficientPermission$i$0(0,"NotificationMessages.removeAsync");
		var commonParameters=$h.CommonParameters.parse(args,false);
		$h.NotificationMessages._validateKey$p(key);
		var dataToHost={key: key};
		window["OSF"]["DDA"]["OutlookAppOm"]._instance$p._standardInvokeHostMethod$i$0(36,dataToHost,null,commonParameters._asyncContext$p$0,commonParameters._callback$p$0)
	};
	$h.OutlookErrorManager=function(){};
	$h.OutlookErrorManager.getErrorArgs=function(errorCode)
	{
		if(!$h.OutlookErrorManager._isInitialized$p)
			$h.OutlookErrorManager._initialize$p();
		return OSF.DDA.ErrorCodeManager["getErrorArgs"](errorCode)
	};
	$h.OutlookErrorManager._initialize$p=function()
	{
		$h.OutlookErrorManager._addErrorMessage$p(9e3,"AttachmentSizeExceeded",window["_u"]["ExtensibilityStrings"]["l_AttachmentExceededSize_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9001,"NumberOfAttachmentsExceeded",window["_u"]["ExtensibilityStrings"]["l_ExceededMaxNumberOfAttachments_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9002,"InternalFormatError",window["_u"]["ExtensibilityStrings"]["l_InternalFormatError_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9003,"InvalidAttachmentId",window["_u"]["ExtensibilityStrings"]["l_InvalidAttachmentId_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9004,"InvalidAttachmentPath",window["_u"]["ExtensibilityStrings"]["l_InvalidAttachmentPath_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9005,"CannotAddAttachmentBeforeUpgrade",window["_u"]["ExtensibilityStrings"]["l_CannotAddAttachmentBeforeUpgrade_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9006,"AttachmentDeletedBeforeUploadCompletes",window["_u"]["ExtensibilityStrings"]["l_AttachmentDeletedBeforeUploadCompletes_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9007,"AttachmentUploadGeneralFailure",window["_u"]["ExtensibilityStrings"]["l_AttachmentUploadGeneralFailure_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9008,"AttachmentToDeleteDoesNotExist",window["_u"]["ExtensibilityStrings"]["l_DeleteAttachmentDoesNotExist_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9009,"AttachmentDeleteGeneralFailure",window["_u"]["ExtensibilityStrings"]["l_AttachmentDeleteGeneralFailure_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9010,"InvalidEndTime",window["_u"]["ExtensibilityStrings"]["l_InvalidEndTime_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9011,"HtmlSanitizationFailure",window["_u"]["ExtensibilityStrings"]["l_HtmlSanitizationFailure_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9012,"NumberOfRecipientsExceeded",String.format(window["_u"]["ExtensibilityStrings"]["l_NumberOfRecipientsExceeded_Text"],500));
		$h.OutlookErrorManager._addErrorMessage$p(9013,"NoValidRecipientsProvided",window["_u"]["ExtensibilityStrings"]["l_NoValidRecipientsProvided_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9014,"CursorPositionChanged",window["_u"]["ExtensibilityStrings"]["l_CursorPositionChanged_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9016,"InvalidSelection",window["_u"]["ExtensibilityStrings"]["l_InvalidSelection_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9017,"AccessRestricted","");
		$h.OutlookErrorManager._addErrorMessage$p(9018,"GenericTokenError","");
		$h.OutlookErrorManager._addErrorMessage$p(9019,"GenericSettingsError","");
		$h.OutlookErrorManager._addErrorMessage$p(9020,"GenericResponseError","");
		$h.OutlookErrorManager._addErrorMessage$p(9021,"SaveError",window["_u"]["ExtensibilityStrings"]["l_SaveError_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9022,"MessageInDifferentStoreError",window["_u"]["ExtensibilityStrings"]["l_MessageInDifferentStoreError_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9023,"DuplicateNotificationKey",window["_u"]["ExtensibilityStrings"]["l_DuplicateNotificationKey_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9024,"NotificationKeyNotFound",window["_u"]["ExtensibilityStrings"]["l_NotificationKeyNotFound_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9025,"NumberOfNotificationsExceeded",window["_u"]["ExtensibilityStrings"]["l_NumberOfNotificationsExceeded_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9026,"PersistedNotificationArrayReadError",window["_u"]["ExtensibilityStrings"]["l_PersistedNotificationArrayReadError_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9027,"PersistedNotificationArraySaveError",window["_u"]["ExtensibilityStrings"]["l_PersistedNotificationArraySaveError_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9028,"CannotPersistPropertyInUnsavedDraftError",window["_u"]["ExtensibilityStrings"]["l_CannotPersistPropertyInUnsavedDraftError_Text"]);
		$h.OutlookErrorManager._addErrorMessage$p(9029,"CanOnlyGetTokenForSavedItem",window["_u"]["ExtensibilityStrings"]["l_CallSaveAsyncBeforeToken_Text"]);
		$h.OutlookErrorManager._isInitialized$p=true
	};
	$h.OutlookErrorManager._addErrorMessage$p=function(errorCode, errorName, errorMessage)
	{
		OSF.DDA.ErrorCodeManager["addErrorMessage"](errorCode,{
			name: errorName,
			message: errorMessage
		})
	};
	$h.OutlookErrorManager.OutlookErrorCodes=function(){};
	$h.OutlookErrorManager.OsfDdaErrorCodes=function(){};
	$h.PhoneNumber=function(data)
	{
		this.$$d__getPhoneType$p$0=Function.createDelegate(this,this._getPhoneType$p$0);
		this.$$d__getOriginalPhoneString$p$0=Function.createDelegate(this,this._getOriginalPhoneString$p$0);
		this.$$d__getPhoneString$p$0=Function.createDelegate(this,this._getPhoneString$p$0);
		this._data$p$0=data;
		$h.InitialData._defineReadOnlyProperty$i(this,"phoneString",this.$$d__getPhoneString$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"originalPhoneString",this.$$d__getOriginalPhoneString$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"type",this.$$d__getPhoneType$p$0)
	};
	$h.PhoneNumber.prototype={
		_data$p$0: null,
		_getPhoneString$p$0: function()
		{
			return this._data$p$0["PhoneString"]
		},
		_getOriginalPhoneString$p$0: function()
		{
			return this._data$p$0["OriginalPhoneString"]
		},
		_getPhoneType$p$0: function()
		{
			return this._data$p$0["Type"]
		}
	};
	$h.TaskSuggestion=function(data)
	{
		this.$$d__getAssignees$p$0=Function.createDelegate(this,this._getAssignees$p$0);
		this.$$d__getTaskString$p$0=Function.createDelegate(this,this._getTaskString$p$0);
		this._data$p$0=data;
		$h.InitialData._defineReadOnlyProperty$i(this,"taskString",this.$$d__getTaskString$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"assignees",this.$$d__getAssignees$p$0)
	};
	$h.TaskSuggestion.prototype={
		_data$p$0: null,
		_assignees$p$0: null,
		_getTaskString$p$0: function()
		{
			return this._data$p$0["TaskString"]
		},
		_getAssignees$p$0: function()
		{
			if(!this._assignees$p$0)
			{
				var $$t_1=this;
				this._assignees$p$0=$h.Entities._getExtractedObjects$i($h.EmailAddressDetails,this._data$p$0,"Assignees",function(data)
				{
					return $h.EmailAddressDetails._createFromEmailUserDictionary$i(data)
				})
			}
			return this._assignees$p$0
		}
	};
	$h.UserProfile=function(data)
	{
		this.$$d__getUserProfileType$p$0=Function.createDelegate(this,this._getUserProfileType$p$0);
		this.$$d__getTimeZone$p$0=Function.createDelegate(this,this._getTimeZone$p$0);
		this.$$d__getEmailAddress$p$0=Function.createDelegate(this,this._getEmailAddress$p$0);
		this.$$d__getDisplayName$p$0=Function.createDelegate(this,this._getDisplayName$p$0);
		this._data$p$0=data;
		$h.InitialData._defineReadOnlyProperty$i(this,"displayName",this.$$d__getDisplayName$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"emailAddress",this.$$d__getEmailAddress$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"timeZone",this.$$d__getTimeZone$p$0);
		$h.InitialData._defineReadOnlyProperty$i(this,"type",this.$$d__getUserProfileType$p$0)
	};
	$h.UserProfile.prototype={
		_data$p$0: null,
		_getUserProfileType$p$0: function()
		{
			return this._data$p$0.get__userProfileType$i$0()
		},
		_getDisplayName$p$0: function()
		{
			return this._data$p$0.get__userDisplayName$i$0()
		},
		_getEmailAddress$p$0: function()
		{
			return this._data$p$0.get__userEmailAddress$i$0()
		},
		_getTimeZone$p$0: function()
		{
			return this._data$p$0.get__userTimeZone$i$0()
		}
	};
	$h.OutlookDispid=function(){};
	$h.OutlookDispid.prototype={
		owaOnlyMethod: 0,
		getInitialData: 1,
		getUserIdentityToken: 2,
		loadCustomProperties: 3,
		saveCustomProperties: 4,
		ewsRequest: 5,
		displayNewAppointmentForm: 7,
		displayMessageForm: 8,
		displayAppointmentForm: 9,
		displayReplyForm: 10,
		displayReplyAllForm: 11,
		getCallbackToken: 12,
		bodySetSelectedDataAsync: 13,
		getBodyTypeAsync: 14,
		getRecipientsAsync: 15,
		addFileAttachmentAsync: 16,
		setSubjectAsync: 17,
		getSubjectAsync: 18,
		addItemAttachmentAsync: 19,
		removeAttachmentAsync: 20,
		setRecipientsAsync: 21,
		addRecipientsAsync: 22,
		bodyPrependAsync: 23,
		getTimeAsync: 24,
		setTimeAsync: 25,
		getLocationAsync: 26,
		setLocationAsync: 27,
		getSelectedDataAsync: 28,
		setSelectedDataAsync: 29,
		displayReplyFormWithAttachments: 30,
		displayReplyAllFormWithAttachments: 31,
		saveAsync: 32,
		addNotficationMessageAsync: 33,
		getAllNotficationMessagesAsync: 34,
		replaceNotficationMessageAsync: 35,
		removeNotficationMessageAsync: 36,
		getBodyAsync: 37,
		setBodyAsync: 38,
		appCommands1: 39,
		registerConsentAsync: 40,
		close: 41,
		closeApp: 42,
		displayPersonaCardAsync: 43,
		displayNewMessageForm: 44,
		navigateToModuleAsync: 45,
		eventCompleted: 94,
		closeContainer: 97,
		messageParent: 144,
		trackCtq: 400,
		recordTrace: 401,
		recordDataPoint: 402,
		windowOpenOverrideHandler: 403,
		saveSettingsRequest: 404
	};
	$h.OutlookDispid["registerEnum"]("$h.2",false);
	$h.RequestState=function(){};
	$h.RequestState.prototype={
		unsent: 0,
		opened: 1,
		headersReceived: 2,
		loading: 3,
		done: 4
	};
	$h.RequestState["registerEnum"]("$h.3",false);
	$h.CommonParameters=function(options, callback, asyncContext)
	{
		this._options$p$0=options;
		this._callback$p$0=callback;
		this._asyncContext$p$0=asyncContext
	};
	$h.CommonParameters.parse=function(args, isCallbackRequired, tryLegacy)
	{
		var legacyParameters;
		var $$t_8,
			$$t_9;
		if(tryLegacy && ($$t_9=$h.CommonParameters._tryParseLegacy$p(args,$$t_8={val: legacyParameters}),legacyParameters=$$t_8["val"],$$t_9))
			return legacyParameters;
		var argsLength=args["length"];
		var options=null;
		var callback=null;
		var asyncContext=null;
		if(argsLength===1)
			if(Function["isInstanceOfType"](args[0]))
				callback=args[0];
			else if(Object["isInstanceOfType"](args[0]))
				options=args[0];
			else
				throw Error.argumentType();
		else if(argsLength===2)
		{
			if(!Object["isInstanceOfType"](args[0]))
				throw Error.argument("options");
			if(!Function["isInstanceOfType"](args[1]))
				throw Error.argument("callback");
			options=args[0];
			callback=args[1]
		}
		else if(argsLength)
			throw Error.parameterCount(window["_u"]["ExtensibilityStrings"]["l_ParametersNotAsExpected_Text"]);
		if(isCallbackRequired && !callback)
			throw Error.argumentNull("callback");
		if(options && !$h.ScriptHelpers.isNullOrUndefined(options["asyncContext"]))
			asyncContext=options["asyncContext"];
		return new $h.CommonParameters(options,callback,asyncContext)
	};
	$h.CommonParameters._tryParseLegacy$p=function(args, commonParameters)
	{
		commonParameters["val"]=null;
		var argsLength=args["length"];
		var callback=null;
		var userContext=null;
		if(!argsLength || argsLength > 2)
			return false;
		if(!Function["isInstanceOfType"](args[0]))
			return false;
		callback=args[0];
		if(argsLength > 1)
			userContext=args[1];
		commonParameters["val"]=new $h.CommonParameters(null,callback,userContext);
		return true
	};
	$h.CommonParameters.prototype={
		_options$p$0: null,
		_callback$p$0: null,
		_asyncContext$p$0: null,
		get_options: function()
		{
			return this._options$p$0
		},
		get_callback: function()
		{
			return this._callback$p$0
		},
		get_asyncContext: function()
		{
			return this._asyncContext$p$0
		}
	};
	$h.EwsRequest=function(userContext)
	{
		$h.EwsRequest["initializeBase"](this,[userContext])
	};
	$h.EwsRequest.prototype={
		readyState: 1,
		status: 0,
		statusText: null,
		onreadystatechange: null,
		responseText: null,
		get__statusCode$i$1: function()
		{
			return this.status
		},
		set__statusCode$i$1: function(value)
		{
			this.status=value;
			return value
		},
		get__statusDescription$i$1: function()
		{
			return this.statusText
		},
		set__statusDescription$i$1: function(value)
		{
			this.statusText=value;
			return value
		},
		get__requestState$i$1: function()
		{
			return this.readyState
		},
		set__requestState$i$1: function(value)
		{
			this.readyState=value;
			return value
		},
		get_hasOnReadyStateChangeCallback: function()
		{
			return!$h.ScriptHelpers.isNullOrUndefined(this.onreadystatechange)
		},
		get__response$i$1: function()
		{
			return this.responseText
		},
		set__response$i$1: function(value)
		{
			this.responseText=value;
			return value
		},
		send: function(data)
		{
			this._checkSendConditions$i$1();
			if($h.ScriptHelpers.isNullOrUndefined(data))
				this._throwInvalidStateException$i$1();
			this._sendRequest$i$0(5,"EwsRequest",{body: data})
		},
		_callOnReadyStateChangeCallback$i$1: function()
		{
			if(!$h.ScriptHelpers.isNullOrUndefined(this.onreadystatechange))
				this.onreadystatechange()
		},
		_parseExtraResponseData$i$1: function(response){},
		executeExtraFailedResponseSteps: function(){}
	};
	$h.InitialData=function(data)
	{
		this._data$p$0=data;
		this._permissionLevel$p$0=this._calculatePermissionLevel$p$0()
	};
	$h.InitialData._defineReadOnlyProperty$i=function(o, methodName, getter)
	{
		var propertyDescriptor={
				get: getter,
				configurable: false
			};
		window["Object"]["defineProperty"](o,methodName,propertyDescriptor)
	};
	$h.InitialData.prototype={
		_toRecipients$p$0: null,
		_ccRecipients$p$0: null,
		_attachments$p$0: null,
		_resources$p$0: null,
		_entities$p$0: null,
		_selectedEntities$p$0: null,
		_data$p$0: null,
		_permissionLevel$p$0: 0,
		get__isRestIdSupported$i$0: function()
		{
			return this._data$p$0["isRestIdSupported"]
		},
		get__itemId$i$0: function()
		{
			return this._data$p$0["id"]
		},
		get__itemClass$i$0: function()
		{
			return this._data$p$0["itemClass"]
		},
		get__dateTimeCreated$i$0: function()
		{
			return new Date(this._data$p$0["dateTimeCreated"])
		},
		get__dateTimeModified$i$0: function()
		{
			return new Date(this._data$p$0["dateTimeModified"])
		},
		get__dateTimeSent$i$0: function()
		{
			return new Date(this._data$p$0["dateTimeSent"])
		},
		get__subject$i$0: function()
		{
			this._throwOnRestrictedPermissionLevel$i$0();
			return this._data$p$0["subject"]
		},
		get__normalizedSubject$i$0: function()
		{
			this._throwOnRestrictedPermissionLevel$i$0();
			return this._data$p$0["normalizedSubject"]
		},
		get__internetMessageId$i$0: function()
		{
			return this._data$p$0["internetMessageId"]
		},
		get__conversationId$i$0: function()
		{
			return this._data$p$0["conversationId"]
		},
		get__sender$i$0: function()
		{
			this._throwOnRestrictedPermissionLevel$i$0();
			var sender=this._data$p$0["sender"];
			return $h.ScriptHelpers.isNullOrUndefined(sender) ? null : new $h.EmailAddressDetails(sender)
		},
		get__from$i$0: function()
		{
			this._throwOnRestrictedPermissionLevel$i$0();
			var from=this._data$p$0["from"];
			return $h.ScriptHelpers.isNullOrUndefined(from) ? null : new $h.EmailAddressDetails(from)
		},
		get__to$i$0: function()
		{
			this._throwOnRestrictedPermissionLevel$i$0();
			if(null===this._toRecipients$p$0)
				this._toRecipients$p$0=this._createEmailAddressDetails$p$0("to");
			return this._toRecipients$p$0
		},
		get__cc$i$0: function()
		{
			this._throwOnRestrictedPermissionLevel$i$0();
			if(null===this._ccRecipients$p$0)
				this._ccRecipients$p$0=this._createEmailAddressDetails$p$0("cc");
			return this._ccRecipients$p$0
		},
		get__attachments$i$0: function()
		{
			this._throwOnRestrictedPermissionLevel$i$0();
			if(null===this._attachments$p$0)
				this._attachments$p$0=this._createAttachmentDetails$p$0();
			return this._attachments$p$0
		},
		get__ewsUrl$i$0: function()
		{
			return this._data$p$0["ewsUrl"]
		},
		get__restUrl$i$0: function()
		{
			return this._data$p$0["restUrl"]
		},
		get__marketplaceAssetId$i$0: function()
		{
			return this._data$p$0["marketplaceAssetId"]
		},
		get__extensionId$i$0: function()
		{
			return this._data$p$0["extensionId"]
		},
		get__marketplaceContentMarket$i$0: function()
		{
			return this._data$p$0["marketplaceContentMarket"]
		},
		get__consentMetadata$i$0: function()
		{
			return this._data$p$0["consentMetadata"]
		},
		get__isRead$i$0: function()
		{
			return this._data$p$0["isRead"]
		},
		get__endNodeUrl$i$0: function()
		{
			return this._data$p$0["endNodeUrl"]
		},
		get__entryPointUrl$i$0: function()
		{
			return this._data$p$0["entryPointUrl"]
		},
		get__start$i$0: function()
		{
			return new Date(this._data$p$0["start"])
		},
		get__end$i$0: function()
		{
			return new Date(this._data$p$0["end"])
		},
		get__location$i$0: function()
		{
			return this._data$p$0["location"]
		},
		get__userProfileType$i$0: function()
		{
			return this._data$p$0["userProfileType"]
		},
		get__resources$i$0: function()
		{
			this._throwOnRestrictedPermissionLevel$i$0();
			if(null===this._resources$p$0)
				this._resources$p$0=this._createEmailAddressDetails$p$0("resources");
			return this._resources$p$0
		},
		get__organizer$i$0: function()
		{
			this._throwOnRestrictedPermissionLevel$i$0();
			var organizer=this._data$p$0["organizer"];
			return $h.ScriptHelpers.isNullOrUndefined(organizer) ? null : new $h.EmailAddressDetails(organizer)
		},
		get__userDisplayName$i$0: function()
		{
			return this._data$p$0["userDisplayName"]
		},
		get__userEmailAddress$i$0: function()
		{
			return this._data$p$0["userEmailAddress"]
		},
		get__userTimeZone$i$0: function()
		{
			return this._data$p$0["userTimeZone"]
		},
		get__timeZoneOffsets$i$0: function()
		{
			return this._data$p$0["timeZoneOffsets"]
		},
		get__hostVersion$i$0: function()
		{
			return this._data$p$0["hostVersion"]
		},
		get__owaView$i$0: function()
		{
			return this._data$p$0["owaView"]
		},
		get__overrideWindowOpen$i$0: function()
		{
			return this._data$p$0["overrideWindowOpen"]
		},
		_getEntities$i$0: function()
		{
			if(!this._entities$p$0)
				this._entities$p$0=new $h.Entities(this._data$p$0["entities"],this._data$p$0["filteredEntities"],this.get__dateTimeSent$i$0(),this._permissionLevel$p$0);
			return this._entities$p$0
		},
		_getSelectedEntities$i$0: function()
		{
			if(!this._selectedEntities$p$0)
				this._selectedEntities$p$0=new $h.Entities(this._data$p$0["selectedEntities"],null,this.get__dateTimeSent$i$0(),this._permissionLevel$p$0);
			return this._selectedEntities$p$0
		},
		_getEntitiesByType$i$0: function(entityType)
		{
			var entites=this._getEntities$i$0();
			return entites._getByType$i$0(entityType)
		},
		_getFilteredEntitiesByName$i$0: function(name)
		{
			var entities=this._getEntities$i$0();
			return entities._getFilteredEntitiesByName$i$0(name)
		},
		_getRegExMatches$i$0: function()
		{
			if(!this._data$p$0["regExMatches"])
				return null;
			return this._data$p$0["regExMatches"]
		},
		_getSelectedRegExMatches$i$0: function()
		{
			if(!this._data$p$0["selectedRegExMatches"])
				return null;
			return this._data$p$0["selectedRegExMatches"]
		},
		_getRegExMatchesByName$i$0: function(regexName)
		{
			var regexMatches=this._getRegExMatches$i$0();
			if(!regexMatches || !regexMatches[regexName])
				return null;
			return regexMatches[regexName]
		},
		_throwOnRestrictedPermissionLevel$i$0: function()
		{
			window["OSF"]["DDA"]["OutlookAppOm"]._throwOnPropertyAccessForRestrictedPermission$i(this._permissionLevel$p$0)
		},
		_createEmailAddressDetails$p$0: function(key)
		{
			var to=this._data$p$0[key];
			if($h.ScriptHelpers.isNullOrUndefined(to))
				return[];
			var recipients=[];
			for(var i=0; i < to["length"]; i++)
				if(!$h.ScriptHelpers.isNullOrUndefined(to[i]))
					recipients[i]=new $h.EmailAddressDetails(to[i]);
			return recipients
		},
		_createAttachmentDetails$p$0: function()
		{
			var attachments=this._data$p$0["attachments"];
			if($h.ScriptHelpers.isNullOrUndefined(attachments))
				return[];
			var attachmentDetails=[];
			for(var i=0; i < attachments["length"]; i++)
				if(!$h.ScriptHelpers.isNullOrUndefined(attachments[i]))
					attachmentDetails[i]=new $h.AttachmentDetails(attachments[i]);
			return attachmentDetails
		},
		_calculatePermissionLevel$p$0: function()
		{
			var HostReadItem=1;
			var HostReadWriteMailbox=2;
			var HostReadWriteItem=3;
			var permissionLevelFromHost=this._data$p$0["permissionLevel"];
			if($h.ScriptHelpers.isUndefined(this._permissionLevel$p$0))
				return 0;
			switch(permissionLevelFromHost)
			{
				case HostReadItem:
					return 1;
				case HostReadWriteItem:
					return 2;
				case HostReadWriteMailbox:
					return 3;
				default:
					return 0
			}
		}
	};
	$h._loadDictionaryRequest=function(createResultObject, dictionaryName, callback, userContext)
	{
		$h._loadDictionaryRequest["initializeBase"](this,[userContext]);
		this._createResultObject$p$1=createResultObject;
		this._dictionaryName$p$1=dictionaryName;
		this._callback$p$1=callback
	};
	$h._loadDictionaryRequest.prototype={
		_dictionaryName$p$1: null,
		_createResultObject$p$1: null,
		_callback$p$1: null,
		handleResponse: function(response)
		{
			if(response["wasSuccessful"])
			{
				var value=response[this._dictionaryName$p$1];
				var responseData=window["JSON"]["parse"](value);
				this.createAsyncResult(this._createResultObject$p$1(responseData),0,0,null)
			}
			else
				this.createAsyncResult(null,1,9020,response["errorMessage"]);
			this._callback$p$1(this._asyncResult$p$0)
		}
	};
	$h.ProxyRequestBase=function(userContext)
	{
		$h.ProxyRequestBase["initializeBase"](this,[userContext])
	};
	$h.ProxyRequestBase.prototype={
		handleResponse: function(response)
		{
			if(!response["wasProxySuccessful"])
			{
				this.set__statusCode$i$1(500);
				this.set__statusDescription$i$1("Error");
				var errorMessage=response["errorMessage"];
				this.set__response$i$1(errorMessage);
				this.createAsyncResult(null,1,9020,errorMessage)
			}
			else
			{
				this.set__statusCode$i$1(response["statusCode"]);
				this.set__statusDescription$i$1(response["statusDescription"]);
				this.set__response$i$1(response["body"]);
				this.createAsyncResult(this.get__response$i$1(),0,0,null)
			}
			this._parseExtraResponseData$i$1(response);
			this._cycleReadyStateFromHeadersReceivedToLoadingToDone$i$1()
		},
		_throwInvalidStateException$i$1: function()
		{
			throw Error.create("DOMException",{
				code: 11,
				message: "INVALID_STATE_ERR"
			});
		},
		_cycleReadyStateFromHeadersReceivedToLoadingToDone$i$1: function()
		{
			var $$t_0=this;
			this._changeReadyState$i$1(2,function()
			{
				$$t_0._changeReadyState$i$1(3,function()
				{
					$$t_0._changeReadyState$i$1(4,null)
				})
			})
		},
		_changeReadyState$i$1: function(state, nextStep)
		{
			this.set__requestState$i$1(state);
			var $$t_2=this;
			window.setTimeout(function()
			{
				try
				{
					$$t_2._callOnReadyStateChangeCallback$i$1()
				}
				finally
				{
					if(!$h.ScriptHelpers.isNullOrUndefined(nextStep))
						nextStep()
				}
			},0)
		},
		_checkSendConditions$i$1: function()
		{
			if(this.get__requestState$i$1() !==1)
				this._throwInvalidStateException$i$1();
			if(this._isSent$p$0)
				this._throwInvalidStateException$i$1()
		}
	};
	$h.RequestBase=function(userContext)
	{
		this._userContext$p$0=userContext
	};
	$h.RequestBase.prototype={
		_isSent$p$0: false,
		_asyncResult$p$0: null,
		_userContext$p$0: null,
		get_asyncResult: function()
		{
			return this._asyncResult$p$0
		},
		_sendRequest$i$0: function(dispid, methodName, dataToSend)
		{
			this._isSent$p$0=true;
			var $$t_5=this;
			window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.invokeHostMethod(dispid,dataToSend,function(resultCode, response)
			{
				if(resultCode)
					$$t_5.createAsyncResult(null,1,9017,String.format(window["_u"]["ExtensibilityStrings"]["l_InternalProtocolError_Text"],resultCode));
				else
					$$t_5.handleResponse(response)
			})
		},
		createAsyncResult: function(value, errorCode, detailedErrorCode, errorDescription)
		{
			this._asyncResult$p$0=window["OSF"]["DDA"]["OutlookAppOm"]._instance$p.createAsyncResult(value,errorCode,detailedErrorCode,this._userContext$p$0,errorDescription)
		}
	};
	$h.SaveDictionaryRequest=function(callback, userContext)
	{
		$h.SaveDictionaryRequest["initializeBase"](this,[userContext]);
		if(!$h.ScriptHelpers.isNullOrUndefined(callback))
			this._callback$p$1=callback
	};
	$h.SaveDictionaryRequest.prototype={
		_callback$p$1: null,
		handleResponse: function(response)
		{
			if(response["wasSuccessful"])
				this.createAsyncResult(null,0,0,null);
			else
				this.createAsyncResult(null,1,9020,response["errorMessage"]);
			if(!$h.ScriptHelpers.isNullOrUndefined(this._callback$p$1))
				this._callback$p$1(this._asyncResult$p$0)
		}
	};
	$h.ScriptHelpers=function(){};
	$h.ScriptHelpers.isNull=function(value)
	{
		return null===value
	};
	$h.ScriptHelpers.isNullOrUndefined=function(value)
	{
		return $h.ScriptHelpers.isNull(value) || $h.ScriptHelpers.isUndefined(value)
	};
	$h.ScriptHelpers.isUndefined=function(value)
	{
		return value===undefined
	};
	$h.ScriptHelpers.dictionaryContainsKey=function(obj, keyName)
	{
		return Object["isInstanceOfType"](obj) ? keyName in obj : false
	};
	$h.ScriptHelpers.isNonEmptyString=function(value)
	{
		if(!value)
			return false;
		return String["isInstanceOfType"](value)
	};
	$h.ScriptHelpers.deepClone=function(obj)
	{
		return window["JSON"]["parse"](window["JSON"]["stringify"](obj))
	};
	$h.ScriptHelpers.isValueTrue=function(value)
	{
		if(!$h.ScriptHelpers.isNullOrUndefined(value))
			return value["toString"]().toLowerCase()==="true";
		return false
	};
	window["OSF"]["DDA"]["OutlookAppOm"]["registerClass"]("OSF.DDA.OutlookAppOm");
	window["OSF"]["DDA"]["Settings"]["registerClass"]("OSF.DDA.Settings");
	$h.AdditionalGlobalParameters["registerClass"]("$h.4");
	$h.ItemBase["registerClass"]("$h.5");
	$h.Item["registerClass"]("$h.6",$h.ItemBase);
	$h.Appointment["registerClass"]("$h.7",$h.Item);
	$h.ComposeItem["registerClass"]("$h.8",$h.ItemBase);
	$h.AppointmentCompose["registerClass"]("$h.9",$h.ComposeItem);
	$h.AttachmentDetails["registerClass"]("$h.A");
	$h.Body["registerClass"]("$h.B");
	$h.ComposeBody["registerClass"]("$h.C",$h.Body);
	$h.ComposeRecipient["registerClass"]("$h.D");
	$h.ComposeLocation["registerClass"]("$h.E");
	$h.ComposeSubject["registerClass"]("$h.F");
	$h.ComposeTime["registerClass"]("$h.G");
	$h.Contact["registerClass"]("$h.H");
	$h.CustomProperties["registerClass"]("$h.I");
	$h.Diagnostics["registerClass"]("$h.J");
	$h.EmailAddressDetails["registerClass"]("$h.K");
	$h.Entities["registerClass"]("$h.L");
	$h.Message["registerClass"]("$h.M",$h.Item);
	$h.MeetingRequest["registerClass"]("$h.N",$h.Message);
	$h.MeetingSuggestion["registerClass"]("$h.O");
	$h._extractedDate["registerClass"]("$h.P");
	$h._preciseDate["registerClass"]("$h.Q",$h._extractedDate);
	$h._relativeDate["registerClass"]("$h.R",$h._extractedDate);
	$h.MessageCompose["registerClass"]("$h.S",$h.ComposeItem);
	$h.NotificationMessages["registerClass"]("$h.T");
	$h.PhoneNumber["registerClass"]("$h.U");
	$h.TaskSuggestion["registerClass"]("$h.V");
	$h.UserProfile["registerClass"]("$h.W");
	$h.CommonParameters["registerClass"]("$h.X");
	$h.RequestBase["registerClass"]("$h.Y");
	$h.ProxyRequestBase["registerClass"]("$h.Z",$h.RequestBase);
	$h.EwsRequest["registerClass"]("$h.a",$h.ProxyRequestBase);
	$h.InitialData["registerClass"]("$h.b");
	$h._loadDictionaryRequest["registerClass"]("$h.c",$h.RequestBase);
	$h.SaveDictionaryRequest["registerClass"]("$h.d",$h.RequestBase);
	window["OSF"]["DDA"]["OutlookAppOm"].asyncMethodTimeoutKeyName="__timeout__";
	window["OSF"]["DDA"]["OutlookAppOm"].ewsIdOrEmailParamName="ewsIdOrEmail";
	window["OSF"]["DDA"]["OutlookAppOm"].moduleParamName="module";
	window["OSF"]["DDA"]["OutlookAppOm"].queryStringParamName="queryString";
	window["OSF"]["DDA"]["OutlookAppOm"]._maxRecipients$p=100;
	window["OSF"]["DDA"]["OutlookAppOm"]._maxSubjectLength$p=255;
	window["OSF"]["DDA"]["OutlookAppOm"].maxBodyLength=32768;
	window["OSF"]["DDA"]["OutlookAppOm"]._maxLocationLength$p=255;
	window["OSF"]["DDA"]["OutlookAppOm"]._maxEwsRequestSize$p=1e6;
	window["OSF"]["DDA"]["OutlookAppOm"].executeMethodName="ExecuteMethod";
	window["OSF"]["DDA"]["OutlookAppOm"].getInitialDataMethodName="GetInitialData";
	window["OSF"]["DDA"]["OutlookAppOm"].itemIdParameterName="itemId";
	window["OSF"]["DDA"]["OutlookAppOm"].restVersionParameterName="restVersion";
	window["OSF"]["DDA"]["OutlookAppOm"]._instance$p=null;
	$h.AdditionalGlobalParameters.itemNumberKey="itemNumber";
	$h.AttachmentConstants.maxAttachmentNameLength=255;
	$h.AttachmentConstants.maxUrlLength=2048;
	$h.AttachmentConstants.maxItemIdLength=200;
	$h.AttachmentConstants.maxRemoveIdLength=200;
	$h.AttachmentConstants.attachmentParameterName="attachments";
	$h.AttachmentConstants.attachmentTypeParameterName="type";
	$h.AttachmentConstants.attachmentUrlParameterName="url";
	$h.AttachmentConstants.attachmentItemIdParameterName="itemId";
	$h.AttachmentConstants.attachmentNameParameterName="name";
	$h.AttachmentConstants.attachmentIsInlineParameterName="isInline";
	$h.AttachmentConstants.attachmentTypeFileName="file";
	$h.AttachmentConstants.attachmentTypeItemName="item";
	$h.AttachmentDetails._attachmentTypeMap$p=[window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["AttachmentType"]["File"],window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["AttachmentType"]["Item"],window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["AttachmentType"]["Cloud"]];
	$h.Body.coercionTypeParameterName="coercionType";
	$h.ComposeRecipient.displayNameLengthLimit=255;
	$h.ComposeRecipient.maxSmtpLength=571;
	$h.ComposeRecipient.recipientsLimit=100;
	$h.ComposeRecipient.totalRecipientsLimit=500;
	$h.ComposeRecipient.addressParameterName="address";
	$h.ComposeRecipient.nameParameterName="name";
	$h.ComposeLocation.locationKey="location";
	$h.ComposeLocation.maximumLocationLength=255;
	$h.ComposeSubject.maximumSubjectLength=255;
	$h.ComposeTime.timeTypeName="TimeProperty";
	$h.ComposeTime.timeDataName="time";
	$h.Diagnostics.outlookAppName="Outlook";
	$h.Diagnostics.outlookWebAppName="OutlookWebApp";
	$h.Diagnostics.outlookIOSAppName="OutlookIOS";
	$h.Diagnostics.outlookAndroidAppName="OutlookAndroid";
	$h.EmailAddressDetails._emptyString$p="";
	$h.EmailAddressDetails._responseTypeMap$p=[window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ResponseType"]["None"],window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ResponseType"]["Organizer"],window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ResponseType"]["Tentative"],window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ResponseType"]["Accepted"],window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["ResponseType"]["Declined"]];
	$h.EmailAddressDetails._recipientTypeMap$p=[window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["RecipientType"]["Other"],window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["RecipientType"]["DistributionList"],window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["RecipientType"]["User"],window["Microsoft"]["Office"]["WebExtension"]["MailboxEnums"]["RecipientType"]["ExternalUser"]];
	$h.Entities._allEntityKeys$p=["Addresses","EmailAddresses","Urls","PhoneNumbers","TaskSuggestions","MeetingSuggestions","Contacts","FlightReservations","ParcelDeliveries"];
	$h.ReplyConstants.htmlBodyKeyName="htmlBody";
	$h.AsyncConstants.optionsKeyName="options";
	$h.AsyncConstants.callbackKeyName="callback";
	$h.AsyncConstants.asyncResultKeyName="asyncResult";
	$h.MeetingSuggestionTimeDecoder._baseDate$p=new Date("0001-01-01T00:00:00Z");
	$h.NotificationMessages.maximumKeyLength=32;
	$h.NotificationMessages.maximumIconLength=32;
	$h.NotificationMessages.maximumMessageLength=150;
	$h.NotificationMessages.notificationsKeyParameterName="key";
	$h.NotificationMessages.notificationsTypeParameterName="type";
	$h.NotificationMessages.notificationsIconParameterName="icon";
	$h.NotificationMessages.notificationsMessageParameterName="message";
	$h.NotificationMessages.notificationsPersistentParameterName="persistent";
	$h.OutlookErrorManager.errorNameKey="name";
	$h.OutlookErrorManager.errorMessageKey="message";
	$h.OutlookErrorManager._isInitialized$p=false;
	$h.OutlookErrorManager.OutlookErrorCodes.attachmentSizeExceeded=9e3;
	$h.OutlookErrorManager.OutlookErrorCodes.numberOfAttachmentsExceeded=9001;
	$h.OutlookErrorManager.OutlookErrorCodes.internalFormatError=9002;
	$h.OutlookErrorManager.OutlookErrorCodes.invalidAttachmentId=9003;
	$h.OutlookErrorManager.OutlookErrorCodes.invalidAttachmentPath=9004;
	$h.OutlookErrorManager.OutlookErrorCodes.cannotAddAttachmentBeforeUpgrade=9005;
	$h.OutlookErrorManager.OutlookErrorCodes.attachmentDeletedBeforeUploadCompletes=9006;
	$h.OutlookErrorManager.OutlookErrorCodes.attachmentUploadGeneralFailure=9007;
	$h.OutlookErrorManager.OutlookErrorCodes.attachmentToDeleteDoesNotExist=9008;
	$h.OutlookErrorManager.OutlookErrorCodes.attachmentDeleteGeneralFailure=9009;
	$h.OutlookErrorManager.OutlookErrorCodes.invalidEndTime=9010;
	$h.OutlookErrorManager.OutlookErrorCodes.htmlSanitizationFailure=9011;
	$h.OutlookErrorManager.OutlookErrorCodes.numberOfRecipientsExceeded=9012;
	$h.OutlookErrorManager.OutlookErrorCodes.noValidRecipientsProvided=9013;
	$h.OutlookErrorManager.OutlookErrorCodes.cursorPositionChanged=9014;
	$h.OutlookErrorManager.OutlookErrorCodes.invalidSelection=9016;
	$h.OutlookErrorManager.OutlookErrorCodes.accessRestricted=9017;
	$h.OutlookErrorManager.OutlookErrorCodes.genericTokenError=9018;
	$h.OutlookErrorManager.OutlookErrorCodes.genericSettingsError=9019;
	$h.OutlookErrorManager.OutlookErrorCodes.genericResponseError=9020;
	$h.OutlookErrorManager.OutlookErrorCodes.saveError=9021;
	$h.OutlookErrorManager.OutlookErrorCodes.messageInDifferentStoreError=9022;
	$h.OutlookErrorManager.OutlookErrorCodes.duplicateNotificationKey=9023;
	$h.OutlookErrorManager.OutlookErrorCodes.notificationKeyNotFound=9024;
	$h.OutlookErrorManager.OutlookErrorCodes.numberOfNotificationsExceeded=9025;
	$h.OutlookErrorManager.OutlookErrorCodes.persistedNotificationArrayReadError=9026;
	$h.OutlookErrorManager.OutlookErrorCodes.persistedNotificationArraySaveError=9027;
	$h.OutlookErrorManager.OutlookErrorCodes.cannotPersistPropertyInUnsavedDraftError=9028;
	$h.OutlookErrorManager.OutlookErrorCodes.callSaveAsyncBeforeToken=9029;
	$h.OutlookErrorManager.OutlookErrorCodes.ooeInvalidDataFormat=2006;
	$h.OutlookErrorManager.OsfDdaErrorCodes.ooeCoercionTypeNotSupported=1e3;
	$h.CommonParameters.asyncContextKeyName="asyncContext";
	$h.InitialData.userProfileTypeKey="userProfileType";
	$h.ScriptHelpers.emptyString="";
	OSF.DDA.ErrorCodeManager.initializeErrorMessages(Strings.OfficeOM);
	if(appContext.get_appName()==OSF.AppName.OutlookWebApp || appContext.get_appName()==OSF.AppName.OutlookIOS || appContext.get_appName()==OSF.AppName.OutlookAndroid)
		this._settings=this._initializeSettings(appContext,false);
	else
		this._settings=this._initializeSettings(false);
	appContext.appOM=new OSF.DDA.OutlookAppOm(appContext,this._webAppState.wnd,appReady);
	if(appContext.get_appName()==OSF.AppName.Outlook || appContext.get_appName()==OSF.AppName.OutlookWebApp)
		OSF.DDA.DispIdHost.addEventSupport(appContext.appOM,new OSF.EventDispatch([Microsoft.Office.WebExtension.EventType.OlkItemSelectedChanged]))
}


