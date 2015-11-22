(function () {

    "use strict";

    ngX.Component({
        selector: "wb-header",
        component: function HeaderComponent() {

        },
        styles: [
            " .wbHeader { } "
        ].join(" /n "),
        template: [
            "<div class='wbHeader'>",
            "<wb-top-banner></wb-top-banner>",
            "<wb-banner></wb-banner>",
            "<wb-navigation></wb-navigation>",
            "</div>"
        ].join(" ")
    });


})();