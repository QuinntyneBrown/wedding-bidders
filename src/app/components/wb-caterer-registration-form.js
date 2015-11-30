(function () {

    "use strict";

    ngX.Component({
        selector: "caterer-registration-form",
        component: function CatererRegistrationFormComponent(catererActions, dispatcher) {
            var self = this;
            self.catererActions = catererActions;
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
                            actionType: "CATERER_ADDED", options: {
                                username: self.email,
                                password: self.password
                            }
                        });
                    }
                }
            });

            self.tryToRegister = function () {
                self.addActionId = self.catererActions.add({
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
        styles: [
            "  .catererRegistrationForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; }"
        ].join( " /n "),
        providers: [
            "catererActions","dispatcher"
        ],
        template: [
            "<form class='catererRegistrationForm' name='catererRegistrationForm'>",
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