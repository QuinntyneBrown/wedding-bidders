(function () {

    "use strict";

    function DatePickerComponent() {
        var self = this;

        self.months = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        self.days = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ];
        self.years = [ 2016, 2017, 2018]

        self._month = null;
        self._year = null;
        self._day = null;

        Object.defineProperty(self, "month", {
            "get": function () { return self._month; },
            "set": function (value) { self._month = value; }
        });

        Object.defineProperty(self, "year", {
            "get": function () { return self._year; },
            "set": function (value) { self._year = value; }
        });

        Object.defineProperty(self, "day", {
            "get": function () { return self._day; },
            "set": function (value) { self._day = value; }
        });
        return self;
    }

    ngX.Component({
        selector: "date-picker",
        component: DatePickerComponent,
        providers: [],
        styles: [
            " .datePicker { } "
        ].join(" \n "),
        inputs: ["model"],
        template: [
            "<div class='datePicker'>",
            "   <input type='text' data-ng-model='vm.month'></input>",
            "   <input type='text' data-ng-model='vm.day'></input>",
            "   <input type='text' data-ng-model='vm.year'></input>",
            "</div>"
        ].join(" ")
    });


})();