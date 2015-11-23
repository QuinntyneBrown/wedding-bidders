(function () {

    "use strict";

    ngX.Component({
        selector: "text-form-control",
        component: function TextFormControlComponent() {
            var self = this;

            return self;
        },
        styles: [
            " .inputField { padding-left: 15px; } ",

            " .formControl input { ",
            " line-height: 30px; ",
            " height: 30px; ",
            " border: 1px solid #575656 ",
            " padding-left: 7px ",
            " text-align: left; ",
            " width: 200px; ",
            " } ",

            " .formControl { margin-bottom: 15px; } ",
        ].join(" \n "),
        inputs: ["placeholder", "model"],
        template: [
            "<div class='formControl'>",
            "<input class='inputField' type='text' placeholder='{{vm.placeholder}}' data-ng-model='vm.model'></input>",
            "</div>"
        ].join(" ")
    });


})();