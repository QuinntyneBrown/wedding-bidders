(function () {

    "use strict";

    function eventEmitter(guid) {

        var self = this;

        self.listeners = [];

        self.addListener = function (options) {

        };

        self.removeListener = function () {

        }

        self.emit = function () {

        }


        return self;
    }

    angular.module("app").service("dispatcher", ["guid", eventEmitter]);

})();