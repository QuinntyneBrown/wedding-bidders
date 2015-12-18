(function () {

    "use strict";


    function weddingActions($q, dispatcher, guid, weddingService, WEDDING_ACTIONS) {

        var self = this;
        self.$q = $q;
        self.dispatcher = dispatcher;
        self.WEDDING_ACTIONS = WEDDING_ACTIONS;

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

        self.getAllAsync = function () {
            var deferred = self.$q.defer();
            var actionId = self.getAll();
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
        .service("weddingActions", ["$q","dispatcher", "guid", "weddingService", "WEDDING_ACTIONS", weddingActions])


})();