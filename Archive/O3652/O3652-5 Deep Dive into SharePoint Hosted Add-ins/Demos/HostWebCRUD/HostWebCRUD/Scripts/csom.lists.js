var Csom = window.Csom || {};

Csom.Lists = function () {

    create = function (appWebUrl, hostWebUrl, title, description, template) {
        "use strict";

        this.def1 = $.Deferred();

        var context = new SP.ClientContext(appWebUrl);
        var appCtx = new SP.AppContextSite(context, hostWebUrl);

        var createInfo = new SP.ListCreationInformation();
        createInfo.set_title(title);
        createInfo.set_description(description);
        createInfo.set_templateType(template);
        this.newList = appCtx.get_web().get_lists().add(createInfo);
        context.load(this.newList);
        context.executeQueryAsync(
            Function.createDelegate(this,
                function () { this.def1.resolve(this.newList); }),
            Function.createDelegate(this,
                function (sender, args) { this.def1.reject(sender, args); }));

        return this.def1.promise();

    },

    remove = function (appWebUrl, hostWebUrl, title) {
        "use strict";

        this.def2 = $.Deferred();

        var context = new SP.ClientContext(appWebUrl);
        var appCtx = new SP.AppContextSite(context, hostWebUrl);

        var list = appCtx.get_web().get_lists().getByTitle(title)
        context.load(list);
        this.oldTitle = title;
        list.deleteObject();
        context.executeQueryAsync(
            Function.createDelegate(this,
                function () { this.def2.resolve(this.oldTitle); }),
            Function.createDelegate(this,
                function (sender, args) { this.def2.reject(sender, args); }));

        return this.def2.promise();

    },

    read = function (appWebUrl, hostWebUrl, title) {
        "use strict";

        this.def3 = $.Deferred();

        var context = new SP.ClientContext(appWebUrl);
        var appCtx = new SP.AppContextSite(context, hostWebUrl);

        this.list = appCtx.get_web().get_lists().getByTitle(title)
        context.load(this.list);
        context.executeQueryAsync(
            Function.createDelegate(this,
                function () { this.def3.resolve(this.list); }),
            Function.createDelegate(this,
                function (sender, args) { this.def3.reject(sender, args); }));

        return this.def3.promise();

    },

    options = function (appWebUrl, hostWebUrl, title, quickLaunch, attachments, versions) {
        "use strict";

        this.def4 = $.Deferred();

        var context = new SP.ClientContext(appWebUrl);
        var appCtx = new SP.AppContextSite(context, hostWebUrl);

        this.list = appCtx.get_web().get_lists().getByTitle(title)
        context.load(this.list);
        this.list.set_onQuickLaunch(quickLaunch);
        this.list.set_enableAttachments(attachments);
        this.list.set_enableVersioning(versions);
        context.executeQueryAsync(
            Function.createDelegate(this,
                function () { this.def4.resolve(this.list); }),
            Function.createDelegate(this,
                function (sender, args) { this.def4.reject(sender, args); }));

        return this.def4.promise();

    };

    return {
        create: create,
        remove: remove,
        read: read,
        options: options
    };

}();