(function () {

    "use strict";

    ngX.Component({
        selector: "wb-login-form",
        component: function LoginFormComponent($location, securityActions) {
            var self = this;
            self.$location = $location;
            self.securityActions = securityActions;

            self.username = null;
            self.password = null;
            

            self.usernamePlaceholder = "Username";
            self.passwordPlaceholder = "Password";

            self.tryToLogin = function () {

            }

            return self;
        },
        styles: [
            " .wbLoginForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; } "
        ],
        providers: [
            "$location","securityActions"
        ],
        template: [
            "<form class='wbLoginForm' name='wbLoginForm'>",
            "   <text-form-control placeholder='vm.usernamePlaceholder' model='vm.username' ></text-form-control>",
            "   <text-form-control placeholder='vm.passwordPlaceholder' model='vm.password' ></text-form-control>",
            "   <button data-ng-click='vm.tryToLogin()'>Login</button>",
            "</form>"
        ].join(" ")
    });

})();