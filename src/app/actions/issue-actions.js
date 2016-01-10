(function () {

    "use strict";

    function issueActions(dispatcher, guid, issueService, ISSUE_ACTIONS) {

        var self = this;

        self.add = function (options) {
            var newGuid = guid();
            issueService.add({
                data: {
                    toProfileId: options.toProfileId,
                    subject: options.subject,
                    content: options.content,
                    issueType: options.issueType
                }
            }).then(function (results) {
                dispatcher.emit({
                    actionType: ISSUE_ACTIONS.ADD, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        self.getAllForCurrentProfile = function (options) {
            var newGuid = guid();
            issueService.getAllForCurrentProfile()
                .then(function (results) {
                    dispatcher.emit({
                        actionType: ISSUE_ACTIONS.CURRENT_PROFILE, options:
                            { data: results, id: newGuid }
                    });
                });
            return newGuid;
        }

        self.getAll = function (options) {
            var newGuid = guid();
            issueService.getAll()
                .then(function (results) {
                    dispatcher.emit({
                        actionType: ISSUE_ACTIONS.ALL, options:
                            { data: results, id: newGuid }
                    });
                });
            return newGuid;
        }

        return self;
    }

    angular.module("app")
        .service("issueActions", ["dispatcher", "guid", "issueService", "ISSUE_ACTIONS", issueActions])


})();