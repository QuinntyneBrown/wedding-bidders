(function () {

    "use strict";
    
    function messageItemComponent(moment, profileStore) {
        var self = this;
        self.other = profileStore.other;
        self.current = profileStore.currentProfile;
        self.isFromOther = function (message) {
            return message.toProfileId === profileStore.currentProfile.id
                    && message.fromProfileId == profileStore.other.id
        }

        self.isToOther = function (message) {
            return message.fromProfileId === profileStore.currentProfile.id
                    && message.toProfileId == profileStore.other.id
        }

        self.displayDate = function (date) {
            return moment(date).format('MMMM Do YYYY, h:mm:ss a');
        }
        return self;
    }
        
    ngX.Component({
        selector: "message-item",
        component: messageItemComponent,
        styles: [
            ' .message-item { ',
            '   margin-bottom: 15px;',
            ' } ',
            ' .message-item-author span {',
            '   font-size:.8em; color:rgb(125,125,125);',
            ' } ',
            ' .message-item-content span { ',
            '   line-height:2em',
            ' } '
        ],
        template: [
            '<div class="message-item">',
            '   <div class="message-item-content">',
            '       <span>{{ ::vm.message.content }}</span>',
            '   </div>',
            '   <div class="message-item-author">',
            '       <span data-ng-if="vm.isFromOther(vm.message)">{{ ::vm.other.firstname }} : {{ ::vm.displayDate(vm.message.createdDate) }}</span>',
            '       <span data-ng-if="vm.isToOther(vm.message)">{{ ::vm.current.firstname }} : {{ ::vm.displayDate(vm.message.createdDate) }}</span>',
            '   </div>',
            '</div>',
        ],
        inputs: ['message'],
        providers: [
            'moment',
            'profileStore'
        ]
    });
    
})();