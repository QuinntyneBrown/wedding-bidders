(function () {

    "use strict";


    function weddingActions(dispatcher, guid, weddingService, WEDDING_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.WEDDING_ACTIONS = WEDDING_ACTIONS;

        self.add = function (options) {
            var newGuid = guid();
            weddingService.add({
                data: {
                    numberOfGuests: options.numberOfGuests,
                    numberOfHours: options.numberOfHours,
                    location: options.location
                }
            }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.WEDDING_ACTIONS.ADD_WEDDING,
                    options: {
                        data: results,
                        id: newGuid
                    }                    
                })
            });
           
            return newGuid;
        };

        self.getAll = function () {
            var newGuid = guid();
            weddingService.getAll().then(function (results) {
                self.dispatcher.emit({
                    actionType: self.WEDDING_ACTIONS.UPDATE_ALL_WEDDINGS,
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
                self.dispatcher.emit({
                    actionType: self.WEDDING_ACTIONS.UPDATE_BY_ID,
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
        .service("weddingActions", ["dispatcher", "guid", "weddingService", "WEDDING_ACTIONS", weddingActions])


})();