(function () {

    "use strict";

    ngX.Component({
        selector: "wb-login-form",
        component: function LoginFormComponent($location, invokeAsync, securityActions, securityStore) {
            var self = this;

            self.onInit = function () {
                self.username = null;
                self.password = null;
                self.attempts = 0;
                self.message = null;
            }

            self.usernamePlaceholder = "Username";
            self.passwordPlaceholder = "Password";

            self.tryToLogin = function () {
                invokeAsync({
                    action: securityActions.tryToLogin,
                    params: {
                        username: self.username,
                        password: self.password
                    }
                }).then(function () {
                    if (securityStore.token) {
                        securityActions.loginSuccess()
                    } else {
                        self.attempts = self.attempts + 1;
                        self.message = "Login Failed.";
                    }
                });
            }

            return self;
        },
        styles: [
            " .wbLoginForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; } "
        ],
        providers: [
            "$location", "invokeAsync", "securityActions", "securityStore"
        ],
        template: [
            "<div>",
            "   <form class='wbLoginForm' name='wbLoginForm'>",
            "       <text-form-control placeholder='vm.usernamePlaceholder' model='vm.username' ></text-form-control>",
            "       <text-form-control placeholder='vm.passwordPlaceholder' model='vm.password' ></text-form-control>",
            "       <button data-ng-click='vm.tryToLogin()'>Login</button>",
            "   </form>",
            "   <span>{{ vm.message }}</span>",
            "</div>"
        ]
    });
})();