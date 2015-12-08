(function () {

    "use strict";

    function MyMessagesComponent() {
        var self = this;

        return self;
    }

    MyMessagesComponent.canActivate = function () {
        return ["$q", function ($q) {
            var deferred = $q.defer();
            deferred.resolve(true);
            return deferred.promise;
        }];
    }

    ngX.Component({
        component: MyMessagesComponent,
        route: "/mymessages",
        providers: [],
        template: [
            "<div class='myMessages'>",
            "</div>"
        ].join(" ")
    });

})();