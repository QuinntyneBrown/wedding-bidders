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
            "<a href='#/wedding/create'>SUBMIT WEDDING</a>",
            "<a href='#/vendors'>VENDORS</a>",
            "</div>"
        ].join(" ")
    });


})();