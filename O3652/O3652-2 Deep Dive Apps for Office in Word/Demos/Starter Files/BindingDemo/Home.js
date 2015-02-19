/// <reference path="../App.js" />

(function () {
    "use strict";

    // The initialize function must be run each time a new page is loaded
    Office.initialize = function (reason) {
        $(document).ready(function () {
            app.initialize();

            $('#cmdCreateBindings').click(onCreateBindings);
            $('#cmdSetBindingValues').click(onSetBindingValues);
            $('#cmdRegisterBindingEventHandlers').click(onRegisterBindingEventHandlers);
        });
    };

    // Reads data from current document selection and displays a notification
    function testForSuccess(asyncResult) {
        if (asyncResult.status === Office.AsyncResultStatus.Failed) {
            app.showNotification('Error', asyncResult.error.message);
        }
    }

    function onCreateBindings() {
        Office.context.document.bindings.addFromNamedItemAsync("firstName", "text", { id: 'firstName' }, onBindingsCreated);
        Office.context.document.bindings.addFromNamedItemAsync("lastName", "text", { id: 'lastName' }, onBindingsCreated);
        Office.context.document.bindings.addFromNamedItemAsync("company", "text", { id: 'company' }, onBindingsCreated);
    }

    function onBindingsCreated(asyncResult) {
        if (asyncResult.status == Office.AsyncResultStatus.Succeeded) {
            app.showNotification('Added new binding with type: ' + asyncResult.value.type + ' and id: ' + asyncResult.value.id);
        }
        else {
            app.showNotification('Error', asyncResult.error.message);
        }
    }

    function onSetBindingValues() {
        Office.select("bindings#firstName", testForSuccess).setDataAsync("Bob", testForSuccess);
        Office.select("bindings#lastName", testForSuccess).setDataAsync("Barker", testForSuccess);
        Office.select("bindings#company", testForSuccess).setDataAsync("Price is Right", testForSuccess);
    }

    function onRegisterBindingEventHandlers() {
        Office.select("bindings#firstName", testForSuccess).addHandlerAsync(Office.EventType.BindingDataChanged, onBindingDataChanged, testForSuccess);
        Office.select("bindings#lastName", testForSuccess).addHandlerAsync(Office.EventType.BindingDataChanged, onBindingDataChanged, testForSuccess);
        Office.select("bindings#company", testForSuccess).addHandlerAsync(Office.EventType.BindingDataChanged, onBindingDataChanged, testForSuccess);
    }

    function onBindingDataChanged(eventArgs) {
        app.showNotification('Binding with id of ' + eventArgs.binding.id + ' was updated!');
    }

})();