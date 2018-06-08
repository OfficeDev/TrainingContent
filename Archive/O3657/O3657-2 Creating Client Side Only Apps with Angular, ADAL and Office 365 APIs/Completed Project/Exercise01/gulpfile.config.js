'use strict';
var GulpConfig = (function () {
    function GulpConfig() {
        //Got tired of scrolling through all the comments so removed them
        //Don't hurt me AC :-)
        this.source = './src/';
        this.sourceApp = this.source + 'app/';

        this.tsOutputPath = this.source + '/js';
        this.allJavaScript = [this.source + '/js/**/*.js'];
        this.allTypeScript = this.sourceApp + '/**/*.ts';

        this.typings = './tools/typings/';
        this.libraryTypeScriptDefinitions = './tools/typings/**/*.ts';
        this.appTypeScriptReferences = this.typings + 'expenseApp.d.ts';
    }
    return GulpConfig;
})();
module.exports = GulpConfig;
