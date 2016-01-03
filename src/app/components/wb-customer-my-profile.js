(function () {

    "use strict";

    function CustomerMyProfileComponent(safeDigest, $scope, bidStore, profileStore, weddingCollection, weddingStore) {
        var self = this;
        self.profileStore = profileStore;
        self.bidStore = bidStore;
        self.weddingCollection = weddingCollection;
        self.weddingStore = weddingStore;
        self.safeDigest = safeDigest;

        self.initialize = function () {
            self.profile = self.profileStore.currentProfile;
            self.weddings = self.weddingCollection.createInstance({
                data: self.weddingStore.weddingsByProfile,
                bids: self.bidStore.byProfile
            }).items;
            self.safeDigest($scope);
        }

        self.storeOnChange = function () {
            self.initialize();
        }

        self.initialize();

        return self;
    }

    CustomerMyProfileComponent.canActivate = function () {
        return ["$q", "invokeAsync", "bidActions", "weddingActions", function ($q, invokeAsync, bidActions, weddingActions) {
            return $q.all([
                invokeAsync(bidActions.getAllByCurrentProfile),
                invokeAsync(weddingActions.getAllByCurrentProfile)
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
            "profileStore",
            "weddingCollection",
            "weddingStore"
        ],
        template: [
            "<div class='customerMyProfile viewComponent'>",
            "<h1>{{ vm.profile.firstname }}  {{ vm.profile.lastname }}</h1><br/><br/>",
            "<div> ",
            "   <div class='customerMyProfile-list'> ",
            "       <h1>Weddings</h1>",
            "       <wedding-item wedding='wedding' data-ng-repeat='wedding in vm.weddings'></wedding-item> ",
            "   </div>",
            "   <div class='customerMyProfile-detail'> ",
            "       <h1>Wedding Detail</h1>",
            "   </div>",
            "   <div class='clear:both;'></div> ",
            "</div>"
        ],
        styles: [
            " .customerMyProfile { ",
            "   width:100%;",
            " } ",
            " .customerMyProfile-list, .customerMyProfile-detail { ",
            "   width:50%; ",
            "   position:relative; ",
            "   float:left; ",
            " } ",
        ]
    });

})();