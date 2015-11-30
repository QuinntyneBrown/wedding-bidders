(function () {

    "use strict";


    function profileActions(dispatcher, guid, profileService, PROFILE_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.PROFILE_ACTIONS = PROFILE_ACTIONS;

        self.getCurrentProfile = function () {
            var newGuid = guid();
            profileService.getCurrentProfile().then(function (results) {
                self.dispatcher.emit({
                    actionType: self.PROFILE_ACTIONS.GET_CURRENT_PROFILE,
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
        .service("profileActions", ["dispatcher", "guid", "profileService", "PROFILE_ACTIONS", profileActions])


})();