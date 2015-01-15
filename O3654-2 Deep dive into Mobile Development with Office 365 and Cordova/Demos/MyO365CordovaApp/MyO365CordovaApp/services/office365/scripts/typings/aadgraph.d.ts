declare module Microsoft.DirectoryServices.Extensions {
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
        public pop(): T;
        public shift(): T;
        public push(...items: T[]): number;
        public splice(start: number, deleteCount: number): T[];
        public unshift(...items: T[]): number;
        public forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;
        public map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];
        public filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[];
        public reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
        public reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
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
        constructor(serviceRootUri: string, extraQueryParameters?: string, getAccessTokenFn?: () => Utility.IPromise<string>);
        public serviceRootUri : string;
        public extraQueryParameters : string;
        public disableCache : boolean;
        public disableCacheOverride : boolean;
        private ajax(request);
        public read(path: string): Utility.IPromise<string>;
        public readUrl(url: string): Utility.IPromise<string>;
        public request(request: Request): Utility.IPromise<string>;
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
        public getNextPage(): Utility.IPromise<PagedCollection<T>>;
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
        public fetch(): Utility.IPromise<PagedCollection<T>>;
        public fetchAll(maxItems: number): Utility.IPromise<T[]>;
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
declare module Microsoft.DirectoryServices {
    class ActiveDirectoryClient {
        private _context;
        public context : Extensions.DataContext;
        private getPath(prop);
        constructor(serviceRootUri: string, getAccessTokenFn: () => Utility.IPromise<string>);
        public directoryObjects : DirectoryObjects;
        private _directoryObjects;
        public oauth2PermissionGrants : OAuth2PermissionGrants;
        private _oauth2PermissionGrants;
        public subscribedSkus : SubscribedSkus;
        private _subscribedSkus;
        public deletedDirectoryObjects : DirectoryObjects;
        private _deletedDirectoryObjects;
        public users : Users;
        private _users;
        public applications : Applications;
        private _applications;
        public contacts : Contacts;
        private _contacts;
        public groups : Groups;
        private _groups;
        public directoryRoles : DirectoryRoles;
        private _directoryRoles;
        public servicePrincipals : ServicePrincipals;
        private _servicePrincipals;
        public tenantDetails : TenantDetails;
        private _tenantDetails;
        public devices : Devices;
        private _devices;
        public isMemberOf(groupId: string, memberId: string): Utility.IPromise<boolean>;
    }
    class DirectoryObjectFetcher extends Extensions.RestShallowObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public createdOnBehalfOf : DirectoryObjectFetcher;
        public update_createdOnBehalfOf(value: DirectoryObject): Utility.IPromise<void>;
        private _createdOnBehalfOf;
        public createdObjects : DirectoryObjects;
        private _createdObjects;
        public manager : DirectoryObjectFetcher;
        public update_manager(value: DirectoryObject): Utility.IPromise<void>;
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
        public fetch(): Utility.IPromise<DirectoryObject>;
        public checkMemberGroups(groupIds: string[]): Utility.IPromise<string[]>;
        public getMemberGroups(securityEnabledOnly: boolean): Utility.IPromise<string[]>;
        public getMemberObjects(securityEnabledOnly: boolean): Utility.IPromise<string[]>;
    }
    interface IDirectoryObjects {
        value: IDirectoryObject[];
    }
    interface IDirectoryObject {
        objectType: string;
        objectId: string;
        deletionTimestamp: string;
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
        public deletionTimestamp : Date;
        private _deletionTimestamp;
        public deletionTimestampChanged : boolean;
        private _deletionTimestampChanged;
        public createdOnBehalfOf : DirectoryObjectFetcher;
        public update_createdOnBehalfOf(value: DirectoryObject): Utility.IPromise<void>;
        private _createdOnBehalfOf;
        public createdObjects : DirectoryObjects;
        private _createdObjects;
        public manager : DirectoryObjectFetcher;
        public update_manager(value: DirectoryObject): Utility.IPromise<void>;
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
        public checkMemberGroups(groupIds: string[]): Utility.IPromise<string[]>;
        public getMemberGroups(securityEnabledOnly: boolean): Utility.IPromise<string[]>;
        public getMemberObjects(securityEnabledOnly: boolean): Utility.IPromise<string[]>;
        public update(): Utility.IPromise<DirectoryObject>;
        public delete(): Utility.IPromise<void>;
        static parseDirectoryObject(context: Extensions.DataContext, path: string, data: IDirectoryObject): DirectoryObject;
        static parseDirectoryObjects(context: Extensions.DataContext, pathFn: (data: IDirectoryObject) => string, data: IDirectoryObject[]): DirectoryObject[];
        public getRequestBody(): IDirectoryObject;
    }
    class ApplicationFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public extensionProperties : ExtensionProperties;
        private _extensionProperties;
        public fetch(): Utility.IPromise<Application>;
        public restore(identifierUris: string[]): Utility.IPromise<Application>;
    }
    interface IApplications {
        value: IApplication[];
    }
    interface IApplication extends IDirectoryObject {
        appId: string;
        appRoles: IAppRole[];
        availableToOtherTenants: boolean;
        displayName: string;
        errorUrl: string;
        groupMembershipClaims: string;
        homepage: string;
        identifierUris: string[];
        keyCredentials: IKeyCredential[];
        knownClientApplications: string[];
        mainLogo: string;
        logoutUrl: string;
        oauth2AllowImplicitFlow: boolean;
        oauth2AllowUrlPathMatching: boolean;
        oauth2Permissions: IOAuth2Permission[];
        oauth2RequirePostResponse: boolean;
        passwordCredentials: IPasswordCredential[];
        publicClient: boolean;
        replyUrls: string[];
        requiredResourceAccess: IRequiredResourceAccess[];
        samlMetadataUrl: string;
    }
    class Application extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IApplication);
        public _odataType: string;
        public appId : string;
        private _appId;
        public appIdChanged : boolean;
        private _appIdChanged;
        public appRoles : Extensions.ObservableCollection<AppRole>;
        private _appRoles;
        public appRolesChanged : boolean;
        private _appRolesChanged;
        private _appRolesChangedListener;
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
        public groupMembershipClaims : string;
        private _groupMembershipClaims;
        public groupMembershipClaimsChanged : boolean;
        private _groupMembershipClaimsChanged;
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
        public knownClientApplications : string[];
        private _knownClientApplications;
        public knownClientApplicationsChanged : boolean;
        private _knownClientApplicationsChanged;
        public mainLogo : string;
        private _mainLogo;
        public mainLogoChanged : boolean;
        private _mainLogoChanged;
        public logoutUrl : string;
        private _logoutUrl;
        public logoutUrlChanged : boolean;
        private _logoutUrlChanged;
        public oauth2AllowImplicitFlow : boolean;
        private _oauth2AllowImplicitFlow;
        public oauth2AllowImplicitFlowChanged : boolean;
        private _oauth2AllowImplicitFlowChanged;
        public oauth2AllowUrlPathMatching : boolean;
        private _oauth2AllowUrlPathMatching;
        public oauth2AllowUrlPathMatchingChanged : boolean;
        private _oauth2AllowUrlPathMatchingChanged;
        public oauth2Permissions : Extensions.ObservableCollection<OAuth2Permission>;
        private _oauth2Permissions;
        public oauth2PermissionsChanged : boolean;
        private _oauth2PermissionsChanged;
        private _oauth2PermissionsChangedListener;
        public oauth2RequirePostResponse : boolean;
        private _oauth2RequirePostResponse;
        public oauth2RequirePostResponseChanged : boolean;
        private _oauth2RequirePostResponseChanged;
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
        public samlMetadataUrl : string;
        private _samlMetadataUrl;
        public samlMetadataUrlChanged : boolean;
        private _samlMetadataUrlChanged;
        public extensionProperties : ExtensionProperties;
        private _extensionProperties;
        public restore(identifierUris: string[]): Utility.IPromise<Application>;
        public update(): Utility.IPromise<Application>;
        public delete(): Utility.IPromise<void>;
        static parseApplication(context: Extensions.DataContext, path: string, data: IApplication): Application;
        static parseApplications(context: Extensions.DataContext, pathFn: (data: IApplication) => string, data: IApplication[]): Application[];
        public getRequestBody(): IApplication;
    }
    class UserFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public appRoleAssignments : AppRoleAssignments;
        private _appRoleAssignments;
        public oauth2PermissionGrants : OAuth2PermissionGrants;
        private _oauth2PermissionGrants;
        public ownedDevices : DirectoryObjects;
        private _ownedDevices;
        public registeredDevices : DirectoryObjects;
        private _registeredDevices;
        public fetch(): Utility.IPromise<User>;
        public assignLicense(addLicenses: AssignedLicense[], removeLicenses: string[]): Utility.IPromise<User>;
    }
    interface IUsers {
        value: IUser[];
    }
    interface IUser extends IDirectoryObject {
        accountEnabled: boolean;
        assignedLicenses: IAssignedLicense[];
        assignedPlans: IAssignedPlan[];
        city: string;
        country: string;
        department: string;
        dirSyncEnabled: boolean;
        displayName: string;
        facsimileTelephoneNumber: string;
        givenName: string;
        immutableId: string;
        jobTitle: string;
        lastDirSyncTime: string;
        mail: string;
        mailNickname: string;
        mobile: string;
        onPremisesSecurityIdentifier: string;
        otherMails: string[];
        passwordPolicies: string;
        passwordProfile: IPasswordProfile;
        physicalDeliveryOfficeName: string;
        postalCode: string;
        preferredLanguage: string;
        provisionedPlans: IProvisionedPlan[];
        provisioningErrors: IProvisioningError[];
        proxyAddresses: string[];
        sipProxyAddress: string;
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
        public onPremisesSecurityIdentifier : string;
        private _onPremisesSecurityIdentifier;
        public onPremisesSecurityIdentifierChanged : boolean;
        private _onPremisesSecurityIdentifierChanged;
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
        public appRoleAssignments : AppRoleAssignments;
        private _appRoleAssignments;
        public oauth2PermissionGrants : OAuth2PermissionGrants;
        private _oauth2PermissionGrants;
        public ownedDevices : DirectoryObjects;
        private _ownedDevices;
        public registeredDevices : DirectoryObjects;
        private _registeredDevices;
        public assignLicense(addLicenses: AssignedLicense[], removeLicenses: string[]): Utility.IPromise<User>;
        public update(): Utility.IPromise<User>;
        public delete(): Utility.IPromise<void>;
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
    class ExtensionPropertyFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Utility.IPromise<ExtensionProperty>;
    }
    interface IExtensionProperties {
        value: IExtensionProperty[];
    }
    interface IExtensionProperty extends IDirectoryObject {
        appDisplayName: string;
        name: string;
        dataType: string;
        isSyncedFromOnPremises: boolean;
        targetObjects: string[];
    }
    class ExtensionProperty extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IExtensionProperty);
        public _odataType: string;
        public appDisplayName : string;
        private _appDisplayName;
        public appDisplayNameChanged : boolean;
        private _appDisplayNameChanged;
        public name : string;
        private _name;
        public nameChanged : boolean;
        private _nameChanged;
        public dataType : string;
        private _dataType;
        public dataTypeChanged : boolean;
        private _dataTypeChanged;
        public isSyncedFromOnPremises : boolean;
        private _isSyncedFromOnPremises;
        public isSyncedFromOnPremisesChanged : boolean;
        private _isSyncedFromOnPremisesChanged;
        public targetObjects : string[];
        private _targetObjects;
        public targetObjectsChanged : boolean;
        private _targetObjectsChanged;
        public update(): Utility.IPromise<ExtensionProperty>;
        public delete(): Utility.IPromise<void>;
        static parseExtensionProperty(context: Extensions.DataContext, path: string, data: IExtensionProperty): ExtensionProperty;
        static parseExtensionProperties(context: Extensions.DataContext, pathFn: (data: IExtensionProperty) => string, data: IExtensionProperty[]): ExtensionProperty[];
        public getRequestBody(): IExtensionProperty;
    }
    interface IAppRoles {
        value: IAppRole[];
    }
    interface IAppRole {
        allowedMemberTypes: string[];
        description: string;
        displayName: string;
        id: string;
        isEnabled: boolean;
        value: string;
    }
    class AppRole extends Extensions.ComplexTypeBase {
        constructor(data?: IAppRole);
        public _odataType: string;
        public allowedMemberTypes : string[];
        private _allowedMemberTypes;
        public allowedMemberTypesChanged : boolean;
        private _allowedMemberTypesChanged;
        public description : string;
        private _description;
        public descriptionChanged : boolean;
        private _descriptionChanged;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        public id : string;
        private _id;
        public idChanged : boolean;
        private _idChanged;
        public isEnabled : boolean;
        private _isEnabled;
        public isEnabledChanged : boolean;
        private _isEnabledChanged;
        public value : string;
        private _value;
        public valueChanged : boolean;
        private _valueChanged;
        static parseAppRole(data: IAppRole): AppRole;
        static parseAppRoles(data: IAppRole[]): Extensions.ObservableCollection<AppRole>;
        public getRequestBody(): IAppRole;
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
    interface IOAuth2Permissions {
        value: IOAuth2Permission[];
    }
    interface IOAuth2Permission {
        adminConsentDescription: string;
        adminConsentDisplayName: string;
        id: string;
        isEnabled: boolean;
        type: string;
        userConsentDescription: string;
        userConsentDisplayName: string;
        value: string;
    }
    class OAuth2Permission extends Extensions.ComplexTypeBase {
        constructor(data?: IOAuth2Permission);
        public _odataType: string;
        public adminConsentDescription : string;
        private _adminConsentDescription;
        public adminConsentDescriptionChanged : boolean;
        private _adminConsentDescriptionChanged;
        public adminConsentDisplayName : string;
        private _adminConsentDisplayName;
        public adminConsentDisplayNameChanged : boolean;
        private _adminConsentDisplayNameChanged;
        public id : string;
        private _id;
        public idChanged : boolean;
        private _idChanged;
        public isEnabled : boolean;
        private _isEnabled;
        public isEnabledChanged : boolean;
        private _isEnabledChanged;
        public type : string;
        private _type;
        public typeChanged : boolean;
        private _typeChanged;
        public userConsentDescription : string;
        private _userConsentDescription;
        public userConsentDescriptionChanged : boolean;
        private _userConsentDescriptionChanged;
        public userConsentDisplayName : string;
        private _userConsentDisplayName;
        public userConsentDisplayNameChanged : boolean;
        private _userConsentDisplayNameChanged;
        public value : string;
        private _value;
        public valueChanged : boolean;
        private _valueChanged;
        static parseOAuth2Permission(data: IOAuth2Permission): OAuth2Permission;
        static parseOAuth2Permissions(data: IOAuth2Permission[]): Extensions.ObservableCollection<OAuth2Permission>;
        public getRequestBody(): IOAuth2Permission;
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
    interface IRequiredResourceAccesses {
        value: IRequiredResourceAccess[];
    }
    interface IRequiredResourceAccess {
        resourceAppId: string;
        resourceAccess: IResourceAccess[];
    }
    class RequiredResourceAccess extends Extensions.ComplexTypeBase {
        constructor(data?: IRequiredResourceAccess);
        public _odataType: string;
        public resourceAppId : string;
        private _resourceAppId;
        public resourceAppIdChanged : boolean;
        private _resourceAppIdChanged;
        public resourceAccess : Extensions.ObservableCollection<ResourceAccess>;
        private _resourceAccess;
        public resourceAccessChanged : boolean;
        private _resourceAccessChanged;
        private _resourceAccessChangedListener;
        static parseRequiredResourceAccess(data: IRequiredResourceAccess): RequiredResourceAccess;
        static parseRequiredResourceAccesses(data: IRequiredResourceAccess[]): Extensions.ObservableCollection<RequiredResourceAccess>;
        public getRequestBody(): IRequiredResourceAccess;
    }
    interface IResourceAccesses {
        value: IResourceAccess[];
    }
    interface IResourceAccess {
        id: string;
        type: string;
    }
    class ResourceAccess extends Extensions.ComplexTypeBase {
        constructor(data?: IResourceAccess);
        public _odataType: string;
        public id : string;
        private _id;
        public idChanged : boolean;
        private _idChanged;
        public type : string;
        private _type;
        public typeChanged : boolean;
        private _typeChanged;
        static parseResourceAccess(data: IResourceAccess): ResourceAccess;
        static parseResourceAccesses(data: IResourceAccess[]): Extensions.ObservableCollection<ResourceAccess>;
        public getRequestBody(): IResourceAccess;
    }
    class ContactFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Utility.IPromise<Contact>;
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
        public update(): Utility.IPromise<Contact>;
        public delete(): Utility.IPromise<void>;
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
        public fetch(): Utility.IPromise<Device>;
    }
    interface IDevices {
        value: IDevice[];
    }
    interface IDevice extends IDirectoryObject {
        accountEnabled: boolean;
        alternativeSecurityIds: IAlternativeSecurityId[];
        approximateLastLogonTimestamp: string;
        deviceId: string;
        deviceMetadata: string;
        deviceObjectVersion: number;
        deviceOSType: string;
        deviceOSVersion: string;
        devicePhysicalIds: string[];
        deviceTrustType: string;
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
        public deviceMetadata : string;
        private _deviceMetadata;
        public deviceMetadataChanged : boolean;
        private _deviceMetadataChanged;
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
        public deviceTrustType : string;
        private _deviceTrustType;
        public deviceTrustTypeChanged : boolean;
        private _deviceTrustTypeChanged;
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
        public update(): Utility.IPromise<Device>;
        public delete(): Utility.IPromise<void>;
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
        public fetch(): Utility.IPromise<DeviceConfiguration>;
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
        public update(): Utility.IPromise<DeviceConfiguration>;
        public delete(): Utility.IPromise<void>;
        static parseDeviceConfiguration(context: Extensions.DataContext, path: string, data: IDeviceConfiguration): DeviceConfiguration;
        static parseDeviceConfigurations(context: Extensions.DataContext, pathFn: (data: IDeviceConfiguration) => string, data: IDeviceConfiguration[]): DeviceConfiguration[];
        public getRequestBody(): IDeviceConfiguration;
    }
    class DirectoryLinkChangeFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Utility.IPromise<DirectoryLinkChange>;
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
        public update(): Utility.IPromise<DirectoryLinkChange>;
        public delete(): Utility.IPromise<void>;
        static parseDirectoryLinkChange(context: Extensions.DataContext, path: string, data: IDirectoryLinkChange): DirectoryLinkChange;
        static parseDirectoryLinkChanges(context: Extensions.DataContext, pathFn: (data: IDirectoryLinkChange) => string, data: IDirectoryLinkChange[]): DirectoryLinkChange[];
        public getRequestBody(): IDirectoryLinkChange;
    }
    class AppRoleAssignmentFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Utility.IPromise<AppRoleAssignment>;
    }
    interface IAppRoleAssignments {
        value: IAppRoleAssignment[];
    }
    interface IAppRoleAssignment extends IDirectoryObject {
        creationTimestamp: string;
        id: string;
        principalDisplayName: string;
        principalId: string;
        principalType: string;
        resourceDisplayName: string;
        resourceId: string;
    }
    class AppRoleAssignment extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IAppRoleAssignment);
        public _odataType: string;
        public creationTimestamp : Date;
        private _creationTimestamp;
        public creationTimestampChanged : boolean;
        private _creationTimestampChanged;
        public id : string;
        private _id;
        public idChanged : boolean;
        private _idChanged;
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
        public update(): Utility.IPromise<AppRoleAssignment>;
        public delete(): Utility.IPromise<void>;
        static parseAppRoleAssignment(context: Extensions.DataContext, path: string, data: IAppRoleAssignment): AppRoleAssignment;
        static parseAppRoleAssignments(context: Extensions.DataContext, pathFn: (data: IAppRoleAssignment) => string, data: IAppRoleAssignment[]): AppRoleAssignment[];
        public getRequestBody(): IAppRoleAssignment;
    }
    class GroupFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public appRoleAssignments : AppRoleAssignments;
        private _appRoleAssignments;
        public fetch(): Utility.IPromise<Group>;
    }
    interface IGroups {
        value: IGroup[];
    }
    interface IGroup extends IDirectoryObject {
        description: string;
        dirSyncEnabled: boolean;
        displayName: string;
        lastDirSyncTime: string;
        mail: string;
        mailNickname: string;
        mailEnabled: boolean;
        onPremisesSecurityIdentifier: string;
        provisioningErrors: IProvisioningError[];
        proxyAddresses: string[];
        securityEnabled: boolean;
    }
    class Group extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IGroup);
        public _odataType: string;
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
        public onPremisesSecurityIdentifier : string;
        private _onPremisesSecurityIdentifier;
        public onPremisesSecurityIdentifierChanged : boolean;
        private _onPremisesSecurityIdentifierChanged;
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
        public appRoleAssignments : AppRoleAssignments;
        private _appRoleAssignments;
        public update(): Utility.IPromise<Group>;
        public delete(): Utility.IPromise<void>;
        static parseGroup(context: Extensions.DataContext, path: string, data: IGroup): Group;
        static parseGroups(context: Extensions.DataContext, pathFn: (data: IGroup) => string, data: IGroup[]): Group[];
        public getRequestBody(): IGroup;
    }
    class DirectoryRoleFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Utility.IPromise<DirectoryRole>;
    }
    interface IDirectoryRoles {
        value: IDirectoryRole[];
    }
    interface IDirectoryRole extends IDirectoryObject {
        description: string;
        displayName: string;
        isSystem: boolean;
        roleDisabled: boolean;
        roleTemplateId: string;
    }
    class DirectoryRole extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IDirectoryRole);
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
        public roleTemplateId : string;
        private _roleTemplateId;
        public roleTemplateIdChanged : boolean;
        private _roleTemplateIdChanged;
        public update(): Utility.IPromise<DirectoryRole>;
        public delete(): Utility.IPromise<void>;
        static parseDirectoryRole(context: Extensions.DataContext, path: string, data: IDirectoryRole): DirectoryRole;
        static parseDirectoryRoles(context: Extensions.DataContext, pathFn: (data: IDirectoryRole) => string, data: IDirectoryRole[]): DirectoryRole[];
        public getRequestBody(): IDirectoryRole;
    }
    class DirectoryRoleTemplateFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Utility.IPromise<DirectoryRoleTemplate>;
    }
    interface IDirectoryRoleTemplates {
        value: IDirectoryRoleTemplate[];
    }
    interface IDirectoryRoleTemplate extends IDirectoryObject {
        description: string;
        displayName: string;
    }
    class DirectoryRoleTemplate extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IDirectoryRoleTemplate);
        public _odataType: string;
        public description : string;
        private _description;
        public descriptionChanged : boolean;
        private _descriptionChanged;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        public update(): Utility.IPromise<DirectoryRoleTemplate>;
        public delete(): Utility.IPromise<void>;
        static parseDirectoryRoleTemplate(context: Extensions.DataContext, path: string, data: IDirectoryRoleTemplate): DirectoryRoleTemplate;
        static parseDirectoryRoleTemplates(context: Extensions.DataContext, pathFn: (data: IDirectoryRoleTemplate) => string, data: IDirectoryRoleTemplate[]): DirectoryRoleTemplate[];
        public getRequestBody(): IDirectoryRoleTemplate;
    }
    class ServicePrincipalFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public appRoleAssignedTo : AppRoleAssignments;
        private _appRoleAssignedTo;
        public appRoleAssignments : AppRoleAssignments;
        private _appRoleAssignments;
        public oauth2PermissionGrants : OAuth2PermissionGrants;
        private _oauth2PermissionGrants;
        public fetch(): Utility.IPromise<ServicePrincipal>;
    }
    interface IServicePrincipals {
        value: IServicePrincipal[];
    }
    interface IServicePrincipal extends IDirectoryObject {
        accountEnabled: boolean;
        appDisplayName: string;
        appId: string;
        appOwnerTenantId: string;
        appRoleAssignmentRequired: boolean;
        appRoles: IAppRole[];
        displayName: string;
        errorUrl: string;
        homepage: string;
        keyCredentials: IKeyCredential[];
        logoutUrl: string;
        oauth2Permissions: IOAuth2Permission[];
        passwordCredentials: IPasswordCredential[];
        preferredTokenSigningKeyThumbprint: string;
        publisherName: string;
        replyUrls: string[];
        samlMetadataUrl: string;
        servicePrincipalNames: string[];
        tags: string[];
    }
    class ServicePrincipal extends DirectoryObject {
        constructor(context?: Extensions.DataContext, path?: string, data?: IServicePrincipal);
        public _odataType: string;
        public accountEnabled : boolean;
        private _accountEnabled;
        public accountEnabledChanged : boolean;
        private _accountEnabledChanged;
        public appDisplayName : string;
        private _appDisplayName;
        public appDisplayNameChanged : boolean;
        private _appDisplayNameChanged;
        public appId : string;
        private _appId;
        public appIdChanged : boolean;
        private _appIdChanged;
        public appOwnerTenantId : string;
        private _appOwnerTenantId;
        public appOwnerTenantIdChanged : boolean;
        private _appOwnerTenantIdChanged;
        public appRoleAssignmentRequired : boolean;
        private _appRoleAssignmentRequired;
        public appRoleAssignmentRequiredChanged : boolean;
        private _appRoleAssignmentRequiredChanged;
        public appRoles : Extensions.ObservableCollection<AppRole>;
        private _appRoles;
        public appRolesChanged : boolean;
        private _appRolesChanged;
        private _appRolesChangedListener;
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
        public keyCredentials : Extensions.ObservableCollection<KeyCredential>;
        private _keyCredentials;
        public keyCredentialsChanged : boolean;
        private _keyCredentialsChanged;
        private _keyCredentialsChangedListener;
        public logoutUrl : string;
        private _logoutUrl;
        public logoutUrlChanged : boolean;
        private _logoutUrlChanged;
        public oauth2Permissions : Extensions.ObservableCollection<OAuth2Permission>;
        private _oauth2Permissions;
        public oauth2PermissionsChanged : boolean;
        private _oauth2PermissionsChanged;
        private _oauth2PermissionsChangedListener;
        public passwordCredentials : Extensions.ObservableCollection<PasswordCredential>;
        private _passwordCredentials;
        public passwordCredentialsChanged : boolean;
        private _passwordCredentialsChanged;
        private _passwordCredentialsChangedListener;
        public preferredTokenSigningKeyThumbprint : string;
        private _preferredTokenSigningKeyThumbprint;
        public preferredTokenSigningKeyThumbprintChanged : boolean;
        private _preferredTokenSigningKeyThumbprintChanged;
        public publisherName : string;
        private _publisherName;
        public publisherNameChanged : boolean;
        private _publisherNameChanged;
        public replyUrls : string[];
        private _replyUrls;
        public replyUrlsChanged : boolean;
        private _replyUrlsChanged;
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
        public appRoleAssignedTo : AppRoleAssignments;
        private _appRoleAssignedTo;
        public appRoleAssignments : AppRoleAssignments;
        private _appRoleAssignments;
        public oauth2PermissionGrants : OAuth2PermissionGrants;
        private _oauth2PermissionGrants;
        public update(): Utility.IPromise<ServicePrincipal>;
        public delete(): Utility.IPromise<void>;
        static parseServicePrincipal(context: Extensions.DataContext, path: string, data: IServicePrincipal): ServicePrincipal;
        static parseServicePrincipals(context: Extensions.DataContext, pathFn: (data: IServicePrincipal) => string, data: IServicePrincipal[]): ServicePrincipal[];
        public getRequestBody(): IServicePrincipal;
    }
    class TenantDetailFetcher extends DirectoryObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Utility.IPromise<TenantDetail>;
    }
    interface ITenantDetails {
        value: ITenantDetail[];
    }
    interface ITenantDetail extends IDirectoryObject {
        assignedPlans: IAssignedPlan[];
        city: string;
        companyLastDirSyncTime: string;
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
        public verifiedDomains : Extensions.ObservableCollection<VerifiedDomain>;
        private _verifiedDomains;
        public verifiedDomainsChanged : boolean;
        private _verifiedDomainsChanged;
        private _verifiedDomainsChangedListener;
        public update(): Utility.IPromise<TenantDetail>;
        public delete(): Utility.IPromise<void>;
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
    class OAuth2PermissionGrantFetcher extends Extensions.RestShallowObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Utility.IPromise<OAuth2PermissionGrant>;
    }
    interface IOAuth2PermissionGrants {
        value: IOAuth2PermissionGrant[];
    }
    interface IOAuth2PermissionGrant {
        clientId: string;
        consentType: string;
        expiryTime: string;
        objectId: string;
        principalId: string;
        resourceId: string;
        scope: string;
        startTime: string;
    }
    class OAuth2PermissionGrant extends Extensions.EntityBase {
        constructor(context?: Extensions.DataContext, path?: string, data?: IOAuth2PermissionGrant);
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
        public update(): Utility.IPromise<OAuth2PermissionGrant>;
        public delete(): Utility.IPromise<void>;
        static parseOAuth2PermissionGrant(context: Extensions.DataContext, path: string, data: IOAuth2PermissionGrant): OAuth2PermissionGrant;
        static parseOAuth2PermissionGrants(context: Extensions.DataContext, pathFn: (data: IOAuth2PermissionGrant) => string, data: IOAuth2PermissionGrant[]): OAuth2PermissionGrant[];
        public getRequestBody(): IOAuth2PermissionGrant;
    }
    class SubscribedSkuFetcher extends Extensions.RestShallowObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Utility.IPromise<SubscribedSku>;
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
        public update(): Utility.IPromise<SubscribedSku>;
        public delete(): Utility.IPromise<void>;
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
    class DirectoryObjects extends Extensions.QueryableSet<IDirectoryObject> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getDirectoryObject(objectId: any): DirectoryObjectFetcher;
        public getDirectoryObjects(): Extensions.CollectionQuery<DirectoryObject>;
        public addDirectoryObject(item: DirectoryObject): Utility.IPromise<DirectoryObject>;
        public asApplications(): Extensions.CollectionQuery<Application>;
        public asUsers(): Extensions.CollectionQuery<User>;
        public asExtensionProperties(): Extensions.CollectionQuery<ExtensionProperty>;
        public asContacts(): Extensions.CollectionQuery<Contact>;
        public asDevices(): Extensions.CollectionQuery<Device>;
        public asDeviceConfigurations(): Extensions.CollectionQuery<DeviceConfiguration>;
        public asDirectoryLinkChanges(): Extensions.CollectionQuery<DirectoryLinkChange>;
        public asAppRoleAssignments(): Extensions.CollectionQuery<AppRoleAssignment>;
        public asGroups(): Extensions.CollectionQuery<Group>;
        public asDirectoryRoles(): Extensions.CollectionQuery<DirectoryRole>;
        public asDirectoryRoleTemplates(): Extensions.CollectionQuery<DirectoryRoleTemplate>;
        public asServicePrincipals(): Extensions.CollectionQuery<ServicePrincipal>;
        public asTenantDetails(): Extensions.CollectionQuery<TenantDetail>;
    }
    class OAuth2PermissionGrants extends Extensions.QueryableSet<IOAuth2PermissionGrant> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getOAuth2PermissionGrant(objectId: any): OAuth2PermissionGrantFetcher;
        public getOAuth2PermissionGrants(): Extensions.CollectionQuery<OAuth2PermissionGrant>;
        public addOAuth2PermissionGrant(item: OAuth2PermissionGrant): Utility.IPromise<OAuth2PermissionGrant>;
    }
    class SubscribedSkus extends Extensions.QueryableSet<ISubscribedSku> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getSubscribedSku(objectId: any): SubscribedSkuFetcher;
        public getSubscribedSkus(): Extensions.CollectionQuery<SubscribedSku>;
        public addSubscribedSku(item: SubscribedSku): Utility.IPromise<SubscribedSku>;
    }
    class Users extends Extensions.QueryableSet<IUser> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getUser(objectId: any): UserFetcher;
        public getUsers(): Extensions.CollectionQuery<User>;
        public addUser(item: User): Utility.IPromise<User>;
    }
    class Applications extends Extensions.QueryableSet<IApplication> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getApplication(objectId: any): ApplicationFetcher;
        public getApplications(): Extensions.CollectionQuery<Application>;
        public addApplication(item: Application): Utility.IPromise<Application>;
    }
    class Contacts extends Extensions.QueryableSet<IContact> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getContact(objectId: any): ContactFetcher;
        public getContacts(): Extensions.CollectionQuery<Contact>;
        public addContact(item: Contact): Utility.IPromise<Contact>;
    }
    class Groups extends Extensions.QueryableSet<IGroup> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getGroup(objectId: any): GroupFetcher;
        public getGroups(): Extensions.CollectionQuery<Group>;
        public addGroup(item: Group): Utility.IPromise<Group>;
    }
    class DirectoryRoles extends Extensions.QueryableSet<IDirectoryRole> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getDirectoryRole(objectId: any): DirectoryRoleFetcher;
        public getDirectoryRoles(): Extensions.CollectionQuery<DirectoryRole>;
        public addDirectoryRole(item: DirectoryRole): Utility.IPromise<DirectoryRole>;
    }
    class ServicePrincipals extends Extensions.QueryableSet<IServicePrincipal> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getServicePrincipal(objectId: any): ServicePrincipalFetcher;
        public getServicePrincipals(): Extensions.CollectionQuery<ServicePrincipal>;
        public addServicePrincipal(item: ServicePrincipal): Utility.IPromise<ServicePrincipal>;
    }
    class TenantDetails extends Extensions.QueryableSet<ITenantDetail> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getTenantDetail(objectId: any): TenantDetailFetcher;
        public getTenantDetails(): Extensions.CollectionQuery<TenantDetail>;
        public addTenantDetail(item: TenantDetail): Utility.IPromise<TenantDetail>;
    }
    class Devices extends Extensions.QueryableSet<IDevice> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getDevice(objectId: any): DeviceFetcher;
        public getDevices(): Extensions.CollectionQuery<Device>;
        public addDevice(item: Device): Utility.IPromise<Device>;
    }
    class ExtensionProperties extends Extensions.QueryableSet<IExtensionProperty> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getExtensionProperty(objectId: any): ExtensionPropertyFetcher;
        public getExtensionProperties(): Extensions.CollectionQuery<ExtensionProperty>;
        public addExtensionProperty(item: ExtensionProperty): Utility.IPromise<ExtensionProperty>;
    }
    class AppRoleAssignments extends Extensions.QueryableSet<IAppRoleAssignment> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getAppRoleAssignment(objectId: any): AppRoleAssignmentFetcher;
        public getAppRoleAssignments(): Extensions.CollectionQuery<AppRoleAssignment>;
        public addAppRoleAssignment(item: AppRoleAssignment): Utility.IPromise<AppRoleAssignment>;
    }
}
