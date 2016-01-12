(function () {

    "use strict";

    function ReportAnIssueComponent($location, invokeAsync, issueActions) {
        var self = this;
        self.tryToReport = function () {
            invokeAsync({
                action: issueActions.add,
                params: {
                    subject: self.subject,
                    content: self.content
                }
            }).then(function () {
                $location.path("/myprofile");
            });
        }
        return self;
    }

    ngX.Component({
        component: ReportAnIssueComponent,
        route: "/reportanissue",
        providers: ["$location", "invokeAsync", "issueActions"],
        template: [
            "<div class='reportAnIssue viewComponent'>",
            "   <text-form-control placeholder='\"Subject\"' model='vm.subject' ></text-form-control>",
            "   <text-area-form-control placeholder='\"Content\"' model='vm.content' ></text-area-form-control>",
            "   <button data-ng-click='vm.tryToReport()'>Report</button>",
            "</div>"
        ]
    });
})();