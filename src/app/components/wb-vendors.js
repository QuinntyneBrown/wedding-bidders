(function () {

    "use strict";

    function VendorsComponent(dispatcher, catererStore) {
        var self = this;

        self.allCaterers = catererStore.allCaterers;
        self.dispatcher = dispatcher;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.allCaterers = catererStore.allCaterers;
            }
        });


        self.deactivate = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }


    VendorsComponent.canActivate = function () {
        return ["$q", "dispatcher", "catererActions", function ($q, dispatcher, catererActions) {
            var deferred = $q.defer();
            var actionIds = [];
            actionIds.push(catererActions.getAll());

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
        providers: ["dispatcher", "catererStore"],
        template: [
            "<div class='vendors viewComponent'>",
            "<h1>Vendors</h1> <br/><br/>",

            "   <div data-ng-repeat='caterer in vm.allCaterers'> ",
            "       <h3>Company Name:  {{ ::caterer.companyName }}</h3>",
            "       <h3>Firstname:  {{ ::caterer.firstname }}</h3>",
            "       <h3>Lastname:  {{ ::caterer.lastname }}</h3>",
            "       <a href='#/caterer/{{ ::caterer.id }}'>Profile Page</h3>",
            "       <br/><br/> ",
            "   </div> ",

            "</div>"
        ].join(" ")
    });

})();


