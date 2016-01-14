(function () {

    "use strict";

    ngX.Component({
        component: function LoginComponent(dispatcher, loginRedirect) {
            var self = this;
            self.dispatcher = dispatcher;
            self.loginRedirect = loginRedirect;

            self.listenerId = self.dispatcher.addListener({
                actionType: "LOGIN_SUCCESS",
                callback: function (options) {
                    loginRedirect.redirectPreLogin();
                }
            });

            self.deactivate = function () {
                self.dispatcher.removeListener({ id: self.listenerId });
            };

            return self;
        },
        providers: [
            "dispatcher", "loginRedirect"
        ],
        template: [
            "<div class='login viewComponent'>",
            "   <wb-login-form></wb-login-form>",
            "</div>"
        ]
    });
})();