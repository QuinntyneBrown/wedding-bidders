(function () {

    "use strict";

    ngX.Component({
        selector: "wb-app",
        component: function AppComponent() {
            var self = this;

            return self;
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