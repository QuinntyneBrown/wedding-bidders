function messsageFormComponent(messageActions, profileStore) {

    var self = this;

    self.send = function () {
        messageActions.add({
            content: self.content,
            otherProfileId: profileStore.other.id
        });

        self.content = null;
    }

    return self;
}

ngX.Component({
    selector: "message-form",
    component: messsageFormComponent,
    template: [
        '<div class="message-form" style="width:100%">',
        '   <input class="message-form-input" placeholder="Type a message..." data-ng-model="vm.content"></input>',
        '   <button class="message-form-button" data-ng-click="vm.send()">Send</button>',
        '</div>'
    ],
    styles: [
        ' .message-form-input { ',
        '   width:400px; line-height:1.5em; font-size:1.2em; padding:10px; ',
        ' } ',
        ' .message-form-button { ',
        '   height:40px; margin:0;',
        ' } ',
    ],
    providers: [
        'messageActions', 'profileStore'
    ]
});