(function () {

    "use strict";

    function bidStore($, dispatcher, BID_ACTIONS, store) {
        var self = this;
        self.dispatcher = dispatcher;
        self.store = store;
        self.$ = $;
        self.storeInstance = self.store.createInstance();
        self.connection = self.$.hubConnection();
        self.hub = self.connection.createHubProxy("bidHub");
        self.hub.on("onBidAdded", function (options) {
            self.storeInstance.addOrUpdate({ data: options });
            self.storeInstance.emitChange();
        });
        self.connection.start({ transport: 'longPolling' }, function () {
            
        });

        self.dispatcher.addListener({
            actionType: BID_ACTIONS.ADD_BID,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.currentBid = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        self.dispatcher.addListener({
            actionType: BID_ACTIONS.ADD_BID,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.currentBid = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        self.getById = function (id) {
            return self.storeInstance.getById(id);
        }

        Object.defineProperty(self, "items", {
            "get": function () { return self.storeInstance.items; }
        });

        self.currentBid = null;
        self.types = null;
        return self;
    }

    angular.module("app").service("bidStore", ["$","dispatcher", "BID_ACTIONS", "store", bidStore])
    .run(["bidStore", function (bidStore) {

    }]);
})();