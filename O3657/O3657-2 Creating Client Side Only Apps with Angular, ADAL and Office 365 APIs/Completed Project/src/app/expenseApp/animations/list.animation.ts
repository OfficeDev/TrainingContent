///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />

module expenseApp {

  'use strict';

  class WcAnimations {

    private _duration:number = 0.5;

    enter(element:JQuery, done:any) {
        var random = Math.random() * 100;
        TweenMax.set(element, {opacity: 0, left: random + 'px'});

        var random2 = Math.random();
        TweenMax.to(element, this._duration, {
            opacity:    1,
            left:       '0px',
            ease:       Back.easeInOut,
            delay:      random2,
            onComplete: done
        });
    }

    leave(element:JQuery, done:any) {
        TweenMax.to(element, this._duration, {opacity: 0, left: '-50px', onComplete: done});
    }
  }

  angular.module('expenseApp').animation('.card-animation', WcAnimations);
}
