(function () {

    "use strict";

    function issueStore($, dispatcher, ISSUE_ACTIONS) {
        var self = this;
        self.connection = $.hubConnection();
        self.hub = self.connection.createHubProxy("issueHub");

        self.hub.on("onIssueAdded", function (options) {
            self.storeInstance.addOrUpdate({ data: options });
            self.storeInstance.emitChange();
        });

        dispatcher.addListener({
            actionType: ISSUE_ACTIONS.ADD,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: ISSUE_ACTIONS.CURRENT_PROFILE,
            callback: function (options) {
                self.storeInstance.items = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: ISSUE_ACTIONS.ALL,
            callback: function (options) {
                self.issues = options.data;
                self.storeInstance.emitChange({ id: options.id });
            }
        });

        return self;
    }

    ngX.Store({ store: issueStore, providers: ["$", "dispatcher", "ISSUE_ACTIONS"] });

})();