(function () {

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
            " .wbBanner-logo { width:313px; margin: 0 auto; } "
        ],
        providers:["$location"],
        template: [
            "<div class='wbBanner'>",
            "   <div class='wbBanner-logo'>",
            "       <img data-ng-click='vm.goHome()' src='assets/images/name.jpg'></img>",
            "   <div>",
            "</div>"
        ]
    });
})();