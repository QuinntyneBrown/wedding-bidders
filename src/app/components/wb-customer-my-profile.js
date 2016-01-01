(function () {

    "use strict";

    function CustomerMyProfileComponent(safeDigest, $scope, bidStore, dispatcher, moment, profileStore, weddingCollection, weddingStore) {
        var self = this;
        self.profileStore = profileStore;
        self.bidStore = bidStore;
        self.weddingCollection = weddingCollection;
        self.weddingStore = weddingStore;
        self.dispatcher = dispatcher;
        self.moment = moment;
        self.safeDigest = safeDigest;

        self.profile = self.profileStore.currentProfile;

        self.weddings = self.weddingCollection.createInstance({
            data: self.weddingStore.weddingsByProfile,
            bids: self.bidStore.items
        }).items;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.profile = self.profileStore.currentProfile;
                self.weddings = self.weddingCollection.createInstance({
                    data: self.weddingStore.weddingsByProfile,
                    bids: self.bidStore.items
                }).items;
                self.safeDigest($scope);
            }
        });

        self.deactivate = function () { self.dispatcher.removeListener({ id: self.listenerId }); }

        return self;
    }

    CustomerMyProfileComponent.canActivate = function () {
        return ["$q", "actionAsync", "bidActions", "weddingActions", function ($q, actionAsync, bidActions, weddingActions) {
            return $q.all([
                actionAsync.invoke(bidActions.getAllByCurrentProfile),
                actionAsync.invoke(weddingActions.getByCurrentProfile)
            ]);
        }];
    }

    ngX.Component({
        component: CustomerMyProfileComponent,
        route: "/customer/myprofile",
        providers: [
            "safeDigest",
            "$scope",
            "bidStore",
            "dispatcher",
            "moment",
            "profileStore",
            "weddingCollection",
            "weddingStore"
        ],
        template: [
            "<div class='customerMyProfile viewComponent'>",
            "<h1>{{ vm.profile.firstname }}  {{ vm.profile.lastname }}</h1><br/><br/>",

            "<div> ",
            "<h1>Weddings</h1>",
            "   <div data-ng-repeat='wedding in vm.weddings'> ",
            "       <h3>Number of Guests:  {{ ::wedding.numberOfGuests }}</h3>",
            "       <h3>Hours:  {{ ::wedding.numberOfHours }}</h3>",
            "       <h3>Location:  {{ ::wedding.location }}</h3>",            
            "       <h3>Date:  {{ ::wedding.date }}</h3>",
            "       <h3>Bids:  {{ ::wedding.bids.length }}</h3>",
            "       <br/><br/> ",
            "   </div> ",
            "</div> ",

            "</div>"
        ]
    });

})();