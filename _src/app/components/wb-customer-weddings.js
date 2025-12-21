(function () {

    "use strict";

    function CustomerWeddingsComponent($scope, bidStore, customerStore, dispatcher, weddingStore) {
        var self = this;
        self.customerStore = customerStore;
        self.weddingStore = weddingStore;
        self.bidStore = bidStore;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.bids = self.bidStore.items;
                $scope.$digest();
            }
        });
        self.onInit = function () {
            self.customer = self.customerStore.getCurrentCustomer();
        };

        self.onUpdate = function () {
            self.customer = self.customerStore.getCurrentCustomer();
        };

        self.deactivate = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
            self.customer = null;
            self.customerStore = null;
            delete self.customer;
            delete self.customerStore;
        };

        return self;
    }

    CustomerWeddingsComponent.prototype.canActivate = function () {
        return ["$q", function ($q) {
            var deferred = $q.defer();
            deferred.resolve(true);
            return deferred.promise;
        }];
    };

    ngX.Component({
        component: CustomerWeddingsComponent,
        route: "/myWeddings",
        providers: [
            "$scope",
            "bidStore",
            "customerStore",
            "weddingStore"
        ],
        template: [
            "<div class='customerWeddings viewComponent'>",
            "</div>"
        ]
    });

})();