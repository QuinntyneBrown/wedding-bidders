(function () {

    "use strict";

    ngX.Component({
        component: function CustomerRegistrationComponent($location, dispatcher, securityActions) {
            var self = this;
            self.$location = $location;
            self.dispatcher = dispatcher;
            self.securityActions = securityActions;
            self.loginId = null;
            self.listenerIds = [];

            self.listenerIds.push(self.dispatcher.addListener({
                actionType: "CUSTOMER_ADDED",
                callback: function (options) {
                    self.loginId = securityActions.tryToLogin({
                        username: options.username,
                        password: options.password
                    });
                }
            }));

            self.listenerIds.push(self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (self.loginId && self.loginId === options.id) {
                        self.$location.path("/customer/myprofile");
                    }
                }
            }));

            self.deactivate = function () {
                for (var i = 0; i < self.listenerIds.length; i++) {
                    self.dispatcher.removeListener({ id: self.listenerIds[i] });
                }
            };
        },
        providers:["$location","dispatcher","securityActions"],
        template: [
            "<div class='customerRegistration viewComponent'>",
            "   <customer-registration-form></customer-registration-form>",
            "</div>"
        ]
    });
})();