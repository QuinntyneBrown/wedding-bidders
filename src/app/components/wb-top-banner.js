(function () {

    "use strict";

    ngX.Component({
        selector: "wb-top-banner",
        component: function TopBannerComponent() {

        },
        styles: [
            " .wbTopBanner { height: 50px; padding-right:15px; padding-top:15px; } ",
            " .wbTopBanner .wbHamburgerButton { position:relative; float:right; } "
        ].join(" \n "),
        template: [
            "<div class='wbTopBanner'>",
            "<wb-hamburger-button></wb-hamburger-button>",
            "<div style='clear:both;'></div>",
            "</div>"
        ].join(" ")
    });


})();