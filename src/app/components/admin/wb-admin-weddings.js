(function () {

    "use strict";

    function AdminWeddingsComponent(wedding, weddingStore) {
        var self = this;
        self.storeOnChange = function () {
            self.weddings = [];
            for (var i = 0; i < weddingStore.items.length; i++) {
                self.weddings.push(wedding.createInstance({ data: weddingStore.items[i] }));
            }
        }
        return self;
    }

    AdminWeddingsComponent.canActivate = function () {
        return ["$q", "invokeAsync", "weddingActions", function ($q, invokeAsync, weddingActions) {
            return $q.all([
                invokeAsync(weddingActions.getAll)
            ]);
        }]
    }

    ngX.Component({
        component: AdminWeddingsComponent,
        route: "/admin/weddings",
        providers: ['wedding','weddingStore'],
        template: [
            "<div class='adminWeddings viewComponent'>",
            "<admin-wedding wedding='wedding' data-ng-repeat='wedding in vm.weddings'>",
            "</admin-wedding>",
            "</div>"
        ]
    });
})();