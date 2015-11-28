(function () {

    "use strict";

    ngX.Component({
        selector: "text-area-form-control",
        component: function TextAreaFormControlComponent($attrs) {
            var self = this;
            self.$attrs = $attrs;

            self.onInit = function () {
                
            }

            self.rows = self.$attrs["rows"] || 4;

            return self;
        },
        styles: [
            " .textareaField { padding-left: 15px; } ",

            " .formControl textarea { ",
            "   line-height: 30px; ",
            "   border: 1px solid #575656 ",
            "   padding-left: 7px ",
            "   text-align: left; ",
            "   width: 200px; ",
            " } ",

            " .formControl { margin-bottom: 15px; } ",
        ].join(" \n "),
        inputs: ["placeholder", "model"],
        providers: ["$attrs"],
        template: [
            "<div class='formControl'>",
            "<textarea class='textareaField' rows='{{ ::vm.rows }}' placeholder='{{ ::vm.placeholder}}' data-ng-model='vm.model'></input>",
            "</div>"
        ].join(" ")
    });


})();