(function () {

    "use strict";

    ngX.Component({
        selector: "caterer-registration-form",
        component: function CatererRegistrationFormComponent(catererActions) {
            var self = this;
            self.catererActions = catererActions;

            self.firstname = null;
            self.lastname = null;
            self.email = null;
            self.phoneNumber = null;

            self.firstnamePlaceholder = "Firstname";
            self.lastnamePlaceholder = "Lastname";
            self.emailPlaceholder = "Email";
            self.phoneNumberPlaceholder = "Phone Number";

            self.tryToRegister = function () {

            };

            return self;
        },
        styles: [
            "  .catererRegistrationForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; }"
        ].join( " /n "),
        providers: [
            "catererActions"
        ],
        template: [
            "<form class='catererRegistrationForm' name='catererRegistrationForm'>",
            "   <text-form-control placeholder='vm.firstnamePlaceholder' model='vm.firstname' ></text-form-control>",
            "   <text-form-control placeholder='vm.lastnamePlaceholder' model='vm.lastname' ></text-form-control>",
            "   <text-form-control placeholder='vm.emailPlaceholder' model='vm.email' ></text-form-control>",
            "   <text-form-control placeholder='vm.phoneNumberPlaceholder' model='vm.phoneNumber' ></text-form-control>",
            "   <button data-ng-click='vm.tryToRegister()'>Register</button>",
            "</form>"
        ].join(" ")
    });

})();