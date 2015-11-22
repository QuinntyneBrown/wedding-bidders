(function () {

    "use strict";

    function EditWeddingComponent(wedding) {
        var self = this;
        self.wedding = wedding;        
        return self;
    }

    ngX.Component({
        component: EditWeddingComponent,
        routes: ["/wedding/edit/:id","/wedding/create"],
        providers: ["wedding"],
        template: [
            "<div class='editWeddingComponent'>",
            "<edit-wedding-form model='vm.wedding'></edit-wedding-form>",
            "</div>"
        ].join(" ")
    });

})();


