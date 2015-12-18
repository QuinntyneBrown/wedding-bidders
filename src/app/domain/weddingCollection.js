(function () {

    "use strict";

    function weddingCollection(moment, wedding) {
        var self = this;
        self.moment = moment;
        self.wedding = wedding;
        self.items = [];

        self.createInstance = function (options) {
            var instance = new weddingCollection(self.moment, self.wedding);
            if (options.data) {
                for (var i = 0; i < options.data.length; i++) {
                    instance.items.push(self.wedding.createInstance({ data: options.data[i] }));
                }                
            }
            return instance;
        }
        return self;
    }

    angular.module("app").service("weddingCollection", ["moment", "wedding", weddingCollection]);

})();