﻿(function () {

    "use strict";


    function profileActions(dispatcher, guid, profileService, PROFILE_ACTIONS) {

        var self = this;

        self.getCurrentProfile = function () {
            var newGuid = guid();
            profileService.getCurrentProfile().then(function (results) {
                dispatcher.emit({
                    actionType: PROFILE_ACTIONS.UPDATE_CURRENT_PROFILE,
                    options: {
                        data: results,
                        id: newGuid
                    }
                });
            });

            return newGuid;
        };

        self.updateIsPersonalizedFlag = function () {
            var newGuid = guid();
            profileService.updateIsPersonalizedFlag().then(function (results) {
                dispatcher.emit({
                    actionType: PROFILE_ACTIONS.UPDATE_IS_PERSONALIZED_FLAG,
                    options: {
                        id: newGuid
                    }
                });
            });
            return newGuid;
        }

        return self;
    }

    angular.module("app")
        .service("profileActions", ["dispatcher", "guid", "profileService", "PROFILE_ACTIONS", profileActions])


})();