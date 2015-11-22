(function () {

    "use strict";


    function weddingActions(dispatcher, guid, weddingService, WEDDING_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.WEDDING_ACTIONS = WEDDING_ACTIONS;

        self.add = function (options) {
            var newGuid = guid();
            weddingService.add({ model: options.model}).then(function(results) {
                self.dispatcher.emit({
                    action: self.WEDDING_ACTIONS.WEDDING_ADDED,
                    model: model
                })
            });
           
            return newGuid;
        };


        return self;
    }

    angular.module("app")
        .service("weddingActions", ["dispatcher", "guid", "weddingService", "WEDDING_ACTIONS", weddingActions])


})();