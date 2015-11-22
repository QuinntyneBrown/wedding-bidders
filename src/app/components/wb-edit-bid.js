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
            "<h1>Edit Bid</h1>",
            "</div>"
        ].join(" ")
    });

})();


