(function () {

    "use strict";

    function AdminWeddingComponent() {
        var self = this;
        return self;
    }

    ngX.Component({
        component: AdminWeddingComponent,
        selector: "admin-wedding",
        template: [
            "<div class='adminWedding'>",
            "       <h3>Number of Guests:  {{ ::vm.wedding.numberOfGuests }}</h3>",
            "       <h3>Hours:  {{ ::vm.wedding.numberOfHours }}</h3>",
            "       <h3>Location:  {{ ::vm.wedding.location }}</h3>",
            "       <h3>Date:  {{ ::vm.wedding.date }}</h3>",
            "       <button data-ng-click='vm.wedding.delete()'>Delete</a>",            
            "</div>"
        ],
        style: [
            " .adminWedding { ",
            " } "
        ],
        inputs: [
            'wedding'
        ]
    });

})();