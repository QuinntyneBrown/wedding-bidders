(function () {

    "use strict";

    function bidStore($, dispatcher, BID_ACTIONS) {
        var self = this;
        self.$ = $;
        self.connection = self.$.hubConnection();
        self.hub = self.connection.createHubProxy("bidHub");

        self.hub.on("onBidAdded", function (options) {
            self.storeInstance.addOrUpdate({ data: options });
            self.storeInstance.emitChange();
        });

        dispatcher.addListener({
            actionType: BID_ACTIONS.ADD_BID,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.currentBid = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: BID_ACTIONS.ADD_BID,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.currentBid = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: BID_ACTIONS.UPDATE_BY_PROFILE,
            callback: function (options) {
                self.byProfile = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        return self;
    }

    ngX.Store({ store: bidStore, providers: ["$", "dispatcher", "BID_ACTIONS"] });

})();