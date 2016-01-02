(function () {

    "use strict";

    function messageActions(dispatcher, guid, messageService, MESSAGE_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.MESSAGE_ACTIONS = MESSAGE_ACTIONS;
        self.messageService = messageService;

        self.add = function (options) {
            var newGuid = guid();
            self.messageService.add({
                data: {
                    toProfileId: options.toProfileId,
                    subject: options.subject,
                    content: options.content,
                    messageType: options.messageType
                }
            }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.MESSAGE_ACTIONS.ADD_MESSAGE, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getAllForCurrentProfile = function (options) {
            var newGuid = guid();
            self.messageService.getAllForCurrentProfile()
                .then(function (results) {
                self.dispatcher.emit({
                    actionType: self.MESSAGE_ACTIONS.UPDATE_ALL_CURRENT_PROFILE_MESSAGES, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getAllIssues = function (options) {
            var newGuid = guid();
            self.messageService.getAllIssues()
                .then(function (results) {
                    self.dispatcher.emit({
                        actionType: self.MESSAGE_ACTIONS.UPDATE_ALL_ISSUES, options:
                            { data: results, id: newGuid }
                    });
                });
            return newGuid;
        }

        return self;
    }

    angular.module("app")
        .service("messageActions", ["dispatcher", "guid", "messageService", "MESSAGE_ACTIONS", messageActions])


})();