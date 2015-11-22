angular.module("app", ["ngX", "ngX.components"]).config(["$routeProvider", "apiEndpointProvider", function ($routeProvider, apiEndpointProvider) {
    $routeProvider.buildFromUrl({ url: "routes.json" });
    apiEndpointProvider.configure("/api");
}]);
angular.module("app").value("WEDDING_ACTIONS", {
    ADD_WEDDING: "WEDDING_ADDED",
});



(function () {

    "use strict";


    function weddingActions(dispatcher, guid, weddingService, WEDDING_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;
        self.WEDDING_ACTIONS = WEDDING_ACTIONS;

        self.add = function (options) {
            var newGuid = guid();
            weddingService.add({ model: options.model}).then(function(results) {
                self.dispatcher.emit({
                    action: self.WEDDING_ACTIONS.WEDDING_ADDED,
                    model: model
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
            " .editWeddingForm { } "
        ].join(" \n "),
        inputs:["model"],
        template: [
            "<form class='editWeddingForm' name='editWeddingForm'>",

            "<div class='formControl'>",
            "<label>Number Of Guests:</label>",
            "<input type='text' data-ng-model='vm.model.numberOfGuests'></input>",
            "</div>",

            "<div class='formControl'>",
            "</div>",

            "<div class='formControl'>",
            "</div>",

            "<button data-ng-click='vm.onSubmit()'>Submit</button>",
            "</form>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    function EditWeddingComponent(wedding) {
        var self = this;
        self.wedding = wedding;        
        return self;
    }

    ngX.Component({
        component: EditWeddingComponent,
        routes: ["/wedding/edit/:id","/wedding/create"],
        providers: ["wedding"],
        template: [
            "<div class='editWeddingComponent'>",
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
        component: function LoginComponent() {

        },
        template: [
            "<div class='login'>",
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
            " .wbNavigation a { text-decoration: none; color: #000; padding-right:7px; padding-left:7px; } "
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
        selector: "wb-top-banner",
        component: function TopBannerComponent() {

        },
        styles: [
            " .wbTopBanner { height: 50px; } "
        ].join(" /n "),
        template: [
            "<div class='wbTopBanner'>",
            "&nbsp;",
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

    function wedding(weddingActions, weddingStore) {
        var self = this;
        self.id = null;
        self.numberOfGuests = 0;
        self.weddingActions = weddingActions;
        self.weddingStore = weddingStore;

        self.createInstance = function (options) {
            var instance = new wedding(self.weddingActions, self.weddingStore);
            if (options.data) {
                instance.id = options.data.id;
                instance.numberOfGuests = options.data.numberOfGuests;
            }
            return instance;
        }
        
        self.add = function () {
            weddingActions.add({ model: self });
        }

        self.onStoreUpdate = function () {

        }

        self.listenerId = weddingStore.addListener({ callback: self.onStoreUpdate });

        self.destroy = function () { weddingStore.removeListener({ id: self.listenerId }); }

        return self;
    }

    angular.module("app").service("wedding", ["weddingActions","weddingStore",wedding]);

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

    function eventEmitter(guid) {

        var self = this;

        self.listeners = [];

        self.addListener = function (options) {

        };

        self.removeListener = function () {

        }

        self.emit = function () {

        }


        return self;
    }

    angular.module("app").service("dispatcher", ["guid", eventEmitter]);

})();
(function () {

    "use strict";

    function fetch($http, $q, localStorageManager) {

        var self = this;
        self.$http = self.$http;
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

    function weddingService() {
        var self = this;

        return self;
    }

    angular.module("app").service("weddingService", ["fetch",weddingService]);

})();


(function () {

    "use strict";

    function weddingStore(dispatcher, WEDDING_ACTIONS) {

        var self = this;
        self.dispatcher = dispatcher;

        self.dispatcher.addListener(function (options) {
            switch (options.actionType) {
                case WEDDING_ACTIONS.ADD_ITEM:
                    self.addItem(action.item);
                    self.currentWedding;
                    self.emitChange();
                    break;
            }

        });

        self.weddings = [];

        self.currentWedding = null;

        self.addListener = self.dispatcher.addListener

        self.addItem = function (options) {
            self.weddings.push(options.data);
        }

        self.emitChange = function () {
            self.dispatcher.emit("change");
        }

        return self;
    }

    angular.module("app").service("weddingStore", ["dispatcher","guid","WEDDING_ACTIONS",weddingStore]);
})();