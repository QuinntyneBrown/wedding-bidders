(function () {

    "use strict";

    function profileStore(dispatcher, guid, PROFILE_ACTIONS) {

        var self = this;

        self.dispatcher = dispatcher;

        self.currentProfile = null;

        self.dispatcher = dispatcher;

        self.dispatcher.addListener({
            actionType: PROFILE_ACTIONS.UPDATE_CURRENT_PROFILE,
            callback: function (options) {                
                self.currentProfile = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        return self;
    }

    angular.module("app").service("profileStore", ["dispatcher", "guid", "PROFILE_ACTIONS", profileStore])
    .run(["profileStore", function (profileStore) { }]);
})();