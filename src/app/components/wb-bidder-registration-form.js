(function () {

    "use strict";

    ngX.Component({
        selector: "bidder-registration-form",
        component: function BidderRegistrationFormComponent(bidderActions, bidderStore, dispatcher) {
            var self = this;
            self.bidderActions = bidderActions;
            self.dispatcher = dispatcher;
            self.bidderStore = bidderStore;

            self.firstname = null;
            self.lastname = null;
            self.companyName = null;
            self.email = null;
            self.confirmEmail = null;
            self.password = null;
            self.bidderType = null;

            self.firstnamePlaceholder = "Firstname";
            self.lastnamePlaceholder = "Lastname";
            self.companyNamePlaceholder = "Company Name";
            self.emailPlaceholder = "Email";
            self.confirmEmailPlaceholder = "Confirm Email";
            self.passwordPlaceholder = "Password";
            self.addActionId = null;

            self.listenerId = self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (self.addActionId === options.id) {
                        self.dispatcher.emit({
                            actionType: "BIDDER_ADDED", options: {
                                username: self.email,
                                password: self.password
                            }
                        });
                    }
                }
            });

            self.tryToRegister = function () {
                self.addActionId = self.bidderActions.add({
                    firstname: self.firstname,
                    lastname: self.lastname,
                    companyName: self.companyName,
                    email: self.email,
                    confirmEmail: self.confirmEmail,
                    password: self.password,
                    bidderType: self.bidderType
                });
            };

            self.dispose = function () {
                self.dispatcher.removeListener({ id: self.listenerId });
            }

            return self;
        },
        styles: [
            "  .bidderRegistrationForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; }",
            " .bidderRegistrationForm-categories { margin-bottom:15px; }",
            " .bidderRegistrationForm-categories select { ",
            "   line-height: 30px; ",
            "   height: 30px; ",
            "   border: 1px solid #575656 ",
            "   padding-left: 7px ",
            "   text-align: left; ",
            "   width: 220px; ",
            " } ",
            " .bidderRegistrationForm-categories span { margin-bottom:7px; display:block; } ",
            " .bidderRegistrationForm { padding-bottom: 30px; } "
        ],
        providers: [
            "bidderActions",
            "bidderStore",
            "dispatcher"
        ],
        template: [
            "<form class='bidderRegistrationForm' name='bidderRegistrationForm'>",
            "   <text-form-control placeholder='vm.firstnamePlaceholder' model='vm.firstname' ></text-form-control>",
            "   <text-form-control placeholder='vm.lastnamePlaceholder' model='vm.lastname' ></text-form-control>",
            "   <text-form-control placeholder='vm.companyNamePlaceholder' model='vm.companyName' ></text-form-control>",
            "   <text-form-control placeholder='vm.emailPlaceholder' model='vm.email' ></text-form-control>",
            "   <text-form-control placeholder='vm.confirmEmailPlaceholder' model='vm.confirmEmail'></text-form-control>",
            "   <text-form-control placeholder='vm.passwordPlaceholder' model='vm.password'></text-form-control>",

            "   <div class='bidderRegistrationForm-categories'> ",
            "       <span>Choose a category: </span>",
            "       <select data-ng-model='vm.bidderType' data-ng-init='vm.bidderType = vm.bidderStore.types[0].value'",
            "           data-ng-options='type.value as type.displayName for type in vm.bidderStore.types'> ",
            "       </select>",
            "   </div> ",

            "   <button data-ng-click='vm.tryToRegister()'>Register</button>",
            "</form>"
        ]
    });
})();