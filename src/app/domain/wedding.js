(function () {

    "use strict";

    function wedding($injector, moment, weddingActions) {
        var self = this;
        self.moment = moment;
        self.weddingActions = weddingActions;
        self.bids = [];
        self.$injector = $injector;

        self.createInstance = function (options) {
            var instance = new wedding(self.$injector, self.moment, self.weddingActions);
            if (options.data) {
                instance.id = options.data.id;
                instance.date = self.moment(options.data.date).format("MMMM Do YYYY");
                instance.numberOfGuests = options.data.numberOfGuests;
                instance.location = options.data.location;
                instance.numberOfHours = options.data.numberOfHours;
            }

            if (options.bids) {
                var bid = self.$injector.get('bid');
                for (var i = 0; i < options.bids.length; i++) {
                    if (instance.id === options.bids[i].weddingId) {
                        instance.bids.push(bid.createInstance({
                            data: options.bids[i],
                            bidders: options.bidders
                        }));
                    }
                }
            }
            return instance;
        }

        self.delete = function () {
            self.weddingActions.delete({
                id: self.id
            });
        }

        self.select = function () {
            self.weddingActions.select({
                wedding: self
            });
        }

        return self;
    }

    angular.module("app").service("wedding", ["$injector","moment", "weddingActions", wedding]);

})();