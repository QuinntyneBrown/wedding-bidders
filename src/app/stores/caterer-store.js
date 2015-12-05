(function () {

    "use strict";

    function catererStore(dispatcher, guid, CATERER_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;

        self.dispatcher.addListener({
            actionType: CATERER_ACTIONS.ADD_CATERER,
            callback: function (options) {
                self.addOrUpdate({ data: options.data });
                self.currentCaterer = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.dispatcher.addListener({
            actionType: CATERER_ACTIONS.UPDATE_ALL_CATERERS,
            callback: function (options) {
                self.allCaterers = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.dispatcher.addListener({
            actionType: CATERER_ACTIONS.UPDATE_BY_ID,
            callback: function (options) {
                self.addOrUpdate({ data: options.data });
                self.emitChange({ id: options.id });
            }
        });

        

        self.caterers = [];

        self.allCaterers = [];

        self.currentCaterer = null;

        self.getById = function (id) {
            var item = null;
            for (var i = 0; i < self.caterers.length; i++) {
                if (self.caterers[i].id === id) {
                    item = self.caterers[i];
                }
            }
            return item;
        }

        self.addOrUpdate = function (options) {
            var exists = false;
            for (var i = 0; i < self.caterers.length; i++) {
                if (self.caterers[i].id === options.data.id) {
                    exists = true;
                    self.caterers[i] = options.data;
                }
            }
            if(!exists)
                self.caterers.push(options.data);
        }

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        return self;
    }

    angular.module("app").service("catererStore", ["dispatcher", "guid", "CATERER_ACTIONS", catererStore])
    .run(["catererStore", function (catererStore) { }]);
})();