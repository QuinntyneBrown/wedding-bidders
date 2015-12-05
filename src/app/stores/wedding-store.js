(function () {

    "use strict";

    function weddingStore(dispatcher, guid, WEDDING_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;

        self.dispatcher.addListener({
            actionType: WEDDING_ACTIONS.ADD_WEDDING,
            callback: function (options) {
                self.addOrUpdate(options.data);
                self.currentWedding = options.data;
                self.emitChange({ id: options.id, data: options.data });
            }
        });

        self.dispatcher.addListener({
            actionType: WEDDING_ACTIONS.UPDATE_ALL_WEDDINGS,
            callback: function (options) {
                self.allWeddings = options.data;
                self.emitChange({ id: options.id, data: options.data });
            }
        });

        self.dispatcher.addListener({
            actionType: WEDDING_ACTIONS.UPDATE_BY_ID,
            callback: function (options) {
                self.addOrUpdate({ data: options.data });
                self.emitChange({ id: options.id, data: options.data });
            }
        });


        self.addOrUpdate = function (options) {
            var exists = false;
            for (var i = 0; i < self.weddings.length; i++) {
                if (self.weddings[i].id === options.data.id) {
                    exists = true;
                    self.weddings[i] = options.data;
                }
            }
            if (!exists)
                self.weddings.push(options.data);
        }

        self.getById = function (id) {
            var item = null;
            for (var i = 0; i < self.weddings.length; i++) {
                if (self.weddings[i].id === id) {
                    item = self.weddings[i];
                }
            }
            return item;
        }

        self.weddings = [];

        self.allWeddings = [];

        self.currentWedding = null;

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id, data: options.data } });
        }

        return self;
    }

    angular.module("app").service("weddingStore", ["dispatcher", "guid", "WEDDING_ACTIONS", weddingStore])
    .run(["weddingStore", function (weddingStore) { }]);

})();