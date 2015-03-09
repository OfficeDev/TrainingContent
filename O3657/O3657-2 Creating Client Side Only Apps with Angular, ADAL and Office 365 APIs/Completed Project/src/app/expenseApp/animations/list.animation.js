///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />
var expenseApp;
(function (expenseApp) {
    'use strict';
    var WcAnimations = (function () {
        function WcAnimations() {
            this._duration = 0.5;
        }
        WcAnimations.prototype.enter = function (element, done) {
            var random = Math.random() * 100;
            TweenMax.set(element, { opacity: 0, left: random + 'px' });
            var random2 = Math.random();
            TweenMax.to(element, this._duration, {
                opacity: 1,
                left: '0px',
                ease: Back.easeInOut,
                delay: random2,
                onComplete: done
            });
        };
        WcAnimations.prototype.leave = function (element, done) {
            TweenMax.to(element, this._duration, { opacity: 0, left: '-50px', onComplete: done });
        };
        return WcAnimations;
    })();
    angular.module('expenseApp').animation('.card-animation', WcAnimations);
})(expenseApp || (expenseApp = {}));
//# sourceMappingURL=list.animation.js.map