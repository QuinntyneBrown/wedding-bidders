(function () {

    "use strict";

    ngX.Component({
        selector: "wb-navigation",
        component: function NavigationComponent(appManager, PROFILE_TYPE, securityStore) {

            var self = this;
            self.securityStore = securityStore;
            self.appManager = appManager;
            self.PROFILE_TYPE = PROFILE_TYPE;

            self.isLoggedIn = function () {
                return self.securityStore.token != null;
            }

            self.getProfileType = function () {
                if (self.securityStore.token && self.appManager.currentProfile)
                    return self.appManager.currentProfile.profileType;

                return -1;
            }

            return self;

        },
        styles: [
            " .wbNavigation { height: 100px; text-align: center; } ",

            " .wbNavigation a { text-decoration: none; color: #000; padding-right:7px; padding-left:7px; font-weight:300; } ",

            " .wbNavigation a { transition: all 0.3s; } ",

            " .wbNavigation a:hover { ",
            "   color: #F2C632; ",
            " } "

        ].join(" \n "),
        providers: ["appManager", "PROFILE_TYPE", "securityStore"],
        template: [
            "<div class='wbNavigation'>",
            "<a data-ng-if='!vm.isLoggedIn()' href='#/'>HOME</a>",
            "<a data-ng-if='!vm.isLoggedIn()' href='#/about'>ABOUT</a>",
            "<a data-ng-if='vm.isLoggedIn() && vm.getProfileType() == vm.PROFILE_TYPE.CUSTOMER' href='#/wedding/create'>SUBMIT WEDDING</a>",
            "<a data-ng-if='vm.isLoggedIn() && vm.getProfileType() == vm.PROFILE_TYPE.CUSTOMER' href='#/vendors'>VENDORS</a>",
            "<a data-ng-if='vm.isLoggedIn() && vm.getProfileType() == vm.PROFILE_TYPE.CATERER' href='#/bids'>BIDS</a>",
            "<a data-ng-if='vm.isLoggedIn() && vm.getProfileType() == vm.PROFILE_TYPE.CATERER' href='#/weddings'>WEDDINGS</a>",
            "</div>"
        ].join(" ")
    });


})();