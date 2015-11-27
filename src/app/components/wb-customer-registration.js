(function () {

    "use strict";

    ngX.Component({
        component: function CustomerRegistrationComponent($location, dispatcher) {

            var self = this;
            self.$location = $location;
            self.dispatcher = dispatcher;

            self.dispatcher.addListener({
                actionType: "CUSTOMER_ADDED",
                callback: function (options) {
                    self.$location.path("/");
                }
            });


        },
        providers:["$location","dispatcher"],
        template: [
            "<div class='customerRegistration viewComponent'>",
            "<customer-registration-form></customer-registration-form>",
            "</div>"
        ].join(" ")
    });


})();