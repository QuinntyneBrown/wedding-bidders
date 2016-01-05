﻿(function () {

    "use strict";

    function CustomerMyProfileComponent(safeDigest, $scope, bidderStore, bidStore, profileStore, weddingActions, weddingCollection, weddingStore) {
        var self = this;
        
        self.initialize = function () {
            self.profile = profileStore.currentProfile;
            self.weddings = weddingCollection.createInstance({
                data: weddingStore.weddingsByProfile,
                bids: bidStore.byProfile,
                bidders: bidderStore.items
            }).items;

            if (self.weddings.length > 0 && weddingStore.currentWedding) {
                if (weddingStore.currentWedding) {
                    for (var i = 0; i < self.weddings.length; i++) {
                        if (self.weddings[i].id === weddingStore.currentWedding.id) {
                            self.currentWedding = self.weddings[i];
                        }
                    }
                }
            }

            if (self.weddings.length > 0 && !weddingStore.currentWedding)
                setTimeout(function () {
                    weddingActions.select({ wedding: self.weddings[0] });
                }, 0);
            
            safeDigest($scope);
        }

        self.storeOnChange = function () {
            self.initialize();
        }

        self.initialize();

        return self;
    }

    CustomerMyProfileComponent.canActivate = function () {
        return ["$q", "invokeAsync", "bidderActions", "bidActions", "bidStore", "weddingActions", function ($q, invokeAsync, bidderActions, bidActions, bidStore, weddingActions) {
            var deferred = $q.defer();
            $q.all([
                invokeAsync(bidActions.getAllByCurrentProfile),
                invokeAsync(weddingActions.getAllByCurrentProfile)
            ]).then(function (results) {
                var promises = [];
                for (var i = 0; i < bidStore.byProfile.length; i++) {                    
                    promises.push(invokeAsync({
                        action: bidderActions.getByBidId,
                        params: { bidId: bidStore.byProfile[i].id }
                    }));
                };
                $q.all(promises).then(function () {
                    deferred.resolve();
                });                
            });
            return deferred.promise;
        }];
    }

    ngX.Component({
        component: CustomerMyProfileComponent,
        route: "/customer/myprofile",
        providers: [
            "safeDigest",
            "$scope",
            "bidderStore",
            "bidStore",
            "profileStore",
            "weddingActions",
            "weddingCollection",
            "weddingStore"
        ],
        template: [
            "<div class='customerMyProfile viewComponent'>",
            "   <div> ",
            "       <h1>{{ vm.profile.firstname }}  {{ vm.profile.lastname }}</h1><br/><br/>",
            "   </div> ",
            "   <div> ",
            "       <div class='customerMyProfile-list'> ",
            "           <h1>Weddings</h1>",
            "           <wedding-item wedding='wedding' data-ng-repeat='wedding in vm.weddings'></wedding-item> ",
            "       </div>",
            "       <div class='customerMyProfile-detail'> ",
            "           <wedding-detail wedding='vm.currentWedding'></wedding-detail>",
            "       </div>",
            "   <div style='clear:both;'></div> ",
            "</div>"
        ],
        styles: [
            " .customerMyProfile { ",
            "   width:100%; ",
            "   min-height:100%; ",
            "   display:block; ",
            "   position:relative; ",
            " } ",
            " .customerMyProfile-list, .customerMyProfile-detail { ",
            "   width:50%; ",
            "   position:relative; ",
            "   float:left; ",
            " } ",
        ]
    });

})();