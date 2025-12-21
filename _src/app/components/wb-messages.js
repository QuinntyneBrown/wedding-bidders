(function () {

    "use strict";

    function MessagesComponent(profile, profileStore) {
        var self = this;

        self.profiles = [];
        for (var i = 0; i < profileStore.others.length; i++) {
            self.profiles.push(profile.createInstance({ data: profileStore.others[i] }));
        }

        return self;
    }

    MessagesComponent.canActivate = function () {
        return ["invokeAsync", "profileActions", "profileStore", function (invokeAsync, profileActions, profileStore) {
            return invokeAsync(profileActions.getOthers);
        }];
    };

    ngX.Component({
        component: MessagesComponent,
        priority: 10,
        route: "/messages",
        providers: ["profile","profileStore"],
        template: [
            "<div class='messages viewComponent'>",
            "   <div data-ng-repeat='profile in vm.profiles'>",
            "       <a class='messages-profile-name' href='#/messages/{{ ::profile.id}}'>{{ ::profile.firstname }} {{ ::profile.lastname }}</a>",
            "   </div>",
            "</div>"
        ],
        styles: [
            ' .messages-profile-name { text-decoration:none; color:#000; line-height:1.5em; } '
        ]
    });

})();