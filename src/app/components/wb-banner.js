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