(function () {

    "use strict";

    function bidderDescriptionStore(dispatcher, BIDDER_DESCRIPTION_ACTIONS) {
        var self = this;

        dispatcher.addListener({
            actionType: BIDDER_DESCRIPTION_ACTIONS.ADD_OR_UPDATE,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: BIDDER_DESCRIPTION_ACTIONS.ALL,
            callback: function (options) {
                self.storeInstance.items = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        return self;
    }

    ngX.Store({ store: bidderDescriptionStore, providers: ["dispatcher", "BIDDER_DESCRIPTION_ACTIONS"] });

})();