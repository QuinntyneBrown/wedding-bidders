(function () {

    "use strict";

    function HomeComponent() {
        var self = this;



        return self;
    }

    ngX.Component({
        component: HomeComponent,
        route: "/",
        providers: [],
        template: [
            "<div class='home'>",            
            "</div>"
        ].join(" ")
    });

})();