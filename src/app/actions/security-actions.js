(function () {

    "use strict";


    function securityActions(dispatcher, formEncode, guid, securityService, SECURITY_ACTIONS) {
        var self = this;

        self.tryToLogin = function (options) {
            var newGuid = guid();            
            securityService.tryToLogin({
                data: {
                    username:options.username,
                    password:options.password
                }
            }).then(function (results) {
                if (results.access_token) {
                    dispatcher.emit({
                        actionType: SECURITY_ACTIONS.LOGIN, options: {
                            token: results.access_token,
                            id: newGuid
                        }
                    });
                } else {
                    dispatcher.emit({
                        actionType: SECURITY_ACTIONS.LOGIN_FAIL, options: {
                            id: newGuid
                        }
                    });
                }
                
            });
            return newGuid;
        };

        self.loginSuccess = function () {
            dispatcher.emit({
                actionType: "LOGIN_SUCCESS"
            });
        }
        return self;
    }

    angular.module("app")
        .service("securityActions", ["dispatcher", "formEncode", "guid", "securityService", "SECURITY_ACTIONS", securityActions])


})();