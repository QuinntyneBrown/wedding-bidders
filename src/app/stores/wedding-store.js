(function () {

    "use strict";

    function weddingStore(dispatcher, guid, WEDDING_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;

        self.dispatcher.addListener({
            actionType: WEDDING_ACTIONS.ADD_WEDDING,
            callback: function (options) {
                self.addItem(options.data);
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


        self.weddings = [];

        self.allWeddings = [];

        self.currentWedding = null;

        self.addItem = function (options) { self.weddings.push(options.data); }

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id, data: options.data } });
        }

        return self;
    }

    angular.module("app").service("weddingStore", ["dispatcher", "guid", "WEDDING_ACTIONS", weddingStore])
    .run(["weddingStore", function (weddingStore) { }]);

})();