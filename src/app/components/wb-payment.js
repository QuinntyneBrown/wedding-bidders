(function () {

    "use strict";

    function PaymentComponent($location, $scope, ACCOUNT_STATUS, accountStore, invokeAsync, subscriptionActions) {
        var self = this;

        $scope.number = '4242-4242-4242-4242';
        $scope.expiry = '12/16';
        $scope.cvc = '999';

        $scope.stripeCallback = function (code, results) {
            self.charge({ token: results.id });
        }

        self.charge = function (options) {
            invokeAsync({
                action: subscriptionActions.tryToCharge,
                params: { token: options.token }
            }).then(function () {
                if (accountStore.currentAccount.accountStatus === ACCOUNT_STATUS.PAID) {
                    $location.path("/myprofile");
                }
            });
        };
        return self;
    }

    ngX.Component({
        route:"/payment",
        component: PaymentComponent,
        providers: [
            "$location",
            "$scope",
            "ACCOUNT_STATUS",
            "accountStore",
            "invokeAsync",
            "subscriptionActions"],
        template: [
            "<div class='paymentComponent viewComponent'>",
            "   <form stripe-form='stripeCallback' name='checkoutForm'>",
            "       <input ng-model='number' placeholder='Card Number' payments-format='card' payments-validate='card' name='card' />",
            "       <input ng-model='expiry' placeholder='Expiration' payments-format='expiry' payments-validate='expiry' name='expiry' />",
            "       <input ng-model='cvc' placeholder='CVC' payments-format='cvc' payments-validate='cvc' name='cvc' />",
            "       <button type='submit'>Submit</button>",
            "   </form>",
            "   <div data-ng-if='checkoutForm.card.$invalid'>Error: invalid card number!</div>",
            "   <div data-ng-if='checkoutForm.expiry.$invalid'>Error: invalid expiry date!</div>",
            "</div>"
        ],
        styles: [
            " .paymentComponent .ng-invalid { color: red; } "
        ]
    });
})();


