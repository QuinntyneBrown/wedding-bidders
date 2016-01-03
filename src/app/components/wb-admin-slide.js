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
            "<h1>{{ vm.title }}</h1>",
            "<h1>{{ vm.value }}</h1>",
            "</div>"
        ],
        styles: [
            " .adminSlide { ",
            " } "
        ],
        inputs: [
            'title',
            'value',
            'href'
        ]
    });
})();