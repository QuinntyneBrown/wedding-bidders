﻿(function () {

    "use strict";

    function bidder($injector, $q, messageActions) {
        var self = this;
        self.$injector = $injector;
        self.$q = $q;
        self.messageActions = messageActions;
        self.profile = null;

        self.createInstance = function (options) {
            var instance = new bidder(self.$injector, self.$q, self.messageActions);
            if (options.data) {
                instance.id = options.data.id;
                instance.firstname = options.data.firstname;
                instance.lastname = options.data.lastname;
                instance.companyName = options.data.companyName;
                instance.email = options.data.email;
                instance.bidderType = options.data.bidderType;
                instance.profileId = options.data.profileId;
            }

            if (options.profiles) {
                for (var i = 0; i < options.profiles.length; i++) {
                    if (options.profiles[i].id === instance.profileId) {
                        var profile = instance.$injector.get("profile");
                        instance.profile = profile.createInstance({ data: options.profiles[i] });
                    }
                }
            }

            if (options.profile) {
                instance.profile = instance.$injector.get("profile").createInstance({ data: options.profile });
            }

            return instance;
        };

        return self;
    }

    angular.module("app").service("bidder", ["$injector", "$q", bidder]);

})();