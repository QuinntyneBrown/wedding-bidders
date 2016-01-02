(function () {

    "use strict";

    function EditWeddingComponent($location,dispatcher,wedding) {
        var self = this;
        self.wedding = wedding;
        self.$location = $location;
        self.listenerId = dispatcher.addListener({
            actionType: "MODEL_ADDED", callback: function (options) {
                self.$location.path("/myprofile");
            }
        });
        self.onDestroy = function () { };
        return self;
    }

    EditWeddingComponent.canActivate = function () {
        return ["bidderActions", "invokeAsync", function (bidderActions, invokeAsync) {
            return invokeAsync(bidderActions.getTypes);
        }]
    }

    ngX.Component({
        component: EditWeddingComponent,
        routes: ["/wedding/edit/:id","/wedding/create"],
        providers: ["$location", "dispatcher", "wedding"],
        styles: [" .editWeddingComponent { padding-left:15px; } "],
        template: [
            "<div class='editWeddingComponent viewComponent'>",
            "   <edit-wedding-form model='vm.wedding'></edit-wedding-form>",
            "</div>"
        ]
    });
})();


