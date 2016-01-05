(function () {

    "use strict";

    function PaymentComponent($location, ACCOUNT_STATUS, accountStore, invokeAsync, subscriptionActions) {
        var self = this;
        self.charge = function () {
            invokeAsync({
                action: subscriptionActions.tryToCharge,
                params: { token: self.token }
            }).then(function () {
                if (accountStore.currentAccount.accountStatus === ACCOUNT_STATUS.PAID) {
                    $location.path("/myprofile");
                }
            });
        }
        return self;
    }

    ngX.Component({
        component: PaymentComponent,
        providers: [
            "$location",
            "ACCOUNT_STATUS",
            "accountStore",
            "invokeAsync",
            "subscriptionActions"],
        template: [
            "<div class='paymentComponent viewComponent'>",
            "   <button data-ng-click='vm.charge()'>Charge</button>",
            "</div>"
        ]
    });
})();


