(function () {

    "use strict";

    function CustomerMyProfileComponent(dispatcher, profileStore) {
        var self = this;
        self.profile = profileStore.currentProfile;
        self.dispatcher = dispatcher;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.profile = profileStore.currentProfile;
            }
        });

        self.dispose = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }

    CustomerMyProfileComponent.canActivate = function () {
        return ["$q", "dispatcher", "profileActions", function ($q, dispatcher, profileActions) {
            var deferred = $q.defer();
            var actionIds = [];
            actionIds.push(profileActions.getCurrentProfile());
            
            var listenerId = dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    for (var i = 0; i < actionIds.length; i++) {
                        if (actionIds[i] === options.id) {
                            actionIds.splice(i, 1);
                        }
                    }

                    if (actionIds.length === 0) {
                        dispatcher.removeListener({ id: listenerId });
                        deferred.resolve();
                    }

                }
            });
            return deferred.promise;
        }];
    }

    ngX.Component({
        component: CustomerMyProfileComponent,
        route: "/customer/myprofile",
        providers: [
            "dispatcher",
            "profileStore"],
        template: [
            "<div class='customerMyProfile viewComponent'>",
            "</div>"
        ].join(" ")
    });

})();