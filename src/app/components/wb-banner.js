(function () {

    "use strict";

    ngX.Component({
        selector: "wb-banner",
        component: function BannerComponent() {

        },
        styles: [
            " .wbBanner { height: 60px; } ",
            " .wbBanner h1 { text-align: center; font-size: 3em; } "
        ].join(" \n "),
        template: [
            "<div class='wbBanner'>",
            "<h1>Wedding Bidders</h1>",
            "</div>"
        ].join(" ")
    });


})();