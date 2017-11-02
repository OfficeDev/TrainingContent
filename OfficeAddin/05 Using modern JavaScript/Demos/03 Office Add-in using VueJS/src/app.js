/// <reference path="../node_modules/@types/office-js/index.d.ts" />
import Vue from 'vue';
import { ExcelTableUtil } from "./utils/excelTableUtil";
import root from './components/root.vue';
(function () {
    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        var tableUtil = new ExcelTableUtil("Portfolio", "A1:J1", ["Symbol", "Last Price", "Change $", "Change %", "Quantity", "Price Paid", "Day's Gain $", "Total Gain $", "Total Gain %", "Value"]);
        var app = new Vue({
            el: "#app",
            render: function (h) { return h(root, {}); },
            components: { root: root }
        });
    };
})();
//# sourceMappingURL=app.js.map