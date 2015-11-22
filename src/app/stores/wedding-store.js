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
                self.emitChange({ id: options.id });
            }
        });

        self.weddings = [];

        self.currentWedding = null;

        self.addItem = function (options) { self.weddings.push(options.data); }

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        return self;
    }

    angular.module("app").service("weddingStore", ["dispatcher","guid","WEDDING_ACTIONS",weddingStore]);
})();