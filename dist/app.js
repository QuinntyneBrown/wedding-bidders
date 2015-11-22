angular.module("app", ["ngX"]);



(function () {

    "use strict";

    ngX.Component({
        selector: "wb-app",
        component: function AppComponent() {

        },
        template: [
            "<wb-header></wb-header>",
            "<div data-ng-view>",
            "</div>",
            "<wb-footer></wb-footer>",
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
        selector: "wb-footer",
        component: function FooterComponent() {

        },
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
        template: [
            "<div class='wbHeader'>",
            "</div>"
        ].join(" ")
    });


})();
(function () {

    "use strict";

    ngX.Component({        
        component: function HomeComponent() {

        },
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

