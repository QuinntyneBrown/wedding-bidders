(function () {

    "use strict";

    function WeddingItemComponent($element, profileStore, weddingStore) {
        var self = this;        
        self.isCustomer = profileStore.isCustomer;
        self.isBidder = profileStore.isBidder;
        self.isInternal = profileStore.isInternal;
        
        self.getClass = function () {
            if (weddingStore.currentWedding && self.wedding.id === weddingStore.currentWedding.id)
                return 'selected';
            return '';
        }

        return self;
    }

    ngX.Component({
        component: WeddingItemComponent,
        selector: "wedding-item",
        template: [
            "<div class='weddingItem' data-ng-click='vm.wedding.select()' data-ng-class='vm.getClass()'>",
            "       <h3>Number of Guests:  {{ ::vm.wedding.numberOfGuests }}</h3>",
            "       <h3>Hours:  {{ ::vm.wedding.numberOfHours }}</h3>",
            "       <h3>Location:  {{ ::vm.wedding.location }}</h3>",
            "       <h3>Date:  {{ ::vm.wedding.date }}</h3>",
            "       <a href='#/bid/create/{{ ::vm.wedding.id }}' data-ng-if='vm.isBidder()'>Bid</a>",
            "       <h3  data-ng-if='vm.isCustomer()'>Bids:  {{ ::vm.wedding.bids.length }}</h3>",
            "       <br/><br/> ",
            "</div>"
        ],
        providers:[
            '$element', 'profileStore', 'weddingStore'
        ],
        styles: [
            " .weddingItem { ",
            "   cursor:pointer; ",
            "   padding:15px; ",
            " } ",

            " .weddingItem h3 { ",
            "   line-height:30px; ",
            " } ",

            " .weddingItem.selected { ",
            "   background-color:rgb(243,108,129); ",
            "   color:#FFF; ",
            " } "
        ],
        inputs: [
            'wedding'
        ]
    });

})();