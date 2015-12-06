(function () {

    "use strict";

    function bidHub($, dispatcher, BID_ACTIONS) {
        var self = this;
        self.$ = $;
        self.connection = self.$.hubConnection();
        self.hub = self.connection.createHubProxy("bidHub");
    }

    angular.module("app").service("messageHub", [
        "$",
        "dispatcher",
        "BID_ACTIONS",
        messageHub]);

})();