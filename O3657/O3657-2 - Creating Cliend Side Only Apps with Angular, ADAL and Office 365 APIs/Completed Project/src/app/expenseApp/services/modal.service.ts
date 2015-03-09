module expenseApp.services {

    interface IModalDefaults {
        backdrop?: boolean;
        keyboard?: boolean;
        modalFade?: boolean;
        templateUrl?: string;
        controller?: ($scope, $modalInstance) => void;
    }

    interface IModalOptions {
        closeButtonText?: string;
        actionButtonText?: string;
        headerText?: string;
        bodyText?: string;
    }

    export class ModalService {

        modalDefaults: IModalDefaults = {
            backdrop: true,
            keyboard: true,
            modalFade: true,
            templateUrl: '/app/expenseApp/partials/modal.html'
        };

        modalOptions: IModalOptions = {
            closeButtonText: 'Close',
            actionButtonText: 'OK',
            headerText: 'Proceed?',
            bodyText: 'Perform this action?'
        };

        static $inject = ['$modal'];
        constructor(private $modal) {

        }

        showModal(customModalDefaults, customModalOptions) {
            if (!customModalDefaults) { customModalDefaults = {}; }
            customModalDefaults.backdrop = 'static';
            return this.show(customModalDefaults, customModalOptions);
        }

        show(customModalDefaults, customModalOptions) {
            //Create temp objects to work with since we're in a singleton service
            var tempModalDefaults: IModalDefaults = {};
            var tempModalOptions: IModalOptions = {};

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
        }
    }

    angular.module('expenseApp').service('expenseApp.services.modalService', ModalService);

}
