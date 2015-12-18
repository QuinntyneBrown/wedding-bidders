(function () {

    "use strict";

    function WeddingsComponent($scope, appManager, dispatcher, weddingStore) {
        var self = this;
        self.appManager = appManager;
        self.weddings = weddingStore.items;
        self.dispatcher = dispatcher;
        self.moment = moment;
        self.weddingStore = weddingStore;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.weddings = self.weddingStore.items;
                $scope.$digest();
            }
        });

        for (var i = 0; i < self.weddings.length; i++) {
            self.weddings[i].date = self.moment(self.weddings[i].date).format("MMMM Do YYYY");
        }

        self.deactivate = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }


    WeddingsComponent.canActivate = function () {
        return ["weddingActions", function (weddingActions) {
            return weddingActions.getAllAsync();
        }];
    };

    ngX.Component({
        component: WeddingsComponent,
        route: "/weddings",
        providers: ["$scope","appManager", "dispatcher", "weddingStore"],
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