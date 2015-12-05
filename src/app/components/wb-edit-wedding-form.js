(function () {

    "use strict";

    ngX.Component({
        selector:"edit-wedding-form",
        component: function EditWeddingFormComponent(dispatcher, weddingActions) {
            var self = this;
            self.dispatcher = dispatcher;
            self.weddingActions = weddingActions;

            self.numberOfGuests = null;
            self.location = null;
            self.numberOfHours = null;

            self.listenerId = self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (self.addActionId === options.id) {
                        self.dispatcher.emit({
                            actionType: "MODEL_ADDED",
                            options: {
                                id: options.data.id
                            }
                        });
                    }
                }
            });

            self.add = function () {
                self.addActionId = self.weddingActions.add({
                    numberOfGuests: self.numberOfGuests,
                    location: self.location,
                    numberOfHours: self.numberOfHours
                });
            };

            self.dispose = function () {
                self.dispatcher.removeListener({ id: self.listenerId });
            }
            return self;
        },
        providers: ["dispatcher", "weddingActions"],
        styles: [
            " .editWeddingForm { } ",
            " .inputField { padding-left: 15px; } ",
            " .formControl input { ",
            " line-height: 30px; ",
            " height: 30px; ",
            " border: 1px solid #575656 ",
            " padding-left: 7px ",
            " text-align: left; ",
            " width: 200px; ",
            "  ",
            " } ",

            " .formControl { margin-bottom: 15px; } ",

            " .editWeddingForm button { background-color:#222; color:#FFF; border: 0px solid; font-size:11px; height:30px; line-height:30px; padding-left:7px; padding-right:7px; width:50px; } "
        ].join(" \n "),
        inputs:["model"],
        template: [
            "<form class='editWeddingForm' name='editWeddingForm'>",

            "<div class='formControl'>",
            "<input class='inputField' type='text' data-ng-model='vm.numberOfGuests' placeholder='Number Of Guests'></input>",
            "</div>",

            "<div class='formControl'>",
            "<input class='inputField' type='text' data-ng-model='vm.location'  placeholder='Location'></input>",
            "</div>",

            "<div class='formControl'>",
            "<input class='inputField' type='text'  data-ng-model='vm.numberOfHours'  placeholder='Number Of Hours'></input>",
            "</div>",

            "<button data-ng-click='vm.add()'>Create</button>",
            "</form>"
        ].join(" ")
    });


})();