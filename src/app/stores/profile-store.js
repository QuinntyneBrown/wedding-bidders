(function () {

    "use strict";

    function profileStore(dispatcher, PROFILE_ACTIONS, PROFILE_TYPE) {
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

        dispatcher.addListener({
            actionType: PROFILE_ACTIONS.UPDATE_PROFILE_BY_BID,
            callback: function (options) {
                self.storeInstance.addOrUpdate({ data: options.data });
                self.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: PROFILE_ACTIONS.OTHER,
            callback: function (options) {
                self.other = options.data;
                self.emitChange({ id: options.id });
            }
        });

        dispatcher.addListener({
            actionType: PROFILE_ACTIONS.OTHERS,
            callback: function (options) {
                self.others = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.isCustomer = function () {
            return self.currentProfile
                && self.currentProfile.profileType === PROFILE_TYPE.CUSTOMER;
        };

        self.isInternal = function () {
            return self.currentProfile
                && self.currentProfile.profileType === PROFILE_TYPE.INTERNAL;
        };

        self.isBidder = function () {
            return self.currentProfile
                && self.currentProfile.profileType !== PROFILE_TYPE.CUSTOMER
                && self.currentProfile.profileType !== PROFILE_TYPE.INTERNAL;
        };

        return self;
    }

    ngX.Store({ store: profileStore, providers: ["dispatcher", "PROFILE_ACTIONS", "PROFILE_TYPE"] });

})();