(function () {

    "use strict";

    function customerActions(dispatcher, guid, customerService, CUSTOMER_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.CUSTOMER_ACTIONS = CUSTOMER_ACTIONS;

        self.add = function (options) {
            var newGuid = guid();
            customerService.add({
                data: {
                    firstname: options.firstname,
                    lastname: options.lastname,
                    email: options.email,
                    confirmEmail: options.confirmEmail,
                    password: options.password
                }
            }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.CUSTOMER_ACTIONS.ADD_CUSTOMER, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getAll = function (options) {
            var newGuid = guid();
            customerService.getAll().then(function (results) {
                self.dispatcher.emit({
                    actionType: self.CUSTOMER_ACTIONS.UPDATE_ALL, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        return self;
    }

    angular.module("app")
        .service("customerActions", ["dispatcher", "guid", "customerService", "CUSTOMER_ACTIONS", customerActions])


})();