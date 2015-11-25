(function () {

    "use strict";

    ngX.Component({
        selector: "text-form-control",
        component: function TextFormControlComponent($attrs) {
            var self = this;

            self.onInit = function () {
                self.type = self.placeholder === 'Password' ? "password" : "text";
            }
            
            return self;
        },
        styles: [
            " .inputField { padding-left: 15px; } ",

            " .formControl input { ",
            "   line-height: 30px; ",
            "   height: 30px; ",
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
            "<input class='inputField' type='{{vm.type}}' placeholder='{{ ::vm.placeholder}}' data-ng-model='vm.model'></input>",
            "</div>"
        ].join(" ")
    });


})();