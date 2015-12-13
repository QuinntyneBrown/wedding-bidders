(function () {

    "use strict";

    function bidderActions(dispatcher, guid, bidderService, BIDDER_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.CATERER_ACTIONS = BIDDER_ACTIONS;

        self.add = function (options) {
            var newGuid = guid();

            bidderService.add({
                data: {
                    firstname: options.firstname,
                    lastname: options.lastname,
                    email: options.email,
                    confirmEmail: options.confirmEmail,
                    password: options.password
                }
            }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.BIDDER_ACTIONS.ADD, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getAll = function (options) {
            var newGuid = guid();

            bidderService.getAll().then(function (results) {
                self.dispatcher.emit({
                    actionType: self.BIDDER_ACTIONS.UPDATE_ALL, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getById = function (options) {
            var newGuid = guid();
            bidderService.getById({ id: options.id }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.CATERER_ACTIONS.UPDATE_BY_ID, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        return self;
    }

    angular.module("app")
        .service("bidderActions", ["dispatcher", "guid", "bidderService", "BIDDER_ACTIONS", bidderActions])


})();