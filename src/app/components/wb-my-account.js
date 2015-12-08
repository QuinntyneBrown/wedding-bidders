(function () {

    "use strict";

    function MyAccountComponent() {
        var self = this;



        return self;
    }

    ngX.Component({
        component: MyAccountComponent,
        route: "/myaccount",
        providers: [],
        template: [
            "<div class='myAccount'>",
            "</div>"
        ].join(" ")
    });

})();