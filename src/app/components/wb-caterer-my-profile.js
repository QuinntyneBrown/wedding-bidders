(function () {

    "use strict";

    function CatererMyProfileComponent(bidActions, dispatcher, profileStore, weddingStore) {
        var self = this;
        self.profile = profileStore.currentProfile;
        self.weddings = weddingStore.weddings;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.profile = profileStore.currentProfile;
                self.weddings = weddingStore.weddings;
            }
        });

        self.dispose = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }

    CatererMyProfileComponent.prototype.canActivate = function () {
        return ["$q", "dispatcher", "profileActions", "weddingActions", function ($q, dispatcher, profileActions, weddingActions) {

            var deferred = $q.defer();
            var actionIds = [];
            actionIds.push(profileActions.getCurrentProfile());
            actionIds.push(weddingActions.getAll());            
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
        component: CatererMyProfileComponent,
        route: "/caterer/myprofile",
        providers: [
            "bidActions",
            "dispatcher",
            "profileStore",
            "weddingStore"],
        template: [
            "<div class='catererMyProfile viewComponent'>",
            "</div>"
        ].join(" ")
    });

})();