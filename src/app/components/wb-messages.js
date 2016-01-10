(function () {

    "use strict";

    function MessagesComponent(profile, profileStore) {
        var self = this;

        self.profiles = [];
        for (var i = 0; i < profileStore.otherBidders.length; i++) {
            self.profiles.push(profile.createInstance({ data: profileStore.otherBidders[i] }));
        }

        return self;
    }

    MessagesComponent.canActivate = function () {
        return ["invokeAsync", "profileActions", "profileStore", function (invokeAsync, profileActions, profileStore) {
            return invokeAsync(profileActions.getOtherBidders);
        }];
    }

    ngX.Component({
        component: MessagesComponent,
        priority: 10,
        routes: ["/messages","/messages/:profileId"],
        providers: ["profile","profileStore"],
        template: [
            "<div class='messages'>",
            "   <div data-ng-repeat='profile in vm.profiles'>{{ ::profile.firstname }} {{ ::profile.lastname }}</div>",
            "</div>"
        ]
    });

})();