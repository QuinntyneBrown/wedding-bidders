(function () {

    "use strict";

    function messageActions(dispatcher, guid, messageService, MESSAGE_ACTIONS) {

        var self = this;

        self.add = function (options) {
            var newGuid = guid();
            messageService.add({
                data: {
                    otherProfileId: options.otherProfileId,
                    content: options.content
                }
            }).then(function (results) {
                dispatcher.emit({
                    actionType: MESSAGE_ACTIONS.ADD_MESSAGE, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        };

        self.getAllForCurrentProfile = function (options) {
            var newGuid = guid();
            messageService.getAllForCurrentProfile()
                .then(function (results) {
                    dispatcher.emit({
                        actionType: MESSAGE_ACTIONS.UPDATE_ALL_CURRENT_PROFILE_MESSAGES, options:
                            { data: results, id: newGuid }
                    });
                });
            return newGuid;
        };

        self.getAllIssues = function (options) {
            var newGuid = guid();
            messageService.getAllIssues()
                .then(function (results) {
                    dispatcher.emit({
                        actionType: MESSAGE_ACTIONS.UPDATE_ALL_ISSUES, options:
                            { data: results, id: newGuid }
                    });
                });
            return newGuid;
        };

        self.getMessagesByOtherProfileId = function (options) {
            var newGuid = guid();

            messageService.getByOtherProfileId({
                otherProfileId: options.id
            }).then(function (results) {
                dispatcher.emit({
                    actionType: MESSAGE_ACTIONS.GET_BY_OTHER_PROFILE, options:
                        { data: results, id: newGuid }
                });
            });

            return newGuid;
        };

        return self;
    }

    angular.module("app")
        .service("messageActions", ["dispatcher", "guid", "messageService", "MESSAGE_ACTIONS", messageActions]);


})();