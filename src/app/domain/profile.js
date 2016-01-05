(function () {

    "use strict";

    function profile($injector, dispatcher, messageActions, messageStore, MESSAGE_TYPE) {
        var self = this;

        self.$injector = $injector;
        self.dispatcher = dispatcher;
        self.messageActions = messageActions;
        self.MESSAGE_TYPE = MESSAGE_TYPE;

        self.createInstance = function (options) {
            var instance = new profile(self.$injector, self.dispatcher, self.messageActions, self.messageStore, self.MESSAGE_TYPE);
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

        self.storeOnChange = function () {

        }

        return self;
    }

    angular.module("app").service("profile", ["$injector", "dispatcher", "messageActions", "messageStore", "MESSAGE_TYPE",profile]);

})();