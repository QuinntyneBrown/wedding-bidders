(function () {

    "use strict";

    function ReportAnIssueComponent() {
        var self = this;
        self.subject = null;
        self.description = null;
        self.subjectPlaceholder = "Subject";
        self.descriptionPlaceholder = "Description";
        self.tryToReport = function () {

        }
        return self;
    }

    ngX.Component({
        component: ReportAnIssueComponent,
        route: "/reportanissue",
        providers: [],
        template: [
            "<div class='reportAnIssue viewComponent'>",
            "   <text-form-control placeholder='vm.subjectPlaceholder' model='vm.subject' ></text-form-control>",
            "   <text-area-form-control placeholder='vm.descriptionPlaceholder' model='vm.description' ></text-area-form-control>",
            "   <button data-ng-click='vm.tryToReport()'>Report</button>",
            "</div>"
        ].join(" ")
    });

})();