(function () {

    "use strict";

    ngX.Component({
        selector: "wb-app",
        component: function AppComponent(requestCounter) {
            var self = this;
            
            self.requestCounter = requestCounter;
            return self;
        },
        providers:["requestCounter"],
        template: [
            "<div class='wbApp'>",
            "   <work-spinner data-ng-if='vm.requestCounter.getRequestCount() > 0'></work-spinner> ",
            "   <wb-header></wb-header>",
            "   <div class='mainContent' data-ng-view>",
            "   </div>",
            "   <wb-footer></wb-footer>",
            "</div>"
        ]
    });
})();