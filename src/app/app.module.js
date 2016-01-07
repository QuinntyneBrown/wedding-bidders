angular.module("app", ["ngX", "ngX.components"]).config(["$routeProvider", "apiEndpointProvider", "loginRedirectProvider", function ($routeProvider, apiEndpointProvider, loginRedirectProvider) {

    $routeProvider.when("/", {
        "componentName": "homeComponent"
    });

    $routeProvider.when("/bidder/profile/:id", {
        "componentName": "bidderProfileComponent"
    });

    $routeProvider.when("/admin/weddings", {
        "componentName": "adminWeddingsComponent"
    });

    $routeProvider.when("/payment", {
        "componentName": "paymentComponent"
    });

    $routeProvider.when("/personalize", {
        "componentName": "personalizeComponent"
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

    $routeProvider.when("/admin", {
        "componentName": "adminComponent",
        "authorizationRequired": true
    });



    $routeProvider.when("/myprofile", {
        "authorizationRequired": true,
        resolve: {
            redirect: ["$q", "$location", "invokeAsync", "profileActions", "profileStore", "PROFILE_TYPE",
                function ($q, $location, invokeAsync, profileActions, profileStore, PROFILE_TYPE) {
                invokeAsync(profileActions.getCurrentProfile).then(function () {
                    if (profileStore.currentProfile.profileType === PROFILE_TYPE.CUSTOMER)
                        $location.path("/customer/myprofile");
                    
                    if(profileStore.currentProfile.profileType === PROFILE_TYPE.INTERNAL)
                        $location.path("/admin");
                    
                    if (profileStore.currentProfile.profileType !== PROFILE_TYPE.INTERNAL
                        && profileStore.currentProfile.profileType !== PROFILE_TYPE.CUSTOMER)
                        $location.path("/bidder/myprofile");
                    
                    return $q.reject();
                });
            }]
        }
    });

    apiEndpointProvider.configure("/api");

    loginRedirectProvider.setDefaultUrl("/myprofile");


}]).run([function () {
    FastClick.attach(document.body);
}]).run(["carouselConfig", function (carouselConfig) {
    carouselConfig.default.startIndex = 175;
}]);

ngX.ConfigureRoutePromise({
    promise: function ($q, accountActions, accountStore, ACCOUNT_STATUS, invokeAsync, $location, profileActions, profileStore, securityStore) {
        if (securityStore.token) {
            $q.all([
                invokeAsync(accountActions.getCurrentAccount),
                invokeAsync(profileActions.getCurrentProfile)
            ]).then(function () {
                if (accountStore.currentAccount.accountStatus === ACCOUNT_STATUS.UNPAID) {
                    $location.path("/payment");
                    return $q.reject();
                }

                if (!profileStore.currentProfile.isPersonalized) {
                    $location.path("/personalize");
                    return $q.reject();
                }

                return $q.resolve();
            });
        } else {
            return $q.resolve();
        }
    },
    priority:-999
});