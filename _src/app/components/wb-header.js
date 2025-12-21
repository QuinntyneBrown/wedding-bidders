(function () {

    "use strict";

    ngX.Component({
        selector: "wb-header",
        component: function HeaderComponent($location, getFormFactor) {
            var self = this;
            self.getFormFactor = getFormFactor;
            self.goHome = function () { $location.path("/"); };
            return self;
        },
        styles: [
            " .wbHeader { width:100%; height:60px; overflow:hidden; }",
            " .wbHeader-logo { position: relative; float: left; width:243px; margin-left:15px; cursor:pointer; } ",
            " .wbHeader-hamburgerButton { position: relative; float: right; padding-right:15px; padding-top:10px; }  "
        ],
        providers: ['$location', 'getFormFactor'],
        template: [
            "<div class='wbHeader'>",
            "   <div class='wbHeader-logo'>",
            "       <img data-ng-click='vm.goHome()' src='assets/images/logo_universal.jpg' style='margin:0; padding:0; border-image-width:0;'></img>",
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