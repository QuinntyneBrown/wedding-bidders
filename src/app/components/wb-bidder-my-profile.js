(function () {

    "use strict";

    function BidderMyProfileComponent(profileStore, weddingStore) {
        var self = this;
        self.profile = profileStore.currentProfile;
        self.weddings = weddingStore.weddingsByProfile;
        
        self.storeOnChange = function () {
            self.initialize();
        };

        self.initialize = function () {
            self.profile = profileStore.currentProfile;
            self.weddings = weddingStore.weddingsByProfile;
        }

        return self;
    }

    BidderMyProfileComponent.canActivate = function () {
        return ["$q", "bidActions", "invokeAsync", "weddingActions", function ($q, bidActions, invokeAsync, weddingActions) {
            return $q.all([
                invokeAsync(bidActions.getAllByCurrentProfile),
                invokeAsync(weddingActions.getAllByCurrentProfile)
            ]);
        }];
    }

    ngX.Component({
        component: BidderMyProfileComponent,
        route: "/bidder/myprofile",
        providers: [
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