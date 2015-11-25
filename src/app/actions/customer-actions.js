(function () {

    "use strict";

    function customerActions(dispatcher, guid, customerService, CUSTOMER_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.CUSTOMER_ACTIONS = CUSTOMER_ACTIONS;


        return self;
    }

    angular.module("app")
        .service("customerActions", ["dispatcher", "guid", "customerService", "CUSTOMER_ACTIONS", customerActions])


})();