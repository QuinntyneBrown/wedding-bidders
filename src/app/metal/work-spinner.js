(function () {

    "use strict";

    ngX.Component({
        selector: "work-spinner",
        component: function orkSpinnerComponent() { },
        styles: [
            " .workSpinner { ",
            "   position:fixed; ",
            "   z-index:999; ",
            "   top:0; ",
            "   left:0; ",
            "   right:0; ",
            "   bottom:0; ",
            "   width:100%; ",
            "   height:100%; ",
            "   background-color:rgba(0,0,0,.3); ",
            " } ",

            " .workSpinner i { ",
            "   position:fixed; ",
            "   top: 30%; ",
            "   left:50%; ",
            " } "
        ],
        template: [
            "<div class='workSpinner'>",
            "   <i class='fa fa-spinner fa-5x fa-spin'></i>",
            "</div>"
        ]
    });
})();