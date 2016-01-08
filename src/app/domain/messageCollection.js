(function () {

    "use strict";

    function messageCollection(message, profile) {
        var self = this;
        self.message = message;
        self.profile = profile;
        self.items = [];

        self.createInstance = function (options) {
            var instance = new messageCollection(self.message, self.profile);
            if (options.data) {
                for (var i = 0; i < options.data.length; i++) {
                    instance.items.push(self.message.createInstance({
                        data: options.data[i]
                    }));
                }
            }
            return instance;
        }
        return self;
    }

    angular.module("app").service("messageCollection", ["message", "profile", messageCollection]);

})();