(function () {

    "use strict";

    function profileStore(dispatcher, PROFILE_ACTIONS) {
        var self = this;

        dispatcher.addListener({
            actionType: PROFILE_ACTIONS.UPDATE_CURRENT_PROFILE,
            callback: function (options) {                
                self.currentProfile = options.data;
                self.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: PROFILE_ACTIONS.UPDATE_IS_PERSONALIZED_FLAG,
            callback: function (options) {
                self.currentProfile.isPersonalized = true;
                self.emitChange({ id: options.id });
            }
        });

        return self;
    }

    ngX.Store({ store: profileStore, providers: ["dispatcher", "PROFILE_ACTIONS"] });

})();