angular.module("app", ["ngX", "ngX.components"]).config(["$routeProvider", "apiEndpointProvider", "loginRedirectProvider", function ($routeProvider, apiEndpointProvider, loginRedirectProvider) {

    $routeProvider.when("/", {
        "componentName": "homeComponent"
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

    $routeProvider.when("/caterer/register", {
        "componentName": "catererRegistrationComponent"
    });

    $routeProvider.when("/customer/register", {
        "componentName": "customerRegistrationComponent"
    });

    $routeProvider.when("/customer/myprofile", {
        "componentName": "customerMyProfileComponent",
        "authorizationRequired": true
    });

    $routeProvider.when("/caterer/myprofile", {
        "componentName": "catererMyProfileComponent",
        "authorizationRequired": true
    });

    $routeProvider.when("/myprofile", {
        "componentName": "catererMyProfileComponent",
        "authorizationRequired": true,
        resolve: {
            redirect: ["$q", "$location", "profileService", "PROFILE_TYPE", function ($q, $location, profileService, PROFILE_TYPE) {
                var deferred = $q.defer();
                profileService.getCurrentProfile().then(function (results) {
                    if (results.profileType == PROFILE_TYPE.CUSTOMER)
                        $location.path("/customer/myprofile");
                    
                    if (results.profileType == PROFILE_TYPE.CATERER)
                        $location.path("/caterer/myprofile");
                    
                    deferred.reject();
                });
                return deferred.promise;
            }]
        }
    });


    apiEndpointProvider.configure("/api");

    loginRedirectProvider.setDefaultUrl("/myprofile");


}]).run([function () {
    FastClick.attach(document.body);
}]);