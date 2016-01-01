(function () {

    "use strict";


    function profileActions($q, dispatcher, guid, profileService, PROFILE_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.PROFILE_ACTIONS = PROFILE_ACTIONS;
        self.$q = $q;

        self.getCurrentProfile = function () {
            var newGuid = guid();
            profileService.getCurrentProfile().then(function (results) {
                self.dispatcher.emit({
                    actionType: self.PROFILE_ACTIONS.UPDATE_CURRENT_PROFILE,
                    options: {
                        data: results,
                        id: newGuid
                    }
                });
            });

            return newGuid;
        };

        return self;
    }

    angular.module("app")
        .service("profileActions", ["$q", "dispatcher", "guid", "profileService", "PROFILE_ACTIONS", profileActions])


})();