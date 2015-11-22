(function () {

    "use strict";


    function weddingActions(dispatcher, guid, weddingService, WEDDING_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.WEDDING_ACTIONS = WEDDING_ACTIONS;

        self.add = function (options) {
            var newGuid = guid();
            weddingService.add({
                data: {
                    numberOfGuests: options.model.numberOfGuests
                }
            }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.WEDDING_ACTIONS.ADD_WEDDING,
                    options: { data: results.data }
                })
            });
           
            return newGuid;
        };


        return self;
    }

    angular.module("app")
        .service("weddingActions", ["dispatcher", "guid", "weddingService", "WEDDING_ACTIONS", weddingActions])


})();