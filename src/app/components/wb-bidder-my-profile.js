(function () {

    "use strict";

    function BidderMyProfileComponent(bidActions, dispatcher, profileStore, weddingStore) {
        var self = this;
        self.profile = profileStore.currentProfile;
        self.weddings = weddingStore.allWeddings;
        self.dispatcher = dispatcher;

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

    BidderMyProfileComponent.canActivate = function () {
        return ["$q", "dispatcher","weddingActions", function ($q, dispatcher, weddingActions) {

            var deferred = $q.defer();

            $q.all([
                getAllWeddingsAsync()
            ]).then(function (resultsArray) {
                deferred.resolve(true);
            });

            function getAllWeddingsAsync() {
                var deferred = $q.defer();
                var actionIds = [];
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
            }

            return deferred.promise;

        }];
    }

    ngX.Component({
        component: BidderMyProfileComponent,
        route: "/bidder/myprofile",
        providers: [
            "bidActions",
            "dispatcher",
            "profileStore",
            "weddingStore"],
        template: [
            "<div class='bidderMyProfile viewComponent'>",
            "<h1>{{ vm.profile.firstname }}  {{ vm.profile.lastname }}</h1><br/><br/>",
            "</div>"
        ].join(" ")
    });

})();