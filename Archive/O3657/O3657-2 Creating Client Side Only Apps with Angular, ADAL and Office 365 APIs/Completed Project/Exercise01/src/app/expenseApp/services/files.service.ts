///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />

module expenseApp.services {
  'use strict';

  export class FilesService {
    baseSPUrl:string;
    baseSPListsUrl:string;
    factory = {};
    getOptions = {
      headers: {
        'Accept': 'application/json'
      }
    };

    static $inject = ['$http',
                      '$q',
                      '$window',
                      '$location',
                      '$timeout'];

    constructor(private $http:ng.IHttpService,
                private $q:ng.IQService,
                private $window:ng.IWindowService,
                private $location:ng.ILocationService,
                private $timeout:ng.ITimeoutService) {

      this.baseSPUrl = 'http://spo-site';
      this.baseSPListsUrl = this.baseSPUrl + 'web/lists/';
    }

    getUserFiles() {
      var deferred = this.$q.defer();

      var endpoint = '/content/staticdata/files.json';
      this.$http.get(endpoint, this.getOptions).then((result:shared.IHttpDataResponse) => {
        var receipts:shared.IReceipt[] = result.data.value;
        deferred.resolve(receipts);
      });

      return deferred.promise;
    }

    getReceiptsFolderPath() {
      var deferred = this.$q.defer();

      var endpoint = '/content/staticdata/receipt-path.json';
      this.$http.get(endpoint, this.getOptions).then((response:shared.IHttpDataResponse) => {
        deferred.resolve(response.data.webUrl);
      });

      return deferred.promise;
    }
  }

  angular.module('expenseApp').service('expenseApp.services.filesService', FilesService);
}