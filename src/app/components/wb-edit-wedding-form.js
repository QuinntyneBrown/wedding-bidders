(function () {

    "use strict";

    ngX.Component({
        selector:"edit-wedding-form",
        component: function EditWeddingFormComponent() {
            var self = this;

            self.onSubmit = self.model.add;

            return self;
        },
        styles: [
            " .editWeddingForm { } "
        ].join(" \n "),
        inputs:["model"],
        template: [
            "<form class='editWeddingForm' name='editWeddingForm'>",

            "<div class='formControl'>",
            "<label>Number Of Guests:</label>",
            "<input type='text' data-ng-model='vm.model.numberOfGuests'></input>",
            "</div>",

            "<div class='formControl'>",
            "</div>",

            "<div class='formControl'>",
            "</div>",

            "<button data-ng-click='vm.onSubmit()'>Submit</button>",
            "</form>"
        ].join(" ")
    });


})();