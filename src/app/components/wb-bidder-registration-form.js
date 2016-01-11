(function () {

    "use strict";

    ngX.Component({
        selector: "bidder-registration-form",
        component: function BidderRegistrationFormComponent(bidderActions, bidderStore, dispatcher, invokeAsync) {
            var self = this;
            self.types = bidderStore.types;

            self.tryToRegister = function () {
                invokeAsync({
                    action: bidderActions.add,
                    params: {
                        firstname: self.firstname,
                        lastname: self.lastname,
                        companyName: self.companyName,
                        email: self.email,
                        confirmEmail: self.confirmEmail,
                        password: self.password,
                        bidderType: self.bidderType
                    }
                }).then(function () {
                    dispatcher.emit({
                        actionType: "BIDDER_ADDED", options: {
                            username: self.email,
                            password: self.password
                        }
                    });
                });
            };

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
            "dispatcher",
            "invokeAsync",
        ],
        template: [
            "<form class='bidderRegistrationForm' name='bidderRegistrationForm'>",
            "   <text-form-control placeholder='\"Firstname\"' model='vm.firstname' ></text-form-control>",
            "   <text-form-control placeholder='\"Lastname\"' model='vm.lastname' ></text-form-control>",
            "   <text-form-control placeholder='\"Company Name\"' model='vm.companyName' ></text-form-control>",
            "   <text-form-control placeholder='\"Email\"' model='vm.email' ></text-form-control>",
            "   <text-form-control placeholder='\"Confirm Email\"' model='vm.confirmEmail'></text-form-control>",
            "   <text-form-control placeholder='\"Password\"' model='vm.password'></text-form-control>",

            "   <div class='bidderRegistrationForm-categories'> ",
            "       <span>Choose a category: </span>",
            "       <select data-ng-model='vm.bidderType' data-ng-init='vm.bidderType = vm.types[0].value'",
            "           data-ng-options='type.value as type.displayName for type in vm.types'> ",
            "       </select>",
            "   </div> ",

            "   <button data-ng-click='vm.tryToRegister()'>Register</button>",
            "</form>"
        ]
    });
})();