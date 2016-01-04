(function () {

    "use strict";

    function ReportAnIssueComponent($location, message, MESSAGE_TYPE) {
        var self = this;
        self.tryToReport = function () {
            message.sendAsync({
                subject: self.subject,
                content: self.content,
                messageType: MESSAGE_TYPE.ISSUE
            }).then(function () {
                $location.path("/myprofile");
            });
        }
        return self;
    }

    ngX.Component({
        component: ReportAnIssueComponent,
        route: "/reportanissue",
        providers: ["$location", "message",  "MESSAGE_TYPE"],
        template: [
            "<div class='reportAnIssue viewComponent'>",
            "   <text-form-control placeholder='\"Subject\"' model='vm.subject' ></text-form-control>",
            "   <text-area-form-control placeholder='\"Content\"' model='vm.content' ></text-area-form-control>",
            "   <button data-ng-click='vm.tryToReport()'>Report</button>",
            "</div>"
        ]
    });
})();