(function () {

    "use strict";

    function ReportAnIssueComponent($location, dispatcher, messageActions, MESSAGE_TYPE) {
        var self = this;
        self.$location = $location;
        self.dispatcher = dispatcher;
        self.messageActions = messageActions;
        self.MESSAGE_TYPE = MESSAGE_TYPE;

        self.subject = null;
        self.content = null;
        self.listenerId = null;

        self.subjectPlaceholder = "Subject";
        self.contentPlaceholder = "Content";

        self.tryToReport = function () {
            self.actionId = self.messageActions.add({
                subject: self.subject,
                content: self.content,
                messageType: self.MESSAGE_TYPE.ISSUE
            })
        }

        self.listenerId = self.dispatcher.addListener({
            actionType: "CHANGE",
            callback: function (options) {
                if (self.actionId === options.id) {
                    alert("Issue Reported!");
                    self.$location.path("/myprofile");
                }
            }
        });

        self.deactivate = function () {
            self.dispatcher.removeListener({ id: self.listenerId });
        }

        return self;
    }

    ngX.Component({
        component: ReportAnIssueComponent,
        route: "/reportanissue",
        providers: ["$location","dispatcher", "messageActions", "MESSAGE_TYPE"],
        template: [
            "<div class='reportAnIssue viewComponent'>",
            "   <text-form-control placeholder='vm.subjectPlaceholder' model='vm.subject' ></text-form-control>",
            "   <text-area-form-control placeholder='vm.contentPlaceholder' model='vm.content' ></text-area-form-control>",
            "   <button data-ng-click='vm.tryToReport()'>Report</button>",
            "</div>"
        ].join(" ")
    });

})();