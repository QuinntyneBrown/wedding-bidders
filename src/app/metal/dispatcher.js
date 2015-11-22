(function () {

    "use strict";

    function eventEmitter(guid) {

        var self = this;

        self.listeners = [];

        self.addListener = function (options) {
            var id = guid();
            self.listeners.push({
                id: id,
                actionType: options.actionType,
                callback: options.callback
            });
            return id;
        };

        self.removeListener = function (options) {
            for (var i = 0; i < self.listeners.length; i++) {
                if (self.listeners[i].id === options.id) {
                    self.listeners.slice(i,1);
                }
            }
        }

        self.emit = function (options) {
            for (var i = 0; i < self.listeners.length; i++) {
                if (self.listeners[i].actionType === options.actionType) {
                    self.listeners[i].callback(options.options);
                }
            }
        }


        return self;
    }

    angular.module("app").service("dispatcher", ["guid", eventEmitter]);

})();