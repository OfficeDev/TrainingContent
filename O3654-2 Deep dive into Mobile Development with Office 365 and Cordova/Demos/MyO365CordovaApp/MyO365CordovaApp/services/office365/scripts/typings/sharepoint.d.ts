declare module MS.Extensions {
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
declare module MS {
    class SharePointClient {
        private _context;
        public context : Extensions.DataContext;
        private getPath(prop);
        constructor(serviceRootUri: string, getAccessTokenFn: () => Microsoft.Utility.IPromise<string>);
        public files : FileServices.FileSystemItems;
        private _Files;
    }
}
declare module MS.FileServices {
    interface IUserInformations {
        d: {
            results: IUserInformation[];
        };
    }
    interface IUserInformation {
        Id: string;
        Name: string;
        Puid: string;
    }
    class UserInformation extends Extensions.ComplexTypeBase {
        constructor(data?: IUserInformation);
        public _odataType: string;
        public id : string;
        private _Id;
        public idChanged : boolean;
        private _IdChanged;
        public name : string;
        private _Name;
        public nameChanged : boolean;
        private _NameChanged;
        public puid : string;
        private _Puid;
        public puidChanged : boolean;
        private _PuidChanged;
        static parseUserInformation(data: IUserInformation): UserInformation;
        static parseUserInformations(data: IUserInformation[]): Extensions.ObservableCollection<UserInformation>;
        public getRequestBody(): IUserInformation;
    }
    class FileSystemItemFetcher extends Extensions.RestShallowObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
    }
    interface IFileSystemItems {
        d: {
            results: IFileSystemItem[];
        };
    }
    interface IFileSystemItem {
        CreatedBy: IUserInformation;
        ETag: string;
        Id: string;
        LastModifiedBy: IUserInformation;
        Name: string;
        Size: number;
        TimeCreated: string;
        TimeLastModified: string;
        Url: string;
    }
    class FileSystemItem extends Extensions.EntityBase {
        constructor(context?: Extensions.DataContext, path?: string, data?: IFileSystemItem);
        public _odataType: string;
        public createdBy : UserInformation;
        private _CreatedBy;
        public createdByChanged : boolean;
        private _CreatedByChanged;
        private _CreatedByChangedListener;
        public eTag : string;
        private _ETag;
        public eTagChanged : boolean;
        private _ETagChanged;
        public id : string;
        private _Id;
        public idChanged : boolean;
        private _IdChanged;
        public lastModifiedBy : UserInformation;
        private _LastModifiedBy;
        public lastModifiedByChanged : boolean;
        private _LastModifiedByChanged;
        private _LastModifiedByChangedListener;
        public name : string;
        private _Name;
        public nameChanged : boolean;
        private _NameChanged;
        public size : number;
        private _Size;
        public sizeChanged : boolean;
        private _SizeChanged;
        public timeCreated : Date;
        private _TimeCreated;
        public timeCreatedChanged : boolean;
        private _TimeCreatedChanged;
        public timeLastModified : Date;
        private _TimeLastModified;
        public timeLastModifiedChanged : boolean;
        private _TimeLastModifiedChanged;
        public url : string;
        private _Url;
        public urlChanged : boolean;
        private _UrlChanged;
        public update(): Microsoft.Utility.IPromise<FileSystemItem>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseFileSystemItem(context: Extensions.DataContext, path: string, data: IFileSystemItem): FileSystemItem;
        static parseFileSystemItems(context: Extensions.DataContext, pathFn: (data: IFileSystemItem) => string, data: IFileSystemItem[]): FileSystemItem[];
        public getRequestBody(): IFileSystemItem;
    }
    class FileFetcher extends FileSystemItemFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<File>;
        public download(): Microsoft.Utility.IPromise<string>;
        public copyTo(target: string, overwrite: boolean): Microsoft.Utility.IPromise<void>;
        public deleteObject(): Microsoft.Utility.IPromise<void>;
        public moveTo(target: string, overwrite: boolean): Microsoft.Utility.IPromise<void>;
        public upload(stream: string): Microsoft.Utility.IPromise<void>;
    }
    interface IFiles {
        d: {
            results: IFile[];
        };
    }
    interface IFile extends IFileSystemItem {
    }
    class File extends FileSystemItem {
        constructor(context?: Extensions.DataContext, path?: string, data?: IFile);
        public _odataType: string;
        public download(): Microsoft.Utility.IPromise<string>;
        public copyTo(target: string, overwrite: boolean): Microsoft.Utility.IPromise<void>;
        public deleteObject(): Microsoft.Utility.IPromise<void>;
        public moveTo(target: string, overwrite: boolean): Microsoft.Utility.IPromise<void>;
        public upload(stream: string): Microsoft.Utility.IPromise<void>;
        public update(): Microsoft.Utility.IPromise<File>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseFile(context: Extensions.DataContext, path: string, data: IFile): File;
        static parseFiles(context: Extensions.DataContext, pathFn: (data: IFile) => string, data: IFile[]): File[];
        public getRequestBody(): IFile;
    }
    class FileServiceFetcher extends Extensions.RestShallowObjectFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public fetch(): Microsoft.Utility.IPromise<FileService>;
    }
    interface IFileServices {
        d: {
            results: IFileService[];
        };
    }
    interface IFileService {
        Id4a81de82eeb94d6080ea5bf63e27023a: string;
    }
    class FileService extends Extensions.EntityBase {
        constructor(context?: Extensions.DataContext, path?: string, data?: IFileService);
        public _odataType: string;
        public id4a81de82eeb94d6080ea5bf63e27023a : string;
        private _Id4a81de82eeb94d6080ea5bf63e27023a;
        public id4a81de82eeb94d6080ea5bf63e27023aChanged : boolean;
        private _Id4a81de82eeb94d6080ea5bf63e27023aChanged;
        public update(): Microsoft.Utility.IPromise<FileService>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseFileService(context: Extensions.DataContext, path: string, data: IFileService): FileService;
        static parseFileServices(context: Extensions.DataContext, pathFn: (data: IFileService) => string, data: IFileService[]): FileService[];
        public getRequestBody(): IFileService;
    }
    class FolderFetcher extends FileSystemItemFetcher {
        constructor(context: Extensions.DataContext, path: string);
        public children : FileSystemItems;
        private _Children;
        public fetch(): Microsoft.Utility.IPromise<Folder>;
        public deleteObject(): Microsoft.Utility.IPromise<void>;
    }
    interface IFolders {
        d: {
            results: IFolder[];
        };
    }
    interface IFolder extends IFileSystemItem {
        ChildrenCount: number;
    }
    class Folder extends FileSystemItem {
        constructor(context?: Extensions.DataContext, path?: string, data?: IFolder);
        public _odataType: string;
        public childrenCount : number;
        private _ChildrenCount;
        public childrenCountChanged : boolean;
        private _ChildrenCountChanged;
        public children : FileSystemItems;
        private _Children;
        public deleteObject(): Microsoft.Utility.IPromise<void>;
        public update(): Microsoft.Utility.IPromise<Folder>;
        public delete(): Microsoft.Utility.IPromise<void>;
        static parseFolder(context: Extensions.DataContext, path: string, data: IFolder): Folder;
        static parseFolders(context: Extensions.DataContext, pathFn: (data: IFolder) => string, data: IFolder[]): Folder[];
        public getRequestBody(): IFolder;
    }
    class FileSystemItems extends Extensions.QueryableSet<IFileSystemItem> {
        private _parseCollectionFn;
        constructor(context: Extensions.DataContext, path: string, entity?: any);
        public getFileSystemItem(Id: any): FileSystemItemFetcher;
        public getFileSystemItems(): Extensions.CollectionQuery<FileSystemItem>;
        public addFileSystemItem(item: FileSystemItem): Microsoft.Utility.IPromise<FileSystemItem>;
        public asFiles(): Extensions.CollectionQuery<File>;
        public asFolders(): Extensions.CollectionQuery<Folder>;
        public add(name: string, overwrite: boolean, content: string): Microsoft.Utility.IPromise<File>;
        public getById(id: string): Microsoft.Utility.IPromise<FileSystemItem>;
    }
}
