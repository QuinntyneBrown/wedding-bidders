(function () {

    "use strict";

    ngX.Component({
        selector: "bid-form",
        component: function BidFormComponent(bid) {
            var self = this;
            self.tryToAdd = function () {
                bid.addAsync({
                    weddingId: self.weddingId,
                    price: self.price,
                    description: self.description
                }).then(function () {
                    if(self.successCallback)
                        self.successCallback();
                });
            };
            return self;
        },
        providers: [
            "bid"
        ],
        styles: [
            ".bidForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; } "
        ],
        inputs: [
            "weddingId", "successCallback"
        ],
        template: [
            "<form class='bidForm' name='bidForm'>",
            "   <text-form-control placeholder='\"Price\"' model='vm.price' ></text-form-control>",
            "   <text-area-form-control placeholder='\"Description\"' model='vm.description' ></text-area-form-control>",
            "   <button data-ng-click='vm.tryToAdd()'>Add</button>",
            "</form>"
        ]
    });
})();