(function () {

    "use strict";

    function PersonalizeComponent(profileActions, profileStore) {
        var self = this;

        self.onInit = function () {
            if (!profileStore.currentProfile.isPersonalized)
                profileActions.updateIsPersonalizedFlag();
        }


        return self;
    }

    ngX.Component({
        component: PersonalizeComponent,
        providers: ["profileActions", "profileStore"],
        template: [
            "<div class='personalizeComponent viewComponent'>",
            "   <h1>Personalize</h1>",
            "</div>"
        ]
    });
})();


