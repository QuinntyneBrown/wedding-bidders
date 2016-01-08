(function () {

    "use strict";

    function MessagesComponent(messageStore) {
        var self = this;


        return self;
    }

    MessagesComponent.canActivate = function () {
        return ["invokeAsync","messageActions", function (invokeAsync, messageActions) {
            return invokeAsync(messageActions.getAllForCurrentProfile);
        }];
    }

    ngX.Component({
        component: MessagesComponent,
        routes: ["/messages","/messages/:profileId"],
        providers: ["messageStore"],
        template: [
            "<div class='messages'>",
            "</div>"
        ]
    });

})();