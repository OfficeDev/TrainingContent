///<reference path="../../../../tools/typings/tsd.d.ts" />
///<reference path="../../../../tools/typings/expenseApp.d.ts" />

module expenseApp {

    class AboutController {

        static $inject: string[] = [];

    }

    angular.module('expenseApp').controller('expenseApp.AboutController', AboutController);
}
