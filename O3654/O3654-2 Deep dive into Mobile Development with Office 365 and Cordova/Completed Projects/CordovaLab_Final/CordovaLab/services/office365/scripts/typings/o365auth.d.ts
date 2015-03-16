declare module O365Auth {
    class Token {
        private _idToken;
        private _context;
        private _clientId;
        private _redirectUri;
        private _resourceId;
        constructor(idToken: string, context: Context, resourceId: string, clientId?: string, redirectUri?: string);
        private getDeferred<T>();
        public getAccessTokenFn(resourceId?: string): () => Microsoft.Utility.IPromise<string>;
        public getAccessToken(resourceId: string): Microsoft.Utility.IPromise<string>;
        public audience : string;
        public familyName : string;
        public givenName : string;
        public identityProvider : string;
        public objectId : string;
        public tenantId : string;
        public uniqueName : string;
        public userPrincipalName : string;
    }
    var deferred: <T>() => Microsoft.Utility.IDeferred<T>;
    class Context {
        private _authUri;
        private _redirectUri;
        private _cacheManager;
        constructor(authUri?: string, redirectUri?: string);
        private getDeferred<T>();
        private ajax(url, data?, verb?);
        private post(url, data);
        private getParameterByName(url, name);
        private getAccessTokenFromRefreshToken(resourceId, refreshToken, clientId);
        public isLoginRequired(resourceId?: string, clientId?: string): boolean;
        public getAccessToken(resourceId: string, loginHint?: string, clientId?: string, redirectUri?: string): Microsoft.Utility.IPromise<string>;
        public getAccessTokenFn(resourceId: string, loginHint?: string, clientId?: string, redirectUri?: string): () => Microsoft.Utility.IPromise<string>;
        public getIdToken(resourceId: string, loginHint?: string, clientId?: string, redirectUri?: string): Microsoft.Utility.IPromise<Token>;
        public logOut(clientId?: string): Microsoft.Utility.IPromise<void>;
    }
}
