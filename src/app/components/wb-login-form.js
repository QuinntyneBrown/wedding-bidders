(function () {

    "use strict";

    ngX.Component({
        selector: "wb-login-form",
        component: function LoginFormComponent() {
            var self = this;
            self.username = null;
            self.password = null;
            

            self.usernamePlaceholder = "Username";
            self.passwordPlaceholder = "Password";

            return self;
        },
        template: [
            "<form class='wbLoginForm' name='wbLoginForm'>",
            "<text-form-control placeholder='vm.usernamePlaceholder' model='vm.username' ></text-form-control>",
            "<text-form-control placeholder='vm.passwordPlaceholder' model='vm.password' ></text-form-control>",
            "</form>"
        ].join(" ")
    });

})();