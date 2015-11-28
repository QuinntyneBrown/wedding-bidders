(function () {

    "use strict";

    ngX.Component({
        selector: "bid-form",
        component: function BidFormComponent(bidActions, dispatcher) {
            var self = this;
            self.bidActions = bidActions;
            self.dispatcher = dispatcher;

            self.listenerId = self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (self.addActionId === options.id) {
                        self.dispatcher.emit({
                            actionType: "BID_ADDED", options: {
                                username: self.email,
                                password: self.password
                            }
                        });
                    }
                }
            });

            self.tryToAdd = function () {
                self.addActionId = self.bidActions.add({
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

            self.price = null;
            self.description = null;

            self.descriptionPlaceholder = "Description";
            self.pricePlaceholder = "Price";

            return self;
        },
        providers: [
            "bidActions", "dispatcher"
        ],
        styles: [
            ".bidForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; } "
        ],
        template: [
            "<form class='bidForm' name='bidForm'>",
            "   <text-form-control placeholder='vm.pricePlaceholder' model='vm.price' ></text-form-control>",
            "   <text-area-form-control placeholder='vm.descriptionPlaceholder' model='vm.description' ></text-area-form-control>",
            "   <button data-ng-click='vm.tryToAdd()'>Add</button>",
            "</form>"
        ].join(" ")
    });

})();