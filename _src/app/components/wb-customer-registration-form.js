(function () {

    "use strict";

    ngX.Component({
        selector: "customer-registration-form",
        component: function CustomerRegistrationFormComponent(customerActions, dispatcher, invokeAsync) {
            var self = this;
 
            self.tryToRegister = function () {
                invokeAsync({
                    action: customerActions.add,
                    params: {
                        firstname: self.firstname,
                        lastname: self.lastname,
                        email: self.email,
                        confirmEmail: self.confirmEmail,
                        password: self.password
                    }
                }).then(function () {
                    dispatcher.emit({
                        actionType: "CUSTOMER_ADDED", options: {
                            username: self.email,
                            password: self.password
                        }
                    });
                });
            };

            return self;
        },
        providers: [
            "customerActions", "dispatcher", "invokeAsync"
        ],
        styles: [
            " .customerRegistrationForm button { ",
            "   background-color:#222; color:#FFF; border: 0px solid;",
            "   font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px;",
            " } "
        ],
        template: [
            "<form class='customerRegistrationForm' name='customerRegistrationForm'>",
            "   <text-form-control placeholder='\"Firstname\"' model='vm.firstname' ></text-form-control>",
            "   <text-form-control placeholder='\"Lastname\"' model='vm.lastname' ></text-form-control>",
            "   <text-form-control placeholder='\"Email\"' model='vm.email' ></text-form-control>",
            "   <text-form-control placeholder='\"Confirm Email\"' model='vm.confirmEmail'></text-form-control>",
            "   <text-form-control placeholder='\"Password\"' model='vm.password'></text-form-control>",
            "   <button data-ng-click='vm.tryToRegister()'>Register</button>",
            "</form>"
        ]
    });
})();