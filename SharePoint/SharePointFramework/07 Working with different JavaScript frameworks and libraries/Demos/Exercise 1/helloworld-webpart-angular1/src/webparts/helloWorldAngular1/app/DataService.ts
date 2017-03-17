import * as angular from 'angular';

export interface IListItem {
  Id: number;
  Title: string;
}

export interface IDataService {
  getListItems: (siteUrl: string, listName: string) => angular.IPromise<IListItem[]>;
  addListItem: (listTitle: string, siteUrl: string, listName: string) => angular.IPromise<number>;
  updateListItem: (item: IListItem, siteUrl: string, listName: string) => angular.IPromise<{}>;
  deleteListItem: (item: IListItem, siteUrl: string, listName: string) => angular.IPromise<number>;
}

export default class DataService implements IDataService {
  public static $inject: string[] = ['$q', '$http'];

  constructor(private $q: angular.IQService, private $http: angular.IHttpService) {
  }

  public getListItems(siteUrl: string, listName: string): angular.IPromise<IListItem[]> {
    const deferred: angular.IDeferred<IListItem[]> = this.$q.defer();

    const url: string = `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items?$select=Id,Title&$orderby=ID desc`;

    this.$http({
      url: url,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then((result: angular.IHttpPromiseCallbackArg<{ value: IListItem[] }>): void => {
      const items: IListItem[] = [];
      for (let i: number = 0; i < result.data.value.length; i++) {
        const item: IListItem = result.data.value[i];
        items.push(item);
      }
      deferred.resolve(items);
    }, (err: any): void => {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  public addListItem(listTitle: string, siteUrl: string, listName: string): angular.IPromise<number> {
    const deferred: angular.IDeferred<{}> = this.$q.defer();

    let listItemEntityTypeFullName: string = undefined;
    this.getListItemEntityTypeFullName(siteUrl, listName)
      .then((entityTypeName: string): angular.IPromise<string> => {
        listItemEntityTypeFullName = entityTypeName;
        return this.getRequestDigest(siteUrl);
      })
      .then((requestDigest: string): void => {
        const body: string = JSON.stringify({
          '@odata.type': listItemEntityTypeFullName,
          'Title': listTitle
        });
        this.$http({
          url: `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items`,
          method: 'POST',
          headers: {
            'odata-version': '4.0',
            'accept': 'application/json',
            'content-type': 'application/json',
            'X-RequestDigest': requestDigest
          },
          data: body
        }).then((result: angular.IHttpPromiseCallbackArg<{ Id: number }>): void => {
          deferred.resolve(result.data.Id);
        }, (err: any): void => {
          deferred.reject(err);
        });
      });

    return deferred.promise;
  }

  public updateListItem(item: IListItem, siteUrl: string, listName: string): angular.IPromise<{}> {
    const deferred: angular.IDeferred<{}> = this.$q.defer();

    let listItemEntityTypeFullName: string = undefined;
    this.getListItemEntityTypeFullName(siteUrl, listName)
      .then((entityTypeName: string): angular.IPromise<string> => {
        listItemEntityTypeFullName = entityTypeName;
        return this.getRequestDigest(siteUrl);
      })
      .then((requestDigest: string): void => {
        const body: string = JSON.stringify({
          '@odata.type': listItemEntityTypeFullName,
          'Title': item.Title
        });
        this.$http({
          url: `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${item.Id})`,
          method: 'POST',
          headers: {
            'odata-version': '4.0',
            'accept': 'application/json',
            'content-type': 'application/json',
            'X-RequestDigest': requestDigest,
            'IF-MATCH': '*',
            'X-HTTP-Method': 'MERGE'
          },
          data: body
        }).then((result: angular.IHttpPromiseCallbackArg<{}>): void => {
          deferred.resolve();
        }, (err: any): void => {
          deferred.reject(err);
        });
      });

    return deferred.promise;
  }

  public deleteListItem(item: IListItem, siteUrl: string, listName: string): angular.IPromise<number> {
    const deferred: angular.IDeferred<{}> = this.$q.defer();

    this.getRequestDigest(siteUrl)
      .then((requestDigest: string): void => {
        this.$http({
          url: `${siteUrl}/_api/web/lists/getbytitle('${listName}')/items(${item.Id})`,
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'X-RequestDigest': requestDigest,
            'IF-MATCH': '*',
            'X-HTTP-Method': 'DELETE'
          }
        }).then((result: angular.IHttpPromiseCallbackArg<{}>): void => {
          deferred.resolve();
        });
      });

    return deferred.promise;
  }

  private getRequestDigest(siteUrl: string): angular.IPromise<string> {
    const deferred: angular.IDeferred<string> = this.$q.defer();

    this.$http({
      url: siteUrl + '/_api/contextinfo',
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      }
    }).then((result: angular.IHttpPromiseCallbackArg<{ FormDigestValue: string }>): void => {
      deferred.resolve(result.data.FormDigestValue);
    }, (err: any): void => {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  private getListItemEntityTypeFullName(siteUrl: string, listName: string): angular.IPromise<string> {
    const deferred: angular.IDeferred<string> = this.$q.defer();

    this.$http({
      url: `${siteUrl}/_api/web/lists/getbytitle('${listName}')?$select=ListItemEntityTypeFullName`,
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    }).then((result: angular.IHttpPromiseCallbackArg<{ ListItemEntityTypeFullName: string }>): void => {
      deferred.resolve(result.data.ListItemEntityTypeFullName);
    }, (err: any): void => {
      deferred.reject(err);
    });

    return deferred.promise;
  }
}