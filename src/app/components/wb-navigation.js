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

            self.isCustomer = function () {
                return self.profileStore.currentProfile
                    && self.profileStore.currentProfile.profileType === self.PROFILE_TYPE.CUSTOMER;
            }

            self.isInternal = function () {
                return self.profileStore.currentProfile
                    && self.profileStore.currentProfile.profileType === self.PROFILE_TYPE.INTERNAL;
            }

            self.isBidder = function () {
                return self.profileStore.currentProfile
                    && self.profileStore.currentProfile.profileType !== self.PROFILE_TYPE.CUSTOMER
                    && self.profileStore.currentProfile.profileType !== self.PROFILE_TYPE.INTERNAL;
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

        ],
        providers: ["profileStore", "PROFILE_TYPE", "securityStore"],
        template: [
            "<div class='wbNavigation'>",
            "<a data-ng-if='!vm.isLoggedIn()' href='#/'>HOME</a>",
            "<a data-ng-if='!vm.isLoggedIn()' href='#/about'>ABOUT</a>",
            "<a data-ng-if='vm.isLoggedIn() && vm.isCustomer()' href='#/wedding/create'>SUBMIT WEDDING</a>",            
            "<a data-ng-if='vm.isLoggedIn() && vm.isBidder()' href='#/bids'>BIDS</a>",
            "<a data-ng-if='vm.isLoggedIn() && vm.isBidder()' href='#/weddings'>WEDDINGS</a>",
            "<a data-ng-if='vm.isLoggedIn() && vm.isInternal()' href='#/admin'>DASHBOARD</a>",
            "</div>"
        ]
    });


})();