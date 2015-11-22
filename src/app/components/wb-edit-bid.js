(function () {

    "use strict";

    function EditBidComponent() {
        var self = this;

        return self;
    }

    ngX.Component({
        component: EditBidComponent,
        routes: ["/bid/edit/:id","/bid/create"],
        providers: [],
        template: [
            "<div class='editBidComponent'>",
            "</div>"
        ].join(" ")
    });

})();


