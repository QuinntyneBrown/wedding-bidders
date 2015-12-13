(function () {

    "use strict";

    function PromotionComponent() {
        var self = this;

        return self;
    }

    ngX.Component({
        component: PromotionComponent,
        providers: [],
        template: [
            "<div class='promotion viewComponent'>",
            " <h1> Win free honeymoon!</h1>",
            "</div>"
        ].join(" ")
    });

})();