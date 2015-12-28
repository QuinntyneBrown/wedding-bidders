(function () {

    "use strict";

    function HomeSlideComponent($scope) {
        var self = this;

        self.onResize = function () {

        }

        return self;
    }

    ngX.Component({
        selector:"home-slide",
        component: HomeSlideComponent,
        inputs: ["photo"],
        styles:[" .homeSlide"].join(" \n "),
        providers:["$scope"],
        template: ["<img src='{{ vm.photo.imageUrl }}' height='450' width='675'></img>"].join(" ")
    });

})();