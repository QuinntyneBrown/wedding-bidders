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