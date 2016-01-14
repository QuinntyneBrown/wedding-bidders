(function () {

    "use strict";

    function bidderDescriptionActions(dispatcher, guid, bidderDescriptionService, BIDDER_DESCRIPTION_ACTIONS) {
        var self = this;

        self.addOrUpdate = function (options) {
            var newGuid = guid();
            bidderDescriptionService.addOrUpdate({
                data: {
                    content: options.content,
                    bidderType: options.bidderType
                }
            }).then(function (results) {
                dispatcher.emit({
                    actionType: BIDDER__DESCRIPTION_ACTIONS.ADD_OR_UPDATE, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        };

        self.all = function (options) {
            var newGuid = guid();
            bidderDescriptionService.all().then(function (results) {
                dispatcher.emit({
                    actionType: BIDDER_DESCRIPTION_ACTIONS.ALL, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        };

        return self;
    }

    angular.module("app")
        .service("bidderDescriptionActions", ["dispatcher", "guid", "bidderDescriptionService", "BIDDER_DESCRIPTION_ACTIONS", bidderDescriptionActions]);


})();