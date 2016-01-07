(function () {

    "use strict";

    ngX.Component({
        selector: "wb-header",
        component: function HeaderComponent($location) {
            var self = this;
            self.goHome = function () { $location.path("/"); };
            return self;
        },
        styles: [
            " .wbHeader { width:100%; height:140px; }",
            " .wbHeader-logo { position: relative; float: left; width:397px; margin-left:30px; cursor:pointer; } ",
            " .wbHeader-hamburgerButton { position: relative; float: right; width:45px; padding-right:15px; margin-top:15px; height:110px; }  "
        ],
        providers:['$location'],
        template: [
            "<div class='wbHeader'>",
            "   <div class='wbHeader-logo'>",
            "       <img data-ng-click='vm.goHome()' src='assets/images/logo_tag_line.jpg' height='125'></img>",
            "   </div>",
            "   <div class='wbHeader-hamburgerButton'>",
            "       <wb-hamburger-button></wb-hamburger-button>",
            "       <div style='clear:both;'></div> ",
            "   </div>",
            "   <div style='clear:both;'></div> ",
            "</div> "
        ]
    });
})();