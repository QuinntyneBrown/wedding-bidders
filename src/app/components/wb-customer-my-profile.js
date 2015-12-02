(function () {

    "use strict";

    function CustomerMyProfileComponent(appManager, dispatcher) {
        var self = this;
        self.profile = appManager.currentProfile;
        self.dispatcher = dispatcher;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.profile = appManager.currentProfile;
            }
        });

        self.dispose = function () { self.dispatcher.removeListener({ id: self.listenerId }); }

        return self;
    }

    CustomerMyProfileComponent.canActivate = function () {
        return ["$q", "appManager", "currentProfile", function ($q, appManager, currentProfile) {
            var deferred = $q.defer();
            currentProfile.createInstanceAsync().then(function (currentProfile) {
                appManager.currentProfile = currentProfile;
                deferred.resolve(true);
            });
            return deferred.promise;
        }];
    }

    ngX.Component({
        component: CustomerMyProfileComponent,
        route: "/customer/myprofile",
        providers: [
            "appManager",
            "dispatcher"
        ],
        template: [
            "<div class='customerMyProfile viewComponent'>",
            "<h1>{{ vm.profile.firstname }}  {{ vm.profile.lastname }}</h1>",
            "</div>"
        ].join(" ")
    });

})();