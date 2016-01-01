(function () {

    "use strict";

    function actionAsync($q, dispatcher) {
        this.invoke = function (options) {
            if (angular.isFunction(options)) { options = { action: options } };
            var deferred = $q.defer();
            var actionId = options.action();
            var listenerId = dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (callbackOptions) {
                    if (actionId === callbackOptions.id) {
                        dispatcher.removeListener({ id: listenerId });
                        deferred.resolve();
                    }
                }
            });
            return deferred.promise;
        }
    }
    angular.module("app").service("actionAsync", ["$q","dispatcher",actionAsync]);
})();