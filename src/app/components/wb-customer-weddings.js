(function () {

    "use strict";

    function CustomerWeddingsComponent(customerStore, weddingStore) {
        var self = this;

        self.customerStore = customerStore;
        self.weddingStore = weddingStore;

        self.onInit = function () {
            self.customer = self.customerStore.getCurrentCustomer();
        }

        self.onUpdate = function () {
            self.customer = self.customerStore.getCurrentCustomer();
        }

        self.dispose = function () {
            self.customer = null;
            self.customerStore = null;
            delete self.customer;
            delete self.customerStore;
        }

        return self;
    }

    CustomerWeddingsComponent.prototype.canActivate = function () {
        return ["$q",function($q) {
            var deferred = $q.defer();
            deferred.resolve(true);
            return deferred.promise;
        }];
    }

    ngX.Component({
        component: CustomerWeddingsComponent,
        route: "/myWeddings",
        providers: [
            "customerStore",
            "weddingStore"
        ],
        template: [
            "<div class='customerWeddings'>",
            "</div>"
        ].join(" ")
    });

})();