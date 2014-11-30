declare module Microsoft.Utility {
    module EncodingHelpers {
        interface Literal {
            value: any;
            name: string;
            type: string;
        }
        function getKeyExpression(entityKeys: Literal[]): string;
        function formatLiteral(literal: Literal): string;
    }
    function findProperties(o: any): string[];
    function decodeBase64AsHexString(base64: string): string;
    function decodeBase64(base64: string): number[];
    function decodeBase64AsString(base64: string): string;
    class Exception {
        private _message;
        private _innerException;
        private _stackTrace;
        constructor(message: string, innerException?: Exception);
        public message : string;
        public innerException : Exception;
    }
    class HttpException extends Exception {
        private _xhr;
        constructor(XHR: XMLHttpRequest, innerException?: Exception);
        private getHeadersFn(xhr);
        public getHeaders: (string?: any) => string;
        public xhr : XMLHttpRequest;
    }
    interface IPromise<T> {
        then(onFulfilled: (value: T) => any, onRejected?: (reason: any) => any): IPromise<T>;
    }
    interface IDeferred<T> extends IPromise<T> {
        then(onFulfilled: (value: T) => any, onRejected?: (reason: any) => any, onProgress?: (progress: any) => any): IPromise<T>;
        resolve(value?: T): any;
        reject(reason?: any): any;
        notify(progress: any): any;
    }
    class Deferred<T> implements IDeferred<T> {
        private _fulfilled;
        private _rejected;
        private _progress;
        private _state;
        private _value;
        private _reason;
        constructor();
        public then(onFulfilled: (value: T) => any, onRejected?: (reason: any) => any, onProgress?: (progress: any) => any): IPromise<T>;
        private detach();
        public resolve(value?: T): any;
        public reject(reason?: any): any;
        public notify(progress?: any): any;
    }
    module HttpHelpers {
        class Request {
            public requestUri: string;
            public method: string;
            public data: any;
            public headers: {
                [name: string]: string;
            };
            public disableCache: boolean;
            constructor(requestUri: string, method?: string, data?: any);
        }
        class AuthenticatedHttp {
            private _getAccessTokenFn;
            private _disableCache;
            private _noCache;
            private _accept;
            private _contentType;
            constructor(getAccessTokenFn: () => IPromise<string>);
            public disableCache : boolean;
            public accept : string;
            public contentType : string;
            private ajax(request);
            public getUrl(url: string): IPromise<string>;
            public postUrl(url: string, data: any): IPromise<string>;
            public deleteUrl(url: string): IPromise<string>;
            public patchUrl(url: string, data: any): IPromise<string>;
            public request(request: Request): IPromise<string>;
            private augmentRequest(request);
        }
    }
}
