﻿(function () {

    "use strict";

    function bidderActions($q, dispatcher, guid, bidderService, BIDDER_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.BIDDER_ACTIONS = BIDDER_ACTIONS;

        self.add = function (options) {
            var newGuid = guid();

            bidderService.add({
                data: {
                    firstname: options.firstname,
                    lastname: options.lastname,
                    email: options.email,
                    confirmEmail: options.confirmEmail,
                    password: options.password,
                    bidderType: options.bidderType
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
                    actionType: self.BIDDER_ACTIONS.UPDATE_BY_ID, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getTypes = function () {
            var newGuid = guid();
            bidderService.getTypes().then(function (results) {
                self.dispatcher.emit({
                    actionType: self.BIDDER_ACTIONS.UPDATE_TYPES, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getTypesAsync = function () {
            var deferred = $q.defer();
            var actionId = self.getTypes();
            var listenerId = dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (actionId === options.id) {
                        dispatcher.removeListener({ id: listenerId });
                        deferred.resolve();
                    }
                }
            })
            return deferred.promise;
        }
        return self;
    }

    angular.module("app")
        .service("bidderActions", ["$q","dispatcher", "guid", "bidderService", "BIDDER_ACTIONS", bidderActions])


})();