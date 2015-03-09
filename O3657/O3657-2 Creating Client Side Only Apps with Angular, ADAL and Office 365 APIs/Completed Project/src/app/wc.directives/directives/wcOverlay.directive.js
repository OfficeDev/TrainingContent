///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />
var wc;
(function (wc) {
    var directives;
    (function (directives) {
        var OverlayDirective = (function () {
            function OverlayDirective($q, $timeout, $window, httpInterceptor) {
                this.$q = $q;
                this.$timeout = $timeout;
                this.$window = $window;
                this.httpInterceptor = httpInterceptor;
                this.restrict = 'EA';
                this.transclude = true;
                this.scope = { wcOverlayDelay: '@' };
                this.template = '<div id="overlay-container" class="overlayContainer">' + '<div id="overlay-background" class="overlayBackground"></div>' + '<div id="overlay-content" class="overlayContent" data-ng-transclude>' + '</div>' + '</div>';
                this.link = this._link.bind(this);
            }
            OverlayDirective.instance = function ($q, $timeout, $window, httpInterceptor) {
                return new OverlayDirective($q, $timeout, $window, httpInterceptor);
            };
            OverlayDirective.prototype._link = function (scope, element) {
                var overlayContainer = null, timerPromise = null, timerPromiseHide = null, queue = [], delay, computedStyleFunc, $q = this.$q, $timeout = this.$timeout, $window = this.$window, httpInterceptor = this.httpInterceptor;
                init();
                function init() {
                    wireUpHttpInterceptor();
                    if ($window.jQuery) {
                        wirejQueryInterceptor();
                    }
                    overlayContainer = element[0].firstChild; //Get to template
                    delay = scope.wcOverlayDelay ? parseInt(scope.wcOverlayDelay, 10) : 500;
                    computedStyleFunc = getComputedStyle();
                }
                //Hook into httpInterceptor factory request/response/responseError functions
                function wireUpHttpInterceptor() {
                    httpInterceptor.request = function (config) {
                        processRequest();
                        return config || $q.when(config);
                    };
                    httpInterceptor.response = function (response) {
                        processResponse();
                        return response || $q.when(response);
                    };
                    httpInterceptor.responseError = function (rejection) {
                        processResponse();
                        return $q.reject(rejection);
                    };
                }
                //Monitor jQuery Ajax calls in case it's used in an app
                function wirejQueryInterceptor() {
                    $($window.document).ajaxStart(function () {
                        processRequest();
                    });
                    $($window.document).ajaxComplete(function () {
                        processResponse();
                    });
                    $($window.document).ajaxError(function () {
                        processResponse();
                    });
                }
                function processRequest() {
                    queue.push({});
                    if (queue.length === 1) {
                        timerPromise = $timeout(function () {
                            if (queue.length) {
                                showOverlay();
                            }
                            //Delay showing for 500 millis to avoid flicker
                        }, delay);
                    }
                }
                function processResponse() {
                    queue.pop();
                    if (queue.length === 0) {
                        //Since we don't know if another XHR request will be made, pause before
                        //hiding the overlay. If another XHR request comes in then the overlay
                        //will stay visible which prevents a flicker
                        timerPromiseHide = $timeout(function () {
                            //Make sure queue is still 0 since a new XHR request may have come in
                            //while timer was running
                            if (queue.length === 0) {
                                hideOverlay();
                                if (timerPromiseHide) {
                                    $timeout.cancel(timerPromiseHide);
                                }
                            }
                        }, delay);
                    }
                }
                function showOverlay() {
                    var w = 0, h = 0, document = $window.document;
                    if (!$window.innerWidth) {
                        if (!(document.documentElement.clientWidth === 0)) {
                            w = document.documentElement.clientWidth;
                            h = document.documentElement.clientHeight;
                        }
                        else {
                            w = document.body.clientWidth;
                            h = document.body.clientHeight;
                        }
                    }
                    else {
                        w = $window.innerWidth;
                        h = $window.innerHeight;
                    }
                    var content = document.getElementById('overlay-content');
                    var contentWidth = parseInt(computedStyleFunc(content, 'width').replace('px', ''), 10);
                    var contentHeight = parseInt(computedStyleFunc(content, 'height').replace('px', ''), 10);
                    content.style.top = h / 2 - contentHeight / 2 + 'px';
                    content.style.left = w / 2 - contentWidth / 2 + 'px';
                    overlayContainer.style.display = 'block';
                }
                function hideOverlay() {
                    if (timerPromise) {
                        $timeout.cancel(timerPromise);
                    }
                    overlayContainer.style.display = 'none';
                }
                function getComputedStyle() {
                    var func = null, document = $window.document;
                    if (document.defaultView && document.defaultView.getComputedStyle) {
                        func = document.defaultView.getComputedStyle;
                    }
                    else if (typeof (document.body.currentStyle) !== 'undefined') {
                        func = function (element, anything) {
                            return element['currentStyle'];
                        };
                    }
                    return function (element, style) {
                        return func(element, null)[style];
                    };
                }
            };
            OverlayDirective.$inject = ['$q', '$timeout', '$window', 'httpInterceptor'];
            return OverlayDirective;
        })();
        var wcDirectivesApp = angular.module('wc.directives', []);
        //Empty factory to hook into $httpProvider.interceptors
        //Directive will hookup request, response, and responseError interceptors
        wcDirectivesApp.factory('httpInterceptor', function () {
            return {};
        });
        //Hook httpInterceptor factory into the $httpProvider interceptors so that we can monitor XHR calls
        wcDirectivesApp.config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('httpInterceptor');
        }]);
        //Directive that uses the httpInterceptor factory above to monitor XHR calls
        //When a call is made it displays an overlay and a content area
        //No attempt has been made at this point to test on older browsers
        wcDirectivesApp.directive('wcOverlay', ['$q', '$timeout', '$window', 'httpInterceptor', OverlayDirective.instance]);
    })(directives = wc.directives || (wc.directives = {}));
})(wc || (wc = {}));
//# sourceMappingURL=wcOverlay.directive.js.map