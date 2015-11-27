angular.module("app", ["ngX", "ngX.components"]).config(["$routeProvider", "apiEndpointProvider", function ($routeProvider, apiEndpointProvider) {

    $routeProvider.when("/", {
        "componentName": "homeComponent"
    });

    $routeProvider.when("/login", {
        "componentName": "loginComponent"
    });

    $routeProvider.when("/wedding/create", {
        "componentName": "editWeddingComponent"
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

    apiEndpointProvider.configure("/api");
}]).run([function () {
    FastClick.attach(document.body);
}]);
angular.module("app").value("WEDDING_ACTIONS", {
    ADD_WEDDING: "ADD_WEDDING",
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
                self.dispatcher.emit({ actionType: self.CUSTOMER_ACTIONS.ADD_CUSTOMER, data: results.data });
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
                self.dispatcher.emit({ actionType: self.SECURITY_ACTIONS.LOGIN, token: results.data.token });
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
                    numberOfGuests: options.model.numberOfGuests
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
        component: function BidFormComponent(bidActions) {
            var self = this;
            self.bidActions = bidActions;

            self.tryToBid = function () {

            };

            return self;
        },
        providers: [
            "bidActions"
        ],
        styles: [
            ".bidForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; } "
        ],
        template: [
            "<form class='bidForm' name='bidForm'>",
            "   <button data-ng-click='vm.tryToRegister()'>Register</button>",
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

    ngX.Component({
        selector: "caterer-registration-form",
        component: function CatererRegistrationFormComponent(catererActions) {
            var self = this;
            self.catererActions = catererActions;

            self.firstname = null;
            self.lastname = null;
            self.email = null;
            self.phoneNumber = null;

            self.firstnamePlaceholder = "Firstname";
            self.lastnamePlaceholder = "Lastname";
            self.emailPlaceholder = "Email";
            self.phoneNumberPlaceholder = "Phone Number";

            self.tryToRegister = function () {

            };

            return self;
        },
        styles: [
            "  .catererRegistrationForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; }"
        ].join( " /n "),
        providers: [
            "catererActions"
        ],
        template: [
            "<form class='catererRegistrationForm' name='catererRegistrationForm'>",
            "   <text-form-control placeholder='vm.firstnamePlaceholder' model='vm.firstname' ></text-form-control>",
            "   <text-form-control placeholder='vm.lastnamePlaceholder' model='vm.lastname' ></text-form-control>",
            "   <text-form-control placeholder='vm.emailPlaceholder' model='vm.email' ></text-form-control>",
            "   <text-form-control placeholder='vm.phoneNumberPlaceholder' model='vm.phoneNumber' ></text-form-control>",
            "   <button data-ng-click='vm.tryToRegister()'>Register</button>",
            "</form>"
        ].join(" ")
    });

})();
(function () {

    "use strict";

    ngX.Component({
        component: function CatererRegistrationComponent() {

        },
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

    ngX.Component({
        selector: "customer-registration-form",
        component: function CustomerRegistrationFormComponent(customerActions) {
            var self = this;
            self.customerActions = customerActions;

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

            self.tryToRegister = function () {
                self.customerActions.add({
                    firstname: self.firstname,
                    lastname: self.lastname,
                    email: self.email,
                    confirmEmail: self.confirmEmail,
                    password: self.password
                });
            };

            return self;
        },
        providers: [
            "customerActions"
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
        component: function CustomerRegistrationComponent() {

        },
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
        component: function EditWeddingFormComponent() {
            var self = this;

            self.onSubmit = self.model.add;

            return self;
        },
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
            "<input class='inputField' type='text' data-ng-model='vm.model.numberOfGuests' placeholder='Number Of Guests'></input>",
            "</div>",

            "<div class='formControl'>",
            "<input class='inputField' type='text' data-ng-model='vm.model.location'  placeholder='Location'></input>",
            "</div>",

            "<div class='formControl'>",
            "<input class='inputField' type='text'  data-ng-model='vm.model.numberOfHours'  placeholder='Number Of Hours'></input>",
            "</div>",

            "<button data-ng-click='vm.onSubmit()'>Submit</button>",
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
        component: function LoginFormComponent($location, securityActions) {
            var self = this;
            self.$location = $location;
            self.securityActions = securityActions;

            self.onInit = function () {
                self.username = null;
                self.password = null;
                self.attempts = 0;
            }

            self.usernamePlaceholder = "Username";
            self.passwordPlaceholder = "Password";

            self.tryToLogin = function () {
                var guid = securityActions.tryToLogin({
                    username: self.username,
                    password: self.password
                });
            }

            return self;
        },
        styles: [
            " .wbLoginForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; } "
        ],
        providers: [
            "$location","securityActions"
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
        component: function LoginComponent(loginRedirect, securityStore) {
            var self = this;

            self.onStoreUpdate = function () {
                if (securityStore.token) {
                    loginRedirect.redirectPreLogin();
                }
            }

            return self;
        },
        providers: [
            "loginRedirect",
            "securityStore"
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

    function VendorsComponent() {
        var self = this;

        return self;
    }

    ngX.Component({
        component: VendorsComponent,
        route: "/vendors",
        providers: [],
        template: [
            "<div class='vendors'>",
            "<h1>Vendors</h1>",
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
            for (var i = 0; i < self.listeners.length; i++) {
                if (self.listeners[i].id === options.id) {
                    self.listeners.slice(i,1);
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

    function securityService($q, apiEndpoint, fetch, formEncode) {
        var self = this;

        self.tryToLogin = function (options) {
            var newGuid = guid();
            angular.extend(options.data, { grant_type: "password" });
            var formEncodedData = formEncode(options.data);
            var headers = { "Content-Type": "application/x-www-form-urlencoded" };

            fetch.fromService({ method: "POST", url: self.baseUri + "/token", data: formEncodedData, headers: headers }).then(function (results) {
                self.dispatcher.emit({ actionType: self.SECURITY_ACTIONS.LOGIN, token: results.data.token });
            });
            return newGuid;
        };

        self.baseUri = apiEndpoint.getBaseUrl() + "/security";

        return self;
    }

    angular.module("app").service("securityService", ["$q", "apiEndpoint", "fetch", "formEncode", securityService]);

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

    angular.module("app").service("catererStore", ["dispatcher", "guid", "CATERER_ACTIONS", catererStore]);
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

    angular.module("app").service("customerStore", ["dispatcher", "guid", "CUSTOMER_ACTIONS", customerStore]);
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