declare module O365Discovery {
    var deferred: <T>() => Microsoft.Utility.IDeferred<T>;
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
    var capabilityScopes: {
        AllSites: {
            Read: string;
            Write: string;
            Manage: string;
            FullControl: string;
        };
        MyFiles: {
            Read: string;
            Write: string;
        };
        user_impersonation: string;
        full_access: string;
        Mail: {
            Read: string;
            Write: string;
            Sent: string;
        };
        Calendars: {
            Read: string;
            Write: string;
        };
        Contacts: {
            Read: string;
            Write: string;
        };
    };
    enum AccountType {
        MicrosoftAccount = 1,
        OrganizationalId = 2,
    }
    interface IFirstSignIn {
        user_email: string;
        account_type: AccountType;
        authorization_service: string;
        token_service: string;
        scope: string;
        unsupported_scope: string;
        discovery_service: string;
        discovery_resource: string;
    }
    interface ICapabilityResult {
        Capability: string;
        EntityKey: string;
        ProviderId: string;
        ProviderName: string;
        ServiceAccountType: AccountType;
        ServiceEndpointUri: string;
        ServiceId: string;
        ServiceName: string;
        ServiceResourceId: string;
    }
    class ServiceCapability {
        private _result;
        constructor(result: ICapabilityResult);
        public capability : string;
        public endpointUri : string;
        public name : string;
        public resourceId : string;
    }
    class Context {
        private _discoveryUri;
        private _redirectUri;
        constructor(redirectUri?: string);
        private getDeferred<T>();
        private ajax(request);
        private getParameterByName(url, name);
        public firstSignIn(scopes: string, redirectUri?: string): Microsoft.Utility.IPromise<IFirstSignIn>;
        public services(getAccessTokenFn: () => Microsoft.Utility.IPromise<string>): Microsoft.Utility.IPromise<ServiceCapability[]>;
        public allServices(): void;
    }
}
