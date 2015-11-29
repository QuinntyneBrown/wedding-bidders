(function () {

    "use strict";

    function CatererMyProfileComponent(bidActions, dispatcher, profileStore) {
        var self = this;

        return self;
    }

    CatererMyProfileComponent.prototype.canActivate = function () {
        return ["$q", "profileService", "profileStore", "weddingService", "weddingStore", function ($q, profileService, profileStore, weddingService, weddingStore) {
            var deferred = $q.defer();
            $q.all([
                profileService.getCurrent(),
                weddingService.getAll()
            ]).then(function (resultsArray) {
                profileStore.currentProfile = resultsArray[0];
                weddingStore.allWeddings = resultsArray[1];
                deferred.resolve();
            });
            return deferred.promise;
        }];
    }

    ngX.Component({
        component: CatererMyProfileComponent,
        route: "/caterer/myprofile",
        providers: ["bidActions", "dispatcher", "profileStore"],
        template: [
            "<div class='catererMyProfile viewComponent'>",
            "</div>"
        ].join(" ")
    });

})();