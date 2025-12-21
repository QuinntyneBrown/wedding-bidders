(function () {

    "use strict";

    function conversationCollection(conversation, profile) {
        var self = this;
        self.conversation = conversation;
        self.profile = profile;
        self.items = [];

        self.createInstance = function (options) {
            var instance = new conversationCollection(self.conversation, self.profile);
            if (options.data) {
                for (var i = 0; i < options.data.length; i++) {
                    instance.items.push(self.conversation.createInstance({
                        data: options.data[i]
                    }));
                }
            }
            return instance;
        }
        return self;
    }

    angular.module("app").service("conversationCollection", ["conversation", "profile", conversationCollection]);

})();