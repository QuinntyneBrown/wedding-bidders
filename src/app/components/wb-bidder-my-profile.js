(function () {

    "use strict";

    function BidderMyProfileComponent(bidder, bidderStore, profileStore, weddingStore) {
        var self = this;

        self.storeOnChange = function () {
            
        };

        self.onInit = function () {
            self.bidder = bidder.createInstance({
                data: bidderStore.getByProfileId({ profileId: profileStore.currentProfile.id }),
                profile: profileStore.currentProfile
            });
        }

        return self;
    }

    BidderMyProfileComponent.canActivate = function () {
        return ["$q", "bidActions", "bidderActions", "invokeAsync", "profileActions", "profileStore", "weddingActions", function ($q, bidActions, bidderActions, invokeAsync, profileActions, profileStore, weddingActions) {

            var deferred = $q.defer();

            invokeAsync(profileActions.getCurrentProfile).then(function () {
                $q.all([
                    invokeAsync(bidActions.getAllByCurrentProfile),
                    invokeAsync({
                        action: bidderActions.getByProfileId,
                        params: { profileId: profileStore.currentProfile.id }
                    }),
                    invokeAsync(weddingActions.getAllByCurrentProfile)
                ]).then(function (results) {
                    deferred.resolve();
                });
            });

            return deferred.promise;
        }];
    }

    ngX.Component({
        component: BidderMyProfileComponent,
        route: "/bidder/myprofile",
        providers: [
            "bidder",
            "bidderStore",
            "profileStore",
            "weddingStore"
        ],
        template: [
            "<div class='bidderMyProfile viewComponent'>",
            "<h1>{{ vm.bidder.firstname }}  {{ vm.bidder.lastname }}, {{ vm.bidder.companyName }}</h1><br/><br/>",
            "</div>"
        ]
    });
})();