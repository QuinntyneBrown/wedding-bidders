(function () {

    "use strict";

    function CustomerMyProfileComponent() {
        var self = this;

        return self;
    }

    ngX.Component({
        component: CustomerMyProfileComponent,
        route: "/customer/myprofile",
        providers: [],
        template: [
            "<div class='customerMyProfile viewComponent'>",
            "</div>"
        ].join(" ")
    });

})();