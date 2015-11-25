(function () {

    "use strict";

    function catererActions(dispatcher, guid, catererService, CATERER_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.CATERER_ACTIONS = CATERER_ACTIONS;


        return self;
    }

    angular.module("app")
        .service("catererActions", ["dispatcher", "guid", "catererService", "CATERER_ACTIONS", catererActions])


})();