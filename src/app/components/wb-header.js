(function () {

    "use strict";

    ngX.Component({
        selector: "wb-header",
        component: function HeaderComponent() { },
        styles: [
            " .wbHeader { } "
        ],
        template: [
            "<div class='wbHeader'>",
            "   <wb-top-banner></wb-top-banner>",
            "   <wb-banner></wb-banner>",
            "   <wb-navigation></wb-navigation>",
            "</div>"
        ]
    });
})();