function messsageFormComponent(messageActions, profileStore) {

    var self = this;

    self.send = function () {
        messageActions.add({
            content: self.content,
            otherProfileId: profileStore.other.id
        });
        self.content = null;
    }

    self.onKeyDown = function (options) {
        if (options.keyCode === 13 && self.content)
            self.send();
    }

    return self;
}

ngX.Component({
    selector: "message-form",
    component: messsageFormComponent,
    template: [
        '<div class="message-form" style="max-width:600px;">',
        '   <input class="message-form-input" placeholder="Send a message" data-ng-model="vm.content" style="display:table-cell; width:80%;"></input>',
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