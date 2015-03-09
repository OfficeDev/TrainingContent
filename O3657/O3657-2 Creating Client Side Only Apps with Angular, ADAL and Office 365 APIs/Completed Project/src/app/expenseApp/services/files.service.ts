///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />

module expenseApp.services {
  'use strict';

  interface IO365ApiConfig {
    endpointUri: string;
    resourceId: string;
  }

  export class FilesService {
    baseSPUrl:string;
    baseSPListsUrl:string;
    factory = {};
    getOptions = {
      headers: {
        'Accept': 'application/json'
      }
    };

    static $inject = ['$http', '$q', '$window', '$location', '$timeout', 'settings', 'adalAuthenticationService'];

    constructor(private $http:ng.IHttpService, private $q:ng.IQService, private $window:ng.IWindowService,
                private $location:ng.ILocationService, private $timeout:ng.ITimeoutService,
                private settings, private adalService) {

      this.baseSPUrl = settings.baseSPUrl;
      this.baseSPListsUrl = this.baseSPUrl + 'web/lists/';
    }

    getUserFiles() {
      var deferred = this.$q.defer();

      var endpoint = this.settings.baseOneDriveUrl + '/files/getbypath(\'receipts\')/children';
      this.$http.get(endpoint, this.getOptions).then((result:shared.IHttpDataResponse) => {
        var receipts:shared.IReceipt[] = result.data.value;
        deferred.resolve(receipts);
      });

      return deferred.promise;
    }

    getReceiptsFolderPath() {
      var deferred = this.$q.defer();

      var endpoint = this.settings.baseOneDriveUrl + '/files/getbypath(\'receipts\')?$select=webUrl';
      this.$http.get(endpoint, this.getOptions).then((response:shared.IHttpDataResponse) => {
        deferred.resolve(response.data.webUrl);
      });

      return deferred.promise;
    }
  }

  angular.module('expenseApp').service('expenseApp.services.filesService', FilesService);
}