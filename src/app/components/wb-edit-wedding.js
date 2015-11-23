﻿(function () {

    "use strict";

    function EditWeddingComponent($location,dispatcher,wedding) {
        var self = this;
        self.wedding = wedding;
        self.listenerId = dispatcher.addListener({
            actionType: "MODEL_ADDED", callback: function (options) {
                $location.path("/wedding/edit/" + options.id)
            }
        });

        self.onDestroy = function () {

        };
        return self;
    }

    ngX.Component({
        component: EditWeddingComponent,
        routes: ["/wedding/edit/:id","/wedding/create"],
        providers: ["$location", "dispatcher", "wedding"],
        styles: [" .editWeddingComponent { padding-left:15px; } "].join(" /n "),
        template: [
            "<div class='editWeddingComponent viewComponent'>",
            "<edit-wedding-form model='vm.wedding'></edit-wedding-form>",
            "</div>"
        ].join(" ")
    });

})();


