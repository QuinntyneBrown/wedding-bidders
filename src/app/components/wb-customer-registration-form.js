(function () {

    "use strict";

    ngX.Component({
        selector: "customer-registration-form",
        component: function CustomerRegistrationFormComponent(customerActions, dispatcher) {
            var self = this;
            self.customerActions = customerActions;
            self.dispatcher = dispatcher;

            self.firstname = null;
            self.lastname = null;
            self.email = null;
            self.confirmEmail = null;
            self.password = null;

            self.firstnamePlaceholder = "Firstname";
            self.lastnamePlaceholder = "Lastname";
            self.emailPlaceholder = "Email";
            self.confirmEmailPlaceholder = "Confirm Email";
            self.passwordPlaceholder = "Password";
            self.addActionId = null;

            self.listenerId = self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (self.addActionId === options.id) {
                        self.dispatcher.emit({
                            actionType: "CUSTOMER_ADDED", options: {
                                username: self.email,
                                password: self.password
                            }
                        });
                    }
                }
            });

            self.tryToRegister = function () {
                self.addActionId = self.customerActions.add({
                    firstname: self.firstname,
                    lastname: self.lastname,
                    email: self.email,
                    confirmEmail: self.confirmEmail,
                    password: self.password
                });
            };

            self.dispose = function () {
                self.dispatcher.removeListener({ id: self.listenerId });
            }

            return self;
        },
        providers: [
            "customerActions", "dispatcher"
        ],
        styles: [
            " .customerRegistrationForm { ",
            "  ",
            "  }",
            " .customerRegistrationForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; } "
        ].join(" \n "),
        template: [
            "<form class='customerRegistrationForm' name='customerRegistrationForm'>",
            "   <text-form-control placeholder='vm.firstnamePlaceholder' model='vm.firstname' ></text-form-control>",
            "   <text-form-control placeholder='vm.lastnamePlaceholder' model='vm.lastname' ></text-form-control>",
            "   <text-form-control placeholder='vm.emailPlaceholder' model='vm.email' ></text-form-control>",
            "   <text-form-control placeholder='vm.confirmEmailPlaceholder' model='vm.confirmEmail'></text-form-control>",
            "   <text-form-control placeholder='vm.passwordPlaceholder' model='vm.password'></text-form-control>",
            "   <button data-ng-click='vm.tryToRegister()'>Register</button>",
            "</form>"
        ].join(" ")
    });

})();