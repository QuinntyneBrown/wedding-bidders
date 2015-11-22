(function () {

    "use strict";

    function eventEmitter(guid) {

        var self = this;

        self.listeners = [];

        self.addListenter = function () {

        };

        self.removeListener = function () {

        }

        self.emit = function () {

        }


        return self;
    }

    angular.module("app").service("dispathcer", ["guid", eventEmitter]);

})();