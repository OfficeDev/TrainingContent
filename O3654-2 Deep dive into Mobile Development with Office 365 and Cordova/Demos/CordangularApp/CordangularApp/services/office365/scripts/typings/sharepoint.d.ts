declare module Microsoft.CoreServices.Extensions {
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
declare module Microsoft.CoreServices {
    class SharePointClient {
        private _context;
        public context : Extensions.DataContext;
        private getPath(prop);
        constructor(serviceRootUri: string, getAccessTokenFn: () => Utility.IPromise<string>);
        public files : FileServices.Items;
        private _files;
        public addTofiles(item: FileServices.Item): void;
        public drive : FileServices.DriveFetcher;
        private _drive;
        public me : CurrentUserRequestContextFetcher;
        private _me;
    }
    class CurrentUserRequestContextFetcher extends Extensions.RestShallowObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public drive : FileServices.DriveFetcher;
        public update_drive(value: FileServices.Drive): Utility.IPromise<void>;
        private _drive;
        public files : FileServices.Items;
        private _files;
        public fetch(): Utility.IPromise<CurrentUserRequestContext>;
    }
    interface ICurrentUserRequestContexts {
        value: ICurrentUserRequestContext[];
    }
    interface ICurrentUserRequestContext {
        id: string;
    }
    class CurrentUserRequestContext extends Extensions.EntityBase {
        constructor(context?: Extensions.DataContext, path?: string, data?: ICurrentUserRequestContext);
        public _odataType: string;
        public id : string;
        private _id;
        public idChanged : boolean;
        private _idChanged;
        public drive : FileServices.DriveFetcher;
        public update_drive(value: FileServices.Drive): Utility.IPromise<void>;
        private _drive;
        public files : FileServices.Items;
        private _files;
        public update(): Utility.IPromise<CurrentUserRequestContext>;
        public delete(): Utility.IPromise<void>;
        static parseCurrentUserRequestContext(context: Extensions.DataContext, path: string, data: ICurrentUserRequestContext): CurrentUserRequestContext;
        static parseCurrentUserRequestContexts(context: Extensions.DataContext, pathFn: (data: ICurrentUserRequestContext) => string, data: ICurrentUserRequestContext[]): CurrentUserRequestContext[];
        public getRequestBody(): ICurrentUserRequestContext;
    }
}
declare module Microsoft.FileServices {
    interface IDriveQuotas {
        value: IDriveQuota[];
    }
    interface IDriveQuota {
        deleted: number;
        remaining: number;
        state: string;
        total: number;
    }
    class DriveQuota extends CoreServices.Extensions.ComplexTypeBase {
        constructor(data?: IDriveQuota);
        public _odataType: string;
        public deleted : number;
        private _deleted;
        public deletedChanged : boolean;
        private _deletedChanged;
        public remaining : number;
        private _remaining;
        public remainingChanged : boolean;
        private _remainingChanged;
        public state : string;
        private _state;
        public stateChanged : boolean;
        private _stateChanged;
        public total : number;
        private _total;
        public totalChanged : boolean;
        private _totalChanged;
        static parseDriveQuota(data: IDriveQuota): DriveQuota;
        static parseDriveQuotas(data: IDriveQuota[]): CoreServices.Extensions.ObservableCollection<DriveQuota>;
        public getRequestBody(): IDriveQuota;
    }
    interface IIdentitySets {
        value: IIdentitySet[];
    }
    interface IIdentitySet {
        application: IIdentity;
        user: IIdentity;
    }
    class IdentitySet extends CoreServices.Extensions.ComplexTypeBase {
        constructor(data?: IIdentitySet);
        public _odataType: string;
        public application : Identity;
        private _application;
        public applicationChanged : boolean;
        private _applicationChanged;
        private _applicationChangedListener;
        public user : Identity;
        private _user;
        public userChanged : boolean;
        private _userChanged;
        private _userChangedListener;
        static parseIdentitySet(data: IIdentitySet): IdentitySet;
        static parseIdentitySets(data: IIdentitySet[]): CoreServices.Extensions.ObservableCollection<IdentitySet>;
        public getRequestBody(): IIdentitySet;
    }
    interface IIdentities {
        value: IIdentity[];
    }
    interface IIdentity {
        id: string;
        displayName: string;
    }
    class Identity extends CoreServices.Extensions.ComplexTypeBase {
        constructor(data?: IIdentity);
        public _odataType: string;
        public id : string;
        private _id;
        public idChanged : boolean;
        private _idChanged;
        public displayName : string;
        private _displayName;
        public displayNameChanged : boolean;
        private _displayNameChanged;
        static parseIdentity(data: IIdentity): Identity;
        static parseIdentities(data: IIdentity[]): CoreServices.Extensions.ObservableCollection<Identity>;
        public getRequestBody(): IIdentity;
    }
    interface IItemReferences {
        value: IItemReference[];
    }
    interface IItemReference {
        driveId: string;
        id: string;
        path: string;
    }
    class ItemReference extends CoreServices.Extensions.ComplexTypeBase {
        constructor(data?: IItemReference);
        public _odataType: string;
        public driveId : string;
        private _driveId;
        public driveIdChanged : boolean;
        private _driveIdChanged;
        public id : string;
        private _id;
        public idChanged : boolean;
        private _idChanged;
        public path : string;
        private _path;
        public pathChanged : boolean;
        private _pathChanged;
        static parseItemReference(data: IItemReference): ItemReference;
        static parseItemReferences(data: IItemReference[]): CoreServices.Extensions.ObservableCollection<ItemReference>;
        public getRequestBody(): IItemReference;
    }
    class DriveFetcher extends CoreServices.Extensions.RestShallowObjectFetcher {
        constructor(context: CoreServices.Extensions.DataContext, path: string);
        public fetch(): Utility.IPromise<Drive>;
    }
    interface IDrives {
        value: IDrive[];
    }
    interface IDrive {
        id: string;
        owner: IIdentity;
        quota: IDriveQuota;
    }
    class Drive extends CoreServices.Extensions.EntityBase {
        constructor(context?: CoreServices.Extensions.DataContext, path?: string, data?: IDrive);
        public _odataType: string;
        public id : string;
        private _id;
        public idChanged : boolean;
        private _idChanged;
        public owner : Identity;
        private _owner;
        public ownerChanged : boolean;
        private _ownerChanged;
        private _ownerChangedListener;
        public quota : DriveQuota;
        private _quota;
        public quotaChanged : boolean;
        private _quotaChanged;
        private _quotaChangedListener;
        public update(): Utility.IPromise<Drive>;
        public delete(): Utility.IPromise<void>;
        static parseDrive(context: CoreServices.Extensions.DataContext, path: string, data: IDrive): Drive;
        static parseDrives(context: CoreServices.Extensions.DataContext, pathFn: (data: IDrive) => string, data: IDrive[]): Drive[];
        public getRequestBody(): IDrive;
    }
    class ItemFetcher extends CoreServices.Extensions.RestShallowObjectFetcher {
        constructor(context: CoreServices.Extensions.DataContext, path: string);
    }
    interface IItems {
        value: IItem[];
    }
    interface IItem {
        createdBy: IIdentitySet;
        eTag: string;
        id: string;
        lastModifiedBy: IIdentitySet;
        name: string;
        parentReference: IItemReference;
        size: number;
        dateTimeCreated: string;
        dateTimeLastModified: string;
        type: string;
        webUrl: string;
    }
    class Item extends CoreServices.Extensions.EntityBase {
        constructor(context?: CoreServices.Extensions.DataContext, path?: string, data?: IItem);
        public _odataType: string;
        public createdBy : IdentitySet;
        private _createdBy;
        public createdByChanged : boolean;
        private _createdByChanged;
        private _createdByChangedListener;
        public eTag : string;
        private _eTag;
        public eTagChanged : boolean;
        private _eTagChanged;
        public id : string;
        private _id;
        public idChanged : boolean;
        private _idChanged;
        public lastModifiedBy : IdentitySet;
        private _lastModifiedBy;
        public lastModifiedByChanged : boolean;
        private _lastModifiedByChanged;
        private _lastModifiedByChangedListener;
        public name : string;
        private _name;
        public nameChanged : boolean;
        private _nameChanged;
        public parentReference : ItemReference;
        private _parentReference;
        public parentReferenceChanged : boolean;
        private _parentReferenceChanged;
        private _parentReferenceChangedListener;
        public size : number;
        private _size;
        public sizeChanged : boolean;
        private _sizeChanged;
        public dateTimeCreated : Date;
        private _dateTimeCreated;
        public dateTimeCreatedChanged : boolean;
        private _dateTimeCreatedChanged;
        public dateTimeLastModified : Date;
        private _dateTimeLastModified;
        public dateTimeLastModifiedChanged : boolean;
        private _dateTimeLastModifiedChanged;
        public type : string;
        private _type;
        public typeChanged : boolean;
        private _typeChanged;
        public webUrl : string;
        private _webUrl;
        public webUrlChanged : boolean;
        private _webUrlChanged;
        public update(): Utility.IPromise<Item>;
        public delete(): Utility.IPromise<void>;
        static parseItem(context: CoreServices.Extensions.DataContext, path: string, data: IItem): Item;
        static parseItems(context: CoreServices.Extensions.DataContext, pathFn: (data: IItem) => string, data: IItem[]): Item[];
        public getRequestBody(): IItem;
    }
    class FileFetcher extends ItemFetcher {
        constructor(context: CoreServices.Extensions.DataContext, path: string);
        public fetch(): Utility.IPromise<File>;
        public content(): Utility.IPromise<string>;
        public copy(destFolderId: string, destFolderPath: string, newName: string): Utility.IPromise<File>;
        public uploadContent(contentStream: string): Utility.IPromise<void>;
    }
    interface IFiles {
        value: IFile[];
    }
    interface IFile extends IItem {
        contentUrl: string;
    }
    class File extends Item {
        constructor(context?: CoreServices.Extensions.DataContext, path?: string, data?: IFile);
        public _odataType: string;
        public contentUrl : string;
        private _contentUrl;
        public contentUrlChanged : boolean;
        private _contentUrlChanged;
        public content(): Utility.IPromise<string>;
        public copy(destFolderId: string, destFolderPath: string, newName: string): Utility.IPromise<File>;
        public uploadContent(contentStream: string): Utility.IPromise<void>;
        public update(): Utility.IPromise<File>;
        public delete(): Utility.IPromise<void>;
        static parseFile(context: CoreServices.Extensions.DataContext, path: string, data: IFile): File;
        static parseFiles(context: CoreServices.Extensions.DataContext, pathFn: (data: IFile) => string, data: IFile[]): File[];
        public getRequestBody(): IFile;
    }
    class FolderFetcher extends ItemFetcher {
        constructor(context: CoreServices.Extensions.DataContext, path: string);
        public children : Items;
        private _children;
        public fetch(): Utility.IPromise<Folder>;
        public copy(destFolderId: string, destFolderPath: string, newName: string): Utility.IPromise<Folder>;
    }
    interface IFolders {
        value: IFolder[];
    }
    interface IFolder extends IItem {
        childCount: number;
    }
    class Folder extends Item {
        constructor(context?: CoreServices.Extensions.DataContext, path?: string, data?: IFolder);
        public _odataType: string;
        public childCount : number;
        private _childCount;
        public childCountChanged : boolean;
        private _childCountChanged;
        public children : Items;
        private _children;
        public copy(destFolderId: string, destFolderPath: string, newName: string): Utility.IPromise<Folder>;
        public update(): Utility.IPromise<Folder>;
        public delete(): Utility.IPromise<void>;
        static parseFolder(context: CoreServices.Extensions.DataContext, path: string, data: IFolder): Folder;
        static parseFolders(context: CoreServices.Extensions.DataContext, pathFn: (data: IFolder) => string, data: IFolder[]): Folder[];
        public getRequestBody(): IFolder;
    }
    class Items extends CoreServices.Extensions.QueryableSet<IItem> {
        private _parseCollectionFn;
        constructor(context: CoreServices.Extensions.DataContext, path: string, entity?: any);
        public getItem(id: any): ItemFetcher;
        public getItems(): CoreServices.Extensions.CollectionQuery<Item>;
        public addItem(item: Item): Utility.IPromise<Item>;
        public asFiles(): CoreServices.Extensions.CollectionQuery<File>;
        public asFolders(): CoreServices.Extensions.CollectionQuery<Folder>;
        public getByPath(path: string): Utility.IPromise<Item>;
    }
}
