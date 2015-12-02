(function () {

    "use strict";

    function currentProfile($q, bidActions, dispatcher, profileActions, profileStore, PROFILE_TYPE, weddingActions) {
        var self = this;
        self.$q = $q;
        self.bidActions = bidActions;
        self.dispatcher = dispatcher;
        self.profileActions = profileActions;
        self.profileStore = profileStore;
        self.PROFILE_TYPE = PROFILE_TYPE;
        self.weddingActions = weddingActions;


        self.profileType = null;

        self.createInstanceAsync = function () {
            var deferred = self.$q.defer();
            var instance = new currentProfile(self.$q, self.bidActions, self.dispatcher, self.profileActions, self.profileStore, self.PROFILE_TYPE, self.weddingActions);
            instance.currentProfileActionId = self.profileActions.getCurrentProfile();

            instance.listenerId = self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (instance.currentProfileActionId === options.id) {
                        instance.profileType = instance.profileStore.currentProfile.profileType;

                        if (instance.profileType == self.PROFILE_TYPE.CUSTOMER) {
                            self.weddingService.getAllByCustomerId({ id: self.id }).then(function (results) {
                                if (results.length > 0) {
                                    var promises = [];
                                    for (var i = 0; i < results.length; i++) {
                                        promises.push(self.wedding.createInstanceAsync({ data: results[i] }));
                                        self.$q.all(promises).then(function (weddings) {
                                            instance.weddings = weddings;
                                            deferred.resolve(instance);
                                        });
                                    }
                                } else {
                                    deferred.resolve(instance);
                                }
                            });
                        }

                        if (self.PROFILE_TYPE = self.PROFILE_TYPE.CATERER) {
                            //get bids by profile id
                        }
                    }
                }
            });


            return deferred.promise;
        }

        self.onDestroy = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }

    angular.module("app").service("currentProfile", [
        "$q",
        "bidActions",
        "dispatcher",
        "profileActions",
        "profileStore",
        "PROFILE_TYPE",
        "weddingActions",
        currentProfile]);

})();