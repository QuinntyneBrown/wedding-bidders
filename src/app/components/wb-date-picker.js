(function () {

    "use strict";

    function DatePickerComponent() {
        var self = this;

        self.months = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        self.days = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31 ];
        self.years = [2015, 2016, 2017, 2018]

        self._month = self.model ? new Date(self.model).getMonth() + 1 : null;
        self._year = self.model ? new Date(self.model).getYear() + 1900 : null;
        self._day = self.model ? new Date(self.model).getDate() : null;
        
        self.updateModel = function () {
            self.model = new Date(self.year, self.month - 1, self.day);
        }

        Object.defineProperty(self, "month", {
            "get": function () { return self._month; },
            "set": function (value) {
                self._month = value;
                self.updateModel();
            }
        });

        Object.defineProperty(self, "year", {
            "get": function () { return self._year; },
            "set": function (value) {
                self._year = value;
                self.updateModel();
            }
        });

        Object.defineProperty(self, "day", {
            "get": function () { return self._day; },
            "set": function (value) {
                self._day = value;
                self.updateModel();
            }
        });
        return self;
    }

    ngX.Component({
        selector: "date-picker",
        component: DatePickerComponent,
        providers: [],
        styles: [
            " .datePicker p { ",
            "   font-size: .6em; ",
            " } ",

            " .datePicker-heading { ",
            "   padding-bottom:7px;",
            " } ",

            " .datePicker select { ",
            "   line-height: 30px; ",
            "   height: 30px; ",
            "   border: 1px solid #575656 ",
            "   padding-left: 7px ",
            "   text-align: left; ",
            " } ",
        ],
        inputs: ["model"],
        template: [
            "<div class='datePicker'>",
            "   <div class='datePicker-heading'> ",
            "       <h2>Select A Date:</h2> ",
            "       <p>(DD/MM/YYYY)</p> ",
            "   </div> ",
            "   <div class='datePicker'>",
            "       <select data-ng-model='vm.day' data-ng-init='vm.day = vm.days[vm.days.indexOf(vm._day)]'",
            "           data-ng-options='d for d in vm.days'> ",
            "       </select>",
            "       <select data-ng-model='vm.month' data-ng-init='vm.month = vm.months[vm.months.indexOf(vm._month)]'",
            "           data-ng-options='m for m in vm.months'> ",
            "       </select>",
            "       <select data-ng-model='vm.year' data-ng-init='vm.year = vm.years[vm.years.indexOf(vm._year)]'",
            "           data-ng-options='y for y in vm.years'> ",
            "       </select>",
            "   </div>",
            "</div>"
        ]
    });


})();