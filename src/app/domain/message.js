(function () {

    "use strict";

    function message($injector, invokeAsync, messageActions) {
        var self = this;
        self.$injector = $injector;

        self.createInstance = function (options) {
            var instance = new message(self.$injector);
            if (options.data) {
                instance.id = options.data.id;
                instance.messageType = options.data.messageType,
                instance.subject = options.data.subject;
                instance.fromProfileId = options.data.fromProfileId;
                instance.toProfileId = options.data.toProfileId;
                instance.isRead = options.data.isRead;
                instance.content = options.data.content;
            }
            return instance;
        }

        self.sendAsync = function (options) {
            return invokeAsync({
                action: messageActions.add,
                params: {
                    subject: options.subject,
                    content: options.content,
                    toProfileId: options.toProfileId,
                    messageType: options.messageType
                }
            });
        }

        return self;
    }

    angular.module("app").service("message", ["$injector", "invokeAsync", "messageActions", message]);

})();