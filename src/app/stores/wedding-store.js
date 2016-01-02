﻿(function () {

    "use strict";

    function weddingStore($, dispatcher, WEDDING_ACTIONS, store) {
        var self = this;
        self.connection = $.hubConnection();
        self.hub = self.connection.createHubProxy("weddingHub");
        self.hub.on("onWeddingAdded", function (options) {
            self.storeInstance.addOrUpdate({ data: options.data });
            self.storeInstance.emitChange();
        });
        self.connection.start({ transport: 'longPolling' },function () {

        });

        dispatcher.addListener({
            actionType: WEDDING_ACTIONS.ADD_WEDDING,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.currentWedding = options.data;
                self.storeInstance.emitChange({ id: options.id, data: options.data });
            }
        });

        dispatcher.addListener({
            actionType: WEDDING_ACTIONS.UPDATE_BY_PROFILE,
            callback: function (options) {
                self.weddingsByProfile = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: WEDDING_ACTIONS.UPDATE_ALL_WEDDINGS,
            callback: function (options) {
                self.storeInstance.items = options.data;
                self.storeInstance.emitChange({ id: options.id, data: options.data });
            }
        });

        dispatcher.addListener({
            actionType: WEDDING_ACTIONS.UPDATE_BY_ID,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.storeInstance.emitChange({ id: options.id, data: options.data });
            }
        });

        return self;
    }

    ngX.Store({ store: weddingStore, providers: ["$", "dispatcher", "WEDDING_ACTIONS"] });

})();