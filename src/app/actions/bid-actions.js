(function () {

    "use strict";

    function bidActions(dispatcher, guid, bidService, BID_ACTIONS) {

        var self = this;

        self.add = function (options) {
            var newGuid = guid();

            bidService.add({
                data: {
                    weddingId: options.weddingId,
                    price: options.price,
                    description: options.description
                }
            }).then(function (results) {
                dispatcher.emit({
                    actionType: BID_ACTIONS.ADD_BID, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getAllByCurrentProfile = function (options) {
            var newGuid = guid();
            bidService.getAllByCurrentProfile().then(function (results) {
                dispatcher.emit({
                    actionType: BID_ACTIONS.UPDATE_BY_PROFILE, options:
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