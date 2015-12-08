(function () {

    "use strict";

    function bidStore($, dispatcher, BID_ACTIONS, store) {
        var self = this;
        self.dispatcher = dispatcher;
        self.$ = $;
        self.connection = self.$.hubConnection();
        self.hub = self.connection.createHubProxy("bidHub");
        self.hub.on("onBidAdded", function (options) {
            self.addOrUpdate({ data: options });
            self.emitChange();
        });
        self.connection.start(function () {
            
        });

        self.dispatcher.addListener({
            actionType: BID_ACTIONS.ADD_BID,
            callback: function (options) {
                self.addOrUpdate({ data: options.data });
                self.currentBid = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.getById = function (id) {
            var item = null;
            for (var i = 0; i < self.bids.length; i++) {
                if (self.bids[i].id === id) {
                    item = self.bids[i];
                }
            }
            return item;
        }

        self.addOrUpdate = function (options) {
            var exists = false;
            for (var i = 0; i < self.bids.length; i++) {
                if (self.bids[i].id === options.data.id) {
                    exists = true;
                    self.bids[i] = options.data;
                }
            }
            if (!exists)
                self.bids.push(options.data);
        }

        self.bids = [];

        self.currentBid = null;

        self.addItem = function (options) { self.bids.push(options.data); }

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options ? options.id : null } });
        }

        return self;
    }

    angular.module("app").service("bidStore", ["$","dispatcher", "BID_ACTIONS", "store", bidStore])
    .run(["bidStore", function (bidStore) {

    }]);
})();