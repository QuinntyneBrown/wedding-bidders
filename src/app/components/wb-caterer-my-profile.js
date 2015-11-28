(function () {

    "use strict";

    function CatererMyProfileComponent() {
        var self = this;

        return self;
    }

    ngX.Component({
        component: CatererMyProfileComponent,
        route: "/caterer/myprofile",
        providers: [],
        template: [
            "<div class='catererMyProfile viewComponent'>",
            "</div>"
        ].join(" ")
    });

})();