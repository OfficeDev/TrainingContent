///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />
'use strict';
var expenseApp;
(function (expenseApp) {
    var directives;
    (function (directives) {
        var WcUniqueDirective = (function () {
            function WcUniqueDirective($q, dataService) {
                this.$q = $q;
                this.dataService = dataService;
                this.restrict = 'A';
                this.require = 'ngModel';
                this.link = this._link.bind(this);
            }
            WcUniqueDirective.instance = function ($q, dataService) {
                return new WcUniqueDirective($q, dataService);
            };
            WcUniqueDirective.prototype._link = function (scope, element, attrs, ngModel) {
                var _this = this;
                ngModel.$asyncValidators.unique = function (modelValue, viewValue) {
                    var deferred = _this.$q.defer(), currentValue = modelValue || viewValue, key = attrs.wcUniqueKey, property = attrs.wcUniqueProperty;
                    //First time the asyncValidators function is loaded the
                    //key won't be set  so ensure that we have
                    //key and propertyName before checking with the server
                    if (key && property) {
                        this.dataService.checkUniqueValue(key, property, currentValue).then(function (unique) {
                            if (unique) {
                                deferred.resolve(); //It's unique
                            }
                            else {
                                deferred.reject(); //Add unique to $errors
                            }
                        });
                        return deferred.promise;
                    }
                    else {
                        return _this.$q.when(true);
                    }
                };
            };
            WcUniqueDirective.$inject = ['$q', 'expenseApp.services.DataService'];
            return WcUniqueDirective;
        })();
        angular.module('expenseApp').directive('wcUnique', WcUniqueDirective.instance);
    })(directives = expenseApp.directives || (expenseApp.directives = {}));
})(expenseApp || (expenseApp = {}));
//# sourceMappingURL=wcUnique.directive.js.map