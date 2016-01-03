(function () {

    "use strict";

    function HomeComponent($scope, safeDigest) {
        var self = this;

        self.onResize = function () {
            if (window.innerWidth < 700) {
                var fullSizeFeaturedRotator = document.querySelectorAll(".homeComponent #featured")[0];
                if (fullSizeFeaturedRotator) {
                    var isolatedScope = angular.element(fullSizeFeaturedRotator).isolateScope();
                    fullSizeFeaturedRotator.parentElement.removeChild(fullSizeFeaturedRotator);
                    isolatedScope.$destroy();
                }
            }
            safeDigest($scope);
        }

        self.photos = [
            { imageUrl: "/assets/images/carousel_1.jpg", name: "carousel_1.jpg", title: "bride" },
            { imageUrl: "/assets/images/carousel_2.jpg", name: "carousel_2.jpg", title: "cake" },
            { imageUrl: "/assets/images/carousel_3.jpg", name: "carousel_3.jpg", title: "dress" },
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
        providers: ["$scope", "safeDigest"],
        styles: [
            ".carousel img { ",
            "   -webkit-filter: blur(1px) grayscale(100%); ",
            "   -ms-filter: blur(1px) grayscale(100%); ",
            "   filter: blur(1px) grayscale(100%);",
            "   opacity:.5;",
            " } ",
            ".carousel img.current, ",
            ".carousel .previous-arrow img, ",
            ".carousel .next-arrow img { ",
            "   -webkit-filter: blur(0px) grayscale(0%); ",
            "   -ms-filter: blur(0px) grayscale(0%); ",
            "   filter:blur(0px) grayscale(0%); ",
            "   opacity:1; ",
            "} "
        ]
    });

})();