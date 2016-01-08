(function () {

    "use strict";

    function bidderActions(dispatcher, guid, bidderService, BIDDER_ACTIONS) {

        var self = this;

        self.add = function (options) {
            var newGuid = guid();

            bidderService.add({
                data: {
                    firstname: options.firstname,
                    lastname: options.lastname,
                    email: options.email,
                    confirmEmail: options.confirmEmail,
                    password: options.password,
                    bidderType: options.bidderType,
                    companyName: options.companyName
                }
            }).then(function (results) {
                dispatcher.emit({
                    actionType: BIDDER_ACTIONS.ADD, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getAll = function (options) {
            var newGuid = guid();
            bidderService.getAll().then(function (results) {
                dispatcher.emit({
                    actionType: BIDDER_ACTIONS.UPDATE_ALL, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getById = function (options) {
            var newGuid = guid();
            bidderService.getById({ id: options.id }).then(function (results) {
                dispatcher.emit({
                    actionType: BIDDER_ACTIONS.UPDATE_BY_ID, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getByProfileId = function (options) {
            var newGuid = guid();
            bidderService.getByProfileId({ profileId: options.profileId }).then(function (results) {
                dispatcher.emit({
                    actionType: BIDDER_ACTIONS.UPDATE_BY_PROFILE_ID, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getByBidId = function (options) {
            var newGuid = guid();
            bidderService.getByBidId({ bidId: options.bidId }).then(function (results) {
                dispatcher.emit({
                    actionType: BIDDER_ACTIONS.UPDATE_BY_BID_ID, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getTypes = function () {
            var newGuid = guid();
            bidderService.getTypes().then(function (results) {
                dispatcher.emit({
                    actionType: BIDDER_ACTIONS.UPDATE_TYPES, options:
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