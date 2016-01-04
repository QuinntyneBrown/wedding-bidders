(function () {

    "use strict";

    function profile($injector, $q, messageActions, MESSAGE_TYPE) {
        var self = this;

        self.$injector = $injector;
        self.$q = $q;
        self.messageActions = messageActions;
        self.MESSAGE_TYPE = MESSAGE_TYPE;

        self.createInstance = function (options) {
            var instance = new bidder(self.$injector, self.$q, self.messageActions);
            if (options.data) {
                instance.id = options.data.id;
                instance.firstname = options.data.firstname;
                instance.lastname = options.data.lastname;
                instance.companyName = options.data.companyName;
                instance.email = options.data.email;
            }
            return instance;
        }

        self.sendMessage = function (options) {
            self.messageActions.send({
                fromProfileId: self.id,
                toProfileId: options.toProfileId,
                subject: options.subject,
                content:options.content,
                conversationId: options.conversationId,
                messageType: options.messageType || self.MESSAGE_TYPE.NORMAL
            });
        }

        return self;
    }

    angular.module("app").service("profile", ["$injector", "$q", "messageActions", "MESSAGE_TYPE",profile]);

})();