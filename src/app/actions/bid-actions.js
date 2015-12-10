(function () {

    "use strict";

    function bidActions(dispatcher, guid, bidService, BID_ACTIONS) {

        var self = this;
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

        self.getAllByProfileId = function (options) {
            var newGuid = guid();
            bidService.getAllByProfileId({
                params: {
                    id: options.id
                }
            }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.BID_ACTIONS.GET_ALL_BY_CURRENT_PROFILE, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        return self;
    }

    angular.module("app")
        .service("bidActions", ["dispatcher", "guid", "bidService", "BID_ACTIONS", bidActions])


})();