(function () {

    "use strict";

    function weddingStore(dispatcher, WEDDING_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;

        self.dispatcher.addListener(function (options) {
            switch (options.actionType) {
                case WEDDING_ACTIONS.ADD_ITEM:
                    self.addItem(action.item);
                    self.currentWedding;
                    self.emitChange();
                    break;
            }

        });

        self.weddings = [];

        self.currentWedding = null;

        self.addListener = self.dispatcher.addListener

        self.addItem = function (options) {
            self.weddings.push(options.data);
        }

        self.emitChange = function () {
            self.dispatcher.emit("change");
        }

        return self;
    }

    angular.module("app").service("weddingStore", ["dispatcher","guid","WEDDING_ACTIONS",weddingStore]);
})();