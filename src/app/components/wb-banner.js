﻿(function () {

    "use strict";

    ngX.Component({
        selector: "wb-banner",
        component: function BannerComponent($location) {
            var self = this;

            self.goHome = function () { $location.path("/"); };

            return self;
        },
        styles: [
            " .wbBanner { height: 60px; width:100%; } ",
            " .wbBanner h1 { text-align: center; font-size: 3em; cursor: pointer; } "
        ].join(" \n "),
        providers:["$location"],
        template: [
            "<div class='wbBanner'>",
            "<div style='width:313px; margin: 0 auto;'>",
            "<img data-ng-click='vm.goHome()' src='assets/images/name.jpg'></img>",
            "<div>",
            "</div>"
        ].join(" ")
    });


})();