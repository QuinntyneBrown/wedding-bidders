(function () {

    "use strict";

    function currentProfile($injector, $q, bidActions, bidService, dispatcher, profileActions, profileStore, PROFILE_TYPE, weddingActions, weddingService) {
        var self = this;
        self.$injector = $injector;
        self.$q = $q;
        self.bidActions = bidActions;
        self.bidService = bidService;
        self.dispatcher = dispatcher;
        self.profileActions = profileActions;
        self.profileStore = profileStore;
        self.PROFILE_TYPE = PROFILE_TYPE;
        self.weddingActions = weddingActions;
        self.weddingService = weddingService;

        self.profileType = null;

        self.createInstanceAsync = function () {
            var deferred = self.$q.defer();
            var instance = new currentProfile(self.$injector, self.$q, self.bidActions, self.bidService, self.dispatcher, self.profileActions, self.profileStore, self.PROFILE_TYPE, self.weddingActions, self.weddingService);
            instance.currentProfileActionId = self.profileActions.getCurrentProfile();

            instance.listenerId = self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (instance.currentProfileActionId === options.id) {
                        instance.dispatcher.removeListener({ id: instance.listenerId });                        
                        instance.profileType = instance.profileStore.currentProfile.profileType;
                        instance.id = instance.profileStore.currentProfile.id;
                        instance.firstname = instance.profileStore.currentProfile.firstname;
                        instance.lastname = instance.profileStore.currentProfile.lastname;
                        instance.email = instance.profileStore.currentProfile.email;
                        if (instance.profileType == instance.PROFILE_TYPE.CUSTOMER) {
                            instance.weddingService.getAllByCustomerId({ id: instance.id }).then(function (results) {
                                if (results.length > 0) {
                                    var promises = [];
                                    var wedding = instance.$injector.get("wedding");
                                    for (var i = 0; i < results.length; i++)
                                        promises.push(wedding.createInstanceAsync({ data: results[i], includeBids: true }));

                                    self.$q.all(promises).then(function (weddingInstances) {
                                        instance.weddings = weddingInstances;
                                        deferred.resolve(instance);
                                    });
                                } else {
                                    deferred.resolve(instance);
                                }
                            });
                        }

                        if (instance.profileType == instance.PROFILE_TYPE.CATERER) {
                            instance.bidService.getAllByCatererId({ id: instance.id }).then(function (results) {
                                if (results.length > 0) {
                                    var promises = [];
                                    var bid = instance.$injector.get("bid");
                                    for (var i = 0; i < results.length; i++)
                                        promises.push(bid.createInstanceAsync({ data: results[i], includeWedding: true }));

                                    self.$q.all(promises).then(function (bidInstances) {
                                        instance.bids = bidInstances;
                                        deferred.resolve(instance);
                                    });
                                } else {
                                    deferred.resolve(instance);
                                }
                            });
                            
                        }
                    }
                }                    
            });


            return deferred.promise;
        }



        return self;
    }

    angular.module("app").service("currentProfile", [
        "$injector",
        "$q",
        "bidActions",
        "bidService",
        "dispatcher",
        "profileActions",
        "profileStore",
        "PROFILE_TYPE",
        "weddingActions",
        "weddingService",
        currentProfile]);

})();