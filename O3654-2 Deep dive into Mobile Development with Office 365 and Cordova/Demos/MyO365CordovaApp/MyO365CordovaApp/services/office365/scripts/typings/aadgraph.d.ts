declare module AadGraph.Extensions {
    interface Observable {
        changed: boolean;
        addChangedListener(eventFn: (changed: any) => void): any;
        removeChangedListener(eventFn: (changed: any) => void): any;
    }
    class ObservableBase<T> implements Observable {
        private _changed;
        private _changedListeners;
        constructor();
        public changed : boolean;
        public addChangedListener(eventFn: (changed: T) => void): void;
        public removeChangedListener(eventFn: (changed: T) => void): void;
    }
    class ObservableCollection<T extends Observable> extends ObservableBase<ObservableCollection<T>> {
        private _array;
        private _changedListener;
        constructor(...items: T[]);
        public item(n: number): T;
        /**
        * Removes the last element from an array and returns it.
        */
        public pop(): T;
        /**
        * Removes the first element from an array and returns it.
        */
        public shift(): T;
        /**
        * Appends new elements to an array, and returns the new length of the array.
        * @param items New elements of the Array.
        */
        public push(...items: T[]): number;
        /**
        * Removes elements from an array, returning the deleted elements.
        * @param start The zero-based location in the array from which to start removing elements.
        * @param deleteCount The number of elements to remove.
        * @param items Elements to insert into the array in place of the deleted elements.
        */
        public splice(start: number, deleteCount: number): T[];
        /**
        * Inserts new elements at the start of an array.
        * @param items  Elements to insert at the start of the Array.
        */
        public unshift(...items: T[]): number;
        /**
        * Performs the specified action for each element in an array.
        * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
        * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
        */
        public forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
        /**
        * Calls a defined callback function on each element of an array, and returns an array that contains the results.
        * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
        * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
        */
        public map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
        /**
        * Returns the elements of an array that meet the condition specified in a callback function.
        * @param callbackfn A function that accepts up to three arguments. The filter method calls the callbackfn function one time for each element in the array.
        * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
        */
        public filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[];
        /**
        * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
        * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
        * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
        */
        public reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        /**
        * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
        * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
        * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
        */
        public reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        /**
        * Gets or sets the length of the array. This is a number one higher than the highest element defined in an array.
        */
        public length : number;
    }
    class Request {
        public requestUri: string;
        public headers: {
            [name: string]: string;
        };
        public method: string;
        public data: any;
        public disableCache: boolean;
        constructor(requestUri: string);
    }
    class DataContext {
        private _getAccessTokenFn;
        private _extraQueryParameters;
        private _serviceRootUri;
        private _noCache;
        private _disableCache;
        private _disableCacheOverride;
        constructor(serviceRootUri: string, extraQueryParameters?: string, getAccessTokenFn?: () => Microsoft.Utility.IPromise<string>);
        public serviceRootUri : string;
        public extraQueryParameters : string;
        public disableCache : boolean;
        public disableCacheOverride : boolean;
        private ajax(request);
        public read(path: string): Microsoft.Utility.IPromise<string>;
        public readUrl(url: string): Microsoft.Utility.IPromise<string>;
        public request(request: Request): Microsoft.Utility.IPromise<string>;
        private augmentRequest(request);
    }
    class PagedCollection<T> {
        private _path;
        private _context;
        private _resultFn;
        private _data;
        constructor(context: DataContext, path: string, resultFn: (dataContext: DataContext, data: any) => T[], data?: T[]);
        public path : string;
        public context : DataContext;
        public currentPage : T[];
        public getNextPage(): Microsoft.Utility.IPromise<PagedCollection<T>>;
    }
    class CollectionQuery<T> {
        private _path;
        private _context;
        private _resultFn;
        private _query;
        constructor(context: DataContext, path: string, resultFn: (dataContext: DataContext, data: any) => T[]);
        public path : string;
        public context : DataContext;
        public filter(filter: string): CollectionQuery<T>;
        public select(selection: any): CollectionQuery<T>;
        public expand(expand: any): CollectionQuery<T>;
        public orderBy(orderBy: any): CollectionQuery<T>;
        public top(top: number): CollectionQuery<T>;
        public skip(skip: number): CollectionQuery<T>;
        public addQuery(query: string): CollectionQuery<T>;
        public query : string;
        public fetch(): Microsoft.Utility.IPromise<PagedCollection<T>>;
        public fetchAll(maxItems: number): Microsoft.Utility.IPromise<T[]>;
    }
    class QueryableSet<T> {
        private _context;
        private _entity;
        private _path;
        constructor(context: DataContext, path: string, entity?: any);
        public context : DataContext;
        public entity : any;
        public path : string;
        public getPath(prop: string): string;
    }
    class RestShallowObjectFetcher {
        private _context;
        private _path;
        constructor(context: DataContext, path: string);
        public context : DataContext;
        public path : string;
        public getPath(prop: string): string;
    }
    class ComplexTypeBase extends ObservableBase<ComplexTypeBase> {
        constructor();
    }
    class EntityBase extends ObservableBase<EntityBase> {
        private _context;
        private _path;
        constructor(context?: DataContext, path?: string);
        public context : DataContext;
        public path : string;
        public getPath(prop: string): string;
    }
    function isUndefined(v: any): boolean;
}
declare module AadGraph {
    class Client {
        private _context;
        public context : Extensions.DataContext;
        private getPath(prop);
        constructor(serviceRootUri: string, getAccessTokenFn: () => Microsoft.Utility.IPromise<string>);
        public applicationRefs : ApplicationRefs;
        private _applicationRefs;
        public directoryObjects : DirectoryObjects;
        private _directoryObjects;
        public enabledFeatures : EnabledFeatures;
        private _enabledFeatures;
        public loginTenantBranding : LoginTenantBrandings;
        private _loginTenantBranding;
        public impersonationAccessGrants : ImpersonationAccessGrants;
        private _impersonationAccessGrants;
        public subscribedSkus : SubscribedSkus;
        private _subscribedSkus;
        public softDeletedDirectoryObjects : DirectoryObjects;
        private _softDeletedDirectoryObjects;
        public activateService(serviceTypeName: string): Microsoft.Utility.IPromise<boolean>;
        public isMemberOf(groupId: string, memberId: string): Microsoft.Utility.IPromise<boolean>;
        public consentToApp(clientAppId: string, onBehalfOfAll: boolean, tags: string[], checkOnly: boolean): Microsoft.Utility.IPromise<void>;
        public revokeUserConsentToApp(clientAppId: string): Microsoft.Utility.IPromise<void>;
    }
    class DirectoryObjectFetcher extends Extensions.RestShallowObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public createdOnBehalfOf : DirectoryObjectFetcher;
        public update_createdOnBehalfOf(value: DirectoryObject): Microsoft.Utility.IPromise<void>;
        private _createdOnBehalfOf;
        public createdObjects : DirectoryObjects;
        private _createdObjects;
        public manager : DirectoryObjectFetcher;
        public update_manager(value: DirectoryObject): Microsoft.Utility.IPromise<void>;
        private _manager;
        public directReports : DirectoryObjects;
        private _directReports;
        public members : DirectoryObjects;
        private _members;
        public memberOf : DirectoryObjects;
        private _memberOf;
        public owners : DirectoryObjects;
        private _owners;
        public ownedObjects : DirectoryObjects;
        private _ownedObjects;
        public fetch(): Microsoft.Utility.IPromise<DirectoryObject>;
        public checkMemberGroups(groupIds: string[]): Microsoft.Utility.IPromise<string[]>;
        public getMemberGroups(securityEnabledOnly: boolean): Microsoft.Utility.IPromise<string[]>;
    }
    interface IDirectoryObjects {
        value: IDirectoryObject[];
    }
    interface IDirectoryObject {
        objectType: string;
        objectId: string;
        softDeletionTimestamp: string;
    }
    class DirectoryObject extends Extensions.EntityBase {
        constructor(context?: Extensions.DataContext, path?: string, data?: IDirectoryObject);
        public _odataType: string;
        public objectType : string;
        private _objectType;
        public objectTypeChanged : boolean;
        private _objectTypeChanged;
        public objectId : string;
        private _objectId;
        public objectIdChanged : boolean;
        private _objectIdChanged;
        public softDeletionTimestamp : Date;
        private _softDeletionTimestamp;
        public softDeletionTimestampChanged : boolean;
        private _softDeletionTimestampChanged;
        public createdOnBehalfOf : DirectoryObjectFetcher;
        public update_createdOnBehalfOf(value: DirectoryObject): Microsoft.Utility.IPromise<void>;
        private _createdOnBehalfOf;
        public createdObjects : DirectoryObjects;
        private _createdObjects;
        public manager : DirectoryObjectFetcher;
        public update_manager(value: DirectoryObject): Microsoft.Utility.IPromise<void>;
        private _manager;
        public directReports : DirectoryObjects;
        private _directReports;
        public members : DirectoryObjects;
        private _members;
        public memberOf : DirectoryObjects;
        private _memberOf;
        public owners : DirectoryObjects;
        private _owners;
        public ownedObjects : DirectoryObjects;
        private _ownedObjects;
        public checkMemberGroups(groupIds: string[]): Microsoft.Utility.IPromise<string[]>;
        public getMemberGroups(securityEnabledOnly: boolean): Microsoft.Utility.IPromise<string[]>;
        public update(): Microsoft.Utility.IPromise<DirectoryObject>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseDirectoryObject(context: Extensions.DataContext, path: string, data: IDirectoryObject): DirectoryObject;
        static parseDirectoryObjects(context: Extensions.DataContext, pathFn: (data: IDirectoryObject) => string, data: IDirectoryObject[]): DirectoryObject[];
        public getRequestBody(): IDirectoryObject;
    }
    class ApplicationFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public notifications : Notifications;
        private _notifications;
        public fetch(): Microsoft.Utility.IPromise<Application>;
        public restore(identifierUris: string[]): Microsoft.Utility.IPromise<Application>;
    }
    interface IApplications {
        value: IApplication[];
    }
    interface IApplication extends IDirectoryObject {
        appId: string;
        appMetadata: IAppMetadata;
        appPermissions: IAppPermission[];
        availableToOtherTenants: boolean;
        displayName: string;
        errorUrl: string;
        homepage: string;
        identifierUris: string[];
        keyCredentials: IKeyCredential[];
        mainLogo: string;
        logoutUrl: string;
        passwordCredentials: IPasswordCredential[];
        publicClient: boolean;
        replyUrls: string[];
        requiredResourceAccess: IRequiredResourceAccess[];
        resourceApplicationSet: string;
        samlMetadataUrl: string;
        webApi: boolean;
        webApp: boolean;
    }
    class Application extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IApplication);
        public _odataType: string;
        public appId : string;
        private _appId;
        public appIdChanged : boolean;
        private _appIdChanged;
        public appMetadata : AppMetadata;
        private _appMetadata;
        public appMetadataChanged : boolean;
        private _appMetadataChanged;
        private _appMetadataChangedListener;
        public appPermissions : Extensions.ObservableCollection<AppPermission>;
        private _appPermissions;
        public appPermissionsChanged : boolean;
        private _appPermissionsChanged;
        private _appPermissionsChangedListener;
        public availableToOtherTenants : boolean;
        private _availableToOtherTenants;
        public availableToOtherTenantsChanged : boolean;
        private _availableToOtherTenantsChanged;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        public errorUrl : string;
        private _errorUrl;
        public errorUrlChanged : boolean;
        private _errorUrlChanged;
        public homepage : string;
        private _homepage;
        public homepageChanged : boolean;
        private _homepageChanged;
        public identifierUris : string[];
        private _identifierUris;
        public identifierUrisChanged : boolean;
        private _identifierUrisChanged;
        public keyCredentials : Extensions.ObservableCollection<KeyCredential>;
        private _keyCredentials;
        public keyCredentialsChanged : boolean;
        private _keyCredentialsChanged;
        private _keyCredentialsChangedListener;
        public mainLogo : string;
        private _mainLogo;
        public mainLogoChanged : boolean;
        private _mainLogoChanged;
        public logoutUrl : string;
        private _logoutUrl;
        public logoutUrlChanged : boolean;
        private _logoutUrlChanged;
        public passwordCredentials : Extensions.ObservableCollection<PasswordCredential>;
        private _passwordCredentials;
        public passwordCredentialsChanged : boolean;
        private _passwordCredentialsChanged;
        private _passwordCredentialsChangedListener;
        public publicClient : boolean;
        private _publicClient;
        public publicClientChanged : boolean;
        private _publicClientChanged;
        public replyUrls : string[];
        private _replyUrls;
        public replyUrlsChanged : boolean;
        private _replyUrlsChanged;
        public requiredResourceAccess : Extensions.ObservableCollection<RequiredResourceAccess>;
        private _requiredResourceAccess;
        public requiredResourceAccessChanged : boolean;
        private _requiredResourceAccessChanged;
        private _requiredResourceAccessChangedListener;
        public resourceApplicationSet : string;
        private _resourceApplicationSet;
        public resourceApplicationSetChanged : boolean;
        private _resourceApplicationSetChanged;
        public samlMetadataUrl : string;
        private _samlMetadataUrl;
        public samlMetadataUrlChanged : boolean;
        private _samlMetadataUrlChanged;
        public webApi : boolean;
        private _webApi;
        public webApiChanged : boolean;
        private _webApiChanged;
        public webApp : boolean;
        private _webApp;
        public webAppChanged : boolean;
        private _webAppChanged;
        public notifications : Notifications;
        private _notifications;
        public restore(identifierUris: string[]): Microsoft.Utility.IPromise<Application>;
        public update(): Microsoft.Utility.IPromise<Application>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseApplication(context: Extensions.DataContext, path: string, data: IApplication): Application;
        static parseApplications(context: Extensions.DataContext, pathFn: (data: IApplication) => string, data: IApplication[]): Application[];
        public getRequestBody(): IApplication;
    }
    class UserFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public impersonationAccessGrants : ImpersonationAccessGrants;
        private _impersonationAccessGrants;
        public registeredDevices : DirectoryObjects;
        private _registeredDevices;
        public ownedDevices : DirectoryObjects;
        private _ownedDevices;
        public directAccessGrants : DirectAccessGrants;
        private _directAccessGrants;
        public pendingMemberOf : DirectoryObjects;
        private _pendingMemberOf;
        public fetch(): Microsoft.Utility.IPromise<User>;
        public assignLicense(addLicenses: AssignedLicense[], removeLicenses: string[]): Microsoft.Utility.IPromise<User>;
    }
    interface IUsers {
        value: IUser[];
    }
    interface IUser extends IDirectoryObject {
        accountEnabled: boolean;
        alternativeSecurityIds: IAlternativeSecurityId[];
        appMetadata: IAppMetadata;
        assignedLicenses: IAssignedLicense[];
        assignedPlans: IAssignedPlan[];
        city: string;
        country: string;
        department: string;
        dirSyncEnabled: boolean;
        displayName: string;
        extensionAttribute1: string;
        extensionAttribute2: string;
        extensionAttribute3: string;
        extensionAttribute4: string;
        extensionAttribute5: string;
        facsimileTelephoneNumber: string;
        givenName: string;
        immutableId: string;
        jobTitle: string;
        lastDirSyncTime: string;
        mail: string;
        mailNickname: string;
        mobile: string;
        netId: string;
        otherMails: string[];
        passwordPolicies: string;
        passwordProfile: IPasswordProfile;
        physicalDeliveryOfficeName: string;
        postalCode: string;
        preferredLanguage: string;
        primarySMTPAddress: string;
        provisionedPlans: IProvisionedPlan[];
        provisioningErrors: IProvisioningError[];
        proxyAddresses: string[];
        sipProxyAddress: string;
        smtpAddresses: string[];
        state: string;
        streetAddress: string;
        surname: string;
        telephoneNumber: string;
        thumbnailPhoto: string;
        usageLocation: string;
        userPrincipalName: string;
        userType: string;
    }
    class User extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IUser);
        public _odataType: string;
        public accountEnabled : boolean;
        private _accountEnabled;
        public accountEnabledChanged : boolean;
        private _accountEnabledChanged;
        public alternativeSecurityIds : Extensions.ObservableCollection<AlternativeSecurityId>;
        private _alternativeSecurityIds;
        public alternativeSecurityIdsChanged : boolean;
        private _alternativeSecurityIdsChanged;
        private _alternativeSecurityIdsChangedListener;
        public appMetadata : AppMetadata;
        private _appMetadata;
        public appMetadataChanged : boolean;
        private _appMetadataChanged;
        private _appMetadataChangedListener;
        public assignedLicenses : Extensions.ObservableCollection<AssignedLicense>;
        private _assignedLicenses;
        public assignedLicensesChanged : boolean;
        private _assignedLicensesChanged;
        private _assignedLicensesChangedListener;
        public assignedPlans : Extensions.ObservableCollection<AssignedPlan>;
        private _assignedPlans;
        public assignedPlansChanged : boolean;
        private _assignedPlansChanged;
        private _assignedPlansChangedListener;
        public city : string;
        private _city;
        public cityChanged : boolean;
        private _cityChanged;
        public country : string;
        private _country;
        public countryChanged : boolean;
        private _countryChanged;
        public department : string;
        private _department;
        public departmentChanged : boolean;
        private _departmentChanged;
        public dirSyncEnabled : boolean;
        private _dirSyncEnabled;
        public dirSyncEnabledChanged : boolean;
        private _dirSyncEnabledChanged;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        public extensionAttribute1 : string;
        private _extensionAttribute1;
        public extensionAttribute1Changed : boolean;
        private _extensionAttribute1Changed;
        public extensionAttribute2 : string;
        private _extensionAttribute2;
        public extensionAttribute2Changed : boolean;
        private _extensionAttribute2Changed;
        public extensionAttribute3 : string;
        private _extensionAttribute3;
        public extensionAttribute3Changed : boolean;
        private _extensionAttribute3Changed;
        public extensionAttribute4 : string;
        private _extensionAttribute4;
        public extensionAttribute4Changed : boolean;
        private _extensionAttribute4Changed;
        public extensionAttribute5 : string;
        private _extensionAttribute5;
        public extensionAttribute5Changed : boolean;
        private _extensionAttribute5Changed;
        public facsimileTelephoneNumber : string;
        private _facsimileTelephoneNumber;
        public facsimileTelephoneNumberChanged : boolean;
        private _facsimileTelephoneNumberChanged;
        public givenName : string;
        private _givenName;
        public givenNameChanged : boolean;
        private _givenNameChanged;
        public immutableId : string;
        private _immutableId;
        public immutableIdChanged : boolean;
        private _immutableIdChanged;
        public jobTitle : string;
        private _jobTitle;
        public jobTitleChanged : boolean;
        private _jobTitleChanged;
        public lastDirSyncTime : Date;
        private _lastDirSyncTime;
        public lastDirSyncTimeChanged : boolean;
        private _lastDirSyncTimeChanged;
        public mail : string;
        private _mail;
        public mailChanged : boolean;
        private _mailChanged;
        public mailNickname : string;
        private _mailNickname;
        public mailNicknameChanged : boolean;
        private _mailNicknameChanged;
        public mobile : string;
        private _mobile;
        public mobileChanged : boolean;
        private _mobileChanged;
        public netId : string;
        private _netId;
        public netIdChanged : boolean;
        private _netIdChanged;
        public otherMails : string[];
        private _otherMails;
        public otherMailsChanged : boolean;
        private _otherMailsChanged;
        public passwordPolicies : string;
        private _passwordPolicies;
        public passwordPoliciesChanged : boolean;
        private _passwordPoliciesChanged;
        public passwordProfile : PasswordProfile;
        private _passwordProfile;
        public passwordProfileChanged : boolean;
        private _passwordProfileChanged;
        private _passwordProfileChangedListener;
        public physicalDeliveryOfficeName : string;
        private _physicalDeliveryOfficeName;
        public physicalDeliveryOfficeNameChanged : boolean;
        private _physicalDeliveryOfficeNameChanged;
        public postalCode : string;
        private _postalCode;
        public postalCodeChanged : boolean;
        private _postalCodeChanged;
        public preferredLanguage : string;
        private _preferredLanguage;
        public preferredLanguageChanged : boolean;
        private _preferredLanguageChanged;
        public primarySMTPAddress : string;
        private _primarySMTPAddress;
        public primarySMTPAddressChanged : boolean;
        private _primarySMTPAddressChanged;
        public provisionedPlans : Extensions.ObservableCollection<ProvisionedPlan>;
        private _provisionedPlans;
        public provisionedPlansChanged : boolean;
        private _provisionedPlansChanged;
        private _provisionedPlansChangedListener;
        public provisioningErrors : Extensions.ObservableCollection<ProvisioningError>;
        private _provisioningErrors;
        public provisioningErrorsChanged : boolean;
        private _provisioningErrorsChanged;
        private _provisioningErrorsChangedListener;
        public proxyAddresses : string[];
        private _proxyAddresses;
        public proxyAddressesChanged : boolean;
        private _proxyAddressesChanged;
        public sipProxyAddress : string;
        private _sipProxyAddress;
        public sipProxyAddressChanged : boolean;
        private _sipProxyAddressChanged;
        public smtpAddresses : string[];
        private _smtpAddresses;
        public smtpAddressesChanged : boolean;
        private _smtpAddressesChanged;
        public state : string;
        private _state;
        public stateChanged : boolean;
        private _stateChanged;
        public streetAddress : string;
        private _streetAddress;
        public streetAddressChanged : boolean;
        private _streetAddressChanged;
        public surname : string;
        private _surname;
        public surnameChanged : boolean;
        private _surnameChanged;
        public telephoneNumber : string;
        private _telephoneNumber;
        public telephoneNumberChanged : boolean;
        private _telephoneNumberChanged;
        public thumbnailPhoto : string;
        private _thumbnailPhoto;
        public thumbnailPhotoChanged : boolean;
        private _thumbnailPhotoChanged;
        public usageLocation : string;
        private _usageLocation;
        public usageLocationChanged : boolean;
        private _usageLocationChanged;
        public userPrincipalName : string;
        private _userPrincipalName;
        public userPrincipalNameChanged : boolean;
        private _userPrincipalNameChanged;
        public userType : string;
        private _userType;
        public userTypeChanged : boolean;
        private _userTypeChanged;
        public impersonationAccessGrants : ImpersonationAccessGrants;
        private _impersonationAccessGrants;
        public registeredDevices : DirectoryObjects;
        private _registeredDevices;
        public ownedDevices : DirectoryObjects;
        private _ownedDevices;
        public directAccessGrants : DirectAccessGrants;
        private _directAccessGrants;
        public pendingMemberOf : DirectoryObjects;
        private _pendingMemberOf;
        public assignLicense(addLicenses: AssignedLicense[], removeLicenses: string[]): Microsoft.Utility.IPromise<User>;
        public update(): Microsoft.Utility.IPromise<User>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseUser(context: Extensions.DataContext, path: string, data: IUser): User;
        static parseUsers(context: Extensions.DataContext, pathFn: (data: IUser) => string, data: IUser[]): User[];
        public getRequestBody(): IUser;
    }
    interface IAssignedLicenses {
        value: IAssignedLicense[];
    }
    interface IAssignedLicense {
        disabledPlans: string[];
        skuId: string;
    }
    class AssignedLicense extends Extensions.ComplexTypeBase {
        constructor(data?: IAssignedLicense);
        public _odataType: string;
        public disabledPlans : string[];
        private _disabledPlans;
        public disabledPlansChanged : boolean;
        private _disabledPlansChanged;
        public skuId : string;
        private _skuId;
        public skuIdChanged : boolean;
        private _skuIdChanged;
        static parseAssignedLicense(data: IAssignedLicense): AssignedLicense;
        static parseAssignedLicenses(data: IAssignedLicense[]): Extensions.ObservableCollection<AssignedLicense>;
        public getRequestBody(): IAssignedLicense;
    }
    class ApplicationRefFetcher extends Extensions.RestShallowObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<ApplicationRef>;
    }
    interface IApplicationRefs {
        value: IApplicationRef[];
    }
    interface IApplicationRef {
        appId: string;
        appPermissions: IAppPermission[];
        availableToOtherTenants: boolean;
        displayName: string;
        errorUrl: string;
        homepage: string;
        identifierUris: string[];
        mainLogo: string;
        logoutUrl: string;
        publisherName: string;
        publicClient: boolean;
        replyUrls: string[];
        requiredResourceAccess: IRequiredResourceAccess[];
        resourceApplicationSet: string;
        samlMetadataUrl: string;
        webApi: boolean;
        webApp: boolean;
    }
    class ApplicationRef extends Extensions.EntityBase {
        constructor(context?: Extensions.DataContext, path?: string, data?: IApplicationRef);
        public _odataType: string;
        public appId : string;
        private _appId;
        public appIdChanged : boolean;
        private _appIdChanged;
        public appPermissions : Extensions.ObservableCollection<AppPermission>;
        private _appPermissions;
        public appPermissionsChanged : boolean;
        private _appPermissionsChanged;
        private _appPermissionsChangedListener;
        public availableToOtherTenants : boolean;
        private _availableToOtherTenants;
        public availableToOtherTenantsChanged : boolean;
        private _availableToOtherTenantsChanged;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        public errorUrl : string;
        private _errorUrl;
        public errorUrlChanged : boolean;
        private _errorUrlChanged;
        public homepage : string;
        private _homepage;
        public homepageChanged : boolean;
        private _homepageChanged;
        public identifierUris : string[];
        private _identifierUris;
        public identifierUrisChanged : boolean;
        private _identifierUrisChanged;
        public mainLogo : string;
        private _mainLogo;
        public mainLogoChanged : boolean;
        private _mainLogoChanged;
        public logoutUrl : string;
        private _logoutUrl;
        public logoutUrlChanged : boolean;
        private _logoutUrlChanged;
        public publisherName : string;
        private _publisherName;
        public publisherNameChanged : boolean;
        private _publisherNameChanged;
        public publicClient : boolean;
        private _publicClient;
        public publicClientChanged : boolean;
        private _publicClientChanged;
        public replyUrls : string[];
        private _replyUrls;
        public replyUrlsChanged : boolean;
        private _replyUrlsChanged;
        public requiredResourceAccess : Extensions.ObservableCollection<RequiredResourceAccess>;
        private _requiredResourceAccess;
        public requiredResourceAccessChanged : boolean;
        private _requiredResourceAccessChanged;
        private _requiredResourceAccessChangedListener;
        public resourceApplicationSet : string;
        private _resourceApplicationSet;
        public resourceApplicationSetChanged : boolean;
        private _resourceApplicationSetChanged;
        public samlMetadataUrl : string;
        private _samlMetadataUrl;
        public samlMetadataUrlChanged : boolean;
        private _samlMetadataUrlChanged;
        public webApi : boolean;
        private _webApi;
        public webApiChanged : boolean;
        private _webApiChanged;
        public webApp : boolean;
        private _webApp;
        public webAppChanged : boolean;
        private _webAppChanged;
        public update(): Microsoft.Utility.IPromise<ApplicationRef>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseApplicationRef(context: Extensions.DataContext, path: string, data: IApplicationRef): ApplicationRef;
        static parseApplicationRefs(context: Extensions.DataContext, pathFn: (data: IApplicationRef) => string, data: IApplicationRef[]): ApplicationRef[];
        public getRequestBody(): IApplicationRef;
    }
    interface IAppPermissions {
        value: IAppPermission[];
    }
    interface IAppPermission {
        claimValue: string;
        description: string;
        directAccessGrantTypes: string[];
        displayName: string;
        impersonationAccessGrantTypes: IImpersonationAccessGrantType[];
        isDisabled: boolean;
        origin: string;
        permissionId: string;
        resourceScopeType: string;
        userConsentDescription: string;
        userConsentDisplayName: string;
    }
    class AppPermission extends Extensions.ComplexTypeBase {
        constructor(data?: IAppPermission);
        public _odataType: string;
        public claimValue : string;
        private _claimValue;
        public claimValueChanged : boolean;
        private _claimValueChanged;
        public description : string;
        private _description;
        public descriptionChanged : boolean;
        private _descriptionChanged;
        public directAccessGrantTypes : string[];
        private _directAccessGrantTypes;
        public directAccessGrantTypesChanged : boolean;
        private _directAccessGrantTypesChanged;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        public impersonationAccessGrantTypes : Extensions.ObservableCollection<ImpersonationAccessGrantType>;
        private _impersonationAccessGrantTypes;
        public impersonationAccessGrantTypesChanged : boolean;
        private _impersonationAccessGrantTypesChanged;
        private _impersonationAccessGrantTypesChangedListener;
        public isDisabled : boolean;
        private _isDisabled;
        public isDisabledChanged : boolean;
        private _isDisabledChanged;
        public origin : string;
        private _origin;
        public originChanged : boolean;
        private _originChanged;
        public permissionId : string;
        private _permissionId;
        public permissionIdChanged : boolean;
        private _permissionIdChanged;
        public resourceScopeType : string;
        private _resourceScopeType;
        public resourceScopeTypeChanged : boolean;
        private _resourceScopeTypeChanged;
        public userConsentDescription : string;
        private _userConsentDescription;
        public userConsentDescriptionChanged : boolean;
        private _userConsentDescriptionChanged;
        public userConsentDisplayName : string;
        private _userConsentDisplayName;
        public userConsentDisplayNameChanged : boolean;
        private _userConsentDisplayNameChanged;
        static parseAppPermission(data: IAppPermission): AppPermission;
        static parseAppPermissions(data: IAppPermission[]): Extensions.ObservableCollection<AppPermission>;
        public getRequestBody(): IAppPermission;
    }
    interface IImpersonationAccessGrantTypes {
        value: IImpersonationAccessGrantType[];
    }
    interface IImpersonationAccessGrantType {
        impersonated: string;
        impersonator: string;
    }
    class ImpersonationAccessGrantType extends Extensions.ComplexTypeBase {
        constructor(data?: IImpersonationAccessGrantType);
        public _odataType: string;
        public impersonated : string;
        private _impersonated;
        public impersonatedChanged : boolean;
        private _impersonatedChanged;
        public impersonator : string;
        private _impersonator;
        public impersonatorChanged : boolean;
        private _impersonatorChanged;
        static parseImpersonationAccessGrantType(data: IImpersonationAccessGrantType): ImpersonationAccessGrantType;
        static parseImpersonationAccessGrantTypes(data: IImpersonationAccessGrantType[]): Extensions.ObservableCollection<ImpersonationAccessGrantType>;
        public getRequestBody(): IImpersonationAccessGrantType;
    }
    interface IRequiredResourceAccesses {
        value: IRequiredResourceAccess[];
    }
    interface IRequiredResourceAccess {
        resourceAppId: string;
        requiredAppPermissions: IRequiredAppPermission[];
    }
    class RequiredResourceAccess extends Extensions.ComplexTypeBase {
        constructor(data?: IRequiredResourceAccess);
        public _odataType: string;
        public resourceAppId : string;
        private _resourceAppId;
        public resourceAppIdChanged : boolean;
        private _resourceAppIdChanged;
        public requiredAppPermissions : Extensions.ObservableCollection<RequiredAppPermission>;
        private _requiredAppPermissions;
        public requiredAppPermissionsChanged : boolean;
        private _requiredAppPermissionsChanged;
        private _requiredAppPermissionsChangedListener;
        static parseRequiredResourceAccess(data: IRequiredResourceAccess): RequiredResourceAccess;
        static parseRequiredResourceAccesses(data: IRequiredResourceAccess[]): Extensions.ObservableCollection<RequiredResourceAccess>;
        public getRequestBody(): IRequiredResourceAccess;
    }
    interface IRequiredAppPermissions {
        value: IRequiredAppPermission[];
    }
    interface IRequiredAppPermission {
        permissionId: string;
        directAccessGrant: boolean;
        impersonationAccessGrants: string[];
    }
    class RequiredAppPermission extends Extensions.ComplexTypeBase {
        constructor(data?: IRequiredAppPermission);
        public _odataType: string;
        public permissionId : string;
        private _permissionId;
        public permissionIdChanged : boolean;
        private _permissionIdChanged;
        public directAccessGrant : boolean;
        private _directAccessGrant;
        public directAccessGrantChanged : boolean;
        private _directAccessGrantChanged;
        public impersonationAccessGrants : string[];
        private _impersonationAccessGrants;
        public impersonationAccessGrantsChanged : boolean;
        private _impersonationAccessGrantsChanged;
        static parseRequiredAppPermission(data: IRequiredAppPermission): RequiredAppPermission;
        static parseRequiredAppPermissions(data: IRequiredAppPermission[]): Extensions.ObservableCollection<RequiredAppPermission>;
        public getRequestBody(): IRequiredAppPermission;
    }
    class NotificationFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<Notification>;
    }
    interface INotifications {
        value: INotification[];
    }
    interface INotification extends IDirectoryObject {
        callbackUri: string;
        filters: string[];
    }
    class Notification extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: INotification);
        public _odataType: string;
        public callbackUri : string;
        private _callbackUri;
        public callbackUriChanged : boolean;
        private _callbackUriChanged;
        public filters : string[];
        private _filters;
        public filtersChanged : boolean;
        private _filtersChanged;
        public update(): Microsoft.Utility.IPromise<Notification>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseNotification(context: Extensions.DataContext, path: string, data: INotification): Notification;
        static parseNotifications(context: Extensions.DataContext, pathFn: (data: INotification) => string, data: INotification[]): Notification[];
        public getRequestBody(): INotification;
    }
    interface IAppMetadatas {
        value: IAppMetadata[];
    }
    interface IAppMetadata {
        version: number;
        data: IAppMetadataEntry[];
    }
    class AppMetadata extends Extensions.ComplexTypeBase {
        constructor(data?: IAppMetadata);
        public _odataType: string;
        public version : number;
        private _version;
        public versionChanged : boolean;
        private _versionChanged;
        public data : Extensions.ObservableCollection<AppMetadataEntry>;
        private _data;
        public dataChanged : boolean;
        private _dataChanged;
        private _dataChangedListener;
        static parseAppMetadata(data: IAppMetadata): AppMetadata;
        static parseAppMetadatas(data: IAppMetadata[]): Extensions.ObservableCollection<AppMetadata>;
        public getRequestBody(): IAppMetadata;
    }
    interface IAppMetadataEntries {
        value: IAppMetadataEntry[];
    }
    interface IAppMetadataEntry {
        key: string;
        value: string;
    }
    class AppMetadataEntry extends Extensions.ComplexTypeBase {
        constructor(data?: IAppMetadataEntry);
        public _odataType: string;
        public key : string;
        private _key;
        public keyChanged : boolean;
        private _keyChanged;
        public value : string;
        private _value;
        public valueChanged : boolean;
        private _valueChanged;
        static parseAppMetadataEntry(data: IAppMetadataEntry): AppMetadataEntry;
        static parseAppMetadataEntries(data: IAppMetadataEntry[]): Extensions.ObservableCollection<AppMetadataEntry>;
        public getRequestBody(): IAppMetadataEntry;
    }
    interface IKeyCredentials {
        value: IKeyCredential[];
    }
    interface IKeyCredential {
        customKeyIdentifier: string;
        endDate: string;
        keyId: string;
        startDate: string;
        type: string;
        usage: string;
        value: string;
    }
    class KeyCredential extends Extensions.ComplexTypeBase {
        constructor(data?: IKeyCredential);
        public _odataType: string;
        public customKeyIdentifier : string;
        private _customKeyIdentifier;
        public customKeyIdentifierChanged : boolean;
        private _customKeyIdentifierChanged;
        public endDate : Date;
        private _endDate;
        public endDateChanged : boolean;
        private _endDateChanged;
        public keyId : string;
        private _keyId;
        public keyIdChanged : boolean;
        private _keyIdChanged;
        public startDate : Date;
        private _startDate;
        public startDateChanged : boolean;
        private _startDateChanged;
        public type : string;
        private _type;
        public typeChanged : boolean;
        private _typeChanged;
        public usage : string;
        private _usage;
        public usageChanged : boolean;
        private _usageChanged;
        public value : string;
        private _value;
        public valueChanged : boolean;
        private _valueChanged;
        static parseKeyCredential(data: IKeyCredential): KeyCredential;
        static parseKeyCredentials(data: IKeyCredential[]): Extensions.ObservableCollection<KeyCredential>;
        public getRequestBody(): IKeyCredential;
    }
    interface IPasswordCredentials {
        value: IPasswordCredential[];
    }
    interface IPasswordCredential {
        customKeyIdentifier: string;
        endDate: string;
        keyId: string;
        startDate: string;
        value: string;
    }
    class PasswordCredential extends Extensions.ComplexTypeBase {
        constructor(data?: IPasswordCredential);
        public _odataType: string;
        public customKeyIdentifier : string;
        private _customKeyIdentifier;
        public customKeyIdentifierChanged : boolean;
        private _customKeyIdentifierChanged;
        public endDate : Date;
        private _endDate;
        public endDateChanged : boolean;
        private _endDateChanged;
        public keyId : string;
        private _keyId;
        public keyIdChanged : boolean;
        private _keyIdChanged;
        public startDate : Date;
        private _startDate;
        public startDateChanged : boolean;
        private _startDateChanged;
        public value : string;
        private _value;
        public valueChanged : boolean;
        private _valueChanged;
        static parsePasswordCredential(data: IPasswordCredential): PasswordCredential;
        static parsePasswordCredentials(data: IPasswordCredential[]): Extensions.ObservableCollection<PasswordCredential>;
        public getRequestBody(): IPasswordCredential;
    }
    class CollaborationSpaceFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<CollaborationSpace>;
    }
    interface ICollaborationSpaces {
        value: ICollaborationSpace[];
    }
    interface ICollaborationSpace extends IDirectoryObject {
        accountEnabled: boolean;
        allowAccessTo: string[];
        displayName: string;
        description: string;
        mail: string;
        mailNickname: string;
        userPrincipalName: string;
        changeMarker: string;
        provisioningSince: string;
    }
    class CollaborationSpace extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: ICollaborationSpace);
        public _odataType: string;
        public accountEnabled : boolean;
        private _accountEnabled;
        public accountEnabledChanged : boolean;
        private _accountEnabledChanged;
        public allowAccessTo : string[];
        private _allowAccessTo;
        public allowAccessToChanged : boolean;
        private _allowAccessToChanged;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        public description : string;
        private _description;
        public descriptionChanged : boolean;
        private _descriptionChanged;
        public mail : string;
        private _mail;
        public mailChanged : boolean;
        private _mailChanged;
        public mailNickname : string;
        private _mailNickname;
        public mailNicknameChanged : boolean;
        private _mailNicknameChanged;
        public userPrincipalName : string;
        private _userPrincipalName;
        public userPrincipalNameChanged : boolean;
        private _userPrincipalNameChanged;
        public changeMarker : string;
        private _changeMarker;
        public changeMarkerChanged : boolean;
        private _changeMarkerChanged;
        public provisioningSince : Date;
        private _provisioningSince;
        public provisioningSinceChanged : boolean;
        private _provisioningSinceChanged;
        public update(): Microsoft.Utility.IPromise<CollaborationSpace>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseCollaborationSpace(context: Extensions.DataContext, path: string, data: ICollaborationSpace): CollaborationSpace;
        static parseCollaborationSpaces(context: Extensions.DataContext, pathFn: (data: ICollaborationSpace) => string, data: ICollaborationSpace[]): CollaborationSpace[];
        public getRequestBody(): ICollaborationSpace;
    }
    class ContactFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<Contact>;
    }
    interface IContacts {
        value: IContact[];
    }
    interface IContact extends IDirectoryObject {
        city: string;
        country: string;
        department: string;
        dirSyncEnabled: boolean;
        displayName: string;
        facsimileTelephoneNumber: string;
        givenName: string;
        jobTitle: string;
        lastDirSyncTime: string;
        mail: string;
        mailNickname: string;
        mobile: string;
        physicalDeliveryOfficeName: string;
        postalCode: string;
        provisioningErrors: IProvisioningError[];
        proxyAddresses: string[];
        sipProxyAddress: string;
        state: string;
        streetAddress: string;
        surname: string;
        telephoneNumber: string;
        thumbnailPhoto: string;
    }
    class Contact extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IContact);
        public _odataType: string;
        public city : string;
        private _city;
        public cityChanged : boolean;
        private _cityChanged;
        public country : string;
        private _country;
        public countryChanged : boolean;
        private _countryChanged;
        public department : string;
        private _department;
        public departmentChanged : boolean;
        private _departmentChanged;
        public dirSyncEnabled : boolean;
        private _dirSyncEnabled;
        public dirSyncEnabledChanged : boolean;
        private _dirSyncEnabledChanged;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        public facsimileTelephoneNumber : string;
        private _facsimileTelephoneNumber;
        public facsimileTelephoneNumberChanged : boolean;
        private _facsimileTelephoneNumberChanged;
        public givenName : string;
        private _givenName;
        public givenNameChanged : boolean;
        private _givenNameChanged;
        public jobTitle : string;
        private _jobTitle;
        public jobTitleChanged : boolean;
        private _jobTitleChanged;
        public lastDirSyncTime : Date;
        private _lastDirSyncTime;
        public lastDirSyncTimeChanged : boolean;
        private _lastDirSyncTimeChanged;
        public mail : string;
        private _mail;
        public mailChanged : boolean;
        private _mailChanged;
        public mailNickname : string;
        private _mailNickname;
        public mailNicknameChanged : boolean;
        private _mailNicknameChanged;
        public mobile : string;
        private _mobile;
        public mobileChanged : boolean;
        private _mobileChanged;
        public physicalDeliveryOfficeName : string;
        private _physicalDeliveryOfficeName;
        public physicalDeliveryOfficeNameChanged : boolean;
        private _physicalDeliveryOfficeNameChanged;
        public postalCode : string;
        private _postalCode;
        public postalCodeChanged : boolean;
        private _postalCodeChanged;
        public provisioningErrors : Extensions.ObservableCollection<ProvisioningError>;
        private _provisioningErrors;
        public provisioningErrorsChanged : boolean;
        private _provisioningErrorsChanged;
        private _provisioningErrorsChangedListener;
        public proxyAddresses : string[];
        private _proxyAddresses;
        public proxyAddressesChanged : boolean;
        private _proxyAddressesChanged;
        public sipProxyAddress : string;
        private _sipProxyAddress;
        public sipProxyAddressChanged : boolean;
        private _sipProxyAddressChanged;
        public state : string;
        private _state;
        public stateChanged : boolean;
        private _stateChanged;
        public streetAddress : string;
        private _streetAddress;
        public streetAddressChanged : boolean;
        private _streetAddressChanged;
        public surname : string;
        private _surname;
        public surnameChanged : boolean;
        private _surnameChanged;
        public telephoneNumber : string;
        private _telephoneNumber;
        public telephoneNumberChanged : boolean;
        private _telephoneNumberChanged;
        public thumbnailPhoto : string;
        private _thumbnailPhoto;
        public thumbnailPhotoChanged : boolean;
        private _thumbnailPhotoChanged;
        public update(): Microsoft.Utility.IPromise<Contact>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseContact(context: Extensions.DataContext, path: string, data: IContact): Contact;
        static parseContacts(context: Extensions.DataContext, pathFn: (data: IContact) => string, data: IContact[]): Contact[];
        public getRequestBody(): IContact;
    }
    interface IProvisioningErrors {
        value: IProvisioningError[];
    }
    interface IProvisioningError {
        errorDetail: string;
        resolved: boolean;
        service: string;
        timestamp: string;
    }
    class ProvisioningError extends Extensions.ComplexTypeBase {
        constructor(data?: IProvisioningError);
        public _odataType: string;
        public errorDetail : string;
        private _errorDetail;
        public errorDetailChanged : boolean;
        private _errorDetailChanged;
        public resolved : boolean;
        private _resolved;
        public resolvedChanged : boolean;
        private _resolvedChanged;
        public service : string;
        private _service;
        public serviceChanged : boolean;
        private _serviceChanged;
        public timestamp : Date;
        private _timestamp;
        public timestampChanged : boolean;
        private _timestampChanged;
        static parseProvisioningError(data: IProvisioningError): ProvisioningError;
        static parseProvisioningErrors(data: IProvisioningError[]): Extensions.ObservableCollection<ProvisioningError>;
        public getRequestBody(): IProvisioningError;
    }
    class DeviceFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public registeredOwners : DirectoryObjects;
        private _registeredOwners;
        public registeredUsers : DirectoryObjects;
        private _registeredUsers;
        public fetch(): Microsoft.Utility.IPromise<Device>;
    }
    interface IDevices {
        value: IDevice[];
    }
    interface IDevice extends IDirectoryObject {
        accountEnabled: boolean;
        alternativeSecurityIds: IAlternativeSecurityId[];
        approximateLastLogonTimestamp: string;
        deviceId: string;
        deviceObjectVersion: number;
        deviceOSType: string;
        deviceOSVersion: string;
        devicePhysicalIds: string[];
        dirSyncEnabled: boolean;
        displayName: string;
        lastDirSyncTime: string;
    }
    class Device extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IDevice);
        public _odataType: string;
        public accountEnabled : boolean;
        private _accountEnabled;
        public accountEnabledChanged : boolean;
        private _accountEnabledChanged;
        public alternativeSecurityIds : Extensions.ObservableCollection<AlternativeSecurityId>;
        private _alternativeSecurityIds;
        public alternativeSecurityIdsChanged : boolean;
        private _alternativeSecurityIdsChanged;
        private _alternativeSecurityIdsChangedListener;
        public approximateLastLogonTimestamp : Date;
        private _approximateLastLogonTimestamp;
        public approximateLastLogonTimestampChanged : boolean;
        private _approximateLastLogonTimestampChanged;
        public deviceId : string;
        private _deviceId;
        public deviceIdChanged : boolean;
        private _deviceIdChanged;
        public deviceObjectVersion : number;
        private _deviceObjectVersion;
        public deviceObjectVersionChanged : boolean;
        private _deviceObjectVersionChanged;
        public deviceOSType : string;
        private _deviceOSType;
        public deviceOSTypeChanged : boolean;
        private _deviceOSTypeChanged;
        public deviceOSVersion : string;
        private _deviceOSVersion;
        public deviceOSVersionChanged : boolean;
        private _deviceOSVersionChanged;
        public devicePhysicalIds : string[];
        private _devicePhysicalIds;
        public devicePhysicalIdsChanged : boolean;
        private _devicePhysicalIdsChanged;
        public dirSyncEnabled : boolean;
        private _dirSyncEnabled;
        public dirSyncEnabledChanged : boolean;
        private _dirSyncEnabledChanged;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        public lastDirSyncTime : Date;
        private _lastDirSyncTime;
        public lastDirSyncTimeChanged : boolean;
        private _lastDirSyncTimeChanged;
        public registeredOwners : DirectoryObjects;
        private _registeredOwners;
        public registeredUsers : DirectoryObjects;
        private _registeredUsers;
        public update(): Microsoft.Utility.IPromise<Device>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseDevice(context: Extensions.DataContext, path: string, data: IDevice): Device;
        static parseDevices(context: Extensions.DataContext, pathFn: (data: IDevice) => string, data: IDevice[]): Device[];
        public getRequestBody(): IDevice;
    }
    interface IAlternativeSecurityIds {
        value: IAlternativeSecurityId[];
    }
    interface IAlternativeSecurityId {
        type: number;
        identityProvider: string;
        key: string;
    }
    class AlternativeSecurityId extends Extensions.ComplexTypeBase {
        constructor(data?: IAlternativeSecurityId);
        public _odataType: string;
        public type : number;
        private _type;
        public typeChanged : boolean;
        private _typeChanged;
        public identityProvider : string;
        private _identityProvider;
        public identityProviderChanged : boolean;
        private _identityProviderChanged;
        public key : string;
        private _key;
        public keyChanged : boolean;
        private _keyChanged;
        static parseAlternativeSecurityId(data: IAlternativeSecurityId): AlternativeSecurityId;
        static parseAlternativeSecurityIds(data: IAlternativeSecurityId[]): Extensions.ObservableCollection<AlternativeSecurityId>;
        public getRequestBody(): IAlternativeSecurityId;
    }
    class DeviceConfigurationFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<DeviceConfiguration>;
    }
    interface IDeviceConfigurations {
        value: IDeviceConfiguration[];
    }
    interface IDeviceConfiguration extends IDirectoryObject {
        publicIssuerCertificates: string[];
        cloudPublicIssuerCertificates: string[];
        registrationQuota: number;
        maximumRegistrationInactivityPeriod: number;
    }
    class DeviceConfiguration extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IDeviceConfiguration);
        public _odataType: string;
        public publicIssuerCertificates : string[];
        private _publicIssuerCertificates;
        public publicIssuerCertificatesChanged : boolean;
        private _publicIssuerCertificatesChanged;
        public cloudPublicIssuerCertificates : string[];
        private _cloudPublicIssuerCertificates;
        public cloudPublicIssuerCertificatesChanged : boolean;
        private _cloudPublicIssuerCertificatesChanged;
        public registrationQuota : number;
        private _registrationQuota;
        public registrationQuotaChanged : boolean;
        private _registrationQuotaChanged;
        public maximumRegistrationInactivityPeriod : number;
        private _maximumRegistrationInactivityPeriod;
        public maximumRegistrationInactivityPeriodChanged : boolean;
        private _maximumRegistrationInactivityPeriodChanged;
        public update(): Microsoft.Utility.IPromise<DeviceConfiguration>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseDeviceConfiguration(context: Extensions.DataContext, path: string, data: IDeviceConfiguration): DeviceConfiguration;
        static parseDeviceConfigurations(context: Extensions.DataContext, pathFn: (data: IDeviceConfiguration) => string, data: IDeviceConfiguration[]): DeviceConfiguration[];
        public getRequestBody(): IDeviceConfiguration;
    }
    class DirectoryLinkChangeFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<DirectoryLinkChange>;
    }
    interface IDirectoryLinkChanges {
        value: IDirectoryLinkChange[];
    }
    interface IDirectoryLinkChange extends IDirectoryObject {
        associationType: string;
        sourceObjectId: string;
        sourceObjectType: string;
        sourceObjectUri: string;
        targetObjectId: string;
        targetObjectType: string;
        targetObjectUri: string;
    }
    class DirectoryLinkChange extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IDirectoryLinkChange);
        public _odataType: string;
        public associationType : string;
        private _associationType;
        public associationTypeChanged : boolean;
        private _associationTypeChanged;
        public sourceObjectId : string;
        private _sourceObjectId;
        public sourceObjectIdChanged : boolean;
        private _sourceObjectIdChanged;
        public sourceObjectType : string;
        private _sourceObjectType;
        public sourceObjectTypeChanged : boolean;
        private _sourceObjectTypeChanged;
        public sourceObjectUri : string;
        private _sourceObjectUri;
        public sourceObjectUriChanged : boolean;
        private _sourceObjectUriChanged;
        public targetObjectId : string;
        private _targetObjectId;
        public targetObjectIdChanged : boolean;
        private _targetObjectIdChanged;
        public targetObjectType : string;
        private _targetObjectType;
        public targetObjectTypeChanged : boolean;
        private _targetObjectTypeChanged;
        public targetObjectUri : string;
        private _targetObjectUri;
        public targetObjectUriChanged : boolean;
        private _targetObjectUriChanged;
        public update(): Microsoft.Utility.IPromise<DirectoryLinkChange>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseDirectoryLinkChange(context: Extensions.DataContext, path: string, data: IDirectoryLinkChange): DirectoryLinkChange;
        static parseDirectoryLinkChanges(context: Extensions.DataContext, pathFn: (data: IDirectoryLinkChange) => string, data: IDirectoryLinkChange[]): DirectoryLinkChange[];
        public getRequestBody(): IDirectoryLinkChange;
    }
    class DirectAccessGrantFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<DirectAccessGrant>;
    }
    interface IDirectAccessGrants {
        value: IDirectAccessGrant[];
    }
    interface IDirectAccessGrant extends IDirectoryObject {
        creationTimestamp: string;
        permissionId: string;
        principalDisplayName: string;
        principalId: string;
        principalType: string;
        resourceDisplayName: string;
        resourceId: string;
    }
    class DirectAccessGrant extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IDirectAccessGrant);
        public _odataType: string;
        public creationTimestamp : Date;
        private _creationTimestamp;
        public creationTimestampChanged : boolean;
        private _creationTimestampChanged;
        public permissionId : string;
        private _permissionId;
        public permissionIdChanged : boolean;
        private _permissionIdChanged;
        public principalDisplayName : string;
        private _principalDisplayName;
        public principalDisplayNameChanged : boolean;
        private _principalDisplayNameChanged;
        public principalId : string;
        private _principalId;
        public principalIdChanged : boolean;
        private _principalIdChanged;
        public principalType : string;
        private _principalType;
        public principalTypeChanged : boolean;
        private _principalTypeChanged;
        public resourceDisplayName : string;
        private _resourceDisplayName;
        public resourceDisplayNameChanged : boolean;
        private _resourceDisplayNameChanged;
        public resourceId : string;
        private _resourceId;
        public resourceIdChanged : boolean;
        private _resourceIdChanged;
        public update(): Microsoft.Utility.IPromise<DirectAccessGrant>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseDirectAccessGrant(context: Extensions.DataContext, path: string, data: IDirectAccessGrant): DirectAccessGrant;
        static parseDirectAccessGrants(context: Extensions.DataContext, pathFn: (data: IDirectAccessGrant) => string, data: IDirectAccessGrant[]): DirectAccessGrant[];
        public getRequestBody(): IDirectAccessGrant;
    }
    class GroupFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public directAccessGrants : DirectAccessGrants;
        private _directAccessGrants;
        public pendingMembers : DirectoryObjects;
        private _pendingMembers;
        public allowAccessTo : DirectoryObjects;
        private _allowAccessTo;
        public hasAccessTo : DirectoryObjects;
        private _hasAccessTo;
        public fetch(): Microsoft.Utility.IPromise<Group>;
    }
    interface IGroups {
        value: IGroup[];
    }
    interface IGroup extends IDirectoryObject {
        exchangeResources: string[];
        description: string;
        dirSyncEnabled: boolean;
        displayName: string;
        groupType: string;
        isPublic: boolean;
        lastDirSyncTime: string;
        mail: string;
        mailNickname: string;
        mailEnabled: boolean;
        provisioningErrors: IProvisioningError[];
        proxyAddresses: string[];
        securityEnabled: boolean;
        sharepointResources: string[];
    }
    class Group extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IGroup);
        public _odataType: string;
        public exchangeResources : string[];
        private _exchangeResources;
        public exchangeResourcesChanged : boolean;
        private _exchangeResourcesChanged;
        public description : string;
        private _description;
        public descriptionChanged : boolean;
        private _descriptionChanged;
        public dirSyncEnabled : boolean;
        private _dirSyncEnabled;
        public dirSyncEnabledChanged : boolean;
        private _dirSyncEnabledChanged;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        public groupType : string;
        private _groupType;
        public groupTypeChanged : boolean;
        private _groupTypeChanged;
        public isPublic : boolean;
        private _isPublic;
        public isPublicChanged : boolean;
        private _isPublicChanged;
        public lastDirSyncTime : Date;
        private _lastDirSyncTime;
        public lastDirSyncTimeChanged : boolean;
        private _lastDirSyncTimeChanged;
        public mail : string;
        private _mail;
        public mailChanged : boolean;
        private _mailChanged;
        public mailNickname : string;
        private _mailNickname;
        public mailNicknameChanged : boolean;
        private _mailNicknameChanged;
        public mailEnabled : boolean;
        private _mailEnabled;
        public mailEnabledChanged : boolean;
        private _mailEnabledChanged;
        public provisioningErrors : Extensions.ObservableCollection<ProvisioningError>;
        private _provisioningErrors;
        public provisioningErrorsChanged : boolean;
        private _provisioningErrorsChanged;
        private _provisioningErrorsChangedListener;
        public proxyAddresses : string[];
        private _proxyAddresses;
        public proxyAddressesChanged : boolean;
        private _proxyAddressesChanged;
        public securityEnabled : boolean;
        private _securityEnabled;
        public securityEnabledChanged : boolean;
        private _securityEnabledChanged;
        public sharepointResources : string[];
        private _sharepointResources;
        public sharepointResourcesChanged : boolean;
        private _sharepointResourcesChanged;
        public directAccessGrants : DirectAccessGrants;
        private _directAccessGrants;
        public pendingMembers : DirectoryObjects;
        private _pendingMembers;
        public allowAccessTo : DirectoryObjects;
        private _allowAccessTo;
        public hasAccessTo : DirectoryObjects;
        private _hasAccessTo;
        public update(): Microsoft.Utility.IPromise<Group>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseGroup(context: Extensions.DataContext, path: string, data: IGroup): Group;
        static parseGroups(context: Extensions.DataContext, pathFn: (data: IGroup) => string, data: IGroup[]): Group[];
        public getRequestBody(): IGroup;
    }
    class RoleFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<Role>;
    }
    interface IRoles {
        value: IRole[];
    }
    interface IRole extends IDirectoryObject {
        description: string;
        displayName: string;
        isSystem: boolean;
        roleDisabled: boolean;
    }
    class Role extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IRole);
        public _odataType: string;
        public description : string;
        private _description;
        public descriptionChanged : boolean;
        private _descriptionChanged;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        public isSystem : boolean;
        private _isSystem;
        public isSystemChanged : boolean;
        private _isSystemChanged;
        public roleDisabled : boolean;
        private _roleDisabled;
        public roleDisabledChanged : boolean;
        private _roleDisabledChanged;
        public update(): Microsoft.Utility.IPromise<Role>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseRole(context: Extensions.DataContext, path: string, data: IRole): Role;
        static parseRoles(context: Extensions.DataContext, pathFn: (data: IRole) => string, data: IRole[]): Role[];
        public getRequestBody(): IRole;
    }
    class RoleTemplateFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<RoleTemplate>;
    }
    interface IRoleTemplates {
        value: IRoleTemplate[];
    }
    interface IRoleTemplate extends IDirectoryObject {
        description: string;
        displayName: string;
    }
    class RoleTemplate extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IRoleTemplate);
        public _odataType: string;
        public description : string;
        private _description;
        public descriptionChanged : boolean;
        private _descriptionChanged;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        public update(): Microsoft.Utility.IPromise<RoleTemplate>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseRoleTemplate(context: Extensions.DataContext, path: string, data: IRoleTemplate): RoleTemplate;
        static parseRoleTemplates(context: Extensions.DataContext, pathFn: (data: IRoleTemplate) => string, data: IRoleTemplate[]): RoleTemplate[];
        public getRequestBody(): IRoleTemplate;
    }
    class ServicePrincipalFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public impersonationAccessGrants : ImpersonationAccessGrants;
        private _impersonationAccessGrants;
        public directAccessGrants : DirectAccessGrants;
        private _directAccessGrants;
        public directAccessGrantedTo : DirectAccessGrants;
        private _directAccessGrantedTo;
        public fetch(): Microsoft.Utility.IPromise<ServicePrincipal>;
    }
    interface IServicePrincipals {
        value: IServicePrincipal[];
    }
    interface IServicePrincipal extends IDirectoryObject {
        accountEnabled: boolean;
        appId: string;
        appMetadata: IAppMetadata;
        appOwnerTenantId: string;
        appPermissions: IAppPermission[];
        authenticationPolicy: IServicePrincipalAuthenticationPolicy;
        displayName: string;
        errorUrl: string;
        explicitAccessGrantRequired: boolean;
        homepage: string;
        keyCredentials: IKeyCredential[];
        logoutUrl: string;
        passwordCredentials: IPasswordCredential[];
        publisherName: string;
        replyUrls: string[];
        resourceApplicationSet: string;
        samlMetadataUrl: string;
        servicePrincipalNames: string[];
        tags: string[];
        webApi: boolean;
        webApp: boolean;
    }
    class ServicePrincipal extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IServicePrincipal);
        public _odataType: string;
        public accountEnabled : boolean;
        private _accountEnabled;
        public accountEnabledChanged : boolean;
        private _accountEnabledChanged;
        public appId : string;
        private _appId;
        public appIdChanged : boolean;
        private _appIdChanged;
        public appMetadata : AppMetadata;
        private _appMetadata;
        public appMetadataChanged : boolean;
        private _appMetadataChanged;
        private _appMetadataChangedListener;
        public appOwnerTenantId : string;
        private _appOwnerTenantId;
        public appOwnerTenantIdChanged : boolean;
        private _appOwnerTenantIdChanged;
        public appPermissions : Extensions.ObservableCollection<AppPermission>;
        private _appPermissions;
        public appPermissionsChanged : boolean;
        private _appPermissionsChanged;
        private _appPermissionsChangedListener;
        public authenticationPolicy : ServicePrincipalAuthenticationPolicy;
        private _authenticationPolicy;
        public authenticationPolicyChanged : boolean;
        private _authenticationPolicyChanged;
        private _authenticationPolicyChangedListener;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        public errorUrl : string;
        private _errorUrl;
        public errorUrlChanged : boolean;
        private _errorUrlChanged;
        public explicitAccessGrantRequired : boolean;
        private _explicitAccessGrantRequired;
        public explicitAccessGrantRequiredChanged : boolean;
        private _explicitAccessGrantRequiredChanged;
        public homepage : string;
        private _homepage;
        public homepageChanged : boolean;
        private _homepageChanged;
        public keyCredentials : Extensions.ObservableCollection<KeyCredential>;
        private _keyCredentials;
        public keyCredentialsChanged : boolean;
        private _keyCredentialsChanged;
        private _keyCredentialsChangedListener;
        public logoutUrl : string;
        private _logoutUrl;
        public logoutUrlChanged : boolean;
        private _logoutUrlChanged;
        public passwordCredentials : Extensions.ObservableCollection<PasswordCredential>;
        private _passwordCredentials;
        public passwordCredentialsChanged : boolean;
        private _passwordCredentialsChanged;
        private _passwordCredentialsChangedListener;
        public publisherName : string;
        private _publisherName;
        public publisherNameChanged : boolean;
        private _publisherNameChanged;
        public replyUrls : string[];
        private _replyUrls;
        public replyUrlsChanged : boolean;
        private _replyUrlsChanged;
        public resourceApplicationSet : string;
        private _resourceApplicationSet;
        public resourceApplicationSetChanged : boolean;
        private _resourceApplicationSetChanged;
        public samlMetadataUrl : string;
        private _samlMetadataUrl;
        public samlMetadataUrlChanged : boolean;
        private _samlMetadataUrlChanged;
        public servicePrincipalNames : string[];
        private _servicePrincipalNames;
        public servicePrincipalNamesChanged : boolean;
        private _servicePrincipalNamesChanged;
        public tags : string[];
        private _tags;
        public tagsChanged : boolean;
        private _tagsChanged;
        public webApi : boolean;
        private _webApi;
        public webApiChanged : boolean;
        private _webApiChanged;
        public webApp : boolean;
        private _webApp;
        public webAppChanged : boolean;
        private _webAppChanged;
        public impersonationAccessGrants : ImpersonationAccessGrants;
        private _impersonationAccessGrants;
        public directAccessGrants : DirectAccessGrants;
        private _directAccessGrants;
        public directAccessGrantedTo : DirectAccessGrants;
        private _directAccessGrantedTo;
        public update(): Microsoft.Utility.IPromise<ServicePrincipal>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseServicePrincipal(context: Extensions.DataContext, path: string, data: IServicePrincipal): ServicePrincipal;
        static parseServicePrincipals(context: Extensions.DataContext, pathFn: (data: IServicePrincipal) => string, data: IServicePrincipal[]): ServicePrincipal[];
        public getRequestBody(): IServicePrincipal;
    }
    interface IServicePrincipalAuthenticationPolicies {
        value: IServicePrincipalAuthenticationPolicy[];
    }
    interface IServicePrincipalAuthenticationPolicy {
        defaultPolicy: string;
        allowedPolicies: string[];
    }
    class ServicePrincipalAuthenticationPolicy extends Extensions.ComplexTypeBase {
        constructor(data?: IServicePrincipalAuthenticationPolicy);
        public _odataType: string;
        public defaultPolicy : string;
        private _defaultPolicy;
        public defaultPolicyChanged : boolean;
        private _defaultPolicyChanged;
        public allowedPolicies : string[];
        private _allowedPolicies;
        public allowedPoliciesChanged : boolean;
        private _allowedPoliciesChanged;
        static parseServicePrincipalAuthenticationPolicy(data: IServicePrincipalAuthenticationPolicy): ServicePrincipalAuthenticationPolicy;
        static parseServicePrincipalAuthenticationPolicies(data: IServicePrincipalAuthenticationPolicy[]): Extensions.ObservableCollection<ServicePrincipalAuthenticationPolicy>;
        public getRequestBody(): IServicePrincipalAuthenticationPolicy;
    }
    class TenantDetailFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<TenantDetail>;
    }
    interface ITenantDetails {
        value: ITenantDetail[];
    }
    interface ITenantDetail extends IDirectoryObject {
        assignedPlans: IAssignedPlan[];
        city: string;
        companyLastDirSyncTime: string;
        companyTags: string[];
        country: string;
        countryLetterCode: string;
        dirSyncEnabled: boolean;
        displayName: string;
        marketingNotificationEmails: string[];
        postalCode: string;
        preferredLanguage: string;
        provisionedPlans: IProvisionedPlan[];
        provisioningErrors: IProvisioningError[];
        state: string;
        street: string;
        technicalNotificationMails: string[];
        telephoneNumber: string;
        tenantType: string;
        verifiedDomains: IVerifiedDomain[];
    }
    class TenantDetail extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: ITenantDetail);
        public _odataType: string;
        public assignedPlans : Extensions.ObservableCollection<AssignedPlan>;
        private _assignedPlans;
        public assignedPlansChanged : boolean;
        private _assignedPlansChanged;
        private _assignedPlansChangedListener;
        public city : string;
        private _city;
        public cityChanged : boolean;
        private _cityChanged;
        public companyLastDirSyncTime : Date;
        private _companyLastDirSyncTime;
        public companyLastDirSyncTimeChanged : boolean;
        private _companyLastDirSyncTimeChanged;
        public companyTags : string[];
        private _companyTags;
        public companyTagsChanged : boolean;
        private _companyTagsChanged;
        public country : string;
        private _country;
        public countryChanged : boolean;
        private _countryChanged;
        public countryLetterCode : string;
        private _countryLetterCode;
        public countryLetterCodeChanged : boolean;
        private _countryLetterCodeChanged;
        public dirSyncEnabled : boolean;
        private _dirSyncEnabled;
        public dirSyncEnabledChanged : boolean;
        private _dirSyncEnabledChanged;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        public marketingNotificationEmails : string[];
        private _marketingNotificationEmails;
        public marketingNotificationEmailsChanged : boolean;
        private _marketingNotificationEmailsChanged;
        public postalCode : string;
        private _postalCode;
        public postalCodeChanged : boolean;
        private _postalCodeChanged;
        public preferredLanguage : string;
        private _preferredLanguage;
        public preferredLanguageChanged : boolean;
        private _preferredLanguageChanged;
        public provisionedPlans : Extensions.ObservableCollection<ProvisionedPlan>;
        private _provisionedPlans;
        public provisionedPlansChanged : boolean;
        private _provisionedPlansChanged;
        private _provisionedPlansChangedListener;
        public provisioningErrors : Extensions.ObservableCollection<ProvisioningError>;
        private _provisioningErrors;
        public provisioningErrorsChanged : boolean;
        private _provisioningErrorsChanged;
        private _provisioningErrorsChangedListener;
        public state : string;
        private _state;
        public stateChanged : boolean;
        private _stateChanged;
        public street : string;
        private _street;
        public streetChanged : boolean;
        private _streetChanged;
        public technicalNotificationMails : string[];
        private _technicalNotificationMails;
        public technicalNotificationMailsChanged : boolean;
        private _technicalNotificationMailsChanged;
        public telephoneNumber : string;
        private _telephoneNumber;
        public telephoneNumberChanged : boolean;
        private _telephoneNumberChanged;
        public tenantType : string;
        private _tenantType;
        public tenantTypeChanged : boolean;
        private _tenantTypeChanged;
        public verifiedDomains : Extensions.ObservableCollection<VerifiedDomain>;
        private _verifiedDomains;
        public verifiedDomainsChanged : boolean;
        private _verifiedDomainsChanged;
        private _verifiedDomainsChangedListener;
        public update(): Microsoft.Utility.IPromise<TenantDetail>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseTenantDetail(context: Extensions.DataContext, path: string, data: ITenantDetail): TenantDetail;
        static parseTenantDetails(context: Extensions.DataContext, pathFn: (data: ITenantDetail) => string, data: ITenantDetail[]): TenantDetail[];
        public getRequestBody(): ITenantDetail;
    }
    interface IAssignedPlans {
        value: IAssignedPlan[];
    }
    interface IAssignedPlan {
        assignedTimestamp: string;
        capabilityStatus: string;
        service: string;
        servicePlanId: string;
    }
    class AssignedPlan extends Extensions.ComplexTypeBase {
        constructor(data?: IAssignedPlan);
        public _odataType: string;
        public assignedTimestamp : Date;
        private _assignedTimestamp;
        public assignedTimestampChanged : boolean;
        private _assignedTimestampChanged;
        public capabilityStatus : string;
        private _capabilityStatus;
        public capabilityStatusChanged : boolean;
        private _capabilityStatusChanged;
        public service : string;
        private _service;
        public serviceChanged : boolean;
        private _serviceChanged;
        public servicePlanId : string;
        private _servicePlanId;
        public servicePlanIdChanged : boolean;
        private _servicePlanIdChanged;
        static parseAssignedPlan(data: IAssignedPlan): AssignedPlan;
        static parseAssignedPlans(data: IAssignedPlan[]): Extensions.ObservableCollection<AssignedPlan>;
        public getRequestBody(): IAssignedPlan;
    }
    interface IProvisionedPlans {
        value: IProvisionedPlan[];
    }
    interface IProvisionedPlan {
        capabilityStatus: string;
        provisioningStatus: string;
        service: string;
    }
    class ProvisionedPlan extends Extensions.ComplexTypeBase {
        constructor(data?: IProvisionedPlan);
        public _odataType: string;
        public capabilityStatus : string;
        private _capabilityStatus;
        public capabilityStatusChanged : boolean;
        private _capabilityStatusChanged;
        public provisioningStatus : string;
        private _provisioningStatus;
        public provisioningStatusChanged : boolean;
        private _provisioningStatusChanged;
        public service : string;
        private _service;
        public serviceChanged : boolean;
        private _serviceChanged;
        static parseProvisionedPlan(data: IProvisionedPlan): ProvisionedPlan;
        static parseProvisionedPlans(data: IProvisionedPlan[]): Extensions.ObservableCollection<ProvisionedPlan>;
        public getRequestBody(): IProvisionedPlan;
    }
    interface IVerifiedDomains {
        value: IVerifiedDomain[];
    }
    interface IVerifiedDomain {
        capabilities: string;
        default: boolean;
        id: string;
        initial: boolean;
        name: string;
        type: string;
    }
    class VerifiedDomain extends Extensions.ComplexTypeBase {
        constructor(data?: IVerifiedDomain);
        public _odataType: string;
        public capabilities : string;
        private _capabilities;
        public capabilitiesChanged : boolean;
        private _capabilitiesChanged;
        public default : boolean;
        private _default;
        public defaultChanged : boolean;
        private _defaultChanged;
        public id : string;
        private _id;
        public idChanged : boolean;
        private _idChanged;
        public initial : boolean;
        private _initial;
        public initialChanged : boolean;
        private _initialChanged;
        public name : string;
        private _name;
        public nameChanged : boolean;
        private _nameChanged;
        public type : string;
        private _type;
        public typeChanged : boolean;
        private _typeChanged;
        static parseVerifiedDomain(data: IVerifiedDomain): VerifiedDomain;
        static parseVerifiedDomains(data: IVerifiedDomain[]): Extensions.ObservableCollection<VerifiedDomain>;
        public getRequestBody(): IVerifiedDomain;
    }
    interface IPasswordProfiles {
        value: IPasswordProfile[];
    }
    interface IPasswordProfile {
        password: string;
        forceChangePasswordNextLogin: boolean;
    }
    class PasswordProfile extends Extensions.ComplexTypeBase {
        constructor(data?: IPasswordProfile);
        public _odataType: string;
        public password : string;
        private _password;
        public passwordChanged : boolean;
        private _passwordChanged;
        public forceChangePasswordNextLogin : boolean;
        private _forceChangePasswordNextLogin;
        public forceChangePasswordNextLoginChanged : boolean;
        private _forceChangePasswordNextLoginChanged;
        static parsePasswordProfile(data: IPasswordProfile): PasswordProfile;
        static parsePasswordProfiles(data: IPasswordProfile[]): Extensions.ObservableCollection<PasswordProfile>;
        public getRequestBody(): IPasswordProfile;
    }
    class EnabledFeatureFetcher extends Extensions.RestShallowObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<EnabledFeature>;
    }
    interface IEnabledFeatures {
        value: IEnabledFeature[];
    }
    interface IEnabledFeature {
        featureId: string;
        featureName: string;
    }
    class EnabledFeature extends Extensions.EntityBase {
        constructor(context?: Extensions.DataContext, path?: string, data?: IEnabledFeature);
        public _odataType: string;
        public featureId : string;
        private _featureId;
        public featureIdChanged : boolean;
        private _featureIdChanged;
        public featureName : string;
        private _featureName;
        public featureNameChanged : boolean;
        private _featureNameChanged;
        public update(): Microsoft.Utility.IPromise<EnabledFeature>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseEnabledFeature(context: Extensions.DataContext, path: string, data: IEnabledFeature): EnabledFeature;
        static parseEnabledFeatures(context: Extensions.DataContext, pathFn: (data: IEnabledFeature) => string, data: IEnabledFeature[]): EnabledFeature[];
        public getRequestBody(): IEnabledFeature;
    }
    class LoginTenantBrandingFetcher extends Extensions.RestShallowObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<LoginTenantBranding>;
    }
    interface ILoginTenantBrandings {
        value: ILoginTenantBranding[];
    }
    interface ILoginTenantBranding {
        backgroundColor: string;
        bannerLogo: string;
        bannerLogoUrl: string;
        boilerPlateText: string;
        illustration: string;
        illustrationUrl: string;
        locale: string;
        metadataUrl: string;
        tileLogo: string;
        tileLogoUrl: string;
        userIdLabel: string;
    }
    class LoginTenantBranding extends Extensions.EntityBase {
        constructor(context?: Extensions.DataContext, path?: string, data?: ILoginTenantBranding);
        public _odataType: string;
        public backgroundColor : string;
        private _backgroundColor;
        public backgroundColorChanged : boolean;
        private _backgroundColorChanged;
        public bannerLogo : string;
        private _bannerLogo;
        public bannerLogoChanged : boolean;
        private _bannerLogoChanged;
        public bannerLogoUrl : string;
        private _bannerLogoUrl;
        public bannerLogoUrlChanged : boolean;
        private _bannerLogoUrlChanged;
        public boilerPlateText : string;
        private _boilerPlateText;
        public boilerPlateTextChanged : boolean;
        private _boilerPlateTextChanged;
        public illustration : string;
        private _illustration;
        public illustrationChanged : boolean;
        private _illustrationChanged;
        public illustrationUrl : string;
        private _illustrationUrl;
        public illustrationUrlChanged : boolean;
        private _illustrationUrlChanged;
        public locale : string;
        private _locale;
        public localeChanged : boolean;
        private _localeChanged;
        public metadataUrl : string;
        private _metadataUrl;
        public metadataUrlChanged : boolean;
        private _metadataUrlChanged;
        public tileLogo : string;
        private _tileLogo;
        public tileLogoChanged : boolean;
        private _tileLogoChanged;
        public tileLogoUrl : string;
        private _tileLogoUrl;
        public tileLogoUrlChanged : boolean;
        private _tileLogoUrlChanged;
        public userIdLabel : string;
        private _userIdLabel;
        public userIdLabelChanged : boolean;
        private _userIdLabelChanged;
        public update(): Microsoft.Utility.IPromise<LoginTenantBranding>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseLoginTenantBranding(context: Extensions.DataContext, path: string, data: ILoginTenantBranding): LoginTenantBranding;
        static parseLoginTenantBrandings(context: Extensions.DataContext, pathFn: (data: ILoginTenantBranding) => string, data: ILoginTenantBranding[]): LoginTenantBranding[];
        public getRequestBody(): ILoginTenantBranding;
    }
    class ImpersonationAccessGrantFetcher extends Extensions.RestShallowObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<ImpersonationAccessGrant>;
    }
    interface IImpersonationAccessGrants {
        value: IImpersonationAccessGrant[];
    }
    interface IImpersonationAccessGrant {
        clientId: string;
        consentType: string;
        expiryTime: string;
        objectId: string;
        principalId: string;
        resourceId: string;
        scope: string;
        startTime: string;
    }
    class ImpersonationAccessGrant extends Extensions.EntityBase {
        constructor(context?: Extensions.DataContext, path?: string, data?: IImpersonationAccessGrant);
        public _odataType: string;
        public clientId : string;
        private _clientId;
        public clientIdChanged : boolean;
        private _clientIdChanged;
        public consentType : string;
        private _consentType;
        public consentTypeChanged : boolean;
        private _consentTypeChanged;
        public expiryTime : Date;
        private _expiryTime;
        public expiryTimeChanged : boolean;
        private _expiryTimeChanged;
        public objectId : string;
        private _objectId;
        public objectIdChanged : boolean;
        private _objectIdChanged;
        public principalId : string;
        private _principalId;
        public principalIdChanged : boolean;
        private _principalIdChanged;
        public resourceId : string;
        private _resourceId;
        public resourceIdChanged : boolean;
        private _resourceIdChanged;
        public scope : string;
        private _scope;
        public scopeChanged : boolean;
        private _scopeChanged;
        public startTime : Date;
        private _startTime;
        public startTimeChanged : boolean;
        private _startTimeChanged;
        public update(): Microsoft.Utility.IPromise<ImpersonationAccessGrant>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseImpersonationAccessGrant(context: Extensions.DataContext, path: string, data: IImpersonationAccessGrant): ImpersonationAccessGrant;
        static parseImpersonationAccessGrants(context: Extensions.DataContext, pathFn: (data: IImpersonationAccessGrant) => string, data: IImpersonationAccessGrant[]): ImpersonationAccessGrant[];
        public getRequestBody(): IImpersonationAccessGrant;
    }
    class SubscribedSkuFetcher extends Extensions.RestShallowObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<SubscribedSku>;
    }
    interface ISubscribedSkus {
        value: ISubscribedSku[];
    }
    interface ISubscribedSku {
        capabilityStatus: string;
        consumedUnits: number;
        objectId: string;
        prepaidUnits: ILicenseUnitsDetail;
        servicePlans: IServicePlanInfo[];
        skuId: string;
        skuPartNumber: string;
    }
    class SubscribedSku extends Extensions.EntityBase {
        constructor(context?: Extensions.DataContext, path?: string, data?: ISubscribedSku);
        public _odataType: string;
        public capabilityStatus : string;
        private _capabilityStatus;
        public capabilityStatusChanged : boolean;
        private _capabilityStatusChanged;
        public consumedUnits : number;
        private _consumedUnits;
        public consumedUnitsChanged : boolean;
        private _consumedUnitsChanged;
        public objectId : string;
        private _objectId;
        public objectIdChanged : boolean;
        private _objectIdChanged;
        public prepaidUnits : LicenseUnitsDetail;
        private _prepaidUnits;
        public prepaidUnitsChanged : boolean;
        private _prepaidUnitsChanged;
        private _prepaidUnitsChangedListener;
        public servicePlans : Extensions.ObservableCollection<ServicePlanInfo>;
        private _servicePlans;
        public servicePlansChanged : boolean;
        private _servicePlansChanged;
        private _servicePlansChangedListener;
        public skuId : string;
        private _skuId;
        public skuIdChanged : boolean;
        private _skuIdChanged;
        public skuPartNumber : string;
        private _skuPartNumber;
        public skuPartNumberChanged : boolean;
        private _skuPartNumberChanged;
        public update(): Microsoft.Utility.IPromise<SubscribedSku>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseSubscribedSku(context: Extensions.DataContext, path: string, data: ISubscribedSku): SubscribedSku;
        static parseSubscribedSkus(context: Extensions.DataContext, pathFn: (data: ISubscribedSku) => string, data: ISubscribedSku[]): SubscribedSku[];
        public getRequestBody(): ISubscribedSku;
    }
    interface ILicenseUnitsDetails {
        value: ILicenseUnitsDetail[];
    }
    interface ILicenseUnitsDetail {
        enabled: number;
        suspended: number;
        warning: number;
    }
    class LicenseUnitsDetail extends Extensions.ComplexTypeBase {
        constructor(data?: ILicenseUnitsDetail);
        public _odataType: string;
        public enabled : number;
        private _enabled;
        public enabledChanged : boolean;
        private _enabledChanged;
        public suspended : number;
        private _suspended;
        public suspendedChanged : boolean;
        private _suspendedChanged;
        public warning : number;
        private _warning;
        public warningChanged : boolean;
        private _warningChanged;
        static parseLicenseUnitsDetail(data: ILicenseUnitsDetail): LicenseUnitsDetail;
        static parseLicenseUnitsDetails(data: ILicenseUnitsDetail[]): Extensions.ObservableCollection<LicenseUnitsDetail>;
        public getRequestBody(): ILicenseUnitsDetail;
    }
    interface IServicePlanInfos {
        value: IServicePlanInfo[];
    }
    interface IServicePlanInfo {
        servicePlanId: string;
        servicePlanName: string;
    }
    class ServicePlanInfo extends Extensions.ComplexTypeBase {
        constructor(data?: IServicePlanInfo);
        public _odataType: string;
        public servicePlanId : string;
        private _servicePlanId;
        public servicePlanIdChanged : boolean;
        private _servicePlanIdChanged;
        public servicePlanName : string;
        private _servicePlanName;
        public servicePlanNameChanged : boolean;
        private _servicePlanNameChanged;
        static parseServicePlanInfo(data: IServicePlanInfo): ServicePlanInfo;
        static parseServicePlanInfos(data: IServicePlanInfo[]): Extensions.ObservableCollection<ServicePlanInfo>;
        public getRequestBody(): IServicePlanInfo;
    }
    class ApplicationRefs extends Extensions.QueryableSet<IApplicationRef> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getApplicationRef(appId: any): ApplicationRefFetcher;
        public getApplicationRefs(): Extensions.CollectionQuery<ApplicationRef>;
        public addApplicationRef(item: ApplicationRef): Microsoft.Utility.IPromise<ApplicationRef>;
    }
    class DirectoryObjects extends Extensions.QueryableSet<IDirectoryObject> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getDirectoryObject(objectId: any): DirectoryObjectFetcher;
        public getDirectoryObjects(): Extensions.CollectionQuery<DirectoryObject>;
        public addDirectoryObject(item: DirectoryObject): Microsoft.Utility.IPromise<DirectoryObject>;
        public asApplications(): Extensions.CollectionQuery<Application>;
        public asUsers(): Extensions.CollectionQuery<User>;
        public asNotifications(): Extensions.CollectionQuery<Notification>;
        public asCollaborationSpaces(): Extensions.CollectionQuery<CollaborationSpace>;
        public asContacts(): Extensions.CollectionQuery<Contact>;
        public asDevices(): Extensions.CollectionQuery<Device>;
        public asDeviceConfigurations(): Extensions.CollectionQuery<DeviceConfiguration>;
        public asDirectoryLinkChanges(): Extensions.CollectionQuery<DirectoryLinkChange>;
        public asDirectAccessGrants(): Extensions.CollectionQuery<DirectAccessGrant>;
        public asGroups(): Extensions.CollectionQuery<Group>;
        public asRoles(): Extensions.CollectionQuery<Role>;
        public asRoleTemplates(): Extensions.CollectionQuery<RoleTemplate>;
        public asServicePrincipals(): Extensions.CollectionQuery<ServicePrincipal>;
        public asTenantDetails(): Extensions.CollectionQuery<TenantDetail>;
    }
    class EnabledFeatures extends Extensions.QueryableSet<IEnabledFeature> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getEnabledFeature(featureId: any): EnabledFeatureFetcher;
        public getEnabledFeatures(): Extensions.CollectionQuery<EnabledFeature>;
        public addEnabledFeature(item: EnabledFeature): Microsoft.Utility.IPromise<EnabledFeature>;
    }
    class LoginTenantBrandings extends Extensions.QueryableSet<ILoginTenantBranding> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getLoginTenantBranding(locale: any): LoginTenantBrandingFetcher;
        public getLoginTenantBrandings(): Extensions.CollectionQuery<LoginTenantBranding>;
        public addLoginTenantBranding(item: LoginTenantBranding): Microsoft.Utility.IPromise<LoginTenantBranding>;
    }
    class ImpersonationAccessGrants extends Extensions.QueryableSet<IImpersonationAccessGrant> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getImpersonationAccessGrant(objectId: any): ImpersonationAccessGrantFetcher;
        public getImpersonationAccessGrants(): Extensions.CollectionQuery<ImpersonationAccessGrant>;
        public addImpersonationAccessGrant(item: ImpersonationAccessGrant): Microsoft.Utility.IPromise<ImpersonationAccessGrant>;
    }
    class SubscribedSkus extends Extensions.QueryableSet<ISubscribedSku> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getSubscribedSku(objectId: any): SubscribedSkuFetcher;
        public getSubscribedSkus(): Extensions.CollectionQuery<SubscribedSku>;
        public addSubscribedSku(item: SubscribedSku): Microsoft.Utility.IPromise<SubscribedSku>;
    }
    class Notifications extends Extensions.QueryableSet<INotification> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getNotification(objectId: any): NotificationFetcher;
        public getNotifications(): Extensions.CollectionQuery<Notification>;
        public addNotification(item: Notification): Microsoft.Utility.IPromise<Notification>;
    }
    class DirectAccessGrants extends Extensions.QueryableSet<IDirectAccessGrant> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getDirectAccessGrant(objectId: any): DirectAccessGrantFetcher;
        public getDirectAccessGrants(): Extensions.CollectionQuery<DirectAccessGrant>;
        public addDirectAccessGrant(item: DirectAccessGrant): Microsoft.Utility.IPromise<DirectAccessGrant>;
    }
}
