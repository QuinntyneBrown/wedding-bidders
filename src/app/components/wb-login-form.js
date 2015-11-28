(function () {

    "use strict";

    ngX.Component({
        selector: "wb-login-form",
        component: function LoginFormComponent($location, dispatcher, securityActions) {
            var self = this;
            self.$location = $location;
            self.dispatcher = dispatcher;
            self.securityActions = securityActions;
            self.loginId = null;

            self.onInit = function () {
                self.username = null;
                self.password = null;
                self.attempts = 0;
            }

            self.usernamePlaceholder = "Username";
            self.passwordPlaceholder = "Password";

            self.tryToLogin = function () {
                self.loginId = securityActions.tryToLogin({
                    username: self.username,
                    password: self.password
                });
            }

            self.listenerId = self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (self.loginId === options.id) {
                        self.dispatcher.emit({
                            actionType: "LOGIN_SUCCESS"
                        });
                    }
                }
            });

            self.dispose = function () {
                self.dispatcher.removeListener({ id: self.listenerId });
            }

            return self;
        },
        styles: [
            " .wbLoginForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; } "
        ],
        providers: [
            "$location", "dispatcher", "securityActions"
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