(function () {

    "use strict";

    function profileStore(dispatcher, guid, PROFILE_ACTIONS, store) {

        var self = this;
        self.store = store;
        self.storeInstance = self.store.createInstance();
        self.dispatcher = dispatcher;
        self.currentProfile = null;
        self.dispatcher.addListener({
            actionType: PROFILE_ACTIONS.UPDATE_CURRENT_PROFILE,
            callback: function (options) {                
                self.currentProfile = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        Object.defineProperty(self, "items", {
            "get": function () { return self.storeInstance.items; }
        });

        return self;
    }

    ngX.Store({ store: profileStore, providers: ["dispatcher", "guid", "PROFILE_ACTIONS", "store"] });

})();