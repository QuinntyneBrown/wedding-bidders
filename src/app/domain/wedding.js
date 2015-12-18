(function () {

    "use strict";

    function wedding(moment, weddingActions) {
        var self = this;
        self.moment = moment;
        self.weddingActions = weddingActions;
        self.bids = [];

        self.createInstance = function (options) {
            var instance = new wedding(self.moment, self.weddingActions);
            if (options.data) {
                instance.id = options.data.id;
                instance.date = self.moment(options.data.date).format("MMMM Do YYYY");
                instance.numberOfGuests = options.data.numberOfGuests;
                instance.location = options.data.location;
                instance.numberOfHours = options.data.numberOfHours;
            }
            return instance;
        }
        return self;
    }

    angular.module("app").service("wedding", ["moment", "weddingActions", wedding]);

})();