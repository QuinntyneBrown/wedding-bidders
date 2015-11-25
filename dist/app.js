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
}]);
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
        selector: "caterer-registration-form",
        component: function CatererRegistrationFormComponent() {
            var self = this;
            self.firstname = null;
            self.lastname = null;
            self.email = null;
            self.phoneNumber = null;

            self.firstnamePlaceholder = "Firstname";
            self.lastnamePlaceholder = "Lastname";
            self.emailPlaceholder = "Email";
            self.phoneNumberPlaceholder = "Phone Number";

            return self;
        },
        template: [
            "<form class='catererRegistrationForm' name='catererRegistrationForm'>",
            "<text-form-control placeholder='vm.firstnamePlaceholder' model='vm.firstname' ></text-form-control>",
            "<text-form-control placeholder='vm.lastnamePlaceholder' model='vm.lastname' ></text-form-control>",
            "<text-form-control placeholder='vm.emailPlaceholder' model='vm.email' ></text-form-control>",
            "<text-form-control placeholder='vm.phoneNumberPlaceholder' model='vm.phoneNumber' ></text-form-control>",
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

    ngX.Component({
        selector: "customer-registration-form",
        component: function CustomerRegistrationFormComponent() {
            var self = this;
            self.firstname = null;
            self.lastname = null;
            self.email = null;
            self.phoneNumber = null;

            self.firstnamePlaceholder = "Firstname";
            self.lastnamePlaceholder = "Lastname";
            self.emailPlaceholder = "Email";
            self.phoneNumberPlaceholder = "Phone Number";

            return self;
        },
        template: [
            "<form class='customerRegistrationForm' name='customerRegistrationForm'>",
            "<text-form-control placeholder='vm.firstnamePlaceholder' model='vm.firstname' ></text-form-control>",
            "<text-form-control placeholder='vm.lastnamePlaceholder' model='vm.lastname' ></text-form-control>",
            "<text-form-control placeholder='vm.emailPlaceholder' model='vm.email' ></text-form-control>",
            "<text-form-control placeholder='vm.phoneNumberPlaceholder' model='vm.phoneNumber' ></text-form-control>",
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

            self.menuHTML = [
                "<div class='wbHamburgerMenu' data-ng-click='vm.onClick()'>",
                "   <div class='wbHamburgerMenu-container'>",
                "       <div class='wbHamburgerMenu-links'>",
                "           <div><a data-ng-click='vm.navigateToLogin()'>Login</a><div>",
                "           <div><a data-ng-click='vm.navigateToCreateAccount()'>Create Account</a><div>",
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
        component: function LoginFormComponent() {
            var self = this;
            self.username = null;
            self.password = null;
            

            self.usernamePlaceholder = "Username";
            self.passwordPlaceholder = "Password";

            return self;
        },
        template: [
            "<form class='wbLoginForm' name='wbLoginForm'>",
            "<text-form-control placeholder='vm.usernamePlaceholder' model='vm.username' ></text-form-control>",
            "<text-form-control placeholder='vm.passwordPlaceholder' model='vm.password' ></text-form-control>",
            "</form>"
        ].join(" ")
    });

})();
(function () {

    "use strict";

    ngX.Component({
        component: function LoginComponent() {
            
        },
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
        component: function TextFormControlComponent() {
            var self = this;

            return self;
        },
        styles: [
            " .inputField { padding-left: 15px; } ",

            " .formControl input { ",
            " line-height: 30px; ",
            " height: 30px; ",
            " border: 1px solid #575656 ",
            " padding-left: 7px ",
            " text-align: left; ",
            " width: 200px; ",
            " } ",

            " .formControl { margin-bottom: 15px; } ",
        ].join(" \n "),
        inputs: ["placeholder", "model"],
        template: [
            "<div class='formControl'>",
            "<input class='inputField' type='text' placeholder='{{vm.placeholder}}' data-ng-model='vm.model'></input>",
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



angular.module("app").value("WEDDING_ACTIONS", {
    ADD_WEDDING: "ADD_WEDDING",
});



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

    function weddingBid() {
        var self = this;

        return self;
    }

    angular.module("app").service("weddingBid", [weddingBid]);

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