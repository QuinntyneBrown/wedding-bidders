(function () {

    "use strict";

    function WeddingsComponent($scope, appManager, dispatcher, safeDigest, weddingCollection, weddingStore) {
        var self = this;
        self.appManager = appManager;
        self.weddingCollection = weddingCollection;
        self.dispatcher = dispatcher;
        self.moment = moment;
        self.safeDigest = safeDigest;
        self.weddingStore = weddingStore;

        self.weddings = self.weddingCollection.createInstance({
            data: self.weddingStore.weddingsByProfile
        }).items;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.weddings = self.weddingCollection.createInstance({
                    data: self.weddingStore.weddingsByProfile
                }).items;
                self.safeDigest($scope);
            }
        });

        self.deactivate = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }


    WeddingsComponent.canActivate = function () {
        return ["weddingActions", function (weddingActions) {
            return weddingActions.getByCurrentProfile();
        }];
    };

    ngX.Component({
        component: WeddingsComponent,
        route: "/weddings",
        providers: ["$scope", "appManager", "dispatcher", "safeDigest", "weddingCollection", "weddingStore"],
        template: [
            "<div class='weddings viewComponent'>",
            "<h1>Weddings</h1>",
            "   <div data-ng-repeat='wedding in vm.weddings'> ",
            "       <h3>Number of Guests:  {{ ::wedding.numberOfGuests }}</h3>",
            "       <h3>Hours:  {{ ::wedding.numberOfHours }}</h3>",
            "       <h3>Location:  {{ ::wedding.location }}</h3>",
            "       <h3>Date:  {{ ::wedding.date }}</h3>",
            "       <a href='#/bid/create/{{ ::wedding.id }}'>Bid</a>",
            "       <br/><br/> ",
            "   </div> ",
            "</div>"
        ].join(" ")
    });

})();