var Csom = window.Csom || {};

Csom.Model = function (title) {
    "use strict";

    //private members
    var t = title,
        set_title = function (v) { t = v; },
        get_title = function () { return t; };

    //public interface
    return {
        set_title: set_title,
        get_title: get_title
    };
}

Csom.ViewModel = function () {
    "use strict";

    //private members
    var items = ko.observableArray(),
        get_items = function () {
            return items;
        },

        load = function (appWebUrl, hostWebUrl, listTitle) {

            //Load Items
            Csom.ListItems.readAll(appWebUrl, hostWebUrl, listTitle).then(
                function (listItems) {
                    items.removeAll();
                    
                    var enumerator = listItems.getEnumerator();

                    while (enumerator.moveNext()) {
                        var listItem = enumerator.get_current();
                        items.push(new Csom.Model(listItem.get_item("Title")));
                    }

                },
                function (sender, args) {
                    items.removeAll();
                    alert(args.get_message());
                }
             );

        };


    //public interface
    return {
        load: load,
        get_items: get_items
    };

}();
