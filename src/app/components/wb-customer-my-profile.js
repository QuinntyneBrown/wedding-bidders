(function () {

    "use strict";

    function CustomerMyProfileComponent($scope, bidStore, dispatcher, profileStore, weddingStore) {
        var self = this;
        self.profileStore = profileStore;
        self.bidStore = bidStore;
        self.weddingStore = weddingStore;
        self.dispatcher = dispatcher;

        self.profile = self.profileStore.currentProfile;
        self.weddings = self.weddingStore.items;
        self.bids = self.bidStore.items;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.profile = self.profileStore.currentProfile;
                self.weddings = self.weddingStore.items;
                self.bids = self.bidStore.items;
                $scope.$digest();
            }
        });

        self.deactivate = function () { self.dispatcher.removeListener({ id: self.listenerId }); }

        return self;
    }

    CustomerMyProfileComponent.canActivate = function () {
        return ["$q", "bidActions", "dispatcher", function ($q, bidActions, dispatcher) {
            var deferred = $q.defer();
            var actionIds = [];

            actionIds.push(bidActions.getAllByCurrentProfile());

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
            "$scope",
            "bidStore",
            "dispatcher",
            "profileStore",
            "weddingStore"
        ],
        template: [
            "<div class='customerMyProfile viewComponent'>",
            "<h1>{{ vm.profile.firstname }}  {{ vm.profile.lastname }}</h1><br/><br/>",

            "<div> ",
            "<h1>Weddings</h1>",
            "   <div data-ng-repeat='wedding in vm.profile.weddings'> ",
            "       <h3>Number of Guests:  {{ ::wedding.numberOfGuests }}</h3>",
            "       <h3>Hours:  {{ ::wedding.numberOfHours }}</h3>",
            "       <h3>Location:  {{ ::wedding.location }}</h3>",
            "       <h3>Bids:  {{ ::wedding.bids.length }}</h3>",
            "       <br/><br/> ",
            "   </div> ",
            "</div> ",

            "</div>"
        ].join(" ")
    });

})();