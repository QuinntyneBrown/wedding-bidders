(function () {

    "use strict";

    function catererStore(dispatcher, guid, CATERER_ACTIONS, store) {
        var self = this;
        self.dispatcher = dispatcher;
        self.store = store;
        self.storeInstance = self.store.createInstance();

        self.dispatcher.addListener({
            actionType: CATERER_ACTIONS.ADD_CATERER,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.currentCaterer = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        self.dispatcher.addListener({
            actionType: CATERER_ACTIONS.UPDATE_ALL_CATERERS,
            callback: function (options) {
                self.storeInstance.items = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        self.dispatcher.addListener({
            actionType: CATERER_ACTIONS.UPDATE_BY_ID,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        self.currentCaterer = null;

        self.getById = function (id) {
            return self.storeInstance.getById(id);
        }

        Object.defineProperty(self, "items", {
            "get": function () { return self.storeInstance.items; }
        });

        return self;
    }

    angular.module("app").service("catererStore", ["dispatcher", "guid", "CATERER_ACTIONS","store", catererStore])
    .run(["catererStore", function (catererStore) { }]);
})();