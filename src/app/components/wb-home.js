﻿(function () {

    "use strict";

    function HomeComponent($scope) {
        var self = this;

        self.photos = [
            { imageUrl: "/assets/images/carousel_1.jpg", name: "carousel_1.jpg", title: "bride" },
            { imageUrl: "/assets/images/carousel_2.jpg", name: "carousel_2.jpg", title: "cake" },
            { imageUrl: "/assets/images/carousel_3.jpg", name: "carousel_3.jpg", title: "dress" }
        ];

        return self;
    }

    ngX.Component({
        component: HomeComponent,
        route: "/",
        templateUrl:"/src/app/components/wb-home.html",
        providers: ["$scope"]
    });

})();