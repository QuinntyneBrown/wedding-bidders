angular.module("app", ["ngX", "ngX.components"]).config(["$routeProvider", "apiEndpointProvider", function ($routeProvider, apiEndpointProvider) {
    $routeProvider.buildFromUrl({ url: "routes.json" });
    apiEndpointProvider.configure("/api");
}]);




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

    function EditBidComponent() {
        var self = this;

        return self;
    }

    ngX.Component({
        component: EditBidComponent,
        routes: ["/bid/edit/:id","/bid/create"],
        providers: [],
        template: [
            "<div class='editBidComponent'>",
            "<h1>Edit Bid</h1>",
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
            "<a href='#/bid/create'>SUBMIT FOR BID</a>",
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

    function eventEmitter(guid) {

        var self = this;

        self.listeners = [];

        self.addListenter = function () {

        };

        self.removeListener = function () {

        }

        self.emit = function () {

        }


        return self;
    }

    angular.module("app").service("dispathcer", ["guid", eventEmitter]);

})();




