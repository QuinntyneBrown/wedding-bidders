(function () {

    "use strict";

    function catererActions(dispatcher, guid, catererService, CATERER_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.CATERER_ACTIONS = CATERER_ACTIONS;

        self.add = function (options) {
            var newGuid = guid();

            catererService.add({
                data: {
                    firstname: options.firstname,
                    lastname: options.lastname,
                    email: options.email,
                    confirmEmail: options.confirmEmail,
                    password: options.password
                }
            }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.CATERER_ACTIONS.ADD_CATERER, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getAll = function (options) {
            var newGuid = guid();

            catererService.getAll().then(function (results) {
                self.dispatcher.emit({
                    actionType: self.CATERER_ACTIONS.UPDATE_ALL_CATERERS, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getById = function (options) {
            var newGuid = guid();
            catererService.getById({ id: options.id }).then(function (results) {
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
        .service("catererActions", ["dispatcher", "guid", "catererService", "CATERER_ACTIONS", catererActions])


})();