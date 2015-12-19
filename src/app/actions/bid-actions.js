(function () {

    "use strict";

    function bidActions($q, dispatcher, guid, bidService, BID_ACTIONS) {

        var self = this;
        self.$q = $q;
        self.dispatcher = dispatcher;
        self.BID_ACTIONS = BID_ACTIONS;

        self.add = function (options) {
            var newGuid = guid();

            bidService.add({
                data: {
                    weddingId: options.weddingId,
                    price: options.price,
                    description: options.description
                }
            }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.BID_ACTIONS.ADD_BID, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getAllByCurrentProfile = function (options) {
            var newGuid = guid();
            bidService.getAllByCurrentProfile().then(function (results) {
                self.dispatcher.emit({
                    actionType: self.BID_ACTIONS.UPDATE_BY_PROFILE, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getAllByCurrentProfileAsync = function () {
            var deferred = self.$q.defer();
            var actionId = self.getAllByCurrentProfile();
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
        .service("bidActions", ["$q", "dispatcher", "guid", "bidService", "BID_ACTIONS", bidActions])


})();