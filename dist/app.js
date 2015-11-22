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






