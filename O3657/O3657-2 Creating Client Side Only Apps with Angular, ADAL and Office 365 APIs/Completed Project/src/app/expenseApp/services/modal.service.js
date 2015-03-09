var expenseApp;
(function (expenseApp) {
    var services;
    (function (services) {
        var ModalService = (function () {
            function ModalService($modal) {
                this.$modal = $modal;
                this.modalDefaults = {
                    backdrop: true,
                    keyboard: true,
                    modalFade: true,
                    templateUrl: '/app/expenseApp/partials/modal.html'
                };
                this.modalOptions = {
                    closeButtonText: 'Close',
                    actionButtonText: 'OK',
                    headerText: 'Proceed?',
                    bodyText: 'Perform this action?'
                };
            }
            ModalService.prototype.showModal = function (customModalDefaults, customModalOptions) {
                if (!customModalDefaults) {
                    customModalDefaults = {};
                }
                customModalDefaults.backdrop = 'static';
                return this.show(customModalDefaults, customModalOptions);
            };
            ModalService.prototype.show = function (customModalDefaults, customModalOptions) {
                //Create temp objects to work with since we're in a singleton service
                var tempModalDefaults = {};
                var tempModalOptions = {};
                //Map angular-ui modal custom defaults to modal defaults defined in this service
                angular.extend(tempModalDefaults, this.modalDefaults, customModalDefaults);
                //Map modal.html $scope custom properties to defaults defined in this service
                angular.extend(tempModalOptions, this.modalOptions, customModalOptions);
                if (!tempModalDefaults.controller) {
                    tempModalDefaults.controller = function ($scope, $modalInstance) {
                        $scope.modalOptions = tempModalOptions;
                        $scope.modalOptions.ok = function (result) {
                            $modalInstance.close('ok');
                        };
                        $scope.modalOptions.close = function (result) {
                            $modalInstance.close('cancel');
                        };
                    };
                    tempModalDefaults.controller.$inject = ['$scope', '$modalInstance'];
                }
                return this.$modal.open(tempModalDefaults).result;
            };
            ModalService.$inject = ['$modal'];
            return ModalService;
        })();
        services.ModalService = ModalService;
        angular.module('expenseApp').service('expenseApp.services.modalService', ModalService);
    })(services = expenseApp.services || (expenseApp.services = {}));
})(expenseApp || (expenseApp = {}));
//# sourceMappingURL=modal.service.js.map