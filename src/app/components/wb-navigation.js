(function () {

    "use strict";

    ngX.Component({
        selector: "wb-navigation",
        component: function NavigationComponent(profileStore, PROFILE_TYPE, securityStore) {

            var self = this;
            self.securityStore = securityStore;
            self.profileStore = profileStore;
            self.PROFILE_TYPE = PROFILE_TYPE;

            self.isLoggedIn = function () { return self.securityStore.token !== null; }

            self.getProfileType = function () {
                if (self.securityStore.token && self.profileStore.currentProfile)
                    return self.profileStore.currentProfile.profileType;

                return -1;
            }

            return self;

        },
        styles: [
            " .wbNavigation { height: 100px; text-align: center; } ",

            " .wbNavigation a { text-decoration: none; color: #000; padding-right:7px; padding-left:7px; font-weight:300; line-height:28px; } ",

            " .wbNavigation a { transition: all 0.3s; } ",

            " .wbNavigation a:hover { ",
            "   color: #F2C632; ",
            " } "

        ].join(" \n "),
        providers: ["profileStore", "PROFILE_TYPE", "securityStore"],
        template: [
            "<div class='wbNavigation'>",
            "<a data-ng-if='!vm.isLoggedIn()' href='#/'>HOME</a>",
            "<a data-ng-if='!vm.isLoggedIn()' href='#/about'>ABOUT</a>",
            "<a data-ng-if='vm.isLoggedIn() && vm.getProfileType() == vm.PROFILE_TYPE.CUSTOMER' href='#/wedding/create'>SUBMIT WEDDING</a>",            
            "<a data-ng-if='vm.isLoggedIn() && vm.getProfileType() !== vm.PROFILE_TYPE.CUSTOMER' href='#/bids'>BIDS</a>",
            "<a data-ng-if='vm.isLoggedIn() && vm.getProfileType() !== vm.PROFILE_TYPE.CUSTOMER' href='#/weddings'>WEDDINGS</a>",
            "</div>"
        ]
    });


})();