(function () {

    "use strict";

    function BidsComponent(appManager) {
        var self = this;

        self.bids = appManager.currentProfile.bids;

        return self;
    }


    BidsComponent.canActivate = function () {
        return ["$q", "appManager", "currentProfile", function ($q, appManager, currentProfile) {
            var deferred = $q.defer();
            currentProfile.createInstanceAsync().then(function (results) {
                appManager.currentProfile = results;
                deferred.resolve(true);
            });
            return deferred.promise;
        }];
    };

    ngX.Component({
        component: BidsComponent,
        route: "/bids",
        providers: ["appManager"],
        template: [
            "<div class='bids viewComponent'>",
            "<h1>Bids</h1>",
            "</div>"
        ].join(" ")
    });

})();


