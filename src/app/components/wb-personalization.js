(function () {

    "use strict";

    function PersonalizationComponent(bidderActions, bidderStore) {
        var self = this;
        return self;
    }

    ngX.Component({
        component: PersonalizationComponent,
        providers: ["bidderActions", "bidderStore"],
        template: [
            "<div class='personalizationComponent viewComponent'>",
            "</div>"
        ]
    });
})();


