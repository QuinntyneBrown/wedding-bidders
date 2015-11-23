(function () {

    "use strict";

    ngX.Component({
        selector: "caterer-registration-form",
        component: function CatererRegistrationFormComponent() {
            var self = this;
            self.firstname = null;
            self.lastname = null;
            self.email = null;
            self.phoneNumber = null;

            self.firstnamePlaceholder = "Firstname";
            self.lastnamePlaceholder = "Lastname";
            self.emailPlaceholder = "Email";
            self.phoneNumberPlaceholder = "Phone Number";

            return self;
        },
        template: [
            "<form class='catererRegistrationForm' name='catererRegistrationForm'>",
            "<text-form-control placeholder='vm.firstnamePlaceholder' model='vm.firstname' ></text-form-control>",
            "<text-form-control placeholder='vm.lastnamePlaceholder' model='vm.lastname' ></text-form-control>",
            "<text-form-control placeholder='vm.emailPlaceholder' model='vm.email' ></text-form-control>",
            "<text-form-control placeholder='vm.phoneNumberPlaceholder' model='vm.phoneNumber' ></text-form-control>",
            "</form>"
        ].join(" ")
    });

})();