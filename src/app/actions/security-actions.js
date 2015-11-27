(function () {

    "use strict";


    function securityActions(dispatcher, formEncode, guid, securityService, SECURITY_ACTIONS) {
        var self = this;
        self.dispatcher = dispatcher;
        self.SECURITY_ACTIONS = SECURITY_ACTIONS;
        self.tryToLogin = function (options) {
            var newGuid = guid();            
            securityService.tryToLogin({
                data: {
                    username:options.username,
                    password:options.password
                }
            }).then(function (results) {
                self.dispatcher.emit({
                    actionType: self.SECURITY_ACTIONS.LOGIN, options: {
                        token: results.access_token,
                        id: newGuid
                    }
                });                
            });
            return newGuid;
        };
        return self;
    }

    angular.module("app")
        .service("securityActions", ["dispatcher", "formEncode", "guid", "securityService", "SECURITY_ACTIONS", securityActions])


})();