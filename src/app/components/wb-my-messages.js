(function () {

    "use strict";

    function MyMessagesComponent(dispatcher, messageStore) {
        var self = this;
        self.dispatcher = dispatcher;
        self.messageStore = messageStore;
        self.messages = self.messageStore.items;

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                self.messages = self.messageStore.items;
                $scope.$digest();
            }
        });

        self.deactivate = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }

    MyMessagesComponent.canActivate = function () {
        return ["$q", "dispatcher","messageActions", function ($q, dispatcher, messageActions) {
            var deferred = $q.defer();
            var actionId = messageActions.getAllForCurrentProfile();
            var listenerId = dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (actionId === options.id) {
                        dispatcher.removeListener({ id: listenerId });
                        deferred.resolve(true);
                    }
                }
            });            
            return deferred.promise;
        }];
    }

    ngX.Component({
        component: MyMessagesComponent,
        route: "/mymessages",
        providers: ["dispatcher","messageStore"],
        template: [
            "<div class='myMessages'>",
            "</div>"
        ].join(" ")
    });

})();