(function () {

    "use strict";

    function AdminSlideComponent($location) {
        var self = this;
        self.onClick = function () { $location.path(self.href); }
        return self;
    }

    ngX.Component({
        selector: "admin-slide",
        component: AdminSlideComponent,
        providers: [
            '$location'
        ],
        template: [
            "<div class='adminSlide' data-ng-click='vm.onClick()'>",
            "<h1 class='adminSlide-heading'>{{ vm.title }}</h1>",
            "<h1 class='adminSlide-subHeading'>{{ vm.value }}</h1>",
            "</div>"
        ],
        styles: [
            " .adminSlide { ",
            "   position:relative; ",
            "   float:left; ",
            "   width:300px; ",
            "   padding:15px; ",
            "   cursor:pointer; ",
            " } ",

            " .adminSlide-heading, .adminSlide-subHeading { ",
            "   font-family: 'Lato', sans-serif; ",
            " } ",

            " .adminSlide-heading { ",
            "   font-weight:400; ",
            " } "
        ],
        inputs: [
            'title',
            'value',
            'href'
        ]
    });
})();