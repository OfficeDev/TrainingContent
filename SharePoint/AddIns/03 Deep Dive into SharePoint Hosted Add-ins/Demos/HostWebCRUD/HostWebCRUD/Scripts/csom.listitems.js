var Csom = window.Csom || {};

Csom.ListItems = function () {
    
    create = function (appWebUrl, hostWebUrl, listName, itemTitle) {
        "use strict";

        this.def1 = $.Deferred();

        var context = new SP.ClientContext(appWebUrl);
        var appCtx = new SP.AppContextSite(context, hostWebUrl);

        var list = appCtx.get_web().get_lists().getByTitle(listName);
        context.load(list);
        var listItemCreationInfo = new SP.ListItemCreationInformation();
        this.newItem = list.addItem(listItemCreationInfo);
        this.newItem.set_item("Title", itemTitle);
        this.newItem.update();
        context.load(this.newItem);
        context.executeQueryAsync(
            Function.createDelegate(this,
                function () {
                    this.def1.resolve(this.newItem);
                }),
            Function.createDelegate(this,
                function (sender, args) {
                    this.def1.reject(sender, args);
                }));

        return this.def1.promise();

    },

    read = function (appWebUrl, hostWebUrl, listName, id) {
        "use strict";

        this.def2 = $.Deferred();

        var context = new SP.ClientContext(appWebUrl);
        var appCtx = new SP.AppContextSite(context, hostWebUrl);

        var list = appCtx.get_web().get_lists().getByTitle(listName);
        context.load(list);
        this.item = list.getItemById(id);
        context.load(this.item, 'Include(ID,Title)');
        context.executeQueryAsync(
            Function.createDelegate(this,
                function () { this.def2.resolve(this.item); }),
            Function.createDelegate(this,
                function (sender, args) { this.def2.reject(sender, args); }));

        return this.def2.promise();
    },

    readAll = function (appWebUrl, hostWebUrl, listName) {
        "use strict";

        this.def3 = $.Deferred();

        var context = new SP.ClientContext(appWebUrl);
        var appCtx = new SP.AppContextSite(context, hostWebUrl);

        var query = "<View><Query><OrderBy><FieldRef Name='Title'/></OrderBy></Query><ViewFields><FieldRef Name='ID'/><FieldRef Name='Title'/></ViewFields></View>";
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml(query);
        var list = appCtx.get_web().get_lists().getByTitle(listName);
        context.load(list);
        this.items = list.getItems(camlQuery);
        context.load(this.items, 'Include(ID,Title)');
        context.executeQueryAsync(
            Function.createDelegate(this,
                function () { this.def3.resolve(this.items); }),
            Function.createDelegate(this,
                function (sender, args) { this.def3.reject(sender, args); }));

        return this.def3.promise();
    },

    update = function (appWebUrl, hostWebUrl, listName, id, itemTitle) {
        "use strict";

        this.def4 = $.Deferred();

        var context = new SP.ClientContext(appWebUrl);
        var appCtx = new SP.AppContextSite(context, hostWebUrl);

        var list = appCtx.get_web().get_lists().getByTitle(listName);
        context.load(list);
        this.listItem = list.getItemById(id);
        this.listItem.set_item("Title", itemTitle);
        this.listItem.update();
        context.executeQueryAsync(
            Function.createDelegate(this,
                function () { this.def4.resolve(this.listItem); }),
            Function.createDelegate(this,
                function (sender, args) { this.def4.reject(sender, args); }));

        return this.def4.promise();
    },

    remove = function (appWebUrl, hostWebUrl, listName, id) {
        "use strict";

        this.def5 = $.Deferred();

        var context = new SP.ClientContext(appWebUrl);
        var appCtx = new SP.AppContextSite(context, hostWebUrl);

        var list = appCtx.get_web().get_lists().getByTitle(listName);
        context.load(list);
        this.listItem = list.getItemById(id);
        this.listItem.deleteObject();
        context.executeQueryAsync(
            Function.createDelegate(this,
                function () { this.def5.resolve(); }),
            Function.createDelegate(this,
                function (sender, args) { this.def5.reject(sender, args); }));

        return this.def5.promise();
    };

    //public interface
    return {
        create: create,
        update: update,
        remove: remove,
        read: read,
        readAll: readAll
    }

}();
