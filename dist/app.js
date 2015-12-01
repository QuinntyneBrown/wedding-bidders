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
                profileService.current().then(function (results) {
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
angular.module("app").value("WEDDING_ACTIONS", {
    ADD_WEDDING: "ADD_WEDDING",
    GET_ALL_WEDDINGS: "GET_ALL_WEDDINGS"
});

angular.module("app").value("SECURITY_ACTIONS", {
    LOGIN: "LOGIN",
});

angular.module("app").value("CATERER_ACTIONS", {
    ADD_CATERER: "ADD_CATERER",
});

angular.module("app").value("CUSTOMER_ACTIONS", {
    ADD_CUSTOMER: "ADD_CUSTOMER",
});

angular.module("app").value("BID_ACTIONS", {
    ADD_BID: "ADD_BID",
});

angular.module("app").value("PROFILE_ACTIONS", {
    GET_CURRENT_PROFILE : "GET_CURRENT_PROFILE"
});
(function () {

    "use strict";

    function bidActions(dispatcher, guid, bidService, BID_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.BID_ACTIONS = BID_ACTIONS;


        return self;
    }

    angular.module("app")
        .service("bidActions", ["dispatcher", "guid", "bidService", "BID_ACTIONS", bidActions])


})();
(function () {

    "use strict";

    function catererActions(dispatcher, guid, catererService, CATERER_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.CATERER_ACTIONS = CATERER_ACTIONS;

        self.add = function (options) {
            var newGuid = guid();

            catererService.add({
                data: {
                    firstname: options.firstname,
                    lastname: options.lastname,
                    email: options.email,
                    confirmEmail: options.confirmEmail,
                    password: options.password
                }
            }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.CATERER_ACTIONS.ADD_CATERER, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        return self;
    }

    angular.module("app")
        .service("catererActions", ["dispatcher", "guid", "catererService", "CATERER_ACTIONS", catererActions])


})();
(function () {

    "use strict";

    function customerActions(dispatcher, guid, customerService, CUSTOMER_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.CUSTOMER_ACTIONS = CUSTOMER_ACTIONS;

        self.add = function (options) {
            var newGuid = guid();

            customerService.add({
                data: {
                    firstname: options.firstname,
                    lastname: options.lastname,
                    email: options.email,
                    confirmEmail: options.confirmEmail,
                    password: options.password
                }
            }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.CUSTOMER_ACTIONS.ADD_CUSTOMER, options:
                        { data: results, id: newGuid }
                });
            });
            return newGuid;
        }

        return self;
    }

    angular.module("app")
        .service("customerActions", ["dispatcher", "guid", "customerService", "CUSTOMER_ACTIONS", customerActions])


})();
(function () {

    "use strict";


    function profileActions(dispatcher, guid, profileService, PROFILE_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.PROFILE_ACTIONS = PROFILE_ACTIONS;

        self.getCurrentProfile = function () {
            var newGuid = guid();
            profileService.getCurrentProfile().then(function (results) {
                self.dispatcher.emit({
                    actionType: self.PROFILE_ACTIONS.GET_CURRENT_PROFILE,
                    options: {
                        data: results,
                        id: newGuid
                    }
                });
            });

            return newGuid;
        };

        return self;
    }

    angular.module("app")
        .service("profileActions", ["dispatcher", "guid", "profileService", "PROFILE_ACTIONS", profileActions])


})();
(function () {

    "use strict";


    function securityActions(dispatcher, formEncode, guid, securityService, SECURITY_ACTIONS) {
        var self = this;
        self.dispatcher = dispatcher;
        self.SECURITY_ACTIONS = SECURITY_ACTIONS;
        self.tryToLogin = function (options) {
            var newGuid = guid();            
            securityService.tryToLogin({
                data: {
                    username:options.username,
                    password:options.password
                }
            }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.SECURITY_ACTIONS.LOGIN, options: {
                        token: results.access_token,
                        id: newGuid
                    }
                });                
            });
            return newGuid;
        };
        return self;
    }

    angular.module("app")
        .service("securityActions", ["dispatcher", "formEncode", "guid", "securityService", "SECURITY_ACTIONS", securityActions])


})();
(function () {

    "use strict";


    function weddingActions(dispatcher, guid, weddingService, WEDDING_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.WEDDING_ACTIONS = WEDDING_ACTIONS;

        self.add = function (options) {
            var newGuid = guid();
            weddingService.add({
                data: {
                    numberOfGuests: options.numberOfGuests,
                    numberOfHours: options.numberOfHours,
                    location: options.location
                }
            }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.WEDDING_ACTIONS.ADD_WEDDING,
                    options: {
                        data: results,
                        id: newGuid
                    }                    
                })
            });
           
            return newGuid;
        };

        self.getAll = function () {
            var newGuid = guid();
            weddingService.getAll().then(function (results) {
                self.dispatcher.emit({
                    actionType: self.WEDDING_ACTIONS.GET_ALL_WEDDINGS,
                    options: {
                        data: results,
                        id: newGuid
                    }
                });
            });

            return newGuid;
        };

        return self;
    }

    angular.module("app")
        .service("weddingActions", ["dispatcher", "guid", "weddingService", "WEDDING_ACTIONS", weddingActions])


})();
(function () {

    "use strict";

    ngX.Component({
        component: function AboutComponent() {

        },
        template: [
            "<div class='about'>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    ngX.Component({
        selector: "wb-app",
        component: function AppComponent() {

        },
        template: [
            "<div class='wbApp'>",
            "<wb-header></wb-header>",
            "<div class='mainContent' data-ng-view>",
            "</div>",
            "<wb-footer></wb-footer>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    ngX.Component({
        selector: "wb-banner",
        component: function BannerComponent($location) {
            var self = this;

            self.goHome = function () {
                $location.path("/");
            };

            return self;
        },
        styles: [
            " .wbBanner { height: 60px; } ",
            " .wbBanner h1 { text-align: center; font-size: 3em; cursor: pointer; } "
        ].join(" \n "),
        providers:["$location"],
        template: [
            "<div class='wbBanner'>",
            "<h1 data-ng-click='vm.goHome()'>Wedding Bidders</h1>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    ngX.Component({
        selector: "bid-form",
        component: function BidFormComponent(bidActions, dispatcher) {
            var self = this;
            self.bidActions = bidActions;
            self.dispatcher = dispatcher;

            self.listenerId = self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (self.addActionId === options.id) {
                        self.dispatcher.emit({
                            actionType: "BID_ADDED", options: {
                                username: self.email,
                                password: self.password
                            }
                        });
                    }
                }
            });

            self.tryToAdd = function () {
                self.addActionId = self.bidActions.add({
                    firstname: self.firstname,
                    lastname: self.lastname,
                    email: self.email,
                    confirmEmail: self.confirmEmail,
                    password: self.password
                });
            };

            self.dispose = function () {
                self.dispatcher.removeListener({ id: self.listenerId });
            }

            self.price = null;
            self.description = null;

            self.descriptionPlaceholder = "Description";
            self.pricePlaceholder = "Price";

            return self;
        },
        providers: [
            "bidActions", "dispatcher"
        ],
        styles: [
            ".bidForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; } "
        ],
        template: [
            "<form class='bidForm' name='bidForm'>",
            "   <text-form-control placeholder='vm.pricePlaceholder' model='vm.price' ></text-form-control>",
            "   <text-area-form-control placeholder='vm.descriptionPlaceholder' model='vm.description' ></text-area-form-control>",
            "   <button data-ng-click='vm.tryToAdd()'>Add</button>",
            "</form>"
        ].join(" ")
    });

})();
(function () {

    "use strict";

    function CatererBidsComponent() {
        var self = this;

        return self;
    }

    ngX.Component({
        component: CatererBidsComponent,
        route: "/caterer/bids",
        providers: [],
        template: [
            "<div class='catererBids'>",
            "</div>"
        ].join(" ")
    });

})();
(function () {

    "use strict";

    function CatererMyProfileComponent(bidActions, dispatcher, profileStore, weddingStore) {
        var self = this;
        self.profile = profileStore.currentProfile;
        self.weddings = weddingStore.weddings;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.profile = profileStore.currentProfile;
                self.weddings = weddingStore.weddings;
            }
        });

        self.dispose = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }

    CatererMyProfileComponent.prototype.canActivate = function () {
        return ["$q", "dispatcher", "profileActions", "weddingActions", function ($q, dispatcher, profileActions, weddingActions) {

            var deferred = $q.defer();
            var actionIds = [];
            actionIds.push(profileActions.getCurrentProfile());
            actionIds.push(weddingActions.getAll());            
            var listenerId = dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    for (var i = 0; i < actionIds.length; i++) {
                        if (actionIds[i] === options.id) {
                            actionIds.splice(i, 1);
                        }
                    }

                    if (actionIds.length === 0) {
                        dispatcher.removeListener({ id: listenerId });
                        deferred.resolve();
                    }
                        
                }
            });
            return deferred.promise;
        }];
    }

    ngX.Component({
        component: CatererMyProfileComponent,
        route: "/caterer/myprofile",
        providers: [
            "bidActions",
            "dispatcher",
            "profileStore",
            "weddingStore"],
        template: [
            "<div class='catererMyProfile viewComponent'>",
            "</div>"
        ].join(" ")
    });

})();
(function () {

    "use strict";

    function CatererProfileComponent($routeParams, catererStore) {
        var self = this;
        self.caterer = catererStore.getByName({ name: $routeParams.name});

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.caterer = catererStore.getByName({ name: $routeParams.name });
            }
        });

        self.dispose = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }

    CatererProfileComponent.prototype.canActivate = function () {
        return ["$q", "$routeParams", "dispatcher", "catererActions", "catererStore", function ($q, $routeParams, dispatcher, catererActions, catererStore) {

            var deferred = $q.defer();
            var actionIds = [];
            var catererName = $routeParams.name;

            actionIds.push(catererActions.getCatererByName({ name: catererName }));

            var listenerId = dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    for (var i = 0; i < actionIds.length; i++) {
                        if (actionIds[i] === options.id) {
                            actionIds.splice(i, 1);
                        }
                    }

                    if (actionIds.length === 0) {
                        dispatcher.removeListener({ id: listenerId });
                        deferred.resolve();
                    }

                }
            });
            return deferred.promise;
        }];
    }

    ngX.Component({
        component: CatererProfileComponent,
        route: "/caterer/profile/:name",
        providers: [
            "catererStore"],
        template: [
            "<div class='catererProfile viewComponent'>",
            "</div>"
        ].join(" ")
    });

})();
(function () {

    "use strict";

    ngX.Component({
        selector: "caterer-registration-form",
        component: function CatererRegistrationFormComponent(catererActions, dispatcher) {
            var self = this;
            self.catererActions = catererActions;
            self.dispatcher = dispatcher;

            self.firstname = null;
            self.lastname = null;
            self.companyName = null;
            self.email = null;
            self.confirmEmail = null;
            self.password = null;

            self.firstnamePlaceholder = "Firstname";
            self.lastnamePlaceholder = "Lastname";
            self.companyNamePlaceholder = "Company Name";
            self.emailPlaceholder = "Email";
            self.confirmEmailPlaceholder = "Confirm Email";
            self.passwordPlaceholder = "Password";
            self.addActionId = null;

            self.listenerId = self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (self.addActionId === options.id) {
                        self.dispatcher.emit({
                            actionType: "CATERER_ADDED", options: {
                                username: self.email,
                                password: self.password
                            }
                        });
                    }
                }
            });

            self.tryToRegister = function () {
                self.addActionId = self.catererActions.add({
                    firstname: self.firstname,
                    lastname: self.lastname,
                    companyName: self.companyName,
                    email: self.email,
                    confirmEmail: self.confirmEmail,
                    password: self.password
                });
            };

            self.dispose = function () {
                self.dispatcher.removeListener({ id: self.listenerId });
            }

            return self;
        },
        styles: [
            "  .catererRegistrationForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; }"
        ].join( " /n "),
        providers: [
            "catererActions",
            "dispatcher"
        ],
        template: [
            "<form class='catererRegistrationForm' name='catererRegistrationForm'>",
            "   <text-form-control placeholder='vm.firstnamePlaceholder' model='vm.firstname' ></text-form-control>",
            "   <text-form-control placeholder='vm.lastnamePlaceholder' model='vm.lastname' ></text-form-control>",
            "   <text-form-control placeholder='vm.companyNamePlaceholder' model='vm.companyName' ></text-form-control>",
            "   <text-form-control placeholder='vm.emailPlaceholder' model='vm.email' ></text-form-control>",
            "   <text-form-control placeholder='vm.confirmEmailPlaceholder' model='vm.confirmEmail'></text-form-control>",
            "   <text-form-control placeholder='vm.passwordPlaceholder' model='vm.password'></text-form-control>",
            "   <button data-ng-click='vm.tryToRegister()'>Register</button>",
            "</form>"
        ].join(" ")
    });

})();
(function () {

    "use strict";

    ngX.Component({
        component: function CatererRegistrationComponent($location, dispatcher, securityActions) {

            var self = this;
            self.$location = $location;
            self.dispatcher = dispatcher;
            self.securityActions = securityActions;
            self.loginId = null;
            self.listenerIds = [];

            self.listenerIds.push(self.dispatcher.addListener({
                actionType: "CATERER_ADDED",
                callback: function (options) {
                    self.loginId = securityActions.tryToLogin({
                        username: options.username,
                        password: options.password
                    });
                }
            }));

            self.listenerIds.push(self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (self.loginId && self.loginId === options.id) {
                        self.$location.path("/caterer/myprofile");
                    }
                }
            }));

            self.deactivate = function () {
                for (var i = 0; i < self.listenerIds.length; i++) {
                    self.dispatcher.removeListener({ id: self.listenerIds[i] });
                }
            }

            return self;
        },
        providers: [
            "$location",
            "dispatcher",
            "securityActions"],
        template: [
            "<div class='catererRegistration viewComponent'>",
            "<caterer-registration-form></caterer-registration-form>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    ngX.Component({
        component: function CatererComponent() {

        },
        template: [
            "<div class='caterer'>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    function CustomerBidsComponent() {
        var self = this;

        return self;
    }

    ngX.Component({
        component: CustomerBidsComponent,
        route: "/customer/bids",
        providers: [],
        template: [
            "<div class='customerBids'>",
            "</div>"
        ].join(" ")
    });

})();
(function () {

    "use strict";

    function CustomerMyProfileComponent(dispatcher, profileStore) {
        var self = this;
        self.profile = profileStore.currentProfile;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.profile = profileStore.currentProfile;
            }
        });

        self.dispose = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }

    CustomerMyProfileComponent.prototype.canActivate = function () {
        return ["$q", "dispatcher", "profileActions", function ($q, dispatcher, profileActions) {
            var deferred = $q.defer();
            var actionIds = [];
            actionIds.push(profileActions.getCurrentProfile());
            
            var listenerId = dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    for (var i = 0; i < actionIds.length; i++) {
                        if (actionIds[i] === options.id) {
                            actionIds.splice(i, 1);
                        }
                    }

                    if (actionIds.length === 0) {
                        dispatcher.removeListener({ id: listenerId });
                        deferred.resolve();
                    }

                }
            });
            return deferred.promise;
        }];
    }

    ngX.Component({
        component: CustomerMyProfileComponent,
        route: "/customer/myprofile",
        providers: [
            "dispatcher",
            "profileStore"],
        template: [
            "<div class='customerMyProfile viewComponent'>",
            "</div>"
        ].join(" ")
    });

})();
(function () {

    "use strict";

    ngX.Component({
        selector: "customer-registration-form",
        component: function CustomerRegistrationFormComponent(customerActions, dispatcher) {
            var self = this;
            self.customerActions = customerActions;
            self.dispatcher = dispatcher;

            self.firstname = null;
            self.lastname = null;
            self.email = null;
            self.confirmEmail = null;
            self.password = null;

            self.firstnamePlaceholder = "Firstname";
            self.lastnamePlaceholder = "Lastname";
            self.emailPlaceholder = "Email";
            self.confirmEmailPlaceholder = "Confirm Email";
            self.passwordPlaceholder = "Password";
            self.addActionId = null;

            self.listenerId = self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (self.addActionId === options.id) {
                        self.dispatcher.emit({
                            actionType: "CUSTOMER_ADDED", options: {
                                username: self.email,
                                password: self.password
                            }
                        });
                    }
                }
            });

            self.tryToRegister = function () {
                self.addActionId = self.customerActions.add({
                    firstname: self.firstname,
                    lastname: self.lastname,
                    email: self.email,
                    confirmEmail: self.confirmEmail,
                    password: self.password
                });
            };

            self.dispose = function () {
                self.dispatcher.removeListener({ id: self.listenerId });
            }

            return self;
        },
        providers: [
            "customerActions", "dispatcher"
        ],
        styles: [
            " .customerRegistrationForm { ",
            "  ",
            "  }",
            " .customerRegistrationForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; } "
        ].join(" \n "),
        template: [
            "<form class='customerRegistrationForm' name='customerRegistrationForm'>",
            "   <text-form-control placeholder='vm.firstnamePlaceholder' model='vm.firstname' ></text-form-control>",
            "   <text-form-control placeholder='vm.lastnamePlaceholder' model='vm.lastname' ></text-form-control>",
            "   <text-form-control placeholder='vm.emailPlaceholder' model='vm.email' ></text-form-control>",
            "   <text-form-control placeholder='vm.confirmEmailPlaceholder' model='vm.confirmEmail'></text-form-control>",
            "   <text-form-control placeholder='vm.passwordPlaceholder' model='vm.password'></text-form-control>",
            "   <button data-ng-click='vm.tryToRegister()'>Register</button>",
            "</form>"
        ].join(" ")
    });

})();
(function () {

    "use strict";

    ngX.Component({
        component: function CustomerRegistrationComponent($location, dispatcher, securityActions) {

            var self = this;
            self.$location = $location;
            self.dispatcher = dispatcher;
            self.securityActions = securityActions;
            self.loginId = null;
            self.listenerIds = [];

            self.listenerIds.push(self.dispatcher.addListener({
                actionType: "CUSTOMER_ADDED",
                callback: function (options) {
                    self.loginId = securityActions.tryToLogin({
                        username: options.username,
                        password: options.password
                    });
                }
            }));

            self.listenerIds.push(self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (self.loginId && self.loginId === options.id) {
                        self.$location.path("/customer/myprofile");
                    }
                }
            }));

            self.deactivate = function () {
                for (var i = 0; i < self.listenerIds.length; i++) {
                    self.dispatcher.removeListener({ id: self.listenerIds[i] });
                }
            }


        },
        providers:["$location","dispatcher","securityActions"],
        template: [
            "<div class='customerRegistration viewComponent'>",
            "<customer-registration-form></customer-registration-form>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    function CustomerWeddingsComponent(customerStore, weddingStore) {
        var self = this;

        self.customerStore = customerStore;
        self.weddingStore = weddingStore;

        self.onInit = function () {
            self.customer = self.customerStore.getCurrentCustomer();
        }

        self.onUpdate = function () {
            self.customer = self.customerStore.getCurrentCustomer();
        }

        self.dispose = function () {
            self.customer = null;
            self.customerStore = null;
            delete self.customer;
            delete self.customerStore;
        }

        return self;
    }

    CustomerWeddingsComponent.prototype.canActivate = function () {
        return ["$q",function($q) {
            var deferred = $q.defer();
            deferred.resolve(true);
            return deferred.promise;
        }];
    }

    ngX.Component({
        component: CustomerWeddingsComponent,
        route: "/myWeddings",
        providers: [
            "customerStore",
            "weddingStore"
        ],
        template: [
            "<div class='customerWeddings'>",
            "</div>"
        ].join(" ")
    });

})();
(function () {

    "use strict";

    ngX.Component({
        component: function CustomerComponent() {

        },
        template: [
            "<div class='customer'>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    ngX.Component({
        selector:"edit-wedding-form",
        component: function EditWeddingFormComponent(dispatcher, weddingActions) {
            var self = this;
            self.dispatcher = dispatcher;
            self.weddingActions = weddingActions;

            self.numberOfGuests = null;
            self.location = null;
            self.numberOfHours = null;

            self.listenerId = self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (self.addActionId === options.id) {
                        self.dispatcher.emit({
                            actionType: "WEDDING_ADDED"
                        });
                    }
                }
            });

            self.add = function () {
                self.addActionId = self.weddingActions.add({
                    numberOfGuests: self.numberOfGuests,
                    location: self.location,
                    numberOfHours: self.numberOfHours
                });
            };

            self.dispose = function () {
                self.dispatcher.removeListener({ id: self.listenerId });
            }
            return self;
        },
        providers: ["dispatcher", "weddingActions"],
        styles: [
            " .editWeddingForm { } ",
            " .inputField { padding-left: 15px; } ",
            " .formControl input { ",
            " line-height: 30px; ",
            " height: 30px; ",
            " border: 1px solid #575656 ",
            " padding-left: 7px ",
            " text-align: left; ",
            " width: 200px; ",
            "  ",
            " } ",

            " .formControl { margin-bottom: 15px; } ",

            " .editWeddingForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; } "
        ].join(" \n "),
        inputs:["model"],
        template: [
            "<form class='editWeddingForm' name='editWeddingForm'>",

            "<div class='formControl'>",
            "<input class='inputField' type='text' data-ng-model='vm.numberOfGuests' placeholder='Number Of Guests'></input>",
            "</div>",

            "<div class='formControl'>",
            "<input class='inputField' type='text' data-ng-model='vm.location'  placeholder='Location'></input>",
            "</div>",

            "<div class='formControl'>",
            "<input class='inputField' type='text'  data-ng-model='vm.numberOfHours'  placeholder='Number Of Hours'></input>",
            "</div>",

            "<button data-ng-click='vm.add()'>Create</button>",
            "</form>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    function EditWeddingComponent($location,dispatcher,wedding) {
        var self = this;
        self.wedding = wedding;
        self.listenerId = dispatcher.addListener({
            actionType: "MODEL_ADDED", callback: function (options) {
                $location.path("/wedding/edit/" + options.id)
            }
        });

        self.onDestroy = function () {

        };
        return self;
    }

    ngX.Component({
        component: EditWeddingComponent,
        routes: ["/wedding/edit/:id","/wedding/create"],
        providers: ["$location", "dispatcher", "wedding"],
        styles: [" .editWeddingComponent { padding-left:15px; } "].join(" /n "),
        template: [
            "<div class='editWeddingComponent viewComponent'>",
            "<edit-wedding-form model='vm.wedding'></edit-wedding-form>",
            "</div>"
        ].join(" ")
    });

})();



(function () {

    "use strict";

    ngX.Component({
        selector: "wb-footer",
        component: function FooterComponent() {

        },
        styles:[
            " .wbFooter { height: 300px; background-color: #222; } "
        ].join(" /n "),
        template: [
            "<div class='wbFooter'>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    ngX.Component({
        selector: "wb-hamburger-button",
        component: function HamburgerButtonComponent($compile, $location, $q, $scope, appendToBodyAsync, extendCssAsync, removeElement, securityStore, setOpacityAsync) {
            var self = this;
            self.$compile = $compile;
            self.$location = $location;
            self.$q = $q;
            self.$scope = $scope;
            self.appendToBodyAsync = appendToBodyAsync;
            self.extendCssAsync = extendCssAsync;
            self.removeElement = removeElement;
            self.securityStore = securityStore;
            self.setOpacityAsync = setOpacityAsync;


            self.isOpen = false;

            self.onInit = function () {

            }

            self.onClick = function () {
                if (self.isOpen) {
                    self.closeAsync()
                } else {
                    self.openAsync().then(function () {
                        self.isOpen = true;
                    });
                }                
            }

            self.openAsync = function () {
                var deferred = self.$q.defer();
                self.initializeAsync()
                    .then(self.appendMenuToBodyAsync)
                    .then(self.showAsync)
                    .then(function()  {
                        self.isOpen = true;
                        deferred.resolve();

                    });
                return deferred.promise;
            }

            self.closeAsync = function () {
                var deferred = self.$q.defer();
                self.hideAsync().then(function (results) {
                    self.dispose();
                    self.isOpen = false;
                    deferred.resolve();
                });
                return deferred.promise;
            }

            self.navigateToLogin = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/login");
                });
            }

            self.navigateToCreateAccount = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/customer/register");
                });
            }

            self.navigateToCreateVendorAccount = function () {
                self.closeAsync().then(function () {
                    self.$location.path("/caterer/register");
                });
            }

            self.menuHTML = [
                "<div class='wbHamburgerMenu' data-ng-click='vm.onClick()'>",
                "   <div class='wbHamburgerMenu-container'>",
                "       <div class='wbHamburgerMenu-links'>",
                "           <div><a data-ng-click='vm.navigateToLogin()'>Login</a><div>",
                "           <div><a data-ng-click='vm.navigateToCreateAccount()'>Create Account</a><div>",
                "           <div><a data-ng-click='vm.navigateToCreateVendorAccount()'>Create Vendor Account</a><div>",
                "       </div>",
                "   </div>",
                "</div>"
            ].join(" ");

            self.anonymousMenuHtml = [
                "<div class='wbHamburgerMenu' data-ng-click='vm.onClick()'>",
                "   <div class='wbHamburgerMenu-container'>",
                "       <div class='wbHamburgerMenu-links'>",
                "           <div><a data-ng-click='vm.navigateToLogin()'>Login</a><div>",
                "           <div><a data-ng-click='vm.navigateToCreateAccount()'>Create Account</a><div>",
                "           <div><a data-ng-click='vm.navigateToCreateVendorAccount()'>Create Vendor Account</a><div>",
                "       </div>",
                "   </div>",
                "</div>"
            ].join(" ");

            self.initializeAsync = function() {
                var deferred = self.$q.defer();

                self.augmentedJQuery = self.$compile(angular.element(securityStore.token ? self.menuHTML : self.anonymousMenuHtml))(self.$scope);
                self.nativeElement = self.augmentedJQuery[0];

                self.extendCssAsync({
                    nativeHTMLElement: self.nativeElement,
                cssObject: {
                    "-webkit-transition": "opacity 25ms ease-in-out",
                    "-o-transition": "opacity 25ms ease-in-out",
                    "transition": "opacity 25ms ease-in-out",
                    "opacity": "0",
                    "position": "fixed",
                    "top": "0",
                    "left": "0",
                    "height": "100%",
                    "width": "100%",
                    "background-color":"rgba(0, 0, 0, .75)",
                    "display": "block",
                    "z-index":"999"
                }
                }).then(function () {
                    deferred.resolve();
                });

                return deferred.promise;
            }

            self.showAsync = function() {
                return self.setOpacityAsync({ nativeHtmlElement: self.nativeElement, opacity: 25 });
            }
    
            self.appendMenuToBodyAsync = function() {
                return self.appendToBodyAsync({ nativeElement: self.nativeElement });
            }

            self.hideAsync = function() {
                return self.setOpacityAsync({ nativeHtmlElement: self.nativeElement, opacity: 0 });
            }

            self.dispose = function () {
                try {
                    self.removeElement({ nativeHTMLElement: self.nativeElement });
                    self.augmentedJQuery = null;
                }
                catch (error) {

                }
            }

            self.nativeElement; 

            self.augmentedJQuery;

            self.isAnimating= false;

            return self;
        },
        styles: [

            " .wbHamburgerButton { ",
            "     width:20px; ",
            "     height:24px; ",
            "     background-color: #FFF; ",
            "     border: #aaaaaa 0px solid; ",
            "     border-radius: 2px; ",
            "     padding: 2px 5px; ",
            "     cursor:pointer; ",
            " } ",

            " .wbHamburgerMenu { ",
            "     width: 100%; ",
            " } ",

            " .wbHamburgerButton div { ",
            "     width: 20px; ",
            "     height: 3px; ",
            "     background: #333; ",
            "     margin: 4px 0; ",
            "     border-radius: 2px; ",
            " } ",

            " .wbHamburgerMenu-container { ",
            "     max-width: 1024px; ",
            "     margin: 0 auto; ",
            " } ",

            " .wbHamburgerMenu a { ",
            "     font-size: 1.75em; ",
            "     line-height: 3.625em; ",
            "     color: #FFF; ",
            "     cursor: pointer; ",
            " } ",

            " .wbHamburgerMenu a:hover { ",
            "     text-decoration: underline; ",
            " } ",

            " .wbHamburgerMenu-links { ",
            "     position: relative; ",
            "     text-align: right; ",
            "     float: right; ",
            "     padding-top: 20px; ",
            "     margin-right: 70px; ",
            " } "


        ].join(" \n "),
        providers: ["$compile","$location","$q", "$scope", "appendToBodyAsync", "extendCssAsync", "removeElement", "securityStore", "setOpacityAsync"],
        template: [
            "<div class='wbHamburgerButton' data-ng-click='vm.onClick()'>",
            "<div></div>",
            "<div></div>",
            "<div></div>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    ngX.Component({
        selector: "wb-header",
        component: function HeaderComponent() {

        },
        styles: [
            " .wbHeader { } "
        ].join(" /n "),
        template: [
            "<div class='wbHeader'>",
            "<wb-top-banner></wb-top-banner>",
            "<wb-banner></wb-banner>",
            "<wb-navigation></wb-navigation>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    function HomeComponent() {
        var self = this;



        return self;
    }

    ngX.Component({
        component: HomeComponent,
        route: "/",
        providers: [],
        template: [
            "<div class='home'>",            
            "</div>"
        ].join(" ")
    });

})();
(function () {

    "use strict";

    ngX.Component({
        selector: "wb-login-form",
        component: function LoginFormComponent($location, dispatcher, securityActions) {
            var self = this;
            self.$location = $location;
            self.dispatcher = dispatcher;
            self.securityActions = securityActions;
            self.loginId = null;

            self.onInit = function () {
                self.username = null;
                self.password = null;
                self.attempts = 0;
            }

            self.usernamePlaceholder = "Username";
            self.passwordPlaceholder = "Password";

            self.tryToLogin = function () {
                self.loginId = securityActions.tryToLogin({
                    username: self.username,
                    password: self.password
                });
            }

            self.listenerId = self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (self.loginId === options.id) {
                        self.dispatcher.emit({
                            actionType: "LOGIN_SUCCESS"
                        });
                    }
                }
            });

            self.dispose = function () {
                self.dispatcher.removeListener({ id: self.listenerId });
            }

            return self;
        },
        styles: [
            " .wbLoginForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; } "
        ],
        providers: [
            "$location", "dispatcher", "securityActions"
        ],
        template: [
            "<form class='wbLoginForm' name='wbLoginForm'>",
            "   <text-form-control placeholder='vm.usernamePlaceholder' model='vm.username' ></text-form-control>",
            "   <text-form-control placeholder='vm.passwordPlaceholder' model='vm.password' ></text-form-control>",
            "   <button data-ng-click='vm.tryToLogin()'>Login</button>",
            "</form>"
        ].join(" ")
    });

})();
(function () {

    "use strict";

    ngX.Component({
        component: function LoginComponent(dispatcher, loginRedirect) {
            var self = this;
            self.dispatcher = dispatcher;
            self.loginRedirect = loginRedirect;

            self.listenerId = self.dispatcher.addListener({
                actionType: "LOGIN_SUCCESS",
                callback: function (options) {
                    loginRedirect.redirectPreLogin();
                }
            });

            self.deactivate = function () {
                self.dispatcher.removeListener({ id: self.listenerId });
            }

            return self;
        },
        providers: [
            "dispatcher", "loginRedirect"
        ],
        template: [
            "<div class='login viewComponent'>",
            "<wb-login-form></wb-login-form>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    ngX.Component({
        selector: "wb-navigation",
        component: function NavigationComponent() {

        },
        styles: [
            " .wbNavigation { height: 100px; text-align: center; } ",
            " .wbNavigation a { text-decoration: none; color: #000; padding-right:7px; padding-left:7px; font-weight:300; } "
        ].join(" \n "),
        template: [
            "<div class='wbNavigation'>",
            "<a href='#/wedding/create'>SUBMIT WEDDING</a>",
            "<a href='#/vendors'>VENDORS</a>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    ngX.Component({
        component: function RegistrationComponent() {

        },
        template: [
            "<div class='registration'>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    ngX.Component({
        selector: "text-area-form-control",
        component: function TextAreaFormControlComponent($attrs) {
            var self = this;
            self.$attrs = $attrs;

            self.onInit = function () {
                
            }

            self.rows = self.$attrs["rows"] || 4;

            return self;
        },
        styles: [
            " .textareaField { padding-left: 15px; } ",

            " .formControl textarea { ",
            "   line-height: 30px; ",
            "   border: 1px solid #575656 ",
            "   padding-left: 7px ",
            "   text-align: left; ",
            "   width: 200px; ",
            " } ",

            " .formControl { margin-bottom: 15px; } ",
        ].join(" \n "),
        inputs: ["placeholder", "model"],
        providers: ["$attrs"],
        template: [
            "<div class='formControl'>",
            "<textarea class='textareaField' rows='{{ ::vm.rows }}' placeholder='{{ ::vm.placeholder}}' data-ng-model='vm.model'></input>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    ngX.Component({
        selector: "text-form-control",
        component: function TextFormControlComponent($attrs) {
            var self = this;

            self.onInit = function () {
                self.type = self.placeholder === 'Password' ? "password" : "text";
            }
            
            return self;
        },
        styles: [
            " .inputField { padding-left: 15px; } ",

            " .formControl input { ",
            "   line-height: 30px; ",
            "   height: 30px; ",
            "   border: 1px solid #575656 ",
            "   padding-left: 7px ",
            "   text-align: left; ",
            "   width: 200px; ",
            " } ",

            " .formControl { margin-bottom: 15px; } ",
        ].join(" \n "),
        inputs: ["placeholder", "model"],
        providers: ["$attrs"],
        template: [
            "<div class='formControl'>",
            "<input class='inputField' type='{{vm.type}}' placeholder='{{ ::vm.placeholder}}' data-ng-model='vm.model'></input>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    ngX.Component({
        selector: "wb-top-banner",
        component: function TopBannerComponent() {

        },
        styles: [
            " .wbTopBanner { height: 50px; padding-right:15px; padding-top:15px; } ",
            " .wbTopBanner .wbHamburgerButton { position:relative; float:right; } "
        ].join(" \n "),
        template: [
            "<div class='wbTopBanner'>",
            "<wb-hamburger-button></wb-hamburger-button>",
            "<div style='clear:both;'></div>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    function VendorsComponent(dispatcher, venderStore) {
        var self = this;

        self.vendors = venderStore.vendors;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.vendors = venderStore.vendors;
            }
        });


        self.deactivate = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }


    VendorsComponent.prototype.canActivate = function () {
        return ["$q", "dispatcher", "vendorActions", function ($q, dispatcher, vendorActions) {
            var deferred = $q.defer();
            var actionIds = [];
            actionIds.push(vendorActions.getAll());

            var listenerId = dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    for (var i = 0; i < actionIds.length; i++) {
                        if (actionIds[i] === options.id) {
                            actionIds.splice(i, 1);
                        }
                    }

                    if (actionIds.length === 0) {
                        dispatcher.removeListener({ id: listenerId });
                        deferred.resolve();
                    }

                }
            });
            return deferred.promise;
        }];
    };

    ngX.Component({
        component: VendorsComponent,
        route: "/vendors",
        providers: ["dispatcher", "venderStore"],
        template: [
            "<div class='vendors'>",
            "<h1>Vendors</h1>",
            "</div>"
        ].join(" ")
    });

})();



(function () {

    "use strict";

    function WeddingsComponent(dispatcher, weddingStore) {
        var self = this;

        self.weddings = weddingStore.weddings;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.weddings = weddingStore.weddings;
            }
        });


        self.deactivate = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }


    WeddingsComponent.prototype.canActivate = function () {
        return ["$q","dispatcher","weddingActions", function ($q,dispatcher,weddingActions) {
            var deferred = $q.defer();
            var actionIds = [];
            actionIds.push(weddingActions.getAll());

            var listenerId = dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    for (var i = 0; i < actionIds.length; i++) {
                        if (actionIds[i] === options.id) {
                            actionIds.splice(i, 1);
                        }
                    }

                    if (actionIds.length === 0) {
                        dispatcher.removeListener({ id: listenerId });
                        deferred.resolve();
                    }

                }
            });
            return deferred.promise;
        }];
    };

    ngX.Component({
        component: WeddingsComponent,
        route: "/weddings",
        providers: ["dispatcher", "weddingStore"],
        template: [
            "<div class='weddings'>",
            "<h1>Weddings</h1>",
            "</div>"
        ].join(" ")
    });

})();



(function () {

    "use strict";

    function bid() {
        var self = this;

        return self;
    }

    angular.module("app").service("bid", [bid]);

})();
(function () {

    "use strict";

    function caterer() {
        var self = this;

        return self;
    }

    angular.module("app").service("caterer", [caterer]);

})();
(function () {

    "use strict";

    function customer() {
        var self = this;

        return self;
    }

    angular.module("app").service("customer", [customer]);

})();
angular.module("app").value("PROFILE_TYPE", {
    CUSTOMER: 0,
    CATERER: 1
});
(function () {

    "use strict";

    function wedding(dispatcher, weddingActions, weddingStore) {
        var self = this;
        self.id = null;
        self.dispatcher = dispatcher;
        self.numberOfGuests = null;
        self.weddingActions = weddingActions;
        self.weddingStore = weddingStore;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                if (self.addActionId === options.id) {
                    self.dispatcher.emit({ actionType: "MODEL_ADDED", options: { id: self.weddingStore.currentWedding.id } });
                }
            }
        });

        self.createInstance = function (options) {
            var instance = new wedding(self.weddingActions, self.weddingStore);
            if (options.data) {
                instance.id = options.data.id;
                instance.numberOfGuests = options.data.numberOfGuests;
            }
            return instance;
        }
        
        self.add = function () {
            self.addActionId = weddingActions.add({ model: self });
        }

        self.onStoreUpdate = function () {

        }


        self.onDestroy = function () { self.dispatcher.removeListener({ id: self.listenerId }); }

        return self;
    }

    angular.module("app").service("wedding", ["dispatcher","weddingActions","weddingStore",wedding]);

})();
(function () {

    "use strict";

    function eventEmitter(guid) {

        var self = this;

        self.listeners = [];

        self.addListener = function (options) {
            var id = guid();
            self.listeners.push({
                id: id,
                actionType: options.actionType,
                callback: options.callback
            });
            return id;
        };

        self.removeListener = function (options) {
            var length = self.listeners.length
            for (var i = 0; i < length; i++) {
                if (self.listeners[i] &&  self.listeners[i].id === options.id) {
                    self.listeners.splice(i, 1);
                    i = length;
                }
            }
        }

        self.emit = function (options) {
            for (var i = 0; i < self.listeners.length; i++) {
                if (self.listeners[i].actionType === options.actionType) {
                    self.listeners[i].callback(options.options);
                }
            }
        }

        return self;
    }

    angular.module("app").service("dispatcher", ["guid", eventEmitter]);

})();
(function () {

    "use strict";

    function fetch($http, $q, localStorageManager) {

        var self = this;
        self.$http = $http;
        self.$q = $q;
        self.localStorageManager = localStorageManager;

        self.inMemoryCache = {};

        self.fromCacheOrService = function (options) {
            var deferred = self.$q.defer();
            var cachedData = self.localStorageManager.get(self.getCacheKey(options));
            if (!cachedData) {
                self.fromService(options).then( function (results) {
                    deferred.resolve(results);
                }).catch(function (error) {
                    deferred.reject(error);
                });
            } else {
                deferred.resolve(cachedData.value);
            }
            return deferred.promise;
        }

        self.fromInMemoryCacheOrService = function (options) {
            var deferred = self.$q.defer();

            var cachedData = self.inMemoryCache[self.getCacheKey(options)];

            if (!cachedData) {
                self.$http({ method: options.method, url: options.url, data: options.data, params: options.params }).then( function (results) {
                    self.inMemoryCache[self.getCacheKey(options)] = results;
                    deferred.resolve(results);
                }).catch( function (error) {
                    deferred.reject(error);
                });
            } else {
                deferred.resolve(cachedData);
            }
            return deferred.promise;
        }

        self.fromService = function (options) {
            var deferred = self.$q.defer();

            self.$http({ method: options.method, url: options.url, data: options.data, params: options.params }).then( function (results) {
                deferred.resolve(results);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        self.getCacheKey = function (options) {
            return options.key || options.url + JSON.stringify(options.params) + JSON.stringify(options.data);
        }

        self.invalidateCache = function (cacheKey) {
            //TODO= Implement
        }

        return self;
    }

    angular.module("app").service("fetch", ["$http","$q","localStorageManager",fetch]);

})();
(function () {

    "use strict";

    function bidService($q, apiEndpoint, fetch) {
        var self = this;
        self.add = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "POST", url: self.baseUri + "/add", data: options.data }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }
        self.baseUri = apiEndpoint.getBaseUrl() + "/bid";
        return self;
    }

    angular.module("app").service("bidService", ["$q", "apiEndpoint", "fetch", bidService]);

})();
(function () {

    "use strict";

    function catererService($q, apiEndpoint, fetch) {
        var self = this;
        self.add = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "POST", url: self.baseUri + "/add", data: options.data }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }
        self.baseUri = apiEndpoint.getBaseUrl() + "/caterer";
        return self;
    }

    angular.module("app").service("catererService", ["$q", "apiEndpoint", "fetch", catererService]);

})();
(function () {

    "use strict";

    function customerService($q, apiEndpoint, fetch) {
        var self = this;
        self.add = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "POST", url: self.baseUri + "/add", data: options.data }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }
        self.baseUri = apiEndpoint.getBaseUrl() + "/customer";
        return self;
    }

    angular.module("app").service("customerService", ["$q", "apiEndpoint", "fetch", customerService]);

})();
(function () {

    "use strict";

    function profileService($q, apiEndpoint, fetch) {
        var self = this;
        self.$q = $q;
        self.getCurrentProfile = function (options) {
            var deferred = self.$q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/current" }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        };

        self.baseUri = apiEndpoint.getBaseUrl() + "/profile";

        return self;
    }

    angular.module("app").service("profileService", ["$q", "apiEndpoint", "fetch", profileService]);

})();
(function () {

    "use strict";

    function securityService($q, apiEndpoint, fetch, formEncode) {
        var self = this;
        self.$q = $q;
        self.tryToLogin = function (options) {
            var deferred = self.$q.defer();
            angular.extend(options.data, { grant_type: "password" });
            var formEncodedData = formEncode(options.data);
            var headers = { "Content-Type": "application/x-www-form-urlencoded" };
            fetch.fromService({ method: "POST", url: self.baseUri + "/token", data: formEncodedData, headers: headers }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;            
        };

        self.baseUri = apiEndpoint.getBaseUrl() + "/security";

        return self;
    }

    angular.module("app").service("securityService", ["$q", "apiEndpoint", "fetch", "formEncode",securityService]);

})();
(function () {

    "use strict";

    function weddingService($q, apiEndpoint, fetch) {
        var self = this;
        self.add = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "POST", url: self.baseUri + "/add", data: options.data }).then(function(results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;            
        }

        self.getAll = function (options) {
            var deferred = $q.defer();
            fetch.fromService({ method: "GET", url: self.baseUri + "/getAll", data: options.data }).then(function (results) {
                deferred.resolve(results.data);
            });
            return deferred.promise;
        }

        self.baseUri = apiEndpoint.getBaseUrl() + "/wedding";
        return self;
    }

    angular.module("app").service("weddingService", ["$q","apiEndpoint","fetch",weddingService]);

})();
(function () {

    "use strict";

    function bidStore(dispatcher, guid, BID_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;

        self.dispatcher.addListener({
            actionType: BID_ACTIONS.ADD_BID,
            callback: function (options) {
                self.addItem(options.data);
                self.currentBid = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.bids = [];

        self.currentBid = null;

        self.addItem = function (options) { self.bids.push(options.data); }

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        return self;
    }

    angular.module("app").service("bidStore", ["dispatcher", "guid", "BID_ACTIONS", bidStore]);
})();
(function () {

    "use strict";

    function catererStore(dispatcher, guid, CATERER_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;

        self.dispatcher.addListener({
            actionType: CATERER_ACTIONS.ADD_CATERER,
            callback: function (options) {
                self.addItem(options.data);
                self.currentCaterer = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.caterers = [];

        self.currentCaterer = null;

        self.addItem = function (options) { self.caterers.push(options.data); }

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        return self;
    }

    angular.module("app").service("catererStore", ["dispatcher", "guid", "CATERER_ACTIONS", catererStore])
    .run(["catererStore", function (catererStore) { }]);
})();
(function () {

    "use strict";

    function customerStore(dispatcher, guid, CUSTOMER_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;

        self.dispatcher.addListener({
            actionType: CUSTOMER_ACTIONS.ADD_CUSTOMER,
            callback: function (options) {
                self.addItem(options.data);
                self.currentCustomer = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.customers = [];

        self.currentCustomer = null;

        self.addItem = function (options) { self.customers.push(options.data); }

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        return self;
    }

    angular.module("app").service("customerStore", ["dispatcher", "guid", "CUSTOMER_ACTIONS", customerStore])
    .run(["customerStore", function (customerStore) { }]);
})();
(function () {

    "use strict";

    function profileStore(dispatcher, guid, PROFILE_ACTIONS) {

        var self = this;

        self.dispatcher = dispatcher;

        self.currentProfile = null;

        self.dispatcher = dispatcher;

        self.dispatcher.addListener({
            actionType: PROFILE_ACTIONS.UPDATE_CURRENT_PROFILE,
            callback: function (options) {                
                self.currentProfile = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE" });
        }

        return self;
    }

    angular.module("app").service("profileStore", ["dispatcher", "guid", "PROFILE_ACTIONS", profileStore])
    .run(["profileStore", function (profileStore) { }]);
})();
(function () {

    "use strict";

    function securityStore(dispatcher, guid, SECURITY_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;

        self.dispatcher.addListener({
            actionType: SECURITY_ACTIONS.LOGIN,
            callback: function (options) {                
                self.token = options.token;
                self.emitChange({ id: options.id });
            }
        });

        self.token = null;

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        return self;
    }

    angular.module("app")
        .service("securityStore", ["dispatcher", "guid", "SECURITY_ACTIONS", securityStore])
        .run(["securityStore", function (securityStore) { }]);
})();
(function () {

    "use strict";

    function weddingStore(dispatcher, guid, WEDDING_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;

        self.dispatcher.addListener({
            actionType: WEDDING_ACTIONS.ADD_WEDDING,
            callback: function (options) {
                self.addItem(options.data);
                self.currentWedding = options.data;
                self.emitChange({ id: options.id });
            }
        });

        self.weddings = [];

        self.currentWedding = null;

        self.addItem = function (options) { self.weddings.push(options.data); }

        self.emitChange = function (options) {
            self.dispatcher.emit({ actionType: "CHANGE", options: { id: options.id } });
        }

        return self;
    }

    angular.module("app").service("weddingStore", ["dispatcher","guid","WEDDING_ACTIONS",weddingStore]);
})();