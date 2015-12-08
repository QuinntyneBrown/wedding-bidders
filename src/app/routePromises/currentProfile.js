(function () {

    "use strict";


    angular.module("app").config([
        "routeResolverServiceProvider", function (routeResolverServiceProvider) {
            routeResolverServiceProvider.configure({
                priority: -999,
                promise: ["$q", "dispatcher", "profileActions", "securityStore", function ($q, dispatcher, profileActions, securityStore) {
                    var deferred = $q.defer();

                    if (!securityStore.token) {
                        deferred.resolve("true");
                    } else {
                        var actionId = profileActions.getCurrentProfile();

                        var listenerId = dispatcher.addListener({
                            actionType: "CHANGE",
                            callback: function (options) {
                                if (actionId === options.id) {
                                    dispatcher.removeListener({ id: listenerId });
                                    deferred.resolve(true);
                                }
                            }
                        });
                    }

                    return deferred.promise;
                }]
            });
        }
    ]);

})();