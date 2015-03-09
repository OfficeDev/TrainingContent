///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />

'use strict';

module expenseApp.directives {

    interface IWcUniqueAttributes extends ng.IAttributes  {
        wcUniqueProperty: string;
        wcUniqueKey: string;
    }

    class WcUniqueDirective implements ng.IDirective {

        static $inject = ['$q', 'expenseApp.services.DataService'];
        static instance($q: ng.IQService, dataService: expenseApp.services.DataService): ng.IDirective {
            return new WcUniqueDirective($q, dataService);
        }

        restrict = 'A';
        require = 'ngModel';
        //Link function definition
        link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: IWcUniqueAttributes, ngModel) => void;

        constructor (private $q: ng.IQService, private dataService: expenseApp.services.DataService) {
            this.link = this._link.bind(this);
        }

        _link(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: IWcUniqueAttributes, ngModel) {

            var _this = this;

            ngModel.$asyncValidators.unique = function (modelValue, viewValue) {
                var deferred = _this.$q.defer(),
                    currentValue = modelValue || viewValue,
                    key = attrs.wcUniqueKey,
                    property = attrs.wcUniqueProperty;

                //First time the asyncValidators function is loaded the
                //key won't be set  so ensure that we have
                //key and propertyName before checking with the server
                if (key && property) {
                    this.dataService.checkUniqueValue(key, property, currentValue)
                        .then(function (unique) {
                            if (unique) {
                                deferred.resolve(); //It's unique
                            } else {
                                deferred.reject(); //Add unique to $errors
                            }
                        });
                    return deferred.promise;
                } else {
                    return _this.$q.when(true);
                }
            };
        }
    }

    angular.module('expenseApp').directive('wcUnique', WcUniqueDirective.instance);
}
