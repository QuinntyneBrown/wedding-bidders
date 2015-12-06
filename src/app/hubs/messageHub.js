(function () {

    "use strict";

    function messageHub($, dispatcher, MESSAGE_ACTIONS) {
        var self = this;
        self.$ = $;
        self.connection = self.$.hubConnection();
        self.hub = self.connection.createHubProxy("bidHub");
    }


    angular.module("app").service("messageHub", [
    "$",
    "dispatcher",
    "MESSAGE_ACTIONS",
    messageHub]);

})();