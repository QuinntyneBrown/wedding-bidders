(function () {

    "use strict";

    ngX.Component({
        selector:"edit-wedding-form",
        component: function EditWeddingFormComponent(bidderStore, dispatcher, weddingActions) {
            var self = this;
            self.dispatcher = dispatcher;
            self.weddingActions = weddingActions;
            self.bidderStore = bidderStore;
            self.bidderTypes = [];
            for (var i = 0; i < bidderStore.types.length; i++) {
                self.bidderTypes.push(angular.extend(bidderStore.types[i], { checked: false }))
            }
            self.date = Date();
            self.categories = [];
            
            self.numberOfGuests = null;
            self.location = null;
            self.numberOfHours = null;

            self.listenerId = self.dispatcher.addListener({
                actionType: "CHANGE",
                callback: function (options) {
                    if (options && self.addActionId === options.id) {
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
                    numberOfHours: self.numberOfHours,
                    date: self.date,
                    categories: self.categories
                });
            };

            self.dispose = function () {
                self.dispatcher.removeListener({ id: self.listenerId });
            }
            return self;
        },
        providers: ["bidderStore", "dispatcher", "weddingActions"],
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

            "<div class='formControl'>",
            "<date-picker  model='vm.date'></date-picker>",
            "</div>",

            "<div style='padding-bottom:15px;'> ",
            "<label ng-repeat='bidderType in vm.bidderTypes'> ",
            "<input type='checkbox' data-ng-model='bidderType.checked'> {{ bidderType.displayName }} </input> ",
            "</label> ",
            "</div> ",

            "<button data-ng-click='vm.add()'>Create</button>",
            "</form>"
        ].join(" ")
    });


})();