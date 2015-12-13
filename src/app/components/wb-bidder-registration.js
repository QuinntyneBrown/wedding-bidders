(function () {

    "use strict";

    ngX.Component({
        component: function BidderRegistrationComponent($location, dispatcher, securityActions) {

            var self = this;
            self.$location = $location;
            self.dispatcher = dispatcher;
            self.securityActions = securityActions;
            self.loginId = null;
            self.listenerIds = [];

            self.listenerIds.push(self.dispatcher.addListener({
                actionType: "BIDDER_ADDED",
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
                        self.$location.path("/myprofile");
                    }
                }
            }));

            self.deactivate = function () {
                for (var i = 0; i < self.listenerIds.length; i++) {
                    self.dispatcher.removeListener({ id: self.listenerIds[i] });
                }
            }

            return self;
        },
        providers: [
            "$location",
            "dispatcher",
            "securityActions"],
        template: [
            "<div class='bidderRegistrationComponent viewComponent'> ",
            "   <bidder-registration-form></bidder-registration-form> ",
            "</div> "
        ].join(" ")
    });


})();