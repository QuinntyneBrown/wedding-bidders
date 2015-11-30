(function () {

    "use strict";

    function catererStore(dispatcher, guid, CATERER_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;

        self.dispatcher.addListener({
            actionType: CATERER_ACTIONS.ADD_CATERER,
            callback: function (options) {
                self.addItem(options.data);
                self.currentCaterer = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.caterers = [];

        self.currentCaterer = null;

        self.addItem = function (options) { self.caterers.push(options.data); }

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        return self;
    }

    angular.module("app").service("catererStore", ["dispatcher", "guid", "CATERER_ACTIONS", catererStore])
    .run(["catererStore", function (catererStore) { }]);
})();