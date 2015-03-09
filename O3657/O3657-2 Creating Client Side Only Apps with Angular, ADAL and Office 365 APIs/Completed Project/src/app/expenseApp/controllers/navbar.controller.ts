///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />

module expenseApp {

    class NavbarController {
        isCollapsed: boolean = false;
        appTitle: string = 'Expense Management';
        isLoggedIn: boolean = false;
        loginLogoutText = 'Login';

        static $inject = ['$scope', '$location', '$window', 'adalAuthenticationService'];
        constructor(private $scope: ng.IScope, private $location: ng.ILocationService,
                    private $window: ng.IWindowService, private adalService) {

            $scope.$watch(() => {
                return this.adalService.userInfo.isAuthenticated;
            }, (loggedIn) => {
                console.log('isAuthenticated changed: ' + loggedIn);
                this.changeLoginStatus(loggedIn);
            });

            this.isLoggedIn = this.adalService.userInfo.isAuthenticated;

            if (!this.isLoggedIn) {
                this.$location.path('/login');
            }

            //this.$scope.$on('adal:loginSuccess', () => this.changeLoginStatus(true));
            //this.$scope.$on('adal:loginFailure',  () => this.changeLoginStatus(false));
            //this.$scope.$on('adal:notAuthorized', this.notAuthorized.bind(this));
        }

        loginOrOut() {
            (this.isLoggedIn) ? this.logout() : this.login();
        }

        changeLoginStatus(loggedIn) {
            (loggedIn) ? this.loginLogoutText = 'Logout' : this.loginLogoutText = 'Login';
            this.isLoggedIn = loggedIn;
            if (!this.isLoggedIn) {
                this.$location.path('/login');
            } else {
                this.$location.path('/employees');
            }
        }

        logout() {
            this.adalService.logOut();
            this.changeLoginStatus(false);
            this.$location.path('/login');
        }

        login() {
            this.adalService.login();
        }

        loginSuccess() {
            this.$window.alert('in');
            this.changeLoginStatus(true);
        }

        loginFailure() {
            this.changeLoginStatus(false);
        }

        notAuthorized(event, rejection, forResource) {
            this.$window.alert('Not Authorized for resource:' + forResource);
        }

    }

    angular.module('expenseApp').controller('expenseApp.NavbarController', NavbarController);

}
