/*
 Thanks to Karl-Gustav for creating the autoActive directive
 to simplify highlighting <li> elements in a menu based on the path
 View the original version of the autoActive directive at
 https://github.com/Karl-Gustav/autoActive

 This version renames the directive and does some minor code restructuring and changes.
 */

///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />


module wc.directives {
  'use strict';

    interface IMenuHighlighterScope extends ng.IScope {
        highlightClassName: string;
    }

    class MenuHighlighterDirective implements ng.IDirective {

        //Factory responsible for creating the directive instance
        static $inject = ['$location'];
        static instance($location: ng.ILocationService): ng.IDirective {
            return new MenuHighlighterDirective($location);
        }

        restrict = 'A';
        scope = {highlightClassName: '@'};
        element = null;
        //Link function definition
        link: (scope: IMenuHighlighterScope, element: ng.IAugmentedJQuery) => void;

        constructor (private $location: ng.ILocationService) {
            this.link = this._link.bind(this);
        }

        _link(scope: IMenuHighlighterScope, element: ng.IAugmentedJQuery) {

                var _this = this;

                function setActive() {
                    var path = _this.$location.path();
                    var className = scope.highlightClassName || 'active';

                    if (path) {
                        angular.forEach(element.find('li'), (li) => {
                            var anchor = li.querySelector('a');
                            //Get href from href attribute or data-href in cases where href isn't used (such as login)
                            var href = (anchor && anchor.href) ? anchor.href :
                            anchor.getAttribute('data-href').replace('#', '');
                            //Get value after hash
                            var trimmedHref = href.substr(href.indexOf('#/') + 1, href.length);
                            //Convert path to same length as trimmedHref
                            var basePath = path.substr(0, trimmedHref.length);

                            //See if trimmedHref and basePath match. If so, then highlight that item
                            if (trimmedHref === basePath) {
                                angular.element(li).addClass(className);
                            } else {
                                angular.element(li).removeClass(className);
                            }
                        });
                    }
                }

                setActive();

                //Monitor location changes
                scope.$on('$locationChangeSuccess', setActive);
        }
    }

    angular.module('wc.directives').directive('menuHighlighter', MenuHighlighterDirective.instance);
}
