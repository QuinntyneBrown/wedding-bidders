(function () {

    "use strict";

    function bidderStore(dispatcher, BIDDER_ACTIONS) {
        var self = this;

        dispatcher.addListener({
            actionType: BIDDER_ACTIONS.ADD,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.current = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: BIDDER_ACTIONS.UPDATE_ALL,
            callback: function (options) {
                self.storeInstance.items = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: BIDDER_ACTIONS.UPDATE_BY_ID,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: BIDDER_ACTIONS.UPDATE_TYPES,
            callback: function (options) {
                self.types = options.data;
                for (var i = 0; i < self.types.length; i++) {
                    self.types[i].displayName = self.types[i].name.replace(/([a-z])([A-Z])/g, '$1 $2');
                }
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        return self;
    }

    ngX.Store({ store: bidderStore, providers: ["dispatcher", "BIDDER_ACTIONS"] });

})();