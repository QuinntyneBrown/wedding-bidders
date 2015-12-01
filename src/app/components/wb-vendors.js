(function () {

    "use strict";

    function VendorsComponent(dispatcher, venderStore) {
        var self = this;

        self.vendors = venderStore.vendors;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.vendors = venderStore.vendors;
            }
        });


        self.deactivate = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }


    VendorsComponent.prototype.canActivate = function () {
        return ["$q", "dispatcher", "vendorActions", function ($q, dispatcher, vendorActions) {
            var deferred = $q.defer();
            var actionIds = [];
            actionIds.push(vendorActions.getAll());

            var listenerId = dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    for (var i = 0; i < actionIds.length; i++) {
                        if (actionIds[i] === options.id) {
                            actionIds.splice(i, 1);
                        }
                    }

                    if (actionIds.length === 0) {
                        dispatcher.removeListener({ id: listenerId });
                        deferred.resolve();
                    }

                }
            });
            return deferred.promise;
        }];
    };

    ngX.Component({
        component: VendorsComponent,
        route: "/vendors",
        providers: ["dispatcher", "venderStore"],
        template: [
            "<div class='vendors'>",
            "<h1>Vendors</h1>",
            "</div>"
        ].join(" ")
    });

})();


