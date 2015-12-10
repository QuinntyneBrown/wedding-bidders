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

    //CustomerMyProfileComponent.canActivate = function () {
    //    return ["$q", "appManager", "currentProfile", function ($q, appManager, currentProfile) {
    //        var deferred = $q.defer();
    //        currentProfile.createInstanceAsync().then(function (currentProfile) {
    //            appManager.currentProfile = currentProfile;
    //            deferred.resolve(true);
    //        });
    //        return deferred.promise;
    //    }];
    //}

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