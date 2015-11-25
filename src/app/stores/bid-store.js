(function () {

    "use strict";

    function bidStore(dispatcher, guid, BID_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;

        self.dispatcher.addListener({
            actionType: BID_ACTIONS.ADD_BID,
            callback: function (options) {
                self.addItem(options.data);
                self.currentBid = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.bids = [];

        self.currentBid = null;

        self.addItem = function (options) { self.bids.push(options.data); }

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        return self;
    }

    angular.module("app").service("bidStore", ["dispatcher", "guid", "BID_ACTIONS", bidStore]);
})();