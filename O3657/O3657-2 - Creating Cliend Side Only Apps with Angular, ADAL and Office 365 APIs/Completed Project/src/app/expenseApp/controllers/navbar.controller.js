///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />
var expenseApp;
(function (expenseApp) {
    var NavbarController = (function () {
        function NavbarController($scope, $location, $window, adalService) {
            var _this = this;
            this.$scope = $scope;
            this.$location = $location;
            this.$window = $window;
            this.adalService = adalService;
            this.isCollapsed = false;
            this.appTitle = 'Expense Management';
            this.isLoggedIn = false;
            this.loginLogoutText = 'Login';
            $scope.$watch(function () {
                return _this.adalService.userInfo.isAuthenticated;
            }, function (loggedIn) {
                console.log('isAuthenticated changed: ' + loggedIn);
                _this.changeLoginStatus(loggedIn);
            });
            this.isLoggedIn = this.adalService.userInfo.isAuthenticated;
            if (!this.isLoggedIn) {
                this.$location.path('/login');
            }
            //this.$scope.$on('adal:loginSuccess', () => this.changeLoginStatus(true));
            //this.$scope.$on('adal:loginFailure',  () => this.changeLoginStatus(false));
            //this.$scope.$on('adal:notAuthorized', this.notAuthorized.bind(this));
        }
        NavbarController.prototype.loginOrOut = function () {
            (this.isLoggedIn) ? this.logout() : this.login();
        };
        NavbarController.prototype.changeLoginStatus = function (loggedIn) {
            (loggedIn) ? this.loginLogoutText = 'Logout' : this.loginLogoutText = 'Login';
            this.isLoggedIn = loggedIn;
            if (!this.isLoggedIn) {
                this.$location.path('/login');
            }
            else {
                this.$location.path('/employees');
            }
        };
        NavbarController.prototype.logout = function () {
            this.adalService.logOut();
            this.changeLoginStatus(false);
            this.$location.path('/login');
        };
        NavbarController.prototype.login = function () {
            this.adalService.login();
        };
        NavbarController.prototype.loginSuccess = function () {
            this.$window.alert('in');
            this.changeLoginStatus(true);
        };
        NavbarController.prototype.loginFailure = function () {
            this.changeLoginStatus(false);
        };
        NavbarController.prototype.notAuthorized = function (event, rejection, forResource) {
            this.$window.alert('Not Authorized for resource:' + forResource);
        };
        NavbarController.$inject = ['$scope', '$location', '$window', 'adalAuthenticationService'];
        return NavbarController;
    })();
    angular.module('expenseApp').controller('expenseApp.NavbarController', NavbarController);
})(expenseApp || (expenseApp = {}));
//# sourceMappingURL=navbar.controller.js.map