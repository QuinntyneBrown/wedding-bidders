(function () {

    "use strict";


    function weddingActions(dispatcher, guid, weddingService, WEDDING_ACTIONS) {

        var self = this;

        self.add = function (options) {
            var newGuid = guid();
            weddingService.add({
                data: {
                    numberOfGuests: options.numberOfGuests,
                    numberOfHours: options.numberOfHours,
                    location: options.location,
                    date: options.date,
                    categories: options.categories
                }
            }).then(function (results) {
                dispatcher.emit({
                    actionType: WEDDING_ACTIONS.ADD_WEDDING,
                    options: {
                        data: results,
                        id: newGuid
                    }
                });
            });
           
            return newGuid;
        };

        self.delete = function (options) {
            var newGuid = guid();
            weddingService.remove({
                data: {
                    id: options.id
                }
            }).then(function (results) {
                dispatcher.emit({
                    actionType: WEDDING_ACTIONS.DELETE,
                    options: {
                        data: options.id,
                        id: newGuid
                    }
                });
            });
            return newGuid;
        };

        self.select = function (options) {
            var newGuid = guid();
            dispatcher.emit({
                actionType: WEDDING_ACTIONS.UPDATE_CURRENT_WEDDING,
                options: {
                    data: options.wedding,
                    id: newGuid
                }
            });
            return newGuid;
        };

        self.getAll = function () {
            var newGuid = guid();
            weddingService.getAll().then(function (results) {
                dispatcher.emit({
                    actionType: WEDDING_ACTIONS.UPDATE_ALL_WEDDINGS,
                    options: {
                        data: results,
                        id: newGuid
                    }
                });
            });

            return newGuid;
        };

        self.getById = function (options) {
            var newGuid = guid();
            weddingService.getById({ id: options.id }).then(function (results) {
                dispatcher.emit({
                    actionType: WEDDING_ACTIONS.UPDATE_BY_ID,
                    options: {
                        data: results,
                        id: newGuid
                    }
                });
            });

            return newGuid;
        };

        self.getAllByCurrentProfile = function () {
            var newGuid = guid();
            weddingService.getAllByCurrentProfile().then(function (results) {
                dispatcher.emit({
                    actionType: WEDDING_ACTIONS.UPDATE_BY_PROFILE,
                    options: {
                        data: results,
                        id: newGuid
                    }
                });
            });

            return newGuid;
        };

        return self;
    }

    angular.module("app")
        .service("weddingActions", ["dispatcher", "guid", "weddingService", "WEDDING_ACTIONS", weddingActions]);


})();