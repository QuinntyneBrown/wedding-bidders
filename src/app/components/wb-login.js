(function () {

    "use strict";

    ngX.Component({
        component: function LoginComponent(loginRedirect, securityStore) {
            var self = this;

            self.onStoreUpdate = function () {
                if (securityStore.token) {
                    loginRedirect.redirectPreLogin();
                }
            }

            return self;
        },
        providers: [
            "loginRedirect",
            "securityStore"
        ],
        template: [
            "<div class='login viewComponent'>",
            "<wb-login-form></wb-login-form>",
            "</div>"
        ].join(" ")
    });


})();