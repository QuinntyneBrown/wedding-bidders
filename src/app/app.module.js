angular.module("app", ["ngX", "ngX.components"]).config(["$routeProvider", "apiEndpointProvider", "loginRedirectProvider", function ($routeProvider, apiEndpointProvider, loginRedirectProvider) {

    $routeProvider.when("/", {
        "componentName": "homeComponent"
    });

    $routeProvider.when("/promotion", {
        "componentName": "promotionComponent"
    });

    $routeProvider.when("/mymessages", {
        "componentName": "myMessagesComponent",
        "authorizationRequired": true
    });

    $routeProvider.when("/bids", {
        "componentName": "bidsComponent"
    });

    $routeProvider.when("/bid/create/:weddingId", {
        "componentName": "editBidComponent"
    });

    $routeProvider.when("/weddings", {
        "componentName": "weddingsComponent"
    });

    $routeProvider.when("/login", {
        "componentName": "loginComponent"
    });

    $routeProvider.when("/wedding/create", {
        "componentName": "editWeddingComponent",
        "authorizationRequired": true
    });

    $routeProvider.when("/wedding/edit/:id", {
        "componentName": "editWeddingComponent"
    });

    $routeProvider.when("/vendors", {
        "componentName": "vendorsComponent"
    });

    $routeProvider.when("/about", {
        "componentName": "aboutComponent"
    });

    $routeProvider.when("/bidder/register", {
        "componentName": "bidderRegistrationComponent"
    });

    $routeProvider.when("/customer/register", {
        "componentName": "customerRegistrationComponent"
    });

    $routeProvider.when("/reportanissue", {
        "componentName": "reportAnIssueComponent",
        "authorizationRequired": true
    });
    $routeProvider.when("/customer/myprofile", {
        "componentName": "customerMyProfileComponent",
        "authorizationRequired": true
    });

    $routeProvider.when("/bidder/myprofile", {
        "componentName": "bidderMyProfileComponent",
        "authorizationRequired": true
    });

    $routeProvider.when("/myaccount", {
        "componentName": "myAccountComponent",
        "authorizationRequired": true
    });

    $routeProvider.when("/myprofile", {
        "authorizationRequired": true,
        resolve: {
            redirect: ["$q", "$location", "dispatcher", "profileActions", "profileService", "profileStore", "PROFILE_TYPE", function ($q, $location, dispatcher, profileActions, profileService, profileStore, PROFILE_TYPE) {
                var deferred = $q.defer();

                var actionId = profileActions.getCurrentProfile();

                var listenerId = dispatcher.addListener({
                    actionType: "CHANGE",
                    callback: function (options) {
                        if (actionId === options.id) {
                            dispatcher.removeListener({ id: listenerId });

                            if (profileStore.currentProfile.profileType === PROFILE_TYPE.CUSTOMER) {
                                $location.path("/customer/myprofile");
                            }
                            else {
                                $location.path("/bidder/myprofile");
                            }

                            deferred.reject();
                        }
                    }
                });

                return deferred.promise;
            }]
        }
    });

    $routeProvider.when("/caterer/:id", {
        "componentName": "catererComponent"
    });

    apiEndpointProvider.configure("/api");

    loginRedirectProvider.setDefaultUrl("/myprofile");


}]).run([function () {
    FastClick.attach(document.body);
}]).config([
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