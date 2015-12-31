(function () {

    "use strict";

    function BidderMyProfileComponent(bidActions, dispatcher, profileStore, weddingStore) {
        var self = this;
        self.profile = profileStore.currentProfile;
        self.weddings = weddingStore.weddingsByProfile;
        self.dispatcher = dispatcher;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.profile = profileStore.currentProfile;
                self.weddings = weddingStore.weddingsByProfile;
            }
        });

        self.dispose = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }

    BidderMyProfileComponent.canActivate = function () {
        return ["$q","weddingActions", function ($q, weddingActions) {
            return weddingActions.getByCurrentProfileAsync();
        }];
    }

    ngX.Component({
        component: BidderMyProfileComponent,
        route: "/bidder/myprofile",
        providers: [
            "bidActions",
            "dispatcher",
            "profileStore",
            "weddingStore"
        ],
        template: [
            "<div class='bidderMyProfile viewComponent'>",
            "<h1>{{ vm.profile.firstname }}  {{ vm.profile.lastname }}</h1><br/><br/>",
            "</div>"
        ]
    });
})();